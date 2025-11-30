// unix-hex-converter.tsx
'use client'

import { useState, useEffect } from 'react'
import { Hash, Copy, Check, Calendar, Clock, Code } from 'lucide-react'

export default function UnixHexConverter() {
  const [hexTimestamp, setHexTimestamp] = useState<string>('')
  const [decimalTimestamp, setDecimalTimestamp] = useState<string>('')
  const [date, setDate] = useState<string>('')
  const [time, setTime] = useState<string>('')
  const [unit, setUnit] = useState<'seconds' | 'milliseconds'>('seconds')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setToCurrent()
  }, [unit])

  const hexToDecimal = (hex: string): number => {
    try {
      return parseInt(hex, 16)
    } catch {
      return NaN
    }
  }

  const decimalToHex = (decimal: number): string => {
    return decimal.toString(16).toUpperCase()
  }

  const handleHexChange = (value: string) => {
    setHexTimestamp(value.toUpperCase())
    const decimal = hexToDecimal(value)
    if (!isNaN(decimal)) {
      setDecimalTimestamp(decimal.toString())
      updateDateFromTimestamp(decimal)
    } else {
      setDecimalTimestamp('')
      setDate('')
      setTime('')
    }
  }

  const handleDecimalChange = (value: string) => {
    setDecimalTimestamp(value)
    const decimal = parseInt(value)
    if (!isNaN(decimal)) {
      setHexTimestamp(decimalToHex(decimal))
      updateDateFromTimestamp(decimal)
    } else {
      setHexTimestamp('')
      setDate('')
      setTime('')
    }
  }

  const updateDateFromTimestamp = (timestamp: number) => {
    let timestampValue = timestamp
    if (unit === 'seconds') {
      timestampValue *= 1000
    }

    const dateObj = new Date(timestampValue)
    if (!isNaN(dateObj.getTime())) {
      setDate(dateObj.toISOString().split('T')[0])
      setTime(dateObj.toTimeString().split(' ')[0])
    } else {
      setDate('')
      setTime('')
    }
  }

  const handleDateChange = (dateStr: string, timeStr: string) => {
    setDate(dateStr)
    setTime(timeStr)
    
    try {
      const dateObj = new Date(`${dateStr}T${timeStr}`)
      const timestampValue = unit === 'seconds' 
        ? Math.floor(dateObj.getTime() / 1000)
        : dateObj.getTime()

      setDecimalTimestamp(timestampValue.toString())
      setHexTimestamp(decimalToHex(timestampValue))
    } catch {
      setDecimalTimestamp('')
      setHexTimestamp('')
    }
  }

  const setToCurrent = () => {
    const now = unit === 'seconds' 
      ? Math.floor(Date.now() / 1000)
      : Date.now()
    
    setDecimalTimestamp(now.toString())
    setHexTimestamp(decimalToHex(now))
    updateDateFromTimestamp(now)
  }

  const copyResult = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl shadow-lg mb-4">
            <Hash className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Unix Hex Timestamp Converter
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Convert hexadecimal Unix timestamps to readable dates and vice versa.
          </p>
        </header>

        <div className="bg-white rounded-2xl shadow-xl border border-emerald-100 p-8">
          {/* Unit Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Timestamp Unit
            </label>
            <div className="flex gap-4">
              {['seconds', 'milliseconds'].map((u) => (
                <button
                  key={u}
                  onClick={() => setUnit(u as any)}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    unit === u
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Hex/Decimal to Date */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Code className="h-5 w-5 text-emerald-500 mr-2" />
                Hex/Decimal to Date
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hexadecimal Timestamp
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={hexTimestamp}
                      onChange={(e) => handleHexChange(e.target.value)}
                      placeholder="Enter hex timestamp"
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                    <button
                      onClick={setToCurrent}
                      className="absolute right-12 top-1/2 transform -translate-y-1/2 px-3 py-1 text-sm bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
                    >
                      Now
                    </button>
                    <button
                      onClick={() => copyResult(hexTimestamp)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-emerald-600"
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Decimal Timestamp ({unit})
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={decimalTimestamp}
                      onChange={(e) => handleDecimalChange(e.target.value)}
                      placeholder={`Enter ${unit} timestamp`}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                    <button
                      onClick={() => copyResult(decimalTimestamp)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-emerald-600"
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date
                    </label>
                    <input
                      type="date"
                      value={date}
                      readOnly
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time
                    </label>
                    <input
                      type="text"
                      value={time}
                      readOnly
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-50"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Date to Hex/Decimal */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="h-5 w-5 text-emerald-500 mr-2" />
                Date to Hex/Decimal
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => handleDateChange(e.target.value, time)}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time
                    </label>
                    <input
                      type="time"
                      value={time}
                      onChange={(e) => handleDateChange(date, e.target.value)}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Decimal Timestamp ({unit})
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={decimalTimestamp}
                      readOnly
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 font-mono bg-gray-50"
                    />
                    <button
                      onClick={() => copyResult(decimalTimestamp)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-emerald-600"
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hexadecimal Timestamp
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={hexTimestamp}
                      readOnly
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 font-mono bg-gray-50"
                    />
                    <button
                      onClick={() => copyResult(hexTimestamp)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-emerald-600"
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-8 p-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-3">
              About Hexadecimal Timestamps
            </h4>
            <div className="text-sm text-gray-600 space-y-2">
              <p>
                <strong>Hexadecimal Unix Timestamps</strong> are simply the hexadecimal representation 
                of standard Unix timestamps. They represent the same moment in time but in base-16 format.
              </p>
              <p>
                These are commonly found in log files, debugging output, and some system APIs where 
                hexadecimal representation is preferred for compactness or other technical reasons.
              </p>
              <p className="font-mono text-xs bg-black/5 p-2 rounded">
                Example: Decimal 1704067200 = Hex 6583B500
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}