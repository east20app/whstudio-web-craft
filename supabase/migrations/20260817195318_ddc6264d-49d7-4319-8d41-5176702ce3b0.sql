CREATE OR REPLACE FUNCTION public.get_public_settings()
RETURNS TABLE (
  site_name TEXT,
  whatsapp TEXT,
  discord_link TEXT,
  footer_text TEXT,
  author_name TEXT,
  accepting_projects BOOLEAN,
  availability_note TEXT,
  maintenance_mode BOOLEAN,
  maintenance_message TEXT,
  maintenance_eta TEXT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT s.site_name, s.whatsapp, s.discord_link, s.footer_text, s.author_name,
         COALESCE(s.accepting_projects, true), COALESCE(s.availability_note, ''),
         COALESCE(s.maintenance_mode, false), COALESCE(s.maintenance_message, ''),
         COALESCE(s.maintenance_eta, '')
  FROM public.settings s
  ORDER BY s.updated_at
  LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION public.get_public_settings() TO anon, authenticated;