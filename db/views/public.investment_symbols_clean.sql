DROP VIEW IF EXISTS public.investment_symbols_clean;

CREATE OR REPLACE VIEW public.investment_symbols_clean
WITH (security_invoker = on) AS
SELECT
  symbol,
  name,
  quote_data->>'currency' as currency,
  (quote_data->>'regularMarketChangePercent')::numeric as change_percent,
  (quote_data->>'regularMarketPrice')::numeric as price,
  (quote_data->>'epsTrailingTwelveMonths')::numeric as eps,
  (quote_data->>'trailingPE')::numeric as trailing_pe_ratio,
  (quote_data->>'marketCap')::numeric as market_cap,
  (quote_data->>'dividendYield')::numeric as dividend_yield,
  (
    SELECT jsonb_agg(jsonb_build_object('month', EXTRACT(MONTH FROM (elem->>'date')::timestamp), 'price', (elem->>'open')::numeric)) AS price_history
    FROM jsonb_array_elements(price_history) AS elem
  ) AS price_history,
  ai_score,
  ai_explanation
FROM public.investment_symbols;

SELECT * FROM public.investment_symbols_clean;
