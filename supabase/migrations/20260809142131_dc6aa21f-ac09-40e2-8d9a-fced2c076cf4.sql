-- Remove policies permissivas (qualquer authenticated tinha acesso total)
DROP POLICY IF EXISTS "admin full access tickets" ON public.tickets;
DROP POLICY IF EXISTS "admin full access ticket_messages" ON public.ticket_messages;

-- Somente administrador (via role no JWT ou id fixo do dono)
CREATE POLICY "Somente administrador" ON public.tickets
  FOR ALL TO authenticated
  USING ((SELECT public.is_admin()) OR (SELECT auth.uid()) = 'a65376dd-9bb0-4c21-84be-780d0cb8c79b'::uuid)
  WITH CHECK ((SELECT public.is_admin()) OR (SELECT auth.uid()) = 'a65376dd-9bb0-4c21-84be-780d0cb8c79b'::uuid);

CREATE POLICY "Somente administrador" ON public.ticket_messages
  FOR ALL TO authenticated
  USING ((SELECT public.is_admin()) OR (SELECT auth.uid()) = 'a65376dd-9bb0-4c21-84be-780d0cb8c79b'::uuid)
  WITH CHECK ((SELECT public.is_admin()) OR (SELECT auth.uid()) = 'a65376dd-9bb0-4c21-84be-780d0cb8c79b'::uuid);

-- Garante que o fluxo público continua apenas via RPCs security definer
REVOKE ALL ON public.tickets FROM anon;
REVOKE ALL ON public.ticket_messages FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tickets TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ticket_messages TO authenticated;
GRANT ALL ON public.tickets TO service_role;
GRANT ALL ON public.ticket_messages TO service_role;