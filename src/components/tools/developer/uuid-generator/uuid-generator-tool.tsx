'use client'

import { useMemo, useState } from 'react'
import { CheckCircle, Component, Copy, Download, RefreshCw } from 'lucide-react'

const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

const createUuid = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
    const random = Math.floor(Math.random() * 16)
    const value = char === 'x' ? random : (random & 0x3) | 0x8
    return value.toString(16)
  })
}

export default function UuidGeneratorTool() {
  const [count, setCount] = useState(10)
  const [uppercase, setUppercase] = useState(false)
  const [hyphenless, setHyphenless] = useState(false)
  const [generated, setGenerated] = useState<string[]>(() => Array.from({ length: 10 }, createUuid))
  const [validationInput, setValidationInput] = useState('')
  const [copied, setCopied] = useState(false)

  const formattedGenerated = useMemo(() => {
    return generated.map((uuid) => {
      let next = hyphenless ? uuid.replace(/-/g, '') : uuid
      if (uppercase) next = next.toUpperCase()
      return next
    })
  }, [generated, hyphenless, uppercase])

  const validationResults = useMemo(() => {
    return validationInput
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => ({ value: line, valid: uuidRegex.test(line) }))
  }, [validationInput])

  const generate = () => {
    const total = Math.min(Math.max(count, 1), 100)
    setGenerated(Array.from({ length: total }, createUuid))
  }

  const copyAll = async () => {
    await navigator.clipboard.writeText(formattedGenerated.join('\n'))
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1500)
  }

  const downloadAll = () => {
    const blob = new Blob([formattedGenerated.join('\n')], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'uuids.txt'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-3xl bg-white p-8 shadow-lg">
          <div className="mb-6 flex items-center gap-4">
            <div className="rounded-2xl bg-emerald-100 p-4">
              <Component className="h-8 w-8 text-emerald-700" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">UUID Generator & Validator</h1>
              <p className="mt-2 text-gray-600">Generate UUID v4 values in bulk and validate existing IDs.</p>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[180px_1fr]">
            <div className="rounded-2xl bg-emerald-50 p-4">
              <label className="block text-sm font-semibold text-gray-900">How many?</label>
              <input
                type="number"
                min={1}
                max={100}
                value={count}
                onChange={(event) => setCount(Number(event.target.value))}
                className="mt-2 w-full rounded-xl border border-emerald-200 bg-white px-3 py-2 outline-none focus:border-emerald-400"
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex items-center gap-3 rounded-2xl bg-gray-50 px-4 py-4">
                <input type="checkbox" checked={uppercase} onChange={() => setUppercase((value) => !value)} />
                <span className="text-sm font-medium text-gray-700">Uppercase output</span>
              </label>
              <label className="flex items-center gap-3 rounded-2xl bg-gray-50 px-4 py-4">
                <input type="checkbox" checked={hyphenless} onChange={() => setHyphenless((value) => !value)} />
                <span className="text-sm font-medium text-gray-700">Remove hyphens</span>
              </label>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={generate}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-medium text-white hover:bg-emerald-700"
            >
              <RefreshCw className="h-4 w-4" />
              Generate UUIDs
            </button>
            <button
              onClick={copyAll}
              className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 px-4 py-3 text-sm font-medium text-emerald-700 hover:bg-emerald-50"
            >
              <Copy className="h-4 w-4" />
              {copied ? 'Copied' : 'Copy All'}
            </button>
            <button
              onClick={downloadAll}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <Download className="h-4 w-4" />
              Download
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-3xl bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-bold text-gray-900">Generated UUIDs</h2>
            <div className="max-h-[520px] overflow-auto rounded-2xl bg-gray-950 p-4 font-mono text-sm text-emerald-100">
              {formattedGenerated.map((uuid, index) => (
                <div key={`${uuid}-${index}`} className="py-1">
                  {uuid}
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-bold text-gray-900">Validate Existing UUIDs</h2>
            <textarea
              value={validationInput}
              onChange={(event) => setValidationInput(event.target.value)}
              rows={8}
              className="w-full rounded-2xl border border-emerald-200 bg-gray-50 px-4 py-3 font-mono text-sm outline-none focus:border-emerald-400 focus:bg-white"
              placeholder="Paste one UUID per line"
            />

            <div className="mt-4 space-y-3">
              {validationResults.length === 0 ? (
                <p className="rounded-2xl bg-gray-50 px-4 py-4 text-sm text-gray-600">
                  Paste one or more UUID values to validate them.
                </p>
              ) : (
                validationResults.map((result) => (
                  <div
                    key={result.value}
                    className={`flex items-start gap-3 rounded-2xl px-4 py-3 ${
                      result.valid ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'
                    }`}
                  >
                    <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                    <div>
                      <p className="font-mono text-sm">{result.value}</p>
                      <p className="mt-1 text-xs font-medium">{result.valid ? 'Valid UUID format' : 'Invalid UUID format'}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
