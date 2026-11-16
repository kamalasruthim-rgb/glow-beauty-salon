DROP POLICY IF EXISTS "Public can read service images" ON storage.objects;
CREATE POLICY "Admins can read service images"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'service-images'
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);