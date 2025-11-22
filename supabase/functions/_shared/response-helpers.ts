import { corsHeaders } from "./cors.ts";

export const ok = (
    body?: any | undefined,
    headers?: HeadersInit | undefined,
): Response =>
    new Response(JSON.stringify(body), {
        headers: {
            ...headers,
            ...corsHeaders,
            "Content-Type": "application/json",
        },
    });

export const badResponse = (message: string | undefined): Response =>
    new Response(JSON.stringify({ message }), {
        headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
        },
        status: 400,
    });
