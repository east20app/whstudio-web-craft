grant all on public.budget_attachments to service_role;
create table public.builder_wallet_transactions (
 id uuid primary key default gen_random_uuid(), user_id uuid not null,
 kind text not null check(kind in ('opening','generation','refund','purchase')),
 reference_id uuid not null, delta integer not null, balance_after integer not null check(balance_after>=0),
 created_at timestamptz not null default now(), unique(kind,reference_id)
);
grant select on public.builder_wallet_transactions to authenticated;
grant all on public.builder_wallet_transactions to service_role;
alter table public.builder_wallet_transactions enable row level security;
create policy wallet_transactions_own on public.builder_wallet_transactions for select to authenticated using(user_id=(select auth.uid()));
create index builder_transactions_user_date on public.builder_wallet_transactions(user_id,created_at desc);
insert into public.builder_wallet_transactions(user_id,kind,reference_id,delta,balance_after)
 select user_id,'opening',user_id,balance,balance from public.builder_wallets on conflict do nothing;
create function public.builder_wallet_opening() returns trigger language plpgsql security definer set search_path=public as $$
begin
 insert into builder_wallet_transactions(user_id,kind,reference_id,delta,balance_after) values(new.user_id,'opening',new.user_id,new.balance,new.balance) on conflict do nothing;
 return new;
end $$;
create trigger builder_wallet_opening after insert on public.builder_wallets for each row execute function public.builder_wallet_opening();
create table public.builder_checkout_sessions (
 id uuid primary key default gen_random_uuid(), user_id uuid not null,
 order_id uuid not null references public.builder_orders(id) on delete cascade,
 provider_session_id text not null unique, status text not null default 'created' check(status in ('created','paid')),
 created_at timestamptz not null default now(), unique(order_id)
);
grant select on public.builder_checkout_sessions to authenticated;
grant all on public.builder_checkout_sessions to service_role;
alter table public.builder_checkout_sessions enable row level security;
create policy builder_checkout_own on public.builder_checkout_sessions for select to authenticated using(user_id=(select auth.uid()));
create table public.builder_publication_requests (
 id uuid primary key default gen_random_uuid(), user_id uuid not null,
 project_id uuid not null references public.builder_projects(id) on delete cascade,
 generation_id uuid references public.builder_generations(id) on delete set null,
 summary jsonb not null, status text not null default 'requested' check(status in ('requested','contacted','completed')),
 created_at timestamptz not null default now(), unique(user_id,project_id,generation_id)
);
grant select on public.builder_publication_requests to authenticated;
grant all on public.builder_publication_requests to service_role;
alter table public.builder_publication_requests enable row level security;
create policy publication_requests_own_or_admin on public.builder_publication_requests for select to authenticated using(user_id=(select auth.uid()) or (select public.is_admin()));
create index builder_publications_user_date on public.builder_publication_requests(user_id,created_at desc);
create index if not exists builder_projects_user_date on public.builder_projects(user_id,created_at desc);
create index if not exists builder_generations_project_date on public.builder_generations(project_id,created_at desc);
create index if not exists builder_orders_user_date on public.builder_orders(user_id,created_at desc);
create or replace function public.builder_recover(uid uuid) returns integer language plpgsql security definer set search_path=public as $$
declare expired builder_generations; recovered integer:=0; remaining integer;
begin
 insert into builder_wallets(user_id) values(uid) on conflict do nothing;
 perform 1 from builder_wallets where user_id=uid for update;
 for expired in select * from builder_generations where user_id=uid and status='pending' and created_at<now()-interval '15 minutes' for update loop
  update builder_generations set status='error',error='Geração interrompida; crédito devolvido.' where id=expired.id;
  update builder_wallets set balance=balance+1 where user_id=uid returning balance into remaining;
  insert into builder_wallet_transactions(user_id,kind,reference_id,delta,balance_after) values(uid,'refund',expired.id,1,remaining);
  recovered:=recovered+1;
 end loop;
 return recovered;
end $$;
create or replace function public.builder_reserve(uid uuid,pid uuid,gid uuid,brief text) returns jsonb language plpgsql security definer set search_path=public as $$
declare job builder_generations; remaining integer;
begin
 if brief is null or length(btrim(brief))<10 or length(brief)>6000 then raise exception 'Descreva o projeto em 10 a 6.000 caracteres'; end if;
 if not exists(select 1 from builder_projects where id=pid and user_id=uid) then raise exception 'Projeto indisponível'; end if;
 perform builder_recover(uid);
 select balance into remaining from builder_wallets where user_id=uid for update;
 select * into job from builder_generations where id=gid;
 if found then
  if job.user_id<>uid or job.project_id<>pid then raise exception 'Pedido inválido'; end if;
  return to_jsonb(job);
 end if;
 if exists(select 1 from builder_generations where user_id=uid and status='pending') then raise exception 'Uma geração já está em andamento'; end if;
 if (select count(*) from builder_generations where user_id=uid and model is distinct from 'manual' and created_at>now()-interval '1 minute')>=5 then raise exception 'Aguarde um minuto antes de gerar novamente'; end if;
 if remaining<1 then raise exception 'Créditos insuficientes'; end if;
 update builder_wallets set balance=balance-1 where user_id=uid returning balance into remaining;
 insert into builder_generations(id,project_id,user_id,prompt) values(gid,pid,uid,btrim(brief)) returning * into job;
 insert into builder_wallet_transactions(user_id,kind,reference_id,delta,balance_after) values(uid,'generation',gid,-1,remaining);
 return to_jsonb(job);
end $$;
create or replace function public.builder_finish(gid uuid,result jsonb,failure text,used_model text,used_tokens integer) returns void language plpgsql security definer set search_path=public as $$
declare job builder_generations; remaining integer;
begin
 perform 1 from builder_wallets where user_id=(select user_id from builder_generations where id=gid) for update;
 select * into job from builder_generations where id=gid for update;
 if not found or job.status<>'pending' then return; end if;
 if failure is not null then
  update builder_generations set status='error',error=failure where id=gid;
  update builder_wallets set balance=balance+1 where user_id=job.user_id returning balance into remaining;
  insert into builder_wallet_transactions(user_id,kind,reference_id,delta,balance_after) values(job.user_id,'refund',gid,1,remaining);
 else
  if result is null or jsonb_typeof(result->'files') is distinct from 'array' then raise exception 'Resultado inválido'; end if;
  update builder_generations set status='complete',artifact=result,model=used_model,tokens=used_tokens where id=gid;
  update builder_projects set title=left(result->>'title',100) where id=job.project_id;
 end if;
end $$;
create or replace function public.builder_pay(oid uuid,paid_amount integer,paid_currency text) returns void language plpgsql security definer set search_path=public as $$
declare purchase builder_orders; remaining integer;
begin
 select * into purchase from builder_orders where id=oid for update;
 if not found then raise exception 'Pedido inexistente'; end if;
 if purchase.amount<>paid_amount or paid_currency<>'brl' then raise exception 'Pagamento inválido'; end if;
 if purchase.status='paid' then return; end if;
 insert into builder_wallets(user_id) values(purchase.user_id) on conflict do nothing;
 update builder_wallets set balance=balance+purchase.credits where user_id=purchase.user_id returning balance into remaining;
 insert into builder_wallet_transactions(user_id,kind,reference_id,delta,balance_after) values(purchase.user_id,'purchase',oid,purchase.credits,remaining);
 update builder_orders set status='paid' where id=oid;
 update builder_checkout_sessions set status='paid' where order_id=oid;
end $$;
revoke all on function public.builder_recover(uuid),public.builder_wallet_opening(),public.builder_reserve(uuid,uuid,uuid,text),public.builder_finish(uuid,jsonb,text,text,integer),public.builder_pay(uuid,integer,text) from public,anon,authenticated;
grant execute on function public.builder_recover(uuid),public.builder_reserve(uuid,uuid,uuid,text),public.builder_finish(uuid,jsonb,text,text,integer),public.builder_pay(uuid,integer,text) to service_role;
