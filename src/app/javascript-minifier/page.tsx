// app/javascript-minifier/page.tsx
import type { Metadata } from 'next';
import { Code, Zap, FileCode, Download, Copy, Shield } from 'lucide-react';
import JavascriptMinifier from './../../components/utilities/minifiers/JavascriptMinifier';
import Header from './../../components/layout/Header';
import Footer from './../../components/layout/Footer';

export const metadata: Metadata = {
  title: 'JavaScript Minifier - Minify and Compress JS Online | PassZap',
  description: 'Free online JavaScript minifier tool. Compress and optimize your JS files by removing whitespace, comments, and shortening variables. Reduce file size and improve website performance.',
  keywords: 'javascript minifier, js compressor, minify javascript, optimize js, javascript optimization, reduce js size',
  openGraph: {
    title: 'JavaScript Minifier - Minify and Compress JS Online | PassZap',
    description: 'Free online JavaScript minifier tool. Compress and optimize your JS files by removing whitespace, comments, and shortening variables.',
    url: 'https://passzap.net/javascript-minifier',
    siteName: 'PassZap',
    images: [
      {
        url: '/og/javascript-minifier-og.png',
        width: 1200,
        height: 630,
        alt: 'PassZap JavaScript Minifier',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JavaScript Minifier - Minify and Compress JS Online | PassZap',
    description: 'Free online JavaScript minifier tool. Compress and optimize your JS files by removing whitespace, comments, and shortening variables.',
    images: ['/og/javascript-minifier-og.png'],
  },
  alternates: {
    canonical: 'https://passzap.net/javascript-minifier',
  },
};

export default function JavascriptMinifierPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <Header />
      
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Minifier */}
            <div className="lg:col-span-2">
              <JavascriptMinifier />
            </div>

            {/* Right Column - Info & Tips */}
            <div className="space-y-6">
              {/* Security Features */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-red-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Shield className="h-5 w-5 text-red-500 mr-2" />
                  Security Features
                </h3>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-start space-x-2">
                    <Zap className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Client-Side Processing</strong> - All minification happens in your browser</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Shield className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <span><strong>No Data Stored</strong> - Your JavaScript code never leaves your device</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Code className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Instant Processing</strong> - Real-time minification as you type</span>
                  </li>
                </ul>
              </div>

              {/* Features */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-red-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start space-x-2">
                    <Zap className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Advanced Compression</strong> - Remove whitespace, comments, and shorten variables</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <FileCode className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <span><strong>File Upload</strong> - Upload JS files directly</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Download className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Download & Copy</strong> - Save or copy minified code</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Copy className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Size Comparison</strong> - See before/after file sizes</span>
                  </div>
                </div>
              </div>

              {/* Benefits */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-red-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Benefits</h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <h4 className="font-semibold text-green-800 mb-1">🚀 Faster Execution</h4>
                    <p className="text-green-700">Smaller files parse and execute faster</p>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <h4 className="font-semibold text-blue-800 mb-1">📱 Improved UX</h4>
                    <p className="text-blue-700">Faster loading improves user engagement</p>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                    <h4 className="font-semibold text-purple-800 mb-1">💾 Reduced Bandwidth</h4>
                    <p className="text-purple-700">Lower data transfer and server costs</p>
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
              {jsMinifierFaqItems.map((faq, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-red-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>

          {/* SEO Content */}
          <div className="max-w-4xl mx-auto mt-12 prose prose-lg">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Free JavaScript Minifier & Optimizer
            </h2>
            
            <p className="text-gray-700 mb-4">
              Boost your website's performance with our advanced JavaScript minification tool. 
              Reduce JS file sizes by removing comments, whitespace, and shortening variable 
              names while maintaining full functionality. All processing is done securely in 
              your browser with no server uploads required.
            </p>

            <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
              Why Minify JavaScript?
            </h3>
            <p className="text-gray-700 mb-4">
              JavaScript minification significantly reduces file sizes, leading to faster 
              download times, quicker parsing, and improved website performance. This is 
              especially important for mobile users and can positively impact your search 
              engine rankings and user experience.
            </p>

            <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
              JavaScript Optimization Best Practices
            </h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Always maintain a development version with full comments and formatting</li>
              <li>Test minified code thoroughly in all target browsers</li>
              <li>Combine minification with other optimizations like code splitting</li>
              <li>Use source maps for debugging minified production code</li>
              <li>Consider using build tools with integrated minification pipelines</li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": jsMinifierFaqItems.map(faq => ({
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

const jsMinifierFaqItems = [
  {
    question: "Does minification change how my JavaScript works?",
    answer: "No, minification only removes unnecessary characters and shortens variable names in a way that preserves all functionality. The behavior of your code remains exactly the same."
  },
  {
    question: "How much size reduction can I expect?",
    answer: "Typically 50-80% reduction, depending on your original code. Files with extensive comments, whitespace, and long variable names see the biggest savings."
  },
  {
    question: "Can I minify ES6+ modern JavaScript?",
    answer: "Yes! Our minifier supports all modern JavaScript features including ES6+, async/await, arrow functions, and modern syntax."
  },
  {
    question: "Should I use minification for development?",
    answer: "No, minified code is hard to debug. Always use unminified code during development and only minify for production deployment."
  },
  {
    question: "Do you support JavaScript frameworks?",
    answer: "Our tool works with any JavaScript, including code from frameworks like React, Vue, Angular, and others. It processes the final compiled JavaScript."
  },
  {
    question: "Is there a file size limit for minification?",
    answer: "There's no strict limit, but very large JavaScript files may take longer to process. Most scripts process instantly in modern browsers."
  }
];