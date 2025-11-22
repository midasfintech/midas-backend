CREATE OR REPLACE FUNCTION create_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO public.users_data (id, first_name, last_name, date_of_birth, net_monthly_income, monthly_investment_amount, employment)
    VALUES (
        new.id,
        new.raw_user_meta_data->>'first_name',
        new.raw_user_meta_data->>'last_name',
        (new.raw_user_meta_data->>'date_of_birth')::date,
        (new.raw_user_meta_data->>'net_monthly_income')::numeric,
        (new.raw_user_meta_data->>'monthly_investment_amount')::numeric,
        new.raw_user_meta_data->>'employment'
    );
    RETURN NEW;
END;
$$;
