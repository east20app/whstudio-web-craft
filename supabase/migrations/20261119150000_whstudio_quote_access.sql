-- Preserve all rows, restrict direct dashboard access, and expose a narrow write RPC.
DO $$
DECLARE
  target text;
  policy_name text;
BEGIN
  FOREACH target IN ARRAY ARRAY['budgets', 'messages', 'feedbacks'] LOOP
    FOREACH policy_name IN ARRAY ARRAY['auth full access', 'auth select', 'auth insert', 'auth update', 'auth delete', 'admin pelo id', 'Somente administrador'] LOOP
      EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', policy_name, target);
    END LOOP;
    EXECUTE format(
      'CREATE POLICY "Somente administrador" ON public.%I FOR ALL TO authenticated USING ((SELECT public.is_admin())) WITH CHECK ((SELECT public.is_admin()))',
      target
    );
  END LOOP;
END;
$$;

-- Published testimonials are already projected through get_published_feedbacks.
DROP POLICY IF EXISTS "public read published" ON public.feedbacks;

CREATE INDEX IF NOT EXISTS budgets_quote_contact_created_idx
  ON public.budgets (lower(contact), created_at DESC);

CREATE OR REPLACE FUNCTION public.submit_budget_request(
  request_id uuid, client_name text, contact_email text, project_type text,
  features text, requirements text, deadline text, investment text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  detail text;
BEGIN
  client_name := btrim(client_name);
  contact_email := lower(btrim(contact_email));
  project_type := btrim(project_type);
  features := btrim(features);
  requirements := btrim(requirements);
  deadline := btrim(deadline);
  investment := btrim(investment);

  IF request_id IS NULL OR client_name IS NULL OR length(client_name) NOT BETWEEN 2 AND 120
    OR contact_email IS NULL OR length(contact_email) > 254 OR contact_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
    OR project_type IS NULL OR length(project_type) NOT BETWEEN 2 AND 120
    OR features IS NULL OR length(features) NOT BETWEEN 2 AND 1200
    OR requirements IS NULL OR length(requirements) NOT BETWEEN 10 AND 2400
    OR deadline IS NULL OR length(deadline) NOT BETWEEN 2 AND 100
    OR investment IS NULL OR length(investment) NOT BETWEEN 2 AND 100
  THEN
    RAISE EXCEPTION USING ERRCODE = '22023', MESSAGE = 'invalid request';
  END IF;

  detail := concat_ws(E'\n\n', 'Funcionalidades: ' || features, 'Requisitos: ' || requirements,
    'Prazo: ' || deadline, 'Investimento: ' || investment);

  PERFORM pg_advisory_xact_lock(hashtextextended('budget:' || contact_email, 0));
  IF EXISTS (SELECT 1 FROM public.budgets WHERE id = request_id AND client = client_name
      AND contact = contact_email AND service = project_type AND notes = detail) THEN
    RETURN request_id;
  END IF;

  IF (SELECT count(*) FROM public.budgets WHERE lower(contact) = contact_email
      AND created_at > now() - interval '1 hour') >= 3 THEN
    RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'request limit reached';
  END IF;

  INSERT INTO public.budgets (id, client, contact, service, notes)
    VALUES (request_id, client_name, contact_email, project_type, detail);
  RETURN request_id;
END;
$$;

REVOKE ALL ON FUNCTION public.submit_budget_request(uuid, text, text, text, text, text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_budget_request(uuid, text, text, text, text, text, text, text) TO anon, authenticated;
