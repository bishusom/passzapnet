'use client'

import { useState, useCallback, useEffect } from 'react'
import { Key, Copy, Check, RefreshCw, BookOpen } from 'lucide-react'
import PasswordStrength from './PasswordStrength'
import PassphraseGenerator from './PassphraseGenerator'

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

  return (
    <div className={`bg-white rounded-2xl p-6 shadow-xl border border-emerald-100 ${compact ? '' : 'max-w-4xl mx-auto'}`}>
      {!compact && (
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl shadow-lg mb-4">
            <Key className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Secure Password Generator</h2>
          <p className="text-gray-600">Generate strong passwords instantly with local processing</p>
        </div>
      )}

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