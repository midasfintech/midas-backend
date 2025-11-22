DROP VIEW IF EXISTS public.users_chapters_ext;
CREATE OR REPLACE VIEW public.users_chapters_ext
WITH (security_invoker = on) AS
SELECT
    c.id,
    c.title,
    c.description,
    -- number of lessons in this chapters
    (
        SELECT COUNT(l.id)
        FROM public.lessons l
        WHERE l.chapter_id = c.id
    ) as lessons_count,
    (
        SELECT COUNT(ul.*)
        FROM public.users_lessons ul
        WHERE ul.lesson_id IN (
            SELECT l.id
            FROM public.lessons l
            WHERE l.chapter_id = c.id
        ) AND ul.user_id = auth.uid() AND ul.completed_at IS NOT NULL
    ) as completed_lessons_count,
    COALESCE(
        CASE
            WHEN COUNT(l.id) = 0 THEN false
            WHEN COUNT(l.id) = COUNT(ul.completed_at) THEN true
            ELSE false
        END,
        false
    ) as completed
FROM
    public.chapters c
    LEFT JOIN public.lessons l ON l.chapter_id = c.id
    LEFT JOIN public.users_lessons ul ON ul.lesson_id = l.id AND ul.user_id = auth.uid()
GROUP BY
    c.id, c.title, c.description
ORDER BY
    c.id;
