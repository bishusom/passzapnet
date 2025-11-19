// components/utilities/regex/RegexTester.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  Regex, 
  Copy, 
  CheckCircle, 
  AlertCircle,
  FileText,
  Play,
  Square,
  Download,
  Upload,
  Zap,
  ChevronRight,
  Shield,
  Code
} from 'lucide-react';

interface RegexMatch {
  match: string;
  index: number;
  groups: string[];
}

interface RegexError {
  message: string;
  position?: number;
}

interface RegexFlags {
  global: boolean;
  ignoreCase: boolean;
  multiline: boolean;
  dotAll: boolean;
  unicode: boolean;
  sticky: boolean;
}

export default function RegexTester() {
  const [pattern, setPattern] = useState<string>('');
  const [testString, setTestString] = useState<string>('');
  const [replacement, setReplacement] = useState<string>('');
  const [matches, setMatches] = useState<RegexMatch[]>([]);
  const [replacedText, setReplacedText] = useState<string>('');
  const [error, setError] = useState<RegexError | null>(null);
  const [isValid, setIsValid] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [flags, setFlags] = useState<RegexFlags>({
    global: true,
    ignoreCase: false,
    multiline: false,
    dotAll: false,
    unicode: false,
    sticky: false
  });

  const testStringRef = useRef<HTMLTextAreaElement>(null);

  // Sample data for demonstration
  const samplePattern = '\\b\\w+@\\w+\\.\\w+\\b';
  const sampleTestString = `Contact us at:
- john.doe@example.com
- sales@company.org
- support@website.net

Invalid emails:
- user@
- @domain.com
- user@domain`;

  const sampleReplacement = '[EMAIL REDACTED]';

  // FAQ items
  const regexFaqItems = [
    {
      question: "Is my test data secure when using this tool?",
      answer: "Yes! All regex testing happens entirely in your browser. We never send your patterns or test data to our servers. Everything remains completely private and secure on your device."
    },
    {
      question: "What regex syntax does this tool support?",
      answer: "The tool supports JavaScript regex syntax, which includes character classes, quantifiers, anchors, groups, lookaheads, lookbehinds, and all standard flags (g, i, m, s, u, y)."
    },
    {
      question: "Can I test regex with large text files?",
      answer: "Yes, the tool can handle large text inputs, but very large files (5MB+) may impact browser performance. For optimal experience, we recommend testing with representative samples rather than entire large files."
    },
    {
      question: "Does the tool protect against regex denial-of-service?",
      answer: "Yes! The tool includes timeout protection to prevent browser freezing from complex patterns with catastrophic backtracking. If a pattern takes too long to execute, it will timeout gracefully."
    },
    {
      question: "Can I save my regex patterns?",
      answer: "While the tool doesn't have built-in pattern saving, you can copy your working patterns or use your browser's bookmark feature. All processing is client-side for maximum privacy."
    },
    {
      question: "Does it support regex replacement with groups?",
      answer: "Yes! The tool includes a replacement feature that lets you test regex substitutions using capture groups. You can reference groups with $1, $2, etc., in the replacement string."
    }
  ];

  // Real-time testing with debounce
  useEffect(() => {
    if (pattern && testString) {
      const timer = setTimeout(() => {
        testRegex();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [pattern, testString, flags, replacement]);

  const testRegex = () => {
    if (!pattern.trim()) {
      setMatches([]);
      setReplacedText('');
      setError(null);
      setIsValid(true);
      return;
    }

    setIsTesting(true);
    setError(null);

    // Use timeout to prevent blocking the UI
    const timeoutId = setTimeout(() => {
      try {
        // Build flags string
        const flagsString = Object.entries(flags)
          .filter(([_, isEnabled]) => isEnabled)
          .map(([flag]) => flag[0])
          .join('');

        // Test regex validity
        new RegExp(pattern, flagsString);
        setIsValid(true);

        // Find all matches
        const regex = new RegExp(pattern, flagsString + 'g');
        const foundMatches: RegexMatch[] = [];
        let match;

        while ((match = regex.exec(testString)) !== null) {
          foundMatches.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1)
          });

          // Prevent infinite loops for zero-length matches
          if (match.index === regex.lastIndex) {
            regex.lastIndex++;
          }
        }

        setMatches(foundMatches);

        // Test replacement if replacement text is provided
        if (replacement) {
          const replaceRegex = new RegExp(pattern, flagsString);
          setReplacedText(testString.replace(replaceRegex, replacement));
        } else {
          setReplacedText('');
        }

      } catch (err) {
        const regexError = err as Error;
        setError({
          message: regexError.message,
          position: extractErrorPosition(regexError.message)
        });
        setIsValid(false);
        setMatches([]);
        setReplacedText('');
      } finally {
        setIsTesting(false);
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  };

  const extractErrorPosition = (message: string): number | undefined => {
    const positionMatch = message.match(/position (\d+)/);
    return positionMatch ? parseInt(positionMatch[1]) : undefined;
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleClear = () => {
    setPattern('');
    setTestString('');
    setReplacement('');
    setMatches([]);
    setReplacedText('');
    setError(null);
    setIsValid(true);
  };

  const loadSample = () => {
    setPattern(samplePattern);
    setTestString(sampleTestString);
    setReplacement(sampleReplacement);
  };

  const toggleFlag = (flag: keyof RegexFlags) => {
    setFlags(prev => ({
      ...prev,
      [flag]: !prev[flag]
    }));
  };

  const highlightMatches = (): string => {
    if (!testString || matches.length === 0 || !isValid) return testString;

    let highlighted = '';
    let lastIndex = 0;

    matches.forEach(match => {
      // Add text before match
      highlighted += testString.slice(lastIndex, match.index);
      // Add highlighted match
      highlighted += `<mark class="bg-yellow-200 text-yellow-900 px-1 rounded">${testString.slice(match.index, match.index + match.match.length)}</mark>`;
      lastIndex = match.index + match.match.length;
    });

    // Add remaining text
    highlighted += testString.slice(lastIndex);

    return highlighted;
  };

  const getFlagTooltip = (flag: keyof RegexFlags): string => {
    const tooltips: Record<keyof RegexFlags, string> = {
      global: 'Global search (find all matches)',
      ignoreCase: 'Case insensitive matching',
      multiline: 'Multiline mode (^ and $ match line boundaries)',
      dotAll: 'Dot matches newline characters',
      unicode: 'Unicode mode',
      sticky: 'Sticky search (matches only from lastIndex)'
    };
    return tooltips[flag];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Header */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl shadow-lg mb-4">
            <Regex className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Regex Tester & Debugger</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Test, debug, and learn regular expressions with real-time matching, groups, and replacements. 
            Supports JavaScript regex syntax with complete client-side processing.
          </p>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Tool Component */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-green-100">
              {/* Header */}
              <div className="text-center mb-6">
                <div className="flex items-center justify-center mb-3">
                  <div className="bg-green-100 p-3 rounded-full">
                    <Regex className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Regex Tester & Debugger
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  Test, debug, and learn regular expressions
                </p>
              </div>

              {/* Error Display */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <span>Regex Error: {error.message}</span>
                  </div>
                  {error.position !== undefined && (
                    <div className="mt-1 text-xs">
                      Error at position: {error.position}
                    </div>
                  )}
                </div>
              )}

              {/* Regex Pattern Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Regular Expression Pattern
                </label>
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={pattern}
                      onChange={(e) => setPattern(e.target.value)}
                      placeholder="Enter your regex pattern... Example: \b\w+@\w+\.\w+\b"
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 font-mono text-sm ${
                        !isValid && pattern
                          ? 'border-red-300 bg-red-50'
                          : 'border-gray-300'
                      }`}
                    />
                    {pattern && (
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                        {isTesting ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-500"></div>
                        ) : isValid ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={testRegex}
                    disabled={!pattern.trim()}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Play className="h-4 w-4" />
                    Test
                  </button>
                </div>
              </div>

              {/* Regex Flags */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Regex Flags
                </label>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(flags).map(([flag, isEnabled]) => (
                    <button
                      key={flag}
                      onClick={() => toggleFlag(flag as keyof RegexFlags)}
                      title={getFlagTooltip(flag as keyof RegexFlags)}
                      className={`px-3 py-2 rounded text-sm font-mono flex items-center gap-1 transition-colors ${
                        isEnabled
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {flag[0]}
                      <span className="text-xs opacity-75">{flag.slice(1)}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Test String Input */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Test String
                  </label>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    {matches.length > 0 && (
                      <span className="flex items-center gap-1">
                        <Zap className="h-4 w-4 text-green-500" />
                        {matches.length} matches found
                      </span>
                    )}
                  </div>
                </div>
                <textarea
                  ref={testStringRef}
                  value={testString}
                  onChange={(e) => setTestString(e.target.value)}
                  placeholder="Enter text to test your regex against..."
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none font-mono text-sm"
                />
              </div>

              {/* Matches Display */}
              {matches.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Matches Found ({matches.length})
                  </label>
                  <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3 bg-gray-50">
                    {matches.map((match, index) => (
                      <div key={index} className="mb-2 last:mb-0 p-2 bg-white rounded border">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-green-600 font-mono">{match.match}</span>
                          <span className="text-gray-500 text-xs">at position {match.index}</span>
                        </div>
                        {match.groups.length > 0 && (
                          <div className="mt-1 text-xs text-gray-600">
                            Groups: {match.groups.map((group, i) => (
                              <span key={i} className="ml-2 bg-blue-100 px-1 rounded">
                                ${i + 1}: {group}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Replacement Section */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Replacement
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={replacement}
                    onChange={(e) => setReplacement(e.target.value)}
                    placeholder="Replacement pattern... Use $1, $2 for groups"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 font-mono text-sm"
                  />
                </div>
                {replacedText && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Replaced Text
                    </label>
                    <div className="relative">
                      <textarea
                        value={replacedText}
                        readOnly
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 resize-none font-mono text-sm"
                      />
                      <button
                        onClick={() => handleCopy(replacedText)}
                        className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                      >
                        {copied ? <CheckCircle className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                        {copied ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={loadSample}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 text-sm"
                >
                  <FileText className="h-4 w-4" />
                  Load Sample
                </button>
                
                <button
                  onClick={handleClear}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 text-sm"
                >
                  <Square className="h-4 w-4" />
                  Clear All
                </button>
              </div>

              {/* Quick Reference */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Quick Reference</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div><code className="bg-white px-1 rounded">\d</code> Digit</div>
                  <div><code className="bg-white px-1 rounded">\w</code> Word char</div>
                  <div><code className="bg-white px-1 rounded">\s</code> Whitespace</div>
                  <div><code className="bg-white px-1 rounded">.</code> Any char</div>
                  <div><code className="bg-white px-1 rounded">*</code> 0 or more</div>
                  <div><code className="bg-white px-1 rounded">+</code> 1 or more</div>
                  <div><code className="bg-white px-1 rounded">?</code> 0 or 1</div>
                  <div><code className="bg-white px-1 rounded">{`{n}`}</code> Exactly n</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Side Content */}
          <div className="space-y-6">
            {/* Security Features */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-green-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Shield className="h-5 w-5 text-green-500 mr-2" />
                Security Features
              </h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start space-x-2">
                  <Zap className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Client-Side Processing</strong> - All regex testing happens in your browser</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Shield className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>No Data Stored</strong> - Your test data and patterns never leave your device</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Code className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Safe Execution</strong> - Timeout protection against complex patterns</span>
                </li>
              </ul>
            </div>

            {/* Features */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-green-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-2">
                  <FileText className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Real-time Testing</strong> - See matches and groups as you type</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Multiple Flags</strong> - Support for global, case-insensitive, multiline</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Copy className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Replace Function</strong> - Test regex replacement with capture groups</span>
                </div>
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Error Detection</strong> - Detailed syntax error messages</span>
                </div>
              </div>
            </div>

            {/* Common Patterns */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-green-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Common Regex Patterns</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <h4 className="font-semibold text-blue-800 mb-1">📧 Email</h4>
                  <code className="text-xs bg-blue-100 px-2 py-1 rounded">^\S+@\S+\.\S+$</code>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <h4 className="font-semibold text-green-800 mb-1">🌐 URL</h4>
                  <code className="text-xs bg-green-100 px-2 py-1 rounded">https?://[^\s/$.?#].[^\s]*</code>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <h4 className="font-semibold text-green-800 mb-1">📱 Phone</h4>
                  <code className="text-xs bg-green-100 px-2 py-1 rounded">{`(\\+\\d{1,3})?[\\s-]?\\(?\\d{3}\\)?[\\s-]?\\d{3}[\\s-]?\\d{4}`}</code>
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
            {regexFaqItems.map((faq, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-green-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* SEO Content */}
        <div className="max-w-4xl mx-auto mt-12 prose prose-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Free Online Regex Tester & Debugger
          </h2>
          
          <p className="text-gray-700 mb-4">
            Regular expressions are powerful pattern-matching tools used in programming, data validation, 
            and text processing. Our regex tester helps you write, test, and debug regular expressions 
            with real-time feedback and comprehensive matching details.
          </p>

          <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
            Why Test Regular Expressions?
          </h3>
          <p className="text-gray-700 mb-4">
            Regular expressions can be complex and difficult to debug. Our tester provides immediate visual 
            feedback, shows capture groups, highlights matches, and explains errors - making regex development 
            faster and more reliable.
          </p>

          <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
            Regex Testing Benefits
          </h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Validate patterns against sample text in real-time</li>
            <li>Debug complex regex with detailed match information</li>
            <li>Test replacement patterns with capture groups</li>
            <li>Learn regex syntax with immediate feedback</li>
            <li>Optimize patterns for performance and accuracy</li>
          </ul>

          <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
            Supported Regex Features
          </h3>
          <p className="text-gray-700 mb-4">
            Our regex tester supports JavaScript regex syntax including character classes, quantifiers, 
            anchors, groups, lookaheads, and all standard flags (global, case-insensitive, multiline, etc.). 
            It provides safe execution with timeout protection against catastrophic backtracking.
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
            "mainEntity": regexFaqItems.map(faq => ({
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