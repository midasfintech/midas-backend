ALTER TABLE public.users_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD their own data"
ON public.users_data
TO authenticated
USING ( auth.uid() = id )
WITH CHECK ( auth.uid() = id )
