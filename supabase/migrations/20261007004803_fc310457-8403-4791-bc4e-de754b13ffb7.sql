create table if not exists public.builder_projects (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
 title text not null default 'Novo projeto', kind text not null check(kind in ('site','system')), created_at timestamptz not null default now(), backend_url text, backend_key text);
create table if not exists public.builder_wallets(user_id uuid primary key references auth.users(id) on delete cascade, balance integer not null default 2 check(balance>=0));
create table if not exists public.builder_generations(
 id uuid primary key, project_id uuid not null references public.builder_projects(id) on delete cascade,
 user_id uuid not null references auth.users(id) on delete cascade, prompt text not null check(length(prompt)<=6000),
 status text not null default 'pending' check(status in ('pending','complete','error')),
 artifact jsonb, error text, model text, tokens integer, created_at timestamptz not null default now());
create unique index if not exists builder_one_pending on public.builder_generations(user_id) where status='pending';
create table if not exists public.builder_orders(id uuid primary key default gen_random_uuid(),user_id uuid not null references auth.users(id) on delete cascade,amount integer not null,credits integer not null,status text not null default 'created' check(status in ('created','paid')),created_at timestamptz not null default now(),
 constraint builder_orders_package check((credits,amount) in ((5,1000),(15,2500),(40,5900))));
grant select, insert on public.builder_projects to authenticated;
grant update(backend_url,backend_key) on public.builder_projects to authenticated;
grant select on public.builder_wallets, public.builder_generations, public.builder_orders to authenticated;
grant all on public.builder_projects, public.builder_wallets, public.builder_generations, public.builder_orders to service_role;
alter table public.builder_projects enable row level security;
alter table public.builder_wallets enable row level security;
alter table public.builder_generations enable row level security;
alter table public.builder_orders enable row level security;
create policy projects_read on public.builder_projects for select to authenticated using(user_id=auth.uid());
create policy projects_insert on public.builder_projects for insert to authenticated with check(user_id=auth.uid());
create policy projects_update on public.builder_projects for update to authenticated using(user_id=auth.uid()) with check(user_id=auth.uid());
create policy wallet_read on public.builder_wallets for select to authenticated using(user_id=auth.uid());
create policy generations_read on public.builder_generations for select to authenticated using(user_id=auth.uid());
create policy orders_read on public.builder_orders for select to authenticated using(user_id=auth.uid());
create or replace function public.builder_reserve(uid uuid,pid uuid,gid uuid,brief text) returns jsonb language plpgsql security definer set search_path=public as $$
declare job builder_generations; remaining integer; expired integer;
begin
 if not exists(select 1 from builder_projects where id=pid and user_id=uid) then raise exception 'Projeto indisponível'; end if;
 insert into builder_wallets(user_id) values(uid) on conflict do nothing;
 select balance into remaining from builder_wallets where user_id=uid for update;
 update builder_generations set status='error',error='Geração interrompida; crédito devolvido' where user_id=uid and status='pending' and created_at<now()-interval '15 minutes';
 get diagnostics expired = row_count;
 if expired>0 then update builder_wallets set balance=balance+expired where user_id=uid; remaining:=remaining+expired; end if;
 select * into job from builder_generations where id=gid;
 if found then
  if job.user_id<>uid or job.project_id<>pid then raise exception 'Pedido inválido'; end if;
  return to_jsonb(job);
 end if;
 if exists(select 1 from builder_generations where user_id=uid and status='pending') then raise exception 'Uma geração já está em andamento'; end if;
 if remaining<1 then raise exception 'Créditos insuficientes'; end if;
 update builder_wallets set balance=balance-1 where user_id=uid;
 insert into builder_generations(id,project_id,user_id,prompt) values(gid,pid,uid,brief) returning * into job;
 return to_jsonb(job);
end $$;
create or replace function public.builder_finish(gid uuid,result jsonb,failure text,used_model text,used_tokens integer) returns void language plpgsql security definer set search_path=public as $$
declare job builder_generations;
begin
 perform 1 from builder_wallets where user_id=(select user_id from builder_generations where id=gid) for update;
 select * into job from builder_generations where id=gid for update;
 if not found or job.status<>'pending' then return; end if;
 if failure is not null then
  update builder_generations set status='error',error=failure where id=gid;
  update builder_wallets set balance=balance+1 where user_id=job.user_id;
 else
  update builder_generations set status='complete',artifact=result,model=used_model,tokens=used_tokens where id=gid;
  update builder_projects set title=left(result->>'title',100) where id=job.project_id;
 end if;
end $$;
create or replace function public.builder_pay(oid uuid,paid_amount integer,paid_currency text) returns void language plpgsql security definer set search_path=public as $$
declare purchase builder_orders;
begin
 select * into purchase from builder_orders where id=oid for update;
 if not found then raise exception 'Pedido inexistente'; end if;
 if purchase.amount<>paid_amount or paid_currency<>'brl' then raise exception 'Pagamento inválido'; end if;
 if purchase.status='paid' then return; end if;
 insert into builder_wallets(user_id) values(purchase.user_id) on conflict do nothing;
 update builder_wallets set balance=balance+purchase.credits where user_id=purchase.user_id;
 update builder_orders set status='paid' where id=oid;
end $$;
revoke all on function public.builder_reserve(uuid,uuid,uuid,text),public.builder_finish(uuid,jsonb,text,text,integer),public.builder_pay(uuid,integer,text) from public,anon,authenticated;
grant execute on function public.builder_reserve(uuid,uuid,uuid,text),public.builder_finish(uuid,jsonb,text,text,integer),public.builder_pay(uuid,integer,text) to service_role;