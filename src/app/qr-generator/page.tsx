// app/qr-code-generator/page.tsx
import type { Metadata } from 'next';
import { QrCode, Shield, Zap, Download, Copy, Scan, Palette } from 'lucide-react';
import QrCodeGenerator from './../../components/utilities/qrcode/QrCodeGenerator';
import Header from './../../components/layout/Header';
import Footer from './../../components/layout/Footer';

export const metadata: Metadata = {
  title: 'QR Code Generator - Create Custom QR Codes Online | PassZap',
  description: 'Free online QR code generator. Create custom QR codes for URLs, text, contact info, WiFi, and more. Customize colors, size, and download in high quality.',
  keywords: 'qr code generator, qr code creator, custom qr code, qr code maker, qr code download, qr code png, qr code svg',
  openGraph: {
    title: 'QR Code Generator - Create Custom QR Codes Online | PassZap',
    description: 'Free online QR code generator. Create custom QR codes for URLs, text, contact info, WiFi, and more.',
    url: 'https://passzap.net/qr-code-generator',
    siteName: 'PassZap',
    images: [
      {
        url: '/og/qrcode-generator-og.png',
        width: 1200,
        height: 630,
        alt: 'PassZap QR Code Generator',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QR Code Generator - Create Custom QR Codes Online | PassZap',
    description: 'Free online QR code generator. Create custom QR codes for URLs, text, contact info, WiFi, and more.',
    images: ['/og/qrcode-generator-og.png'],
  },
  alternates: {
    canonical: 'https://passzap.net/qr-code-generator',
  },
};

export default function QrCodeGeneratorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <Header />
      
      <main className="py-8">
        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Generator */}
            <div className="lg:col-span-2">
              <QrCodeGenerator />
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
                    <span><strong>Client-Side Generation</strong> - All QR codes created in your browser</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Shield className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span><strong>No Data Stored</strong> - Your content never leaves your device</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <QrCode className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Instant Generation</strong> - Real-time QR code preview</span>
                  </li>
                </ul>
              </div>

              {/* Features */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-emerald-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start space-x-2">
                    <Palette className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Custom Colors</strong> - Choose any foreground and background colors</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Download className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Multiple Formats</strong> - Download as PNG or SVG</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Scan className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span><strong>High Quality</strong> - Crisp, scalable QR codes</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Copy className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Multiple Types</strong> - URLs, text, WiFi, contact info, and more</span>
                  </div>
                </div>
              </div>

              {/* Use Cases */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-emerald-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Use Cases</h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <h4 className="font-semibold text-blue-800 mb-1">🌐 Websites & Links</h4>
                    <ul className="space-y-1 text-blue-700">
                      <li>• Share website URLs</li>
                      <li>• Social media profiles</li>
                      <li>• Download links</li>
                    </ul>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <h4 className="font-semibold text-green-800 mb-1">📱 Mobile & Business</h4>
                    <ul className="space-y-1 text-green-700">
                      <li>• WiFi network sharing</li>
                      <li>• Contact information</li>
                      <li>• Event details</li>
                    </ul>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                    <h4 className="font-semibold text-purple-800 mb-1">🎨 Marketing</h4>
                    <ul className="space-y-1 text-purple-700">
                      <li>• Business cards</li>
                      <li>• Flyers and posters</li>
                      <li>• Product packaging</li>
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
              {qrCodeFaqItems.map((faq, index) => (
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
              Free Online QR Code Generator
            </h2>
            
            <p className="text-gray-700 mb-4">
              Create professional QR codes instantly with our free online generator. 
              Whether you need to share website links, contact information, WiFi credentials, 
              or any other data, our tool provides high-quality, customizable QR codes with 
              complete client-side processing for maximum privacy.
            </p>

            <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
              What Are QR Codes?
            </h3>
            <p className="text-gray-700 mb-4">
              QR (Quick Response) codes are two-dimensional barcodes that can store various types 
              of information. They're widely used for sharing URLs, contact details, product information, 
              and more. QR codes can be scanned by smartphone cameras, making them incredibly convenient 
              for mobile users.
            </p>

            <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
              Best Practices for QR Codes
            </h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Use high contrast colors for better scannability</li>
              <li>Test your QR code with multiple devices before distribution</li>
              <li>Include a call-to-action near the QR code</li>
              <li>Ensure sufficient quiet zone (white space) around the code</li>
              <li>Choose appropriate size for your use case (larger for distance scanning)</li>
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
            "mainEntity": qrCodeFaqItems.map(faq => ({
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

const qrCodeFaqItems = [
  {
    question: "Is there a limit to how much data a QR code can store?",
    answer: "QR codes can store up to 4,296 alphanumeric characters or 2,953 bytes of binary data. For most use cases like URLs, contact info, or WiFi credentials, this is more than sufficient."
  },
  {
    question: "Can I customize the colors of my QR code?",
    answer: "Yes! Our generator allows you to choose any colors for both the foreground (dots) and background. We recommend using high-contrast colors for better scannability."
  },
  {
    question: "What's the difference between PNG and SVG downloads?",
    answer: "PNG is a raster format ideal for web use and printing. SVG is a vector format that can be scaled to any size without quality loss, perfect for logos and designs."
  },
  {
    question: "Are the generated QR codes scannable by all devices?",
    answer: "Yes, our QR codes follow the standard QR code specification and are compatible with all modern smartphones and QR code scanner apps."
  },
  {
    question: "Can I generate QR codes for WiFi networks?",
    answer: "Absolutely! Use the WiFi option to generate QR codes that automatically connect devices to your WiFi network when scanned."
  },
  {
    question: "Is my data secure when generating QR codes?",
    answer: "Yes! All QR code generation happens entirely in your browser. We never send your data to our servers or store it anywhere. Your information remains completely private."
  }
];