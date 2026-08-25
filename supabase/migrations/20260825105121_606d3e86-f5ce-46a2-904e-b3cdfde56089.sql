CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  phone text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'phone')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TABLE public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  name_xh text,
  category text NOT NULL,
  kind text NOT NULL DEFAULT 'service',
  price numeric(10,2) NOT NULL DEFAULT 0,
  duration_min integer NOT NULL DEFAULT 30,
  description text,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0
);
GRANT SELECT ON public.services TO anon;
GRANT SELECT ON public.services TO authenticated;
GRANT ALL ON public.services TO service_role;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "services_public_read" ON public.services FOR SELECT TO anon, authenticated USING (is_active);

CREATE TABLE public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  appointment_at timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed','completed','cancelled')),
  subtotal numeric(10,2) NOT NULL DEFAULT 0,
  discount numeric(10,2) NOT NULL DEFAULT 0,
  cancellation_fee numeric(10,2) NOT NULL DEFAULT 0,
  total numeric(10,2) NOT NULL DEFAULT 0,
  notes text,
  cancelled_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.bookings TO authenticated;
GRANT ALL ON public.bookings TO service_role;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "bookings_select_own" ON public.bookings FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "bookings_insert_own" ON public.bookings FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "bookings_update_own" ON public.bookings FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.booking_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  service_id uuid REFERENCES public.services(id) ON DELETE SET NULL,
  name text NOT NULL,
  kind text NOT NULL DEFAULT 'service',
  unit_price numeric(10,2) NOT NULL DEFAULT 0,
  qty integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.booking_items TO authenticated;
GRANT ALL ON public.booking_items TO service_role;
ALTER TABLE public.booking_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "booking_items_select_own" ON public.booking_items FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.bookings b WHERE b.id = booking_id AND b.user_id = auth.uid()));
CREATE POLICY "booking_items_insert_own" ON public.booking_items FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.bookings b WHERE b.id = booking_id AND b.user_id = auth.uid()));

CREATE OR REPLACE FUNCTION public.completed_booking_count(_user_id uuid)
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT count(*)::int FROM public.bookings WHERE user_id = _user_id AND status = 'completed';
$$;
GRANT EXECUTE ON FUNCTION public.completed_booking_count(uuid) TO authenticated;

INSERT INTO public.services (slug, name, name_xh, category, kind, price, duration_min, description, sort_order) VALUES
('silk-press','Silk Press','Ukutyityimbisa iinwele','Hair','service',450.00,90,'Wash, blow-dry and silky smooth finish.',1),
('braiding','Knotless Braids','Ukuluka iinwele','Hair','service',700.00,180,'Neat knotless braids, extensions included.',2),
('cornrows','Cornrows','Iikhonrowu','Hair','service',300.00,90,'Classic straight-back cornrows.',3),
('gel-overlay','Gel Overlay Manicure','Iinzipho zegel','Nails','service',280.00,60,'Gel overlay with cuticle care and shaping.',4),
('acrylic-set','Acrylic Full Set','Iinzipho ze-acrylic','Nails','service',420.00,120,'Full acrylic set with your choice of colour.',5),
('pedicure','Spa Pedicure','Ipedicure yespa','Nails','service',320.00,75,'Soak, scrub, massage and polish.',6),
('classic-lashes','Classic Lash Extensions','Iintshiyi eziqhelekileyo','Lashes','service',380.00,90,'Natural one-to-one lash extensions.',7),
('lash-lift','Lash Lift & Tint','Ukuphakamisa iintshiyi','Lashes','service',300.00,60,'Lifted, tinted lashes lasting up to 6 weeks.',8),
('facial','Deep Cleanse Facial','Ukucoca ubuso','Skin','service',400.00,60,'Steam, extraction, mask and moisturiser.',9),
('brow-shape','Brow Shape & Tint','Ukulungisa iinshiyi','Skin','service',180.00,30,'Wax, shape and tint for defined brows.',10),
('bev-tea','Rooibos Tea','Iti yeRooibos','Beverages','beverage',0.00,0,'Complimentary with any appointment.',11),
('bev-coffee','Filter Coffee','Ikofu','Beverages','beverage',0.00,0,'Complimentary with any appointment.',12),
('bev-hot-choc','Hot Chocolate','Itshokoletsi eshushu','Beverages','beverage',0.00,0,'Complimentary with any appointment.',13),
('bev-water','Still Water','Amanzi','Beverages','beverage',0.00,0,'Complimentary with any appointment.',14),
('bev-biscuits','Biscuits','Iibhiskithi','Beverages','beverage',0.00,0,'Complimentary with any appointment.',15);