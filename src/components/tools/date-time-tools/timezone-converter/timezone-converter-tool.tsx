// timezone-converter.tsx
'use client'

import { useState, useEffect } from 'react'
import { Globe, Copy, Check, Calendar, Clock, MapPin } from 'lucide-react'

interface Timezone {
  value: string
  label: string
  offset: string
}

const timezones: Timezone[] = [
  // --- UTC & GMT ---
  { value: 'UTC', label: 'Universal Time Coordinated (UTC)', offset: 'UTC' },
  { value: 'Europe/London', label: 'London (GMT / BST)', offset: 'UTC+0' },
  { value: 'Europe/Dublin', label: 'Dublin (GMT / IST)', offset: 'UTC+0' },
  
  // --- North America ---
  { value: 'America/New_York', label: 'Eastern Time (ET)', offset: 'UTC-5' },
  { value: 'America/Chicago', label: 'Central Time (CT)', offset: 'UTC-6' },
  { value: 'America/Denver', label: 'Mountain Time (MT)', offset: 'UTC-7' },
  { value: 'America/Phoenix', label: 'Arizona (MST - No DST)', offset: 'UTC-7' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)', offset: 'UTC-8' },
  { value: 'America/Anchorage', label: 'Alaska Time (AKT)', offset: 'UTC-9' },
  { value: 'Pacific/Honolulu', label: 'Hawaii Time (HST)', offset: 'UTC-10' },
  { value: 'America/Mexico_City', label: 'Mexico City (CST)', offset: 'UTC-6' },
  { value: 'America/Toronto', label: 'Toronto (ET)', offset: 'UTC-5' },
  { value: 'America/Vancouver', label: 'Vancouver (PT)', offset: 'UTC-8' },

  // --- South America ---
  { value: 'America/Sao_Paulo', label: 'Sao Paulo (BRT)', offset: 'UTC-3' },
  { value: 'America/Buenos_Aires', label: 'Buenos Aires (ART)', offset: 'UTC-3' },
  { value: 'America/Santiago', label: 'Santiago (CLT)', offset: 'UTC-4' },
  { value: 'America/Bogota', label: 'Bogotá (COT)', offset: 'UTC-5' },
  { value: 'America/Lima', label: 'Lima (PET)', offset: 'UTC-5' },

  // --- Europe ---
  { value: 'Europe/Paris', label: 'Paris (CET / CEST)', offset: 'UTC+1' },
  { value: 'Europe/Berlin', label: 'Berlin (CET / CEST)', offset: 'UTC+1' },
  { value: 'Europe/Rome', label: 'Rome (CET / CEST)', offset: 'UTC+1' },
  { value: 'Europe/Madrid', label: 'Madrid (CET / CEST)', offset: 'UTC+1' },
  { value: 'Europe/Warsaw', label: 'Warsaw (CET / CEST)', offset: 'UTC+1' },
  { value: 'Europe/Athens', label: 'Athens (EET / EEST)', offset: 'UTC+2' },
  { value: 'Europe/Istanbul', label: 'Istanbul (TRT)', offset: 'UTC+3' },
  { value: 'Europe/Moscow', label: 'Moscow (MSK)', offset: 'UTC+3' },

  // --- Africa & Middle East ---
  { value: 'Africa/Cairo', label: 'Cairo (EET)', offset: 'UTC+2' },
  { value: 'Africa/Johannesburg', label: 'Johannesburg (SAST)', offset: 'UTC+2' },
  { value: 'Africa/Nairobi', label: 'Nairobi (EAT)', offset: 'UTC+3' },
  { value: 'Asia/Riyadh', label: 'Riyadh (AST)', offset: 'UTC+3' },
  { value: 'Asia/Dubai', label: 'Dubai (GST)', offset: 'UTC+4' },

  // --- Asia ---
  { value: 'Asia/Karachi', label: 'Karachi (PKT)', offset: 'UTC+5' },
  { value: 'Asia/Kolkata', label: 'India (IST)', offset: 'UTC+5:30' },
  { value: 'Asia/Kathmandu', label: 'Kathmandu (NPT)', offset: 'UTC+5:45' },
  { value: 'Asia/Dhaka', label: 'Dhaka (BST)', offset: 'UTC+6' },
  { value: 'Asia/Bangkok', label: 'Bangkok / Hanoi / Jakarta (ICT/WIB)', offset: 'UTC+7' },
  { value: 'Asia/Kuala_Lumpur', label: 'Kuala Lumpur (MYT)', offset: 'UTC+8' },
  { value: 'Asia/Singapore', label: 'Singapore (SGT)', offset: 'UTC+8' },
  { value: 'Asia/Shanghai', label: 'Shanghai / Beijing (CST)', offset: 'UTC+8' },
  { value: 'Asia/Hong_Kong', label: 'Hong Kong (HKT)', offset: 'UTC+8' },
  { value: 'Asia/Manila', label: 'Manila (PST)', offset: 'UTC+8' },
  { value: 'Asia/Taipei', label: 'Taipei (CST)', offset: 'UTC+8' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)', offset: 'UTC+9' },
  { value: 'Asia/Seoul', label: 'Seoul (KST)', offset: 'UTC+9' },

  // --- Australia & Pacific ---
  { value: 'Australia/Darwin', label: 'Darwin (ACST)', offset: 'UTC+9:30' },
  { value: 'Australia/Sydney', label: 'Sydney (AEST / AEDT)', offset: 'UTC+10' },
  { value: 'Australia/Brisbane', label: 'Brisbane (AEST - No DST)', offset: 'UTC+10' },
  { value: 'Australia/Perth', label: 'Perth (AWST)', offset: 'UTC+8' },
  { value: 'Pacific/Auckland', label: 'Auckland (NZST / NZDT)', offset: 'UTC+12' },
  { value: 'Pacific/Fiji', label: 'Fiji (FJT)', offset: 'UTC+12' },
  { value: 'Pacific/Apia', label: 'Apia (WST)', offset: 'UTC+13' },
];

export default function TimezoneConverter() {
  const [fromTimezone, setFromTimezone] = useState<Timezone>(timezones[0])
  const [toTimezone, setToTimezone] = useState<Timezone>(timezones[1])
  const [fromDate, setFromDate] = useState<string>('')
  const [fromTime, setFromTime] = useState<string>('')
  const [toDate, setToDate] = useState<string>('')
  const [toTime, setToTime] = useState<string>('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // Set initial time to current time
    const now = new Date()
    setFromDate(now.toISOString().split('T')[0])
    setFromTime(now.toTimeString().slice(0, 5))
  }, [])

  useEffect(() => {
    convertTime()
  }, [fromDate, fromTime, fromTimezone, toTimezone])

  const convertTime = () => {
    if (!fromDate || !fromTime) return

    const fromDateTime = new Date(`${fromDate}T${fromTime}:00`)
    const fromOptions: Intl.DateTimeFormatOptions = {
      timeZone: fromTimezone.value,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }

    const toOptions: Intl.DateTimeFormatOptions = {
      timeZone: toTimezone.value,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }

    try {
      const fromFormatted = new Intl.DateTimeFormat('en-CA', fromOptions).format(fromDateTime)
      const toFormatted = new Intl.DateTimeFormat('en-CA', toOptions).format(fromDateTime)
      
      const [toDatePart, toTimePart] = toFormatted.split(', ')
      setToDate(toDatePart)
      setToTime(toTimePart)
    } catch (error) {
      console.error('Error converting time:', error)
    }
  }

  const copyResult = () => {
    const text = `${toDate} ${toTime} ${toTimezone.label}`
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const swapTimezones = () => {
    setFromTimezone(toTimezone)
    setToTimezone(fromTimezone)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl shadow-lg mb-4">
            <Globe className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Timezone Converter
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Convert times between different timezones worldwide with support for daylight saving time.
          </p>
        </header>

        <div className="bg-white rounded-2xl shadow-xl border border-emerald-100 p-8">
          <div className="grid md:grid-cols-5 gap-6 items-end">
            {/* From Timezone */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From Timezone
              </label>
              <select
                value={fromTimezone.value}
                onChange={(e) => {
                  const tz = timezones.find(t => t.value === e.target.value)
                  if (tz) setFromTimezone(tz)
                }}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                {timezones.map((tz) => (
                  <option key={tz.value} value={tz.value}>
                    {tz.label} ({tz.offset})
                  </option>
                ))}
              </select>
              
              <div className="grid grid-cols-2 gap-3 mt-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="h-4 w-4 inline mr-1" />
                    Date
                  </label>
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="h-4 w-4 inline mr-1" />
                    Time
                  </label>
                  <input
                    type="time"
                    value={fromTime}
                    onChange={(e) => setFromTime(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center items-center">
              <button
                onClick={swapTimezones}
                className="p-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-colors shadow-lg hover:shadow-xl"
                title="Swap timezones"
              >
                <Globe className="h-5 w-5" />
              </button>
            </div>

            {/* To Timezone */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To Timezone
              </label>
              <select
                value={toTimezone.value}
                onChange={(e) => {
                  const tz = timezones.find(t => t.value === e.target.value)
                  if (tz) setToTimezone(tz)
                }}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                {timezones.map((tz) => (
                  <option key={tz.value} value={tz.value}>
                    {tz.label} ({tz.offset})
                  </option>
                ))}
              </select>
              
              <div className="grid grid-cols-2 gap-3 mt-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="h-4 w-4 inline mr-1" />
                    Date
                  </label>
                  <input
                    type="date"
                    value={toDate}
                    readOnly
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="h-4 w-4 inline mr-1" />
                    Time
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={toTime}
                      readOnly
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                    <button
                      onClick={copyResult}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-emerald-600 transition-colors"
                      title="Copy result"
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Conversion Result */}
          {toDate && toTime && (
            <div className="mt-8 p-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <MapPin className="h-5 w-5 text-emerald-500 mr-2" />
                Conversion Result
              </h4>
              <div className="font-mono text-lg text-gray-700">
                {fromDate} {fromTime} {fromTimezone.label} = {toDate} {toTime} {toTimezone.label}
              </div>
              <div className="mt-2 text-sm text-gray-600">
                The same moment in time displayed in different timezones
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}