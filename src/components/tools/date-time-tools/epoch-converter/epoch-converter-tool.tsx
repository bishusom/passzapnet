// epoch-converter.tsx
'use client'

import { useState, useEffect } from 'react'
import { Clock, Copy, Check, Calendar, Cpu } from 'lucide-react'

export default function EpochConverter() {
  const [timestamp, setTimestamp] = useState<string>('')
  const [date, setDate] = useState<string>('')
  const [time, setTime] = useState<string>('')
  const [unit, setUnit] = useState<'seconds' | 'milliseconds'>('seconds')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // Set initial to current timestamp
    const now = Math.floor(Date.now() / 1000)
    setTimestamp(now.toString())
    convertToDate(now.toString())
  }, [])

  const convertToDate = (ts: string) => {
    if (!ts) {
      setDate('')
      setTime('')
      return
    }

    try {
      let timestampValue = parseInt(ts)
      if (unit === 'seconds') {
        timestampValue *= 1000
      }

      const dateObj = new Date(timestampValue)
      if (isNaN(dateObj.getTime())) {
        setDate('Invalid timestamp')
        setTime('')
        return
      }

      setDate(dateObj.toISOString().split('T')[0])
      setTime(dateObj.toTimeString().split(' ')[0])
    } catch (error) {
      setDate('Invalid timestamp')
      setTime('')
    }
  }

  const convertToTimestamp = (dateStr: string, timeStr: string) => {
    if (!dateStr || !timeStr) return

    try {
      const dateObj = new Date(`${dateStr}T${timeStr}`)
      const timestampValue = unit === 'seconds' 
        ? Math.floor(dateObj.getTime() / 1000)
        : dateObj.getTime()

      setTimestamp(timestampValue.toString())
    } catch (error) {
      setTimestamp('Invalid date')
    }
  }

  const handleTimestampChange = (value: string) => {
    setTimestamp(value)
    convertToDate(value)
  }

  const handleDateChange = (dateValue: string, timeValue: string) => {
    setDate(dateValue)
    setTime(timeValue)
    convertToTimestamp(dateValue, timeValue)
  }

  const copyResult = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const setToCurrent = () => {
    const now = unit === 'seconds' 
      ? Math.floor(Date.now() / 1000)
      : Date.now()
    setTimestamp(now.toString())
    convertToDate(now.toString())
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl shadow-lg mb-4">
            <Clock className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Epoch Timestamp Converter
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Convert Unix timestamps to human-readable dates and vice versa.
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
            {/* Timestamp to Date */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Cpu className="h-5 w-5 text-emerald-500 mr-2" />
                Timestamp to Date
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unix Timestamp ({unit})
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={timestamp}
                      onChange={(e) => handleTimestampChange(e.target.value)}
                      placeholder={`Enter ${unit} timestamp`}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                    <button
                      onClick={setToCurrent}
                      className="absolute right-12 top-1/2 transform -translate-y-1/2 px-3 py-1 text-sm bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
                    >
                      Now
                    </button>
                    <button
                      onClick={() => copyResult(timestamp)}
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

            {/* Date to Timestamp */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="h-5 w-5 text-emerald-500 mr-2" />
                Date to Timestamp
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
                    Unix Timestamp ({unit})
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={timestamp}
                      readOnly
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 font-mono bg-gray-50"
                    />
                    <button
                      onClick={() => copyResult(timestamp)}
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
              About Unix Timestamps
            </h4>
            <div className="text-sm text-gray-600 space-y-2">
              <p>
                <strong>Unix Timestamp</strong> (also known as Epoch time) is the number of {unit} that have elapsed since 
                January 1, 1970 (UTC). This system is widely used in computing and programming.
              </p>
              <p>
                <strong>Seconds:</strong> Commonly used in Unix systems, databases, and APIs
              </p>
              <p>
                <strong>Milliseconds:</strong> Used in JavaScript, Java, and modern APIs for higher precision
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}