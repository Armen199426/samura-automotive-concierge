-- Grant table privileges (RLS policies still gate row access)
GRANT INSERT ON public.leads TO anon;
GRANT INSERT ON public.leads TO authenticated;
GRANT ALL ON public.leads TO service_role;

-- Re-assert the INSERT policy explicitly
DROP POLICY IF EXISTS "Anyone can insert a lead" ON public.leads;
CREATE POLICY "Anyone can insert a lead"
  ON public.leads
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Ensure RLS stays enabled
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;