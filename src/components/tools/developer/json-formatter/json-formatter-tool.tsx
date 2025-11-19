// components/tools/JsonFormatter.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  Code, 
  Copy, 
  CheckCircle, 
  AlertCircle,
  FileText,
  Minus,
  Expand,
  Download,
  Upload,
  Shield,
  Zap
} from 'lucide-react';

interface JsonError {
  line: number;
  message: string;
  position: number;
}

export default function JsonFormatter() {
  const [inputJson, setInputJson] = useState<string>('');
  const [formattedJson, setFormattedJson] = useState<string>('');
  const [isValid, setIsValid] = useState<boolean>(true);
  const [error, setError] = useState<JsonError | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [indentation, setIndentation] = useState<number>(2);
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-validate when input changes
  useEffect(() => {
    if (inputJson.trim()) {
      validateJson();
    } else {
      setValidationResult(null);
      setIsValid(true);
      setError(null);
    }
  }, [inputJson]);

  const formatJson = () => {
    try {
      setError(null);
      setValidationResult(null);
      
      if (!inputJson.trim()) {
        setFormattedJson('');
        setIsValid(true);
        setValidationResult({
          isValid: true,
          message: 'Please enter some JSON to format',
          type: 'info'
        });
        return;
      }

      // Parse and format JSON
      const parsedJson = JSON.parse(inputJson);
      const formatted = JSON.stringify(parsedJson, null, indentation);
      
      setFormattedJson(formatted);
      setIsValid(true);
      setValidationResult({
        isValid: true,
        message: 'JSON successfully formatted!',
        type: 'success'
      });
    } catch (err) {
      handleJsonError(err as Error);
    }
  };

  const minifyJson = () => {
    try {
      setError(null);
      setValidationResult(null);
      
      if (!inputJson.trim()) {
        setFormattedJson('');
        setIsValid(true);
        setValidationResult({
          isValid: true,
          message: 'Please enter some JSON to minify',
          type: 'info'
        });
        return;
      }

      const parsedJson = JSON.parse(inputJson);
      const minified = JSON.stringify(parsedJson);
      
      setFormattedJson(minified);
      setIsValid(true);
      setValidationResult({
        isValid: true,
        message: 'JSON successfully minified!',
        type: 'success'
      });
    } catch (err) {
      handleJsonError(err as Error);
    }
  };

  const validateJson = (showMessage: boolean = true) => {
    try {
      if (!inputJson.trim()) {
        setIsValid(true);
        setError(null);
        if (showMessage) {
          setValidationResult({
            isValid: true,
            message: 'Please enter some JSON to validate',
            type: 'info'
          });
        }
        return true;
      }

      JSON.parse(inputJson);
      setIsValid(true);
      setError(null);
      if (showMessage) {
        setValidationResult({
          isValid: true,
          message: '✅ Valid JSON! Your syntax is correct.',
          type: 'success'
        });
      }
      return true;
    } catch (err) {
      const error = handleJsonError(err as Error);
      if (showMessage) {
        setValidationResult({
          isValid: false,
          message: `❌ Invalid JSON: ${error.message.split('\n')[0]}`,
          type: 'error'
        });
      }
      return false;
    }
  };

  const handleJsonError = (err: Error): JsonError => {
    setIsValid(false);
    
    // Extract line number from error message
    const lineMatch = err.message.match(/position (\d+)/);
    const position = lineMatch ? parseInt(lineMatch[1]) : 0;
    
    // Calculate approximate line number
    const lines = inputJson.substring(0, position).split('\n');
    const line = lines.length;
    
    const jsonError: JsonError = {
      line,
      message: err.message,
      position
    };
    
    setError(jsonError);
    setFormattedJson('');
    return jsonError;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formattedJson);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleClear = () => {
    setInputJson('');
    setFormattedJson('');
    setError(null);
    setIsValid(true);
    setValidationResult(null);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        setInputJson(content);
        setError(null);
        // Auto-validate after file upload
        setTimeout(() => validateJson(true), 100);
      } catch (err) {
        setError({
          line: 1,
          message: 'Failed to read file',
          position: 0
        });
      }
    };
    reader.readAsText(file);
  };

  const triggerFileInput = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json,application/json';
    fileInput.onchange = (e) => handleFileUpload(e as any);
    fileInput.click();
  };

  const downloadJson = () => {
    if (!formattedJson) return;

    const blob = new Blob([formattedJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Auto-scroll to error line
  useEffect(() => {
    if (error && textareaRef.current) {
      const lines = inputJson.split('\n');
      let lineHeight = 20; // Approximate line height
      const scrollPosition = (error.line - 1) * lineHeight;
      textareaRef.current.scrollTop = Math.max(0, scrollPosition - 100);
    }
  }, [error, inputJson]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Header */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl shadow-lg mb-4">
            <Code className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">JSON Formatter & Validator</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Beautify, validate, and minify JSON data with real-time syntax checking. 
            All processing happens securely in your browser.
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
                    <Code className="h-6 w-6 text-emerald-600" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  JSON Formatter & Validator
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  Beautify, validate, and minify JSON data
                </p>
              </div>

              {/* Validation Result Banner */}
              {validationResult && (
                <div className={`mb-4 p-3 rounded-lg border text-sm ${
                  validationResult.type === 'success' 
                    ? 'bg-green-50 border-green-200 text-green-800'
                    : validationResult.type === 'error'
                    ? 'bg-red-50 border-red-200 text-red-800'
                    : 'bg-blue-50 border-blue-200 text-blue-800'
                }`}>
                  <div className="flex items-center gap-2">
                    {validationResult.type === 'success' && <CheckCircle className="h-4 w-4 flex-shrink-0" />}
                    {validationResult.type === 'error' && <AlertCircle className="h-4 w-4 flex-shrink-0" />}
                    {validationResult.type === 'info' && <FileText className="h-4 w-4 flex-shrink-0" />}
                    <span>{validationResult.message}</span>
                  </div>
                  {error && validationResult.type === 'error' && (
                    <div className="mt-2 text-xs">
                      <strong>Line {error.line}:</strong> {error.message.split('\n')[0]}
                    </div>
                  )}
                </div>
              )}

              {/* Controls */}
              <div className="flex flex-wrap gap-3 mb-6">
                <button
                  onClick={formatJson}
                  className="flex-1 bg-emerald-500 text-white py-2 px-4 rounded-lg hover:bg-emerald-600 transition-colors font-medium flex items-center justify-center gap-2 text-sm"
                >
                  <Expand className="h-4 w-4" />
                  Format JSON
                </button>
                
                <button
                  onClick={minifyJson}
                  className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center justify-center gap-2 text-sm"
                >
                  <Minus className="h-4 w-4" />
                  Minify JSON
                </button>
                
                <button
                  onClick={() => validateJson(true)}
                  className="flex-1 bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 transition-colors font-medium flex items-center justify-center gap-2 text-sm"
                >
                  <CheckCircle className="h-4 w-4" />
                  Validate
                </button>
              </div>

              {/* Indentation Settings */}
              <div className="flex items-center gap-4 mb-6">
                <label className="text-sm font-medium text-gray-700">Indentation:</label>
                <div className="flex gap-2">
                  {[2, 4].map((size) => (
                    <button
                      key={size}
                      onClick={() => setIndentation(size)}
                      className={`px-3 py-1 rounded text-sm ${
                        indentation === size
                          ? 'bg-emerald-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {size} spaces
                    </button>
                  ))}
                </div>
              </div>

              {/* File Actions */}
              <div className="flex gap-3 mb-6">
                <button
                  onClick={triggerFileInput}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 text-sm"
                >
                  <Upload className="h-4 w-4" />
                  Upload JSON File
                </button>
                
                <button
                  onClick={downloadJson}
                  disabled={!formattedJson}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download className="h-4 w-4" />
                  Download
                </button>
                
                <button
                  onClick={handleClear}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 text-sm"
                >
                  Clear
                </button>
              </div>

              {/* Input Section */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Input JSON
                  </label>
                  <div className="flex items-center gap-2">
                    {!isValid && error && (
                      <div className="flex items-center gap-1 text-red-600 text-xs">
                        <AlertCircle className="h-3 w-3" />
                        <span>Line {error.line}</span>
                      </div>
                    )}
                    {isValid && inputJson && (
                      <div className="flex items-center gap-1 text-green-600 text-xs">
                        <CheckCircle className="h-3 w-3" />
                        <span>Valid</span>
                      </div>
                    )}
                  </div>
                </div>
                <textarea
                  ref={textareaRef}
                  value={inputJson}
                  onChange={(e) => setInputJson(e.target.value)}
                  placeholder='Paste your JSON here... Example: {"name": "John", "age": 30}'
                  rows={8}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none font-mono text-sm ${
                    !isValid && inputJson
                      ? 'border-red-300 bg-red-50'
                      : 'border-gray-300'
                  }`}
                />
              </div>

              {/* Output Section */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Formatted JSON
                  </label>
                  <div className="flex items-center gap-2">
                    {formattedJson && (
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
                    value={formattedJson}
                    readOnly
                    placeholder="Formatted JSON will appear here..."
                    rows={8}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 resize-none font-mono text-sm"
                  />
                </div>
              </div>

              {/* Character Count */}
              <div className="flex justify-between text-xs text-gray-500">
                <span>Input: {inputJson.length} characters</span>
                <span>Output: {formattedJson.length} characters</span>
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
                  <span><strong>Client-Side Processing</strong> - All formatting happens in your browser</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Shield className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>No Data Stored</strong> - Your JSON data never leaves your device</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Code className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Syntax Validation</strong> - Real-time JSON validation and error detection</span>
                </li>
              </ul>
            </div>

            {/* Features */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-emerald-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-2">
                  <FileText className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Beautify JSON</strong> - Format with proper indentation</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Validate Syntax</strong> - Detect and highlight errors</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Copy className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Minify JSON</strong> - Remove whitespace for compact size</span>
                </div>
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Error Detection</strong> - Pinpoint syntax issues with line numbers</span>
                </div>
              </div>
            </div>

            {/* Use Cases */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-emerald-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Common Use Cases</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <h4 className="font-semibold text-blue-800 mb-1">👨‍💻 Development</h4>
                  <ul className="space-y-1 text-blue-700">
                    <li>• API response formatting</li>
                    <li>• Configuration file validation</li>
                    <li>• Debugging JSON data</li>
                  </ul>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <h4 className="font-semibold text-green-800 mb-1">📊 Data Analysis</h4>
                  <ul className="space-y-1 text-green-700">
                    <li>• Log file analysis</li>
                    <li>• Data visualization prep</li>
                    <li>• Database export formatting</li>
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
            {jsonFaqItems.map((faq, index) => (
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
            Free Online JSON Formatter & Validator
          </h2>
          
          <p className="text-gray-700 mb-4">
            JSON (JavaScript Object Notation) is the universal format for data exchange in web applications. 
            Our tool helps developers format, validate, and beautify JSON data with real-time syntax checking 
            and complete client-side processing for maximum security.
          </p>

          <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
            Why Format JSON?
          </h3>
          <p className="text-gray-700 mb-4">
            Properly formatted JSON is essential for readability, debugging, and maintenance. 
            Our formatter adds consistent indentation, line breaks, and syntax highlighting to make 
            your JSON data easy to read and understand.
          </p>

          <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
            JSON Validation Benefits
          </h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Detect syntax errors before they cause application failures</li>
            <li>Identify missing commas, quotes, or brackets</li>
            <li>Validate JSON structure against standards</li>
            <li>Prevent data corruption in production environments</li>
            <li>Speed up debugging with precise error locations</li>
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
            "mainEntity": jsonFaqItems.map(faq => ({
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

const jsonFaqItems = [
  {
    question: "Is my JSON data secure when using this tool?",
    answer: "Yes! All JSON processing happens entirely in your browser. We never send your data to our servers or store it anywhere. Your data remains completely private and secure."
  },
  {
    question: "What types of JSON errors can this tool detect?",
    answer: "The tool detects common JSON syntax errors including missing commas, unclosed brackets, trailing commas, incorrect quotes, and invalid character encoding. It provides detailed error messages with line numbers."
  },
  {
    question: "Can I format minified JSON?",
    answer: "Yes! The tool can beautify minified JSON by adding proper indentation and line breaks. It can also minify formatted JSON by removing unnecessary whitespace for production use."
  },
  {
    question: "Is there a limit to the JSON file size?",
    answer: "The tool can handle large JSON files, but very large files (10MB+) may impact browser performance. For optimal experience, we recommend files under 5MB. All processing happens client-side."
  },
  {
    question: "Does the tool support JSON with comments?",
    answer: "Standard JSON doesn't support comments, but our tool can handle some common comment formats. However, for strict JSON validation, comments will be flagged as syntax errors."
  },
  {
    question: "Can I use this tool for JSONP or JSON with functions?",
    answer: "This tool is designed for standard JSON data. JSONP (JSON with Padding) and JSON containing JavaScript functions may not format correctly as they're not valid JSON."
  }
];  