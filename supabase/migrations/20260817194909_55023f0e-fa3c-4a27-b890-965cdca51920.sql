CREATE TABLE IF NOT EXISTS public.portfolio_projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  url TEXT,
  status TEXT NOT NULL DEFAULT 'online',
  tech TEXT[] NOT NULL DEFAULT '{}',
  color TEXT NOT NULL DEFAULT 'from-blue-500 to-indigo-700',
  published BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.portfolio_projects TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.portfolio_projects TO authenticated;
GRANT ALL ON public.portfolio_projects TO service_role;

ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view published portfolio projects" ON public.portfolio_projects;
CREATE POLICY "Public can view published portfolio projects"
  ON public.portfolio_projects FOR SELECT
  TO anon, authenticated
  USING (published = true OR public.is_admin());

DROP POLICY IF EXISTS "Admin can insert portfolio projects" ON public.portfolio_projects;
CREATE POLICY "Admin can insert portfolio projects"
  ON public.portfolio_projects FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin can update portfolio projects" ON public.portfolio_projects;
CREATE POLICY "Admin can update portfolio projects"
  ON public.portfolio_projects FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin can delete portfolio projects" ON public.portfolio_projects;
CREATE POLICY "Admin can delete portfolio projects"
  ON public.portfolio_projects FOR DELETE
  TO authenticated
  USING (public.is_admin());

CREATE OR REPLACE FUNCTION public.touch_portfolio_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS update_portfolio_projects_updated_at ON public.portfolio_projects;
CREATE TRIGGER update_portfolio_projects_updated_at
  BEFORE UPDATE ON public.portfolio_projects
  FOR EACH ROW EXECUTE FUNCTION public.touch_portfolio_updated_at();

INSERT INTO public.portfolio_projects (title, category, description, url, status, tech, color, sort_order)
SELECT * FROM (VALUES
('Serra Delivery', 'Sistema de delivery', 'Plataforma completa de delivery com cardápio digital, painel administrativo e mapa em tempo real para acompanhar entregadores.', NULL::text, 'em-desenvolvimento', ARRAY['React','Node.js','PostgreSQL','Mapbox'], 'from-orange-500 to-red-600', 1),
('DroxBot', 'Bot Discord + Painel', 'Bot avançado para Discord com painel web próprio: moderação, tickets, economia, ranking e configuração visual.', NULL, 'online', ARRAY['Node.js','Discord.js','React','MongoDB'], 'from-violet-500 to-purple-700', 2),
('Peixe Store', 'Loja digital', 'Loja virtual completa com catálogo, carrinho, checkout e gestão de pedidos.', 'https://peixestore.shop/', 'online', ARRAY['React','Tailwind','Stripe'], 'from-violet-600 to-fuchsia-600', 3),
('Copa Ativa', 'Eventos esportivos', 'Plataforma para gestão de campeonatos, inscrições, tabelas, resultados e ranking de equipes.', NULL, 'online', ARRAY['Next.js','TypeScript','PostgreSQL'], 'from-emerald-500 to-teal-700', 4)
) AS seed(title, category, description, url, status, tech, color, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM public.portfolio_projects);