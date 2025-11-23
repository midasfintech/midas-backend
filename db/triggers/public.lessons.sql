CREATE OR REPLACE TRIGGER unlock_lesson_for_experts_trigger
AFTER INSERT ON lessons
FOR EACH ROW
EXECUTE FUNCTION unlock_lesson_for_experts();

CREATE OR REPLACE TRIGGER unlock_next_lesson_trigger
AFTER UPDATE OF completed_at ON users_lessons
FOR EACH ROW
EXECUTE FUNCTION unlock_next_lesson();
