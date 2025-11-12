// components/tools/ImageFormatConverter.tsx
'use client';

import { useState, useRef } from 'react';
import { 
  Upload, 
  Download, 
  RefreshCw,
  Image as ImageIcon
} from 'lucide-react';

type OutputFormat = 'png' | 'jpeg' | 'webp';

export default function ImageFormatConverter() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [convertedImageUrl, setConvertedImageUrl] = useState<string | null>(null);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('png');
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
  );
}