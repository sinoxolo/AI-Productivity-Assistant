CREATE TABLE public.collab_enquiries (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid,
  brand_name text NOT NULL,
  contact_name text NOT NULL,
  email text NOT NULL,
  phone text,
  platforms text[] NOT NULL DEFAULT '{}',
  package text NOT NULL,
  requirements text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.collab_enquiries TO authenticated;
GRANT ALL ON public.collab_enquiries TO service_role;
ALTER TABLE public.collab_enquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "collab_enquiries_insert_own" ON public.collab_enquiries FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "collab_enquiries_select_own" ON public.collab_enquiries FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE OR REPLACE FUNCTION public.update_updated_at_column() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql SET search_path = public;
CREATE TRIGGER update_collab_enquiries_updated_at BEFORE UPDATE ON public.collab_enquiries FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();