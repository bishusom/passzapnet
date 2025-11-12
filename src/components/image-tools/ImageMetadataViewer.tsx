// components/tools/ImageMetadataViewer.tsx
'use client';

import { useState, useRef } from 'react';
import { 
  Upload, 
  Download, 
  Eye,
  FileText,
  Trash2,
  Image as ImageIcon
} from 'lucide-react';

interface ImageMetadata {
  [key: string]: string | number | undefined;
}

export default function ImageMetadataViewer() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [cleanedImageUrl, setCleanedImageUrl] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<ImageMetadata | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const fileUrl = URL.createObjectURL(file);
      setOriginalImage(fileUrl);
      setCleanedImageUrl(null);
      setMetadata(null);

      // Extract basic file metadata
      const basicMetadata: ImageMetadata = {
        'File Name': file.name,
        'File Size': `${(file.size / 1024).toFixed(1)} KB`,
        'MIME Type': file.type,
        'Last Modified': new Date(file.lastModified).toLocaleString(),
      };
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

        // Update metadata
        setMetadata(prev => ({
          ...prev,
          'Processing': 'Metadata stripped',
          'New Dimensions': `${image.width} × ${image.height}px`,
        }));
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
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
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
            <div className="flex items-center justify-center gap-4">
              <ImageIcon className="h-12 w-12 text-emerald-500" />
              <div className="text-left">
                <p className="font-medium text-gray-800">Image loaded</p>
                <p className="text-sm text-gray-600">Ready for analysis</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Metadata Display */}
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
      {originalImage && (
        <div className="flex gap-3 mb-6">
          <button
            onClick={stripMetadata}
            disabled={isProcessing}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50"
          >
            {isProcessing ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <Trash2 className="h-5 w-5" />
            )}
            {isProcessing ? 'Processing...' : 'Strip Metadata'}
          </button>
        </div>
      )}

      {/* Clean Image Preview */}
      {cleanedImageUrl && (
        <div className="mb-6">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-700 mb-2">Cleaned Image (No Metadata)</p>
            <img 
              src={cleanedImageUrl} 
              alt="Cleaned" 
              className="w-full max-w-xs mx-auto h-48 object-contain rounded-lg border"
            />
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
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
          >
            <Download className="h-4 w-4" />
            Download Clean
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
  );
}