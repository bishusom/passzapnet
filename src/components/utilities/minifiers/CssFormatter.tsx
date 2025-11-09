// components/tools/CssFormatter.tsx
'use client';

import { useState, useRef } from 'react';
import { 
  Code2, 
  Copy, 
  Download, 
  Minus,
  CheckCircle,
  Upload,
  FileText
} from 'lucide-react';

export default function CssFormatter() {
  const [input, setInput] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [minifiedSize, setMinifiedSize] = useState<number>(0);
  const [fileName, setFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const minifyCSS = (css: string): string => {
    return css
      // Remove comments
      .replace(/\/\*[\s\S]*?\*\//g, '')
      // Remove whitespace
      .replace(/\s+/g, ' ')
      // Remove spaces around braces and colons
      .replace(/\s*{\s*/g, '{')
      .replace(/\s*}\s*/g, '}')
      .replace(/\s*:\s*/g, ':')
      .replace(/\s*;\s*/g, ';')
      .replace(/\s*,\s*/g, ',')
      // Remove trailing semicolons
      .replace(/;}/g, '}')
      // Trim
      .trim();
  };

  const formatCSS = (css: string): string => {
    let formatted = css;
    let depth = 0;
    const lines: string[] = [];
    
    // Basic formatting logic
    formatted = formatted.replace(/{/g, '{\n');
    formatted = formatted.replace(/}/g, '\n}\n');
    formatted = formatted.replace(/;/g, ';\n');
    
    formatted.split('\n').forEach(line => {
      line = line.trim();
      if (!line) return;
      
      if (line.includes('}')) {
        depth--;
      }
      
      lines.push('  '.repeat(depth) + line);
      
      if (line.includes('{')) {
        depth++;
      }
    });
    
    return lines.join('\n');
  };

  const handleMinify = () => {
    if (!input.trim()) return;
    
    const minified = minifyCSS(input);
    setOutput(minified);
    
    // Calculate sizes
    setOriginalSize(new Blob([input]).size);
    setMinifiedSize(new Blob([minified]).size);
  };

  const handleFormat = () => {
    if (!input.trim()) return;
    
    const formatted = formatCSS(input);
    setOutput(formatted);
    setOriginalSize(new Blob([input]).size);
    setMinifiedSize(new Blob([formatted]).size);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if file is CSS
    if (!file.name.toLowerCase().endsWith('.css') && !file.type.includes('css')) {
      alert('Please upload a CSS file (.css)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        setInput(content);
        setFileName(file.name);
        // Auto-calculate original size
        setOriginalSize(new Blob([content]).size);
      } catch (err) {
        alert('Failed to read file');
      }
    };
    reader.readAsText(file);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const downloadCSS = () => {
    if (!output) return;

    const outputFileName = fileName 
      ? fileName.replace('.css', output === minifyCSS(input) ? '.min.css' : '.formatted.css')
      : output === minifyCSS(input) ? 'styles.min.css' : 'styles.formatted.css';

    const blob = new Blob([output], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = outputFileName;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setOriginalSize(0);
    setMinifiedSize(0);
    setFileName('');
  };

  const compressionRatio = originalSize > 0 ? ((originalSize - minifiedSize) / originalSize * 100).toFixed(1) : 0;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-emerald-100">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-3">
          <div className="bg-emerald-100 p-3 rounded-full">
            <Code2 className="h-6 w-6 text-emerald-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-800">
          CSS Minifier & Formatter
        </h2>
        <p className="text-gray-600 text-sm mt-1">
          Minify and beautify your CSS code
        </p>
      </div>

      {/* File Upload Section */}
      <div className="mb-6">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept=".css,text/css"
          className="hidden"
        />
        <button
          onClick={triggerFileInput}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-emerald-400 hover:bg-emerald-50 transition-colors text-gray-600"
        >
          <Upload className="h-5 w-5" />
          Upload CSS File
        </button>
        {fileName && (
          <div className="mt-2 flex items-center gap-2 text-sm text-emerald-600">
            <FileText className="h-4 w-4" />
            <span>{fileName}</span>
          </div>
        )}
      </div>

      {/* Input Section */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Input CSS
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='Paste your CSS here or upload a file... Example: body { color: #333; margin: 0; }'
          className="w-full h-40 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-mono text-sm resize-none"
        />
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        <button
          onClick={handleMinify}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
        >
          <Minus className="h-4 w-4" />
          Minify CSS
        </button>
        <button
          onClick={handleFormat}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Code2 className="h-4 w-4" />
          Format CSS
        </button>
      </div>

      {/* Stats */}
      {originalSize > 0 && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex flex-col sm:flex-row justify-between items-center text-sm gap-2">
            <span className="text-blue-700">Original size: {originalSize} bytes</span>
            <span className="text-blue-700">Processed size: {minifiedSize} bytes</span>
            <span className="text-green-600 font-medium">
              {compressionRatio}% smaller
            </span>
          </div>
        </div>
      )}

      {/* Output Section */}
      {output && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Output CSS
          </label>
          <div className="relative">
            <textarea
              value={output}
              readOnly
              className="w-full h-40 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm resize-none"
            />
            <div className="absolute top-2 right-2 flex gap-2">
              <button
                onClick={() => copyToClipboard(output)}
                className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                title="Copy to clipboard"
              >
                <Copy className="h-4 w-4 text-gray-600" />
              </button>
              <button
                onClick={downloadCSS}
                className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                title="Download file"
              >
                <Download className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={clearAll}
          className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
        >
          Clear All
        </button>
        <button
          onClick={triggerFileInput}
          className="flex items-center justify-center gap-2 px-4 py-3 border border-emerald-300 text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors"
        >
          <Upload className="h-4 w-4" />
          Upload Another File
        </button>
      </div>

      {/* Info Section */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-start gap-3">
          <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-800 mb-1">CSS Optimization Tips</h4>
            <p className="text-sm text-blue-700">
              Minifying CSS can reduce file size by 60-80%. Always keep the original formatted version for development.
              Test minified CSS thoroughly before deploying to production.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}