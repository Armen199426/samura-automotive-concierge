
-- Enable pg_net for async HTTP from triggers
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Trigger function: fire an async POST to the edge function with the new lead id
CREATE OR REPLACE FUNCTION public.notify_lead_telegram()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  fn_url text := 'https://zduftrhicuyyfjzbfjbi.supabase.co/functions/v1/send-telegram-lead';
BEGIN
  PERFORM net.http_post(
    url := fn_url,
    headers := jsonb_build_object('Content-Type', 'application/json'),
    body := jsonb_build_object('lead_id', NEW.id)
  );
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Never block the insert if the dispatch itself fails
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS leads_notify_telegram ON public.leads;

CREATE TRIGGER leads_notify_telegram
AFTER INSERT ON public.leads
FOR EACH ROW
EXECUTE FUNCTION public.notify_lead_telegram();
