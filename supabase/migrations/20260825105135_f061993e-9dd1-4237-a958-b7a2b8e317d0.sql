REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
DROP FUNCTION IF EXISTS public.completed_booking_count(uuid);

CREATE OR REPLACE FUNCTION public.my_completed_booking_count()
RETURNS integer
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT count(*)::int FROM public.bookings WHERE user_id = auth.uid() AND status = 'completed';
$$;
REVOKE ALL ON FUNCTION public.my_completed_booking_count() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.my_completed_booking_count() TO authenticated;