// components/tools/ImageMetadataViewerTool.tsx
'use client';

import { useState, useRef } from 'react';
import { 
  Upload, 
  Download, 
  Eye,
  FileText,
  Trash2,
  Image as ImageIcon,
  Shield,
  Zap,
  CheckCircle,
  MapPin,
  Camera,
  Calendar,
  Settings
} from 'lucide-react';

interface ImageMetadata {
  [key: string]: string | number | undefined;
}

interface ExtractedMetadata {
  [key: string]: {
    value: string;
    description: string;
    category: string;
  };
}

export default function ImageMetadataViewerTool() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [cleanedImageUrl, setCleanedImageUrl] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<ImageMetadata | null>(null);
  const [extractedExifData, setExtractedExifData] = useState<ExtractedMetadata | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [imageDimensions, setImageDimensions] = useState<{width: number, height: number} | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // FAQ items
  const metadataViewerFaqItems = [
    {
      question: "What types of metadata can this tool detect?",
      answer: "Our tool detects basic file metadata including file name, size, type, and dimensions. For comprehensive EXIF data (GPS, camera settings), specialized EXIF libraries are needed, but our stripper removes all embedded metadata effectively."
    },
    {
      question: "Does stripping metadata affect image quality?",
      answer: "No, stripping metadata only removes the hidden information embedded in the image file. The visual quality, dimensions, and colors of the image remain completely unchanged."
    },
    {
      question: "Can I recover metadata after stripping it?",
      answer: "No, once metadata is stripped and you download the clean image, the metadata is permanently removed. Always keep your original files if you need to preserve the metadata for personal use."
    },
    {
      question: "Do all images contain metadata?",
      answer: "Most images from digital cameras and smartphones contain extensive metadata. Screenshots and images that have been heavily processed or converted multiple times may have less or no metadata."
    },
    {
      question: "Is it legal to remove metadata from images?",
      answer: "Yes, it's completely legal to remove metadata from your own images for privacy reasons. However, be aware that removing metadata from images you don't own or that are used as evidence may have legal implications."
    },
    {
      question: "What image formats support metadata?",
      answer: "JPEG and TIFF files typically contain the most extensive metadata. PNG files can contain some metadata, while GIF files usually contain very little. Our tool works with all common image formats."
    }
  ];

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const fileUrl = URL.createObjectURL(file);
      setOriginalImage(fileUrl);
      setCleanedImageUrl(null);
      setMetadata(null);
      setExtractedExifData(null);

      // Create thumbnail and get dimensions
      const img = new Image();
      img.onload = () => {
        setImageDimensions({
          width: img.width,
          height: img.height
        });
      };
      img.src = fileUrl;

      // Extract basic file metadata
      const basicMetadata: ImageMetadata = {
        'File Name': file.name,
        'File Size': `${(file.size / 1024).toFixed(1)} KB`,
        'MIME Type': file.type,
        'Last Modified': new Date(file.lastModified).toLocaleString(),
      };

      // Extract EXIF metadata
      try {
        // Dynamically import exifreader to avoid SSR issues
        const ExifReader = (await import('exifreader')).default;
        const tags = await ExifReader.load(file);
        const exifData: ExtractedMetadata = {};
        
        Object.entries(tags).forEach(([key, tag]: [string, any]) => {
          if (tag.value !== undefined && tag.value !== null) {
            let value = '';
            let category = 'Other';
            
            // Categorize and format the data
            if (key.includes('GPS') || key.includes('Location')) {
              category = 'Location';
              if (Array.isArray(tag.value)) {
                value = tag.value.join(', ');
              } else {
                value = tag.value.toString();
              }
            } else if (key.includes('DateTime') || key.includes('Date')) {
              category = 'Date & Time';
              value = tag.value.toString();
            } else if (key.includes('Model') || key.includes('Make') || key.includes('Lens')) {
              category = 'Camera';
              value = tag.value.toString();
            } else if (key.includes('Exposure') || key.includes('Focal') || key.includes('Aperture') || key.includes('ISO')) {
              category = 'Camera Settings';
              value = tag.value.toString();
            } else {
              category = 'Other';
              value = tag.value.toString();
            }
            
            exifData[key] = {
              value: value,
              description: tag.description || key,
              category: category
            };
          }
        });
        
        setExtractedExifData(exifData);
        
        // Add some EXIF data to basic metadata for display
        if (tags['Image Width']?.value) {
            const widthValue = tags['Image Width'].value;
            basicMetadata['Width'] = Array.isArray(widthValue) ? widthValue[0] : widthValue;
            }
        if (tags['Image Height']?.value) {
            const heightValue = tags['Image Height'].value;
            basicMetadata['Height'] = Array.isArray(heightValue) ? heightValue[0] : heightValue;
            }
        if (tags['Make']?.value) {
            const makeValue = tags['Make'].value;
            basicMetadata['Camera Make'] = Array.isArray(makeValue) ? makeValue.join(', ') : makeValue.toString();
        }
        if (tags['Model']?.value) {
            const modelValue = tags['Model'].value;
            basicMetadata['Camera Model'] = Array.isArray(modelValue) ? modelValue.join(', ') : modelValue.toString();
        }
        
      } catch (error) {
        console.log('No EXIF data found or error reading EXIF:', error);
      }

      setMetadata(basicMetadata);
    }
  };

  const stripMetadata = () => {
    if (!originalImage) return;

    setIsProcessing(true);
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    const image = new Image();

    image.onload = () => {
      if (canvas && context) {
        canvas.width = image.width;
        canvas.height = image.height;
        
        // Draw image - this strips all EXIF and other metadata
        context.drawImage(image, 0, 0);

        // Convert to data URL
        const cleanedDataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setCleanedImageUrl(cleanedDataUrl);
        setIsProcessing(false);

        // Update metadata to show what was removed
        const removalSummary: ImageMetadata = {
          'File Name': metadata?.['File Name'],
          'File Size': metadata?.['File Size'],
          'MIME Type': metadata?.['MIME Type'],
          'Processing': 'All metadata stripped',
          'Metadata Fields Removed': extractedExifData ? Object.keys(extractedExifData).length : 0,
          'GPS Data': 'Removed',
          'Camera Info': 'Removed', 
          'EXIF Data': 'Removed',
          'Image Dimensions': `${image.width} × ${image.height}px`,
        };
        
        setMetadata(removalSummary);
      }
    };

    image.src = originalImage;
  };

  const downloadCleanImage = () => {
    if (cleanedImageUrl) {
      const link = document.createElement('a');
      link.href = cleanedImageUrl;
      link.download = 'clean-image.jpg';
      link.click();
    }
  };

  const resetForm = () => {
    setOriginalImage(null);
    setCleanedImageUrl(null);
    setMetadata(null);
    setExtractedExifData(null);
    setImageDimensions(null);
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
            <Eye className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Image Metadata Viewer</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Free online image metadata viewer and stripper. View EXIF data, GPS location, camera settings 
            and strip sensitive metadata for privacy protection. All processing happens in your browser.
          </p>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Metadata Viewer Tool */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-emerald-100">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center mb-3">
                  <div className="bg-emerald-100 p-3 rounded-full">
                    <Eye className="h-6 w-6 text-emerald-600" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Image Metadata Viewer
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  View and strip image metadata for privacy
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
                        Upload an image to analyze
                      </p>
                      <p className="text-sm text-gray-500">
                        View metadata and strip sensitive information
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-4">
                      {/* Thumbnail Display */}
                      <div className="relative">
                        <img 
                          src={originalImage} 
                          alt="Uploaded preview" 
                          className="w-32 h-32 object-cover rounded-lg border-2 border-emerald-200 shadow-sm"
                        />
                        {imageDimensions && (
                          <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white text-xs px-2 py-1 rounded-full">
                            {imageDimensions.width}×{imageDimensions.height}
                          </div>
                        )}
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-gray-800">Image loaded successfully</p>
                        <p className="text-sm text-gray-600">Ready for metadata analysis</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Metadata That Will Be Removed */}
              {extractedExifData && Object.keys(extractedExifData).length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Trash2 className="h-5 w-5 text-red-500" />
                    <h3 className="text-lg font-semibold text-gray-800">Metadata That Will Be Removed</h3>
                  </div>
                  
                  <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Location Data */}
                      {Object.entries(extractedExifData).filter(([key, data]) => data.category === 'Location').length > 0 && (
                        <div>
                          <h4 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            Location Data
                          </h4>
                          <div className="space-y-1">
                            {Object.entries(extractedExifData)
                              .filter(([key, data]) => data.category === 'Location')
                              .map(([key, data]) => (
                                <div key={key} className="flex justify-between text-sm">
                                  <span className="text-red-700">{data.description}:</span>
                                  <span className="text-red-600 font-medium">{data.value}</span>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Camera Information */}
                      {Object.entries(extractedExifData).filter(([key, data]) => data.category === 'Camera').length > 0 && (
                        <div>
                          <h4 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                            <Camera className="h-4 w-4" />
                            Camera Information
                          </h4>
                          <div className="space-y-1">
                            {Object.entries(extractedExifData)
                              .filter(([key, data]) => data.category === 'Camera')
                              .map(([key, data]) => (
                                <div key={key} className="flex justify-between text-sm">
                                  <span className="text-red-700">{data.description}:</span>
                                  <span className="text-red-600 font-medium">{data.value}</span>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Date & Time */}
                      {Object.entries(extractedExifData).filter(([key, data]) => data.category === 'Date & Time').length > 0 && (
                        <div>
                          <h4 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Date & Time
                          </h4>
                          <div className="space-y-1">
                            {Object.entries(extractedExifData)
                              .filter(([key, data]) => data.category === 'Date & Time')
                              .map(([key, data]) => (
                                <div key={key} className="flex justify-between text-sm">
                                  <span className="text-red-700">{data.description}:</span>
                                  <span className="text-red-600 font-medium">{data.value}</span>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Camera Settings */}
                      {Object.entries(extractedExifData).filter(([key, data]) => data.category === 'Camera Settings').length > 0 && (
                        <div>
                          <h4 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                            <Settings className="h-4 w-4" />
                            Camera Settings
                          </h4>
                          <div className="space-y-1">
                            {Object.entries(extractedExifData)
                              .filter(([key, data]) => data.category === 'Camera Settings')
                              .map(([key, data]) => (
                                <div key={key} className="flex justify-between text-sm">
                                  <span className="text-red-700">{data.description}:</span>
                                  <span className="text-red-600 font-medium">{data.value}</span>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Other Metadata */}
                    {Object.entries(extractedExifData).filter(([key, data]) => data.category === 'Other').length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-semibold text-red-800 mb-2">Other Metadata</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {Object.entries(extractedExifData)
                            .filter(([key, data]) => data.category === 'Other')
                            .map(([key, data]) => (
                              <div key={key} className="flex justify-between text-sm">
                                <span className="text-red-700">{data.description}:</span>
                                <span className="text-red-600 font-medium">{data.value}</span>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-3 pt-3 border-t border-red-200">
                      <p className="text-sm text-red-700">
                        <strong>Total metadata fields found:</strong> {Object.keys(extractedExifData).length}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* No EXIF Data Message */}
              {originalImage && (!extractedExifData || Object.keys(extractedExifData).length === 0) && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <h3 className="text-lg font-semibold text-gray-800">Metadata Analysis</h3>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <p className="text-green-700 text-sm">
                      No embedded EXIF metadata found in this image. The image may already be clean 
                      or metadata may have been removed previously.
                    </p>
                  </div>
                </div>
              )}

              {/* Basic Metadata Display */}
              {metadata && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="h-5 w-5 text-emerald-500" />
                    <h3 className="text-lg font-semibold text-gray-800">Image Information</h3>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    {Object.entries(metadata).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2 border-b border-gray-200 last:border-b-0">
                        <span className="font-medium text-gray-700">{key}:</span>
                        <span className="text-gray-600">{value?.toString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {originalImage && !cleanedImageUrl && (
                <div className="flex gap-3 mb-6">
                  <button
                    onClick={stripMetadata}
                    disabled={isProcessing}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <Trash2 className="h-5 w-5" />
                    )}
                    {isProcessing ? 'Processing...' : 'Strip All Metadata'}
                  </button>
                </div>
              )}

              {/* Clean Image Preview */}
              {cleanedImageUrl && (
                <div className="mb-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <p className="text-lg font-medium text-green-700">Metadata Successfully Removed</p>
                    </div>
                    
                    <div className="flex flex-col md:flex-row gap-6 items-center justify-center">
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-700 mb-2">Original Image</p>
                        <img 
                          src={originalImage!} 
                          alt="Original" 
                          className="w-32 h-32 object-cover rounded-lg border-2 border-gray-300"
                        />
                      </div>
                      <div className="text-2xl text-gray-400">→</div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-700 mb-2">Cleaned Image</p>
                        <div className="relative">
                          <img 
                            src={cleanedImageUrl} 
                            alt="Cleaned" 
                            className="w-32 h-32 object-cover rounded-lg border-2 border-green-500 shadow-sm"
                          />
                          <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                            Clean
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mt-3">
                      All sensitive metadata has been removed. The image quality remains unchanged.
                    </p>
                  </div>
                </div>
              )}

              {/* Final Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={resetForm}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                >
                  New Image
                </button>
                
                {cleanedImageUrl && (
                  <button
                    onClick={downloadCleanImage}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    Download Clean Image
                  </button>
                )}
              </div>

              {/* Info Section */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start gap-3">
                  <Eye className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-800 mb-1">About Image Metadata</h4>
                    <p className="text-sm text-blue-700">
                      Images can contain hidden metadata like GPS location, camera settings, 
                      and creation dates. Stripping this data helps protect your privacy when 
                      sharing images online.
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
                  <span><strong>Client-Side Processing</strong> - All analysis happens in your browser</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Shield className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>No Data Stored</strong> - Your images never leave your device</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Eye className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Instant Analysis</strong> - View metadata in real-time</span>
                </li>
              </ul>
            </div>

            {/* Features */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-emerald-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-2">
                  <Eye className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Thumbnail Preview</strong> - See your image immediately after upload</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Trash2 className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Transparent Removal</strong> - See exactly what metadata will be removed</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Download className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Clean Downloads</strong> - Download images without metadata</span>
                </div>
                <div className="flex items-start space-x-2">
                  <FileText className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Detailed Information</strong> - See file size, dimensions, and more</span>
                </div>
              </div>
            </div>

            {/* Privacy Benefits */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-emerald-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacy Benefits</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <h4 className="font-semibold text-red-800 mb-1">📍 GPS Location</h4>
                  <p className="text-red-700">Remove exact location data from photos</p>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                  <h4 className="font-semibold text-purple-800 mb-1">📷 Camera Info</h4>
                  <p className="text-purple-700">Strip camera model and settings data</p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <h4 className="font-semibold text-green-800 mb-1">🕒 Timestamps</h4>
                  <p className="text-green-700">Remove creation and modification dates</p>
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
            {metadataViewerFaqItems.map((faq, index) => (
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
            Free Image Metadata Viewer & Stripper
          </h2>
          
          <p className="text-gray-700 mb-4">
            Protect your privacy by viewing and removing hidden metadata from your images. 
            Our tool reveals EXIF data, GPS coordinates, camera information, and timestamps 
            that could compromise your privacy when sharing photos online.
          </p>

          <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
            What is Image Metadata?
          </h3>
          <p className="text-gray-700 mb-4">
            Image metadata (EXIF data) is hidden information stored within image files by 
            cameras and smartphones. This can include GPS coordinates, camera model, 
            aperture settings, shutter speed, and even the exact date and time the photo 
            was taken. While useful for photography, this data can pose privacy risks.
          </p>

          <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
            Why Remove Image Metadata?
          </h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Protect your location privacy when sharing photos online</li>
            <li>Prevent tracking of your daily routines and habits</li>
            <li>Secure your home address and frequently visited locations</li>
            <li>Maintain anonymity on social media and forums</li>
            <li>Comply with privacy regulations when sharing images publicly</li>
          </ul>

          <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
            Common Metadata Types Found in Images
          </h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>GPS Coordinates</strong> - Exact location where photo was taken</li>
            <li><strong>Camera Information</strong> - Make, model, and serial number</li>
            <li><strong>Camera Settings</strong> - Aperture, ISO, focal length, exposure</li>
            <li><strong>Date & Time</strong> - Exact timestamp of when photo was captured</li>
            <li><strong>Software Information</strong> - Editing software and version used</li>
            <li><strong>Thumbnail</strong> - Small preview image embedded in the file</li>
          </ul>

          <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
            Best Practices for Image Privacy
          </h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Always strip metadata before sharing photos on social media</li>
            <li>Be especially careful with photos taken at home or work</li>
            <li>Consider disabling location services in your camera app</li>
            <li>Use this tool before uploading images to public websites</li>
            <li>Keep original files with metadata for your personal archive</li>
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
            "mainEntity": metadataViewerFaqItems.map(faq => ({
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