CREATE OR REPLACE FUNCTION unlock_next_lesson()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    lesson_data public.lessons%rowtype;
    next_lesson_id uuid;
    max_chapter_index numeric;
BEGIN
    SELECT * INTO lesson_data FROM lessons
    WHERE id = NEW.lesson_id;

    SELECT COUNT(*) - 1 INTO max_chapter_index FROM lessons
    WHERE chapter_id = lesson_data.chapter_id;

    IF max_chapter_index = lesson_data.chapter_index AND lesson_data.chapter_id = 2 THEN
        RETURN NEW;
    END IF;

    IF max_chapter_index = lesson_data.chapter_index THEN
        SELECT id INTO next_lesson_id FROM lessons
        WHERE chapter_id = lesson_data.chapter_id + 1 AND chapter_index = 0
        LIMIT 1;

        INSERT INTO users_lessons (user_id, lesson_id)
        VALUES (NEW.user_id, next_lesson_id)
        ON CONFLICT DO NOTHING;

        RETURN NEW;
    END IF;

    SELECT id INTO next_lesson_id FROM lessons
    WHERE chapter_id = lesson_data.chapter_id AND chapter_index = lesson_data.chapter_index + 1
    LIMIT 1;

    INSERT INTO users_lessons (user_id, lesson_id)
    VALUES (NEW.user_id, next_lesson_id)
    ON CONFLICT DO NOTHING;

    RETURN NEW;
END;
$$;
