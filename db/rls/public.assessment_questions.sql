ALTER TABLE public.assessment_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can select the questions"
ON public.assessment_questions
TO authenticated
USING ( true );
