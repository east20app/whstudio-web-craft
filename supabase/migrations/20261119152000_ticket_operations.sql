ALTER TABLE public.tickets
  ADD COLUMN IF NOT EXISTS priority text NOT NULL DEFAULT 'normal'
  CHECK (priority IN ('baixa', 'normal', 'alta', 'urgente'));

CREATE OR REPLACE FUNCTION public.reply_to_ticket(_ticket_id uuid, _message_id uuid, _body text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
DECLARE
  current_status text;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION USING ERRCODE = '42501', MESSAGE = 'admin access required';
  END IF;

  _body := btrim(_body);
  IF _message_id IS NULL OR _body IS NULL OR length(_body) NOT BETWEEN 1 AND 5000 THEN
    RAISE EXCEPTION USING ERRCODE = '22023', MESSAGE = 'invalid message';
  END IF;

  SELECT status INTO current_status FROM public.tickets WHERE id = _ticket_id FOR UPDATE;

  IF EXISTS (
    SELECT 1 FROM public.ticket_messages
    WHERE id = _message_id AND ticket_id = _ticket_id AND sender = 'admin' AND body = _body
  ) THEN
    RETURN true;
  END IF;

  IF current_status IS NULL OR current_status = 'fechado' THEN
    RETURN false;
  END IF;

  INSERT INTO public.ticket_messages (id, ticket_id, sender, body)
    VALUES (_message_id, _ticket_id, 'admin', _body);

  UPDATE public.tickets SET status = 'respondido', last_message_at = now(), admin_unread = 0
    WHERE id = _ticket_id;
  RETURN true;
END;
$$;

REVOKE ALL ON FUNCTION public.reply_to_ticket(uuid, uuid, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.reply_to_ticket(uuid, uuid, text) TO authenticated;
