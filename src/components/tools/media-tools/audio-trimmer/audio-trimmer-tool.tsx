// components/tools/media/audio-trimmer/audio-trimmer-tool.tsx
'use client';

import { useState, useRef, useCallback } from 'react';
import { 
  Scissors, 
  Upload, 
  Download, 
  Play,
  Pause,
  Volume2,
  Clock
} from 'lucide-react';

export default function AudioTrimmerTool() {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      setAudioFile(file);
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
      
      // Reset trim times
      setStartTime(0);
      setCurrentTime(0);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      const audioDuration = audioRef.current.duration;
      setDuration(audioDuration);
      setEndTime(audioDuration);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const trimAudio = async () => {
    if (!audioFile || !audioRef.current) return;
    
    setIsProcessing(true);
    
    try {
      // Create AudioContext
      const audioContext = new AudioContext();
      const arrayBuffer = await audioFile.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      
      // Calculate sample positions
      const sampleRate = audioBuffer.sampleRate;
      const startSample = Math.floor(startTime * sampleRate);
      const endSample = Math.floor(endTime * sampleRate);
      const newLength = endSample - startSample;
      
      // Create new audio buffer with trimmed section
      const newAudioBuffer = audioContext.createBuffer(
        audioBuffer.numberOfChannels,
        newLength,
        sampleRate
      );
      
      // Copy data for each channel
      for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
        const channelData = audioBuffer.getChannelData(channel);
        const newChannelData = newAudioBuffer.getChannelData(channel);
        for (let i = 0; i < newLength; i++) {
          newChannelData[i] = channelData[startSample + i];
        }
      }
      
      // Convert back to WAV blob
      const wavBlob = await audioBufferToWav(newAudioBuffer);
      const url = URL.createObjectURL(wavBlob);
      
      // Create download link
      const a = document.createElement('a');
      a.href = url;
      a.download = `trimmed-${audioFile.name.replace(/\.[^/.]+$/, '')}.wav`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      // Clean up
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Error trimming audio:', error);
      alert('Error trimming audio. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Convert AudioBuffer to WAV Blob
  const audioBufferToWav = (buffer: AudioBuffer): Promise<Blob> => {
    return new Promise((resolve) => {
      const length = buffer.length;
      const sampleRate = buffer.sampleRate;
      const numberOfChannels = buffer.numberOfChannels;
      const interleaved = new Float32Array(length * numberOfChannels);
      
      for (let channel = 0; channel < numberOfChannels; channel++) {
        const channelData = buffer.getChannelData(channel);
        for (let i = 0; i < length; i++) {
          interleaved[i * numberOfChannels + channel] = channelData[i];
        }
      }
      
      const wavBuffer = encodeWAV(interleaved, sampleRate, numberOfChannels);
      const blob = new Blob([wavBuffer], { type: 'audio/wav' });
      resolve(blob);
    });
  };

  const encodeWAV = (samples: Float32Array, sampleRate: number, numChannels: number): ArrayBuffer => {
    const buffer = new ArrayBuffer(44 + samples.length * 2);
    const view = new DataView(buffer);
    
    // WAV header
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };
    
    writeString(0, 'RIFF');
    view.setUint32(4, 36 + samples.length * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * numChannels * 2, true);
    view.setUint16(32, numChannels * 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, samples.length * 2, true);
    
    // Convert samples to 16-bit PCM
    let offset = 44;
    for (let i = 0; i < samples.length; i++) {
      const sample = Math.max(-1, Math.min(1, samples[i]));
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
      offset += 2;
    }
    
    return buffer;
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('audio/')) {
      setAudioFile(file);
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
      setStartTime(0);
      setCurrentTime(0);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <main className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl shadow-lg mb-4">
              <Scissors className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Audio Trimmer
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Cut and trim your audio files directly in the browser. No uploads required.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-emerald-100">
            {/* File Upload */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Upload Audio File</h2>
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="border-2 border-dashed border-emerald-300 rounded-2xl p-8 text-center bg-emerald-50 hover:bg-emerald-100 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Drop your audio file here or click to browse
                </h3>
                <p className="text-gray-600 mb-4">
                  Supports: MP3, WAV, OGG, M4A, and other audio formats
                </p>
                <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg font-semibold">
                  Choose Audio File
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                  accept="audio/*"
                />
              </div>

              {audioFile && (
                <div className="mt-4 p-4 bg-teal-50 rounded-lg border border-teal-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Volume2 className="h-5 w-5 text-teal-500 mr-3" />
                      <span className="font-medium text-gray-900">{audioFile.name}</span>
                    </div>
                    <span className="text-sm text-teal-600">
                      {formatTime(duration)}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Audio Player & Trimmer */}
            {audioUrl && (
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-xl p-6 border border-teal-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Audio Player</h3>
                  
                  {/* Playback Controls */}
                  <div className="flex items-center justify-between mb-4">
                    <button
                      onClick={togglePlayPause}
                      className="bg-teal-500 hover:bg-teal-600 text-white p-3 rounded-full"
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

                  {/* Hidden audio element */}
                  <audio
                    ref={audioRef}
                    src={audioUrl}
                    onLoadedMetadata={handleLoadedMetadata}
                    onTimeUpdate={handleTimeUpdate}
                    onEnded={() => setIsPlaying(false)}
                  />
                </div>

                {/* Trimmer Controls */}
                <div className="bg-gray-50 rounded-xl p-6 border border-cyan-200">
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
                        className="w-full h-2 bg-cyan-200 rounded-lg appearance-none cursor-pointer"
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
                        className="w-full h-2 bg-cyan-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-cyan-50 rounded-lg">
                      <span className="text-sm text-gray-600">Trimmed Duration:</span>
                      <span className="font-semibold text-cyan-700">
                        {formatTime(endTime - startTime)}
                      </span>
                    </div>

                    <button
                      onClick={trimAudio}
                      disabled={isProcessing || startTime >= endTime}
                      className="w-full bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center"
                    >
                      {isProcessing ? (
                        <>
                          <Clock className="h-5 w-5 animate-spin mr-2" />
                          Trimming Audio...
                        </>
                      ) : (
                        <>
                          <Scissors className="h-5 w-5 mr-2" />
                          Trim & Download Audio
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Features */}
            <div className="mt-8 grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-emerald-50 rounded-lg">
                <Volume2 className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                <h4 className="font-semibold text-emerald-700">Browser-Based</h4>
                <p className="text-sm text-gray-600">No file uploads required</p>
              </div>
              <div className="text-center p-4 bg-teal-50 rounded-lg">
                <Scissors className="h-8 w-8 text-teal-500 mx-auto mb-2" />
                <h4 className="font-semibold text-teal-700">Precise Trimming</h4>
                <p className="text-sm text-gray-600">Sample-accurate cuts</p>
              </div>
              <div className="text-center p-4 bg-cyan-50 rounded-lg">
                <Download className="h-8 w-8 text-cyan-500 mx-auto mb-2" />
                <h4 className="font-semibold text-cyan-700">Instant Download</h4>
                <p className="text-sm text-gray-600">WAV format output</p>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Frequently Asked Questions
            </h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {audioTrimmerFaqItems.map((faq, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-emerald-100">
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

const audioTrimmerFaqItems = [
  {
    question: "Are my audio files uploaded to any server?",
    answer: "No! All audio processing happens locally in your browser. Your files never leave your computer, ensuring complete privacy."
  },
  {
    question: "What audio formats are supported?",
    answer: "The trimmer supports most common audio formats including MP3, WAV, OGG, M4A, and more. The output is always in WAV format for maximum compatibility."
  },
  {
    question: "Is there a file size limit?",
    answer: "For best performance, we recommend files under 50MB. Very large files may take longer to process but there's no hard limit."
  },
  {
    question: "Can I trim multiple sections of an audio file?",
    answer: "Currently, the tool supports trimming a single continuous section. For multiple cuts, you can trim different sections separately and combine them using our audio joiner tool."
  },
  {
    question: "Why is the output always in WAV format?",
    answer: "WAV format provides lossless audio quality and is universally compatible. You can convert the trimmed WAV file to other formats using various audio tools if needed."
  },
  {
    question: "Does trimming affect audio quality?",
    answer: "No, the trimming process is lossless. The audio quality remains exactly the same as the original file in the trimmed section."
  }
];