ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can select the lessons"
ON public.lessons
TO authenticated
USING ( true );
