CREATE TABLE public.ai_provider_access_state (model text PRIMARY KEY, message text NOT NULL, blocked_at timestamptz NOT NULL DEFAULT now());
GRANT ALL ON public.ai_provider_access_state TO service_role;
ALTER TABLE public.ai_provider_access_state ENABLE ROW LEVEL SECURITY;
COMMENT ON TABLE public.ai_provider_access_state IS 'Server-only terminal provider access denials. Clear the model row only after provider access is restored; fresh reading requests then resume.';