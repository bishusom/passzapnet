// components/tools/ImageToBase64.tsx
'use client';

import { useState, useRef } from 'react';
import { 
  Upload, 
  Copy, 
  Download, 
  Code,
  Image as ImageIcon,
  CheckCircle,
  Shield,
  Zap,
  FileCode
} from 'lucide-react';

export default function ImageToBase64() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [base64String, setBase64String] = useState<string>('');
  const [format, setFormat] = useState<'png' | 'jpeg' | 'webp'>('png');
  const [quality, setQuality] = useState<number>(80);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // FAQ items
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const fileUrl = URL.createObjectURL(file);
      setOriginalImage(fileUrl);
      setBase64String('');
    }
  };

  const convertToBase64 = () => {
    if (!originalImage) return;

    setIsProcessing(true);
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    const image = new Image();

    image.onload = () => {
      if (canvas && context) {
        canvas.width = image.width;
        canvas.height = image.height;
        context.drawImage(image, 0, 0);

        // Convert to selected format
        let mimeType: string;
        switch (format) {
          case 'jpeg':
            mimeType = 'image/jpeg';
            break;
          case 'webp':
            mimeType = 'image/webp';
            break;
          default:
            mimeType = 'image/png';
        }

        const qualityValue = format === 'png' ? undefined : quality / 100;
        const base64Data = canvas.toDataURL(mimeType, qualityValue);
        setBase64String(base64Data);
        setIsProcessing(false);
      }
    };

    image.src = originalImage;
  };

  const copyBase64 = async () => {
    if (base64String) {
      try {
        await navigator.clipboard.writeText(base64String);
        alert('Base64 copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  const copyDataUrlOnly = async () => {
    if (base64String) {
      try {
        // Remove the data URL prefix to get just the base64 data
        const base64DataOnly = base64String.split(',')[1];
        await navigator.clipboard.writeText(base64DataOnly);
        alert('Base64 data copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  const downloadBase64 = () => {
    if (base64String) {
      const blob = new Blob([base64String], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `image-base64.txt`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const resetForm = () => {
    setOriginalImage(null);
    setBase64String('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const base64Length = base64String ? base64String.length : 0;
  const dataSize = base64String ? Math.ceil((base64Length * 3) / 4) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Header */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl shadow-lg mb-4">
            <Code className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Image to Base64 Converter</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Free online image to Base64 converter tool. Convert images to Base64 data URLs for 
            embedding in HTML, CSS, or JavaScript. No server uploads required.
          </p>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Converter Tool */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-emerald-100">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center mb-3">
                  <div className="bg-emerald-100 p-3 rounded-full">
                    <Code className="h-6 w-6 text-emerald-600" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Image to Base64 Converter
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  Convert images to Base64 data URLs for web development
                </p>
              </div>

              {/* File Upload */}
              <div className="mb-6">
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-emerald-400 transition-colors cursor-pointer bg-gray-50"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  
                  {!originalImage ? (
                    <div>
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-lg font-medium text-gray-700 mb-2">
                        Upload an image to convert
                      </p>
                      <p className="text-sm text-gray-500">
                        Convert to Base64 for CSS, HTML, or APIs
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-4">
                      <ImageIcon className="h-12 w-12 text-emerald-500" />
                      <div className="text-left">
                        <p className="font-medium text-gray-800">Image loaded</p>
                        <p className="text-sm text-gray-600">Ready for Base64 conversion</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Conversion Options */}
              {originalImage && (
                <div className="space-y-4 mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Output Format
                      </label>
                      <select
                        value={format}
                        onChange={(e) => setFormat(e.target.value as 'png' | 'jpeg' | 'webp')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="png">PNG</option>
                        <option value="jpeg">JPEG</option>
                        <option value="webp">WebP</option>
                      </select>
                    </div>
                    
                    {format !== 'png' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Quality: {quality}%
                        </label>
                        <input
                          type="range"
                          min="10"
                          max="100"
                          value={quality}
                          onChange={(e) => setQuality(Number(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                    )}
                  </div>

                  <button
                    onClick={convertToBase64}
                    disabled={isProcessing}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <Code className="h-5 w-5" />
                    )}
                    {isProcessing ? 'Converting...' : 'Convert to Base64'}
                  </button>
                </div>
              )}

              {/* Base64 Output */}
              {base64String && (
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <h3 className="text-lg font-semibold text-gray-800">Base64 Output</h3>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-blue-50 p-3 rounded-lg text-center">
                      <p className="text-blue-700 font-medium">Length</p>
                      <p className="text-blue-800">{base64Length} characters</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg text-center">
                      <p className="text-green-700 font-medium">Data Size</p>
                      <p className="text-green-800">~{(dataSize / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>

                  {/* Base64 Preview */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Base64 Data URL:
                    </label>
                    <div className="relative">
                      <textarea
                        value={base64String}
                        readOnly
                        className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 font-mono text-xs resize-none"
                        placeholder="Base64 data will appear here..."
                      />
                      <div className="absolute top-2 right-2 flex gap-2">
                        <button
                          onClick={copyBase64}
                          className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                          title="Copy full data URL"
                        >
                          <Copy className="h-4 w-4 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={copyDataUrlOnly}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <Copy className="h-4 w-4" />
                      Copy Data Only
                    </button>
                    <button
                      onClick={downloadBase64}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={resetForm}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                >
                  New Image
                </button>
              </div>

              {/* Info Section */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start gap-3">
                  <Code className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-800 mb-1">Base64 Data URLs</h4>
                    <p className="text-sm text-blue-700">
                      Base64 images can be embedded directly in HTML, CSS, or JavaScript without 
                      separate HTTP requests. Perfect for small icons, favicons, or when you need 
                      to reduce the number of server requests.
                    </p>
                    <p className="text-xs text-blue-600 mt-2">
                      Example CSS: <code>background: url('data:image/png;base64,...')</code>
                    </p>
                  </div>
                </div>
              </div>

              <canvas ref={canvasRef} className="hidden" />
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
                  <span><strong>Client-Side Processing</strong> - All conversion happens in your browser</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Shield className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>No Data Stored</strong> - Your images never leave your device</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Code className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Instant Conversion</strong> - Real-time Base64 encoding</span>
                </li>
              </ul>
            </div>

            {/* Features */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-emerald-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-2">
                  <Code className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Multiple Formats</strong> - Output as PNG, JPEG, or WebP</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Copy className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Copy Options</strong> - Copy full data URL or base64 data only</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Download className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Download</strong> - Save Base64 data as text file</span>
                </div>
                <div className="flex items-start space-x-2">
                  <FileCode className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Size Information</strong> - See character count and data size</span>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-emerald-100">
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

      {/* FAQ Schema */}
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