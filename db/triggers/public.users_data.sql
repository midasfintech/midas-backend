CREATE OR REPLACE TRIGGER add_unlocks_trigger
AFTER UPDATE OF knowledge ON users_data
FOR EACH ROW
EXECUTE FUNCTION add_unlocks();
