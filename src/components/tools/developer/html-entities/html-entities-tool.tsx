'use client'

import { useMemo, useState } from 'react'
import { Copy, RefreshCw, Type } from 'lucide-react'

const sampleHtml = `<article class="card">\n  <h1>Tom & Jerry</h1>\n  <p>5 < 7 and "quotes" need escaping.</p>\n</article>`

const encodeHtml = (input: string) =>
  input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

const decodeHtml = (input: string) => {
  if (typeof document === 'undefined') return input
  const textarea = document.createElement('textarea')
  textarea.innerHTML = input
  return textarea.value
}

export default function HtmlEntitiesTool() {
  const [input, setInput] = useState(sampleHtml)
  const [copied, setCopied] = useState<'encoded' | 'decoded' | null>(null)

  const encoded = useMemo(() => encodeHtml(input), [input])
  const decoded = useMemo(() => decodeHtml(input), [input])

  const copyValue = async (value: string, type: 'encoded' | 'decoded') => {
    await navigator.clipboard.writeText(value)
    setCopied(type)
    window.setTimeout(() => setCopied(null), 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-3xl bg-white p-8 shadow-lg">
          <div className="mb-6 flex items-center gap-4">
            <div className="rounded-2xl bg-emerald-100 p-4">
              <Type className="h-8 w-8 text-emerald-700" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">HTML Entity Encoder & Decoder</h1>
              <p className="mt-2 text-gray-600">Escape markup safely or decode entity strings back into readable text.</p>
            </div>
          </div>

          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            rows={8}
            className="w-full rounded-2xl border border-emerald-200 bg-gray-50 px-4 py-3 font-mono text-sm outline-none focus:border-emerald-400 focus:bg-white"
            placeholder="Paste raw HTML or encoded text"
          />

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={() => setInput(sampleHtml)}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-medium text-white hover:bg-emerald-700"
            >
              <RefreshCw className="h-4 w-4" />
              Load Example
            </button>
            <button
              onClick={() => setInput('')}
              className="rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-3xl bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Encoded HTML</h2>
              <button
                onClick={() => copyValue(encoded, 'encoded')}
                className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 px-3 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-50"
              >
                <Copy className="h-4 w-4" />
                {copied === 'encoded' ? 'Copied' : 'Copy'}
              </button>
            </div>
            <pre className="overflow-x-auto rounded-2xl bg-gray-950 p-4 text-sm text-emerald-100">{encoded}</pre>
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Decoded HTML</h2>
              <button
                onClick={() => copyValue(decoded, 'decoded')}
                className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 px-3 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-50"
              >
                <Copy className="h-4 w-4" />
                {copied === 'decoded' ? 'Copied' : 'Copy'}
              </button>
            </div>
            <pre className="overflow-x-auto rounded-2xl bg-gray-950 p-4 text-sm text-cyan-100">{decoded}</pre>
          </section>
        </div>
      </div>
    </div>
  )
}
