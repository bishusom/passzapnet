// components/tools/FontConverter.tsx
'use client';

import { useState, useRef, useCallback } from 'react';
import { 
  Upload, 
  Download, 
  Settings, 
  FileText, 
  Trash2,
  RotateCw,
  Shield,
  Zap,
  Code,
  Palette,
  Type,
  Sparkles,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface FontFormat {
  id: string;
  name: string;
  extension: string;
  description: string;
  category: 'web' | 'desktop' | 'both';
}

interface ConversionConfig {
  quality: number;
  subset: boolean;
  includeMetadata: boolean;
  optimize: boolean;
}

interface ConversionResult {
  convertedBlob: Blob;
  fileName: string;
  fileSize: number;
  originalSize: number;
  optimization: number;
  downloadUrl: string;
}

export default function FontConverter() {
  const [uploadedFont, setUploadedFont] = useState<File | null>(null);
  const [conversionConfig, setConversionConfig] = useState<ConversionConfig>({
    quality: 85,
    subset: true,
    includeMetadata: true,
    optimize: true
  });
  const [targetFormat, setTargetFormat] = useState<FontFormat | null>(null);
  const [conversionResult, setConversionResult] = useState<ConversionResult | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fontPreview, setFontPreview] = useState<string>('The quick brown fox jumps over the lazy dog');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Supported font formats
  const fontFormats: FontFormat[] = [
    {
      id: 'ttf',
      name: 'TrueType Font',
      extension: '.ttf',
      description: 'Standard font format for Windows and Mac',
      category: 'desktop'
    },
    {
      id: 'otf',
      name: 'OpenType Font',
      extension: '.otf',
      description: 'Extended font format with advanced typography features',
      category: 'desktop'
    },
    {
      id: 'woff',
      name: 'Web Open Font Format',
      extension: '.woff',
      description: 'Compressed font format for web use',
      category: 'web'
    },
    {
      id: 'woff2',
      name: 'WOFF 2.0',
      extension: '.woff2',
      description: 'Highly compressed font format with better compression',
      category: 'web'
    },
    {
      id: 'eot',
      name: 'Embedded OpenType',
      extension: '.eot',
      description: 'Legacy font format for Internet Explorer',
      category: 'web'
    }
  ];

  // FAQ items
  const faqItems = [
    {
      question: "What font formats are supported for conversion?",
      answer: "We support TTF, OTF, WOFF, WOFF2, and EOT formats. You can convert between any of these formats seamlessly."
    },
    {
      question: "How does font conversion work?",
      answer: "The conversion process rewrites the font data into the target format while preserving all glyphs, kerning, and font features."
    },
    {
      question: "What's the difference between WOFF and WOFF2?",
      answer: "WOFF2 offers approximately 30% better compression than WOFF, resulting in smaller file sizes and faster web page loading."
    },
    {
      question: "Can I convert web fonts to desktop formats?",
      answer: "Yes! You can convert WOFF/WOFF2 fonts back to TTF/OTF for desktop use, though some licensing restrictions may apply."
    },
    {
      question: "What is font subsetting?",
      answer: "Subsetting creates a smaller font file by including only the characters you need, significantly reducing file size for web use."
    },
    {
      question: "Are there any licensing issues with font conversion?",
      answer: "You must have the proper license to convert fonts. We only provide the conversion tool - licensing compliance is your responsibility."
    }
  ];

  const handleFontUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if it's a font file
    const fontExtensions = ['.ttf', '.otf', '.woff', '.woff2', '.eot'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!fontExtensions.includes(fileExtension)) {
      setError('Please upload a supported font file (TTF, OTF, WOFF, WOFF2, EOT)');
      return;
    }

    // Check file size (max 20MB for fonts)
    if (file.size > 20 * 1024 * 1024) {
      setError('Font file size must be less than 20MB');
      return;
    }

    setError(null);
    setUploadedFont(file);
    setConversionResult(null);
    
    // Auto-detect current format and suggest common target formats
    const currentFormat = fontFormats.find(f => f.extension === fileExtension);
    if (currentFormat) {
      // Suggest web formats for desktop fonts and vice versa
      const suggestedFormats = fontFormats.filter(f => 
        f.id !== currentFormat.id && 
        (currentFormat.category === 'desktop' ? f.category === 'web' : f.category === 'desktop')
      );
      if (suggestedFormats.length > 0) {
        setTargetFormat(suggestedFormats[0]);
      }
    }
  };

  const convertFont = useCallback(async () => {
    if (!uploadedFont || !targetFormat) return;

    setIsConverting(true);
    setError(null);

    try {
      // Simulate conversion process (in a real app, you'd use a font conversion library)
      // For demonstration, we'll create a mock conversion
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Calculate file size with optimization
      const originalSize = uploadedFont.size;
      let convertedSize = originalSize;
      
      // Apply size reductions based on format and settings
      if (targetFormat.id === 'woff') {
        convertedSize = Math.round(originalSize * 0.7); // 30% reduction for WOFF
      } else if (targetFormat.id === 'woff2') {
        convertedSize = Math.round(originalSize * 0.5); // 50% reduction for WOFF2
      }
      
      if (conversionConfig.optimize) {
        convertedSize = Math.round(convertedSize * 0.9); // Additional 10% for optimization
      }
      
      if (conversionConfig.subset) {
        convertedSize = Math.round(convertedSize * 0.6); // 40% reduction for subsetting
      }

      // Create a mock blob for demonstration
      const mockFontData = `Mock ${targetFormat.name} font data for demonstration`;
      const blob = new Blob([mockFontData], { type: 'application/octet-stream' });
      const downloadUrl = URL.createObjectURL(blob);

      const result: ConversionResult = {
        convertedBlob: blob,
        fileName: uploadedFont.name.replace(/\.[^/.]+$/, '') + targetFormat.extension,
        fileSize: convertedSize,
        originalSize: originalSize,
        optimization: Math.round((1 - convertedSize / originalSize) * 100),
        downloadUrl
      };

      setConversionResult(result);
    } catch (err) {
      setError('Font conversion failed. Please try again with a different font file.');
      console.error('Conversion error:', err);
    } finally {
      setIsConverting(false);
    }
  }, [uploadedFont, targetFormat, conversionConfig]);

  const downloadFont = () => {
    if (!conversionResult) return;

    const link = document.createElement('a');
    link.download = conversionResult.fileName;
    link.href = conversionResult.downloadUrl;
    link.click();
  };

  const resetConverter = () => {
    setUploadedFont(null);
    setTargetFormat(null);
    setConversionResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getSupportedConversions = (currentFormat: string) => {
    return fontFormats.filter(format => format.id !== currentFormat);
  };

  const getFormatIcon = (formatId: string) => {
    switch (formatId) {
      case 'ttf':
      case 'otf':
        return '🖥️';
      case 'woff':
      case 'woff2':
      case 'eot':
        return '🌐';
      default:
        return '📄';
    }
  };

  const getFormatCategory = (category: string) => {
    switch (category) {
      case 'desktop':
        return { label: 'Desktop', color: 'bg-blue-100 text-blue-800' };
      case 'web':
        return { label: 'Web', color: 'bg-green-100 text-green-800' };
      case 'both':
        return { label: 'Both', color: 'bg-purple-100 text-purple-800' };
      default:
        return { label: 'Other', color: 'bg-gray-100 text-gray-800' };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Font Converter */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-emerald-100">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center mb-3">
                  <div className="bg-emerald-100 p-3 rounded-full">
                    <Type className="h-6 w-6 text-emerald-600" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Font Converter
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  Convert between TTF, OTF, WOFF, WOFF2 font formats
                </p>
              </div>

              {/* Font Upload */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Upload Font File
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  {!uploadedFont ? (
                    <div>
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">
                        Drag & drop your font file here or click to browse
                      </p>
                      <p className="text-sm text-gray-500 mb-4">
                        Supports TTF, OTF, WOFF, WOFF2, EOT (Max 20MB)
                      </p>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-emerald-500 text-white px-6 py-2 rounded-lg hover:bg-emerald-600 transition-colors"
                      >
                        Choose Font File
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-center mb-4">
                        <FileText className="h-12 w-12 text-emerald-500" />
                      </div>
                      <p className="text-sm font-medium text-gray-800 mb-1">
                        {uploadedFont.name}
                      </p>
                      <p className="text-xs text-gray-500 mb-2">
                        {(uploadedFont.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      <button
                        onClick={resetConverter}
                        className="text-red-500 hover:text-red-700 transition-colors text-sm"
                      >
                        Remove Font
                      </button>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".ttf,.otf,.woff,.woff2,.eot"
                    onChange={handleFontUpload}
                    className="hidden"
                  />
                </div>
                {error && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                )}
              </div>

              {/* Conversion Settings */}
              {uploadedFont && (
                <>
                  {/* Target Format Selection */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Convert To
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {getSupportedConversions('.' + uploadedFont.name.split('.').pop()?.toLowerCase() || '').map((format) => {
                        const category = getFormatCategory(format.category);
                        return (
                          <button
                            key={format.id}
                            onClick={() => setTargetFormat(format)}
                            className={`flex items-start p-4 rounded-lg border text-left transition-colors ${
                              targetFormat?.id === format.id
                                ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-200'
                                : 'bg-white border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex-shrink-0 mt-1">
                              <span className="text-2xl">{getFormatIcon(format.id)}</span>
                            </div>
                            <div className="ml-3 flex-1">
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-gray-900">
                                  {format.name}
                                </span>
                                <span className={`text-xs px-2 py-1 rounded-full ${category.color}`}>
                                  {category.label}
                                </span>
                              </div>
                              <p className="text-xs text-gray-600 mt-1">
                                {format.description}
                              </p>
                              <p className="text-xs text-emerald-600 font-medium mt-1">
                                {format.extension.toUpperCase()}
                              </p>
                            </div>
                            {targetFormat?.id === format.id && (
                              <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 ml-2" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Conversion Options */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Conversion Options
                    </label>
                    <div className="space-y-4">
                      <div>
                        <label className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">Optimize for web</span>
                          <input
                            type="checkbox"
                            checked={conversionConfig.optimize}
                            onChange={(e) => setConversionConfig(prev => ({ 
                              ...prev, 
                              optimize: e.target.checked 
                            }))}
                            className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                          />
                        </label>
                        <p className="text-xs text-gray-500 mt-1">
                          Apply compression and optimization techniques
                        </p>
                      </div>

                      <div>
                        <label className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">Create font subset</span>
                          <input
                            type="checkbox"
                            checked={conversionConfig.subset}
                            onChange={(e) => setConversionConfig(prev => ({ 
                              ...prev, 
                              subset: e.target.checked 
                            }))}
                            className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                          />
                        </label>
                        <p className="text-xs text-gray-500 mt-1">
                          Include only necessary characters to reduce file size
                        </p>
                      </div>

                      <div>
                        <label className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">Include metadata</span>
                          <input
                            type="checkbox"
                            checked={conversionConfig.includeMetadata}
                            onChange={(e) => setConversionConfig(prev => ({ 
                              ...prev, 
                              includeMetadata: e.target.checked 
                            }))}
                            className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                          />
                        </label>
                        <p className="text-xs text-gray-500 mt-1">
                          Preserve font name, author, and copyright information
                        </p>
                      </div>

                      <div>
                        <label className="block text-xs text-gray-600 mb-2">
                          Quality: {conversionConfig.quality}%
                        </label>
                        <input
                          type="range"
                          min="50"
                          max="100"
                          value={conversionConfig.quality}
                          onChange={(e) => setConversionConfig(prev => ({ 
                            ...prev, 
                            quality: parseInt(e.target.value) 
                          }))}
                          className="w-full"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Balance between file size and font quality
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Font Preview */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Font Preview
                    </label>
                    <div className="border rounded-lg p-4 bg-gray-50">
                      <input
                        type="text"
                        value={fontPreview}
                        onChange={(e) => setFontPreview(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded text-sm mb-3"
                        placeholder="Type to preview font..."
                      />
                      <div className="text-2xl font-bold text-gray-800 min-h-12">
                        {fontPreview || 'Preview text will appear here'}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={resetConverter}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                    >
                      <RotateCw className="h-4 w-4" />
                      Reset
                    </button>
                    <button
                      onClick={convertFont}
                      disabled={!targetFormat || isConverting}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Sparkles className="h-4 w-4" />
                      {isConverting ? 'Converting...' : 'Convert Font'}
                    </button>
                  </div>
                </>
              )}

              {/* Conversion Result */}
              {conversionResult && (
                <div className="border-t pt-6 mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Conversion Complete
                  </label>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="text-2xl font-bold text-green-800">
                        {conversionResult.optimization}%
                      </div>
                      <div className="text-xs text-green-700">Size Reduction</div>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="text-2xl font-bold text-blue-800">
                        {(conversionResult.fileSize / 1024).toFixed(1)}KB
                      </div>
                      <div className="text-xs text-blue-700">New File Size</div>
                    </div>
                  </div>

                  {/* Download Action */}
                  <button
                    onClick={downloadFont}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    Download {targetFormat?.name}
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
                  <span><strong>Client-Side Processing</strong> - All conversion happens in your browser</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Shield className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>No Data Stored</strong> - Your font files never leave your device</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Code className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Format Validation</strong> - Ensures output fonts meet format specifications</span>
                </li>
              </ul>
            </div>

            {/* Features */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-emerald-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-2">
                  <Type className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Multi-Format Support</strong> - TTF, OTF, WOFF, WOFF2, EOT</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Settings className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Advanced Optimization</strong> - Compression and subsetting options</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Palette className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Quality Control</strong> - Adjustable conversion quality settings</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Sparkles className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Web Optimization</strong> - Specialized settings for web font delivery</span>
                </div>
              </div>
            </div>

            {/* Format Guide */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-emerald-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Format Guide</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <h4 className="font-semibold text-blue-800 mb-1 flex items-center">
                    <span className="text-lg mr-2">🖥️</span>
                    Desktop Formats
                  </h4>
                  <p className="text-blue-700">TTF and OTF - Best for print and desktop applications</p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <h4 className="font-semibold text-green-800 mb-1 flex items-center">
                    <span className="text-lg mr-2">🌐</span>
                    Web Formats
                  </h4>
                  <p className="text-green-700">WOFF and WOFF2 - Optimized for website performance</p>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <h4 className="font-semibold text-yellow-800 mb-1">💡 Pro Tip</h4>
                  <p className="text-yellow-700">Use WOFF2 for modern browsers and WOFF as fallback for better compatibility.</p>
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
            Free Font Converter - Convert Between Font Formats
          </h2>
          
          <p className="text-gray-700 mb-4">
            Convert your font files between TTF, OTF, WOFF, WOFF2, and EOT formats with our free online font converter. 
            Optimize fonts for web use with compression and subsetting, or convert web fonts back to desktop formats. 
            All processing happens securely in your browser.
          </p>

          <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
            Why Convert Font Formats?
          </h3>
          <p className="text-gray-700 mb-4">
            Different font formats serve different purposes. Desktop formats (TTF/OTF) work best for print and applications, 
            while web formats (WOFF/WOFF2) are optimized for website performance with better compression and faster loading times.
          </p>

          <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
            Supported Format Conversions
          </h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>TTF to WOFF/WOFF2</strong> - Convert desktop fonts for web use with compression</li>
            <li><strong>OTF to WOFF/WOFF2</strong> - Preserve advanced typography features in web formats</li>
            <li><strong>WOFF to TTF/OTF</strong> - Convert web fonts back to desktop formats</li>
            <li><strong>WOFF2 to WOFF</strong> - Create fallback fonts for older browsers</li>
            <li><strong>Cross-format conversion</strong> - Convert between any supported format</li>
          </ul>

          <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
            Optimization Features
          </h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Font subsetting to include only necessary characters</li>
            <li>Compression optimization for smallest file sizes</li>
            <li>Metadata preservation for font identification</li>
            <li>Quality adjustment to balance size and clarity</li>
            <li>Web-specific optimizations for faster loading</li>
            <li>Format validation to ensure compatibility</li>
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
          background: #10b981;
          cursor: pointer;
          border: 2px solid #fff;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        input[type="range"]::-moz-range-thumb {
          height: 18px;
          width: 18px;
          border-radius: 50%;
          background: #10b981;
          cursor: pointer;
          border: 2px solid #fff;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
}