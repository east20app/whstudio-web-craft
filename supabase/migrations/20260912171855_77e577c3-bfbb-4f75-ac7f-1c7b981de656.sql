CREATE TABLE public.whia_profiles (
  id uuid PRIMARY KEY,
  full_name text NOT NULL DEFAULT '' CHECK (char_length(full_name) <= 120),
  avatar_path text,
  language text NOT NULL DEFAULT 'pt-BR' CHECK (language IN ('pt-BR','en-US','es')),
  theme text NOT NULL DEFAULT 'dark' CHECK (theme IN ('dark','system')),
  send_with_enter boolean NOT NULL DEFAULT true,
  notification_sound boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.whia_profiles TO authenticated;
GRANT ALL ON public.whia_profiles TO service_role;
ALTER TABLE public.whia_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own WHIA profile" ON public.whia_profiles FOR SELECT TO authenticated USING ((SELECT auth.uid()) = id);
CREATE POLICY "Users create own WHIA profile" ON public.whia_profiles FOR INSERT TO authenticated WITH CHECK ((SELECT auth.uid()) = id);
CREATE POLICY "Users update own WHIA profile" ON public.whia_profiles FOR UPDATE TO authenticated USING ((SELECT auth.uid()) = id) WITH CHECK ((SELECT auth.uid()) = id);

CREATE TABLE public.whia_user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role text NOT NULL CHECK (role IN ('admin','support','user')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.whia_user_roles TO authenticated;
GRANT ALL ON public.whia_user_roles TO service_role;
ALTER TABLE public.whia_user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own WHIA roles" ON public.whia_user_roles FOR SELECT TO authenticated USING ((SELECT auth.uid()) = user_id);

CREATE TABLE public.whia_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9-]+$'),
  name text NOT NULL CHECK (char_length(name) <= 80),
  description text NOT NULL DEFAULT '' CHECK (char_length(description) <= 300),
  price_cents integer NOT NULL DEFAULT 0 CHECK (price_cents >= 0),
  monthly_credits integer NOT NULL CHECK (monthly_credits > 0),
  max_file_bytes bigint NOT NULL CHECK (max_file_bytes > 0),
  features jsonb NOT NULL DEFAULT '[]'::jsonb,
  is_popular boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.whia_plans TO anon, authenticated;
GRANT ALL ON public.whia_plans TO service_role;
ALTER TABLE public.whia_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone views active WHIA plans" ON public.whia_plans FOR SELECT TO anon, authenticated USING (is_active = true);

CREATE TABLE public.whia_subscriptions (
  user_id uuid PRIMARY KEY,
  plan_id uuid NOT NULL REFERENCES public.whia_plans(id),
  credits_used integer NOT NULL DEFAULT 0 CHECK (credits_used >= 0),
  period_started_at timestamptz NOT NULL DEFAULT now(),
  period_ends_at timestamptz NOT NULL DEFAULT (now() + interval '30 days'),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','past_due','canceled')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.whia_subscriptions TO authenticated;
GRANT ALL ON public.whia_subscriptions TO service_role;
ALTER TABLE public.whia_subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own WHIA subscription" ON public.whia_subscriptions FOR SELECT TO authenticated USING ((SELECT auth.uid()) = user_id);

CREATE TABLE public.whia_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL DEFAULT 'Nova conversa' CHECK (char_length(title) BETWEEN 1 AND 160),
  mode text NOT NULL DEFAULT 'whia' CHECK (mode IN ('whia','fast','advanced','creative')),
  archived boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.whia_conversations TO authenticated;
GRANT ALL ON public.whia_conversations TO service_role;
ALTER TABLE public.whia_conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own WHIA conversations" ON public.whia_conversations FOR ALL TO authenticated USING ((SELECT auth.uid()) = user_id) WITH CHECK ((SELECT auth.uid()) = user_id);
CREATE INDEX whia_conversations_user_updated_idx ON public.whia_conversations(user_id, updated_at DESC);

CREATE TABLE public.whia_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES public.whia_conversations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  role text NOT NULL CHECK (role IN ('user','assistant','system')),
  content text NOT NULL CHECK (char_length(content) BETWEEN 1 AND 50000),
  status text NOT NULL DEFAULT 'complete' CHECK (status IN ('pending','streaming','complete','error')),
  rating smallint CHECK (rating IN (-1,1)),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.whia_messages TO authenticated;
GRANT ALL ON public.whia_messages TO service_role;
ALTER TABLE public.whia_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own WHIA messages" ON public.whia_messages FOR ALL TO authenticated USING ((SELECT auth.uid()) = user_id) WITH CHECK ((SELECT auth.uid()) = user_id AND EXISTS (SELECT 1 FROM public.whia_conversations c WHERE c.id = conversation_id AND c.user_id = (SELECT auth.uid())));
CREATE INDEX whia_messages_conversation_created_idx ON public.whia_messages(conversation_id, created_at);

CREATE TABLE public.whia_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  conversation_id uuid REFERENCES public.whia_conversations(id) ON DELETE SET NULL,
  storage_path text NOT NULL UNIQUE,
  file_name text NOT NULL CHECK (char_length(file_name) BETWEEN 1 AND 255),
  mime_type text NOT NULL CHECK (mime_type IN ('application/pdf','text/plain','application/vnd.openxmlformats-officedocument.wordprocessingml.document','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','text/csv','image/jpeg','image/png','image/webp')),
  size_bytes bigint NOT NULL CHECK (size_bytes > 0 AND size_bytes <= 26214400),
  status text NOT NULL DEFAULT 'ready' CHECK (status IN ('uploading','processing','ready','error')),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.whia_files TO authenticated;
GRANT ALL ON public.whia_files TO service_role;
ALTER TABLE public.whia_files ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own WHIA files" ON public.whia_files FOR ALL TO authenticated USING ((SELECT auth.uid()) = user_id) WITH CHECK ((SELECT auth.uid()) = user_id);
CREATE INDEX whia_files_user_created_idx ON public.whia_files(user_id, created_at DESC);

CREATE TABLE public.whia_usage_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  conversation_id uuid,
  usage_type text NOT NULL CHECK (usage_type IN ('message','file','image')),
  credits integer NOT NULL CHECK (credits > 0),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.whia_usage_logs TO authenticated;
GRANT ALL ON public.whia_usage_logs TO service_role;
ALTER TABLE public.whia_usage_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own WHIA usage" ON public.whia_usage_logs FOR SELECT TO authenticated USING ((SELECT auth.uid()) = user_id);
CREATE INDEX whia_usage_user_created_idx ON public.whia_usage_logs(user_id, created_at DESC);

CREATE OR REPLACE FUNCTION public.whia_touch_updated_at()
RETURNS trigger LANGUAGE plpgsql SECURITY INVOKER SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
CREATE TRIGGER whia_profiles_updated BEFORE UPDATE ON public.whia_profiles FOR EACH ROW EXECUTE FUNCTION public.whia_touch_updated_at();
CREATE TRIGGER whia_plans_updated BEFORE UPDATE ON public.whia_plans FOR EACH ROW EXECUTE FUNCTION public.whia_touch_updated_at();
CREATE TRIGGER whia_subscriptions_updated BEFORE UPDATE ON public.whia_subscriptions FOR EACH ROW EXECUTE FUNCTION public.whia_touch_updated_at();
CREATE TRIGGER whia_conversations_updated BEFORE UPDATE ON public.whia_conversations FOR EACH ROW EXECUTE FUNCTION public.whia_touch_updated_at();

INSERT INTO public.whia_plans (slug,name,description,price_cents,monthly_credits,max_file_bytes,features,is_popular,sort_order) VALUES
('free','Gratuito','Para conhecer a WHIA e começar a produzir.',0,5000,5242880,'["Acesso à WHIA","5.000 créditos mensais","Conversas essenciais","Arquivos básicos"]',false,1),
('pro','Pro','Mais capacidade para trabalho contínuo.',4990,50000,26214400,'["50.000 créditos mensais","Modos avançados","Arquivos de até 25 MB","Respostas prioritárias","Histórico ampliado"]',true,2),
('business','Business','Operação ampliada para equipes e negócios.',14990,200000,26214400,'["200.000 créditos mensais","Recursos avançados","Prioridade máxima","Gerenciamento de equipe","Suporte dedicado"]',false,3);

CREATE OR REPLACE FUNCTION public.ensure_whia_account(_full_name text DEFAULT '')
RETURNS TABLE(profile_id uuid, plan_slug text, credits_used integer, credits_limit integer)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _uid uuid; _plan public.whia_plans%ROWTYPE;
BEGIN
  _uid := auth.uid();
  IF _uid IS NULL THEN RAISE EXCEPTION 'authentication required'; END IF;
  SELECT * INTO _plan FROM public.whia_plans WHERE slug = 'free' AND is_active = true LIMIT 1;
  IF _plan.id IS NULL THEN RAISE EXCEPTION 'free plan unavailable'; END IF;
  INSERT INTO public.whia_profiles(id, full_name) VALUES (_uid, left(btrim(COALESCE(_full_name,'')),120)) ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.whia_subscriptions(user_id, plan_id) VALUES (_uid, _plan.id) ON CONFLICT (user_id) DO NOTHING;
  INSERT INTO public.whia_user_roles(user_id, role) VALUES (_uid, 'user') ON CONFLICT (user_id, role) DO NOTHING;
  RETURN QUERY SELECT _uid, p.slug, s.credits_used, p.monthly_credits FROM public.whia_subscriptions s JOIN public.whia_plans p ON p.id=s.plan_id WHERE s.user_id=_uid;
END; $$;
REVOKE ALL ON FUNCTION public.ensure_whia_account(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.ensure_whia_account(text) TO authenticated;

CREATE OR REPLACE FUNCTION public.whia_create_conversation(_title text, _mode text DEFAULT 'whia')
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _uid uuid; _id uuid;
BEGIN
  _uid := auth.uid(); IF _uid IS NULL THEN RAISE EXCEPTION 'authentication required'; END IF;
  IF _mode NOT IN ('whia','fast','advanced','creative') THEN RAISE EXCEPTION 'invalid mode'; END IF;
  INSERT INTO public.whia_conversations(user_id,title,mode) VALUES (_uid,left(COALESCE(NULLIF(btrim(_title),''),'Nova conversa'),160),_mode) RETURNING id INTO _id;
  RETURN _id;
END; $$;
REVOKE ALL ON FUNCTION public.whia_create_conversation(text,text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.whia_create_conversation(text,text) TO authenticated;
