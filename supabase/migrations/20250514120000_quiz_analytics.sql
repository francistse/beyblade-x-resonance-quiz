-- Beyblade X Resonance quiz analytics (.trae/specs/create-beyblade-resonance-quiz/spec.md)
-- Safe to re-run: table IF NOT EXISTS; policies replaced.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.quiz_analytics (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at timestamp WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  session_id text,
  gender text,
  age_group text,
  zodiac text,
  language text,
  top_match_blade text,
  top_match_type text,
  score_attack integer,
  score_defense integer,
  score_stamina integer,
  user_agent text,
  viewport_width integer
);

-- Align older / partial tables (CREATE TABLE IF NOT EXISTS skips missing columns)
ALTER TABLE public.quiz_analytics ADD COLUMN IF NOT EXISTS session_id text;
ALTER TABLE public.quiz_analytics ADD COLUMN IF NOT EXISTS gender text;
ALTER TABLE public.quiz_analytics ADD COLUMN IF NOT EXISTS age_group text;
ALTER TABLE public.quiz_analytics ADD COLUMN IF NOT EXISTS zodiac text;
ALTER TABLE public.quiz_analytics ADD COLUMN IF NOT EXISTS language text;
ALTER TABLE public.quiz_analytics ADD COLUMN IF NOT EXISTS top_match_blade text;
ALTER TABLE public.quiz_analytics ADD COLUMN IF NOT EXISTS top_match_type text;
ALTER TABLE public.quiz_analytics ADD COLUMN IF NOT EXISTS score_attack integer;
ALTER TABLE public.quiz_analytics ADD COLUMN IF NOT EXISTS score_defense integer;
ALTER TABLE public.quiz_analytics ADD COLUMN IF NOT EXISTS score_stamina integer;
ALTER TABLE public.quiz_analytics ADD COLUMN IF NOT EXISTS user_agent text;
ALTER TABLE public.quiz_analytics ADD COLUMN IF NOT EXISTS viewport_width integer;

COMMENT ON TABLE public.quiz_analytics IS 'Anonymous quiz completion analytics from the Beyblade X Resonance web app';

ALTER TABLE public.quiz_analytics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "quiz_analytics_insert_anon" ON public.quiz_analytics;
CREATE POLICY "quiz_analytics_insert_anon"
  ON public.quiz_analytics
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

GRANT INSERT ON TABLE public.quiz_analytics TO anon, authenticated;
GRANT ALL ON TABLE public.quiz_analytics TO service_role;
