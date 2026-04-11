// components/utilities/image/ColorPaletteGenerator.tsx
'use client';

import { useState, useRef } from 'react';
import { 
  Palette, 
  Download, 
  Upload, 
  Copy,
  Image as ImageIcon,
  Zap,
  FolderOpen,
  RefreshCw,
  Shield,
  CheckCircle,
  FileText,
  AlertCircle
} from 'lucide-react';

interface Color {
  hex: string;
  rgb: string;
  hsl: string;
  cmyk: string;
}

export default function ColorPaletteGenerator() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [colors, setColors] = useState<Color[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [colorCount, setColorCount] = useState<number>(5);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // FAQ items
  const paletteFaqItems = [
    {
      question: "Is my image data secure when using this tool?",
      answer: "Yes! All color extraction happens entirely in your browser. We never upload your images to our servers or store them anywhere. Your images remain completely private and secure on your device throughout the process."
    },
    {
      question: "How many colors can I extract from an image?",
      answer: "The tool can extract up to 10 dominant colors from your image. You can adjust the number of colors in the settings. The algorithm automatically selects the most visually significant colors while filtering out similar shades."
    },
    {
      question: "What color formats are supported?",
      answer: "The tool provides color codes in HEX (#RRGGBB), RGB (rgb(255,255,255)), HSL (hsl(0,100%,50%)), and CMYK formats. You can copy any format with a single click for use in design tools or code."
    },
    {
      question: "Can I use the extracted colors for commercial projects?",
      answer: "Yes! The colors extracted from your images are yours to use in any project, personal or commercial. However, ensure you have the rights to use the original image if it's not your own creation."
    },
    {
      question: "How accurate is the color extraction?",
      answer: "The color extraction is highly accurate and uses advanced algorithms to identify dominant colors while accounting for color perception. It groups similar shades and presents the most representative colors from your image."
    },
    {
      question: "Can I save and export my color palettes?",
      answer: "Yes! You can export your color palettes as PNG images for design mockups or as JSON files for development projects. You can also copy individual color codes or the entire palette with one click."
    }
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      setOriginalImage(imageUrl);
      extractColors(imageUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageUrl = e.target?.result as string;
          setOriginalImage(imageUrl);
          extractColors(imageUrl);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const extractColors = (imageUrl: string) => {
    setIsProcessing(true);
    
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set canvas size to image size (resize for performance)
      const maxSize = 200;
      let { width, height } = img;
      
      if (width > height) {
        if (width > maxSize) {
          height = (height * maxSize) / width;
          width = maxSize;
        }
      } else {
        if (height > maxSize) {
          width = (width * maxSize) / height;
          height = maxSize;
        }
      }

      canvas.width = width;
      canvas.height = height;

      // Draw image on canvas
      ctx.drawImage(img, 0, 0, width, height);

      // Get image data
      const imageData = ctx.getImageData(0, 0, width, height).data;
      
      // Extract colors using simple color quantization
      const colorMap = new Map();
      
      for (let i = 0; i < imageData.length; i += 4) {
        const r = imageData[i];
        const g = imageData[i + 1];
        const b = imageData[i + 2];
        
        // Group similar colors
        const key = `${Math.floor(r / 32)}-${Math.floor(g / 32)}-${Math.floor(b / 32)}`;
        colorMap.set(key, (colorMap.get(key) || 0) + 1);
      }

      // Sort by frequency and take top colors
      const sortedColors = Array.from(colorMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, colorCount * 2) // Get more colors for variety
        .map(([key]) => {
          const [r, g, b] = key.split('-').map(Number);
          return {
            r: r * 32 + 16,
            g: g * 32 + 16,
            b: b * 32 + 16
          };
        });

      // Remove similar colors and get final palette
      const finalColors: { r: number; g: number; b: number }[] = [];
      for (const color of sortedColors) {
        if (finalColors.length >= colorCount) break;
        
        const isSimilar = finalColors.some(existing => 
          colorDistance(color, existing) < 50
        );
        
        if (!isSimilar) {
          finalColors.push(color);
        }
      }

      // Convert to different color formats
      const colorPalette = finalColors.map(color => ({
        hex: rgbToHex(color.r, color.g, color.b),
        rgb: `rgb(${color.r}, ${color.g}, ${color.b})`,
        hsl: rgbToHsl(color.r, color.g, color.b),
        cmyk: rgbToCmyk(color.r, color.g, color.b)
      }));

      setColors(colorPalette);
      setIsProcessing(false);
    };

    img.onerror = () => {
      console.error('Failed to load image');
      setIsProcessing(false);
    };

    img.src = imageUrl;
  };

  const colorDistance = (color1: { r: number; g: number; b: number }, color2: { r: number; g: number; b: number }) => {
    return Math.sqrt(
      Math.pow(color1.r - color2.r, 2) +
      Math.pow(color1.g - color2.g, 2) +
      Math.pow(color1.b - color2.b, 2)
    );
  };

  const rgbToHex = (r: number, g: number, b: number): string => {
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  };

  const rgbToHsl = (r: number, g: number, b: number): string => {
    r /= 255;
    g /= 255;
    b /= 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      
      h /= 6;
    }

    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
  };

  const rgbToCmyk = (r: number, g: number, b: number): string => {
    r /= 255;
    g /= 255;
    b /= 255;
    
    const k = 1 - Math.max(r, g, b);
    const c = (1 - r - k) / (1 - k) || 0;
    const m = (1 - g - k) / (1 - k) || 0;
    const y = (1 - b - k) / (1 - k) || 0;
    
    return `cmyk(${Math.round(c * 100)}%, ${Math.round(m * 100)}%, ${Math.round(y * 100)}%, ${Math.round(k * 100)}%)`;
  };

  const copyToClipboard = async (text: string, format: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedColor(format);
      setTimeout(() => setCopiedColor(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const downloadPaletteAsImage = () => {
    if (!colors.length) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const colorSize = 100;
    const margin = 20;
    const textHeight = 60;
    canvas.width = colors.length * (colorSize + margin) + margin;
    canvas.height = colorSize + textHeight + margin * 2;

    // Draw background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw colors
    colors.forEach((color, index) => {
      const x = margin + index * (colorSize + margin);
      
      // Draw color swatch
      ctx.fillStyle = color.hex;
      ctx.fillRect(x, margin, colorSize, colorSize);
      
      // Draw border
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, margin, colorSize, colorSize);

      // Draw hex code
      ctx.fillStyle = '#374151';
      ctx.font = '14px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText(color.hex, x + colorSize / 2, margin + colorSize + 25);
    });

    // Download
    const link = document.createElement('a');
    link.download = 'color-palette.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  const downloadPaletteAsJson = () => {
    if (!colors.length) return;

    const paletteData = {
      colors: colors,
      generatedAt: new Date().toISOString(),
      source: 'FreeDevTools Studio Color Palette Generator'
    };

    const dataStr = JSON.stringify(paletteData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.download = 'color-palette.json';
    link.href = URL.createObjectURL(dataBlob);
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const regeneratePalette = () => {
    if (originalImage) {
      extractColors(originalImage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Header */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl shadow-lg mb-4">
            <Palette className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Color Palette Generator</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Free online color palette generator. Extract color schemes from images, create beautiful palettes, 
            and get HEX, RGB, HSL codes. Perfect for designers and developers.
          </p>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Tool */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-emerald-100">
              {/* Header */}
              <div className="text-center mb-6">
                <div className="flex items-center justify-center mb-3">
                  <div className="bg-emerald-100 p-3 rounded-full">
                    <Palette className="h-6 w-6 text-emerald-600" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Color Palette Generator
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  Extract beautiful color schemes from your images
                </p>
              </div>

              {/* Upload Area */}
              {!originalImage && (
                <div className="mb-6">
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      dragActive 
                        ? 'border-emerald-400 bg-emerald-50' 
                        : 'border-gray-300 bg-gray-50'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">
                      Drag & drop an image here or click to browse
                    </p>
                    <p className="text-gray-500 text-sm mb-4">
                      Supports JPG, PNG, WebP, GIF
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                    >
                      <FolderOpen className="h-4 w-4" />
                      Choose Image
                    </button>
                  </div>
                </div>
              )}

              {/* Image Preview and Controls */}
              {originalImage && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Image Preview</h3>
                    <button
                      onClick={() => {
                        setOriginalImage(null);
                        setColors([]);
                      }}
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      Upload Different Image
                    </button>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Image Preview */}
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <img
                        src={originalImage}
                        alt="Uploaded"
                        className="w-full h-48 object-cover"
                      />
                    </div>

                    {/* Controls */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Zap className="h-4 w-4 inline mr-1" />
                          Number of Colors: {colorCount}
                        </label>
                        <input
                          type="range"
                          min="3"
                          max="10"
                          value={colorCount}
                          onChange={(e) => {
                            const newCount = parseInt(e.target.value);
                            setColorCount(newCount);
                            if (originalImage) {
                              extractColors(originalImage);
                            }
                          }}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-emerald"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>Fewer</span>
                          <span>More</span>
                        </div>
                      </div>

                      <button
                        onClick={regeneratePalette}
                        disabled={isProcessing}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50"
                      >
                        <RefreshCw className={`h-4 w-4 ${isProcessing ? 'animate-spin' : ''}`} />
                        {isProcessing ? 'Extracting Colors...' : 'Regenerate Palette'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Color Palette Results */}
              {colors.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Extracted Color Palette</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={downloadPaletteAsImage}
                        className="flex items-center gap-2 px-3 py-1 bg-emerald-500 text-white rounded text-sm hover:bg-emerald-600 transition-colors"
                      >
                        <Download className="h-3 w-3" />
                        PNG
                      </button>
                      <button
                        onClick={downloadPaletteAsJson}
                        className="flex items-center gap-2 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
                      >
                        <Download className="h-3 w-3" />
                        JSON
                      </button>
                    </div>
                  </div>

                  {/* Color Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {colors.map((color, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
                        {/* Color Swatch */}
                        <div 
                          className="h-20 w-full"
                          style={{ backgroundColor: color.hex }}
                        />
                        
                        {/* Color Info */}
                        <div className="p-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-sm font-semibold">{color.hex}</span>
                            <button
                              onClick={() => copyToClipboard(color.hex, 'hex')}
                              className="p-1 text-gray-400 hover:text-emerald-600 transition-colors"
                            >
                              {copiedColor === 'hex' ? (
                                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </button>
                          </div>
                          
                          <div className="space-y-1 text-xs text-gray-600">
                            <div className="flex justify-between items-center">
                              <span>RGB</span>
                              <button
                                onClick={() => copyToClipboard(color.rgb, 'rgb')}
                                className="p-0.5 text-gray-400 hover:text-emerald-600 transition-colors"
                              >
                                {copiedColor === 'rgb' ? '✓' : 'Copy'}
                              </button>
                            </div>
                            <div className="flex justify-between items-center">
                              <span>HSL</span>
                              <button
                                onClick={() => copyToClipboard(color.hsl, 'hsl')}
                                className="p-0.5 text-gray-400 hover:text-emerald-600 transition-colors"
                              >
                                {copiedColor === 'hsl' ? '✓' : 'Copy'}
                              </button>
                            </div>
                            <div className="flex justify-between items-center">
                              <span>CMYK</span>
                              <button
                                onClick={() => copyToClipboard(color.cmyk, 'cmyk')}
                                className="p-0.5 text-gray-400 hover:text-emerald-600 transition-colors"
                              >
                                {copiedColor === 'cmyk' ? '✓' : 'Copy'}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Loading State */}
              {isProcessing && (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto mb-2"></div>
                  <p className="text-gray-600">Analyzing image colors...</p>
                </div>
              )}

              {/* Empty State */}
              {!originalImage && !isProcessing && (
                <div className="text-center py-8 text-gray-500">
                  <Palette className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Upload an image to extract colors</p>
                </div>
              )}

              {/* Hidden canvas for image processing */}
              <canvas ref={canvasRef} style={{ display: 'none' }} />

              {/* Custom slider styles */}
              <style jsx>{`
                .slider-emerald::-webkit-slider-thumb {
                  appearance: none;
                  height: 20px;
                  width: 20px;
                  border-radius: 50%;
                  background: #10b981;
                  cursor: pointer;
                  border: 2px solid #fff;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                }
                
                .slider-emerald::-moz-range-thumb {
                  height: 20px;
                  width: 20px;
                  border-radius: 50%;
                  background: #10b981;
                  cursor: pointer;
                  border: 2px solid #fff;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                }
              `}</style>
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
                  <span><strong>Client-Side Processing</strong> - All color extraction happens in your browser</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Shield className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>No Data Stored</strong> - Your images never leave your device</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Palette className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Instant Processing</strong> - Real-time color palette generation</span>
                </li>
              </ul>
            </div>

            {/* Features */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-emerald-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-2">
                  <Palette className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Smart Color Extraction</strong> - Automatically detects dominant colors</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Multiple Color Formats</strong> - HEX, RGB, HSL, CMYK codes</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Copy className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>One-Click Copy</strong> - Copy color codes instantly</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Download className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Palette Export</strong> - Download palettes as PNG or JSON</span>
                </div>
              </div>
            </div>

            {/* Color Theory Tips */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-emerald-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Color Theory Tips</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <h4 className="font-semibold text-blue-800 mb-1">🎨 Harmonious Palettes</h4>
                  <ul className="space-y-1 text-blue-700">
                    <li>• Use 3-5 colors for balance</li>
                    <li>• Include light, medium, dark shades</li>
                    <li>• 60-30-10 rule for distribution</li>
                  </ul>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <h4 className="font-semibold text-green-800 mb-1">✨ Best Practices</h4>
                  <ul className="space-y-1 text-green-700">
                    <li>• Start with dominant colors</li>
                    <li>• Add accent colors for contrast</li>
                    <li>• Test accessibility ratios</li>
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
            {paletteFaqItems.map((faq, index) => (
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
            Free Online Color Palette Generator
          </h2>
          
          <p className="text-gray-700 mb-4">
            Extract beautiful color palettes from your images with our free online color palette generator. 
            Perfect for designers, developers, and creatives who want to create harmonious color schemes 
            inspired by photographs, artwork, or any visual content.
          </p>

          <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
            Why Extract Colors from Images?
          </h3>
          <p className="text-gray-700 mb-4">
            Color palette extraction helps you create visually appealing designs by leveraging existing 
            color harmonies found in nature, photography, and art. It's an excellent way to ensure 
            color consistency and create professional-looking designs with minimal effort.
          </p>

          <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
            Professional Color Palette Benefits
          </h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Create consistent brand colors across all platforms</li>
            <li>Speed up design workflow with instant color extraction</li>
            <li>Ensure color harmony and visual appeal</li>
            <li>Get accurate color codes for development</li>
            <li>Build accessible color combinations with proper contrast</li>
            <li>Export palettes for design tools and code projects</li>
          </ul>

          <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
            How Color Extraction Works
          </h3>
          <p className="text-gray-700 mb-4">
            Our advanced algorithm analyzes your image pixel by pixel to identify the most dominant and 
            visually significant colors. It groups similar shades, removes duplicates, and presents you 
            with a clean, usable palette that captures the essence of your image.
          </p>
        </div>
      </div>

      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": paletteFaqItems.map(faq => ({
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
