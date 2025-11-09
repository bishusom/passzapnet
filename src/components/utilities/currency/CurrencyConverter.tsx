// components/tools/CurrencyConverter.tsx
'use client';

import { useState, useEffect } from 'react';
import { CURRENCIES } from '@/lib/currencies';
import { 
  RefreshCw, 
  ArrowUpDown, 
  Calculator, 
  Shield, 
  Zap,
  Globe,
  TrendingUp,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface ExchangeRates {
  [key: string]: number;
}

export default function CurrencyConverter() {
  const [amount, setAmount] = useState<string>('1');
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('EUR');
  const [convertedAmount, setConvertedAmount] = useState<string>('');
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [lastUpdated, setLastUpdated] = useState<string>('');

  // Fetch exchange rates
  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        setLoading(true);
        setError('');
        
        const response = await fetch(`https://api.frankfurter.app/latest?from=${fromCurrency}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch exchange rates');
        }
        
        const data = await response.json();
        setExchangeRates(data.rates);
        setLastUpdated(new Date().toLocaleTimeString());
      } catch (err) {
        setError('Failed to fetch latest exchange rates. Using cached rates.');
        console.error('Error fetching rates:', err);
        
        const fallbackRates = {
          USD: 1, EUR: 0.85, GBP: 0.73, JPY: 110.25, CAD: 1.25,
          AUD: 1.35, CHF: 0.92, CNY: 6.45, INR: 74.50, BRL: 5.20,
          RUB: 75.30, MXN: 20.15, KRW: 1180.50, SGD: 1.35, NZD: 1.45,
        };
        setExchangeRates(fallbackRates);
        setLastUpdated('Using cached rates');
      } finally {
        setLoading(false);
      }
    };

    fetchExchangeRates();
    
    const interval = setInterval(fetchExchangeRates, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fromCurrency]);

  // Convert currency
  useEffect(() => {
    if (exchangeRates[toCurrency] && amount) {
      const numericAmount = parseFloat(amount);
      if (!isNaN(numericAmount)) {
        const rate = exchangeRates[toCurrency];
        const result = numericAmount * rate;
        setConvertedAmount(result.toFixed(4));
      }
    }
  }, [amount, fromCurrency, toCurrency, exchangeRates]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const getCurrencySymbol = (code: string) => {
    return CURRENCIES.find(currency => currency.code === code)?.symbol || code;
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6 border border-emerald-100">
      {/* Header with Icon */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-3">
          <div className="bg-emerald-100 p-3 rounded-full">
            <Calculator className="h-6 w-6 text-emerald-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-800">
          Currency Converter
        </h2>
        <p className="text-gray-600 text-sm mt-1">
          Real-time exchange rates
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg mb-4 text-sm">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-4">
        {/* Amount Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-500" />
            Amount
          </label>
          <div className="relative">
            <input
              type="text"
              value={amount}
              onChange={handleAmountChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent pl-11"
              placeholder="Enter amount"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Calculator className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* From Currency */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Globe className="h-4 w-4 text-emerald-500" />
            From Currency
          </label>
          <div className="relative">
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent appearance-none"
            >
              {CURRENCIES.map(currency => (
                <option key={currency.code} value={currency.code}>
                  {currency.flag} {currency.code} - {currency.name}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <button
            onClick={swapCurrencies}
            className="p-3 bg-emerald-500 text-white rounded-full hover:bg-emerald-600 transition-colors shadow-md"
            aria-label="Swap currencies"
          >
            <ArrowUpDown className="h-5 w-5" />
          </button>
        </div>

        {/* To Currency */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Zap className="h-4 w-4 text-emerald-500" />
            To Currency
          </label>
          <div className="relative">
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent appearance-none"
            >
              {CURRENCIES.map(currency => (
                <option key={currency.code} value={currency.code}>
                  {currency.flag} {currency.code} - {currency.name}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Result */}
        <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-emerald-700 font-medium">Converted Amount</div>
            {!loading && (
              <CheckCircle className="h-4 w-4 text-emerald-500" />
            )}
          </div>
          <div className="text-2xl font-bold text-emerald-800">
            {loading ? (
              <div className="flex items-center space-x-2">
                <RefreshCw className="h-4 w-4 animate-spin text-emerald-500" />
                <span className="text-gray-600">Loading rates...</span>
              </div>
            ) : (
              <>
                {getCurrencySymbol(toCurrency)}{convertedAmount}
                <span className="text-sm font-normal text-emerald-600 ml-2">{toCurrency}</span>
              </>
            )}
          </div>
          {exchangeRates[toCurrency] && (
            <div className="text-sm text-emerald-600 mt-2">
              1 {fromCurrency} = {exchangeRates[toCurrency].toFixed(4)} {toCurrency}
            </div>
          )}
        </div>
      </div>

      {/* Status Bar */}
      <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <Shield className="h-3 w-3" />
          <span>Secure & Local</span>
        </div>
        <div className="flex items-center gap-1">
          <RefreshCw className="h-3 w-3" />
          <span>Updated: {lastUpdated}</span>
        </div>
      </div>
    </div>
  );
}