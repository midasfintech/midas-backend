CREATE OR REPLACE FUNCTION add_unlocks()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO public.users_lessons (user_id, lesson_id)
    VALUES (NEW.id, '294da240-f0c5-495b-aa74-e2f8ff3ef2e2')
    ON CONFLICT DO NOTHING;

    IF NEW.knowledge = 'expert' THEN
        INSERT INTO public.users_lessons (user_id, lesson_id)
        SELECT NEW.id, id FROM public.lessons WHERE id != '294da240-f0c5-495b-aa74-e2f8ff3ef2e2'
        ON CONFLICT DO NOTHING;
    END IF;

    RETURN NEW;
END;
$$;
