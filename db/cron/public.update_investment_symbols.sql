select cron.schedule('update_investment_symbols', '0 * * * *', 'SELECT public.update_investment_symbols();');
