DROP POLICY IF EXISTS "Anyone can insert a lead" ON public.leads;
CREATE POLICY "Anyone can insert a lead"
  ON public.leads
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

REVOKE INSERT ON public.leads FROM PUBLIC;
GRANT INSERT ON public.leads TO anon, authenticated;
GRANT ALL ON public.leads TO service_role;

DELETE FROM public.leads WHERE form_name IN ('t','rls_test','rls_test2','rls_test3','rls_test_psql');