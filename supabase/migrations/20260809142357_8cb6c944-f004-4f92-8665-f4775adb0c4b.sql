CREATE TABLE public.activity_log (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  actor text NOT NULL DEFAULT '',
  action text NOT NULL,
  entity text NOT NULL DEFAULT '',
  entity_id text,
  details text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.activity_log TO authenticated;
GRANT ALL ON public.activity_log TO service_role;

ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Somente administrador" ON public.activity_log
  FOR ALL TO authenticated
  USING ((SELECT public.is_admin()) OR (SELECT auth.uid()) = 'a65376dd-9bb0-4c21-84be-780d0cb8c79b'::uuid)
  WITH CHECK ((SELECT public.is_admin()) OR (SELECT auth.uid()) = 'a65376dd-9bb0-4c21-84be-780d0cb8c79b'::uuid);

CREATE INDEX activity_log_created_at_idx ON public.activity_log (created_at DESC);