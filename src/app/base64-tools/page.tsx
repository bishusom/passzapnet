// app/base64-encoder/page.tsx
import type { Metadata } from 'next';
import { Code, Shield, Zap, Copy, RotateCcw, CheckCircle } from 'lucide-react';
import Base64Tool from './../../components/utilities/base64/Base64Tool';
import Header from './../../components/layout/Header';
import Footer from './../../components/layout/Footer';

export const metadata: Metadata = {
  title: 'Base64 Encoder & Decoder - Online Text & File Converter | PassZap',
  description: 'Free online Base64 encoder and decoder tool. Convert text, files, and images to Base64 format instantly. No data stored, completely client-side processing.',
  keywords: 'base64 encoder, base64 decoder, base64 converter, text to base64, base64 to text, file encoding, data uri',
  openGraph: {
    title: 'Base64 Encoder & Decoder - Online Text & File Converter | PassZap',
    description: 'Free online Base64 encoder and decoder tool. Convert text, files, and images to Base64 format instantly.',
    url: 'https://passzap.net/base64-encoder',
    siteName: 'PassZap',
    images: [
      {
        url: '/og/base64-encoder-og.png',
        width: 1200,
        height: 630,
        alt: 'PassZap Base64 Encoder & Decoder',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Base64 Encoder & Decoder - Online Text & File Converter | PassZap',
    description: 'Free online Base64 encoder and decoder tool. Convert text, files, and images to Base64 format instantly.',
    images: ['/og/base64-encoder-og.png'],
  },
  alternates: {
    canonical: 'https://passzap.net/base64-encoder',
  },
};

export default function Base64EncoderPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <Header />
      
      <main className="py-8">
        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Tool */}
            <div className="lg:col-span-2">
              <Base64Tool />
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
                    <span><strong>Client-Side Processing</strong> - All encoding happens in your browser</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Shield className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span><strong>No Data Stored</strong> - We never see or store your data</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Code className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Instant Results</strong> - Real-time encoding and decoding</span>
                  </li>
                </ul>
              </div>

              {/* Use Cases */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-emerald-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Common Use Cases</h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <h4 className="font-semibold text-blue-800 mb-1">🌐 Web Development</h4>
                    <ul className="space-y-1 text-blue-700">
                      <li>• Data URI generation for images</li>
                      <li>• API request encoding</li>
                      <li>• CSS background images</li>
                    </ul>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <h4 className="font-semibold text-green-800 mb-1">📧 Email & Documents</h4>
                    <ul className="space-y-1 text-green-700">
                      <li>• Embed images in HTML emails</li>
                      <li>• Encode binary attachments</li>
                      <li>• Data transmission</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Tips */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-emerald-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Pro Tips</h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start space-x-2">
                    <Copy className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Quick Copy:</strong> Click the copy button for instant results</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <RotateCcw className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Bidirectional:</strong> Encode text or decode Base64 strings</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span><strong>File Support:</strong> Convert images and files to Base64</span>
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
              {base64FaqItems.map((faq, index) => (
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
              Free Online Base64 Encoder & Decoder
            </h2>
            
            <p className="text-gray-700 mb-4">
              Base64 encoding is essential for transmitting binary data over text-based protocols. 
              Our tool provides instant conversion between text and Base64 format with complete 
              client-side processing for maximum security.
            </p>

            <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
              What is Base64 Encoding?
            </h3>
            <p className="text-gray-700 mb-4">
              Base64 is a binary-to-text encoding scheme that represents binary data in an ASCII string format. 
              It's commonly used to encode binary data like images, files, or any binary content that needs to 
              be stored and transferred over media designed to deal with text.
            </p>

            <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
              Common Applications
            </h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Embed images directly in HTML or CSS using Data URIs</li>
              <li>Encode file attachments for email transmission</li>
              <li>Store binary data in JSON or XML formats</li>
              <li>Encode authentication tokens and API data</li>
              <li>Transfer binary data over text-only protocols</li>
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
            "mainEntity": base64FaqItems.map(faq => ({
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

const base64FaqItems = [
  {
    question: "Is my data secure when using the Base64 tool?",
    answer: "Yes! All encoding and decoding happens entirely in your browser. We never send your data to our servers or store it anywhere. Your data remains completely private and secure."
  },
  {
    question: "What types of files can I encode to Base64?",
    answer: "You can encode any file type including images (PNG, JPG, GIF), documents (PDF, DOC), and binary files. The tool supports files up to 10MB in size for optimal performance."
  },
  {
    question: "What is the difference between encoding and decoding?",
    answer: "Encoding converts regular text or binary data into Base64 format. Decoding converts Base64 strings back to their original text or binary form. Our tool handles both directions seamlessly."
  },
  {
    question: "Can I use Base64 for large files?",
    answer: "While Base64 can handle large files, it increases the data size by about 33%. For very large files, consider alternative methods as browser memory limitations may apply."
  },
  {
    question: "What are Data URIs and how are they related to Base64?",
    answer: "Data URIs allow you to embed files directly in HTML or CSS. They often use Base64 encoding to represent the file data within the URI string, eliminating the need for separate file requests."
  },
  {
    question: "Is Base64 encryption?",
    answer: "No, Base64 is encoding, not encryption. It doesn't provide security or confidentiality. Anyone can decode Base64 data back to its original form. For security, use proper encryption methods."
  }
];