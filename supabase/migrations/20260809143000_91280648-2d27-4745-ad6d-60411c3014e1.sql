-- =============================================================
-- 1) is_admin(): função usada pelas policies "Somente administrador".
--    Idempotente; pode rodar no SQL editor sem erros.
-- =============================================================
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from auth.users
    where id = auth.uid()
      and (email = 'whgamersc@gmail.com' or id = 'a65376dd-9bb0-4c21-84be-780d0cb8c79b'::uuid)
  );
$$;

grant execute on function public.is_admin() to authenticated;

-- =============================================================
-- 2) tickets + ticket_messages (painel admin)
-- =============================================================
drop policy if exists "admin full access tickets" on public.tickets;
drop policy if exists "Somente administrador" on public.tickets;
create policy "Somente administrador" on public.tickets
  for all to authenticated
  using ((select public.is_admin()) or (select auth.uid()) = 'a65376dd-9bb0-4c21-84be-780d0cb8c79b'::uuid)
  with check ((select public.is_admin()) or (select auth.uid()) = 'a65376dd-9bb0-4c21-84be-780d0cb8c79b'::uuid);

drop policy if exists "admin full access ticket_messages" on public.ticket_messages;
drop policy if exists "Somente administrador" on public.ticket_messages;
create policy "Somente administrador" on public.ticket_messages
  for all to authenticated
  using ((select public.is_admin()) or (select auth.uid()) = 'a65376dd-9bb0-4c21-84be-780d0cb8c79b'::uuid)
  with check ((select public.is_admin()) or (select auth.uid()) = 'a65376dd-9bb0-4c21-84be-780d0cb8c79b'::uuid);

-- =============================================================
-- 3) activity_log
-- =============================================================
drop policy if exists "Somente administrador" on public.activity_log;
create policy "Somente administrador" on public.activity_log
  for all to authenticated
  using ((select public.is_admin()) or (select auth.uid()) = 'a65376dd-9bb0-4c21-84be-780d0cb8c79b'::uuid)
  with check ((select public.is_admin()) or (select auth.uid()) = 'a65376dd-9bb0-4c21-84be-780d0cb8c79b'::uuid);

-- =============================================================
-- 4) services, clients, projects (o site público não lê via DB)
-- =============================================================
drop policy if exists "auth select" on public.services;
drop policy if exists "auth insert" on public.services;
drop policy if exists "auth update" on public.services;
drop policy if exists "auth delete" on public.services;
drop policy if exists "Somente administrador" on public.services;
create policy "Somente administrador" on public.services
  for all to authenticated
  using ((select public.is_admin()) or (select auth.uid()) = 'a65376dd-9bb0-4c21-84be-780d0cb8c79b'::uuid)
  with check ((select public.is_admin()) or (select auth.uid()) = 'a65376dd-9bb0-4c21-84be-780d0cb8c79b'::uuid);

drop policy if exists "auth select" on public.clients;
drop policy if exists "auth insert" on public.clients;
drop policy if exists "auth update" on public.clients;
drop policy if exists "auth delete" on public.clients;
drop policy if exists "Somente administrador" on public.clients;
create policy "Somente administrador" on public.clients
  for all to authenticated
  using ((select public.is_admin()) or (select auth.uid()) = 'a65376dd-9bb0-4c21-84be-780d0cb8c79b'::uuid)
  with check ((select public.is_admin()) or (select auth.uid()) = 'a65376dd-9bb0-4c21-84be-780d0cb8c79b'::uuid);

drop policy if exists "auth select" on public.projects;
drop policy if exists "auth insert" on public.projects;
drop policy if exists "auth update" on public.projects;
drop policy if exists "auth delete" on public.projects;
drop policy if exists "Somente administrador" on public.projects;
create policy "Somente administrador" on public.projects
  for all to authenticated
  using ((select public.is_admin()) or (select auth.uid()) = 'a65376dd-9bb0-4c21-84be-780d0cb8c79b'::uuid)
  with check ((select public.is_admin()) or (select auth.uid()) = 'a65376dd-9bb0-4c21-84be-780d0cb8c79b'::uuid);

-- =============================================================
-- 5) settings (leitura pública mantida; escrita apenas admin)
-- =============================================================
drop policy if exists "auth select" on public.settings;
drop policy if exists "auth insert" on public.settings;
drop policy if exists "auth update" on public.settings;
drop policy if exists "auth delete" on public.settings;
drop policy if exists "Somente administrador" on public.settings;
create policy "Somente administrador" on public.settings
  for all to authenticated
  using ((select public.is_admin()) or (select auth.uid()) = 'a65376dd-9bb0-4c21-84be-780d0cb8c79b'::uuid)
  with check ((select public.is_admin()) or (select auth.uid()) = 'a65376dd-9bb0-4c21-84be-780d0cb8c79b'::uuid);

-- Garante que a linha singleton de settings exista (corrige PATCH id=eq. quando vazia)
insert into public.settings (site_name)
select 'WH Studio'
where not exists (select 1 from public.settings);
