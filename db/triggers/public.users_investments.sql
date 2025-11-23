CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.users_investments
FOR EACH ROW EXECUTE PROCEDURE moddatetime(updated_at);
