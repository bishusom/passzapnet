// ldap-converter.tsx
'use client'

import { useState, useEffect } from 'react'
import { Database, Copy, Check, Calendar, Clock, Server } from 'lucide-react'

// LDAP epoch starts from January 1, 1601 (UTC)
const LDAP_EPOCH = new Date('1601-01-01T00:00:00Z').getTime()
const TICKS_PER_MS = 10000 // 100-nanosecond intervals

export default function LdapConverter() {
  const [ldapTimestamp, setLdapTimestamp] = useState<string>('')
  const [date, setDate] = useState<string>('')
  const [time, setTime] = useState<string>('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // Set initial to current time
    setToCurrent()
  }, [])

  const ldapToDate = (ldapStr: string): Date | null => {
    try {
      const ldapTicks = BigInt(ldapStr)
      const unixMs = Number(ldapTicks / BigInt(TICKS_PER_MS)) - LDAP_EPOCH
      return new Date(unixMs)
    } catch {
      return null
    }
  }

  const dateToLdap = (dateStr: string, timeStr: string): string => {
    try {
      const dateObj = new Date(`${dateStr}T${timeStr}`)
      const unixMs = dateObj.getTime() + LDAP_EPOCH
      const ldapTicks = BigInt(unixMs * TICKS_PER_MS)
      return ldapTicks.toString()
    } catch {
      return ''
    }
  }

  const handleLdapChange = (value: string) => {
    setLdapTimestamp(value)
    const dateObj = ldapToDate(value)
    if (dateObj && !isNaN(dateObj.getTime())) {
      setDate(dateObj.toISOString().split('T')[0])
      setTime(dateObj.toTimeString().split(' ')[0])
    } else {
      setDate('')
      setTime('')
    }
  }

  const handleDateChange = (dateValue: string, timeValue: string) => {
    setDate(dateValue)
    setTime(timeValue)
    const ldap = dateToLdap(dateValue, timeValue)
    setLdapTimestamp(ldap)
  }

  const setToCurrent = () => {
    const now = new Date()
    setDate(now.toISOString().split('T')[0])
    setTime(now.toTimeString().split(' ')[0])
    const ldap = dateToLdap(
      now.toISOString().split('T')[0],
      now.toTimeString().split(' ')[0]
    )
    setLdapTimestamp(ldap)
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
            <Database className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            LDAP Timestamp Converter
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Convert LDAP/Active Directory timestamps (18-digit format) to human-readable dates.
          </p>
        </header>

        <div className="bg-white rounded-2xl shadow-xl border border-emerald-100 p-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* LDAP to Date */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Server className="h-5 w-5 text-emerald-500 mr-2" />
                LDAP to Date
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    LDAP Timestamp (18-digit)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={ldapTimestamp}
                      onChange={(e) => handleLdapChange(e.target.value)}
                      placeholder="Enter LDAP timestamp"
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                    <button
                      onClick={setToCurrent}
                      className="absolute right-12 top-1/2 transform -translate-y-1/2 px-3 py-1 text-sm bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
                    >
                      Now
                    </button>
                    <button
                      onClick={() => copyResult(ldapTimestamp)}
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

            {/* Date to LDAP */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="h-5 w-5 text-emerald-500 mr-2" />
                Date to LDAP
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
                    LDAP Timestamp
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={ldapTimestamp}
                      readOnly
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 font-mono bg-gray-50"
                    />
                    <button
                      onClick={() => copyResult(ldapTimestamp)}
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
              About LDAP Timestamps
            </h4>
            <div className="text-sm text-gray-600 space-y-2">
              <p>
                <strong>LDAP Timestamps</strong> (also known as Windows NT time or Active Directory time) 
                are 64-bit integers representing the number of 100-nanosecond intervals since 
                January 1, 1601 (UTC).
              </p>
              <p>
                This format is used extensively in Windows Active Directory for tracking 
                account creation dates, password last set, last logon, and other timestamps.
              </p>
              <p className="font-mono text-xs bg-black/5 p-2 rounded">
                Format: 18-digit number (e.g., 133231218350000000)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}