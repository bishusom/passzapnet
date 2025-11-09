// components/tools/Base64Tool.tsx
'use client';

import { useState, useRef } from 'react';
import { 
  Code, 
  FileText, 
  Copy, 
  RotateCcw, 
  Upload,
  Download,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export default function Base64Tool() {
  const [inputText, setInputText] = useState<string>('');
  const [outputText, setOutputText] = useState<string>('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [fileName, setFileName] = useState<string>('');
  const [fileSize, setFileSize] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEncode = () => {
    try {
      setError('');
      if (mode === 'encode') {
        const encoded = btoa(unescape(encodeURIComponent(inputText)));
        setOutputText(encoded);
      } else {
        const decoded = decodeURIComponent(escape(atob(inputText)));
        setOutputText(decoded);
      }
    } catch (err) {
      setError('Invalid input for the selected operation. Please check your data.');
      setOutputText('');
    }
  };

  const handleDecode = () => {
    setMode(mode === 'encode' ? 'decode' : 'encode');
    // Swap input and output when switching modes
    const temp = inputText;
    setInputText(outputText);
    setOutputText(temp);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(outputText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleClear = () => {
    setInputText('');
    setOutputText('');
    setFileName('');
    setFileSize('');
    setError('');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setFileSize(formatFileSize(file.size));

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setError('File size too large. Please select a file smaller than 10MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const uint8Array = new Uint8Array(arrayBuffer);
        let binary = '';
        uint8Array.forEach(byte => {
          binary += String.fromCharCode(byte);
        });
        const base64 = btoa(binary);
        setInputText(base64);
        setMode('decode'); // Auto-switch to decode mode for file input
        setError('');
      } catch (err) {
        setError('Failed to process the file. Please try another file.');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-emerald-100">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-3">
          <div className="bg-emerald-100 p-3 rounded-full">
            <Code className="h-6 w-6 text-emerald-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-800">
          Base64 Encoder & Decoder
        </h2>
        <p className="text-gray-600 text-sm mt-1">
          Convert text and files to Base64 format
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-4 text-sm">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Mode Toggle */}
      <div className="flex items-center justify-center mb-6">
        <div className="bg-gray-100 rounded-lg p-1 flex">
          <button
            onClick={() => setMode('encode')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              mode === 'encode'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Encode
          </button>
          <button
            onClick={() => setMode('decode')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              mode === 'decode'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Decode
          </button>
        </div>
      </div>

      {/* File Upload Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700">
            File Upload (Optional)
          </label>
          {fileName && (
            <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
              {fileName} • {fileSize}
            </span>
          )}
        </div>
        <div className="flex gap-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept="*/*"
          />
          <button
            onClick={triggerFileInput}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-emerald-400 hover:bg-emerald-50 transition-colors text-gray-600"
          >
            <Upload className="h-4 w-4" />
            <span className="text-sm">Choose File</span>
          </button>
        </div>
      </div>

      {/* Input Section */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          {mode === 'encode' ? 'Text to Encode' : 'Base64 to Decode'}
        </label>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={
            mode === 'encode' 
              ? 'Enter text to encode to Base64...' 
              : 'Paste Base64 string to decode...'
          }
          rows={6}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none font-mono text-sm"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={handleEncode}
          className="flex-1 bg-emerald-500 text-white py-3 px-4 rounded-lg hover:bg-emerald-600 transition-colors font-medium flex items-center justify-center gap-2"
        >
          <FileText className="h-4 w-4" />
          {mode === 'encode' ? 'Encode to Base64' : 'Decode from Base64'}
        </button>
        
        <button
          onClick={handleDecode}
          className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 flex items-center justify-center"
          title="Switch between encode/decode"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
        
        <button
          onClick={handleClear}
          className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 flex items-center justify-center"
          title="Clear all"
        >
          <span className="text-lg">×</span>
        </button>
      </div>

      {/* Output Section */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700">
            {mode === 'encode' ? 'Base64 Output' : 'Decoded Text'}
          </label>
          <div className="flex items-center gap-2">
            {outputText && (
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 px-3 py-1 text-xs bg-emerald-500 text-white rounded hover:bg-emerald-600 transition-colors"
              >
                {copied ? (
                  <>
                    <CheckCircle className="h-3 w-3" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    Copy
                  </>
                )}
              </button>
            )}
          </div>
        </div>
        <div className="relative">
          <textarea
            value={outputText}
            readOnly
            placeholder={
              mode === 'encode' 
                ? 'Base64 encoded result will appear here...' 
                : 'Decoded text will appear here...'
            }
            rows={6}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 resize-none font-mono text-sm"
          />
        </div>
      </div>

      {/* Character Count */}
      <div className="flex justify-between text-xs text-gray-500">
        <span>Input: {inputText.length} characters</span>
        <span>Output: {outputText.length} characters</span>
      </div>
    </div>
  );
}