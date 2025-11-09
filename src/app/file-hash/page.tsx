// app/file-hash-generator/page.tsx
import type { Metadata } from 'next';
import { Hash, Shield, Lock, Download, FileText, Cpu } from 'lucide-react';
import FileHashGenerator from '@/components/utilities/filehash/FileHashGenerator';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'File Hash Generator - Calculate MD5, SHA-1, SHA-256 Hashes | PassZap',
  description: 'Free online file hash generator. Calculate MD5, SHA-1, SHA-256, and other hash values for files. Verify file integrity and checksums securely in your browser.',
  keywords: 'file hash generator, md5 calculator, sha-256 generator, file checksum, hash calculator, file integrity',
  openGraph: {
    title: 'File Hash Generator - Calculate MD5, SHA-1, SHA-256 Hashes | PassZap',
    description: 'Free online file hash generator. Calculate MD5, SHA-1, SHA-256, and other hash values for files.',
    url: 'https://passzap.net/file-hash-generator',
    siteName: 'PassZap',
    images: [
      {
        url: '/og/file-hash-generator-og.jpg',
        width: 1200,
        height: 630,
        alt: 'PassZap File Hash Generator',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'File Hash Generator - Calculate MD5, SHA-1, SHA-256 Hashes | PassZap',
    description: 'Free online file hash generator. Calculate MD5, SHA-1, SHA-256, and other hash values for files.',
    images: ['/og/file-hash-generator-og.jpg'],
  },
  alternates: {
    canonical: 'https://passzap.net/file-hash-generator',
  },
};

export default function FileHashGeneratorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Header />
      
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Generator */}
            <div className="lg:col-span-2">
              <FileHashGenerator />
            </div>

            {/* Right Column - Info & Tips */}
            <div className="space-y-6">
              {/* Security Features */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Shield className="h-5 w-5 text-blue-500 mr-2" />
                  Security Features
                </h3>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-start space-x-2">
                    <Lock className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Client-Side Processing</strong> - Files never leave your browser</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Shield className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span><strong>No File Upload</strong> - All processing happens locally</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Cpu className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Fast Processing</strong> - Instant hash calculation</span>
                  </li>
                </ul>
              </div>

              {/* Features */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start space-x-2">
                    <Hash className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Multiple Algorithms</strong> - MD5, SHA-1, SHA-256, SHA-512</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <FileText className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Any File Type</strong> - Images, documents, executables, etc.</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Download className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Copy Results</strong> - Easy hash value copying</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Cpu className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Batch Processing</strong> - Hash multiple files at once</span>
                  </div>
                </div>
              </div>

              {/* Use Cases */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Common Use Cases</h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <h4 className="font-semibold text-green-800 mb-1">🔒 File Integrity</h4>
                    <ul className="space-y-1 text-green-700">
                      <li>• Verify downloaded files</li>
                      <li>• Check for corruption</li>
                      <li>• Validate backups</li>
                    </ul>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <h4 className="font-semibold text-blue-800 mb-1">🛡️ Security</h4>
                    <ul className="space-y-1 text-blue-700">
                      <li>• Verify software authenticity</li>
                      <li>• Detect file tampering</li>
                      <li>• Compare file versions</li>
                    </ul>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                    <h4 className="font-semibold text-purple-800 mb-1">💾 Development</h4>
                    <ul className="space-y-1 text-purple-700">
                      <li>• Asset version control</li>
                      <li>• Build verification</li>
                      <li>• Deployment checks</li>
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
              {hashFaqItems.map((faq, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-blue-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>

          {/* SEO Content */}
          <div className="max-w-4xl mx-auto mt-12 prose prose-lg">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Free File Hash Generator & Checksum Calculator
            </h2>
            
            <p className="text-gray-700 mb-4">
              Generate cryptographic hashes for any file with our secure online tool. 
              Calculate MD5, SHA-1, SHA-256, and SHA-512 hashes entirely in your browser 
              without uploading files to any server. Perfect for verifying file integrity, 
              checking downloads, and ensuring data security.
            </p>

            <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
              What Are File Hashes?
            </h3>
            <p className="text-gray-700 mb-4">
              A file hash is a unique digital fingerprint generated by a cryptographic algorithm. 
              Even the smallest change in a file produces a completely different hash value, 
              making hashes ideal for verifying file integrity, detecting corruption, and 
              ensuring files haven't been tampered with.
            </p>

            <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
              Common Hash Algorithms
            </h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li><strong>MD5</strong> - 128-bit hash, commonly used for file integrity checks</li>
              <li><strong>SHA-1</strong> - 160-bit hash, being phased out for security purposes</li>
              <li><strong>SHA-256</strong> - 256-bit hash, current security standard</li>
              <li><strong>SHA-512</strong> - 512-bit hash, highest security level</li>
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
            "mainEntity": hashFaqItems.map(faq => ({
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

const hashFaqItems = [
  {
    question: "Are my files uploaded to your servers?",
    answer: "No! All file processing happens entirely in your browser. Your files never leave your computer and are not uploaded to any server. This ensures complete privacy and security."
  },
  {
    question: "What's the maximum file size I can hash?",
    answer: "There's no strict limit, but very large files may take longer to process depending on your device's capabilities. Most files under 1GB process quickly on modern computers."
  },
  {
    question: "Which hash algorithm should I use?",
    answer: "For security purposes, use SHA-256 or SHA-512. For basic file integrity checks, MD5 is sufficient. SHA-1 should be avoided for security-sensitive applications."
  },
  {
    question: "Can I hash multiple files at once?",
    answer: "Yes! You can select multiple files or drag and drop several files to generate hashes for all of them simultaneously."
  },
  {
    question: "Why would I need to generate file hashes?",
    answer: "File hashes are useful for verifying download integrity, checking for file corruption, comparing files, verifying software authenticity, and ensuring files haven't been tampered with."
  },
  {
    question: "Do you support other hash algorithms?",
    answer: "Currently we support the most common algorithms: MD5, SHA-1, SHA-256, and SHA-512. These cover the vast majority of use cases for file hashing."
  }
];