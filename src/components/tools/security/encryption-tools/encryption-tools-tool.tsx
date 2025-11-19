// components/tools/EncryptionTools.tsx
'use client';

import { useState } from 'react';
import { Lock, Unlock, Copy, CheckCircle, Shield, Zap, FileText } from 'lucide-react';

type EncryptionAlgorithm = 'caesar' | 'base64' | 'reverse';

interface EncryptionToolsProps {
  compact?: boolean;
}

export default function EncryptionTools({ compact = false }: EncryptionToolsProps) {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [algorithm, setAlgorithm] = useState<EncryptionAlgorithm>('base64');
  const [isEncrypting, setIsEncrypting] = useState(true);
  const [copied, setCopied] = useState(false);
  const [caesarShift, setCaesarShift] = useState(3);

  // Caesar Cipher
  const caesarCipher = (text: string, shift: number, encrypt: boolean): string => {
    const actualShift = encrypt ? shift : -shift;
    return text.replace(/[a-zA-Z]/g, (char) => {
      const base = char <= 'Z' ? 65 : 97;
      return String.fromCharCode(
        ((char.charCodeAt(0) - base + actualShift + 26) % 26) + base
      );
    });
  };

  // Base64 encoding/decoding
  const base64Transform = (text: string, encrypt: boolean): string => {
    try {
      if (encrypt) {
        return btoa(unescape(encodeURIComponent(text)));
      } else {
        return decodeURIComponent(escape(atob(text)));
      }
    } catch (error) {
      return 'Invalid input for Base64 operation';
    }
  };

  // Reverse text
  const reverseText = (text: string, encrypt: boolean): string => {
    return text.split('').reverse().join('');
  };

  const processText = () => {
    if (!inputText.trim()) {
      setOutputText('');
      return;
    }

    let result = '';
    
    switch (algorithm) {
      case 'caesar':
        result = caesarCipher(inputText, caesarShift, isEncrypting);
        break;
      case 'base64':
        result = base64Transform(inputText, isEncrypting);
        break;
      case 'reverse':
        result = reverseText(inputText, isEncrypting);
        break;
      default:
        result = 'Unknown algorithm';
    }
    
    setOutputText(result);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(outputText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const clearAll = () => {
    setInputText('');
    setOutputText('');
  };

  const swapTexts = () => {
    setInputText(outputText);
    setOutputText(inputText);
    setIsEncrypting(!isEncrypting);
  };

  // If compact mode, just return the tool UI without side content
  if (compact) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-emerald-100">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-3">
            <div className="bg-emerald-100 p-3 rounded-full">
              <Shield className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            Encryption Tools
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            Encrypt and decrypt text using various algorithms
          </p>
        </div>

        {/* Algorithm Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Encryption Algorithm:
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: 'base64', label: 'Base64' },
              { value: 'caesar', label: 'Caesar' },
              { value: 'reverse', label: 'Reverse' }
            ].map((algo) => (
              <button
                key={algo.value}
                onClick={() => setAlgorithm(algo.value as EncryptionAlgorithm)}
                className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                  algorithm === algo.value
                    ? 'bg-emerald-500 text-white border-emerald-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {algo.label}
              </button>
            ))}
          </div>
        </div>

        {/* Caesar Shift Input */}
        {algorithm === 'caesar' && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Shift Amount: {caesarShift}
            </label>
            <input
              type="range"
              min="1"
              max="25"
              value={caesarShift}
              onChange={(e) => setCaesarShift(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-emerald"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1</span>
              <span>13</span>
              <span>25</span>
            </div>
          </div>
        )}

        {/* Mode Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Operation:
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setIsEncrypting(true)}
              className={`p-3 rounded-lg border text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                isEncrypting
                  ? 'bg-emerald-500 text-white border-emerald-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Lock className="h-4 w-4" />
              Encrypt
            </button>
            <button
              onClick={() => setIsEncrypting(false)}
              className={`p-3 rounded-lg border text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                !isEncrypting
                  ? 'bg-emerald-500 text-white border-emerald-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Unlock className="h-4 w-4" />
              Decrypt
            </button>
          </div>
        </div>

        {/* Input Text Area */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Input Text:
          </label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Enter text to ${isEncrypting ? 'encrypt' : 'decrypt'}...`}
            className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            rows={4}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={processText}
            disabled={!inputText.trim()}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isEncrypting ? <Lock className="h-5 w-5" /> : <Unlock className="h-5 w-5" />}
            {isEncrypting ? 'Encrypt' : 'Decrypt'} Text
          </button>
          
          <button
            onClick={swapTexts}
            disabled={!inputText && !outputText}
            className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            title="Swap input and output"
          >
            ⇄
          </button>
        </div>

        {/* Output Text Area */}
        {outputText && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Output Text:
            </label>
            <div className="relative">
              <textarea
                value={outputText}
                readOnly
                className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 resize-none"
                rows={4}
              />
              <button
                onClick={copyToClipboard}
                className="absolute top-3 right-3 p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                title="Copy to clipboard"
              >
                {copied ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4 text-gray-600" />
                )}
              </button>
            </div>
          </div>
        )}

        {/* Clear Button */}
        <div className="flex gap-3">
          <button
            onClick={clearAll}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
          >
            Clear All
          </button>
        </div>

        {/* Info Section */}
        <div className="mt-6 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-emerald-500 mt-0.5" />
            <div>
              <h4 className="font-medium text-emerald-800 mb-1">About Encryption Algorithms</h4>
              <ul className="text-sm text-emerald-700 space-y-1">
                <li><strong>Base64:</strong> Encoding scheme for binary data - not secure encryption</li>
                <li><strong>Caesar Cipher:</strong> Simple substitution cipher - educational purposes only</li>
                <li><strong>Reverse:</strong> Basic text reversal - not secure</li>
              </ul>
              <p className="text-xs text-emerald-600 mt-2">
                <strong>Note:</strong> These are basic algorithms for demonstration. Use proper encryption for sensitive data.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // FULL PAGE LAYOUT with side content and FAQ
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Header */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl shadow-lg mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Encryption Tools</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Encrypt and decrypt text using various algorithms with secure client-side processing. 
            All operations happen locally in your browser for maximum privacy.
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
                    <Shield className="h-6 w-6 text-emerald-600" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Encryption Tools
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  Encrypt and decrypt text using various algorithms
                </p>
              </div>

              {/* Algorithm Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Encryption Algorithm:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'base64', label: 'Base64' },
                    { value: 'caesar', label: 'Caesar' },
                    { value: 'reverse', label: 'Reverse' }
                  ].map((algo) => (
                    <button
                      key={algo.value}
                      onClick={() => setAlgorithm(algo.value as EncryptionAlgorithm)}
                      className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                        algorithm === algo.value
                          ? 'bg-emerald-500 text-white border-emerald-500'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {algo.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Caesar Shift Input */}
              {algorithm === 'caesar' && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Shift Amount: {caesarShift}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="25"
                    value={caesarShift}
                    onChange={(e) => setCaesarShift(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-emerald"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>1</span>
                    <span>13</span>
                    <span>25</span>
                  </div>
                </div>
              )}

              {/* Mode Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Operation:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setIsEncrypting(true)}
                    className={`p-3 rounded-lg border text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                      isEncrypting
                        ? 'bg-emerald-500 text-white border-emerald-500'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <Lock className="h-4 w-4" />
                    Encrypt
                  </button>
                  <button
                    onClick={() => setIsEncrypting(false)}
                    className={`p-3 rounded-lg border text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                      !isEncrypting
                        ? 'bg-emerald-500 text-white border-emerald-500'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <Unlock className="h-4 w-4" />
                    Decrypt
                  </button>
                </div>
              </div>

              {/* Input Text Area */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Input Text:
                </label>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={`Enter text to ${isEncrypting ? 'encrypt' : 'decrypt'}...`}
                  className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                  rows={4}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mb-6">
                <button
                  onClick={processText}
                  disabled={!inputText.trim()}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isEncrypting ? <Lock className="h-5 w-5" /> : <Unlock className="h-5 w-5" />}
                  {isEncrypting ? 'Encrypt' : 'Decrypt'} Text
                </button>
                
                <button
                  onClick={swapTexts}
                  disabled={!inputText && !outputText}
                  className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                  title="Swap input and output"
                >
                  ⇄
                </button>
              </div>

              {/* Output Text Area */}
              {outputText && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Output Text:
                  </label>
                  <div className="relative">
                    <textarea
                      value={outputText}
                      readOnly
                      className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 resize-none"
                      rows={4}
                    />
                    <button
                      onClick={copyToClipboard}
                      className="absolute top-3 right-3 p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      title="Copy to clipboard"
                    >
                      {copied ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4 text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Clear Button */}
              <div className="flex gap-3">
                <button
                  onClick={clearAll}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                >
                  Clear All
                </button>
              </div>

              {/* Info Section */}
              <div className="mt-6 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-emerald-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-emerald-800 mb-1">About Encryption Algorithms</h4>
                    <ul className="text-sm text-emerald-700 space-y-1">
                      <li><strong>Base64:</strong> Encoding scheme for binary data - not secure encryption</li>
                      <li><strong>Caesar Cipher:</strong> Simple substitution cipher - educational purposes only</li>
                      <li><strong>Reverse:</strong> Basic text reversal - not secure</li>
                    </ul>
                    <p className="text-xs text-emerald-600 mt-2">
                      <strong>Note:</strong> These are basic algorithms for demonstration. Use proper encryption for sensitive data.
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
                  <span><strong>Client-Side Processing</strong> - All encryption happens in your browser</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Shield className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>No Data Stored</strong> - Your text never leaves your device</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Lock className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Instant Processing</strong> - Real-time encryption and decryption</span>
                </li>
              </ul>
            </div>

            {/* Features */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-emerald-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Supported Algorithms</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-2">
                  <FileText className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Base64 Encoding</strong> - Convert text to/from Base64 format</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Lock className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Caesar Cipher</strong> - Classic substitution cipher with custom shift</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Unlock className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Text Reversal</strong> - Simple text reversal algorithm</span>
                </div>
              </div>
            </div>

            {/* Use Cases */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-emerald-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Common Use Cases</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <h4 className="font-semibold text-green-800 mb-1">🔐 Basic Obfuscation</h4>
                  <p className="text-green-700">Hide text from casual observation</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <h4 className="font-semibold text-blue-800 mb-1">📚 Learning</h4>
                  <p className="text-blue-700">Understand basic cryptography concepts</p>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                  <h4 className="font-semibold text-purple-800 mb-1">💾 Data Encoding</h4>
                  <p className="text-purple-700">Encode data for storage or transmission</p>
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
            {encryptionFaqItems.map((faq, index) => (
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
            Free Online Encryption Tools
          </h2>
          
          <p className="text-gray-700 mb-4">
            Explore basic cryptography with our free online encryption tools. 
            Encrypt and decrypt text using various algorithms including Base64 encoding, 
            Caesar cipher, and text reversal. All processing happens securely in your 
            browser with no data stored on our servers.
          </p>

          <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
            Understanding Different Encryption Methods
          </h3>
          
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Base64 Encoding</h4>
              <p className="text-gray-700">
                Base64 is an encoding scheme that converts binary data into ASCII text format. 
                It's commonly used for encoding data in emails, storing complex data in XML or JSON, 
                and representing binary data in a way that can be safely transmitted over text-based protocols.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Caesar Cipher</h4>
              <p className="text-gray-700">
                The Caesar cipher is one of the simplest and most widely known encryption techniques. 
                It's a substitution cipher where each letter in the plaintext is shifted a certain 
                number of places down the alphabet. While not secure by modern standards, it's excellent 
                for learning basic cryptography concepts.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Text Reversal</h4>
              <p className="text-gray-700">
                Text reversal is the simplest form of obfuscation, where the text is simply reversed 
                character by character. While providing no real security, it can be useful for basic 
                data hiding from casual observation.
              </p>
            </div>
          </div>

          <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
            Security Considerations
          </h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>These tools are for educational and basic obfuscation purposes only</li>
            <li>Do not use for sensitive or confidential information</li>
            <li>For real security, use industry-standard encryption like AES-256</li>
            <li>Always keep backups of your original unencrypted data</li>
            <li>Remember that simple ciphers can be easily broken by determined attackers</li>
          </ul>
        </div>
      </div>

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": encryptionFaqItems.map(faq => ({
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

const encryptionFaqItems = [
  {
    question: "Are these encryption methods secure?",
    answer: "These are basic algorithms for educational purposes and simple obfuscation. Base64 is encoding, not encryption. Caesar cipher and text reversal are easily breakable. For sensitive data, use industry-standard encryption like AES-256."
  },
  {
    question: "Does my data leave my computer?",
    answer: "No, all encryption and decryption happens entirely in your browser. Your text is never sent to any server or stored anywhere."
  },
  {
    question: "What is Base64 encoding used for?",
    answer: "Base64 is commonly used for encoding binary data like images or files into ASCII text for safe transmission in emails, XML, JSON, or URLs. It's not encryption but data encoding."
  },
  {
    question: "How does the Caesar cipher work?",
    answer: "The Caesar cipher shifts each letter in the text by a fixed number of positions in the alphabet. For example, with a shift of 3, 'A' becomes 'D', 'B' becomes 'E', and so on. It wraps around at the end of the alphabet."
  },
  {
    question: "Can I use these tools for sensitive information?",
    answer: "No, these tools are not suitable for sensitive information. They provide basic obfuscation but no real security. Use proper encryption tools for confidential data."
  },
  {
    question: "What's the maximum text length I can encrypt?",
    answer: "There's no strict limit, but very long texts may slow down processing in the browser. For best performance, we recommend texts under 10,000 characters."
  }
];