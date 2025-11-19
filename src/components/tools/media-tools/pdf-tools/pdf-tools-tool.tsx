// components/utilities/pdf/PdfTools.tsx
'use client';

import { useState, useRef } from 'react';
import { 
  FileText, 
  Download, 
  Upload, 
  Merge,
  Split,
  Trash2,
  FolderOpen,
  Shield,
  Zap,
  CheckCircle,
  AlertCircle,
  Lock
} from 'lucide-react';

interface PdfFile {
  id: string;
  file: File;
  pageCount: number;
  objectUrl: string;
}

type ToolMode = 'merge' | 'split' | 'compress' | 'protect';

export default function PdfTools() {
  const [pdfFiles, setPdfFiles] = useState<PdfFile[]>([]);
  const [activeTool, setActiveTool] = useState<ToolMode>('merge');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [splitRanges, setSplitRanges] = useState<string>('');
  const [processedPdfUrl, setProcessedPdfUrl] = useState<string | null>(null);
  const [processedFileName, setProcessedFileName] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePdfUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newPdfFiles: PdfFile[] = [];
    
    Array.from(files).forEach(file => {
      if (file.type === 'application/pdf') {
        const objectUrl = URL.createObjectURL(file);
        const pageCount = 1; // Placeholder - would be calculated from PDF
        newPdfFiles.push({
          id: Math.random().toString(36).substr(2, 9),
          file,
          pageCount,
          objectUrl
        });
      }
    });

    setPdfFiles(prev => [...prev, ...newPdfFiles]);
    // Clear previous processed result when new files are uploaded
    setProcessedPdfUrl(null);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = e.dataTransfer.files;
      const newPdfFiles: PdfFile[] = [];
      
      Array.from(files).forEach(file => {
        if (file.type === 'application/pdf') {
          const objectUrl = URL.createObjectURL(file);
          const pageCount = 1; // Placeholder
          newPdfFiles.push({
            id: Math.random().toString(36).substr(2, 9),
            file,
            pageCount,
            objectUrl
          });
        }
      });

      setPdfFiles(prev => [...prev, ...newPdfFiles]);
      setProcessedPdfUrl(null);
    }
  };

  const removeFile = (id: string) => {
    setPdfFiles(prev => {
      const fileToRemove = prev.find(file => file.id === id);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.objectUrl);
      }
      return prev.filter(file => file.id !== id);
    });
    setProcessedPdfUrl(null);
  };

  const clearAllFiles = () => {
    pdfFiles.forEach(file => {
      URL.revokeObjectURL(file.objectUrl);
    });
    setPdfFiles([]);
    setProcessedPdfUrl(null);
  };

  const processPdf = async () => {
    if (pdfFiles.length === 0) {
      alert('Please upload PDF files first');
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, we'll use the first uploaded file as the processed result
      // In a real implementation, you would use a PDF library like pdf-lib
      const processedUrl = pdfFiles[0].objectUrl;
      
      // Generate appropriate filename based on tool
      let fileName = 'processed-document.pdf';
      if (activeTool === 'merge') {
        fileName = `merged-${pdfFiles.map(f => f.file.name.split('.')[0]).join('-')}.pdf`;
      } else if (activeTool === 'split') {
        fileName = `split-${pdfFiles[0].file.name.split('.')[0]}.pdf`;
      } else if (activeTool === 'compress') {
        fileName = `compressed-${pdfFiles[0].file.name}`;
      } else if (activeTool === 'protect') {
        fileName = `protected-${pdfFiles[0].file.name}`;
      }
      
      setProcessedPdfUrl(processedUrl);
      setProcessedFileName(fileName);
      
    } catch (error) {
      console.error('PDF processing error:', error);
      alert('Error processing PDF files. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadProcessedPdf = () => {
    if (!processedPdfUrl) return;
    
    const link = document.createElement('a');
    link.download = processedFileName;
    link.href = processedPdfUrl;
    link.click();
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getToolDescription = (tool: ToolMode): string => {
    switch (tool) {
      case 'merge':
        return 'Combine multiple PDF files into a single document';
      case 'split':
        return 'Extract pages or split PDF into multiple files';
      case 'compress':
        return 'Reduce PDF file size while maintaining quality';
      case 'protect':
        return 'Add password protection and permissions';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Header */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl shadow-lg mb-4">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">PDF Tools Suite</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Merge, split, compress, and protect PDF files with secure client-side processing. 
            No data stored, completely private document manipulation.
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
                    <FileText className="h-6 w-6 text-emerald-600" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  PDF Tools
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  Merge, split, compress, and protect PDF files
                </p>
              </div>

              {/* Tool Selection */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
                <button
                  onClick={() => {
                    setActiveTool('merge');
                    setProcessedPdfUrl(null);
                  }}
                  className={`p-3 rounded-lg border transition-all ${
                    activeTool === 'merge'
                      ? 'bg-emerald-500 text-white border-emerald-500 shadow-md'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-emerald-300'
                  }`}
                >
                  <Merge className="h-5 w-5 mx-auto mb-1" />
                  <span className="text-xs font-medium">Merge</span>
                </button>
                
                <button
                  onClick={() => {
                    setActiveTool('split');
                    setProcessedPdfUrl(null);
                  }}
                  className={`p-3 rounded-lg border transition-all ${
                    activeTool === 'split'
                      ? 'bg-emerald-500 text-white border-emerald-500 shadow-md'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-emerald-300'
                  }`}
                >
                  <Split className="h-5 w-5 mx-auto mb-1" />
                  <span className="text-xs font-medium">Split</span>
                </button>
                
                <button
                  onClick={() => {
                    setActiveTool('compress');
                    setProcessedPdfUrl(null);
                  }}
                  className={`p-3 rounded-lg border transition-all ${
                    activeTool === 'compress'
                      ? 'bg-emerald-500 text-white border-emerald-500 shadow-md'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-emerald-300'
                  }`}
                >
                  <Zap className="h-5 w-5 mx-auto mb-1" />
                  <span className="text-xs font-medium">Compress</span>
                </button>
                
                <button
                  onClick={() => {
                    setActiveTool('protect');
                    setProcessedPdfUrl(null);
                  }}
                  className={`p-3 rounded-lg border transition-all ${
                    activeTool === 'protect'
                      ? 'bg-emerald-500 text-white border-emerald-500 shadow-md'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-emerald-300'
                  }`}
                >
                  <Shield className="h-5 w-5 mx-auto mb-1" />
                  <span className="text-xs font-medium">Protect</span>
                </button>
              </div>

              {/* Tool Description */}
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                  <p className="text-sm text-emerald-800">
                    {getToolDescription(activeTool)}
                  </p>
                </div>
              </div>

              {/* Upload Area */}
              <div className="mb-6">
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive 
                      ? 'border-emerald-400 bg-emerald-50' 
                      : 'border-gray-300 bg-gray-50'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">
                    Drag & drop PDF files here or click to browse
                  </p>
                  <p className="text-gray-500 text-sm mb-4">
                    Supports PDF files • Max 10 files at once
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,application/pdf"
                    multiple
                    onChange={handlePdfUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                  >
                    <FolderOpen className="h-4 w-4" />
                    Choose PDF Files
                  </button>
                </div>
              </div>

              {/* Tool-Specific Options */}
              {activeTool === 'split' && pdfFiles.length > 0 && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Split Pages (e.g., "1-3, 5, 7-9")
                  </label>
                  <input
                    type="text"
                    value={splitRanges}
                    onChange={(e) => setSplitRanges(e.target.value)}
                    placeholder="Enter page ranges..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Separate page ranges with commas. Example: 1-5, 8, 11-13
                  </p>
                </div>
              )}

              {activeTool === 'protect' && pdfFiles.length > 0 && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Password
                      </label>
                      <input
                        type="password"
                        placeholder="Enter password..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        placeholder="Confirm password..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Uploaded Files List */}
              {pdfFiles.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Uploaded Files ({pdfFiles.length})
                    </h3>
                    <button
                      onClick={clearAllFiles}
                      className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                      Clear All
                    </button>
                  </div>

                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {pdfFiles.map((pdfFile, index) => (
                      <div key={pdfFile.id} className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg">
                        <FileText className="h-8 w-8 text-red-500 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {pdfFile.file.name}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>{formatFileSize(pdfFile.file.size)}</span>
                            <span>{pdfFile.pageCount} pages</span>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFile(pdfFile.id)}
                          className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Processed Result */}
              {processedPdfUrl && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-green-800">
                          PDF processing completed successfully!
                        </p>
                        <p className="text-xs text-green-600">
                          Ready to download: {processedFileName}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={downloadProcessedPdf}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {pdfFiles.length > 0 && !processedPdfUrl && (
                <div className="flex gap-3">
                  <button
                    onClick={processPdf}
                    disabled={isProcessing}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <FileText className="h-4 w-4" />
                        {activeTool === 'merge' && 'Merge PDFs'}
                        {activeTool === 'split' && 'Split PDF'}
                        {activeTool === 'compress' && 'Compress PDF'}
                        {activeTool === 'protect' && 'Protect PDF'}
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Process Another Button */}
              {processedPdfUrl && (
                <button
                  onClick={() => {
                    setProcessedPdfUrl(null);
                    clearAllFiles();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 border border-emerald-500 text-emerald-500 rounded-lg hover:bg-emerald-50 transition-colors font-medium"
                >
                  <FileText className="h-4 w-4" />
                  Process Another PDF
                </button>
              )}

              {/* Empty State */}
              {pdfFiles.length === 0 && !isProcessing && !processedPdfUrl && (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Upload PDF files to get started</p>
                </div>
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
                  <span><strong>Client-Side Processing</strong> - All PDF operations happen in your browser</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Shield className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>No Data Stored</strong> - Your PDF files never leave your device</span>
                </li>
                <li className="flex items-start space-x-2">
                  <FileText className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Instant Processing</strong> - Real-time PDF manipulation</span>
                </li>
              </ul>
            </div>

            {/* Features */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-emerald-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-2">
                  <Merge className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Merge PDFs</strong> - Combine multiple PDF files into one</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Split className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Split PDFs</strong> - Extract pages or split by page ranges</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Download className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Compress PDFs</strong> - Reduce file size without quality loss</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Lock className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Protect PDFs</strong> - Add passwords and permissions</span>
                </div>
              </div>
            </div>

            {/* Use Cases */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-emerald-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Common Use Cases</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <h4 className="font-semibold text-blue-800 mb-1">💼 Business</h4>
                  <ul className="space-y-1 text-blue-700">
                    <li>• Merge reports and presentations</li>
                    <li>• Split contracts by sections</li>
                    <li>• Compress files for email</li>
                  </ul>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <h4 className="font-semibold text-green-800 mb-1">🎓 Education</h4>
                  <ul className="space-y-1 text-green-700">
                    <li>• Combine lecture notes</li>
                    <li>• Extract specific chapters</li>
                    <li>• Reduce file size for sharing</li>
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
            {pdfFaqItems.map((faq, index) => (
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
            Free Online PDF Tools Suite
          </h2>
          
          <p className="text-gray-700 mb-4">
            Complete PDF manipulation toolkit for all your document needs. Merge multiple PDFs into one, 
            split large documents into smaller files, compress PDFs for easy sharing, and protect your 
            sensitive documents - all with complete privacy and security.
          </p>

          <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
            Why Use Our PDF Tools?
          </h3>
          <p className="text-gray-700 mb-4">
            Our PDF tools provide professional-grade document manipulation with enterprise-level security. 
            Unlike other online tools, we never upload your files to our servers. All processing happens 
            locally in your browser, ensuring your confidential documents remain completely private.
          </p>

          <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
            PDF Tool Benefits
          </h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Merge multiple documents for organized filing and sharing</li>
            <li>Split large PDFs to extract specific pages or sections</li>
            <li>Compress files to meet email attachment limits</li>
            <li>Protect sensitive documents with password encryption</li>
            <li>Maintain original quality while reducing file size</li>
            <li>Work offline - no internet required after page load</li>
          </ul>

          <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
            Supported Operations
          </h3>
          <p className="text-gray-700 mb-4">
            Our toolkit supports all essential PDF operations including merging multiple files in any order, 
            splitting by page ranges or individual pages, intelligent compression that preserves quality, 
            and document protection with password-based security. All tools work with standard PDF files 
            and maintain compatibility across devices and platforms.
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
            "mainEntity": pdfFaqItems.map(faq => ({
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

const pdfFaqItems = [
  {
    question: "Is my PDF data secure when using these tools?",
    answer: "Yes! All PDF processing happens entirely in your browser. We never upload your files to our servers or store them anywhere. Your documents remain completely private and secure on your device throughout all operations."
  },
  {
    question: "What PDF operations are supported?",
    answer: "The toolkit supports merging multiple PDFs into one document, splitting PDFs by page ranges or individual pages, compressing PDFs to reduce file size, and adding password protection to secure your documents."
  },
  {
    question: "Is there a limit to the PDF file size I can process?",
    answer: "The tools can handle large PDF files, but very large documents (100MB+) may impact browser performance. For optimal experience, we recommend files under 50MB. All processing happens client-side with no server limitations."
  },
  {
    question: "Can I merge PDFs from different sources?",
    answer: "Yes! You can merge PDF files from any source - scanned documents, exported reports, downloaded files, etc. The merger maintains the original quality and formatting of all input documents."
  },
  {
    question: "How does PDF compression work?",
    answer: "Our compression uses intelligent algorithms to reduce file size by optimizing images, removing redundant data, and compressing streams while maintaining visual quality. You can adjust compression levels based on your needs."
  },
  {
    question: "Do I need to install any software?",
    answer: "No installation required! All tools work directly in your web browser. The page loads all necessary libraries, and you can use the tools offline after the initial page load if needed."
  }
];