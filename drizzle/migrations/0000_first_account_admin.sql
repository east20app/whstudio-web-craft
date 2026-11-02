CREATE TABLE public.user_roles (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
 role text NOT NULL CHECK (role IN ('admin','user')),
 UNIQUE(user_id,role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY own_role_read ON public.user_roles FOR SELECT TO authenticated USING (user_id = (SELECT auth.uid()));
CREATE TABLE public.admin_bootstrap (
 singleton boolean PRIMARY KEY DEFAULT true CHECK (singleton),
 owner_id uuid NOT NULL,
 claimed_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.admin_bootstrap TO service_role;
REVOKE ALL ON public.admin_bootstrap FROM anon, authenticated;
ALTER TABLE public.admin_bootstrap ENABLE ROW LEVEL SECURITY;
CREATE OR REPLACE FUNCTION public.is_admin() RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
 SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin');
$$;
REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
CREATE OR REPLACE FUNCTION public.admin_signup_available() RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
 SELECT NOT EXISTS (SELECT 1 FROM public.admin_bootstrap);
$$;
REVOKE ALL ON FUNCTION public.admin_signup_available() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_signup_available() TO anon, authenticated;
CREATE OR REPLACE FUNCTION public.claim_first_admin() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE claimed integer;
BEGIN
 INSERT INTO public.admin_bootstrap(singleton,owner_id) VALUES (true,NEW.id) ON CONFLICT (singleton) DO NOTHING;
 GET DIAGNOSTICS claimed = ROW_COUNT;
 IF claimed = 1 THEN
  INSERT INTO public.user_roles(user_id,role) VALUES (NEW.id,'admin');
 ELSE
  INSERT INTO public.user_roles(user_id,role) VALUES (NEW.id,'user');
 END IF;
 RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.claim_first_admin() FROM PUBLIC, anon, authenticated;
CREATE TRIGGER whstudio_claim_first_admin AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.claim_first_admin();
DROP POLICY IF EXISTS "admin pelo id" ON public.budgets;
DROP POLICY IF EXISTS "admin pelo id" ON public.clients;
DROP POLICY IF EXISTS "admin pelo id" ON public.feedbacks;
DROP POLICY IF EXISTS "admin pelo id" ON public.messages;
DROP POLICY IF EXISTS "admin pelo id" ON public.projects;
DROP POLICY IF EXISTS "admin pelo id" ON public.services;
DROP POLICY IF EXISTS "admin pelo id" ON public.settings;
ALTER POLICY "Somente administrador" ON public.tickets USING ((SELECT public.is_admin())) WITH CHECK ((SELECT public.is_admin()));
ALTER POLICY "Somente administrador" ON public.ticket_messages USING ((SELECT public.is_admin())) WITH CHECK ((SELECT public.is_admin()));
ALTER POLICY "Somente administrador" ON public.activity_log USING ((SELECT public.is_admin())) WITH CHECK ((SELECT public.is_admin()));