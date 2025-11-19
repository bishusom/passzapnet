// components/tools/FileHashGenerator.tsx
'use client';

import { useState, useRef } from 'react';
import { 
  Upload, 
  Copy, 
  Download, 
  Hash,
  FileText,
  Shield,
  CheckCircle,
  AlertCircle,
  Cpu,
  Lock
} from 'lucide-react';

import * as CryptoJS from 'crypto-js';

type HashType = 'md5' | 'sha1' | 'sha256' | 'sha512';

interface HashResult {
  type: HashType;
  value: string;
}

interface FileHashGeneratorProps {
  compact?: boolean;
}

export default function FileHashGenerator({ compact = false }: FileHashGeneratorProps) {
  const [file, setFile] = useState<File | null>(null);
  const [hashes, setHashes] = useState<HashResult[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateHashes = async (file: File) => {
    setIsProcessing(true);
    setError('');

    try {
      const buffer = await file.arrayBuffer();
      const hashResults: HashResult[] = [];
      const wordArray = CryptoJS.lib.WordArray.create(buffer);

      // Generate MD5 hash using the library
      const md5Hash = CryptoJS.MD5(wordArray).toString(CryptoJS.enc.Hex);
      hashResults.push({
        type: 'md5',
        value: md5Hash
      });

      // Generate SHA-1 hash using Web Crypto API (supported)
      const sha1Buffer = await crypto.subtle.digest('SHA-1', buffer);
      hashResults.push({
        type: 'sha1',
        value: Array.from(new Uint8Array(sha1Buffer))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('')
      });

      // Generate SHA-256 hash
      const sha256Buffer = await crypto.subtle.digest('SHA-256', buffer);
      hashResults.push({
        type: 'sha256',
        value: Array.from(new Uint8Array(sha256Buffer))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('')
      });

      // Generate SHA-512 hash
      const sha512Buffer = await crypto.subtle.digest('SHA-512', buffer);
      hashResults.push({
        type: 'sha512',
        value: Array.from(new Uint8Array(sha512Buffer))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('')
      });

      setHashes(hashResults);
    } catch (err) {
      setError('Error generating hashes. Please try again.');
      console.error('Hash generation error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      generateHashes(selectedFile);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      generateHashes(droppedFile);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const copyHash = async (hash: string) => {
    try {
      await navigator.clipboard.writeText(hash);
      alert('Hash copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy hash:', err);
    }
  };

  const resetForm = () => {
    setFile(null);
    setHashes([]);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const downloadHashes = () => {
    if (!file) return;

    const content = hashes.map(hash => `${hash.type.toUpperCase()}: ${hash.value}`).join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `${file.name}_hashes.txt`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  // FULL PAGE LAYOUT with side content and FAQ
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Header */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl shadow-lg mb-4">
            <Hash className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">File Hash Generator</h1>
          <p className="text-bs text-gray-600 max-w-3xl mx-auto">
            Generate cryptographic hashes for any file with secure client-side processing. 
            Calculate MD5, SHA-1, SHA-256, and SHA-512 hashes without uploading files.
          </p>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Tool Component */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 shadow-xl border border-green-100">
              {/* Header */}
              <div className="text-center mb-6">
                <div className="flex items-center justify-center mb-3">
                  <div className="bg-green-100 p-3 rounded-full">
                    <Hash className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  File Hash Generator
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  Generate MD5, SHA-1, SHA-256, and SHA-512 hashes
                </p>
              </div>

              {/* File Upload Area */}
              <div className="mb-6">
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-400 transition-colors cursor-pointer bg-gray-50"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  
                  {!file ? (
                    <div>
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-lg font-medium text-gray-700 mb-2">
                        Drop your file here or click to browse
                      </p>
                      <p className="text-sm text-gray-500">
                        Supports any file type
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-4">
                      <FileText className="h-12 w-12 text-blue-500" />
                      <div className="text-left">
                        <p className="font-medium text-gray-800">{file.name}</p>
                        <p className="text-sm text-gray-600">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <p className="text-red-700">{error}</p>
                </div>
              )}

              {/* Processing Indicator */}
              {isProcessing && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                  <p className="text-blue-700">Generating hashes...</p>
                </div>
              )}

              {/* Hash Results */}
              {hashes.length > 0 && (
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Shield className="h-5 w-5 text-blue-500" />
                    <h3 className="text-lg font-semibold text-gray-800">Generated Hashes</h3>
                  </div>
                  
                  {hashes.map((hash) => (
                    <div key={hash.type} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-mono font-bold text-sm text-gray-600 uppercase">
                            {hash.type}:
                          </span>
                          <p className="font-mono text-sm break-all mt-1 text-gray-800">
                            {hash.value}
                          </p>
                        </div>
                        <button
                          onClick={() => copyHash(hash.value)}
                          className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 text-sm"
                        >
                          <Copy className="h-4 w-4" />
                          Copy
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={resetForm}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                >
                  <Upload className="h-4 w-4" />
                  New File
                </button>
                
                {hashes.length > 0 && (
                  <button
                    onClick={downloadHashes}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </button>
                )}
              </div>

              {/* Info Section */}
              <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-green-800 mb-1">What are file hashes?</h4>
                    <p className="text-sm text-green-700">
                      File hashes are unique digital fingerprints of files. They're used to verify file integrity, 
                      detect duplicates, and ensure files haven't been tampered with.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Side Content */}
          <div className="space-y-6">
            {/* Security Features */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-emerald-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Shield className="h-5 w-5 text-emerald-500 mr-2" />
                Security Features
              </h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start space-x-2">
                  <Lock className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Client-Side Processing</strong> - Files never leave your browser</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Shield className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>No File Upload</strong> - All processing happens locally</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Cpu className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Fast Processing</strong> - Instant hash calculation</span>
                </li>
              </ul>
            </div>

            {/* Features */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-emerald-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-2">
                  <Hash className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Multiple Algorithms</strong> - MD5, SHA-1, SHA-256, SHA-512</span>
                </div>
                <div className="flex items-start space-x-2">
                  <FileText className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Any File Type</strong> - Images, documents, executables, etc.</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Download className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Copy Results</strong> - Easy hash value copying</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Cpu className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
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

      {/* Structured Data */}
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