-- Ensure REST / browser inserts work. Without this, PostgREST returns 42501 and HTTP 401:
-- "permission denied for table quiz_analytics" (anon role needs INSERT on the table).

GRANT INSERT ON TABLE public.quiz_analytics TO anon, authenticated;

ALTER TABLE public.quiz_analytics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "quiz_analytics_insert_anon" ON public.quiz_analytics;
CREATE POLICY "quiz_analytics_insert_anon"
  ON public.quiz_analytics
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
