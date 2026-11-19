-- Serialize replies against closing a ticket. Keep the public token API intact.
CREATE OR REPLACE FUNCTION public.post_ticket_message(_token text, _body text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  ticket_id uuid;
BEGIN
  _body := btrim(_body);
  IF _body IS NULL OR length(_body) NOT BETWEEN 1 AND 5000 THEN
    RAISE EXCEPTION USING ERRCODE = '22023', MESSAGE = 'invalid message';
  END IF;

  SELECT t.id INTO ticket_id
  FROM public.tickets t
  WHERE t.client_token = _token AND t.status <> 'fechado'
  FOR UPDATE;

  IF ticket_id IS NULL THEN
    RETURN false;
  END IF;

  INSERT INTO public.ticket_messages (ticket_id, sender, body)
    VALUES (ticket_id, 'cliente', _body);

  UPDATE public.tickets
  SET status = 'aberto', admin_unread = admin_unread + 1, last_message_at = now()
  WHERE id = ticket_id;

  RETURN true;
END;
$$;

REVOKE ALL ON FUNCTION public.create_ticket(text, text, text, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.get_ticket_by_token(text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.get_ticket_messages(text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.post_ticket_message(text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.post_ticket_message(text, text) TO anon, authenticated;
