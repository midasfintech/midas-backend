import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { badResponse, ok } from '../_shared/response-helpers.ts';
import { createClient } from '../_shared/supabase-helpers.ts';
import { corsHeaders } from '../_shared/cors.ts';

export interface StockPriceHistoryPoint {
  date: string;
  close: number;
}

export interface StockData {
  symbol: string;
  regularMarketPrice: number;

  // Valuation
  trailingPE: number | null;
  forwardPE: number | null;
  priceToBook: number | null;
  priceEpsCurrentYear: number | null;

  // Earnings & growth
  epsTrailingTwelveMonths: number | null;
  epsForward: number | null;
  epsCurrentYear: number | null;

  // Dividends
  dividendYield: number | null;
  dividendRate: number | null;

  // Volatility & Risk
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  fiftyTwoWeekChangePercent: number;
  regularMarketChangePercent: number;

  // Liquidity
  regularMarketVolume: number;
  averageDailyVolume3Month: number;

  // Size
  marketCap: number;

  // Price history for return calculation
  priceHistory: StockPriceHistoryPoint[];
}

export function parseStockJson(json: any, priceHistory: StockPriceHistoryPoint[]): StockData {
  return {
    symbol: json.symbol,
    regularMarketPrice: json.regularMarketPrice,

    // Valuation
    trailingPE: json.trailingPE ?? null,
    forwardPE: json.forwardPE ?? null,
    priceToBook: json.priceToBook ?? null,
    priceEpsCurrentYear: json.priceEpsCurrentYear ?? null,

    // Earnings
    epsTrailingTwelveMonths: json.epsTrailingTwelveMonths ?? null,
    epsForward: json.epsForward ?? null,
    epsCurrentYear: json.epsCurrentYear ?? null,

    // Dividends
    dividendYield: json.dividendYield ?? null,
    dividendRate: json.dividendRate ?? null,

    // Volatility/Range
    fiftyTwoWeekHigh: json.fiftyTwoWeekHigh,
    fiftyTwoWeekLow: json.fiftyTwoWeekLow,
    fiftyTwoWeekChangePercent: json.fiftyTwoWeekChangePercent,
    regularMarketChangePercent: json.regularMarketChangePercent,

    // Liquidity
    regularMarketVolume: json.regularMarketVolume,
    averageDailyVolume3Month: json.averageDailyVolume3Month,

    // Size
    marketCap: json.marketCap,

    // Historical data
    priceHistory,
  };
}

export function stockScore(stock: StockData): number {
  let score = 0.0;

  // --- Valuation (30%) ---
  if (stock.trailingPE && stock.trailingPE < 20) score += 0.1;
  if (stock.forwardPE && stock.forwardPE < 18) score += 0.1;
  if (stock.priceToBook && stock.priceToBook < 4) score += 0.1;

  // --- Profitability & Growth (25%) ---
  if (stock.epsTrailingTwelveMonths && stock.epsTrailingTwelveMonths > 0) score += 0.1;
  if (stock.epsForward && stock.epsCurrentYear && stock.epsForward > stock.epsCurrentYear) score += 0.15;

  // --- Dividends (10%) ---
  if (stock.dividendYield && stock.dividendYield > 0.01) score += 0.05;
  if (stock.dividendRate && stock.dividendRate > 0) score += 0.05;

  // --- Volatility (20%) ---
  const high = stock.fiftyTwoWeekHigh;
  const low = stock.fiftyTwoWeekLow;

  if ((high - low) / low < 0.5) score += 0.1;
  if (stock.regularMarketChangePercent > -2) score += 0.1;

  // --- Liquidity (10%) ---
  if (stock.regularMarketVolume > stock.averageDailyVolume3Month * 0.8) score += 0.1;

  // --- Market Cap (5%) ---
  if (stock.marketCap > 50_000_000_000) score += 0.05; // safer large-cap

  return Math.min(score, 1);
}
export interface GrowthPoint {
    year: number;
    totalInvestment: number;
    totalValue: number;
}

export function calculateExpectedAnnualReturn(stock: StockData): number {
  const prices = stock.priceHistory;

  if (!prices || prices.length < 2) return 0;

  const monthlyReturns: number[] = [];

  for (let i = 1; i < prices.length; i++) {
    const r = (prices[i].close - prices[i - 1].close) / prices[i - 1].close;
    monthlyReturns.push(r);
  }

  const avgMonthlyReturn =
    monthlyReturns.reduce((a, b) => a + b, 0) / monthlyReturns.length;

  const baselineAnnual = (1 + avgMonthlyReturn) ** 12 - 1;
  const score = stockScore(stock);
  const multiplier = 0.75 + score * 0.5;

  const dividendReturn = stock.dividendYield ?? 0;
  const expectedReturn = baselineAnnual * multiplier + dividendReturn;

  return expectedReturn;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return ok(null, corsHeaders);
  }

  if (req.method != "GET") {
      return badResponse("Method not allowed");
  }

  const supabase = createClient(req);

  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user) {
    return badResponse('User not authenticated');
  }

  const userId = userData.user.id;

  if (!userId) {
    return badResponse('User not authenticated');
  }

  const { data: usersData, error: usersDataError } = await supabase
    .from('users_data')
    .select('monthly_investment_amount')
    .eq('id', userId)
    .single();

  if (usersDataError) {
    console.error(`Error fetching user data: ${usersDataError.message}`);
    return badResponse('Error fetching user data');
  }

  const { data: userInvestments, error: userInvestmentsError } = await supabase
    .from('users_investments')
    .select('invested_stocks, invested_etfs')
    .eq('user_id', userId)
    .single();

  if (userInvestmentsError) {
    console.error(`Error fetching user investments: ${userInvestmentsError.message}`);
    return badResponse('Error fetching user investments');
  }

  try {
    const YEARS = 30;

    // Combine all invested symbols
    const allSymbols = [
      ...(userInvestments.invested_stocks || []),
      ...(userInvestments.invested_etfs || [])
    ];

    if (allSymbols.length === 0) {
      return badResponse('No invested stocks or ETFs found');
    }

    // Fetch data for all invested symbols
    const { data: symbolsData, error: symbolsError } = await supabase
      .from('investment_symbols')
      .select('symbol, quote_data, price_history')
      .in('symbol', allSymbols);

    if (symbolsError) {
      console.error(`Error fetching symbols data: ${symbolsError.message}`);
      return badResponse('Error fetching symbols data');
    }

    if (!symbolsData || symbolsData.length === 0) {
      return badResponse('No valid investment data found for user symbols');
    }

    // Calculate monthly investment per symbol (equal allocation)
    const monthlyInvestmentPerSymbol = usersData.monthly_investment_amount / symbolsData.length;
    
    let totalValue = 0;
    const growth: GrowthPoint[] = [];

    console.log('Monthly Investment Amount:', usersData.monthly_investment_amount);
    console.log('Investment per symbol:', monthlyInvestmentPerSymbol);
    console.log('Symbols:', allSymbols);

    // Initialize growth array
    for(let year = 1; year <= YEARS; year++) {
        growth.push({
            year,
            totalInvestment: usersData.monthly_investment_amount * 12 * year,
            totalValue: 0
        });
    }

    // Calculate projections for each symbol and aggregate
    for (const symbolData of symbolsData) {
      const parsedStock = parseStockJson(symbolData.quote_data, symbolData.price_history);
      const annualReturnRate = calculateExpectedAnnualReturn(parsedStock);
      
      console.log(`Symbol: ${symbolData.symbol}, Annual Return Rate: ${annualReturnRate}`);

      for(let year = 1; year <= YEARS; year++) {
        const symbolValue = monthlyInvestmentPerSymbol * ((1 + annualReturnRate)**year - 1) / ((1 + annualReturnRate)**(1/12) - 1);
        growth[year - 1].totalValue += symbolValue;
      }
    }

    return ok(growth);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Error running projection algorithm: ${errorMessage}`);
    return badResponse(`Error running projection algorithm: ${errorMessage}`);
  }
});
