CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('admin', 'user')),
  UNIQUE (user_id, role)
);

CREATE TABLE IF NOT EXISTS public.admin_bootstrap (
  singleton boolean PRIMARY KEY DEFAULT true CHECK (singleton),
  owner_id uuid NOT NULL,
  claimed_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_bootstrap ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.user_roles, public.admin_bootstrap FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles, public.admin_bootstrap TO service_role;
DROP POLICY IF EXISTS own_role_read ON public.user_roles;
CREATE POLICY own_role_read ON public.user_roles FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- Only server-managed metadata can transfer a legacy role.
LOCK TABLE auth.users IN SHARE ROW EXCLUSIVE MODE;
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin' FROM auth.users
WHERE raw_app_meta_data ->> 'role' = 'admin' OR raw_app_meta_data -> 'admin' = 'true'::jsonb
ON CONFLICT (user_id, role) DO NOTHING;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM auth.users)
    AND NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin')
    AND NOT EXISTS (SELECT 1 FROM public.admin_bootstrap) THEN
    RAISE EXCEPTION 'Confirm an existing admin through protected auth app metadata before replacing legacy access';
  END IF;
END;
$$;

INSERT INTO public.admin_bootstrap (singleton, owner_id)
SELECT true, user_id FROM public.user_roles WHERE role = 'admin' ORDER BY user_id LIMIT 1
ON CONFLICT (singleton) DO NOTHING;

CREATE OR REPLACE FUNCTION public.is_admin() RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin');
$$;
REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, service_role;

CREATE OR REPLACE FUNCTION public.admin_signup_available() RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$ SELECT NOT EXISTS (SELECT 1 FROM public.admin_bootstrap); $$;
REVOKE ALL ON FUNCTION public.admin_signup_available() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_signup_available() TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.claim_first_admin() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.admin_bootstrap(singleton, owner_id) VALUES (true, NEW.id)
  ON CONFLICT (singleton) DO NOTHING;
  INSERT INTO public.user_roles(user_id, role)
  VALUES (NEW.id, CASE WHEN FOUND THEN 'admin' ELSE 'user' END)
  ON CONFLICT (user_id, role) DO NOTHING;
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.claim_first_admin() FROM PUBLIC, anon, authenticated;
DROP TRIGGER IF EXISTS whstudio_claim_first_admin ON auth.users;
CREATE TRIGGER whstudio_claim_first_admin AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.claim_first_admin();

DO $$
DECLARE
  relation text;
BEGIN
  FOREACH relation IN ARRAY ARRAY['activity_log', 'budgets', 'clients', 'projects', 'services', 'tickets', 'ticket_messages', 'messages', 'feedbacks', 'settings'] LOOP
    EXECUTE format('DROP POLICY IF EXISTS "admin pelo id" ON public.%I', relation);
    EXECUTE format('ALTER POLICY "Somente administrador" ON public.%I USING ((SELECT public.is_admin())) WITH CHECK ((SELECT public.is_admin()))', relation);
  END LOOP;
END;
$$;

REVOKE INSERT, UPDATE, DELETE ON public.activity_log FROM anon, authenticated;

CREATE OR REPLACE FUNCTION public.record_admin_activity() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE record_id text;
BEGIN
  IF auth.uid() IS NULL OR NOT public.is_admin() THEN
    RETURN NULL;
  END IF;
  record_id := CASE WHEN TG_OP = 'DELETE' THEN OLD.id::text ELSE NEW.id::text END;
  INSERT INTO public.activity_log (actor, action, entity, entity_id)
  VALUES (auth.uid()::text, lower(TG_OP), TG_TABLE_NAME, record_id);
  RETURN NULL;
END;
$$;

REVOKE ALL ON FUNCTION public.record_admin_activity() FROM PUBLIC, anon, authenticated;
DO $$
DECLARE relation text;
BEGIN
  FOREACH relation IN ARRAY ARRAY['budgets', 'clients', 'projects', 'services', 'tickets', 'ticket_messages', 'messages', 'feedbacks', 'portfolio_projects', 'settings'] LOOP
    EXECUTE format('CREATE TRIGGER record_admin_activity AFTER INSERT OR UPDATE OR DELETE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.record_admin_activity()', relation);
  END LOOP;
END;
$$;

DROP POLICY IF EXISTS "Public can view published portfolio projects" ON public.portfolio_projects;
CREATE POLICY "Public can view published portfolio projects" ON public.portfolio_projects
  FOR SELECT TO anon, authenticated USING (published);
CREATE POLICY "Admins can view draft portfolio projects" ON public.portfolio_projects
  FOR SELECT TO authenticated USING ((SELECT public.is_admin()));

DROP POLICY IF EXISTS "public can read settings" ON public.settings;
