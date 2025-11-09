// app/css-minifier/page.tsx
import type { Metadata } from 'next';
import { Code, Zap, FileCode, Download, Copy, Shield } from 'lucide-react';
import CssMinifier from './../../components/utilities/minifiers/CssFormatter';
import Header from './../../components/layout/Header';
import Footer from './../../components/layout/Footer';

export const metadata: Metadata = {
  title: 'CSS Minifier - Minify and Compress CSS Online | PassZap',
  description: 'Free online CSS minifier tool. Compress and optimize your CSS files by removing whitespace, comments, and unnecessary characters. Reduce file size and improve website performance.',
  keywords: 'css minifier, css compressor, minify css, optimize css, css optimization, reduce css size',
  openGraph: {
    title: 'CSS Minifier - Minify and Compress CSS Online | PassZap',
    description: 'Free online CSS minifier tool. Compress and optimize your CSS files by removing whitespace, comments, and unnecessary characters.',
    url: 'https://passzap.net/css-minifier',
    siteName: 'PassZap',
    images: [
      {
        url: '/og/css-minifier-og.jpg',
        width: 1200,
        height: 630,
        alt: 'PassZap CSS Minifier',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CSS Minifier - Minify and Compress CSS Online | PassZap',
    description: 'Free online CSS minifier tool. Compress and optimize your CSS files by removing whitespace, comments, and unnecessary characters.',
    images: ['/og/css-minifier-og.jpg'],
  },
  alternates: {
    canonical: 'https://passzap.net/css-minifier',
  },
};

export default function CssMinifierPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <Header />
      
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Minifier */}
            <div className="lg:col-span-2">
              <CssMinifier />
            </div>

            {/* Right Column - Info & Tips */}
            <div className="space-y-6">
              {/* Security Features */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-orange-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Shield className="h-5 w-5 text-orange-500 mr-2" />
                  Security Features
                </h3>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-start space-x-2">
                    <Zap className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Client-Side Processing</strong> - All minification happens in your browser</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Shield className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                    <span><strong>No Data Stored</strong> - Your CSS code never leaves your device</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Code className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Instant Processing</strong> - Real-time minification as you type</span>
                  </li>
                </ul>
              </div>

              {/* Features */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-orange-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start space-x-2">
                    <Zap className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Advanced Compression</strong> - Remove whitespace, comments, and semicolons</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <FileCode className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                    <span><strong>File Upload</strong> - Upload CSS files directly</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Download className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Download & Copy</strong> - Save or copy minified code</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Copy className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Size Comparison</strong> - See before/after file sizes</span>
                  </div>
                </div>
              </div>

              {/* Benefits */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-orange-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Benefits</h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <h4 className="font-semibold text-green-800 mb-1">🚀 Faster Loading</h4>
                    <p className="text-green-700">Smaller files load quicker, improving user experience</p>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <h4 className="font-semibold text-blue-800 mb-1">📱 Better SEO</h4>
                    <p className="text-blue-700">Faster sites rank higher in search results</p>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                    <h4 className="font-semibold text-purple-800 mb-1">💾 Bandwidth Savings</h4>
                    <p className="text-purple-700">Reduce data transfer and server load</p>
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
              {cssMinifierFaqItems.map((faq, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-orange-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>

          {/* SEO Content */}
          <div className="max-w-4xl mx-auto mt-12 prose prose-lg">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Free CSS Minifier & Optimizer
            </h2>
            
            <p className="text-gray-700 mb-4">
              Optimize your website's performance with our free CSS minification tool. 
              Reduce CSS file sizes by up to 80% by removing unnecessary whitespace, 
              comments, and redundant code. All processing happens securely in your 
              browser with no file uploads required.
            </p>

            <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
              Why Minify CSS?
            </h3>
            <p className="text-gray-700 mb-4">
              Minifying CSS removes unnecessary characters without changing functionality, 
              resulting in smaller file sizes and faster page loads. This improves user 
              experience, reduces bandwidth usage, and can positively impact SEO rankings.
            </p>

            <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
              Best Practices for CSS Optimization
            </h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Always keep a development version with comments and formatting</li>
              <li>Test minified CSS thoroughly before deployment</li>
              <li>Combine CSS minification with other optimization techniques</li>
              <li>Use CSS compression in combination with gzip/brotli compression</li>
              <li>Consider using CSS frameworks with built-in minification</li>
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
            "mainEntity": cssMinifierFaqItems.map(faq => ({
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

const cssMinifierFaqItems = [
  {
    question: "Does minification break my CSS code?",
    answer: "No, our minifier is designed to remove only unnecessary characters like whitespace and comments while preserving all functionality. The minified CSS behaves exactly the same as the original."
  },
  {
    question: "How much file size reduction can I expect?",
    answer: "Typically 60-80% reduction, depending on your original CSS. Files with lots of comments and whitespace see the biggest savings."
  },
  {
    question: "Can I upload CSS files directly?",
    answer: "Yes! You can either paste your CSS code or upload .css files directly for minification. Both methods provide the same results."
  },
  {
    question: "Is the minified code still readable?",
    answer: "Minified code is optimized for size, not readability. It removes all unnecessary formatting. Always keep your original, formatted CSS for development."
  },
  {
    question: "Do you support CSS preprocessors?",
    answer: "Our tool works with any CSS, including output from preprocessors like Sass, Less, and Stylus. However, we recommend minifying the final CSS output."
  },
  {
    question: "Is there a file size limit?",
    answer: "There's no strict limit, but very large CSS files may take longer to process. Most stylesheets process instantly in the browser."
  }
];