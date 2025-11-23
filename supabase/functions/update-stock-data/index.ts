import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { badResponse, ok } from '../_shared/response-helpers.ts';
import { createServiceRoleClient } from '../_shared/supabase-helpers.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { z } from "npm:zod";
import { zodToJsonSchema } from "npm:zod-to-json-schema";
import YahooFinance from 'npm:yahoo-finance2';
import { GoogleGenAI } from "npm:@google/genai";

const aiResponseSchema = z.object({
  score: z.number().int().describe("Score 1 - 10 of how the confidence in the stock's increase"),
  explanation: z.string().describe("Explanation of the confidence score"),
});

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return ok(null, corsHeaders);
  }

  if (req.method != "POST") {
      return badResponse("Method not allowed");
  }

  try {
    const yahooFinance = new YahooFinance();
    const ai = new GoogleGenAI({});

    const supabase = createServiceRoleClient();

    const { data: investmentSymbols } = await supabase.from('investment_symbols').select('symbol, investment_symbol_type');

    for (const symbol of investmentSymbols) {
      if (symbol.investment_symbol_type == 'stock') {
        const stockData = await yahooFinance.quote(symbol.symbol);
        if (!stockData) {
          console.error(`Failed to fetch data for stock ${symbol.symbol}`);
          continue;
        }

        console.log(`Stock data for ${symbol.symbol}: ${JSON.stringify(stockData)}`);

        const stockHistory = await yahooFinance.historical(symbol.symbol, {
          period1: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
          period2: Date.now(),
          interval: '1mo',
        });
        if (!stockData) {
          console.error(`Failed to fetch data for stock history ${symbol.symbol}`);
          continue;
        }

        const aiResponseStock = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: `What score would you give this stock? Return the data in format { score: integer, explanation: string }\nThe information: ${JSON.stringify(stockData)}\nOne year price history: ${JSON.stringify(stockHistory)}`,
          config: {
            responseMimeType: "application/json",
            responseJsonSchema: zodToJsonSchema(aiResponseSchema),
          },
        });
        const aiResponseStockParsed = aiResponseSchema.parse(JSON.parse(aiResponseStock.text))

        console.log(`AI response for ${symbol.symbol}: ${JSON.stringify(aiResponseStockParsed)}`);

        await supabase.from('investment_symbols').update({
          price_history: stockHistory,
          quote_data: stockData,
          ai_score: aiResponseStockParsed.score,
          ai_explanation: aiResponseStockParsed.explanation,
        }).eq('symbol', symbol.symbol);
      } else {
        const etfHistory = await yahooFinance.historical(symbol.symbol, {
          period1: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
          period2: Date.now(),
          interval: '1mo',
        });
        if (!etfHistory) {
          console.error(`Failed to fetch data for etf history ${symbol.symbol}`);
          continue;
        }

        const aiResponseEtf = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: `Do you think this etf (${symbol.symbol}) is a good investment?\nOne year price history: ${etfHistory}`,
          config: {
            responseMimeType: "application/json",
            responseJsonSchema: zodToJsonSchema(aiResponseSchema),
          },
        });
        const aiResponseEtfParsed = aiResponseSchema.parse(JSON.parse(aiResponseEtf.text))

        console.log(`AI response for ${symbol.symbol}: ${JSON.stringify(aiResponseEtfParsed)}`);

        await supabase.from('investment_symbols').update({
          price_history: JSON.stringify(etfHistory),
          ai_score: aiResponseEtfParsed.score,
          ai_explanation: aiResponseEtfParsed.explanation,
        }).eq('symbol', symbol.symbol);
      }
    }

    return ok('Ok');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Error saving stock data: ${errorMessage}`);
    return badResponse(`Error saving stock data: ${errorMessage}`);
  }
});
