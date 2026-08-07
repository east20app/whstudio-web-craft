-- PART 1: maintenance columns on settings
ALTER TABLE public.settings
  ADD COLUMN IF NOT EXISTS maintenance_mode boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS maintenance_message text,
  ADD COLUMN IF NOT EXISTS maintenance_eta text;

-- PART 2: tickets
CREATE TABLE public.tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  name text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  subject text NOT NULL DEFAULT 'Assunto geral',
  status text NOT NULL DEFAULT 'aberto',
  client_token text NOT NULL UNIQUE DEFAULT replace(gen_random_uuid()::text, '-', ''),
  last_message_at timestamptz NOT NULL DEFAULT now(),
  admin_unread integer NOT NULL DEFAULT 0
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.tickets TO authenticated;
GRANT ALL ON public.tickets TO service_role;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin full access tickets" ON public.tickets
  FOR ALL TO authenticated
  USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

CREATE TABLE public.ticket_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id uuid NOT NULL REFERENCES public.tickets(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  sender text NOT NULL DEFAULT 'cliente',
  body text NOT NULL
);

CREATE INDEX ticket_messages_ticket_id_idx ON public.ticket_messages(ticket_id, created_at);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.ticket_messages TO authenticated;
GRANT ALL ON public.ticket_messages TO service_role;
ALTER TABLE public.ticket_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin full access ticket_messages" ON public.ticket_messages
  FOR ALL TO authenticated
  USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

CREATE TRIGGER trg_tickets_updated
  BEFORE UPDATE ON public.tickets
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Public (anon) access strictly through token-scoped security definer RPCs
CREATE OR REPLACE FUNCTION public.create_ticket(_name text, _email text, _subject text, _message text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _token text;
  _id uuid;
BEGIN
  IF _name IS NULL OR length(btrim(_name)) = 0 THEN RAISE EXCEPTION 'invalid name'; END IF;
  IF _email IS NULL OR length(btrim(_email)) < 3 THEN RAISE EXCEPTION 'invalid email'; END IF;

  INSERT INTO public.tickets (name, email, subject, admin_unread)
  VALUES (left(btrim(_name), 120), left(btrim(_email), 320), left(btrim(COALESCE(NULLIF(btrim(_subject), ''), 'Assunto geral')), 160), 0)
  RETURNING id, client_token INTO _id, _token;

  IF _message IS NOT NULL AND length(btrim(_message)) > 0 THEN
    INSERT INTO public.ticket_messages (ticket_id, sender, body)
    VALUES (_id, 'cliente', left(btrim(_message), 5000));
    UPDATE public.tickets SET admin_unread = 1, last_message_at = now() WHERE id = _id;
  END IF;

  RETURN _token;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_ticket_by_token(_token text)
RETURNS TABLE(id uuid, name text, email text, subject text, status text, last_message_at timestamptz, created_at timestamptz)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT t.id, t.name, t.email, t.subject, t.status, t.last_message_at, t.created_at
  FROM public.tickets t
  WHERE t.client_token = _token
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.get_ticket_messages(_token text)
RETURNS TABLE(id uuid, sender text, body text, created_at timestamptz)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT m.id, m.sender, m.body, m.created_at
  FROM public.ticket_messages m
  JOIN public.tickets t ON t.id = m.ticket_id
  WHERE t.client_token = _token
  ORDER BY m.created_at ASC;
$$;

CREATE OR REPLACE FUNCTION public.post_ticket_message(_token text, _body text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _id uuid;
BEGIN
  IF _body IS NULL OR length(btrim(_body)) = 0 THEN RAISE EXCEPTION 'empty message'; END IF;

  SELECT id INTO _id FROM public.tickets WHERE client_token = _token AND status <> 'fechado';
  IF _id IS NULL THEN RETURN false; END IF;

  INSERT INTO public.ticket_messages (ticket_id, sender, body)
  VALUES (_id, 'cliente', left(btrim(_body), 5000));

  UPDATE public.tickets
  SET status = CASE WHEN status = 'fechado' THEN status ELSE 'aberto' END,
      admin_unread = admin_unread + 1,
      last_message_at = now()
  WHERE id = _id;

  RETURN true;
END;
$$;

GRANT EXECUTE ON FUNCTION public.create_ticket(text, text, text, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_ticket_by_token(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_ticket_messages(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.post_ticket_message(text, text) TO anon, authenticated;

-- Realtime
ALTER TABLE public.ticket_messages REPLICA IDENTITY FULL;
ALTER TABLE public.tickets REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.ticket_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.tickets;
ALTER PUBLICATION supabase_realtime ADD TABLE public.settings;