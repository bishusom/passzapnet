// components/tools/IconGenerator.tsx
'use client';

import { useState, useRef, useCallback } from 'react';
import { 
  Upload, 
  Download, 
  Settings, 
  Smartphone, 
  Monitor, 
  Palette,
  Component,
  Trash2,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Crop,
  Shield,
  Zap,
  Code
} from 'lucide-react';


interface IconSize {
  platform: string;
  size: string;
  width: number;
  height: number;
  description: string;
}

interface IconConfig {
  backgroundColor: string;
  padding: number;
  borderRadius: number;
  scale: number;
  rotation: number;
}

export default function IconGenerator() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  const [iconConfig, setIconConfig] = useState<IconConfig>({
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 0,
    scale: 100,
    rotation: 0
  });
  const [selectedSizes, setSelectedSizes] = useState<Set<string>>(new Set());
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Predefined icon sizes for different platforms
  const iconSizes: IconSize[] = [
    // iOS
    { platform: 'iOS', size: 'iPhone App', width: 180, height: 180, description: 'iPhone App Store' },
    { platform: 'iOS', size: 'iPad App', width: 167, height: 167, description: 'iPad App Store' },
    { platform: 'iOS', size: 'Spotlight', width: 120, height: 120, description: 'iOS Spotlight' },
    { platform: 'iOS', size: 'Settings', width: 87, height: 87, description: 'iOS Settings' },
    { platform: 'iOS', size: 'Notification', width: 60, height: 60, description: 'iOS Notifications' },
    
    // Android
    { platform: 'Android', size: 'Play Store', width: 512, height: 512, description: 'Google Play Store' },
    { platform: 'Android', size: 'Launcher', width: 192, height: 192, description: 'Android Home Screen' },
    { platform: 'Android', size: 'Action Bar', width: 96, height: 96, description: 'Android Action Bar' },
    { platform: 'Android', size: 'Small', width: 48, height: 48, description: 'Android Small' },
    
    // Web
    { platform: 'Web', size: 'Favicon', width: 32, height: 32, description: 'Browser Favicon' },
    { platform: 'Web', size: 'Apple Touch', width: 180, height: 180, description: 'Apple Touch Icon' },
    { platform: 'Web', size: 'Large', width: 192, height: 192, description: 'PWA Large' },
    { platform: 'Web', size: 'Medium', width: 144, height: 144, description: 'PWA Medium' },
    { platform: 'Web', size: 'Small', width: 96, height: 96, description: 'PWA Small' }
  ];

  // FAQ items
  const faqItems = [
    {
      question: "What image formats are supported for upload?",
      answer: "We support PNG, JPG, JPEG, and SVG formats. For best results, use high-resolution PNG images with transparent backgrounds."
    },
    {
      question: "What are the recommended image dimensions for the source icon?",
      answer: "We recommend using at least 1024x1024 pixels for the source image to ensure quality across all icon sizes."
    },
    {
      question: "Can I create icons with transparent backgrounds?",
      answer: "Yes! Upload PNG images with transparency, and the generated icons will preserve the transparency."
    },
    {
      question: "Which platforms are supported?",
      answer: "We support iOS, Android, and web platforms with all standard icon sizes for App Store, Google Play, and web applications."
    },
    {
      question: "Are the generated icons optimized for production?",
      answer: "Yes, all icons are generated as high-quality PNG files ready for production use in apps and websites."
    },
    {
      question: "Do you store my uploaded images?",
      answer: "No, all processing happens in your browser. Your images are never uploaded to our servers."
    }
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      setUploadedImage(imageUrl);
      
      // Load original image for processing
      const img = new window.Image(); // Use window.Image to avoid Lucide conflict
      img.onload = () => {
        setOriginalImage(img);
      };
      img.src = imageUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleSizeToggle = (sizeKey: string) => {
    const newSelectedSizes = new Set(selectedSizes);
    if (newSelectedSizes.has(sizeKey)) {
      newSelectedSizes.delete(sizeKey);
    } else {
      newSelectedSizes.add(sizeKey);
    }
    setSelectedSizes(newSelectedSizes);
  };

  const selectAllSizes = (platform: string) => {
    const newSelectedSizes = new Set(selectedSizes);
    iconSizes
      .filter(size => size.platform === platform)
      .forEach(size => {
        newSelectedSizes.add(`${size.platform}-${size.size}`);
      });
    setSelectedSizes(newSelectedSizes);
  };

  const deselectAllSizes = (platform: string) => {
    const newSelectedSizes = new Set(selectedSizes);
    iconSizes
      .filter(size => size.platform === platform)
      .forEach(size => {
        newSelectedSizes.delete(`${size.platform}-${size.size}`);
      });
    setSelectedSizes(newSelectedSizes);
  };

  const generateIcon = useCallback(async (size: IconSize): Promise<Blob> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      
      canvas.width = size.width;
      canvas.height = size.height;
      
      // Clear canvas
      ctx.clearRect(0, 0, size.width, size.height);
      
      // Draw background
      if (iconConfig.backgroundColor !== 'transparent') {
        ctx.fillStyle = iconConfig.backgroundColor;
        if (iconConfig.borderRadius > 0) {
          const radius = (iconConfig.borderRadius / 100) * Math.min(size.width, size.height) / 2;
          ctx.beginPath();
          ctx.roundRect(0, 0, size.width, size.height, radius);
          ctx.fill();
        } else {
          ctx.fillRect(0, 0, size.width, size.height);
        }
      }
      
      if (originalImage) {
        // Calculate scaled dimensions with padding
        const padding = (iconConfig.padding / 100) * Math.min(size.width, size.height);
        const contentWidth = size.width - padding * 2;
        const contentHeight = size.height - padding * 2;
        
        // Calculate scale to fit within content area
        const scale = Math.min(
          contentWidth / originalImage.width,
          contentHeight / originalImage.height
        ) * (iconConfig.scale / 100);
        
        const scaledWidth = originalImage.width * scale;
        const scaledHeight = originalImage.height * scale;
        
        // Center the image
        const x = padding + (contentWidth - scaledWidth) / 2;
        const y = padding + (contentHeight - scaledHeight) / 2;
        
        // Save context and apply transformations
        ctx.save();
        ctx.translate(size.width / 2, size.height / 2);
        ctx.rotate((iconConfig.rotation * Math.PI) / 180);
        ctx.translate(-size.width / 2, -size.height / 2);
        
        // Draw image
        ctx.drawImage(originalImage, x, y, scaledWidth, scaledHeight);
        ctx.restore();
      }
      
      // Convert to blob
      canvas.toBlob((blob) => {
        resolve(blob!);
      }, 'image/png');
    });
  }, [originalImage, iconConfig]);

  const downloadIcons = async () => {
    if (!uploadedImage || selectedSizes.size === 0) return;
    
    setIsGenerating(true);
    
    try {
      // Convert Set to Array for iteration
      const sizeKeysArray = Array.from(selectedSizes);
      
      for (let i = 0; i < sizeKeysArray.length; i++) {
        const sizeKey = sizeKeysArray[i];
        const size = iconSizes.find(s => `${s.platform}-${s.size}` === sizeKey);
        if (!size) continue;
        
        const blob = await generateIcon(size);
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `icon-${size.width}x${size.height}.png`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
        
        // Small delay to prevent browser from blocking multiple downloads
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    } catch (error) {
      console.error('Error generating icons:', error);
      alert('Error generating icons. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadAll = async () => {
    const allSizeKeys = iconSizes.map(size => `${size.platform}-${size.size}`);
    setSelectedSizes(new Set(allSizeKeys));
    
    // Wait for state update then trigger download
    setTimeout(downloadIcons, 100);
  };

  const resetIcon = () => {
    setUploadedImage(null);
    setOriginalImage(null);
    setIconConfig({
      backgroundColor: '#ffffff',
      padding: 20,
      borderRadius: 0,
      scale: 100,
      rotation: 0
    });
    setSelectedSizes(new Set());
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const platforms = ['iOS', 'Android', 'Web'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Icon Generator */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-emerald-100">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center mb-3">
                  <div className="bg-emerald-100 p-3 rounded-full">
                    <Component className="h-6 w-6 text-emerald-600" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Icon Generator
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  Create app icons for iOS, Android, and web in multiple sizes
                </p>
              </div>

              {/* Image Upload */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Upload Icon Source
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  {!uploadedImage ? (
                    <div>
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">
                        Drag & drop your image here or click to browse
                      </p>
                      <p className="text-sm text-gray-500 mb-4">
                        Recommended: 1024x1024 PNG with transparency
                      </p>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-emerald-500 text-white px-6 py-2 rounded-lg hover:bg-emrald-600 transition-colors"
                      >
                        Choose Image
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="w-32 h-32 mx-auto mb-4 border rounded-lg overflow-hidden">
                        <img
                          src={uploadedImage}
                          alt="Uploaded icon"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <button
                        onClick={resetIcon}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        Remove Image
                      </button>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Icon Customization */}
              {uploadedImage && (
                <>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Customize Icon
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-600 mb-2">
                          Background Color
                        </label>
                        <input
                          type="color"
                          value={iconConfig.backgroundColor}
                          onChange={(e) => setIconConfig(prev => ({ 
                            ...prev, 
                            backgroundColor: e.target.value 
                          }))}
                          className="w-full h-10 rounded border border-gray-300"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-2">
                          Padding: {iconConfig.padding}%
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="40"
                          value={iconConfig.padding}
                          onChange={(e) => setIconConfig(prev => ({ 
                            ...prev, 
                            padding: parseInt(e.target.value) 
                          }))}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-2">
                          Border Radius: {iconConfig.borderRadius}%
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="50"
                          value={iconConfig.borderRadius}
                          onChange={(e) => setIconConfig(prev => ({ 
                            ...prev, 
                            borderRadius: parseInt(e.target.value) 
                          }))}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-2">
                          Scale: {iconConfig.scale}%
                        </label>
                        <input
                          type="range"
                          min="50"
                          max="150"
                          value={iconConfig.scale}
                          onChange={(e) => setIconConfig(prev => ({ 
                            ...prev, 
                            scale: parseInt(e.target.value) 
                          }))}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Icon Sizes Selection */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Select Icon Sizes
                      </label>
                      <button
                        onClick={downloadAll}
                        className="text-blue-500 hover:text-blue-700 text-sm"
                      >
                        Select All
                      </button>
                    </div>

                    <div className="space-y-4">
                      {platforms.map((platform) => (
                        <div key={platform} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold text-gray-800 flex items-center">
                              {platform === 'iOS' && <Smartphone className="h-4 w-4 mr-2" />}
                              {platform === 'Android' && <Smartphone className="h-4 w-4 mr-2" />}
                              {platform === 'Web' && <Monitor className="h-4 w-4 mr-2" />}
                              {platform}
                            </h3>
                            <div className="flex gap-2">
                              <button
                                onClick={() => selectAllSizes(platform)}
                                className="text-xs text-blue-500 hover:text-blue-700"
                              >
                                Select All
                              </button>
                              <button
                                onClick={() => deselectAllSizes(platform)}
                                className="text-xs text-gray-500 hover:text-gray-700"
                              >
                                Deselect All
                              </button>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {iconSizes
                              .filter(size => size.platform === platform)
                              .map((size) => {
                                const sizeKey = `${size.platform}-${size.size}`;
                                return (
                                  <label
                                    key={sizeKey}
                                    className="flex items-center p-2 border rounded hover:bg-gray-50 cursor-pointer"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={selectedSizes.has(sizeKey)}
                                      onChange={() => handleSizeToggle(sizeKey)}
                                      className="mr-2"
                                    />
                                    <div>
                                      <div className="text-sm font-medium">
                                        {size.size}
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        {size.width}×{size.height}
                                      </div>
                                    </div>
                                  </label>
                                );
                              })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={resetIcon}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                    >
                      <RotateCw className="h-4 w-4" />
                      Reset
                    </button>
                    <button
                      onClick={downloadIcons}
                      disabled={selectedSizes.size === 0 || isGenerating}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Download className="h-4 w-4" />
                      {isGenerating ? 'Generating...' : `Download (${selectedSizes.size})`}
                    </button>
                  </div>
                </>
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
                  <span><strong>Client-Side Processing</strong> - All icon generation happens in your browser</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Shield className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>No Data Stored</strong> - Your images never leave your device</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Code className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Instant Generation</strong> - Icons are generated in real-time</span>
                </li>
              </ul>
            </div>

            {/* Features */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-emerald-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-2">
                  <Smartphone className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Multi-Platform Support</strong> - iOS, Android, and web icons</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Settings className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Customizable</strong> - Adjust colors, padding, and scaling</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Download className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Batch Download</strong> - Generate multiple sizes at once</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Palette className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>High Quality</strong> - PNG format with transparency support</span>
                </div>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-emerald-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Tips</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <h4 className="font-semibold text-yellow-800 mb-1">Image Quality</h4>
                  <p className="text-yellow-700">Use high-resolution source images (1024×1024 or larger) for best results.</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <h4 className="font-semibold text-blue-800 mb-1">Transparency</h4>
                  <p className="text-blue-700">Upload PNG files with transparent backgrounds for professional-looking icons.</p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <h4 className="font-semibold text-green-800 mb-1">Batch Export</h4>
                  <p className="text-green-700">Select multiple sizes and download all icons at once for efficiency.</p>
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
            {faqItems.map((faq, index) => (
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
            Free Icon Generator - Create App Icons for All Platforms
          </h2>
          
          <p className="text-gray-700 mb-4">
            Generate professional app icons for iOS, Android, and web applications with our free online icon generator. 
            Create icons in multiple sizes with customizable backgrounds, padding, and scaling. All processing happens 
            securely in your browser - no uploads required.
          </p>

          <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
            Why Use Our Icon Generator?
          </h3>
          <p className="text-gray-700 mb-4">
            Creating app icons for different platforms can be time-consuming. Our tool automates the process, 
            generating all required sizes from a single source image. Save hours of manual work and ensure 
            your icons meet platform-specific requirements.
          </p>

          <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
            Supported Platforms & Sizes
          </h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>iOS</strong> - App Store, Spotlight, Settings, and notification icons</li>
            <li><strong>Android</strong> - Play Store, launcher, action bar, and adaptive icons</li>
            <li><strong>Web</strong> - Favicons, Apple Touch icons, and PWA icons</li>
          </ul>

          <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
            Best Practices for Icon Design
          </h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Use simple, recognizable shapes that scale well to small sizes</li>
            <li>Maintain adequate padding around your icon content</li>
            <li>Test icons on both light and dark backgrounds</li>
            <li>Ensure good contrast for accessibility</li>
            <li>Use vector graphics or high-resolution PNGs as source images</li>
            <li>Keep file sizes optimized for fast loading</li>
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
            "mainEntity": faqItems.map(faq => ({
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

      {/* Custom styles */}
      <style jsx>{`
        input[type="range"] {
          -webkit-appearance: none;
          height: 6px;
          background: #e5e7eb;
          border-radius: 3px;
        }
        
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 18px;
          width: 18px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #fff;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        input[type="range"]::-moz-range-thumb {
          height: 18px;
          width: 18px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #fff;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
}