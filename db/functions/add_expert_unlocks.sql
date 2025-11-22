CREATE OR REPLACE FUNCTION add_expert_unlocks()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    IF NEW.knowledge = 'expert' THEN
        INSERT INTO public.users_lessons (user_id, lesson_id)
        SELECT NEW.id, id FROM public.lessons;
    END IF;

    RETURN NEW;
END;
$$;
