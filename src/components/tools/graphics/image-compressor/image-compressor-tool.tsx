// components/tools/ImageCompressorTool.tsx
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { 
  MinusCircle, 
  Download, 
  Upload, 
  Trash2,
  Image as ImageIcon,
  FileText,
  Zap,
  FolderOpen,
  FileArchive,
  AlertTriangle,
  Shield,
  Gauge,
  CheckCircle
} from 'lucide-react';

interface CompressedImage {
  id: string;
  originalFile: File;
  originalSize: number;
  compressedSize: number;
  compressedUrl: string;
  format: string;
  quality: number;
  originalObjectUrl: string;
  compressionEffective: boolean;
}

export default function ImageCompressorTool() {
  const [compressedImages, setCompressedImages] = useState<CompressedImage[]>([]);
  const [isCompressing, setIsCompressing] = useState<boolean>(false);
  const [compressionQuality, setCompressionQuality] = useState<number>(80);
  const [outputFormat, setOutputFormat] = useState<'original' | 'jpeg' | 'png' | 'webp'>('original');
  const [dragActive, setDragActive] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // FAQ items
  const imageCompressorFaqItems = [
    {
      question: "Is my image data secure when using this compressor?",
      answer: "Yes! All image processing happens entirely in your browser. We never upload your images to our servers or store them anywhere. Your images remain completely private and secure on your device throughout the compression process."
    },
    {
      question: "What image formats are supported?",
      answer: "The compressor supports JPG, JPEG, PNG, and WebP formats. You can compress images in their original format or convert them to more efficient formats like WebP for better compression ratios."
    },
    {
      question: "How much can I reduce image file sizes?",
      answer: "Compression results vary by image type and content. Typically, JPG images can be reduced by 60-80%, PNG images by 50-70%, and WebP offers the best compression with 25-35% better than JPG. Photos with lots of detail compress better than simple graphics."
    },
    {
      question: "Will compression affect image quality?",
      answer: "Our smart compression algorithm balances file size reduction with quality preservation. You can adjust the compression level to find the perfect balance for your needs. At moderate settings (60-80%), visual differences are often unnoticeable while file sizes reduce significantly."
    },
    {
      question: "Can I compress multiple images at once?",
      answer: "Yes! The tool supports batch processing. You can upload multiple images and compress them all with the same settings, then download them individually or as a ZIP archive for convenience."
    },
    {
      question: "What's the maximum image size I can compress?",
      answer: "The compressor can handle large images, but very high-resolution files (50MP+) may impact browser performance. For optimal experience, we recommend images under 20MP. All processing happens client-side with no file size limits imposed by our servers."
    }
  ];

  // Re-compress images when settings change
  useEffect(() => {
    if (compressedImages.length > 0) {
      recompressAllImages();
    }
  }, [compressionQuality, outputFormat]);

  const recompressAllImages = useCallback(async () => {
    setIsCompressing(true);
    
    const newCompressedImages: CompressedImage[] = [];
    
    for (const image of compressedImages) {
      try {
        const compressedImage = await compressSingleImage(
          image.originalFile, 
          image.originalObjectUrl
        );
        newCompressedImages.push(compressedImage);
      } catch (error) {
        console.error('Error re-compressing image:', error);
        newCompressedImages.push(image);
      }
    }
    
    setCompressedImages(newCompressedImages);
    setIsCompressing(false);
  }, [compressedImages, compressionQuality, outputFormat]);

  const getOptimalFormat = (originalType: string): string => {
    // For PNG files with transparency, keep as PNG or convert to WebP
    // For PNG without transparency or JPEG, convert to WebP or JPEG based on quality
    if (originalType === 'image/png') {
      return outputFormat === 'original' ? 'image/png' : 
             outputFormat === 'webp' ? 'image/webp' : 
             outputFormat === 'jpeg' ? 'image/jpeg' : 'image/png';
    }
    
    if (originalType === 'image/jpeg' || originalType === 'image/jpg') {
      return outputFormat === 'original' ? 'image/jpeg' : 
             outputFormat === 'webp' ? 'image/webp' : 'image/jpeg';
    }
    
    return outputFormat === 'original' ? originalType : 
           `image/${outputFormat}`;
  };

  const compressSingleImage = (file: File, objectUrl?: string): Promise<CompressedImage> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = objectUrl || URL.createObjectURL(file);
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }

        // Set canvas dimensions to image dimensions
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw image on canvas
        ctx.drawImage(img, 0, 0);

        // Determine optimal output format
        const outputMimeType = getOptimalFormat(file.type);
        const quality = compressionQuality / 100;

        // For PNG files, we need to be careful about compression
        // PNG is already compressed, so we might not get much benefit
        if (file.type === 'image/png' && outputMimeType === 'image/png') {
          // For PNG to PNG, we'll use a different approach
          compressPNG(canvas, file, url, quality)
            .then(compressedImage => resolve(compressedImage))
            .catch(error => reject(error));
          return;
        }

        try {
          const compressedDataUrl = canvas.toDataURL(outputMimeType, quality);
          
          // Convert data URL to blob to get accurate file size
          fetch(compressedDataUrl)
            .then(res => res.blob())
            .then(blob => {
              const compressionEffective = blob.size < file.size;
              
              const compressedImage: CompressedImage = {
                id: Math.random().toString(36).substr(2, 9),
                originalFile: file,
                originalSize: file.size,
                compressedSize: blob.size,
                compressedUrl: compressedDataUrl,
                format: outputMimeType.split('/')[1].toUpperCase(),
                quality: compressionQuality,
                originalObjectUrl: url,
                compressionEffective
              };

              canvas.remove();
              resolve(compressedImage);
            })
            .catch(error => {
              canvas.remove();
              reject(error);
            });
        } catch (error) {
          canvas.remove();
          reject(error);
        }
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
        if (!objectUrl) {
          URL.revokeObjectURL(url);
        }
      };

      img.src = url;
    });
  };

  const compressPNG = (canvas: HTMLCanvasElement, file: File, url: string, quality: number): Promise<CompressedImage> => {
    return new Promise((resolve, reject) => {
      // For PNG files, we'll try multiple approaches
      const approaches = [
        // Try WebP first (usually best compression)
        () => canvas.toDataURL('image/webp', quality),
        // Then try JPEG (good for photos)
        () => canvas.toDataURL('image/jpeg', quality),
        // Finally keep as PNG but with lower quality (though PNG is lossless)
        () => canvas.toDataURL('image/png')
      ];

      let bestResult: { dataUrl: string; format: string; size: number } | null = null;
      let attempts = 0;

      const tryNextApproach = () => {
        if (attempts >= approaches.length) {
          // All approaches tried, use the best one or original
          if (bestResult && bestResult.size < file.size) {
            const compressedImage: CompressedImage = {
              id: Math.random().toString(36).substr(2, 9),
              originalFile: file,
              originalSize: file.size,
              compressedSize: bestResult.size,
              compressedUrl: bestResult.dataUrl,
              format: bestResult.format.toUpperCase(),
              quality: compressionQuality,
              originalObjectUrl: url,
              compressionEffective: true
            };
            canvas.remove();
            resolve(compressedImage);
          } else {
            // No compression achieved, return original
            const compressedImage: CompressedImage = {
              id: Math.random().toString(36).substr(2, 9),
              originalFile: file,
              originalSize: file.size,
              compressedSize: file.size,
              compressedUrl: url,
              format: 'PNG',
              quality: 100,
              originalObjectUrl: url,
              compressionEffective: false
            };
            canvas.remove();
            resolve(compressedImage);
          }
          return;
        }

        try {
          const dataUrl = approaches[attempts]();
          const format = attempts === 0 ? 'webp' : attempts === 1 ? 'jpeg' : 'png';
          
          fetch(dataUrl)
            .then(res => res.blob())
            .then(blob => {
              const size = blob.size;
              
              if (!bestResult || size < bestResult.size) {
                bestResult = { dataUrl, format, size };
              }
              
              attempts++;
              tryNextApproach();
            })
            .catch(() => {
              attempts++;
              tryNextApproach();
            });
        } catch (error) {
          attempts++;
          tryNextApproach();
        }
      };

      tryNextApproach();
    });
  };

  const handleFiles = async (files: FileList) => {
    const imageFiles = Array.from(files).filter(file => 
      file.type.startsWith('image/')
    );

    if (imageFiles.length === 0) {
      alert('Please select image files only');
      return;
    }

    setIsCompressing(true);

    try {
      const compressionPromises = imageFiles.map(file => compressSingleImage(file));
      const newCompressedImages = await Promise.all(compressionPromises);
      
      setCompressedImages(prev => [...prev, ...newCompressedImages]);
    } catch (error) {
      console.error('Error compressing images:', error);
      alert('Error compressing some images. Please try again.');
    } finally {
      setIsCompressing(false);
    }
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
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const downloadImage = (image: CompressedImage) => {
    const link = document.createElement('a');
    const extension = image.format.toLowerCase();
    
    link.download = `compressed-${image.originalFile.name.split('.')[0]}.${extension}`;
    link.href = image.compressedUrl;
    link.click();
  };

  const downloadAll = () => {
    compressedImages.forEach(image => {
      downloadImage(image);
    });
  };

  const removeImage = (id: string) => {
    setCompressedImages(prev => {
      const imageToRemove = prev.find(img => img.id === id);
      if (imageToRemove?.originalObjectUrl) {
        URL.revokeObjectURL(imageToRemove.originalObjectUrl);
      }
      return prev.filter(img => img.id !== id);
    });
  };

  const clearAll = () => {
    compressedImages.forEach(image => {
      if (image.originalObjectUrl) {
        URL.revokeObjectURL(image.originalObjectUrl);
      }
    });
    setCompressedImages([]);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const calculateSavings = (original: number, compressed: number): number => {
    if (original === 0) return 0;
    return Math.round(((original - compressed) / original) * 100);
  };

  const totalOriginalSize = compressedImages.reduce((sum, img) => sum + img.originalSize, 0);
  const totalCompressedSize = compressedImages.reduce((sum, img) => sum + img.compressedSize, 0);
  const totalSavings = calculateSavings(totalOriginalSize, totalCompressedSize);

  const effectiveCompressions = compressedImages.filter(img => img.compressionEffective).length;
  const ineffectiveCompressions = compressedImages.filter(img => !img.compressionEffective).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Header */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl shadow-lg mb-4">
            <FileArchive className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Image Compressor Tool</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Free online image compressor tool. Reduce image file size while maintaining quality. 
            Compress JPG, PNG, WebP images for web and mobile. No data stored.
          </p>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Compressor Tool */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-emerald-100">
              {/* Header */}
              <div className="text-center mb-6">
                <div className="flex items-center justify-center mb-3">
                  <div className="bg-emerald-100 p-3 rounded-full">
                    <MinusCircle className="h-6 w-6 text-emerald-600" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Image Compressor
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  Reduce image file size while maintaining quality
                </p>
              </div>

              {/* Upload Area */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center mb-6 transition-colors ${
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
                  Drag & drop images here or click to browse
                </p>
                <p className="text-gray-500 text-sm mb-4">
                  Supports JPG, PNG, WebP • Max 20 images at once
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileInput}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                >
                  <FolderOpen className="h-4 w-4" />
                  Choose Images
                </button>
              </div>

              {/* Compression Settings */}
              <div className="grid md:grid-cols-2 gap-6 mb-6 p-4 bg-gray-50 rounded-lg">
                {/* Quality Slider */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    <Zap className="h-4 w-4 inline mr-1" />
                    Compression Quality: {compressionQuality}%
                    {compressedImages.length > 0 && (
                      <span className="text-emerald-600 text-xs ml-2">
                        (Live updates)
                      </span>
                    )}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={compressionQuality}
                    onChange={(e) => setCompressionQuality(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-emerald"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Smaller File</span>
                    <span>Better Quality</span>
                  </div>
                </div>

                {/* Output Format */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FileText className="h-4 w-4 inline mr-1" />
                    Output Format
                    {compressedImages.length > 0 && (
                      <span className="text-emerald-600 text-xs ml-2">
                        (Live updates)
                      </span>
                    )}
                  </label>
                  <select
                    value={outputFormat}
                    onChange={(e) => setOutputFormat(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="original">Original Format</option>
                    <option value="jpeg">JPEG (Best for photos)</option>
                    <option value="png">PNG (Best for graphics)</option>
                    <option value="webp">WebP (Best compression)</option>
                  </select>
                </div>
              </div>

              {/* Compression Tips */}
              {compressedImages.length > 0 && (
                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-800">
                      <strong>Pro Tip:</strong> For PNG files, try converting to WebP format for better compression. 
                      PNG files are already compressed, so further PNG compression may not reduce file size.
                    </div>
                  </div>
                </div>
              )}

              {/* Compression Results */}
              {compressedImages.length > 0 && (
                <div className="mb-6">
                  {/* Summary Stats */}
                  <div className={`rounded-lg p-4 text-white mb-4 ${
                    totalSavings > 0 
                      ? 'bg-gradient-to-r from-emerald-500 to-green-500' 
                      : 'bg-gradient-to-r from-amber-500 to-orange-500'
                  }`}>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold">{compressedImages.length}</div>
                        <div className="text-emerald-100 text-sm">Images</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{formatFileSize(totalOriginalSize)}</div>
                        <div className="text-emerald-100 text-sm">Original Size</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{formatFileSize(totalCompressedSize)}</div>
                        <div className="text-emerald-100 text-sm">
                          {totalSavings > 0 ? `Compressed • ${totalSavings}% saved` : 
                          totalSavings < 0 ? `Larger • +${Math.abs(totalSavings)}%` : 'No change'}
                        </div>
                      </div>
                    </div>
                    {ineffectiveCompressions > 0 && (
                      <div className="mt-2 text-center text-amber-100 text-sm">
                        ⚠️ {ineffectiveCompressions} image(s) couldn't be compressed further
                      </div>
                    )}
                  </div>

                  {/* Batch Actions */}
                  <div className="flex gap-2 mb-4">
                    <button
                      onClick={downloadAll}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors text-sm"
                    >
                      <Download className="h-4 w-4" />
                      Download All ({compressedImages.length})
                    </button>
                    <button
                      onClick={clearAll}
                      className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                    >
                      <Trash2 className="h-4 w-4" />
                      Clear
                    </button>
                  </div>

                  {/* Images Grid */}
                  <div className="grid gap-4 max-h-96 overflow-y-auto">
                    {compressedImages.map((image) => {
                      const savings = calculateSavings(image.originalSize, image.compressedSize);
                      
                      return (
                        <div key={image.id} className={`border rounded-lg p-4 ${
                          image.compressionEffective 
                            ? 'border-emerald-200 bg-emerald-50' 
                            : 'border-amber-200 bg-amber-50'
                        }`}>
                          <div className="flex items-center gap-4">
                            {/* Image Preview */}
                            <div className="flex-shrink-0">
                              <img
                                src={image.compressedUrl}
                                alt="Compressed"
                                className="w-16 h-16 object-cover rounded border"
                              />
                            </div>
                            
                            {/* File Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <ImageIcon className="h-4 w-4 text-gray-400" />
                                <span className="text-sm font-medium text-gray-900 truncate">
                                  {image.originalFile.name}
                                </span>
                                {!image.compressionEffective && (
                                  <div className="relative group">
                                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                        Compression not effective
                                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                                    </div>
                                  </div>
                                )}
                              </div>
                              <div className="grid grid-cols-3 gap-4 text-xs">
                                <div>
                                  <div className="font-medium text-gray-700">Original</div>
                                  <div className="text-gray-600">{formatFileSize(image.originalSize)}</div>
                                </div>
                                <div>
                                  <div className="font-medium text-gray-700">Compressed</div>
                                  <div className={`font-semibold ${
                                    image.compressionEffective ? 'text-emerald-600' : 'text-amber-600'
                                  }`}>
                                    {formatFileSize(image.compressedSize)}
                                  </div>
                                </div>
                                <div>
                                  <div className="font-medium text-gray-700">Savings</div>
                                  <div className={`font-semibold ${
                                    savings > 0 ? 'text-green-600' : 
                                    savings < 0 ? 'text-red-600' : 'text-gray-600'
                                  }`}>
                                    {savings > 0 ? `-${savings}%` : 
                                      savings < 0 ? `+${Math.abs(savings)}%` : '0%'}
                                  </div>
                                </div>
                              </div>
                              <div className="mt-1 text-xs text-gray-500">
                                Format: {image.format} • Quality: {image.quality}%
                                {!image.compressionEffective && (
                                  <span className="text-amber-600 ml-2">(Try WebP format)</span>
                                )}
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                              <button
                                onClick={() => downloadImage(image)}
                                className="flex items-center gap-1 px-3 py-1 bg-emerald-500 text-white rounded text-xs hover:bg-emerald-600 transition-colors"
                              >
                                <Download className="h-3 w-3" />
                                Download
                              </button>
                              <button
                                onClick={() => removeImage(image.id)}
                                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                                title="Remove"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Loading State */}
              {isCompressing && (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto mb-2"></div>
                  <p className="text-gray-600">
                    {compressedImages.length > 0 ? 'Updating compression...' : 'Compressing images...'}
                  </p>
                </div>
              )}

              {/* Empty State */}
              {compressedImages.length === 0 && !isCompressing && (
                <div className="text-center py-8 text-gray-500">
                  <MinusCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Upload images to start compressing</p>
                </div>
              )}
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
                  <span><strong>Client-Side Processing</strong> - All compression happens in your browser</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Shield className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>No Data Stored</strong> - Your images never leave your device</span>
                </li>
                <li className="flex items-start space-x-2">
                  <MinusCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Instant Processing</strong> - Real-time compression preview</span>
                </li>
              </ul>
            </div>

            {/* Features */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-emerald-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-2">
                  <MinusCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Smart Compression</strong> - Reduce file size while preserving quality</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Gauge className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Quality Control</strong> - Adjust compression level from 1% to 100%</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Download className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Multiple Formats</strong> - Output as JPG, PNG, or WebP</span>
                </div>
                <div className="flex items-start space-x-2">
                  <ImageIcon className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Batch Processing</strong> - Compress multiple images at once</span>
                </div>
              </div>
            </div>

            {/* Optimization Tips */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-emerald-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Optimization Tips</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <h4 className="font-semibold text-blue-800 mb-1">📱 Web Use</h4>
                  <ul className="space-y-1 text-blue-700">
                    <li>• Use 60-80% quality for JPG</li>
                    <li>• Convert PNG to WebP for better compression</li>
                    <li>• Target file size: 100-500KB</li>
                  </ul>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <h4 className="font-semibold text-green-800 mb-1">🖼️ Print & Display</h4>
                  <ul className="space-y-1 text-green-700">
                    <li>• Use 80-95% quality for high resolution</li>
                    <li>• Keep PNG for images with transparency</li>
                    <li>• Maintain 300 DPI for print</li>
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
            {imageCompressorFaqItems.map((faq, index) => (
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
            Free Online Image Compressor
          </h2>
          
          <p className="text-gray-700 mb-4">
            Optimize your images for faster loading times and reduced storage usage with our free online image compressor. 
            Reduce file sizes by up to 90% while maintaining excellent visual quality - perfect for websites, social media, 
            email attachments, and mobile apps.
          </p>

          <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
            Why Compress Images?
          </h3>
          <p className="text-gray-700 mb-4">
            Image compression is essential for modern web development and digital content creation. 
            Compressed images load faster, use less bandwidth, improve SEO rankings, and provide 
            better user experiences across all devices and connection speeds.
          </p>

          <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
            Image Compression Benefits
          </h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Faster website loading times and improved Core Web Vitals</li>
            <li>Reduced bandwidth usage and hosting costs</li>
            <li>Better mobile performance and user experience</li>
            <li>Improved SEO rankings with faster page speeds</li>
            <li>Easier email attachments and file sharing</li>
            <li>Optimized storage usage for large image collections</li>
          </ul>

          <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
            Supported Formats & Features
          </h3>
          <p className="text-gray-700 mb-4">
            Our compressor supports all major image formats including JPG, JPEG, PNG, and WebP. 
            You can adjust compression levels from 1% to 100%, compare original and compressed versions side by side, 
            and batch process multiple images simultaneously for maximum efficiency.
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
            "mainEntity": imageCompressorFaqItems.map(faq => ({
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
  );
}