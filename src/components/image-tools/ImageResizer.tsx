// components/tools/ImageResizer.tsx
'use client';

import { useState, useRef } from 'react';
import { 
  Upload, 
  Download, 
  Scaling,
  FileArchive,
  Image as ImageIcon
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
  );
}