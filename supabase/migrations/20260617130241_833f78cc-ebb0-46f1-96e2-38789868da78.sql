ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS is_hot boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS notes text;