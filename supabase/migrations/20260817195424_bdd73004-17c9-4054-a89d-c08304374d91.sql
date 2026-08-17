CREATE OR REPLACE FUNCTION public.get_published_feedbacks(_limit INTEGER DEFAULT 9)
RETURNS TABLE (
  id UUID,
  client_name TEXT,
  project_name TEXT,
  rating INTEGER,
  testimonial TEXT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT f.id, f.client_name, f.project_name, f.rating, f.testimonial
  FROM public.feedbacks f
  WHERE f.status = 'published' AND f.allow_publish = true
  ORDER BY f.submitted_at DESC NULLS LAST
  LIMIT LEAST(COALESCE(_limit, 9), 30);
$$;

GRANT EXECUTE ON FUNCTION public.get_published_feedbacks(INTEGER) TO anon, authenticated;