// app/json-formatter/page.tsx
import type { Metadata } from 'next';
import { Code, Shield, Zap, Copy, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import JsonFormatter from '@/components/utilities/json/JsonFormatter';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'JSON Formatter & Validator - Beautify and Validate JSON Online | PassZap',
  description: 'Free online JSON formatter, validator, and beautifier tool. Format, validate, and minify JSON data with syntax highlighting. No data stored.',
  keywords: 'json formatter, json validator, json beautifier, json minify, json prettifier, json parser, json lint',
  openGraph: {
    title: 'JSON Formatter & Validator - Beautify and Validate JSON Online | PassZap',
    description: 'Free online JSON formatter, validator, and beautifier tool. Format, validate, and minify JSON data.',
    url: 'https://passzap.net/json-formatter',
    siteName: 'PassZap',
    images: [
      {
        url: '/og/json-formatter-og.jpg',
        width: 1200,
        height: 630,
        alt: 'PassZap JSON Formatter & Validator',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JSON Formatter & Validator - Beautify and Validate JSON Online | PassZap',
    description: 'Free online JSON formatter, validator, and beautifier tool. Format, validate, and minify JSON data.',
    images: ['/og/json-formatter-og.jpg'],
  },
  alternates: {
    canonical: 'https://passzap.net/json-formatter',
  },
};

export default function JsonFormatterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <Header />
      
      <main className="py-8">
        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Tool */}
            <div className="lg:col-span-2">
              <JsonFormatter />
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
                    <span><strong>Client-Side Processing</strong> - All formatting happens in your browser</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Shield className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span><strong>No Data Stored</strong> - Your JSON data never leaves your device</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Code className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Syntax Validation</strong> - Real-time JSON validation and error detection</span>
                  </li>
                </ul>
              </div>

              {/* Features */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-emerald-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start space-x-2">
                    <FileText className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Beautify JSON</strong> - Format with proper indentation</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Validate Syntax</strong> - Detect and highlight errors</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Copy className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Minify JSON</strong> - Remove whitespace for compact size</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Error Detection</strong> - Pinpoint syntax issues with line numbers</span>
                  </div>
                </div>
              </div>

              {/* Use Cases */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-emerald-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Common Use Cases</h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <h4 className="font-semibold text-blue-800 mb-1">👨‍💻 Development</h4>
                    <ul className="space-y-1 text-blue-700">
                      <li>• API response formatting</li>
                      <li>• Configuration file validation</li>
                      <li>• Debugging JSON data</li>
                    </ul>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <h4 className="font-semibold text-green-800 mb-1">📊 Data Analysis</h4>
                    <ul className="space-y-1 text-green-700">
                      <li>• Log file analysis</li>
                      <li>• Data visualization prep</li>
                      <li>• Database export formatting</li>
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
              {jsonFaqItems.map((faq, index) => (
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
              Free Online JSON Formatter & Validator
            </h2>
            
            <p className="text-gray-700 mb-4">
              JSON (JavaScript Object Notation) is the universal format for data exchange in web applications. 
              Our tool helps developers format, validate, and beautify JSON data with real-time syntax checking 
              and complete client-side processing for maximum security.
            </p>

            <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
              Why Format JSON?
            </h3>
            <p className="text-gray-700 mb-4">
              Properly formatted JSON is essential for readability, debugging, and maintenance. 
              Our formatter adds consistent indentation, line breaks, and syntax highlighting to make 
              your JSON data easy to read and understand.
            </p>

            <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
              JSON Validation Benefits
            </h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Detect syntax errors before they cause application failures</li>
              <li>Identify missing commas, quotes, or brackets</li>
              <li>Validate JSON structure against standards</li>
              <li>Prevent data corruption in production environments</li>
              <li>Speed up debugging with precise error locations</li>
            </ul>
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
            "mainEntity": jsonFaqItems.map(faq => ({
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

const jsonFaqItems = [
  {
    question: "Is my JSON data secure when using this tool?",
    answer: "Yes! All JSON processing happens entirely in your browser. We never send your data to our servers or store it anywhere. Your data remains completely private and secure."
  },
  {
    question: "What types of JSON errors can this tool detect?",
    answer: "The tool detects common JSON syntax errors including missing commas, unclosed brackets, trailing commas, incorrect quotes, and invalid character encoding. It provides detailed error messages with line numbers."
  },
  {
    question: "Can I format minified JSON?",
    answer: "Yes! The tool can beautify minified JSON by adding proper indentation and line breaks. It can also minify formatted JSON by removing unnecessary whitespace for production use."
  },
  {
    question: "Is there a limit to the JSON file size?",
    answer: "The tool can handle large JSON files, but very large files (10MB+) may impact browser performance. For optimal experience, we recommend files under 5MB. All processing happens client-side."
  },
  {
    question: "Does the tool support JSON with comments?",
    answer: "Standard JSON doesn't support comments, but our tool can handle some common comment formats. However, for strict JSON validation, comments will be flagged as syntax errors."
  },
  {
    question: "Can I use this tool for JSONP or JSON with functions?",
    answer: "This tool is designed for standard JSON data. JSONP (JSON with Padding) and JSON containing JavaScript functions may not format correctly as they're not valid JSON."
  }
];