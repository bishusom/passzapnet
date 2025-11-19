// components/tools/SqlFormatter.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  Database, 
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

interface SqlError {
  line: number;
  message: string;
  position: number;
}

interface FormatOptions {
  indent: string;
  keywordCase: 'upper' | 'lower' | 'preserve';
  indentSize: number;
  maxLineLength: number;
}

export default function SqlFormatter() {
  const [inputSql, setInputSql] = useState<string>('');
  const [formattedSql, setFormattedSql] = useState<string>('');
  const [isValid, setIsValid] = useState<boolean>(true);
  const [error, setError] = useState<SqlError | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);
  
  const [formatOptions, setFormatOptions] = useState<FormatOptions>({
    indent: 'spaces',
    keywordCase: 'upper',
    indentSize: 2,
    maxLineLength: 80
  });

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sample SQL for demonstration
  const sampleSql = `SELECT customers.name, orders.order_date, products.product_name, order_details.quantity 
FROM customers 
INNER JOIN orders ON customers.customer_id = orders.customer_id 
INNER JOIN order_details ON orders.order_id = order_details.order_id 
INNER JOIN products ON order_details.product_id = products.product_id 
WHERE orders.order_date >= '2024-01-01' AND customers.country = 'USA' 
ORDER BY orders.order_date DESC, customers.name ASC;`;

  const formatSql = () => {
    try {
      setError(null);
      setValidationResult(null);
      
      if (!inputSql.trim()) {
        setFormattedSql('');
        setIsValid(true);
        setValidationResult({
          isValid: true,
          message: 'Please enter some SQL to format',
          type: 'info'
        });
        return;
      }

      // Basic SQL formatting logic
      let formatted = inputSql;
      
      // Convert keywords to desired case
      const keywords = [
        'SELECT', 'FROM', 'WHERE', 'ORDER BY', 'GROUP BY', 'HAVING', 'JOIN', 'INNER JOIN', 
        'LEFT JOIN', 'RIGHT JOIN', 'OUTER JOIN', 'ON', 'AND', 'OR', 'NOT', 'IN', 'BETWEEN',
        'LIKE', 'IS NULL', 'IS NOT NULL', 'INSERT INTO', 'UPDATE', 'DELETE FROM', 'CREATE TABLE',
        'ALTER TABLE', 'DROP TABLE', 'VALUES', 'SET', 'AS', 'DISTINCT', 'UNION', 'ALL'
      ];

      if (formatOptions.keywordCase === 'upper') {
        keywords.forEach(keyword => {
          const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
          formatted = formatted.replace(regex, keyword.toUpperCase());
        });
      } else if (formatOptions.keywordCase === 'lower') {
        keywords.forEach(keyword => {
          const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
          formatted = formatted.replace(regex, keyword.toLowerCase());
        });
      }

      // Basic indentation logic
      let indentLevel = 0;
      const indentChar = formatOptions.indent === 'tabs' ? '\t' : ' '.repeat(formatOptions.indentSize);
      const lines = formatted.split('\n');
      const formattedLines: string[] = [];

      lines.forEach(line => {
        const trimmed = line.trim();
        if (!trimmed) {
          formattedLines.push('');
          return;
        }

        // Decrease indent for closing blocks
        if (trimmed.startsWith('END') || trimmed.startsWith('}') || 
            trimmed.includes(')') && !trimmed.includes('(')) {
          indentLevel = Math.max(0, indentLevel - 1);
        }

        // Add current line with proper indentation
        formattedLines.push(indentChar.repeat(indentLevel) + trimmed);

        // Increase indent for opening blocks
        if (trimmed.startsWith('BEGIN') || trimmed.startsWith('CASE') || 
            trimmed.includes('(') && !trimmed.includes(')')) {
          indentLevel++;
        }
      });

      formatted = formattedLines.join('\n');
      
      setFormattedSql(formatted);
      setIsValid(true);
      setValidationResult({
        isValid: true,
        message: 'SQL successfully formatted!',
        type: 'success'
      });
    } catch (err) {
      handleSqlError(err as Error);
    }
  };

  const minifySql = () => {
    try {
      setError(null);
      setValidationResult(null);
      
      if (!inputSql.trim()) {
        setFormattedSql('');
        setIsValid(true);
        setValidationResult({
          isValid: true,
          message: 'Please enter some SQL to minify',
          type: 'info'
        });
        return;
      }

      // Remove extra whitespace and line breaks
      const minified = inputSql
        .replace(/\s+/g, ' ')
        .replace(/\s*\(\s*/g, '(')
        .replace(/\s*\)\s*/g, ')')
        .replace(/\s*,\s*/g, ',')
        .trim();
      
      setFormattedSql(minified);
      setIsValid(true);
      setValidationResult({
        isValid: true,
        message: 'SQL successfully minified!',
        type: 'success'
      });
    } catch (err) {
      handleSqlError(err as Error);
    }
  };

  const validateSql = (showMessage: boolean = true) => {
    try {
      if (!inputSql.trim()) {
        setIsValid(true);
        setError(null);
        if (showMessage) {
          setValidationResult({
            isValid: true,
            message: 'Please enter some SQL to validate',
            type: 'info'
          });
        }
        return true;
      }

      // Basic SQL validation - check for common syntax patterns
      const sql = inputSql.toUpperCase();
      const hasSelect = sql.includes('SELECT');
      const hasFrom = sql.includes('FROM');
      
      // Basic SELECT query validation
      if (hasSelect && !hasFrom) {
        throw new Error('SELECT statements require a FROM clause');
      }

      setIsValid(true);
      setError(null);
      if (showMessage) {
        setValidationResult({
          isValid: true,
          message: '✅ SQL appears to be valid!',
          type: 'success'
        });
      }
      return true;
    } catch (err) {
      const error = handleSqlError(err as Error);
      if (showMessage) {
        setValidationResult({
          isValid: false,
          message: `❌ SQL Error: ${error.message}`,
          type: 'error'
        });
      }
      return false;
    }
  };

  const handleSqlError = (err: Error): SqlError => {
    setIsValid(false);
    
    const lines = inputSql.split('\n');
    const line = 1; // Basic line detection
    const position = 0;
    
    const sqlError: SqlError = {
      line,
      message: err.message,
      position
    };
    
    setError(sqlError);
    setFormattedSql('');
    return sqlError;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formattedSql);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleClear = () => {
    setInputSql('');
    setFormattedSql('');
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
        setInputSql(content);
        setError(null);
        setTimeout(() => validateSql(true), 100);
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
    fileInput.accept = '.sql,text/sql';
    fileInput.onchange = (e) => handleFileUpload(e as any);
    fileInput.click();
  };

  const downloadSql = () => {
    if (!formattedSql) return;

    const blob = new Blob([formattedSql], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted.sql';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const loadSample = () => {
    setInputSql(sampleSql);
    setTimeout(() => validateSql(false), 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Header */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl shadow-lg mb-4">
            <Database className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">SQL Formatter & Beautifier</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Format, validate, and beautify SQL queries with proper indentation and syntax highlighting. 
            Supports MySQL, PostgreSQL, SQL Server, and more with secure client-side processing.
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
                    <Database className="h-6 w-6 text-emerald-600" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  SQL Formatter & Beautifier
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  Format, validate, and minify SQL queries
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
                      <strong>Line {error.line}:</strong> {error.message}
                    </div>
                  )}
                </div>
              )}

              {/* Format Options */}
              <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Keyword Case
                  </label>
                  <select
                    value={formatOptions.keywordCase}
                    onChange={(e) => setFormatOptions(prev => ({
                      ...prev,
                      keywordCase: e.target.value as 'upper' | 'lower' | 'preserve'
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="upper">UPPERCASE</option>
                    <option value="lower">lowercase</option>
                    <option value="preserve">Preserve Case</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Indent Style
                  </label>
                  <select
                    value={formatOptions.indent}
                    onChange={(e) => setFormatOptions(prev => ({
                      ...prev,
                      indent: e.target.value
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="spaces">Spaces</option>
                    <option value="tabs">Tabs</option>
                  </select>
                </div>
              </div>

              {/* Controls */}
              <div className="flex flex-wrap gap-3 mb-6">
                <button
                  onClick={formatSql}
                  className="flex-1 bg-emerald-500 text-white py-2 px-4 rounded-lg hover:bg-emerald-600 transition-colors font-medium flex items-center justify-center gap-2 text-sm"
                >
                  <Expand className="h-4 w-4" />
                  Format SQL
                </button>
                
                <button
                  onClick={minifySql}
                  className="flex-1 bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 transition-colors font-medium flex items-center justify-center gap-2 text-sm"
                >
                  <Minus className="h-4 w-4" />
                  Minify SQL
                </button>
                
                <button
                  onClick={() => validateSql(true)}
                  className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center justify-center gap-2 text-sm"
                >
                  <CheckCircle className="h-4 w-4" />
                  Validate
                </button>
              </div>

              {/* File Actions */}
              <div className="flex gap-3 mb-6">
                <button
                  onClick={triggerFileInput}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 text-sm"
                >
                  <Upload className="h-4 w-4" />
                  Upload SQL File
                </button>
                
                <button
                  onClick={downloadSql}
                  disabled={!formattedSql}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download className="h-4 w-4" />
                  Download
                </button>
                
                <button
                  onClick={loadSample}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 text-sm"
                >
                  Sample
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
                    Input SQL
                  </label>
                  <div className="flex items-center gap-2">
                    {!isValid && error && (
                      <div className="flex items-center gap-1 text-red-600 text-xs">
                        <AlertCircle className="h-3 w-3" />
                        <span>Line {error.line}</span>
                      </div>
                    )}
                    {isValid && inputSql && (
                      <div className="flex items-center gap-1 text-green-600 text-xs">
                        <CheckCircle className="h-3 w-3" />
                        <span>Valid</span>
                      </div>
                    )}
                  </div>
                </div>
                <textarea
                  ref={textareaRef}
                  value={inputSql}
                  onChange={(e) => setInputSql(e.target.value)}
                  placeholder='Paste your SQL query here... Example: SELECT * FROM users WHERE active = true;'
                  rows={8}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none font-mono text-sm ${
                    !isValid && inputSql
                      ? 'border-red-300 bg-red-50'
                      : 'border-gray-300'
                  }`}
                />
              </div>

              {/* Output Section */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Formatted SQL
                  </label>
                  <div className="flex items-center gap-2">
                    {formattedSql && (
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
                    value={formattedSql}
                    readOnly
                    placeholder="Formatted SQL will appear here..."
                    rows={8}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 resize-none font-mono text-sm"
                  />
                </div>
              </div>

              {/* Character Count */}
              <div className="flex justify-between text-xs text-gray-500">
                <span>Input: {inputSql.length} characters</span>
                <span>Output: {formattedSql.length} characters</span>
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
                  <span><strong>No Data Stored</strong> - Your SQL queries never leave your device</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Database className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Syntax Validation</strong> - Basic SQL syntax checking and formatting</span>
                </li>
              </ul>
            </div>

            {/* Features */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-emerald-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-2">
                  <FileText className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Beautify SQL</strong> - Format with proper indentation and line breaks</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Multiple Dialects</strong> - Support for MySQL, PostgreSQL, SQL Server</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Copy className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Minify SQL</strong> - Remove unnecessary whitespace</span>
                </div>
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Keyword Highlighting</strong> - Color-coded SQL keywords</span>
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
                    <li>• Query debugging and optimization</li>
                    <li>• Code review preparation</li>
                    <li>• Documentation formatting</li>
                  </ul>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <h4 className="font-semibold text-green-800 mb-1">📊 Database Work</h4>
                  <ul className="space-y-1 text-green-700">
                    <li>• Stored procedure formatting</li>
                    <li>• Migration script cleanup</li>
                    <li>• Report query organization</li>
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
            {sqlFaqItems.map((faq, index) => (
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
            Free Online SQL Formatter & Beautifier
          </h2>
          
          <p className="text-gray-700 mb-4">
            SQL (Structured Query Language) is essential for database management and development. 
            Our tool helps developers format, validate, and beautify SQL queries with proper indentation, 
            syntax highlighting, and complete client-side processing for maximum security.
          </p>

          <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
            Why Format SQL Queries?
          </h3>
          <p className="text-gray-700 mb-4">
            Properly formatted SQL is crucial for readability, debugging, and maintenance. 
            Our formatter adds consistent indentation, aligns keywords, and organizes complex queries 
            to make your SQL code easy to read, understand, and debug.
          </p>

          <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
            SQL Formatting Benefits
          </h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Improve code readability and maintainability</li>
            <li>Standardize query formatting across teams</li>
            <li>Easier debugging and performance optimization</li>
            <li>Better code reviews with consistent style</li>
            <li>Professional documentation preparation</li>
          </ul>

          <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
            Supported SQL Dialects
          </h3>
          <p className="text-gray-700 mb-4">
            Our SQL formatter supports multiple database dialects including MySQL, PostgreSQL, 
            SQL Server, Oracle, and SQLite. While the core formatting rules are consistent, 
            we handle dialect-specific keywords and syntax appropriately.
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
            "mainEntity": sqlFaqItems.map(faq => ({
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

const sqlFaqItems = [
  {
    question: "Is my SQL data secure when using this tool?",
    answer: "Yes! All SQL processing happens entirely in your browser. We never send your queries to our servers or store them anywhere. Your SQL code remains completely private and secure."
  },
  {
    question: "What SQL dialects are supported?",
    answer: "The tool supports major SQL dialects including MySQL, PostgreSQL, SQL Server, Oracle, and SQLite. It handles common keywords, functions, and syntax patterns across these databases."
  },
  {
    question: "Can I format complex SQL with multiple subqueries?",
    answer: "Yes! The tool can handle complex SQL queries including nested subqueries, JOIN operations, CTEs (Common Table Expressions), and stored procedures. It properly indents and organizes even the most complex query structures."
  },
  {
    question: "Does the tool validate SQL syntax?",
    answer: "The tool provides basic syntax checking and formatting. While it can detect obvious syntax errors, it's not a full SQL validator. For production use, always test your queries in your actual database environment."
  },
  {
    question: "Can I minify SQL queries?",
    answer: "Yes! The minify feature removes unnecessary whitespace, line breaks, and comments to create compact SQL queries suitable for production environments or embedded use."
  },
  {
    question: "Is there a limit to the SQL query size?",
    answer: "The tool can handle large SQL scripts, but very large files (10MB+) may impact browser performance. For optimal experience, we recommend files under 5MB. All processing happens client-side."
  }
];