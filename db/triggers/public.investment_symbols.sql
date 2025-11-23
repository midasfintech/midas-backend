CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.investment_symbols
FOR EACH ROW EXECUTE PROCEDURE moddatetime(updated_at);
