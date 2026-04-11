'use client'

import { useState, useCallback, useEffect } from 'react'
import { Key, Copy, Check, RefreshCw, BookOpen, Shield, Lock, Users, Zap } from 'lucide-react'
import PasswordStrength from './PasswordStrength'
import PassphraseGenerator from './PassphraseGenerator'
//import Header from '@/components/layout/Header'
//import Footer from '@/components/layout/Footer'

interface PasswordGeneratorProps {
  compact?: boolean
}

type TabType = 'password' | 'passphrase'

export default function PasswordGenerator({ compact = false }: PasswordGeneratorProps) {
  const [password, setPassword] = useState('')
  const [length, setLength] = useState(16)
  const [includeUppercase, setIncludeUppercase] = useState(true)
  const [includeLowercase, setIncludeLowercase] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(true)
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<TabType>('password')

  const generatePassword = useCallback(() => {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const lowercase = 'abcdefghijklmnopqrstuvwxyz'
    const numbers = '0123456789'
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?'
    
    let chars = ''
    if (includeUppercase) chars += uppercase
    if (includeLowercase) chars += lowercase
    if (includeNumbers) chars += numbers
    if (includeSymbols) chars += symbols

    if (chars === '') {
      setPassword('Please select at least one character type')
      return
    }

    let result = ''
    const array = new Uint32Array(length)
    crypto.getRandomValues(array)
    
    for (let i = 0; i < length; i++) {
      result += chars[array[i] % chars.length]
    }
    
    setPassword(result)
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols])

  const handlePasswordGenerated = (newPassword: string) => {
    setPassword(newPassword)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Auto-generate on first load
  useEffect(() => {
    generatePassword()
  }, [generatePassword])

  // If compact mode, just return the tool UI without layout
  if (compact) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-xl border border-emerald-100 max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl shadow-lg mb-4">
            <Key className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Secure Password Generator</h2>
          <p className="text-gray-600">Generate strong passwords instantly with local processing</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('password')}
            className={`flex items-center space-x-2 px-4 py-2 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'password'
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Key className="h-4 w-4" />
            <span>Random Password</span>
          </button>
          <button
            onClick={() => setActiveTab('passphrase')}
            className={`flex items-center space-x-2 px-4 py-2 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'passphrase'
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <BookOpen className="h-4 w-4" />
            <span>Memorable Passphrase</span>
          </button>
        </div>

        <div className="space-y-6">
          {/* Password Output */}
          {activeTab === 'password' && (
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-200">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-700">
                  {activeTab === 'password' ? 'Generated Password' : 'Generated Passphrase'}
                </span>
                <button
                  onClick={copyToClipboard}
                  disabled={!password}
                  className="flex items-center space-x-2 px-4 py-2 bg-white hover:bg-emerald-50 disabled:bg-gray-100 disabled:cursor-not-allowed rounded-lg transition-colors border border-emerald-200 shadow-sm"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <Copy className="h-4 w-4 text-gray-600" />
                  )}
                  <span className="text-sm text-gray-700">
                    {copied ? 'Copied!' : 'Copy'}
                  </span>
                </button>
              </div>
              <p className="font-mono text-xl text-gray-900 text-center break-all bg-white/50 p-4 rounded-lg border border-emerald-100 min-h-[4rem] flex items-center justify-center">
                {password}
              </p>
            </div>
          )}
          
          {/* Generator Options */}
          {activeTab === 'password' ? (
            <div className="space-y-6">
              {/* Length Slider */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Length: <span className="text-emerald-600 font-semibold">{length}</span>
                </label>
                <input
                  type="range"
                  min="8"
                  max="32"
                  value={length}
                  onChange={(e) => setLength(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-emerald"
                />
              </div>

              {/* Character Options */}
              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center space-x-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-emerald-300 transition-colors cursor-pointer shadow-sm">
                  <input
                    type="checkbox"
                    checked={includeUppercase}
                    onChange={(e) => setIncludeUppercase(e.target.checked)}
                    className="w-4 h-4 text-emerald-500 bg-white border-gray-300 rounded focus:ring-emerald-500 focus:ring-2"
                  />
                  <span className="text-sm font-medium text-gray-700">A-Z</span>
                </label>
                <label className="flex items-center space-x-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-emerald-300 transition-colors cursor-pointer shadow-sm">
                  <input
                    type="checkbox"
                    checked={includeLowercase}
                    onChange={(e) => setIncludeLowercase(e.target.checked)}
                    className="w-4 h-4 text-emerald-500 bg-white border-gray-300 rounded focus:ring-emerald-500 focus:ring-2"
                  />
                  <span className="text-sm font-medium text-gray-700">a-z</span>
                </label>
                <label className="flex items-center space-x-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-emerald-300 transition-colors cursor-pointer shadow-sm">
                  <input
                    type="checkbox"
                    checked={includeNumbers}
                    onChange={(e) => setIncludeNumbers(e.target.checked)}
                    className="w-4 h-4 text-emerald-500 bg-white border-gray-300 rounded focus:ring-emerald-500 focus:ring-2"
                  />
                  <span className="text-sm font-medium text-gray-700">0-9</span>
                </label>
                <label className="flex items-center space-x-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-emerald-300 transition-colors cursor-pointer shadow-sm">
                  <input
                    type="checkbox"
                    checked={includeSymbols}
                    onChange={(e) => setIncludeSymbols(e.target.checked)}
                    className="w-4 h-4 text-emerald-500 bg-white border-gray-300 rounded focus:ring-emerald-500 focus:ring-2"
                  />
                  <span className="text-sm font-medium text-gray-700">!@#$</span>
                </label>
              </div>

              <button
                onClick={generatePassword}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl"
              >
                <RefreshCw className="h-5 w-5" />
                <span>Generate New Password</span>
              </button>
            </div>
          ) : (
            <PassphraseGenerator onPasswordGenerated={handlePasswordGenerated} />
          )}

          {/* Password Strength */}
          <PasswordStrength password={password} />
        </div>
      </div>
    )
  }

  // FULL PAGE LAYOUT with side content and FAQ
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Header */}
          <header className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl shadow-lg mb-4">
              <Key className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Secure Password Generator</h1>
            <p className="text-bs text-gray-600 max-w-3xl mx-auto">
              Generate strong, secure passwords and memorable passphrases with local processing. No data stored.
            </p>
          </header>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Tool Component */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl p-6 shadow-xl border border-emerald-100">
                {/* Tabs */}
                <div className="flex border-b border-gray-200 mb-6">
                  <button
                    onClick={() => setActiveTab('password')}
                    className={`flex items-center space-x-2 px-4 py-2 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === 'password'
                        ? 'border-emerald-500 text-emerald-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Key className="h-4 w-4" />
                    <span>Random Password</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('passphrase')}
                    className={`flex items-center space-x-2 px-4 py-2 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === 'passphrase'
                        ? 'border-emerald-500 text-emerald-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <BookOpen className="h-4 w-4" />
                    <span>Memorable Passphrase</span>
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Password Output */}
                  {activeTab === 'password' && (
                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-200">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium text-gray-700">
                          {activeTab === 'password' ? 'Generated Password' : 'Generated Passphrase'}
                        </span>
                        <button
                          onClick={copyToClipboard}
                          disabled={!password}
                          className="flex items-center space-x-2 px-4 py-2 bg-white hover:bg-emerald-50 disabled:bg-gray-100 disabled:cursor-not-allowed rounded-lg transition-colors border border-emerald-200 shadow-sm"
                        >
                          {copied ? (
                            <Check className="h-4 w-4 text-emerald-600" />
                          ) : (
                            <Copy className="h-4 w-4 text-gray-600" />
                          )}
                          <span className="text-sm text-gray-700">
                            {copied ? 'Copied!' : 'Copy'}
                          </span>
                        </button>
                      </div>
                      <p className="font-mono text-xl text-gray-900 text-center break-all bg-white/50 p-4 rounded-lg border border-emerald-100 min-h-[4rem] flex items-center justify-center">
                        {password}
                      </p>
                    </div>
                  )}
                  
                  {/* Generator Options */}
                  {activeTab === 'password' ? (
                    <div className="space-y-6">
                      {/* Length Slider */}
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Length: <span className="text-emerald-600 font-semibold">{length}</span>
                        </label>
                        <input
                          type="range"
                          min="8"
                          max="32"
                          value={length}
                          onChange={(e) => setLength(parseInt(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-emerald"
                        />
                      </div>

                      {/* Character Options */}
                      <div className="grid grid-cols-2 gap-3">
                        <label className="flex items-center space-x-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-emerald-300 transition-colors cursor-pointer shadow-sm">
                          <input
                            type="checkbox"
                            checked={includeUppercase}
                            onChange={(e) => setIncludeUppercase(e.target.checked)}
                            className="w-4 h-4 text-emerald-500 bg-white border-gray-300 rounded focus:ring-emerald-500 focus:ring-2"
                          />
                          <span className="text-sm font-medium text-gray-700">A-Z</span>
                        </label>
                        <label className="flex items-center space-x-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-emerald-300 transition-colors cursor-pointer shadow-sm">
                          <input
                            type="checkbox"
                            checked={includeLowercase}
                            onChange={(e) => setIncludeLowercase(e.target.checked)}
                            className="w-4 h-4 text-emerald-500 bg-white border-gray-300 rounded focus:ring-emerald-500 focus:ring-2"
                          />
                          <span className="text-sm font-medium text-gray-700">a-z</span>
                        </label>
                        <label className="flex items-center space-x-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-emerald-300 transition-colors cursor-pointer shadow-sm">
                          <input
                            type="checkbox"
                            checked={includeNumbers}
                            onChange={(e) => setIncludeNumbers(e.target.checked)}
                            className="w-4 h-4 text-emerald-500 bg-white border-gray-300 rounded focus:ring-emerald-500 focus:ring-2"
                          />
                          <span className="text-sm font-medium text-gray-700">0-9</span>
                        </label>
                        <label className="flex items-center space-x-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-emerald-300 transition-colors cursor-pointer shadow-sm">
                          <input
                            type="checkbox"
                            checked={includeSymbols}
                            onChange={(e) => setIncludeSymbols(e.target.checked)}
                            className="w-4 h-4 text-emerald-500 bg-white border-gray-300 rounded focus:ring-emerald-500 focus:ring-2"
                          />
                          <span className="text-sm font-medium text-gray-700">!@#$</span>
                        </label>
                      </div>

                      <button
                        onClick={generatePassword}
                        className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl"
                      >
                        <RefreshCw className="h-5 w-5" />
                        <span>Generate New Password</span>
                      </button>
                    </div>
                  ) : (
                    <PassphraseGenerator onPasswordGenerated={handlePasswordGenerated} />
                  )}

                  {/* Password Strength */}
                  <PasswordStrength password={password} />
                </div>
              </div>
            </div>

            {/* Right Column - Unique Side Content for Password Generator */}
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
                    <span><strong>Local Processing</strong> - Everything happens in your browser</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Lock className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span><strong>No Data Stored</strong> - We never see or store your passwords</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Users className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span><strong>No Registration</strong> - Use immediately without signing up</span>
                  </li>
                </ul>
              </div>

              {/* Password Tips */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-emerald-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Password Best Practices</h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <h4 className="font-semibold text-green-800 mb-1">✅ Do</h4>
                    <ul className="space-y-1 text-green-700">
                      <li>• Use 12+ characters for important accounts</li>
                      <li>• Combine letters, numbers, and symbols</li>
                      <li>• Use unique passwords for each site</li>
                      <li>• Consider a password manager</li>
                    </ul>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <h4 className="font-semibold text-red-800 mb-1">❌ Don't</h4>
                    <ul className="space-y-1 text-red-700">
                      <li>• Use personal information</li>
                      <li>• Reuse passwords across sites</li>
                      <li>• Use common words or patterns</li>
                      <li>• Write passwords in plain text</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Use Case Guide */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-emerald-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Which to Use?</h3>
                <div className="space-y-4 text-sm">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <h4 className="font-semibold text-blue-800 mb-1">🔐 Random Passwords</h4>
                    <p className="text-blue-700">
                      Best for accounts where you don't need to remember the password (use a password manager).
                    </p>
                    <div className="mt-2 text-xs text-blue-600">
                      <strong>Examples:</strong> Banking, Email, Social Media
                    </div>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                    <h4 className="font-semibold text-purple-800 mb-1">📝 Passphrases</h4>
                    <p className="text-purple-700">
                      Best for passwords you need to remember (master passwords, WiFi, encryption).
                    </p>
                    <div className="mt-2 text-xs text-purple-600">
                      <strong>Examples:</strong> Password Manager Master, WiFi, Disk Encryption
                    </div>
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
              {faqItems.map((faq, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-emerald-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

// Unique FAQ items for password generator
const faqItems = [
  {
    question: "Is this password generator really secure?",
    answer: "Yes! All password generation happens locally in your browser using cryptographically secure random number generation. We never send your passwords to our servers or store them anywhere."
  },
  {
    question: "What's the difference between passwords and passphrases?",
    answer: "Passwords are random character strings best for accounts where you use a password manager. Passphrases are memorable word combinations ideal for master passwords or accounts you need to remember."
  },
  {
    question: "How long should my password be?",
    answer: "For most accounts, 12-16 characters is sufficient. For highly sensitive accounts like banking or email, consider 16+ characters. Passphrases should be 4-6 words minimum."
  },
  {
    question: "Why should I use a password manager?",
    answer: "Password managers help you generate, store, and autofill strong unique passwords for every account. This eliminates password reuse and makes managing hundreds of passwords easy."
  },
  {
    question: "Are the generated passwords truly random?",
    answer: "Yes! We use the Web Crypto API's getRandomValues() method, which provides cryptographically secure random numbers suitable for password generation."
  },
  {
    question: "Can I use this on mobile devices?",
    answer: "Absolutely! FreeDevTools Studio is fully responsive and works perfectly on smartphones, tablets, and desktop computers. All features are available on mobile."
  }
]
