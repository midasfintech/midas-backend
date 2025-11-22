CREATE OR REPLACE FUNCTION unlock_lesson_for_experts()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Trigger on lessons table: Insert this lesson into users_lessons for each user with knowledge = 'expert'
    INSERT INTO users_lessons (user_id, lesson_id)
    SELECT id, NEW.id
    FROM users_data
    WHERE knowledge = 'expert';

    RETURN NEW;
END;
$$;
