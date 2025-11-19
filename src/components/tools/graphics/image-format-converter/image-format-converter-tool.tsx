// components/tools/ImageFormatConverterTool.tsx
'use client';

import { useState, useRef } from 'react';
import { 
  Upload, 
  Download, 
  RefreshCw,
  Image as ImageIcon,
  Shield,
  Zap,
  CheckCircle
} from 'lucide-react';

type OutputFormat = 'png' | 'jpeg' | 'webp';

export default function ImageFormatConverterTool() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [convertedImageUrl, setConvertedImageUrl] = useState<string | null>(null);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('png');
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // FAQ items
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const fileUrl = URL.createObjectURL(file);
      setOriginalImage(fileUrl);
      setConvertedImageUrl(null);
    }
  };

  const convertImage = () => {
    if (!originalImage) return;

    setIsConverting(true);
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
        switch (outputFormat) {
          case 'jpeg':
            mimeType = 'image/jpeg';
            break;
          case 'webp':
            mimeType = 'image/webp';
            break;
          default:
            mimeType = 'image/png';
        }

        const convertedDataUrl = canvas.toDataURL(mimeType);
        setConvertedImageUrl(convertedDataUrl);
        setIsConverting(false);
      }
    };

    image.src = originalImage;
  };

  const downloadImage = () => {
    if (convertedImageUrl) {
      const link = document.createElement('a');
      link.href = convertedImageUrl;
      link.download = `converted-image.${outputFormat}`;
      link.click();
    }
  };

  const resetForm = () => {
    setOriginalImage(null);
    setConvertedImageUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Header */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl shadow-lg mb-4">
            <RefreshCw className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Image Format Converter</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Free online image format converter tool. Convert between PNG, JPEG, and WebP formats instantly in your browser. 
            No file uploads required - all processing happens locally.
          </p>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Converter Tool */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-emerald-100">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center mb-3">
                  <div className="bg-emerald-100 p-3 rounded-full">
                    <RefreshCw className="h-6 w-6 text-emerald-600" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Image Format Converter
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  Convert between PNG, JPEG, and WebP formats
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
                        Supports all major image formats
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-4">
                      <ImageIcon className="h-12 w-12 text-emerald-500" />
                      <div className="text-left">
                        <p className="font-medium text-gray-800">Image loaded</p>
                        <p className="text-sm text-gray-600">Ready for conversion</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Format Selection */}
              {originalImage && (
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Convert to:
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['png', 'jpeg', 'webp'] as OutputFormat[]).map((format) => (
                        <button
                          key={format}
                          onClick={() => setOutputFormat(format)}
                          className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                            outputFormat === format
                              ? 'bg-emerald-500 text-white border-emerald-500'
                              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {format.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={convertImage}
                    disabled={isConverting}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50"
                  >
                    {isConverting ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <RefreshCw className="h-5 w-5" />
                    )}
                    {isConverting ? 'Converting...' : 'Convert Image'}
                  </button>
                </div>
              )}

              {/* Results */}
              {convertedImageUrl && (
                <div className="mb-6">
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-700 mb-2">Converted Image</p>
                    <img 
                      src={convertedImageUrl} 
                      alt="Converted" 
                      className="w-full max-w-xs mx-auto h-48 object-contain rounded-lg border"
                    />
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
                
                {convertedImageUrl && (
                  <button
                    onClick={downloadImage}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    Download {outputFormat.toUpperCase()}
                  </button>
                )}
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
                  <RefreshCw className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Instant Processing</strong> - Real-time format conversion</span>
                </li>
              </ul>
            </div>

            {/* Features */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-emerald-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-2">
                  <RefreshCw className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Multiple Formats</strong> - Convert between PNG, JPEG, and WebP</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Upload className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Easy Upload</strong> - Drag & drop or click to upload images</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Download className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Instant Download</strong> - Save converted images immediately</span>
                </div>
                <div className="flex items-start space-x-2">
                  <ImageIcon className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Quality Preservation</strong> - Maintain image quality during conversion</span>
                </div>
              </div>
            </div>

            {/* Format Benefits */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-emerald-100">
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

      {/* FAQ Schema */}
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