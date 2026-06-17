
CREATE TABLE public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  form_name text,
  page_url text,
  name text,
  phone text,
  email text,
  message text,
  service text,
  vehicle text,
  submission_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  referrer text,
  ip_address text,
  user_agent text,
  status text NOT NULL DEFAULT 'new',
  telegram_sent boolean NOT NULL DEFAULT false,
  telegram_error text
);

GRANT INSERT ON public.leads TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.leads TO authenticated;
GRANT ALL ON public.leads TO service_role;

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Anyone (anon + authenticated) can submit a lead
CREATE POLICY "Anyone can insert a lead"
  ON public.leads FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- No SELECT/UPDATE policies = no client reads; service_role bypasses RLS for the edge function.

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER leads_set_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
