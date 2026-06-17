DROP POLICY IF EXISTS "Anyone can insert a lead" ON public.leads;
CREATE POLICY "Anyone can insert a lead"
  ON public.leads
  FOR INSERT
  TO public
  WITH CHECK (true);
GRANT INSERT ON public.leads TO PUBLIC;