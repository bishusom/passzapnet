// components/tools/media/video-trimmer/video-trimmer-tool.tsx
'use client';

import { useState, useRef, useCallback } from 'react';
import { 
  Scissors, 
  Upload, 
  Download, 
  Play,
  Pause,
  Video,
  Clock
} from 'lucide-react';

export default function VideoTrimmerTool() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [videoDimensions, setVideoDimensions] = useState({ width: 0, height: 0 });
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      
      // Reset trim times
      setStartTime(0);
      setCurrentTime(0);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const videoDuration = videoRef.current.duration;
      setDuration(videoDuration);
      setEndTime(videoDuration);
      
      // Get video dimensions
      setVideoDimensions({
        width: videoRef.current.videoWidth,
        height: videoRef.current.videoHeight
      });
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const trimVideo = async () => {
    if (!videoFile || !videoRef.current) return;
    
    setIsProcessing(true);
    
    try {
      // Create a temporary video element for processing
      const tempVideo = document.createElement('video');
      tempVideo.src = videoUrl;
      await tempVideo.load();
      
      // Wait for video to be ready
      await new Promise((resolve) => {
        tempVideo.onloadedmetadata = resolve;
      });
      
      // Create canvas for frame extraction
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext('2d')!;
      
      // Set canvas dimensions to match video
      canvas.width = videoDimensions.width;
      canvas.height = videoDimensions.height;
      
      const chunks: Blob[] = [];
      const mediaRecorder = new MediaRecorder(canvas.captureStream(), {
        mimeType: 'video/webm;codecs=vp9'
      });
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        
        // Create download link
        const a = document.createElement('a');
        a.href = url;
        a.download = `trimmed-${videoFile.name.replace(/\.[^/.]+$/, '')}.webm`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        // Clean up
        URL.revokeObjectURL(url);
        setIsProcessing(false);
      };
      
      // Start recording
      mediaRecorder.start();
      
      // Seek to start time and record until end time
      tempVideo.currentTime = startTime;
      
      const recordFrame = () => {
        if (tempVideo.currentTime >= endTime || tempVideo.ended) {
          mediaRecorder.stop();
          return;
        }
        
        ctx.drawImage(tempVideo, 0, 0, canvas.width, canvas.height);
        requestAnimationFrame(recordFrame);
      };
      
      tempVideo.ontimeupdate = () => {
        if (tempVideo.currentTime >= endTime) {
          mediaRecorder.stop();
        }
      };
      
      // Start recording frames
      recordFrame();
      
    } catch (error) {
      console.error('Error trimming video:', error);
      alert('Error trimming video. Please try again.');
      setIsProcessing(false);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      setStartTime(0);
      setCurrentTime(0);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
      <main className="py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl shadow-lg mb-4">
              <Scissors className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Video Trimmer
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Cut and trim your video files directly in the browser. No uploads required.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-teal-100">
            {/* File Upload */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Upload Video File</h2>
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="border-2 border-dashed border-teal-300 rounded-2xl p-8 text-center bg-teal-50 hover:bg-teal-100 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-12 w-12 text-teal-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Drop your video file here or click to browse
                </h3>
                <p className="text-gray-600 mb-4">
                  Supports: MP4, WebM, MOV, and other video formats
                </p>
                <button className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-lg font-semibold">
                  Choose Video File
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                  accept="video/*"
                />
              </div>

              {videoFile && (
                <div className="mt-4 p-4 bg-cyan-50 rounded-lg border border-cyan-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Video className="h-5 w-5 text-cyan-500 mr-3" />
                      <span className="font-medium text-gray-900">{videoFile.name}</span>
                    </div>
                    <span className="text-sm text-cyan-600">
                      {formatTime(duration)} • {videoDimensions.width}x{videoDimensions.height}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Video Player & Trimmer */}
            {videoUrl && (
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-xl p-6 border border-cyan-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Video Player</h3>
                  
                  {/* Video Preview */}
                  <div className="mb-4 bg-black rounded-lg overflow-hidden">
                    <video
                      ref={videoRef}
                      src={videoUrl}
                      onLoadedMetadata={handleLoadedMetadata}
                      onTimeUpdate={handleTimeUpdate}
                      onEnded={() => setIsPlaying(false)}
                      className="w-full max-h-96 object-contain"
                      controls={false}
                    />
                  </div>
                  
                  {/* Playback Controls */}
                  <div className="flex items-center justify-between">
                    <button
                      onClick={togglePlayPause}
                      className="bg-cyan-500 hover:bg-cyan-600 text-white p-3 rounded-full"
                    >
                      {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                    </button>
                    <div className="flex-1 mx-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max={duration}
                        value={currentTime}
                        onChange={(e) => handleSeek(parseFloat(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* Trimmer Controls */}
                <div className="bg-gray-50 rounded-xl p-6 border border-teal-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Trim Settings</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Time: {formatTime(startTime)}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max={duration}
                        step="0.1"
                        value={startTime}
                        onChange={(e) => setStartTime(parseFloat(e.target.value))}
                        className="w-full h-2 bg-teal-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Time: {formatTime(endTime)}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max={duration}
                        step="0.1"
                        value={endTime}
                        onChange={(e) => setEndTime(parseFloat(e.target.value))}
                        className="w-full h-2 bg-teal-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-teal-50 rounded-lg">
                      <span className="text-sm text-gray-600">Trimmed Duration:</span>
                      <span className="font-semibold text-teal-700">
                        {formatTime(endTime - startTime)}
                      </span>
                    </div>

                    <button
                      onClick={trimVideo}
                      disabled={isProcessing || startTime >= endTime}
                      className="w-full bg-teal-500 hover:bg-teal-600 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center"
                    >
                      {isProcessing ? (
                        <>
                          <Clock className="h-5 w-5 animate-spin mr-2" />
                          Trimming Video...
                        </>
                      ) : (
                        <>
                          <Scissors className="h-5 w-5 mr-2" />
                          Trim & Download Video
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Hidden canvas for video processing */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Features */}
            <div className="mt-8 grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-teal-50 rounded-lg">
                <Video className="h-8 w-8 text-teal-500 mx-auto mb-2" />
                <h4 className="font-semibold text-teal-700">Browser-Based</h4>
                <p className="text-sm text-gray-600">No file uploads required</p>
              </div>
              <div className="text-center p-4 bg-cyan-50 rounded-lg">
                <Scissors className="h-8 w-8 text-cyan-500 mx-auto mb-2" />
                <h4 className="font-semibold text-cyan-700">Frame-Accurate</h4>
                <p className="text-sm text-gray-600">Precise video trimming</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Download className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <h4 className="font-semibold text-blue-700">Instant Download</h4>
                <p className="text-sm text-gray-600">WebM format output</p>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Frequently Asked Questions
            </h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {videoTrimmerFaqItems.map((faq, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-teal-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

const videoTrimmerFaqItems = [
  {
    question: "Are my video files uploaded to any server?",
    answer: "No! All video processing happens locally in your browser. Your files never leave your computer, ensuring complete privacy."
  },
  {
    question: "What video formats are supported?",
    answer: "The trimmer supports most common video formats including MP4, WebM, MOV, and AVI. The output is in WebM format for browser compatibility."
  },
  {
    question: "Is there a file size limit?",
    answer: "For best performance, we recommend files under 100MB. Very large files may take longer to process due to browser memory constraints."
  },
  {
    question: "Does trimming affect video quality?",
    answer: "The trimming process maintains the original video quality. However, the output WebM format may use different compression than your original file."
  },
  {
    question: "Can I trim multiple sections of a video?",
    answer: "Currently, the tool supports trimming a single continuous section. For multiple cuts, you'll need to trim different sections separately."
  },
  {
    question: "Why is the output in WebM format?",
    answer: "WebM is a modern, open video format with excellent browser support and efficient compression, making it ideal for web-based video processing."
  }
];