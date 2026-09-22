-- =============================================================
-- Serviços com ordenação e ícone + portfólio com destaque.
-- Nova migração (não altera as anteriores).
-- =============================================================

-- 1) Serviços: ordenação manual e ícone de exibição (nome Lucide).
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS sort_order INTEGER NOT NULL DEFAULT 0;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS icon TEXT NOT NULL DEFAULT '';

-- Ordena os serviços seed do site na ordem em que foram criados.
UPDATE public.services s
SET sort_order = t.pos
FROM (VALUES
  ('Criação de Sites', 1),
  ('Bots para Discord', 2),
  ('APIs e Sistemas', 3),
  ('Automação', 4)
) AS t(name, pos)
WHERE s.name = t.name AND s.sort_order = 0;

-- 2) Portfólio: destaque (projeto grande/ritmo do grid).
ALTER TABLE public.portfolio_projects ADD COLUMN IF NOT EXISTS featured BOOLEAN NOT NULL DEFAULT false;

-- Primeiro projeto seed como destaque de exemplo.
UPDATE public.portfolio_projects SET featured = true
WHERE title = 'Serra Delivery' AND featured = false;

-- 3) is_admin(): mantém o fallback por e-mail (back-compat), mas passa a
--    aceitar qualquer usuário marcado como admin no app_metadata do JWT,
--    para o acesso não depender de valores fixos no código.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $function$
  select coalesce(
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    or (auth.jwt() -> 'app_metadata' ->> 'admin')::boolean = true
    or lower(coalesce(auth.jwt() ->> 'email', '')) in ('whgamersc@gmail.com', 'whstudio@whstudio.site'),
    false
  );
$function$;

GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- 4) RPC de serviços: agora expõe ícone e ordenação controlada pelo painel.
CREATE OR REPLACE FUNCTION public.get_public_services()
RETURNS TABLE (id UUID, name TEXT, description TEXT, price TEXT, icon TEXT, sort_order INTEGER)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT s.id, s.name, s.description, s.price, s.icon, s.sort_order
  FROM public.services s
  WHERE s.active
  ORDER BY s.sort_order ASC, s.created_at ASC, s.name ASC;
$$;

REVOKE ALL ON FUNCTION public.get_public_services() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_public_services() TO anon, authenticated;

-- 5) RPC de portfólio: agora também expõe o destaque (thumb grande no grid).
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
  sort_order INTEGER,
  featured BOOLEAN
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.id, p.title, p.category, p.description, p.url, p.status, p.tech, p.cover_url, p.published, p.sort_order, p.featured
  FROM public.portfolio_projects p
  WHERE p.published = true
  ORDER BY p.sort_order ASC, p.created_at ASC;
$$;

REVOKE ALL ON FUNCTION public.get_public_portfolio() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_public_portfolio() TO anon, authenticated;