// components/tools/Base64Tool.tsx
'use client';

import { useState, useRef } from 'react';
import { 
  Code, 
  FileText, 
  Copy, 
  RotateCcw, 
  Upload,
  CheckCircle,
  AlertCircle,
  Shield,
  Zap
} from 'lucide-react';

export default function Base64Tool() {
  const [inputText, setInputText] = useState<string>('');
  const [outputText, setOutputText] = useState<string>('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [fileName, setFileName] = useState<string>('');
  const [fileSize, setFileSize] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEncode = () => {
    try {
      setError('');
      if (mode === 'encode') {
        const encoded = btoa(unescape(encodeURIComponent(inputText)));
        setOutputText(encoded);
      } else {
        const decoded = decodeURIComponent(escape(atob(inputText)));
        setOutputText(decoded);
      }
    } catch (err) {
      setError('Invalid input for the selected operation. Please check your data.');
      setOutputText('');
    }
  };

  const handleDecode = () => {
    setMode(mode === 'encode' ? 'decode' : 'encode');
    // Swap input and output when switching modes
    const temp = inputText;
    setInputText(outputText);
    setOutputText(temp);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(outputText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleClear = () => {
    setInputText('');
    setOutputText('');
    setFileName('');
    setFileSize('');
    setError('');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setFileSize(formatFileSize(file.size));

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setError('File size too large. Please select a file smaller than 10MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const uint8Array = new Uint8Array(arrayBuffer);
        let binary = '';
        uint8Array.forEach(byte => {
          binary += String.fromCharCode(byte);
        });
        const base64 = btoa(binary);
        setInputText(base64);
        setMode('decode'); // Auto-switch to decode mode for file input
        setError('');
      } catch (err) {
        setError('Failed to process the file. Please try another file.');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Header */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl shadow-lg mb-4">
            <Code className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Base64 Encoder & Decoder</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Convert text and files to Base64 format instantly with secure client-side processing. 
            No data stored, completely private encoding and decoding.
          </p>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Tool Component */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 shadow-xl border border-emerald-100">
              {/* Header */}
              <div className="text-center mb-6">
                <div className="flex items-center justify-center mb-3">
                  <div className="bg-emerald-100 p-3 rounded-full">
                    <Code className="h-6 w-6 text-emerald-600" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Base64 Encoder & Decoder
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  Convert text and files to Base64 format
                </p>
              </div>

              {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-4 text-sm">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Mode Toggle */}
              <div className="flex items-center justify-center mb-6">
                <div className="bg-gray-100 rounded-lg p-1 flex">
                  <button
                    onClick={() => setMode('encode')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      mode === 'encode'
                        ? 'bg-emerald-500 text-white shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Encode
                  </button>
                  <button
                    onClick={() => setMode('decode')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      mode === 'decode'
                        ? 'bg-emerald-500 text-white shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Decode
                  </button>
                </div>
              </div>

              {/* File Upload Section */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    File Upload (Optional)
                  </label>
                  {fileName && (
                    <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                      {fileName} • {fileSize}
                    </span>
                  )}
                </div>
                <div className="flex gap-3">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="hidden"
                    accept="*/*"
                  />
                  <button
                    onClick={triggerFileInput}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-emerald-400 hover:bg-emerald-50 transition-colors text-gray-600"
                  >
                    <Upload className="h-4 w-4" />
                    <span className="text-sm">Choose File</span>
                  </button>
                </div>
              </div>

              {/* Input Section */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  {mode === 'encode' ? 'Text to Encode' : 'Base64 to Decode'}
                </label>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={
                    mode === 'encode' 
                      ? 'Enter text to encode to Base64...' 
                      : 'Paste Base64 string to decode...'
                  }
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none font-mono text-sm"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mb-6">
                <button
                  onClick={handleEncode}
                  className="flex-1 bg-emerald-500 text-white py-3 px-4 rounded-lg hover:bg-emerald-600 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  {mode === 'encode' ? 'Encode to Base64' : 'Decode from Base64'}
                </button>
                
                <button
                  onClick={handleDecode}
                  className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 flex items-center justify-center"
                  title="Switch between encode/decode"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
                
                <button
                  onClick={handleClear}
                  className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 flex items-center justify-center"
                  title="Clear all"
                >
                  <span className="text-lg">×</span>
                </button>
              </div>

              {/* Output Section */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    {mode === 'encode' ? 'Base64 Output' : 'Decoded Text'}
                  </label>
                  <div className="flex items-center gap-2">
                    {outputText && (
                      <button
                        onClick={handleCopy}
                        className="flex items-center gap-1 px-3 py-1 text-xs bg-emerald-500 text-white rounded hover:bg-emerald-600 transition-colors"
                      >
                        {copied ? (
                          <>
                            <CheckCircle className="h-3 w-3" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" />
                            Copy
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
                <div className="relative">
                  <textarea
                    value={outputText}
                    readOnly
                    placeholder={
                      mode === 'encode' 
                        ? 'Base64 encoded result will appear here...' 
                        : 'Decoded text will appear here...'
                    }
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 resize-none font-mono text-sm"
                  />
                </div>
              </div>

              {/* Character Count */}
              <div className="flex justify-between text-xs text-gray-500">
                <span>Input: {inputText.length} characters</span>
                <span>Output: {outputText.length} characters</span>
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