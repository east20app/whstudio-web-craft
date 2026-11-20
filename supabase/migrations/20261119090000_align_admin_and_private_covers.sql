-- Bring installations using the Supabase migration history to the same access model.
lock table auth.users in share row exclusive mode;

create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('admin', 'user')),
  unique (user_id, role)
);
alter table public.user_roles enable row level security;
revoke all on public.user_roles from public, anon, authenticated;
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
drop policy if exists own_role_read on public.user_roles;
create policy own_role_read on public.user_roles for select to authenticated using (user_id = (select auth.uid()));

create table if not exists public.admin_bootstrap (
  singleton boolean primary key default true check (singleton),
  owner_id uuid not null,
  claimed_at timestamptz not null default now()
);
alter table public.admin_bootstrap enable row level security;
revoke all on public.admin_bootstrap from public, anon, authenticated;
grant all on public.admin_bootstrap to service_role;

-- Migrate only roles already assigned via trusted server metadata.
insert into public.user_roles (user_id, role)
select id, 'admin' from auth.users
where raw_app_meta_data->>'role' = 'admin' or raw_app_meta_data->>'admin' = 'true'
on conflict (user_id, role) do nothing;

-- An established installation never reopens signup-based ownership.
insert into public.admin_bootstrap (owner_id)
select u.id from auth.users u
order by exists(select 1 from public.user_roles r where r.user_id = u.id and r.role = 'admin') desc,
  u.created_at, u.id
limit 1
on conflict (singleton) do nothing;

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin');
$$;
revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

create or replace function public.admin_signup_available() returns boolean
language sql stable security definer set search_path = '' as $$
  select not exists (select 1 from public.admin_bootstrap);
$$;
revoke all on function public.admin_signup_available() from public;
grant execute on function public.admin_signup_available() to anon, authenticated;

create or replace function public.claim_first_admin() returns trigger
language plpgsql security definer set search_path = '' as $$
declare claimed integer;
begin
  insert into public.admin_bootstrap (owner_id) values (new.id) on conflict (singleton) do nothing;
  get diagnostics claimed = row_count;
  insert into public.user_roles (user_id, role)
  values (new.id, case when claimed = 1 then 'admin' else 'user' end)
  on conflict (user_id, role) do nothing;
  return new;
end;
$$;
revoke all on function public.claim_first_admin() from public, anon, authenticated;
drop trigger if exists whstudio_claim_first_admin on auth.users;
create trigger whstudio_claim_first_admin after insert on auth.users
for each row execute function public.claim_first_admin();

do $$
declare
  table_name text;
  policy_name text;
begin
  foreach table_name in array array[
    'budgets', 'clients', 'feedbacks', 'messages', 'projects', 'services',
    'settings', 'tickets', 'ticket_messages', 'activity_log'
  ] loop
    foreach policy_name in array array[
      'auth full access', 'auth select', 'auth insert', 'auth update',
      'auth delete', 'admin pelo id', 'Somente administrador'
    ] loop
      execute format('drop policy if exists %I on public.%I', policy_name, table_name);
    end loop;
    execute format(
      'create policy %I on public.%I for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()))',
      'Somente administrador', table_name
    );
  end loop;
end;
$$;

-- Contact messages are submitted publicly while reads and moderation remain restricted.
alter policy "anyone can insert messages" on public.messages to anon, authenticated;
drop policy if exists "portfolio covers public read" on storage.objects;
update storage.buckets set public = false where id = 'portfolio-covers';

drop policy if exists "Public can view published portfolio projects" on public.portfolio_projects;
create policy "Public can view published portfolio projects" on public.portfolio_projects
  for select to anon, authenticated using (published = true);
drop policy if exists "Admin can view portfolio projects" on public.portfolio_projects;
create policy "Admin can view portfolio projects" on public.portfolio_projects
  for select to authenticated using ((select public.is_admin()));