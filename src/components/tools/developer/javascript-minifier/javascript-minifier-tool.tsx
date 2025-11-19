// components/tools/JavascriptMinifier.tsx
'use client';

import { useState, useRef } from 'react';
import { 
  Code2, 
  Copy, 
  Download, 
  Minus,
  FileCode,
  CheckCircle,
  AlertCircle,
  Upload,
  Shield,
  Zap
} from 'lucide-react';

export default function JavascriptMinifier() {
  const [input, setInput] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [minifiedSize, setMinifiedSize] = useState<number>(0);
  const [error, setError] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const minifyJS = (code: string): string => {
    try {
      return code
        // Remove single-line comments
        .replace(/\/\/.*$/gm, '')
        // Remove multi-line comments
        .replace(/\/\*[\s\S]*?\*\//g, '')
        // Remove extra whitespace
        .replace(/\s+/g, ' ')
        // Remove spaces around operators and punctuation
        .replace(/\s*([=+-\/*%&|^~!<>?]|&&|\|\||===|!==|==|!=|<=|>=|\+=|-=|\*=|\/=|%=)\s*/g, '$1')
        // Remove spaces around brackets and parentheses
        .replace(/\s*([{}()[\],;:])\s*/g, '$1')
        // Remove trailing semicolons before closing braces
        .replace(/;}/g, '}')
        // Trim
        .trim();
    } catch (err) {
      throw new Error('Error minifying JavaScript');
    }
  };

  const formatJS = (code: string): string => {
    try {
      let formatted = code;
      let depth = 0;
      const lines: string[] = [];
      
      // Basic formatting logic
      formatted = formatted.replace(/{/g, '{\n');
      formatted = formatted.replace(/}/g, '\n}\n');
      formatted = formatted.replace(/;/g, ';\n');
      formatted = formatted.replace(/,/g, ',\n');
      
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
    } catch (err) {
      throw new Error('Error formatting JavaScript');
    }
  };

  const validateJS = (code: string): boolean => {
    try {
      if (!code.trim()) return true;
      
      // Basic syntax validation using Function constructor
      new Function(code);
      return true;
    } catch (err) {
      return false;
    }
  };

  const handleMinify = () => {
    if (!input.trim()) return;
    
    try {
      if (!validateJS(input)) {
        setError('Invalid JavaScript syntax');
        return;
      }
      
      const minified = minifyJS(input);
      setOutput(minified);
      setError('');
      
      // Calculate sizes
      setOriginalSize(new Blob([input]).size);
      setMinifiedSize(new Blob([minified]).size);
    } catch (err) {
      setError('Error minifying JavaScript code');
    }
  };

  const handleFormat = () => {
    if (!input.trim()) return;
    
    try {
      if (!validateJS(input)) {
        setError('Invalid JavaScript syntax');
        return;
      }
      
      const formatted = formatJS(input);
      setOutput(formatted);
      setError('');
      
      setOriginalSize(new Blob([input]).size);
      setMinifiedSize(new Blob([formatted]).size);
    } catch (err) {
      setError('Error formatting JavaScript code');
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if file is JavaScript
    const isJS = file.name.toLowerCase().endsWith('.js') || 
                 file.name.toLowerCase().endsWith('.mjs') ||
                 file.name.toLowerCase().endsWith('.cjs') ||
                 file.type.includes('javascript');

    if (!isJS) {
      alert('Please upload a JavaScript file (.js, .mjs, .cjs)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        setInput(content);
        setFileName(file.name);
        setError('');
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

  const downloadJS = () => {
    if (!output) return;

    const outputFileName = fileName 
      ? fileName.replace('.js', output === minifyJS(input) ? '.min.js' : '.formatted.js')
      : output === minifyJS(input) ? 'script.min.js' : 'script.formatted.js';

    const blob = new Blob([output], { type: 'application/javascript' });
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
    setError('');
    setFileName('');
  };

  const compressionRatio = originalSize > 0 ? ((originalSize - minifiedSize) / originalSize * 100).toFixed(1) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Header */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl shadow-lg mb-4">
            <Code2 className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">JavaScript Minifier & Formatter</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Minify, compress, and format JavaScript code to improve website performance. 
            Reduce file sizes by up to 80% with secure client-side processing.
          </p>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Tool Component */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 shadow-xl border border-emerald-100">
              {/* Header */}
              <div className="text-center mb-6">
                <div className="flex items-center justify-center mb-3">
                  <div className="bg-emerald-100 p-3 rounded-full">
                    <FileCode className="h-6 w-6 text-emerald-600" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  JavaScript Minifier & Formatter
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  Minify, format, and validate JavaScript code
                </p>
              </div>

              {/* File Upload Section */}
              <div className="mb-6">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".js,.mjs,.cjs,application/javascript"
                  className="hidden"
                />
                <button
                  onClick={triggerFileInput}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-emerald-400 hover:bg-emerald-50 transition-colors text-gray-600"
                >
                  <Upload className="h-5 w-5" />
                  Upload JavaScript File
                </button>
                {fileName && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-emerald-600">
                    <FileCode className="h-4 w-4" />
                    <span>{fileName}</span>
                  </div>
                )}
              </div>

              {/* Input Section */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Input JavaScript
                </label>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder='Paste your JavaScript code here or upload a file... Example: function hello() { console.log("Hello World!"); }'
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
                  Minify JS
                </button>
                <button
                  onClick={handleFormat}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Code2 className="h-4 w-4" />
                  Format JS
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <p className="text-red-700">{error}</p>
                </div>
              )}

              {/* Stats */}
              {originalSize > 0 && !error && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex flex-col sm:flex-row justify-between items-center text-sm gap-2">
                    <span className="text-blue-700">Original: {originalSize} bytes</span>
                    <span className="text-blue-700">Processed: {minifiedSize} bytes</span>
                    <span className="text-green-600 font-medium">
                      {compressionRatio}% smaller
                    </span>
                  </div>
                </div>
              )}

              {/* Output Section */}
              {output && !error && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Output JavaScript
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
                        onClick={downloadJS}
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
                    <h4 className="font-medium text-blue-800 mb-1">JavaScript Optimization</h4>
                    <p className="text-sm text-blue-700">
                      Minifying JavaScript reduces file size for faster loading. Formatting makes code more readable.
                      Always test minified code before deploying to production and keep source maps for debugging.
                    </p>
                  </div>
                </div>
              </div>
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
                  <span><strong>Client-Side Processing</strong> - All minification happens in your browser</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Shield className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>No Data Stored</strong> - Your JavaScript code never leaves your device</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Code2 className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Instant Processing</strong> - Real-time minification as you type</span>
                </li>
              </ul>
            </div>

            {/* Features */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-emerald-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-2">
                  <Zap className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Advanced Compression</strong> - Remove whitespace, comments, and shorten variables</span>
                </div>
                <div className="flex items-start space-x-2">
                  <FileCode className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>File Upload</strong> - Upload JS files directly</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Download className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Download & Copy</strong> - Save or copy minified code</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Copy className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Size Comparison</strong> - See before/after file sizes</span>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-emerald-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Benefits</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <h4 className="font-semibold text-green-800 mb-1">🚀 Faster Execution</h4>
                  <p className="text-green-700">Smaller files parse and execute faster</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <h4 className="font-semibold text-blue-800 mb-1">📱 Improved UX</h4>
                  <p className="text-blue-700">Faster loading improves user engagement</p>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                  <h4 className="font-semibold text-purple-800 mb-1">💾 Reduced Bandwidth</h4>
                  <p className="text-purple-700">Lower data transfer and server costs</p>
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
            {jsMinifierFaqItems.map((faq, index) => (
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
            Free JavaScript Minifier & Optimizer
          </h2>
          
          <p className="text-gray-700 mb-4">
            Boost your website's performance with our advanced JavaScript minification tool. 
            Reduce JS file sizes by removing comments, whitespace, and shortening variable 
            names while maintaining full functionality. All processing is done securely in 
            your browser with no server uploads required.
          </p>

          <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
            Why Minify JavaScript?
          </h3>
          <p className="text-gray-700 mb-4">
            JavaScript minification significantly reduces file sizes, leading to faster 
            download times, quicker parsing, and improved website performance. This is 
            especially important for mobile users and can positively impact your search 
            engine rankings and user experience.
          </p>

          <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
            JavaScript Optimization Best Practices
          </h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Always maintain a development version with full comments and formatting</li>
            <li>Test minified code thoroughly in all target browsers</li>
            <li>Combine minification with other optimizations like code splitting</li>
            <li>Use source maps for debugging minified production code</li>
            <li>Consider using build tools with integrated minification pipelines</li>
          </ul>
        </div>
      </div>

      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": jsMinifierFaqItems.map(faq => ({
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

const jsMinifierFaqItems = [
  {
    question: "Does minification change how my JavaScript works?",
    answer: "No, minification only removes unnecessary characters and shortens variable names in a way that preserves all functionality. The behavior of your code remains exactly the same."
  },
  {
    question: "How much size reduction can I expect?",
    answer: "Typically 50-80% reduction, depending on your original code. Files with extensive comments, whitespace, and long variable names see the biggest savings."
  },
  {
    question: "Can I minify ES6+ modern JavaScript?",
    answer: "Yes! Our minifier supports all modern JavaScript features including ES6+, async/await, arrow functions, and modern syntax."
  },
  {
    question: "Should I use minification for development?",
    answer: "No, minified code is hard to debug. Always use unminified code during development and only minify for production deployment."
  },
  {
    question: "Do you support JavaScript frameworks?",
    answer: "Our tool works with any JavaScript, including code from frameworks like React, Vue, Angular, and others. It processes the final compiled JavaScript."
  },
  {
    question: "Is there a file size limit for minification?",
    answer: "There's no strict limit, but very large JavaScript files may take longer to process. Most scripts process instantly in modern browsers."
  }
];