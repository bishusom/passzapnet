// app/image-tools/resizer/page.tsx
import type { Metadata } from 'next';
import { Download, Scaling, FileArchive, Shield, Zap, Image as ImageIcon } from 'lucide-react';
import ImageResizer from '@/components/image-tools/ImageResizer';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Image Resizer - Resize & Compress Images Online | PassZap',
  description: 'Free online image resizer tool. Resize and compress images to specific dimensions while maintaining quality. Reduce file sizes for web, social media, and email.',
  keywords: 'image resizer, photo resizer, compress images, resize photos, image compressor, online image tool',
  openGraph: {
    title: 'Image Resizer - Resize & Compress Images Online | PassZap',
    description: 'Free online image resizer tool. Resize and compress images to specific dimensions while maintaining quality.',
    url: 'https://passzap.net/image-tools/image-resizer',
    siteName: 'PassZap',
    images: [
      {
        url: '/og/image-resizer-og.png',
        width: 1200,
        height: 630,
        alt: 'PassZap Image Resizer',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Image Resizer - Resize & Compress Images Online | PassZap',
    description: 'Free online image resizer tool. Resize and compress images to specific dimensions while maintaining quality.',
    images: ['/og/image-resizer-og.png'],
  },
  alternates: {
    canonical: 'https://passzap.net/image-tools/image-resizer',
  },
};

export default function ImageResizerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <Header />
      
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Resizer */}
            <div className="lg:col-span-2">
              <ImageResizer />
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
                    <span><strong>Client-Side Processing</strong> - All resizing happens in your browser</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Shield className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                    <span><strong>No Data Stored</strong> - Your images never leave your device</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Scaling className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Instant Processing</strong> - Real-time resizing and compression</span>
                  </li>
                </ul>
              </div>

              {/* Features */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-orange-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start space-x-2">
                    <Scaling className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Custom Dimensions</strong> - Set exact width and height in pixels</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <FileArchive className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Quality Control</strong> - Adjust compression quality with slider</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Download className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Size Comparison</strong> - See before/after file sizes</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <ImageIcon className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Multiple Formats</strong> - Supports JPG, PNG, WebP, and more</span>
                  </div>
                </div>
              </div>

              {/* Benefits */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-orange-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Use Cases</h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <h4 className="font-semibold text-green-800 mb-1">🌐 Website Optimization</h4>
                    <p className="text-green-700">Resize images for faster loading web pages</p>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <h4 className="font-semibold text-blue-800 mb-1">📱 Social Media</h4>
                    <p className="text-blue-700">Optimize images for Instagram, Facebook, Twitter</p>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                    <h4 className="font-semibold text-purple-800 mb-1">📧 Email Attachments</h4>
                    <p className="text-purple-700">Reduce file sizes for easier email sharing</p>
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
              {imageResizerFaqItems.map((faq, index) => (
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
              Free Image Resizer & Compressor
            </h2>
            
            <p className="text-gray-700 mb-4">
              Optimize your images for any purpose with our free online image resizer. 
              Resize photos to exact dimensions, compress file sizes, and maintain 
              visual quality. All processing happens securely in your browser with 
              no file uploads required.
            </p>

            <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
              Why Resize Images?
            </h3>
            <p className="text-gray-700 mb-4">
              Properly sized images load faster, use less bandwidth, and provide 
              better user experiences. Oversized images slow down websites, increase 
              hosting costs, and frustrate users on mobile devices or slow connections.
            </p>

            <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
              Best Practices for Image Resizing
            </h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Maintain aspect ratio to prevent distortion</li>
              <li>Use quality settings between 70-85% for optimal compression</li>
              <li>Resize images to match their display size on your website</li>
              <li>Keep original high-resolution versions for future use</li>
              <li>Consider creating multiple sizes for responsive designs</li>
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
            "mainEntity": imageResizerFaqItems.map(faq => ({
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

const imageResizerFaqItems = [
  {
    question: "Does resizing affect image quality?",
    answer: "Resizing maintains quality when reducing dimensions. Compression quality can be adjusted with the slider - higher values preserve more detail, lower values create smaller files."
  },
  {
    question: "What image formats are supported?",
    answer: "We support all major image formats including JPG, PNG, WebP, GIF, and BMP. The resized output is always in JPEG format for optimal compression."
  },
  {
    question: "Is there a file size limit for resizing?",
    answer: "There's no strict limit, but very large images may take longer to process. For best performance, we recommend images under 10MB. Most standard photos process instantly."
  },
  {
    question: "Can I maintain the aspect ratio?",
    answer: "Yes! When you upload an image, the original aspect ratio is preserved. You can adjust width and height independently, but we recommend maintaining proportions to avoid distortion."
  },
  {
    question: "What's the maximum resolution I can resize to?",
    answer: "You can resize up to 8192x8192 pixels. For most web purposes, resolutions between 800-2000 pixels wide are optimal."
  },
  {
    question: "Do you support batch processing?",
    answer: "Currently, our tool processes one image at a time to ensure optimal quality and performance. You can resize multiple images by repeating the process for each file."
  }
];