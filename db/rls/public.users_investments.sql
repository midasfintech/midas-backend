ALTER TABLE public.users_investments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD their own investments"
ON public.users_investments
TO authenticated
USING ( auth.uid() = user_id )
WITH CHECK ( auth.uid() = user_id );
