CREATE TABLE public.gallery_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  caption text,
  storage_path text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.gallery_photos TO authenticated;
GRANT ALL ON public.gallery_photos TO service_role;

ALTER TABLE public.gallery_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Signed-in users can view gallery photos"
  ON public.gallery_photos FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can add their own gallery photos"
  ON public.gallery_photos FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own gallery photos"
  ON public.gallery_photos FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own gallery photos"
  ON public.gallery_photos FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Gallery files are viewable by signed-in users"
  ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'gallery');

CREATE POLICY "Users upload gallery files to their own folder"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'gallery' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users delete their own gallery files"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'gallery' AND (storage.foldername(name))[1] = auth.uid()::text);