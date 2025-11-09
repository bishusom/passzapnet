'use client'

import { useState, useCallback } from 'react'
import { Copy, Check, RefreshCw } from 'lucide-react'

interface PassphraseGeneratorProps {
  onPasswordGenerated: (password: string) => void
}

export default function PassphraseGenerator({ onPasswordGenerated }: PassphraseGeneratorProps) {
  const [passphrase, setPassphrase] = useState('')
  const [phraseWords, setPhraseWords] = useState(4)
  const [separator, setSeparator] = useState('-')
  const [capitalize, setCapitalize] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(false)
  const [copied, setCopied] = useState(false)

  const wordList = [
    'apple', 'brave', 'cloud', 'dance', 'eagle', 'flame', 'globe', 'heart',
    'ivory', 'jolly', 'kite', 'light', 'music', 'night', 'ocean', 'peace',
    'quiet', 'river', 'stone', 'tree', 'unity', 'vivid', 'water', 'xenon',
    'young', 'zesty', 'amber', 'blaze', 'crisp', 'dream', 'earth', 'frost',
    'giant', 'haven', 'ideal', 'jewel', 'king', 'lucky', 'magic', 'noble',
    'olive', 'pearl', 'quick', 'royal', 'smart', 'true', 'urban', 'vital',
    'wonder', 'zebra'
  ]

  const generatePassphrase = useCallback(() => {
    const selectedWords = []
    for (let i = 0; i < phraseWords; i++) {
      let word = wordList[Math.floor(Math.random() * wordList.length)]
      if (capitalize) {
        word = word.charAt(0).toUpperCase() + word.slice(1)
      }
      selectedWords.push(word)
    }

    let result = selectedWords.join(separator)
    
    if (includeNumbers) {
      // Add a random number between 10-99 at a random position
      const randomNum = Math.floor(Math.random() * 90) + 10
      const insertPos = Math.floor(Math.random() * (selectedWords.length + 1))
      const wordsArray = result.split(separator)
      wordsArray.splice(insertPos, 0, randomNum.toString())
      result = wordsArray.join(separator)
    }

    setPassphrase(result)
    onPasswordGenerated(result)
  }, [phraseWords, separator, capitalize, includeNumbers, onPasswordGenerated])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(passphrase)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* REMOVED THE DUPLICATE OUTPUT SECTION - Only keep this one */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-200">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-gray-700">Generated Passphrase</span>
          <button
            onClick={copyToClipboard}
            disabled={!passphrase}
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
          {passphrase || 'Click "Generate Passphrase" to create one'}
        </p>
      </div>

      {/* Options */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Words: <span className="text-emerald-600 font-semibold">{phraseWords}</span>
            </label>
            <input
              type="range"
              min="3"
              max="8"
              value={phraseWords}
              onChange={(e) => setPhraseWords(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-emerald"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Shorter</span>
              <span>Longer</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Word Separator
            </label>
            <select
              value={separator}
              onChange={(e) => setSeparator(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="-">Hyphen (-)</option>
              <option value="_">Underscore (_)</option>
              <option value=".">Dot (.)</option>
              <option value=" ">Space ( )</option>
              <option value="">No separator</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <label className="flex items-center space-x-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-emerald-300 transition-colors cursor-pointer shadow-sm">
            <input
              type="checkbox"
              checked={capitalize}
              onChange={(e) => setCapitalize(e.target.checked)}
              className="w-4 h-4 text-emerald-500 bg-white border-gray-300 rounded focus:ring-emerald-500 focus:ring-2"
            />
            <span className="text-sm font-medium text-gray-700">Capitalize words</span>
          </label>

          <label className="flex items-center space-x-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-emerald-300 transition-colors cursor-pointer shadow-sm">
            <input
              type="checkbox"
              checked={includeNumbers}
              onChange={(e) => setIncludeNumbers(e.target.checked)}
              className="w-4 h-4 text-emerald-500 bg-white border-gray-300 rounded focus:ring-emerald-500 focus:ring-2"
            />
            <span className="text-sm font-medium text-gray-700">Include numbers</span>
          </label>
        </div>
      </div>

      <button
        onClick={generatePassphrase}
        className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl"
      >
        <RefreshCw className="h-5 w-5" />
        <span>Generate Passphrase</span>
      </button>

      {/* Use Cases Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-blue-900 mb-3">When to Use Passphrases?</h4>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700">
          <div className="space-y-2">
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
              <span><strong>Master Passwords</strong> - For password managers</span>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
              <span><strong>WiFi Passwords</strong> - Easy to share verbally</span>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
              <span><strong>Encryption Keys</strong> - For full disk encryption</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
              <span><strong>Important Accounts</strong> - Email, banking</span>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
              <span><strong>Recovery Codes</strong> - Account recovery</span>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
              <span><strong>Shared Accounts</strong> - Team or family access</span>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-emerald-900 mb-2">Why Passphrases Are Better</h4>
        <ul className="text-sm text-emerald-700 space-y-1">
          <li>• <strong>Easier to remember</strong> - "Correct-Horse-Battery-Staple" vs "Tr0ub4dor&3"</li>
          <li>• <strong>Harder to crack</strong> - Length beats complexity for brute force attacks</li>
          <li>• <strong>More entropy</strong> - Each word adds significant randomness</li>
          <li>• <strong>Resistant to dictionary attacks</strong> - When using uncommon word combinations</li>
          <li>• <strong>Type-friendly</strong> - Easy to type on mobile and desktop</li>
        </ul>
      </div>
    </div>
  )
}