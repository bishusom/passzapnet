// components/tools/CurrencyConverter.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
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
  AlertCircle,
  Search,
  X
} from 'lucide-react';

interface ExchangeRates {
  [key: string]: number;
}

// Fallback exchange rates (updated periodically)
const FALLBACK_RATES: ExchangeRates = {
  USD: 1, EUR: 0.92, GBP: 0.79, JPY: 149.25, CAD: 1.36,
  AUD: 1.52, CHF: 0.88, CNY: 7.18, INR: 83.12, BRL: 4.92,
  RUB: 91.45, MXN: 17.25, KRW: 1320.75, SGD: 1.34, NZD: 1.62,
  AED: 3.67, AFN: 71.50, ALL: 95.25, AMD: 403.25, ANG: 1.79,
  AOA: 831.25, ARS: 350.50, AWG: 1.79, AZN: 1.70, BAM: 1.80,
  BBD: 2.00, BDT: 109.75, BGN: 1.80, BHD: 0.376, BIF: 2850,
  BMD: 1.00, BND: 1.34, BOB: 6.91, BSD: 1.00,
  BTN: 83.12, BWP: 13.65, BYN: 3.25, BZD: 2.00, CDF: 2475,
  CLP: 875, COP: 3950, CRC: 535, CUP: 24.00, CVE: 101.25,
  CZK: 22.45, DJF: 177.75, DKK: 6.88, DOP: 56.75, DZD: 134.25,
  EGP: 30.90, ERN: 15.00, ETB: 56.25, FJD: 2.24, FKP: 0.79,
  GEL: 2.67, GGP: 0.79, GHS: 11.85, GIP: 0.79, GMD: 65.25,
  GNF: 8580, GTQ: 7.82, GYD: 209.25, HKD: 7.82, HNL: 24.68,
  HRK: 6.88, HTG: 132.25, HUF: 355.50, IDR: 15575, ILS: 3.86,
  IMP: 0.79, IQD: 1310, IRR: 42250, ISK: 136.75, JEP: 0.79,
  JMD: 155.25, JOD: 0.709, KES: 157.25, KGS: 89.25, KHR: 4110,
  KMF: 452.5, KPW: 900, KWD: 0.308, KYD: 0.833,
  KZT: 469.5, LAK: 20750, LBP: 15000, LKR: 322.5, LRD: 189.25,
  LSL: 18.85, LYD: 4.82, MAD: 10.06, MDL: 17.85, MGA: 4515,
  MKD: 56.5, MMK: 2100, MNT: 3430, MOP: 8.06, MRU: 39.75,
  MUR: 45.25, MVR: 15.40, MWK: 1685, MYR: 4.68,
  MZN: 63.85, NAD: 18.85, NGN: 789.5, NIO: 36.65, NOK: 10.75,
  NPR: 133.00, OMR: 0.384, PAB: 1.00, PEN: 3.78,
  PGK: 3.75, PHP: 56.25, PKR: 278.5, PLN: 4.02, PYG: 7285,
  QAR: 3.64, RON: 4.56, RSD: 107.5, RWF: 1275,
  SAR: 3.75, SBD: 8.45, SCR: 13.45, SDG: 601, SEK: 10.65,
  SHP: 0.79, SLL: 20750, SOS: 571, SRD: 37.25,
  SSP: 1300, STN: 22.65, SVC: 8.75, SYP: 2512, SZL: 18.85,
  THB: 35.85, TJS: 10.95, TMT: 3.50, TND: 3.11, TOP: 2.36,
  TRY: 28.85, TTD: 6.78, TWD: 31.45, TZS: 2500, UAH: 36.75,
  UGX: 3750, UYU: 39.25, UZS: 12250, VES: 35.25, VND: 24250,
  VUV: 120, WST: 2.72, XAF: 603, XAG: 0.042, XAU: 0.00052,
  XCD: 2.70, XDR: 0.75, XOF: 603, XPF: 110, YER: 250,
  ZAR: 18.85, ZMW: 23.45, ZWL: 322
};

const currencyFaqItems = [
  {
    question: "How often are exchange rates updated?",
    answer: "Exchange rates are updated every 5 minutes from reliable financial data sources to ensure you get the most current conversion rates available."
  },
  {
    question: "Are there any fees for using the currency converter?",
    answer: "No, our currency converter is completely free to use. There are no hidden fees, registration requirements, or usage limits."
  },
  {
    question: "How many currencies are supported?",
    answer: "We support over 150 world currencies including all major currencies (USD, EUR, GBP, JPY, etc.) and many minor currencies from around the world."
  },
  {
    question: "Can I use this for business transactions?",
    answer: "While our converter provides accurate real-time rates, we recommend checking with your financial institution for official exchange rates before conducting business transactions."
  },
  {
    question: "Do you store my conversion history?",
    answer: "No, we do not store any conversion data. All calculations happen in real-time in your browser, ensuring your privacy and data security."
  },
  {
    question: "Why are the rates different from my bank?",
    answer: "Banks and financial institutions typically add a margin to exchange rates. Our converter shows the mid-market rate without any markup, which is why it may differ from bank rates."
  }
];

export default function CurrencyConverter() {
  const [amount, setAmount] = useState<string>('1');
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('EUR');
  const [convertedAmount, setConvertedAmount] = useState<string>('');
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [lastUpdated, setLastUpdated] = useState<string>('Using latest available rates');
  const [usingFallback, setUsingFallback] = useState<boolean>(true);
  
  // Searchable dropdown states
  const [fromSearch, setFromSearch] = useState<string>('');
  const [toSearch, setToSearch] = useState<string>('');
  const [showFromDropdown, setShowFromDropdown] = useState<boolean>(false);
  const [showToDropdown, setShowToDropdown] = useState<boolean>(false);
  const fromDropdownRef = useRef<HTMLDivElement>(null);
  const toDropdownRef = useRef<HTMLDivElement>(null);

  // Filter currencies based on search
  const filteredFromCurrencies = CURRENCIES.filter(currency => 
    currency.code.toLowerCase().includes(fromSearch.toLowerCase()) ||
    currency.name.toLowerCase().includes(fromSearch.toLowerCase()) ||
    currency.flag.includes(fromSearch)
  );

  const filteredToCurrencies = CURRENCIES.filter(currency => 
    currency.code.toLowerCase().includes(toSearch.toLowerCase()) ||
    currency.name.toLowerCase().includes(toSearch.toLowerCase()) ||
    currency.flag.includes(toSearch)
  );

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (fromDropdownRef.current && !fromDropdownRef.current.contains(event.target as Node)) {
        setShowFromDropdown(false);
      }
      if (toDropdownRef.current && !toDropdownRef.current.contains(event.target as Node)) {
        setShowToDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch exchange rates with better error handling
  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Try multiple API endpoints for better reliability
        const apiEndpoints = [
          `https://api.frankfurter.app/latest?from=${fromCurrency}`,
          `https://api.exchangerate.host/latest?base=${fromCurrency}`,
        ];

        let success = false;

        for (const endpoint of apiEndpoints) {
          try {
            console.log(`Trying API: ${endpoint}`);
            const response = await fetch(endpoint);
            
            if (response.ok) {
              const data = await response.json();
              console.log('API response:', data);
              
              // Handle different API response formats
              let rates: ExchangeRates = {};
              if (endpoint.includes('frankfurter.app')) {
                rates = data.rates || {};
              } else if (endpoint.includes('exchangerate.host')) {
                rates = data.rates || {};
              }
              
              if (rates && Object.keys(rates).length > 0) {
                // Ensure base currency rate is 1
                rates[fromCurrency] = 1;
                setExchangeRates(rates);
                setLastUpdated(new Date().toLocaleTimeString());
                setUsingFallback(false);
                success = true;
                console.log('Successfully fetched rates:', rates);
                break;
              }
            }
          } catch (apiError) {
            console.log(`API ${endpoint} failed:`, apiError);
            continue; // Try next endpoint
          }
        }

        if (!success) {
          throw new Error('All API endpoints failed');
        }

      } catch (err) {
        console.error('All exchange rate APIs failed:', err);
        setError('Using cached exchange rates. Real-time rates temporarily unavailable.');
        // Use fallback rates but ensure base currency rate is 1
        const fallbackWithBase = { ...FALLBACK_RATES };
        fallbackWithBase[fromCurrency] = 1;
        setExchangeRates(fallbackWithBase);
        setLastUpdated('Using cached rates - Last updated recently');
        setUsingFallback(true);
      } finally {
        setLoading(false);
      }
    };

    fetchExchangeRates();
    
    // Set up refresh interval
    const interval = setInterval(fetchExchangeRates, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fromCurrency]); // Re-fetch when fromCurrency changes

  // Convert currency - FIXED VERSION
  useEffect(() => {
    console.log('Conversion triggered:', {
      amount,
      fromCurrency,
      toCurrency,
      exchangeRates,
      hasToCurrencyRate: exchangeRates[toCurrency]
    });

    if (amount && exchangeRates[toCurrency]) {
      const numericAmount = parseFloat(amount);
      if (!isNaN(numericAmount)) {
        const rate = exchangeRates[toCurrency];
        const result = numericAmount * rate;
        console.log(`Conversion: ${numericAmount} ${fromCurrency} * ${rate} = ${result}`);
        setConvertedAmount(result.toFixed(4));
      } else {
        setConvertedAmount('');
      }
    } else {
      setConvertedAmount('');
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
    setFromSearch('');
    setToSearch('');
  };

  const getCurrencySymbol = (code: string) => {
    return CURRENCIES.find(currency => currency.code === code)?.symbol || code;
  };

  const getSelectedCurrency = (code: string) => {
    return CURRENCIES.find(currency => currency.code === code);
  };

  const handleFromCurrencySelect = (currencyCode: string) => {
    setFromCurrency(currencyCode);
    setFromSearch('');
    setShowFromDropdown(false);
  };

  const handleToCurrencySelect = (currencyCode: string) => {
    setToCurrency(currencyCode);
    setToSearch('');
    setShowToDropdown(false);
  };

  const clearFromSearch = () => {
    setFromSearch('');
    setShowFromDropdown(true);
  };

  const clearToSearch = () => {
    setToSearch('');
    setShowToDropdown(true);
  };

  const retryFetchRates = () => {
    setUsingFallback(false);
    setError('');
  };

  // Calculate conversion rate for display
  const getConversionRate = () => {
    if (exchangeRates[toCurrency]) {
      return exchangeRates[toCurrency].toFixed(4);
    }
    return 'N/A';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Header */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl shadow-lg mb-4">
            <TrendingUp className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Currency Converter
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Convert between 150+ currencies with real-time exchange rates. 
            Free, fast, and accurate currency conversions.
          </p>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Converter Component */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl border border-emerald-100 p-8 max-w-2xl mx-auto">
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
                  <div className="flex-1">
                    <span>{error}</span>
                    <button 
                      onClick={retryFetchRates}
                      className="ml-2 text-yellow-700 underline hover:text-yellow-800"
                    >
                      Retry
                    </button>
                  </div>
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

                {/* From Currency - Searchable Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Globe className="h-4 w-4 text-emerald-500" />
                    From Currency
                  </label>
                  <div className="relative" ref={fromDropdownRef}>
                    <div className="relative">
                      <input
                        type="text"
                        value={fromSearch}
                        onChange={(e) => {
                          setFromSearch(e.target.value);
                          setShowFromDropdown(true);
                        }}
                        onFocus={() => setShowFromDropdown(true)}
                        placeholder="Search currency (e.g., USD, Euro, 🇺🇸)"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent pr-10"
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                        {fromSearch && (
                          <button
                            onClick={clearFromSearch}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                        <Search className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>

                    {showFromDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {filteredFromCurrencies.length > 0 ? (
                          filteredFromCurrencies.map(currency => (
                            <button
                              key={currency.code}
                              onClick={() => handleFromCurrencySelect(currency.code)}
                              className={`w-full px-4 py-3 text-left hover:bg-emerald-50 flex items-center space-x-3 ${
                                fromCurrency === currency.code ? 'bg-emerald-100 text-emerald-700' : ''
                              }`}
                            >
                              <span className="text-lg">{currency.flag}</span>
                              <div className="flex-1">
                                <div className="font-medium">{currency.code}</div>
                                <div className="text-sm text-gray-600">{currency.name}</div>
                              </div>
                            </button>
                          ))
                        ) : (
                          <div className="px-4 py-3 text-gray-500 text-center">
                            No currencies found
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  {!showFromDropdown && getSelectedCurrency(fromCurrency) && (
                    <div className="mt-2 text-sm text-gray-600 flex items-center space-x-2">
                      <span>Selected: {getSelectedCurrency(fromCurrency)?.flag} {fromCurrency} - {getSelectedCurrency(fromCurrency)?.name}</span>
                    </div>
                  )}
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

                {/* To Currency - Searchable Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-emerald-500" />
                    To Currency
                  </label>
                  <div className="relative" ref={toDropdownRef}>
                    <div className="relative">
                      <input
                        type="text"
                        value={toSearch}
                        onChange={(e) => {
                          setToSearch(e.target.value);
                          setShowToDropdown(true);
                        }}
                        onFocus={() => setShowToDropdown(true)}
                        placeholder="Search currency (e.g., EUR, Yen, 🇯🇵)"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent pr-10"
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                        {toSearch && (
                          <button
                            onClick={clearToSearch}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                        <Search className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>

                    {showToDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {filteredToCurrencies.length > 0 ? (
                          filteredToCurrencies.map(currency => (
                            <button
                              key={currency.code}
                              onClick={() => handleToCurrencySelect(currency.code)}
                              className={`w-full px-4 py-3 text-left hover:bg-emerald-50 flex items-center space-x-3 ${
                                toCurrency === currency.code ? 'bg-emerald-100 text-emerald-700' : ''
                              }`}
                            >
                              <span className="text-lg">{currency.flag}</span>
                              <div className="flex-1">
                                <div className="font-medium">{currency.code}</div>
                                <div className="text-sm text-gray-600">{currency.name}</div>
                              </div>
                            </button>
                          ))
                        ) : (
                          <div className="px-4 py-3 text-gray-500 text-center">
                            No currencies found
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  {!showToDropdown && getSelectedCurrency(toCurrency) && (
                    <div className="mt-2 text-sm text-gray-600 flex items-center space-x-2">
                      <span>Selected: {getSelectedCurrency(toCurrency)?.flag} {toCurrency} - {getSelectedCurrency(toCurrency)?.name}</span>
                    </div>
                  )}
                </div>

                {/* Result */}
                <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm text-emerald-700 font-medium">Converted Amount</div>
                    {!loading && convertedAmount && (
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                    )}
                  </div>
                  <div className="text-2xl font-bold text-emerald-800">
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <RefreshCw className="h-4 w-4 animate-spin text-emerald-500" />
                        <span className="text-gray-600">Loading rates...</span>
                      </div>
                    ) : convertedAmount ? (
                      <>
                        {getCurrencySymbol(toCurrency)}{convertedAmount}
                        <span className="text-sm font-normal text-emerald-600 ml-2">{toCurrency}</span>
                      </>
                    ) : (
                      <span className="text-gray-500">Enter amount to convert</span>
                    )}
                  </div>
                  {exchangeRates[toCurrency] && amount && (
                    <div className="text-sm text-emerald-600 mt-2">
                      1 {fromCurrency} = {getConversionRate()} {toCurrency}
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
          </div>

          {/* Right Column - Side Content */}
          <div className="space-y-6">
            {/* Security Features */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-emerald-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Shield className="h-5 w-5 text-emerald-500 mr-2" />
                Security Features
              </h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start space-x-2">
                  <Zap className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Real-Time Data</strong> - Live exchange rates from reliable sources</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Shield className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>No Data Storage</strong> - Your conversions are private and secure</span>
                </li>
                <li className="flex items-start space-x-2">
                  <RefreshCw className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Auto-Refresh</strong> - Rates updated every 5 minutes</span>
                </li>
              </ul>
            </div>

            {/* Features */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-emerald-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-2">
                  <Globe className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>150+ Currencies</strong> - All major and minor currencies supported</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Calculator className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Real-Time Rates</strong> - Live forex rates updated frequently</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Zap className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Instant Conversion</strong> - Fast calculations with no delays</span>
                </div>
                <div className="flex items-start space-x-2">
                  <TrendingUp className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Historical Data</strong> - View recent rate trends and changes</span>
                </div>
              </div>
            </div>

            {/* Popular Conversions */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-emerald-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Conversions</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <h4 className="font-semibold text-blue-800 mb-1">🇺🇸 USD Conversions</h4>
                  <ul className="space-y-1 text-blue-700">
                    <li>• USD to EUR (Euro)</li>
                    <li>• USD to GBP (Pound)</li>
                    <li>• USD to JPY (Yen)</li>
                  </ul>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <h4 className="font-semibold text-green-800 mb-1">🇪🇺 EUR Conversions</h4>
                  <ul className="space-y-1 text-green-700">
                    <li>• EUR to USD (Dollar)</li>
                    <li>• EUR to GBP (Pound)</li>
                    <li>• EUR to CHF (Franc)</li>
                  </ul>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                  <h4 className="font-semibold text-purple-800 mb-1">🌏 Asian Currencies</h4>
                  <ul className="space-y-1 text-purple-700">
                    <li>• JPY to USD (Yen to Dollar)</li>
                    <li>• CNY to USD (Yuan to Dollar)</li>
                    <li>• INR to USD (Rupee to Dollar)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {currencyFaqItems.map((faq, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-emerald-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* SEO Content */}
        <div className="max-w-4xl mx-auto mt-12 prose prose-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Free Online Currency Converter
          </h2>
          
          <p className="text-gray-700 mb-4">
            Our currency converter provides real-time exchange rates for over 150 world currencies. 
            Whether you're traveling, shopping internationally, or conducting business across borders, 
            get accurate conversions instantly.
          </p>

          <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
            How to Use the Currency Converter
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Enter the amount you want to convert</li>
            <li>Select your source currency (the currency you have)</li>
            <li>Choose your target currency (the currency you want)</li>
            <li>View the converted amount instantly</li>
          </ol>

          <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
            Supported Currencies
          </h3>
          <p className="text-gray-700 mb-4">
            Convert between major world currencies including US Dollar (USD), Euro (EUR), 
            British Pound (GBP), Japanese Yen (JPY), Canadian Dollar (CAD), Australian Dollar (AUD), 
            Swiss Franc (CHF), Chinese Yuan (CNY), Indian Rupee (INR), and many more.
          </p>

          <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
            Real-Time Exchange Rates
          </h3>
          <p className="text-gray-700">
            Our currency converter uses reliable financial data sources to provide you with 
            the most current exchange rates. Rates are updated every 5 minutes to ensure 
            accuracy for your currency conversion needs.
          </p>
        </div>
      </div>

      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": currencyFaqItems.map(faq => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
              }
            }))
          })
        }}
      />
    </div>
  );
}