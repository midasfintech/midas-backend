CREATE OR REPLACE TRIGGER unlock_lesson_for_experts_trigger
AFTER INSERT ON lessons
FOR EACH ROW
EXECUTE FUNCTION unlock_lesson_for_experts();
