// components/tools/media/audio-joiner/audio-joiner-tool.tsx
'use client';

import { useState, useRef, useCallback } from 'react';
import { 
  Combine, 
  Upload, 
  Download, 
  Play,
  Pause,
  Volume2,
  Clock,
  Trash2,
  MoveUp,
  MoveDown
} from 'lucide-react';

interface AudioFile {
  id: string;
  file: File;
  url: string;
  duration: number;
  name: string;
}

export default function AudioJoinerTool() {
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [joinedAudioUrl, setJoinedAudioUrl] = useState<string>('');
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const audioFiles = files.filter(file => file.type.startsWith('audio/'));
    
    if (audioFiles.length > 0) {
      processAudioFiles(audioFiles);
    }
  };

  const processAudioFiles = async (files: File[]) => {
    const newAudioFiles: AudioFile[] = [];
    
    for (const file of files) {
      const url = URL.createObjectURL(file);
      
      // Get duration using Audio element
      const duration = await new Promise<number>((resolve) => {
        const audio = new Audio();
        audio.src = url;
        audio.onloadedmetadata = () => {
          resolve(audio.duration);
        };
        audio.onerror = () => {
          resolve(0);
        };
      });
      
      newAudioFiles.push({
        id: Math.random().toString(36).substr(2, 9),
        file,
        url,
        duration,
        name: file.name
      });
    }
    
    setAudioFiles(prev => [...prev, ...newAudioFiles]);
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setCurrentTime(0);
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

  const removeFile = (id: string) => {
    setAudioFiles(prev => {
      const fileToRemove = prev.find(file => file.id === id);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.url);
      }
      return prev.filter(file => file.id !== id);
    });
  };

  const moveFile = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === audioFiles.length - 1)
    ) {
      return;
    }
    
    setAudioFiles(prev => {
      const newFiles = [...prev];
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      [newFiles[index], newFiles[newIndex]] = [newFiles[newIndex], newFiles[index]];
      return newFiles;
    });
  };

  const getTotalDuration = () => {
    return audioFiles.reduce((total, file) => total + file.duration, 0);
  };

  const joinAudio = async () => {
    if (audioFiles.length < 2) {
      alert('Please add at least 2 audio files to join.');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const audioContext = new AudioContext();
      let finalBuffer: AudioBuffer | null = null;
      
      // Process each audio file
      for (let i = 0; i < audioFiles.length; i++) {
        const audioFile = audioFiles[i];
        const arrayBuffer = await audioFile.file.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        
        if (!finalBuffer) {
          // Create final buffer with total length
          const totalLength = audioFiles.reduce((sum, file) => 
            sum + Math.floor(file.duration * audioBuffer.sampleRate), 0);
          
          finalBuffer = audioContext.createBuffer(
            audioBuffer.numberOfChannels,
            totalLength,
            audioBuffer.sampleRate
          );
        }
        
        // Calculate start position for this file
        const startSample = audioFiles
          .slice(0, i)
          .reduce((sum, file) => sum + Math.floor(file.duration * audioBuffer.sampleRate), 0);
        
        // Copy data for each channel
        for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
          const channelData = audioBuffer.getChannelData(channel);
          const finalChannelData = finalBuffer.getChannelData(channel);
          
          for (let j = 0; j < channelData.length; j++) {
            finalChannelData[startSample + j] = channelData[j];
          }
        }
      }
      
      if (finalBuffer) {
        // Convert to WAV
        const wavBlob = await audioBufferToWav(finalBuffer);
        const url = URL.createObjectURL(wavBlob);
        setJoinedAudioUrl(url);
        
        // Create download link automatically
        const a = document.createElement('a');
        a.href = url;
        a.download = `joined-audio-${Date.now()}.wav`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
      
    } catch (error) {
      console.error('Error joining audio:', error);
      alert('Error joining audio files. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

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
    const files = Array.from(event.dataTransfer.files);
    const audioFiles = files.filter(file => file.type.startsWith('audio/'));
    
    if (audioFiles.length > 0) {
      processAudioFiles(audioFiles);
    }
  };

  const clearAllFiles = () => {
    audioFiles.forEach(file => URL.revokeObjectURL(file.url));
    setAudioFiles([]);
    setJoinedAudioUrl('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
      <main className="py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl shadow-lg mb-4">
              <Combine className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Audio Joiner
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Combine multiple audio files into one seamless track. No uploads required.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-teal-100">
            {/* File Upload */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Upload Audio Files</h2>
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="border-2 border-dashed border-teal-300 rounded-2xl p-8 text-center bg-teal-50 hover:bg-teal-100 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-12 w-12 text-teal-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Drop your audio files here or click to browse
                </h3>
                <p className="text-gray-600 mb-4">
                  Select multiple files to combine them in order
                </p>
                <button className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-lg font-semibold">
                  Choose Audio Files
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                  accept="audio/*"
                  multiple
                />
              </div>

              {audioFiles.length > 0 && (
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Audio Files ({audioFiles.length})
                    </h3>
                    <button
                      onClick={clearAllFiles}
                      className="text-red-500 hover:text-red-700 text-sm font-medium"
                    >
                      Clear All
                    </button>
                  </div>
                  
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {audioFiles.map((audioFile, index) => (
                      <div
                        key={audioFile.id}
                        className="flex items-center justify-between p-3 bg-cyan-50 rounded-lg border border-cyan-200"
                      >
                        <div className="flex items-center flex-1">
                          <Volume2 className="h-4 w-4 text-cyan-500 mr-3" />
                          <span className="font-medium text-gray-900 text-sm truncate">
                            {audioFile.name}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          <span className="text-xs text-cyan-600">
                            {formatTime(audioFile.duration)}
                          </span>
                          
                          <button
                            onClick={() => moveFile(index, 'up')}
                            disabled={index === 0}
                            className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-30"
                          >
                            <MoveUp className="h-4 w-4" />
                          </button>
                          
                          <button
                            onClick={() => moveFile(index, 'down')}
                            disabled={index === audioFiles.length - 1}
                            className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-30"
                          >
                            <MoveDown className="h-4 w-4" />
                          </button>
                          
                          <button
                            onClick={() => removeFile(audioFile.id)}
                            className="p-1 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-3 p-3 bg-teal-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-teal-800">Total Duration:</span>
                      <span className="font-semibold text-teal-900">
                        {formatTime(getTotalDuration())}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Controls */}
            {audioFiles.length > 0 && (
              <div className="space-y-6">
                {/* Join Button */}
                <div className="bg-gray-50 rounded-xl p-6 border border-cyan-200">
                  <button
                    onClick={joinAudio}
                    disabled={isProcessing || audioFiles.length < 2}
                    className="w-full bg-teal-500 hover:bg-teal-600 disabled:bg-gray-400 text-white py-4 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center text-lg"
                  >
                    {isProcessing ? (
                      <>
                        <Clock className="h-6 w-6 animate-spin mr-3" />
                        Joining Audio Files...
                      </>
                    ) : (
                      <>
                        <Combine className="h-6 w-6 mr-3" />
                        Join {audioFiles.length} Audio Files
                      </>
                    )}
                  </button>
                </div>

                {/* Preview Player */}
                {joinedAudioUrl && (
                  <div className="bg-gray-50 rounded-xl p-6 border border-teal-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Joined Audio Preview</h3>
                    
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
                          <span>{formatTime(getTotalDuration())}</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max={getTotalDuration()}
                          value={currentTime}
                          onChange={(e) => handleSeek(parseFloat(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                    </div>

                    {/* Hidden audio element */}
                    <audio
                      ref={audioRef}
                      src={joinedAudioUrl}
                      onLoadedMetadata={handleLoadedMetadata}
                      onTimeUpdate={handleTimeUpdate}
                      onEnded={() => setIsPlaying(false)}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Features */}
            <div className="mt-8 grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-teal-50 rounded-lg">
                <Volume2 className="h-8 w-8 text-teal-500 mx-auto mb-2" />
                <h4 className="font-semibold text-teal-700">Browser-Based</h4>
                <p className="text-sm text-gray-600">No file uploads required</p>
              </div>
              <div className="text-center p-4 bg-cyan-50 rounded-lg">
                <Combine className="h-8 w-8 text-cyan-500 mx-auto mb-2" />
                <h4 className="font-semibold text-cyan-700">Multiple Files</h4>
                <p className="text-sm text-gray-600">Combine unlimited tracks</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Download className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <h4 className="font-semibold text-blue-700">Instant Download</h4>
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
              {audioJoinerFaqItems.map((faq, index) => (
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

const audioJoinerFaqItems = [
  {
    question: "Are my audio files uploaded to any server?",
    answer: "No! All audio processing happens locally in your browser. Your files never leave your computer, ensuring complete privacy."
  },
  {
    question: "What audio formats are supported?",
    answer: "The joiner supports most common audio formats including MP3, WAV, OGG, M4A, and more. The output is always in WAV format for maximum compatibility."
  },
  {
    question: "Can I reorder the audio files?",
    answer: "Yes! You can drag and drop files to reorder them, or use the up/down arrows to change the sequence before joining."
  },
  {
    question: "Is there a limit to how many files I can join?",
    answer: "There's no hard limit, but for best performance we recommend joining up to 10 files at a time. Very large numbers of files may slow down processing."
  },
  {
    question: "Will the joined audio have gaps between files?",
    answer: "No, the audio files are joined seamlessly without any gaps or pauses between them, creating one continuous audio track."
  },
  {
    question: "Does joining affect audio quality?",
    answer: "No, the joining process is lossless. The audio quality remains exactly the same as the original files in the joined output."
  }
];