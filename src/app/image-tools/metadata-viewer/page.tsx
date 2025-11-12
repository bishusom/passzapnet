// app/image-tools/metadata-viewer/page.tsx
import type { Metadata } from 'next';
import { Download, Eye, FileText, Trash2, Shield, Zap } from 'lucide-react';
import ImageMetadataViewer from '@/components/image-tools/ImageMetadataViewer';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Image Metadata Viewer - View & Strip EXIF Data Online | PassZap',
  description: 'Free online image metadata viewer and stripper. View EXIF data, GPS location, camera settings and strip sensitive metadata for privacy protection. All processing happens in your browser.',
  keywords: 'image metadata, exif viewer, metadata stripper, privacy tool, exif data, image privacy, online metadata tool',
  openGraph: {
    title: 'Image Metadata Viewer - View & Strip EXIF Data Online | PassZap',
    description: 'Free online image metadata viewer and stripper. View EXIF data, GPS location, camera settings and strip sensitive metadata for privacy protection.',
    url: 'https://passzap.net/image-tools/metadata-viewer',
    siteName: 'PassZap',
    images: [
      {
        url: '/og/metadata-viewer-og.png',
        width: 1200,
        height: 630,
        alt: 'PassZap Image Metadata Viewer',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Image Metadata Viewer - View & Strip EXIF Data Online | PassZap',
    description: 'Free online image metadata viewer and stripper. View EXIF data, GPS location, camera settings and strip sensitive metadata for privacy protection.',
    images: ['/og/metadata-viewer-og.png'],
  },
  alternates: {
    canonical: 'https://passzap.net/image-tools/metadata-viewer',
  },
};

export default function ImageMetadataViewerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <Header />
      
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Metadata Viewer */}
            <div className="lg:col-span-2">
              <ImageMetadataViewer />
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
                    <span><strong>Client-Side Processing</strong> - All analysis happens in your browser</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Shield className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                    <span><strong>No Data Stored</strong> - Your images never leave your device</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Eye className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Instant Analysis</strong> - View metadata in real-time</span>
                  </li>
                </ul>
              </div>

              {/* Features */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-orange-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start space-x-2">
                    <Eye className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Metadata Analysis</strong> - View file info and basic EXIF data</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Trash2 className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Privacy Protection</strong> - Strip sensitive metadata completely</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Download className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Clean Downloads</strong> - Download images without metadata</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <FileText className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Detailed Information</strong> - See file size, dimensions, and more</span>
                  </div>
                </div>
              </div>

              {/* Benefits */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-orange-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacy Benefits</h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <h4 className="font-semibold text-red-800 mb-1">📍 GPS Location</h4>
                    <p className="text-red-700">Remove exact location data from photos</p>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                    <h4 className="font-semibold text-purple-800 mb-1">📷 Camera Info</h4>
                    <p className="text-purple-700">Strip camera model and settings data</p>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <h4 className="font-semibold text-green-800 mb-1">🕒 Timestamps</h4>
                    <p className="text-green-700">Remove creation and modification dates</p>
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
              {metadataViewerFaqItems.map((faq, index) => (
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
              Free Image Metadata Viewer & Stripper
            </h2>
            
            <p className="text-gray-700 mb-4">
              Protect your privacy by viewing and removing hidden metadata from your images. 
              Our tool reveals EXIF data, GPS coordinates, camera information, and timestamps 
              that could compromise your privacy when sharing photos online.
            </p>

            <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
              What is Image Metadata?
            </h3>
            <p className="text-gray-700 mb-4">
              Image metadata (EXIF data) is hidden information stored within image files by 
              cameras and smartphones. This can include GPS coordinates, camera model, 
              aperture settings, shutter speed, and even the exact date and time the photo 
              was taken. While useful for photography, this data can pose privacy risks.
            </p>

            <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
              Why Remove Image Metadata?
            </h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Protect your location privacy when sharing photos online</li>
              <li>Prevent tracking of your daily routines and habits</li>
              <li>Secure your home address and frequently visited locations</li>
              <li>Maintain anonymity on social media and forums</li>
              <li>Comply with privacy regulations when sharing images publicly</li>
            </ul>

            <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
              Common Metadata Types Found in Images
            </h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li><strong>GPS Coordinates</strong> - Exact location where photo was taken</li>
              <li><strong>Camera Information</strong> - Make, model, and serial number</li>
              <li><strong>Camera Settings</strong> - Aperture, ISO, focal length, exposure</li>
              <li><strong>Date & Time</strong> - Exact timestamp of when photo was captured</li>
              <li><strong>Software Information</strong> - Editing software and version used</li>
              <li><strong>Thumbnail</strong> - Small preview image embedded in the file</li>
            </ul>

            <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
              Best Practices for Image Privacy
            </h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Always strip metadata before sharing photos on social media</li>
              <li>Be especially careful with photos taken at home or work</li>
              <li>Consider disabling location services in your camera app</li>
              <li>Use this tool before uploading images to public websites</li>
              <li>Keep original files with metadata for your personal archive</li>
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
            "mainEntity": metadataViewerFaqItems.map(faq => ({
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

const metadataViewerFaqItems = [
  {
    question: "What types of metadata can this tool detect?",
    answer: "Our tool detects basic file metadata including file name, size, type, and dimensions. For comprehensive EXIF data (GPS, camera settings), specialized EXIF libraries are needed, but our stripper removes all embedded metadata effectively."
  },
  {
    question: "Does stripping metadata affect image quality?",
    answer: "No, stripping metadata only removes the hidden information embedded in the image file. The visual quality, dimensions, and colors of the image remain completely unchanged."
  },
  {
    question: "Can I recover metadata after stripping it?",
    answer: "No, once metadata is stripped and you download the clean image, the metadata is permanently removed. Always keep your original files if you need to preserve the metadata for personal use."
  },
  {
    question: "Do all images contain metadata?",
    answer: "Most images from digital cameras and smartphones contain extensive metadata. Screenshots and images that have been heavily processed or converted multiple times may have less or no metadata."
  },
  {
    question: "Is it legal to remove metadata from images?",
    answer: "Yes, it's completely legal to remove metadata from your own images for privacy reasons. However, be aware that removing metadata from images you don't own or that are used as evidence may have legal implications."
  },
  {
    question: "What image formats support metadata?",
    answer: "JPEG and TIFF files typically contain the most extensive metadata. PNG files can contain some metadata, while GIF files usually contain very little. Our tool works with all common image formats."
  }
];