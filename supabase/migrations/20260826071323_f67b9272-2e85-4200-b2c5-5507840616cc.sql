CREATE TABLE public.ad_bookings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  business_name text NOT NULL,
  contact_name text NOT NULL,
  email text NOT NULL,
  phone text,
  start_date date NOT NULL,
  end_date date NOT NULL,
  days integer NOT NULL DEFAULT 1,
  daily_rate numeric NOT NULL DEFAULT 500,
  total numeric NOT NULL DEFAULT 500,
  details text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.ad_bookings TO authenticated;
GRANT ALL ON public.ad_bookings TO service_role;
ALTER TABLE public.ad_bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ad_bookings_insert_own" ON public.ad_bookings FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "ad_bookings_select_own" ON public.ad_bookings FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE TRIGGER update_ad_bookings_updated_at BEFORE UPDATE ON public.ad_bookings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
ALTER TABLE public.bookings ADD COLUMN payment_method text NOT NULL DEFAULT 'card';