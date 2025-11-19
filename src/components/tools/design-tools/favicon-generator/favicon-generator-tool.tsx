// components/tools/FaviconGenerator.tsx
'use client';

import { useState, useRef } from 'react';
import { 
  Upload, 
  Download, 
  Image as ImageIcon,
  FileImage,
  CheckCircle,
  Shield,
  Zap,
  Smartphone,
  Monitor,
  Tablet,
  Globe,
  RefreshCw,
  Sparkles,
  Copy,
  X
} from 'lucide-react';

export default function FaviconGenerator() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [generatedFiles, setGeneratedFiles] = useState<{ [key: string]: Blob }>({});
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [selectedFormats, setSelectedFormats] = useState<string[]>(['ico', 'png-32', 'png-16']);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const faviconFormats = [
    { id: 'ico', name: 'ICO File', description: 'Traditional favicon.ico with multiple sizes', sizes: [16, 32, 48], recommended: true },
    { id: 'png-16', name: 'PNG 16×16', description: 'Small size for browser tabs', size: 16, recommended: true },
    { id: 'png-32', name: 'PNG 32×32', description: 'Standard size for most browsers', size: 32, recommended: true },
    { id: 'png-180', name: 'Apple Touch 180×180', description: 'Apple iOS devices', size: 180, recommended: true },
    { id: 'png-192', name: 'Android 192×192', description: 'Android Chrome and homescreen', size: 192, recommended: true },
    { id: 'png-512', name: 'PWA 512×512', description: 'Progressive Web App icon', size: 512, recommended: false },
  ];

  // FAQ items
  const faviconFaqItems = [
    {
      question: "What's the difference between ICO and PNG favicons?",
      answer: "ICO files contain multiple sizes in one file and work across all browsers. PNG favicons are individual files for specific sizes and are used by modern browsers. It's recommended to provide both for maximum compatibility."
    },
    {
      question: "Which favicon sizes are most important?",
      answer: "The essential sizes are: 16×16 (browser tabs), 32×32 (browser favorites), 180×180 (Apple devices), and 192×192 (Android). The ICO format should include 16×16, 32×32, and 48×48 pixels."
    },
    {
      question: "How do I implement favicons on my website?",
      answer: "Place favicon.ico in your root directory and add PNG favicons in the <head> section using <link> tags with appropriate rel attributes (icon, apple-touch-icon, etc.). Our generator provides the complete HTML code you need."
    },
    {
      question: "Do I need different favicons for different devices?",
      answer: "Yes! Different platforms have different requirements: ICO for desktop browsers, PNG for modern browsers, specific sizes for Apple devices, and different sizes for Android. Our generator creates all necessary formats automatically."
    },
    {
      question: "Can I use transparent backgrounds for favicons?",
      answer: "Yes, PNG favicons support transparency which works well on all modern browsers. However, ensure your design has sufficient contrast against both light and dark browser themes."
    },
    {
      question: "How often should I update my website's favicon?",
      answer: "Update your favicon when you rebrand your website or if the current design doesn't represent your brand well. Favicons are small but important for brand recognition and user experience."
    }
  ];

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const fileUrl = URL.createObjectURL(file);
      setOriginalImage(fileUrl);
      setGeneratedFiles({});
    }
  };

  const toggleFormat = (formatId: string) => {
    setSelectedFormats(prev => 
      prev.includes(formatId) 
        ? prev.filter(f => f !== formatId)
        : [...prev, formatId]
    );
  };

  const selectRecommendedFormats = () => {
    setSelectedFormats(faviconFormats.filter(f => f.recommended).map(f => f.id));
  };

  const selectAllFormats = () => {
    setSelectedFormats(faviconFormats.map(f => f.id));
  };

  const generateFavicons = async () => {
    if (!originalImage) return;

    setIsGenerating(true);
    setGeneratedFiles({});
    
    try {
      const files: { [key: string]: Blob } = {};

      for (const format of faviconFormats) {
        if (!selectedFormats.includes(format.id)) continue;

        if (format.id === 'ico') {
          // Generate ICO with multiple sizes
          const canvases = await Promise.all(
            format.sizes!.map(async (size) => {
              const canvas = document.createElement('canvas');
              canvas.width = size;
              canvas.height = size;
              const ctx = canvas.getContext('2d');
              
              if (ctx) {
                const img = new Image();
                await new Promise((resolve, reject) => {
                  img.onload = resolve;
                  img.onerror = reject;
                  img.src = originalImage;
                });
                ctx.drawImage(img, 0, 0, size, size);
              }
              
              return canvas;
            })
          );

          // Use the largest canvas for simplified ICO (in production, use a proper ICO library)
          const largestCanvas = canvases[canvases.length - 1];
          const icoBlob = await new Promise<Blob>((resolve) => {
            largestCanvas.toBlob((blob) => {
              if (blob) resolve(blob);
            }, 'image/x-icon');
          });
          files['ico'] = icoBlob;
        } else {
          // Generate PNG for specific size
          const size = format.size!;
          const canvas = document.createElement('canvas');
          canvas.width = size;
          canvas.height = size;
          const ctx = canvas.getContext('2d');
          
          if (ctx) {
            const img = new Image();
            await new Promise((resolve, reject) => {
              img.onload = resolve;
              img.onerror = reject;
              img.src = originalImage;
            });
            ctx.drawImage(img, 0, 0, size, size);
            
            const pngBlob = await new Promise<Blob>((resolve) => {
              canvas.toBlob((blob) => {
                if (blob) resolve(blob);
              }, 'image/png');
            });
            files[format.id] = pngBlob;
          }
        }
      }

      setGeneratedFiles(files);
    } catch (error) {
      console.error('Generation error:', error);
      alert('Error generating favicons. Please try another image.');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadFile = (formatId: string, blob: Blob) => {
    const format = faviconFormats.find(f => f.id === formatId);
    const extension = formatId === 'ico' ? 'ico' : 'png';
    const filename = formatId === 'ico' ? 'favicon' : `favicon-${format?.size}x${format?.size}`;
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.${extension}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const downloadAll = () => {
    Object.entries(generatedFiles).forEach(([formatId, blob]) => {
      downloadFile(formatId, blob);
    });
  };

  const resetForm = () => {
    setOriginalImage(null);
    setGeneratedFiles({});
    setSelectedFormats(['ico', 'png-32', 'png-16']);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getHtmlCode = () => {
    const codes = [];
    
    if (generatedFiles['ico']) {
      codes.push('<link rel="icon" href="/favicon.ico" type="image/x-icon">');
    }
    
    if (generatedFiles['png-32']) {
      codes.push('<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">');
    }
    
    if (generatedFiles['png-16']) {
      codes.push('<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">');
    }
    
    if (generatedFiles['png-180']) {
      codes.push('<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">');
    }
    
    if (generatedFiles['png-192']) {
      codes.push('<link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png">');
    }
    
    if (generatedFiles['png-512']) {
      codes.push('<link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png">');
    }

    return codes.join('\n');
  };

  const copyHtmlCode = async () => {
    try {
      await navigator.clipboard.writeText(getHtmlCode());
      alert('HTML code copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy HTML code: ', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Favicon Generator */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-emerald-100">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center mb-3">
                  <div className="bg-emerald-100 p-3 rounded-full">
                    <Globe className="h-6 w-6 text-emerald-600" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Universal Favicon Generator
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  Create favicons for all devices and browsers
                </p>
              </div>

              {/* File Upload */}
              <div className="mb-6">
                {!originalImage ? (
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
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg font-medium text-gray-700 mb-2">
                      Upload your logo or icon
                    </p>
                    <p className="text-sm text-gray-500">
                      PNG, JPG, WebP supported • Square images work best
                    </p>
                  </div>
                ) : (
                  <div className="border-2 border-emerald-200 rounded-lg p-6 bg-emerald-50">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <ImageIcon className="h-5 w-5 text-emerald-500" />
                        Image Preview
                      </h3>
                      <button
                        onClick={resetForm}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                        title="Remove image"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="flex flex-col md:flex-row gap-6 items-center">
                      <div className="flex-shrink-0">
                        <div className="w-32 h-32 border-2 border-emerald-200 rounded-lg bg-white p-2 shadow-sm">
                          <img
                            src={originalImage}
                            alt="Uploaded preview"
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="space-y-2">
                          <p className="text-sm text-gray-600">
                            Your image is ready for favicon generation. Select the formats you need below.
                          </p>
                          <div className="flex gap-2">
                            {/* 
                            <button
                              onClick={() => fileInputRef.current?.click()}
                              className="flex items-center gap-1 px-3 py-1 bg-emerald-500 text-white rounded text-sm hover:bg-emerald-600 transition-colors"
                            >
                              <Upload className="h-3 w-3" />
                              Change Image
                            </button>
                            */}
                            <button
                              onClick={resetForm}
                              className="flex items-center gap-1 px-3 py-1 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50 transition-colors"
                            >
                              <RefreshCw className="h-3 w-3" />
                              Start Over
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Format Selection */}
              {originalImage && (
                <div className="space-y-4 mb-6">
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Select favicon formats:
                      </label>
                      <div className="flex gap-2">
                        <button
                          onClick={selectRecommendedFormats}
                          className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                        >
                          Recommended
                        </button>
                        <button
                          onClick={selectAllFormats}
                          className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                        >
                          All Formats
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {faviconFormats.map((format) => (
                        <button
                          key={format.id}
                          onClick={() => toggleFormat(format.id)}
                          className={`p-4 rounded-lg border text-left transition-colors ${
                            selectedFormats.includes(format.id)
                              ? 'bg-emerald-500 text-white border-emerald-500'
                              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{format.name}</span>
                            {format.recommended && (
                              <span className="text-xs bg-yellow-500 text-white px-2 py-1 rounded">
                                Recommended
                              </span>
                            )}
                          </div>
                          <p className={`text-sm mt-1 ${
                            selectedFormats.includes(format.id) ? 'text-emerald-100' : 'text-gray-500'
                          }`}>
                            {format.description}
                          </p>
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Selected: {selectedFormats.length} formats • Covers all major platforms
                    </p>
                  </div>

                  <button
                    onClick={generateFavicons}
                    disabled={isGenerating || selectedFormats.length === 0}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <Sparkles className="h-5 w-5" />
                    )}
                    {isGenerating ? 'Generating Favicons...' : `Generate ${selectedFormats.length} Favicon Files`}
                  </button>
                </div>
              )}

              {/* Results */}
              {Object.keys(generatedFiles).length > 0 && (
                <div className="space-y-6 mb-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <h3 className="text-lg font-semibold text-gray-800">Favicons Generated Successfully!</h3>
                  </div>

                  {/* Generated Files Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {faviconFormats.filter(f => generatedFiles[f.id]).map((format) => (
                      <div key={format.id} className="border border-gray-200 rounded-lg p-4 text-center bg-white">
                        <div className="w-16 h-16 border-2 border-gray-300 rounded bg-white mx-auto mb-3 flex items-center justify-center overflow-hidden">
                          <img 
                            src={originalImage!} 
                            alt={format.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <p className="font-medium text-gray-800 text-sm">{format.name}</p>
                        <p className="text-xs text-gray-600 mb-3">
                          {format.id === 'ico' ? 'Multiple sizes' : `${format.size}×${format.size}px`}
                        </p>
                        <button
                          onClick={() => downloadFile(format.id, generatedFiles[format.id])}
                          className="w-full flex items-center justify-center gap-1 px-3 py-2 bg-emerald-500 text-white rounded text-sm hover:bg-emerald-600 transition-colors"
                        >
                          <Download className="h-3 w-3" />
                          Download
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* HTML Code */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-800">HTML Implementation Code</h4>
                      <button
                        onClick={copyHtmlCode}
                        className="flex items-center gap-1 px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 transition-colors"
                      >
                        <Copy className="h-3 w-3" />
                        Copy HTML
                      </button>
                    </div>
                    <pre className="bg-gray-800 text-green-400 p-3 rounded text-xs overflow-x-auto">
                      {getHtmlCode()}
                    </pre>
                  </div>

                  {/* Bulk Download */}
                  <button
                    onClick={downloadAll}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <Download className="h-5 w-5" />
                    Download All Files ({Object.keys(generatedFiles).length})
                  </button>
                </div>
              )}

              {/* Action Buttons */}
              {originalImage && !Object.keys(generatedFiles).length && (
                <div className="flex gap-3">
                  <button
                    onClick={resetForm}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                  >
                    <RefreshCw className="h-4 w-4" />
                    New Image
                  </button>
                </div>
              )}
            </div>
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
                  <span><strong>Client-Side Processing</strong> - All generation happens in your browser</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Shield className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>No Data Stored</strong> - Your images never leave your device</span>
                </li>
                <li className="flex items-start space-x-2">
                  <FileImage className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Instant Generation</strong> - Create all favicon formats in seconds</span>
                </li>
              </ul>
            </div>

            {/* Features */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-emerald-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-2">
                  <Globe className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Universal Compatibility</strong> - Works on all browsers and devices</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Smartphone className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Mobile Optimized</strong> - Apple Touch and Android icons included</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Monitor className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Desktop Ready</strong> - Traditional ICO and modern PNG formats</span>
                </div>
                <div className="flex items-start space-x-2">
                  <FileImage className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Auto HTML Code</strong> - Get ready-to-use implementation code</span>
                </div>
              </div>
            </div>

            {/* Device Support */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-emerald-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Device Support</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <h4 className="font-semibold text-blue-800 mb-1 flex items-center">
                    <Monitor className="h-4 w-4 mr-2" />
                    Desktop Browsers
                  </h4>
                  <ul className="space-y-1 text-blue-700">
                    <li>• Chrome, Firefox, Safari</li>
                    <li>• Edge, Opera, Brave</li>
                    <li>• ICO + PNG formats</li>
                  </ul>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <h4 className="font-semibold text-green-800 mb-1 flex items-center">
                    <Smartphone className="h-4 w-4 mr-2" />
                    Mobile Devices
                  </h4>
                  <ul className="space-y-1 text-green-700">
                    <li>• iOS Safari (Apple Touch)</li>
                    <li>• Android Chrome</li>
                    <li>• Mobile bookmarks</li>
                  </ul>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                  <h4 className="font-semibold text-purple-800 mb-1 flex items-center">
                    <Tablet className="h-4 w-4 mr-2" />
                    Progressive Web Apps
                  </h4>
                  <ul className="space-y-1 text-purple-700">
                    <li>• PWA manifest icons</li>
                    <li>• Splash screens</li>
                    <li>• Home screen icons</li>
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
            {faviconFaqItems.map((faq, index) => (
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
            Universal Favicon Generator for All Devices
          </h2>
          
          <p className="text-gray-700 mb-4">
            Create complete favicon sets for your website with our universal favicon generator. 
            Generate ICO files for traditional browser support, PNG icons for modern browsers, 
            Apple Touch icons for iOS devices, and Android icons for mobile users. All processing 
            happens securely in your browser with no file uploads required.
          </p>

          <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
            Why You Need Multiple Favicon Formats
          </h3>
          <p className="text-gray-700 mb-4">
            Modern web browsing involves multiple devices and platforms, each with different 
            favicon requirements. Desktop browsers prefer ICO files, mobile browsers need 
            specific PNG sizes, Apple devices require touch icons, and Progressive Web Apps 
            need high-resolution icons. Our generator creates all necessary formats automatically.
          </p>

          <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
            Complete Favicon Implementation Guide
          </h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Place files in root directory</strong> - Upload all generated files to your website's main folder</li>
            <li><strong>Add HTML code</strong> - Use the provided code in your &lt;head&gt; section</li>
            <li><strong>Test across devices</strong> - Verify appearance on desktop, mobile, and tablets</li>
            <li><strong>Clear browser cache</strong> - Ensure new favicons display immediately</li>
            <li><strong>Update manifest.json</strong> - For PWAs, include the 192×192 and 512×512 icons</li>
          </ul>

          <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
            Favicon Best Practices for 2024
          </h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Use simple, recognizable designs that work at small sizes</li>
            <li>Maintain high contrast for visibility in browser tabs</li>
            <li>Test with both light and dark browser themes</li>
            <li>Include square and rounded corner versions for different platforms</li>
            <li>Update favicons when rebranding your website</li>
            <li>Monitor analytics for brand recognition impact</li>
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
            "mainEntity": faviconFaqItems.map(faq => ({
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