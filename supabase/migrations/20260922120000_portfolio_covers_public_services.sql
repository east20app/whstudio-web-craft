-- =============================================================
-- Capas de portfólio + leitura pública segura via RPC.
-- Nova migração (não altera as anteriores).
-- =============================================================

-- 1) Imagem de capa no portfólio. O gradiente `color` deixa de ser usado.
ALTER TABLE public.portfolio_projects ADD COLUMN IF NOT EXISTS cover_url TEXT;
ALTER TABLE public.portfolio_projects DROP COLUMN IF EXISTS color;

-- 2) Bucket público de capas (imagens via CDN; gravação só de admin).
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-covers', 'portfolio-covers', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "portfolio covers public read" ON storage.objects;
CREATE POLICY "portfolio covers public read"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'portfolio-covers');

DROP POLICY IF EXISTS "portfolio covers admin all" ON storage.objects;
CREATE POLICY "portfolio covers admin all"
  ON storage.objects
  FOR ALL TO authenticated
  USING (bucket_id = 'portfolio-covers' AND public.is_admin())
  WITH CHECK (bucket_id = 'portfolio-covers' AND public.is_admin());

-- 3) RPC de serviços: dashboard (tabela `services`) → site público.
--    A tabela continua sem SELECT público; só este RPC expõe os ativos.
CREATE OR REPLACE FUNCTION public.get_public_services()
RETURNS TABLE (id UUID, name TEXT, description TEXT, price TEXT)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT s.id, s.name, s.description, s.price
  FROM public.services s
  WHERE s.active
  ORDER BY s.created_at ASC, s.name ASC;
$$;

REVOKE ALL ON FUNCTION public.get_public_services() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_public_services() TO anon, authenticated;

-- 4) RPC de portfólio: apenas projetos publicados, já ordenados.
CREATE OR REPLACE FUNCTION public.get_public_portfolio()
RETURNS TABLE (
  id UUID,
  title TEXT,
  category TEXT,
  description TEXT,
  url TEXT,
  status TEXT,
  tech TEXT[],
  cover_url TEXT,
  published BOOLEAN,
  sort_order INTEGER
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.id, p.title, p.category, p.description, p.url, p.status, p.tech, p.cover_url, p.published, p.sort_order
  FROM public.portfolio_projects p
  WHERE p.published = true
  ORDER BY p.sort_order ASC, p.created_at ASC;
$$;

REVOKE ALL ON FUNCTION public.get_public_portfolio() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_public_portfolio() TO anon, authenticated;