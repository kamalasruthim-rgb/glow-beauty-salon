DROP POLICY IF EXISTS "Anyone can book" ON public.appointments;
DROP POLICY IF EXISTS "appt_insert_any" ON public.appointments;
REVOKE INSERT ON TABLE public.appointments FROM PUBLIC, anon, authenticated;

DROP POLICY IF EXISTS "Anyone submits review" ON public.reviews;
DROP POLICY IF EXISTS "reviews_insert_any" ON public.reviews;
REVOKE INSERT ON TABLE public.reviews FROM PUBLIC, anon, authenticated;