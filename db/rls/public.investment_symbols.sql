ALTER TABLE public.investment_symbols ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can select the investment_symbols"
ON public.investment_symbols
TO authenticated
USING ( true );
