CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  ai_enabled boolean NOT NULL DEFAULT false,
  ai_enabled_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.profiles TO authenticated;
GRANT UPDATE (ai_enabled, ai_enabled_at, updated_at) ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile read" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "own profile update" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id) VALUES (NEW.id) ON CONFLICT DO NOTHING;
  RETURN NEW;
END $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TABLE public.readings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  question text NOT NULL,
  reversals boolean NOT NULL DEFAULT false,
  cards jsonb NOT NULL,
  interpretation jsonb NOT NULL,
  provider_model text,
  saved boolean NOT NULL DEFAULT false,
  saved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL DEFAULT now() + interval '24 hours'
);
CREATE INDEX readings_user_created ON public.readings (user_id, created_at DESC);
GRANT SELECT, DELETE ON public.readings TO authenticated;
GRANT UPDATE (saved, saved_at) ON public.readings TO authenticated;
GRANT ALL ON public.readings TO service_role;
ALTER TABLE public.readings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own readings read" ON public.readings FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own readings update" ON public.readings FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own readings delete" ON public.readings FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TABLE public.reflections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reading_id uuid NOT NULL UNIQUE REFERENCES public.readings(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  body text NOT NULL DEFAULT '',
  stance text NOT NULL DEFAULT 'unspecified',
  revision integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reflections TO authenticated;
GRANT ALL ON public.reflections TO service_role;
ALTER TABLE public.reflections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own reflections all" ON public.reflections FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id AND EXISTS (SELECT 1 FROM public.readings r WHERE r.id = reading_id AND r.user_id = auth.uid()));

CREATE OR REPLACE FUNCTION public.validate_reflection() RETURNS trigger
LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF length(NEW.body) > 10000 THEN RAISE EXCEPTION 'Reflection too long'; END IF;
  IF NEW.stance NOT IN ('unspecified','resonates','unsure','disagree') THEN RAISE EXCEPTION 'Bad stance'; END IF;
  NEW.updated_at := now();
  IF TG_OP = 'UPDATE' THEN NEW.revision := OLD.revision + 1; END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER reflections_validate BEFORE INSERT OR UPDATE ON public.reflections
FOR EACH ROW EXECUTE FUNCTION public.validate_reflection();