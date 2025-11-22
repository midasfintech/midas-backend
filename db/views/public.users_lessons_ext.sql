DROP VIEW IF EXISTS public.users_lessons_ext;
CREATE OR REPLACE VIEW public.users_lessons_ext
WITH (security_invoker = on) AS
SELECT
    l.id,
    l.title,
    l.description,
    l.real_life_example,
    l.question,
    l.answers,
    l.correct_answer_index,
    l.chapter_index,
    l.chapter_id,
    (cl.unlocked_at IS NOT NULL) as unlocked,
    (cl.completed_at IS NOT NULL) as completed
FROM
    public.lessons l
LEFT JOIN users_lessons cl ON cl.user_id = auth.uid() AND cl.lesson_id = l.id
