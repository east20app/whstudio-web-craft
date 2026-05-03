
-- Drop generic "all" policies
drop policy if exists "auth full access" on public.budgets;
drop policy if exists "auth full access" on public.clients;
drop policy if exists "auth full access" on public.projects;
drop policy if exists "auth full access" on public.services;
drop policy if exists "auth full access" on public.messages;
drop policy if exists "auth full access" on public.settings;

-- Helper expression: auth.uid() is not null
-- Recriar como políticas explicitas por comando
do $$
declare
  t text;
begin
  foreach t in array array['budgets','clients','projects','services','messages','settings'] loop
    execute format('create policy "auth select" on public.%I for select to authenticated using (true);', t);
    execute format('create policy "auth insert" on public.%I for insert to authenticated with check (auth.uid() is not null);', t);
    execute format('create policy "auth update" on public.%I for update to authenticated using (auth.uid() is not null) with check (auth.uid() is not null);', t);
    execute format('create policy "auth delete" on public.%I for delete to authenticated using (auth.uid() is not null);', t);
  end loop;
end$$;
