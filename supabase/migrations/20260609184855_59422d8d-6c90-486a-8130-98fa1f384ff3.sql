
DROP POLICY IF EXISTS "public read released" ON public.feedbacks;
DROP POLICY IF EXISTS "public submit" ON public.feedbacks;

CREATE OR REPLACE FUNCTION public.get_feedback_by_token(_token text)
RETURNS TABLE (id uuid, project_name text, client_name text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT f.id, f.project_name, f.client_name
  FROM public.feedbacks f
  WHERE f.token = _token
    AND f.status = 'released'
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.get_feedback_by_token(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_feedback_by_token(text) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.submit_feedback(
  _token text,
  _client_name text,
  _rating int,
  _testimonial text,
  _allow_publish boolean
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _updated int;
BEGIN
  IF _rating IS NULL OR _rating < 1 OR _rating > 5 THEN
    RAISE EXCEPTION 'invalid rating';
  END IF;
  IF _testimonial IS NULL OR length(btrim(_testimonial)) < 10 THEN
    RAISE EXCEPTION 'invalid testimonial';
  END IF;
  IF _client_name IS NULL OR length(btrim(_client_name)) = 0 THEN
    RAISE EXCEPTION 'invalid name';
  END IF;

  UPDATE public.feedbacks
  SET client_name = left(btrim(_client_name), 120),
      rating = _rating,
      testimonial = left(btrim(_testimonial), 1000),
      allow_publish = COALESCE(_allow_publish, false),
      status = 'received',
      submitted_at = now(),
      updated_at = now()
  WHERE token = _token
    AND status = 'released';

  GET DIAGNOSTICS _updated = ROW_COUNT;
  RETURN _updated > 0;
END;
$$;

REVOKE ALL ON FUNCTION public.submit_feedback(text, text, int, text, boolean) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_feedback(text, text, int, text, boolean) TO anon, authenticated;
