ALTER TABLE public.settings
  ADD COLUMN IF NOT EXISTS accepting_projects boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS availability_note text NOT NULL DEFAULT 'Agenda cheia no momento. Pode mandar mensagem que eu te aviso quando abrir vaga.';