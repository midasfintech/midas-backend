ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can select the chapters"
ON public.chapters
TO authenticated
USING ( true );
