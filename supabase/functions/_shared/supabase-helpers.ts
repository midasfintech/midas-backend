import {
    createClient as createSupabaseClient,
    SupabaseClient,
} from "https://esm.sh/@supabase/supabase-js@2";

export const createClient = (req: Request): SupabaseClient => {
    const authHeader = req.headers.get("Authorization");

    if (!authHeader) {
        throw new Error("No authorization header found!");
    }

    const client = createSupabaseClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_ANON_KEY") ?? "",
        {
            global: {
                headers: {
                    Authorization: authHeader,
                },
            },
        },
    );

    return client;
};

export const createServiceRoleClient = (): SupabaseClient => {
    const client = createSupabaseClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_ANON_KEY")!,
        {
            global: {
                headers: {
                    Authorization: `Bearer ${Deno.env.get(
                        "SUPABASE_SERVICE_ROLE_KEY",
                    )!}`,
                },
            },
        },
    );
    return client;
};
