ALTER TABLE public.portfolio_projects ADD COLUMN IF NOT EXISTS cover_url TEXT;
ALTER TABLE public.portfolio_projects ADD COLUMN IF NOT EXISTS featured BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.portfolio_projects ALTER COLUMN color SET DEFAULT '';
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS sort_order INTEGER NOT NULL DEFAULT 0;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS icon TEXT NOT NULL DEFAULT '';

DROP POLICY IF EXISTS "portfolio covers public read" ON storage.objects;
CREATE POLICY "portfolio covers public read" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'portfolio-covers');
DROP POLICY IF EXISTS "portfolio covers admin all" ON storage.objects;
CREATE POLICY "portfolio covers admin all" ON storage.objects FOR ALL TO authenticated
  USING (bucket_id = 'portfolio-covers' AND public.is_admin()) WITH CHECK (bucket_id = 'portfolio-covers' AND public.is_admin());

DROP FUNCTION IF EXISTS public.get_public_services();
CREATE FUNCTION public.get_public_services()
RETURNS TABLE (id UUID, name TEXT, description TEXT, price TEXT, icon TEXT, sort_order INTEGER)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT s.id, s.name, s.description, s.price, s.icon, s.sort_order FROM public.services s
  WHERE s.active ORDER BY s.sort_order ASC, s.created_at ASC, s.name ASC;
$$;
REVOKE ALL ON FUNCTION public.get_public_services() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_public_services() TO anon, authenticated;

DROP FUNCTION IF EXISTS public.get_public_portfolio();
CREATE FUNCTION public.get_public_portfolio()
RETURNS TABLE (id UUID, title TEXT, category TEXT, description TEXT, url TEXT, status TEXT, tech TEXT[], cover_url TEXT, published BOOLEAN, sort_order INTEGER, featured BOOLEAN)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT p.id, p.title, p.category, p.description, p.url, p.status, p.tech, p.cover_url, p.published, p.sort_order, p.featured
  FROM public.portfolio_projects p WHERE p.published = true ORDER BY p.sort_order ASC, p.created_at ASC;
$$;
REVOKE ALL ON FUNCTION public.get_public_portfolio() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_public_portfolio() TO anon, authenticated;