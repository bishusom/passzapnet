// app/image-tools/image-to-base64/page.tsx
import type { Metadata } from 'next';
import { Copy, Download, Code, Shield, Zap, FileCode } from 'lucide-react';
import ImageToBase64 from '@/components/image-tools/ImageToBase64';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Image to Base64 Converter - Convert Images to Data URLs | PassZap',
  description: 'Free online image to Base64 converter tool. Convert images to Base64 data URLs for embedding in HTML, CSS, or JavaScript. No server uploads required.',
  keywords: 'base64 converter, image to base64, data url, base64 image, html embedding, css background, online converter',
  openGraph: {
    title: 'Image to Base64 Converter - Convert Images to Data URLs | PassZap',
    description: 'Free online image to Base64 converter tool. Convert images to Base64 data URLs for embedding in HTML, CSS, or JavaScript.',
    url: 'https://passzap.net/image-tools/image-to-base64',
    siteName: 'PassZap',
    images: [
      {
        url: '/og/base64-converter-og.png',
        width: 1200,
        height: 630,
        alt: 'PassZap Base64 Converter',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Image to Base64 Converter - Convert Images to Data URLs | PassZap',
    description: 'Free online image to Base64 converter tool. Convert images to Base64 data URLs for embedding in HTML, CSS, or JavaScript.',
    images: ['/og/base64-converter-og.png'],
  },
  alternates: {
    canonical: 'https://passzap.net/image-tools/image-to-base64',
  },
};

export default function ImageToBase64Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <Header />
      
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Converter */}
            <div className="lg:col-span-2">
              <ImageToBase64 />
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
                    <span><strong>Client-Side Processing</strong> - All conversion happens in your browser</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Shield className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                    <span><strong>No Data Stored</strong> - Your images never leave your device</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Code className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Instant Conversion</strong> - Real-time Base64 encoding</span>
                  </li>
                </ul>
              </div>

              {/* Features */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-orange-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start space-x-2">
                    <Code className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Multiple Formats</strong> - Output as PNG, JPEG, or WebP</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Copy className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Copy Options</strong> - Copy full data URL or base64 data only</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Download className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Download</strong> - Save Base64 data as text file</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <FileCode className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Size Information</strong> - See character count and data size</span>
                  </div>
                </div>
              </div>

              {/* Benefits */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-orange-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Use Cases</h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <h4 className="font-semibold text-green-800 mb-1">🎨 CSS Backgrounds</h4>
                    <p className="text-green-700">Embed small images directly in CSS files</p>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <h4 className="font-semibold text-blue-800 mb-1">📄 HTML Embedding</h4>
                    <p className="text-blue-700">Include images in HTML without separate files</p>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                    <h4 className="font-semibold text-purple-800 mb-1">⚡ Performance</h4>
                    <p className="text-purple-700">Reduce HTTP requests for faster loading</p>
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
              {base64ConverterFaqItems.map((faq, index) => (
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
              Free Image to Base64 Converter
            </h2>
            
            <p className="text-gray-700 mb-4">
              Convert your images to Base64 data URLs instantly with our free online tool. 
              Embed images directly in HTML, CSS, or JavaScript code without separate file 
              dependencies. All processing happens securely in your browser with no server 
              uploads required.
            </p>

            <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
              What are Base64 Data URLs?
            </h3>
            <p className="text-gray-700 mb-4">
              Base64 data URLs allow you to embed binary data (like images) directly into 
              text-based files. The image data is encoded as ASCII text, making it possible 
              to include images in CSS, HTML, or JavaScript without separate HTTP requests.
            </p>

            <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
              When to Use Base64 Images
            </h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Small icons and graphics for CSS backgrounds</li>
              <li>Favicons and site logos</li>
              <li>Images in email templates</li>
              <li>Single-page applications with few images</li>
              <li>Development and prototyping</li>
              <li>When you want to reduce HTTP requests</li>
            </ul>

            <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
              Best Practices for Base64 Images
            </h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Use for small images (under 10KB for optimal performance)</li>
              <li>Avoid using for large photographs or complex graphics</li>
              <li>Consider browser caching benefits of external images</li>
              <li>Test across different browsers for compatibility</li>
              <li>Use gzip compression on your server for CSS/HTML files</li>
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
            "mainEntity": base64ConverterFaqItems.map(faq => ({
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

const base64ConverterFaqItems = [
  {
    question: "What is the difference between data URL and base64 data?",
    answer: "The data URL includes the MIME type prefix (e.g., 'data:image/png;base64,'), while the base64 data is just the encoded string. Use the full data URL for direct embedding in HTML/CSS."
  },
  {
    question: "Are there file size limitations for Base64 conversion?",
    answer: "There's no strict limit, but very large images will create very long Base64 strings. For web performance, we recommend converting images under 50KB. Base64 increases file size by about 33%."
  },
  {
    question: "Can Base64 images be cached by browsers?",
    answer: "Base64 images embedded in CSS or HTML are cached along with the containing file. However, external images can be cached independently and may be more efficient for frequently changed images."
  },
  {
    question: "Do all browsers support Base64 images?",
    answer: "Yes, all modern browsers support Base64 data URLs in HTML, CSS, and JavaScript. This includes Chrome, Firefox, Safari, Edge, and mobile browsers."
  },
  {
    question: "What image formats work best for Base64 conversion?",
    answer: "PNG works well for graphics with transparency, JPEG for photographs, and WebP for modern compression. Choose based on your image type and browser support requirements."
  },
  {
    question: "Can I convert Base64 back to an image?",
    answer: "Yes, Base64 data can be decoded back to the original image format. Many image editors and online tools can convert Base64 strings back to image files."
  }
];