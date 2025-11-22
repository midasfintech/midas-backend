CREATE TRIGGER create_new_user_trigger
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE PROCEDURE create_new_user();
