
CREATE TABLE public.feedbacks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token text NOT NULL UNIQUE DEFAULT replace(gen_random_uuid()::text, '-', ''),
  project_id uuid,
  project_name text NOT NULL DEFAULT '',
  client_name text NOT NULL DEFAULT '',
  rating int,
  testimonial text,
  allow_publish boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'released',
  submitted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.feedbacks ENABLE ROW LEVEL SECURITY;

-- Auth full access
CREATE POLICY "auth select" ON public.feedbacks FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth insert" ON public.feedbacks FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "auth update" ON public.feedbacks FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "auth delete" ON public.feedbacks FOR DELETE TO authenticated USING (auth.uid() IS NOT NULL);

-- Public can read published feedbacks (for landing testimonials)
CREATE POLICY "public read published" ON public.feedbacks FOR SELECT TO anon
USING (status = 'published' AND allow_publish = true);

-- Public can read released feedback (to fill the form via token)
CREATE POLICY "public read released" ON public.feedbacks FOR SELECT TO anon
USING (status = 'released');

-- Public can submit (update) a released feedback, transitioning it to received
CREATE POLICY "public submit" ON public.feedbacks FOR UPDATE TO anon
USING (status = 'released')
WITH CHECK (status = 'received');

CREATE TRIGGER trg_feedbacks_updated
BEFORE UPDATE ON public.feedbacks
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
