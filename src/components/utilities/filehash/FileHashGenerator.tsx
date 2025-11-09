// components/tools/FileHashGenerator.tsx
'use client';

import { useState, useRef } from 'react';
import { 
  Upload, 
  Copy, 
  Download, 
  Hash,
  FileText,
  Shield,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

import * as CryptoJS from 'crypto-js';

type HashType = 'md5' | 'sha1' | 'sha256' | 'sha512';

interface HashResult {
  type: HashType;
  value: string;
}

export default function FileHashGenerator() {
  const [file, setFile] = useState<File | null>(null);
  const [hashes, setHashes] = useState<HashResult[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateHashes = async (file: File) => {
    setIsProcessing(true);
    setError('');

    try {
      const buffer = await file.arrayBuffer();
      const hashResults: HashResult[] = [];
      const wordArray = CryptoJS.lib.WordArray.create(buffer);

      // Generate MD5 hash using the library
      const md5Hash = CryptoJS.MD5(wordArray).toString(CryptoJS.enc.Hex);
      hashResults.push({
        type: 'md5',
        value: md5Hash
      });

      // Generate SHA-1 hash using Web Crypto API (supported)
      const sha1Buffer = await crypto.subtle.digest('SHA-1', buffer);
      hashResults.push({
        type: 'sha1',
        value: Array.from(new Uint8Array(sha1Buffer))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('')
      });

      // Generate SHA-256 hash
      const sha256Buffer = await crypto.subtle.digest('SHA-256', buffer);
      hashResults.push({
        type: 'sha256',
        value: Array.from(new Uint8Array(sha256Buffer))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('')
      });

      // Generate SHA-512 hash
      const sha512Buffer = await crypto.subtle.digest('SHA-512', buffer);
      hashResults.push({
        type: 'sha512',
        value: Array.from(new Uint8Array(sha512Buffer))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('')
      });

      setHashes(hashResults);
    } catch (err) {
      setError('Error generating hashes. Please try again.');
      console.error('Hash generation error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      generateHashes(selectedFile);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      generateHashes(droppedFile);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const copyHash = async (hash: string) => {
    try {
      await navigator.clipboard.writeText(hash);
      alert('Hash copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy hash:', err);
    }
  };

  const resetForm = () => {
    setFile(null);
    setHashes([]);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const downloadHashes = () => {
    if (!file) return;

    const content = hashes.map(hash => `${hash.type.toUpperCase()}: ${hash.value}`).join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `${file.name}_hashes.txt`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-emerald-100">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-3">
          <div className="bg-emerald-100 p-3 rounded-full">
            <Hash className="h-6 w-6 text-emerald-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-800">
          File Hash Generator
        </h2>
        <p className="text-gray-600 text-sm mt-1">
          Generate MD5, SHA-1, SHA-256, and SHA-512 hashes
        </p>
      </div>

      {/* File Upload Area */}
      <div className="mb-6">
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-emerald-400 transition-colors cursor-pointer bg-gray-50"
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
          />
          
          {!file ? (
            <div>
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-700 mb-2">
                Drop your file here or click to browse
              </p>
              <p className="text-sm text-gray-500">
                Supports any file type
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-4">
              <FileText className="h-12 w-12 text-emerald-500" />
              <div className="text-left">
                <p className="font-medium text-gray-800">{file.name}</p>
                <p className="text-sm text-gray-600">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Processing Indicator */}
      {isProcessing && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-3">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
          <p className="text-blue-700">Generating hashes...</p>
        </div>
      )}

      {/* Hash Results */}
      {hashes.length > 0 && (
        <div className="space-y-4 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-5 w-5 text-emerald-500" />
            <h3 className="text-lg font-semibold text-gray-800">Generated Hashes</h3>
          </div>
          
          {hashes.map((hash) => (
            <div key={hash.type} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono font-bold text-sm text-gray-600 uppercase">
                    {hash.type}:
                  </span>
                  <p className="font-mono text-sm break-all mt-1 text-gray-800">
                    {hash.value}
                  </p>
                </div>
                <button
                  onClick={() => copyHash(hash.value)}
                  className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 text-sm"
                >
                  <Copy className="h-4 w-4" />
                  Copy
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={resetForm}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
        >
          <Upload className="h-4 w-4" />
          New File
        </button>
        
        {hashes.length > 0 && (
          <>
            <button
              onClick={downloadHashes}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
            >
              <Download className="h-4 w-4" />
              Download
            </button>
          </>
        )}
      </div>

      {/* Info Section */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-start gap-3">
          <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-800 mb-1">What are file hashes?</h4>
            <p className="text-sm text-blue-700">
              File hashes are unique digital fingerprints of files. They're used to verify file integrity, 
              detect duplicates, and ensure files haven't been tampered with.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}