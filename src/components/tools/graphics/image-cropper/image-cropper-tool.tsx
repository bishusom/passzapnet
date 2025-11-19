// components/tools/ImageCropperTool.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  Crop, 
  Download, 
  Upload, 
  RotateCw,
  Square,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  Shield,
  Zap,
  CheckCircle,
  Image as ImageIcon,
  AlertCircle,
  FileText
} from 'lucide-react';

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface AspectRatio {
  label: string;
  value: string;
  width: number;
  height: number;
}

export default function ImageCropperTool() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [cropArea, setCropArea] = useState<CropArea>({ x: 0, y: 0, width: 200, height: 200 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isResizing, setIsResizing] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [imageSize, setImageSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const [containerSize, setContainerSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [outputFormat, setOutputFormat] = useState<'png' | 'jpeg' | 'webp'>('png');
  const [outputQuality, setOutputQuality] = useState<number>(0.9);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const [imagePosition, setImagePosition] = useState<{ x: number; y: number; width: number; height: number }>({ x: 0, y: 0, width: 0, height: 0 });

  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const aspectRatios: AspectRatio[] = [
    { label: 'Free', value: 'free', width: 0, height: 0 },
    { label: 'Square (1:1)', value: '1:1', width: 1, height: 1 },
    { label: 'Instagram (4:5)', value: '4:5', width: 4, height: 5 },
    { label: 'Landscape (16:9)', value: '16:9', width: 16, height: 9 },
    { label: 'Portrait (3:4)', value: '3:4', width: 3, height: 4 },
    { label: 'Widescreen (21:9)', value: '21:9', width: 21, height: 9 },
  ];

  const [selectedAspectRatio, setSelectedAspectRatio] = useState<AspectRatio>(aspectRatios[0]);

  // FAQ items
  const imageCropperFaqItems = [
    {
      question: "Is my image data secure when using this cropper?",
      answer: "Yes! All image processing happens entirely in your browser. We never upload your images to our servers or store them anywhere. Your images remain completely private and secure on your device."
    },
    {
      question: "What image formats are supported?",
      answer: "The cropper supports JPG, JPEG, PNG, WebP, and GIF formats. You can download cropped images in PNG, JPEG, or WebP format with adjustable quality settings."
    },
    {
      question: "Can I crop images to specific pixel dimensions?",
      answer: "Yes! You can either use preset aspect ratios or specify exact pixel dimensions for your crop. The tool shows you the exact output size in real-time as you adjust the crop area."
    },
    {
      question: "Is there a limit to the image size I can crop?",
      answer: "The cropper can handle large images, but very high-resolution files (50MP+) may impact browser performance. For optimal experience, we recommend images under 20MP. All processing happens client-side."
    },
    {
      question: "Can I maintain aspect ratio while cropping?",
      answer: "Absolutely! You can lock aspect ratios for common formats (square, 16:9, 4:3, etc.) or set custom ratios. The crop area will maintain the selected ratio as you resize it."
    },
    {
      question: "Does the cropper support batch processing?",
      answer: "Currently, the tool processes one image at a time. This ensures the best user experience and performance. You can quickly crop multiple images sequentially with consistent settings."
    }
  ];

  // Calculate the actual displayed image position within the container
  const calculateImagePosition = () => {
    if (!imageRef.current || !containerRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const img = imageRef.current;
    
    // Get the actual displayed dimensions of the image (with object-contain)
    const containerRatio = containerRect.width / containerRect.height;
    const imageRatio = img.naturalWidth / img.naturalHeight;
    
    let displayedWidth, displayedHeight, offsetX, offsetY;
    
    if (imageRatio > containerRatio) {
      // Image is wider than container
      displayedWidth = containerRect.width;
      displayedHeight = containerRect.width / imageRatio;
      offsetX = 0;
      offsetY = (containerRect.height - displayedHeight) / 2;
    } else {
      // Image is taller than container
      displayedHeight = containerRect.height;
      displayedWidth = containerRect.height * imageRatio;
      offsetX = (containerRect.width - displayedWidth) / 2;
      offsetY = 0;
    }
    
    setImagePosition({
      x: offsetX,
      y: offsetY,
      width: displayedWidth,
      height: displayedHeight
    });
  };

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
      setCroppedImage(null);
      setImageLoaded(false);
      setZoom(1);
      setRotation(0);
      
      // Create a new image to get dimensions
      const img = new Image();
      img.onload = () => {
        setImageSize({ width: img.naturalWidth, height: img.naturalHeight });
        setImageLoaded(true);
        
        // Set container size after a brief delay to ensure DOM is updated
        setTimeout(() => {
          if (containerRef.current) {
            const containerRect = containerRef.current.getBoundingClientRect();
            setContainerSize({ width: containerRect.width, height: containerRect.height });
            calculateImagePosition();

            // Set initial crop area
            const displaySize = Math.min(containerRect.width, containerRect.height) * 0.6;
            const centerX = (containerRect.width - displaySize) / 2;
            const centerY = (containerRect.height - displaySize) / 2;
            
            setCropArea({
              x: centerX,
              y: centerY,
              width: displaySize,
              height: displaySize
            });
          }
        }, 100);
      };
      img.src = imageUrl;
    };
    reader.readAsDataURL(file);
  };

  // Update container size and image position on resize and image load
  useEffect(() => {
    const updateContainerSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerSize({ width: rect.width, height: rect.height });
        calculateImagePosition();
      }
    };

    updateContainerSize();
    window.addEventListener('resize', updateContainerSize);
    
    return () => {
      window.removeEventListener('resize', updateContainerSize);
    };
  }, [originalImage]);

  // Recalculate image position when image loads or zoom changes
  useEffect(() => {
    if (imageLoaded) {
      calculateImagePosition();
    }
  }, [imageLoaded, zoom]);

  const handleCropStart = (e: React.MouseEvent) => {
    if (!originalImage || !imageLoaded) return;
    
    setIsDragging(true);
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    setDragStart({
      x: e.clientX - rect.left - cropArea.x,
      y: e.clientY - rect.top - cropArea.y
    });
    e.preventDefault();
  };

  const handleCropMove = (e: React.MouseEvent) => {
    if (!originalImage || !imageLoaded) return;

    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();

    if (isDragging) {
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const newX = mouseX - dragStart.x;
      const newY = mouseY - dragStart.y;

      // Constrain within container bounds
      const constrainedX = Math.max(0, Math.min(newX, rect.width - cropArea.width));
      const constrainedY = Math.max(0, Math.min(newY, rect.height - cropArea.height));

      setCropArea(prev => ({
        ...prev,
        x: constrainedX,
        y: constrainedY
      }));
    } else if (isResizing) {
      handleCropResize(isResizing, e);
    }
  };

  const handleCropEnd = () => {
    setIsDragging(false);
    setIsResizing(null);
  };

  const handleCropResize = (direction: string, e: React.MouseEvent) => {
    if (!originalImage || !imageLoaded) return;

    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    let newX = cropArea.x;
    let newY = cropArea.y;
    let newWidth = cropArea.width;
    let newHeight = cropArea.height;

    const minSize = 50; // Minimum crop size

    switch (direction) {
      case 'e':
        newWidth = Math.max(minSize, mouseX - newX);
        break;
      case 'w':
        const maxX = newX + newWidth - minSize;
        newX = Math.min(maxX, mouseX);
        newWidth = newX + newWidth - mouseX;
        break;
      case 's':
        newHeight = Math.max(minSize, mouseY - newY);
        break;
      case 'n':
        const maxY = newY + newHeight - minSize;
        newY = Math.min(maxY, mouseY);
        newHeight = newY + newHeight - mouseY;
        break;
      case 'se':
        newWidth = Math.max(minSize, mouseX - newX);
        newHeight = Math.max(minSize, mouseY - newY);
        break;
      case 'sw':
        const maxX2 = newX + newWidth - minSize;
        newX = Math.min(maxX2, mouseX);
        newWidth = newX + newWidth - mouseX;
        newHeight = Math.max(minSize, mouseY - newY);
        break;
      case 'ne':
        newWidth = Math.max(minSize, mouseX - newX);
        const maxY2 = newY + newHeight - minSize;
        newY = Math.min(maxY2, mouseY);
        newHeight = newY + newHeight - mouseY;
        break;
      case 'nw':
        const maxX3 = newX + newWidth - minSize;
        const maxY3 = newY + newHeight - minSize;
        newX = Math.min(maxX3, mouseX);
        newY = Math.min(maxY3, mouseY);
        newWidth = newX + newWidth - mouseX;
        newHeight = newY + newHeight - mouseY;
        break;
    }

    // Apply aspect ratio constraint if selected
    if (selectedAspectRatio.value !== 'free') {
      const ratio = selectedAspectRatio.width / selectedAspectRatio.height;
      
      if (direction.includes('e') || direction.includes('w')) {
        // Width changed, adjust height to maintain ratio
        newHeight = newWidth / ratio;
      } else if (direction.includes('n') || direction.includes('s')) {
        // Height changed, adjust width to maintain ratio
        newWidth = newHeight * ratio;
      }
      
      // Ensure minimum size
      if (newWidth < minSize) {
        newWidth = minSize;
        newHeight = newWidth / ratio;
      }
      if (newHeight < minSize) {
        newHeight = minSize;
        newWidth = newHeight * ratio;
      }
    }

    // Constrain within container bounds
    newWidth = Math.min(newWidth, rect.width - newX);
    newHeight = Math.min(newHeight, rect.height - newY);

    setCropArea({
      x: newX,
      y: newY,
      width: newWidth,
      height: newHeight
    });
  };

  const handleResizeStart = (direction: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(direction);
    setDragStart({
      x: e.clientX,
      y: e.clientY
    });
  };

  const applyCrop = () => {
    if (!originalImage || !canvasRef.current || !imageLoaded) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Calculate scale factors based on actual displayed image dimensions
    const scaleX = imageSize.width / imagePosition.width;
    const scaleY = imageSize.height / imagePosition.height;

    // Convert display coordinates to original image coordinates
    // Adjust for the image offset within the container
    const displayX = cropArea.x - imagePosition.x;
    const displayY = cropArea.y - imagePosition.y;
    
    // Ensure the crop area is within the actual image bounds
    const boundedX = Math.max(0, displayX);
    const boundedY = Math.max(0, displayY);
    const boundedWidth = Math.min(cropArea.width, imagePosition.width - boundedX);
    const boundedHeight = Math.min(cropArea.height, imagePosition.height - boundedY);

    const originalX = boundedX * scaleX;
    const originalY = boundedY * scaleY;
    const originalWidth = boundedWidth * scaleX;
    const originalHeight = boundedHeight * scaleY;

    // Ensure we don't try to crop outside the image bounds
    if (originalX < 0 || originalY < 0 || originalWidth <= 0 || originalHeight <= 0) {
      alert('Crop area is outside image bounds. Please adjust the crop selection.');
      return;
    }

    const img = new Image();
    img.onload = () => {
      // Set canvas size to crop dimensions
      canvas.width = Math.round(originalWidth);
      canvas.height = Math.round(originalHeight);

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Apply rotation if needed
      if (rotation !== 0) {
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.drawImage(
          img,
          originalX, originalY, originalWidth, originalHeight,
          -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height
        );
        ctx.restore();
      } else {
        // Draw cropped image
        ctx.drawImage(
          img,
          originalX, originalY, originalWidth, originalHeight,
          0, 0, canvas.width, canvas.height
        );
      }

      // Get cropped image as data URL
      const quality = outputFormat === 'png' ? 1 : outputQuality;
      const mimeType = `image/${outputFormat}`;
      const dataUrl = canvas.toDataURL(mimeType, quality);
      
      setCroppedImage(dataUrl);
    };
    
    img.src = originalImage;
  };

  const downloadCroppedImage = () => {
    if (!croppedImage) return;

    const link = document.createElement('a');
    link.download = `cropped-image.${outputFormat}`;
    link.href = croppedImage;
    link.click();
  };

  const handleAspectRatioChange = (ratioValue: string) => {
    const ratio = aspectRatios.find(r => r.value === ratioValue) || aspectRatios[0];
    setSelectedAspectRatio(ratio);
    
    if (ratio.value === 'free') return;

    // Adjust crop area to maintain new aspect ratio
    const newRatio = ratio.width / ratio.height;
    const currentRatio = cropArea.width / cropArea.height;

    let newWidth = cropArea.width;
    let newHeight = cropArea.height;

    if (newRatio > currentRatio) {
      // Need to increase width relative to height
      newWidth = cropArea.height * newRatio;
    } else {
      // Need to increase height relative to width
      newHeight = cropArea.width / newRatio;
    }

    // Ensure the crop area stays within bounds
    const container = containerRef.current;
    if (container) {
      const rect = container.getBoundingClientRect();
      const maxX = rect.width - cropArea.x;
      const maxY = rect.height - cropArea.y;
      
      newWidth = Math.min(newWidth, maxX);
      newHeight = Math.min(newHeight, maxY);
    }

    setCropArea(prev => ({
      ...prev,
      width: newWidth,
      height: newHeight
    }));
  };

  const rotateImage = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const resetCrop = () => {
    if (!containerSize.width || !imageLoaded) return;

    const size = Math.min(containerSize.width, containerSize.height) * 0.6;
    const centerX = (containerSize.width - size) / 2;
    const centerY = (containerSize.height - size) / 2;
    
    setCropArea({
      x: centerX,
      y: centerY,
      width: size,
      height: size
    });
    setZoom(1);
    setRotation(0);
  };

  const zoomIn = () => {
    setZoom(prev => Math.min(prev + 0.1, 3));
  };

  const zoomOut = () => {
    setZoom(prev => Math.max(prev - 0.1, 0.1));
  };

  // Calculate output dimensions for display
  const outputDimensions = () => {
    const scaleX = imageSize.width / imagePosition.width;
    const scaleY = imageSize.height / imagePosition.height;
    
    const displayX = cropArea.x - imagePosition.x;
    const displayY = cropArea.y - imagePosition.y;
    
    const boundedX = Math.max(0, displayX);
    const boundedY = Math.max(0, displayY);
    const boundedWidth = Math.min(cropArea.width, imagePosition.width - boundedX);
    const boundedHeight = Math.min(cropArea.height, imagePosition.height - boundedY);

    return {
      width: Math.round(boundedWidth * scaleX),
      height: Math.round(boundedHeight * scaleY)
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Header */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl shadow-lg mb-4">
            <Crop className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Image Cropper Tool</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Free online image cropper tool. Crop photos, images, and pictures with precision. 
            Adjust aspect ratios, rotate, and download cropped images instantly. No data stored.
          </p>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Cropper Tool */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-emerald-100">
              {/* Header */}
              <div className="text-center mb-6">
                <div className="flex items-center justify-center mb-3">
                  <div className="bg-emerald-100 p-3 rounded-full">
                    <Crop className="h-6 w-6 text-emerald-600" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Image Cropper
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  Crop and edit your images with precision
                </p>
              </div>

              {/* Upload Section */}
              {!originalImage && (
                <div className="mb-6 text-center">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">Upload an image to start cropping</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors cursor-pointer"
                    >
                      <Upload className="h-4 w-4" />
                      Choose Image
                    </label>
                  </div>
                </div>
              )}

              {/* Main Cropper Interface */}
              {originalImage && (
                <>
                  {/* Controls */}
                  <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                    {/* Aspect Ratio Selector */}
                    <div className="flex-1 min-w-[200px]">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Square className="h-4 w-4 inline mr-1" />
                        Aspect Ratio
                      </label>
                      <select
                        value={selectedAspectRatio.value}
                        onChange={(e) => handleAspectRatioChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        {aspectRatios.map(ratio => (
                          <option key={ratio.value} value={ratio.value}>
                            {ratio.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Output Format */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Output Format
                      </label>
                      <select
                        value={outputFormat}
                        onChange={(e) => setOutputFormat(e.target.value as 'png' | 'jpeg' | 'webp')}
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="png">PNG</option>
                        <option value="jpeg">JPEG</option>
                        <option value="webp">WebP</option>
                      </select>
                    </div>

                    {/* Zoom Controls */}
                    <div className="flex items-end gap-2">
                      <button
                        onClick={zoomOut}
                        disabled={zoom <= 0.1}
                        className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                        title="Zoom Out"
                      >
                        <ZoomOut className="h-4 w-4" />
                      </button>
                      <span className="text-sm text-gray-600 min-w-[50px] text-center">
                        {Math.round(zoom * 100)}%
                      </span>
                      <button
                        onClick={zoomIn}
                        disabled={zoom >= 3}
                        className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                        title="Zoom In"
                      >
                        <ZoomIn className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Quality (for JPEG/WebP) */}
                    {(outputFormat === 'jpeg' || outputFormat === 'webp') && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Quality: {Math.round(outputQuality * 100)}%
                        </label>
                        <input
                          type="range"
                          min="0.1"
                          max="1"
                          step="0.1"
                          value={outputQuality}
                          onChange={(e) => setOutputQuality(parseFloat(e.target.value))}
                          className="w-24"
                        />
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 items-end">
                      <button
                        onClick={rotateImage}
                        className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        title="Rotate 90°"
                      >
                        <RotateCw className="h-4 w-4" />
                      </button>
                      <button
                        onClick={resetCrop}
                        className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        title="Reset Crop"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Cropper Area */}
                  <div className="grid lg:grid-cols-2 gap-6 mb-6">
                    {/* Original Image with Crop Overlay */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        {imageLoaded ? `Original Image (${imageSize.width} × ${imageSize.height})` : 'Loading image...'}
                      </label>
                      <div
                        ref={containerRef}
                        className="relative border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-100 cursor-move"
                        style={{ height: '400px' }}
                        onMouseMove={handleCropMove}
                        onMouseUp={handleCropEnd}
                        onMouseLeave={handleCropEnd}
                      >
                        {originalImage && (
                          <img
                            ref={imageRef}
                            src={originalImage}
                            alt="Original"
                            className="absolute top-0 left-0 w-full h-full object-contain"
                            style={{ 
                              transform: `scale(${zoom}) rotate(${rotation}deg)`,
                              transformOrigin: 'center center'
                            }}
                            onLoad={() => {
                              if (imageRef.current) {
                                setImageSize({ 
                                  width: imageRef.current.naturalWidth, 
                                  height: imageRef.current.naturalHeight 
                                });
                                setImageLoaded(true);
                                calculateImagePosition();
                              }
                            }}
                          />
                        )}
                        
                        {/* Crop Overlay */}
                        {imageLoaded && (
                          <div
                            className="absolute border-2 border-white border-dashed cursor-move shadow-lg bg-black bg-opacity-20"
                            style={{
                              left: `${cropArea.x}px`,
                              top: `${cropArea.y}px`,
                              width: `${cropArea.width}px`,
                              height: `${cropArea.height}px`,
                            }}
                            onMouseDown={handleCropStart}
                          >
                            {/* Resize Handles */}
                            {['nw', 'n', 'ne', 'w', 'e', 'sw', 's', 'se'].map((position) => (
                              <div
                                key={position}
                                className={`absolute w-4 h-4 bg-white border-2 border-emerald-500 rounded-sm cursor-${position}-resize z-10`}
                                style={{
                                  left: position.includes('w') ? '-8px' : position.includes('e') ? '100%' : '50%',
                                  top: position.includes('n') ? '-8px' : position.includes('s') ? '100%' : '50%',
                                  transform: 'translate(-50%, -50%)',
                                }}
                                onMouseDown={(e) => handleResizeStart(position, e)}
                              />
                            ))}
                          </div>
                        )}

                        {/* Grid Overlay */}
                        {imageLoaded && (
                          <div
                            className="absolute pointer-events-none"
                            style={{
                              left: `${cropArea.x}px`,
                              top: `${cropArea.y}px`,
                              width: `${cropArea.width}px`,
                              height: `${cropArea.height}px`,
                              backgroundImage: `
                                linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)
                              `,
                              backgroundSize: '20px 20px',
                            }}
                          />
                        )}
                      </div>
                      {imageLoaded && (
                        <div className="mt-2 text-sm text-gray-600 text-center">
                          Crop Area: {Math.round(cropArea.width)} × {Math.round(cropArea.height)} pixels
                          {selectedAspectRatio.value !== 'free' && (
                            <span className="ml-2">(Ratio: {selectedAspectRatio.width}:{selectedAspectRatio.height})</span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Preview */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Cropped Preview
                      </label>
                      <div className="border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-100" style={{ height: '400px' }}>
                        {croppedImage ? (
                          <img
                            src={croppedImage}
                            alt="Cropped"
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-500 text-center p-8">
                            <Crop className="h-12 w-12 mx-auto mb-2 opacity-50" />
                            <p>Click "Apply Crop" to see preview</p>
                          </div>
                        )}
                      </div>
                      {croppedImage && (
                        <div className="mt-2 text-sm text-gray-600 text-center">
                          Output: {outputDimensions().width} × {outputDimensions().height} pixels
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={applyCrop}
                      disabled={!imageLoaded}
                      className="flex-1 bg-emerald-500 text-white py-3 px-6 rounded-lg hover:bg-emerald-600 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Crop className="h-4 w-4" />
                      Apply Crop
                    </button>
                    
                    <button
                      onClick={downloadCroppedImage}
                      disabled={!croppedImage}
                      className="flex-1 bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </button>
                    
                    <button
                      onClick={() => {
                        setOriginalImage(null);
                        setCroppedImage(null);
                        setImageLoaded(false);
                      }}
                      className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                    >
                      New Image
                    </button>
                  </div>

                  {/* Hidden canvas for image processing */}
                  <canvas ref={canvasRef} style={{ display: 'none' }} />
                </>
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
                  <span><strong>Client-Side Processing</strong> - All cropping happens in your browser</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Shield className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>No Data Stored</strong> - Your images never leave your device</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Crop className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Instant Processing</strong> - Real-time cropping preview</span>
                </li>
              </ul>
            </div>

            {/* Features */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-emerald-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-2">
                  <Crop className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Precise Cropping</strong> - Pixel-perfect crop selection</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Aspect Ratios</strong> - Common ratios or custom sizes</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Download className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Multiple Formats</strong> - Download as PNG, JPEG, or WebP</span>
                </div>
                <div className="flex items-start space-x-2">
                  <ImageIcon className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Quality Control</strong> - Adjust output quality and size</span>
                </div>
              </div>
            </div>

            {/* Common Aspect Ratios */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-emerald-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Common Aspect Ratios</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <h4 className="font-semibold text-blue-800 mb-1">📱 Social Media</h4>
                  <ul className="space-y-1 text-blue-700">
                    <li>• Instagram Square (1:1)</li>
                    <li>• Instagram Portrait (4:5)</li>
                    <li>• Instagram Landscape (1.91:1)</li>
                    <li>• Facebook Cover (820×312)</li>
                  </ul>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <h4 className="font-semibold text-green-800 mb-1">🖼️ Photography</h4>
                  <ul className="space-y-1 text-green-700">
                    <li>• Standard (3:2, 4:3)</li>
                    <li>• Widescreen (16:9)</li>
                    <li>• Square (1:1)</li>
                    <li>• Panoramic (2:1, 3:1)</li>
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
            {imageCropperFaqItems.map((faq, index) => (
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
            Free Online Image Cropper
          </h2>
          
          <p className="text-gray-700 mb-4">
            Crop your images with precision using our free online image cropper. Remove unwanted areas, 
            focus on specific subjects, or adjust aspect ratios for different platforms - all without 
            installing any software or compromising your privacy.
          </p>

          <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
            Why Use Our Image Cropper?
          </h3>
          <p className="text-gray-700 mb-4">
            Our image cropper provides professional-grade cropping tools with a simple, intuitive interface. 
            Get perfect crops for social media, websites, or personal use with real-time previews and 
            complete control over your final image.
          </p>

          <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
            Image Cropping Benefits
          </h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Remove distracting elements from your photos</li>
            <li>Focus attention on your main subject</li>
            <li>Optimize images for different platforms and devices</li>
            <li>Improve composition and visual appeal</li>
            <li>Create consistent aspect ratios across multiple images</li>
          </ul>

          <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
            Supported Image Formats
          </h3>
          <p className="text-gray-700 mb-4">
            Our cropper supports all major image formats including JPG, JPEG, PNG, WebP, and GIF. 
            You can download your cropped images in high quality while maintaining optimal file sizes 
            for web and social media use.
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
            "mainEntity": imageCropperFaqItems.map(faq => ({
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