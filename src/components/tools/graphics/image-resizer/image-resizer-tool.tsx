// components/tools/ImageResizer.tsx
'use client';

import { useState, useRef } from 'react';
import { 
  Upload, 
  Download, 
  Scaling,
  FileArchive,
  Image as ImageIcon,
  Shield,
  Zap
} from 'lucide-react';

export default function ImageResizer() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [resizedImageUrl, setResizedImageUrl] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [resizedSize, setResizedSize] = useState<number>(0);
  const [width, setWidth] = useState<number>(800);
  const [height, setHeight] = useState<number>(600);
  const [quality, setQuality] = useState<number>(80);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // FAQ items
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const fileUrl = URL.createObjectURL(file);
      setOriginalImage(fileUrl);
      setOriginalSize(file.size);
      setResizedImageUrl(null);

      // Load image to get original dimensions
      const img = new Image();
      img.onload = () => {
        setWidth(img.width);
        setHeight(img.height);
      };
      img.src = fileUrl;
    }
  };

  const resizeImage = () => {
    if (!originalImage) return;

    setIsProcessing(true);
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    const image = new Image();

    image.onload = () => {
      if (canvas && context) {
        canvas.width = width;
        canvas.height = height;

        // Draw image with new dimensions
        context.drawImage(image, 0, 0, width, height);

        // Convert to data URL with specified quality
        const qualityValue = quality / 100;
        const resizedDataUrl = canvas.toDataURL('image/jpeg', qualityValue);
        
        setResizedImageUrl(resizedDataUrl);
        
        // Calculate approximate size
        const base64Length = resizedDataUrl.length - 'data:image/jpeg;base64,'.length;
        const padding = resizedDataUrl.endsWith('==') ? 2 : resizedDataUrl.endsWith('=') ? 1 : 0;
        const fileSize = Math.floor((base64Length * 3) / 4) - padding;
        setResizedSize(fileSize);
        
        setIsProcessing(false);
      }
    };

    image.src = originalImage;
  };

  const downloadImage = () => {
    if (resizedImageUrl) {
      const link = document.createElement('a');
      link.href = resizedImageUrl;
      link.download = 'resized-image.jpg';
      link.click();
    }
  };

  const resetForm = () => {
    setOriginalImage(null);
    setResizedImageUrl(null);
    setOriginalSize(0);
    setResizedSize(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const compressionRatio = originalSize > 0 ? ((originalSize - resizedSize) / originalSize * 100).toFixed(1) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Header */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl shadow-lg mb-4">
            <Scaling className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Image Resizer & Compressor</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Free online image resizer tool. Resize and compress images to specific dimensions while maintaining quality. 
            All processing happens securely in your browser.
          </p>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Resizer Tool */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-emerald-100">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center mb-3">
                  <div className="bg-emerald-100 p-3 rounded-full">
                    <Scaling className="h-6 w-6 text-emerald-600" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Image Resizer & Compressor
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  Resize and compress images in your browser
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
                        Upload an image to resize
                      </p>
                      <p className="text-sm text-gray-500">
                        Supports JPG, PNG, WebP
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-4">
                      <ImageIcon className="h-12 w-12 text-emerald-500" />
                      <div className="text-left">
                        <p className="font-medium text-gray-800">Image loaded</p>
                        <p className="text-sm text-gray-600">
                          Original: {(originalSize / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Controls */}
              {originalImage && (
                <div className="space-y-4 mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Width (px)
                      </label>
                      <input
                        type="number"
                        value={width}
                        onChange={(e) => setWidth(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Height (px)
                      </label>
                      <input
                        type="number"
                        value={height}
                        onChange={(e) => setHeight(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

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

                  <button
                    onClick={resizeImage}
                    disabled={isProcessing}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <FileArchive className="h-5 w-5" />
                    )}
                    {isProcessing ? 'Processing...' : 'Resize & Compress'}
                  </button>
                </div>
              )}

              {/* Results */}
              {resizedImageUrl && (
                <div className="space-y-4 mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-700 mb-2">Original</p>
                      <img 
                        src={originalImage!} 
                        alt="Original" 
                        className="w-full h-32 object-cover rounded-lg border"
                      />
                      <p className="text-xs text-gray-600 mt-1">
                        {(originalSize / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-700 mb-2">Resized</p>
                      <img 
                        src={resizedImageUrl} 
                        alt="Resized" 
                        className="w-full h-32 object-cover rounded-lg border"
                      />
                      <p className="text-xs text-gray-600 mt-1">
                        {(resizedSize / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>

                  <div className="p-3 bg-green-50 rounded-lg border border-green-200 text-center">
                    <p className="text-green-700 font-medium">
                      {compressionRatio}% smaller
                    </p>
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
                
                {resizedImageUrl && (
                  <button
                    onClick={downloadImage}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    Download
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
                  <span><strong>Client-Side Processing</strong> - All resizing happens in your browser</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Shield className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>No Data Stored</strong> - Your images never leave your device</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Scaling className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Instant Processing</strong> - Real-time resizing and compression</span>
                </li>
              </ul>
            </div>

            {/* Features */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-emerald-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-2">
                  <Scaling className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Custom Dimensions</strong> - Set exact width and height in pixels</span>
                </div>
                <div className="flex items-start space-x-2">
                  <FileArchive className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Quality Control</strong> - Adjust compression quality with slider</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Download className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Size Comparison</strong> - See before/after file sizes</span>
                </div>
                <div className="flex items-start space-x-2">
                  <ImageIcon className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Multiple Formats</strong> - Supports JPG, PNG, WebP, and more</span>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-emerald-100">
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

      {/* FAQ Schema */}
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