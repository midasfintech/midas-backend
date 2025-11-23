ALTER TABLE public.users_lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD their lessons"
ON public.users_lessons
TO authenticated
USING ( auth.uid() = user_id )
WITH CHECK ( auth.uid() = user_id );
