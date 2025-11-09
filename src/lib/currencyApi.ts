// lib/currencyApi.ts
export interface ExchangeRateResponse {
  base: string;
  date: string;
  rates: {
    [key: string]: number;
  };
}

export class CurrencyApiService {
  private cache: Map<string, { data: ExchangeRateResponse; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  async getLatestRates(baseCurrency: string = 'USD'): Promise<ExchangeRateResponse> {
    const cacheKey = `rates-${baseCurrency}`;
    const cached = this.cache.get(cacheKey);

    // Return cached data if still valid
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }

    try {
      const response = await fetch(`https://api.frankfurter.app/latest?from=${baseCurrency}`);
      
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }

      const data: ExchangeRateResponse = await response.json();
      
      // Cache the response
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });

      return data;
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
      throw error;
    }
  }

  // Fallback rates in case API fails
  getFallbackRates(baseCurrency: string = 'USD'): ExchangeRateResponse {
    const fallbackRates = {
      USD: { USD: 1, EUR: 0.85, GBP: 0.73, JPY: 110.25, CAD: 1.25, AUD: 1.35 },
      EUR: { EUR: 1, USD: 1.18, GBP: 0.86, JPY: 129.71, CAD: 1.47, AUD: 1.59 },
      GBP: { GBP: 1, USD: 1.37, EUR: 1.16, JPY: 151.03, CAD: 1.71, AUD: 1.85 },
    };

    return {
      base: baseCurrency,
      date: new Date().toISOString().split('T')[0],
      rates: fallbackRates[baseCurrency as keyof typeof fallbackRates] || fallbackRates.USD
    };
  }
}

export const currencyApi = new CurrencyApiService();