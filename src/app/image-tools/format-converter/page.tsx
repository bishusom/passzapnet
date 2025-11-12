// app/image-tools/format-converter/page.tsx
import type { Metadata } from 'next';
import { Upload, Download, RefreshCw, Image as ImageIcon, Shield, Zap } from 'lucide-react';
import ImageFormatConverter from '@/components/image-tools/ImageFormatConverter';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Image Format Converter - Convert PNG, JPEG, WebP Online | PassZap',
  description: 'Free online image format converter tool. Convert between PNG, JPEG, and WebP formats instantly in your browser. No file uploads required - all processing happens locally.',
  keywords: 'image converter, format converter, png to jpeg, jpeg to png, webp converter, image format, online image tool',
  openGraph: {
    title: 'Image Format Converter - Convert PNG, JPEG, WebP Online | PassZap',
    description: 'Free online image format converter tool. Convert between PNG, JPEG, and WebP formats instantly in your browser.',
    url: 'https://passzap.net/image-tools/format-converter',
    siteName: 'PassZap',
    images: [
      {
        url: '/og/image-converter-og.png',
        width: 1200,
        height: 630,
        alt: 'PassZap Image Format Converter',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Image Format Converter - Convert PNG, JPEG, WebP Online | PassZap',
    description: 'Free online image format converter tool. Convert between PNG, JPEG, and WebP formats instantly in your browser.',
    images: ['/og/image-converter-og.png'],
  },
  alternates: {
    canonical: 'https://passzap.net/image-tools/format-converter',
  },
};

export default function ImageFormatConverterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <Header />
      
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Converter */}
            <div className="lg:col-span-2">
              <ImageFormatConverter />
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
                    <RefreshCw className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Instant Processing</strong> - Real-time format conversion</span>
                  </li>
                </ul>
              </div>

              {/* Features */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-orange-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start space-x-2">
                    <RefreshCw className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Multiple Formats</strong> - Convert between PNG, JPEG, and WebP</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Upload className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Easy Upload</strong> - Drag & drop or click to upload images</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Download className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Instant Download</strong> - Save converted images immediately</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <ImageIcon className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Quality Preservation</strong> - Maintain image quality during conversion</span>
                  </div>
                </div>
              </div>

              {/* Benefits */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-orange-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Format Benefits</h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <h4 className="font-semibold text-blue-800 mb-1">🖼️ PNG</h4>
                    <p className="text-blue-700">Lossless compression, perfect for graphics with transparency</p>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <h4 className="font-semibold text-green-800 mb-1">📷 JPEG</h4>
                    <p className="text-green-700">Great for photos, smaller file sizes with adjustable quality</p>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                    <h4 className="font-semibold text-purple-800 mb-1">⚡ WebP</h4>
                    <p className="text-purple-700">Modern format, superior compression with transparency support</p>
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
              {imageConverterFaqItems.map((faq, index) => (
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
              Free Image Format Converter
            </h2>
            
            <p className="text-gray-700 mb-4">
              Convert your images between popular formats instantly with our free online tool. 
              Transform PNG, JPEG, and WebP files without compromising quality. All processing 
              happens securely in your browser with no file uploads required.
            </p>

            <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
              Why Convert Image Formats?
            </h3>
            <p className="text-gray-700 mb-4">
              Different image formats serve different purposes. PNG offers lossless compression 
              with transparency support, JPEG provides excellent compression for photographs, 
              and WebP delivers modern, efficient compression with broad compatibility. 
              Choosing the right format can significantly reduce file sizes while maintaining quality.
            </p>

            <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
              Best Practices for Image Format Conversion
            </h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Use PNG for graphics, logos, and images requiring transparency</li>
              <li>Choose JPEG for photographs and complex images with many colors</li>
              <li>Opt for WebP for modern web applications and better compression</li>
              <li>Always keep original high-quality versions of your images</li>
              <li>Consider your audience's browser compatibility when choosing formats</li>
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
            "mainEntity": imageConverterFaqItems.map(faq => ({
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

const imageConverterFaqItems = [
  {
    question: "Does the conversion affect image quality?",
    answer: "JPEG conversion uses lossy compression which may reduce quality slightly. PNG conversion is lossless and preserves original quality. WebP offers both lossy and lossless options with excellent compression."
  },
  {
    question: "What image formats can I convert from?",
    answer: "You can convert from any common image format including PNG, JPEG, WebP, GIF, BMP, and more. The tool accepts all major image file types supported by modern browsers."
  },
  {
    question: "Is there a file size limit for conversion?",
    answer: "There's no strict limit, but very large images may take longer to process. Most standard images convert instantly in the browser. For best performance, we recommend images under 10MB."
  },
  {
    question: "Can I convert multiple images at once?",
    answer: "Currently, our tool processes one image at a time to ensure optimal performance and quality. You can convert multiple images by repeating the process for each file."
  },
  {
    question: "Do you support transparency in conversions?",
    answer: "Yes! PNG to WebP conversions preserve transparency. When converting to JPEG, transparent areas become white since JPEG doesn't support transparency."
  },
  {
    question: "Is WebP supported by all browsers?",
    answer: "WebP is supported by all modern browsers including Chrome, Firefox, Edge, and Safari. For older browsers, consider providing fallback formats like JPEG or PNG."
  }
];