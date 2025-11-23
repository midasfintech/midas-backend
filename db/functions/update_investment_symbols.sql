DROP FUNCTION IF EXISTS update_investment_symbols();
CREATE OR REPLACE FUNCTION update_investment_symbols()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    base_url TEXT;
    service_key TEXT;
    response JSONB;
BEGIN
    select ds.decrypted_secret into service_key
    from vault.decrypted_secrets ds
    where ds.name = 'SUPABASE_SERVICE_KEY';

    if service_key is null then
        raise exception 'Missing SUPABASE_SERVICE_KEY';
    end if;

    select ds.decrypted_secret into base_url
    from vault.decrypted_secrets ds
    where ds.name = 'SUPABASE_URL';

    if base_url is null then
        raise exception 'Missing base_url';
    end if;

    select net.http_post(
        url := base_url || '/functions/v1/update-stock-data',
        headers := jsonb_build_object(
            'Content-Type', 'application/json',
            'Authorization', 'Bearer ' || service_key
        ),
        timeout_milliseconds := 5000
    ) into response;
END;
$$;
