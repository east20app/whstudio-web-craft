create table public.budget_attachments (
  id uuid primary key default gen_random_uuid(),
  budget_id uuid not null references public.budgets(id) on delete cascade,
  filename text not null,
  payload text not null
);
create index budget_attachments_budget_id_idx on public.budget_attachments (budget_id);
alter table public.budget_attachments enable row level security;
revoke all on public.budget_attachments from public, anon, authenticated;
grant select on public.budget_attachments to authenticated;
create policy budget_attachments_admin_read on public.budget_attachments
  for select to authenticated using ((select public.is_admin()));

create function public.submit_budget_request(
  request_id uuid, client_name text, contact_email text, selected_services text[],
  requirements text, budget_range text, deadline text, attachments jsonb
) returns void
language plpgsql security definer set search_path = '' as $$
declare
  item jsonb;
  total_bytes integer := 0;
  file_bytes bytea;
begin
  if request_id is null
    or coalesce(length(btrim(client_name)), 0) not between 2 and 120
    or coalesce(length(contact_email), 0) not between 5 and 254
    or contact_email !~ '^[^[:space:]@]+@[^[:space:]@]+[.][^[:space:]@]+$'
    or coalesce(cardinality(selected_services), 0) not between 1 and 9
    or exists (select 1 from unnest(selected_services) s where coalesce(length(btrim(s)), 0) not between 1 and 120)
    or coalesce(length(btrim(requirements)), 0) not between 20 and 4000
    or coalesce(length(btrim(budget_range)), 0) not between 1 and 100
    or coalesce(length(btrim(deadline)), 0) not between 1 and 100
    or jsonb_typeof(attachments) is distinct from 'array'
  then raise exception 'Dados de orçamento inválidos' using errcode = '22023'; end if;

  if jsonb_array_length(attachments) > 3 or length(attachments::text) > 2800000
  then raise exception 'Anexos excedem o limite' using errcode = '22023'; end if;

  insert into public.budgets (id, client, contact, service, notes)
  values (request_id, btrim(client_name), btrim(contact_email), array_to_string(selected_services, ', '),
    concat('Investimento: ', budget_range, E'\nPrazo: ', deadline, E'\n\n', btrim(requirements)))
  on conflict (id) do nothing;
  if not found then return; end if;

  for item in select value from jsonb_array_elements(attachments) loop
    if coalesce(length(item->>'filename'), 0) not between 1 and 180
      or item->>'filename' !~* '\.(pdf|png|jpe?g)$'
      or coalesce(length(item->>'payload'), 0) = 0
    then raise exception 'Formato de anexo inválido' using errcode = '22023'; end if;
    file_bytes := decode(item->>'payload', 'base64');
    total_bytes := total_bytes + octet_length(file_bytes);
    if total_bytes > 2097152 or not (
      (item->>'filename' ~* '\.pdf$' and substring(file_bytes for 5) = decode('255044462d', 'hex'))
      or (item->>'filename' ~* '\.png$' and substring(file_bytes for 8) = decode('89504e470d0a1a0a', 'hex'))
      or (item->>'filename' ~* '\.jpe?g$' and substring(file_bytes for 3) = decode('ffd8ff', 'hex'))
    ) then raise exception 'Anexo inválido ou maior que o limite' using errcode = '22023'; end if;
    insert into public.budget_attachments (budget_id, filename, payload)
    values (request_id, item->>'filename', item->>'payload');
  end loop;
end;
$$;
revoke all on function public.submit_budget_request(uuid,text,text,text[],text,text,text,jsonb) from public;
grant execute on function public.submit_budget_request(uuid,text,text,text[],text,text,text,jsonb) to anon, authenticated;
