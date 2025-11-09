// app/currency-converter/page.tsx
import type { Metadata } from 'next';
import { TrendingUp, Shield, Zap, RefreshCw, Globe, Calculator } from 'lucide-react';
import CurrencyConverter from './../../components/utilities/currency/CurrencyConverter';
import Header from './../../components/layout/Header';
import Footer from './../../components/layout/Footer';

export const metadata: Metadata = {
  title: 'Currency Converter - Real-Time Exchange Rates | PassZap',
  description: 'Free real-time currency converter with live exchange rates. Convert between 150+ currencies including USD, EUR, GBP, JPY, CAD, AUD, and more.',
  keywords: 'currency converter, exchange rates, forex, money converter, USD to EUR, GBP to USD, real-time rates, currency calculator',
  openGraph: {
    title: 'Currency Converter - Real-Time Exchange Rates | PassZap',
    description: 'Free real-time currency converter with live exchange rates. Convert between 150+ currencies.',
    url: 'https://passzap.net/currency-converter',
    siteName: 'PassZap',
    images: [
      {
        url: '/og/currency-converter-og.jpg',
        width: 1200,
        height: 630,
        alt: 'PassZap Currency Converter - Real-Time Exchange Rates',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Currency Converter - Real-Time Exchange Rates | PassZap',
    description: 'Free real-time currency converter with live exchange rates. Convert between 150+ currencies.',
    images: ['/og/currency-converter-og.jpg'],
  },
  alternates: {
    canonical: 'https://passzap.net/currency-converter',
  },
};

export default function CurrencyConverterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <Header />
      
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Converter */}
            <div className="lg:col-span-2">
              <div className="text-center mb-8">
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
              </div>

              <CurrencyConverter />
            </div>

            {/* Right Column - Info & Tips */}
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
      </main>

      <Footer />

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