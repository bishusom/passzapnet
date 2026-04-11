'use client'

import { useMemo, useState } from 'react'
import { Copy, Globe, Link2, RefreshCw } from 'lucide-react'

const sampleUrl = 'https://freedevtools.studio/search?q=hello world&category=developer tools'

export default function UrlEncoderTool() {
  const [input, setInput] = useState(sampleUrl)
  const [copied, setCopied] = useState<'encoded' | 'decoded' | null>(null)

  const encoded = useMemo(() => {
    try {
      return encodeURIComponent(input)
    } catch {
      return ''
    }
  }, [input])

  const decoded = useMemo(() => {
    try {
      return decodeURIComponent(input)
    } catch {
      return 'Input is not valid percent-encoded text.'
    }
  }, [input])

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
              <Globe className="h-8 w-8 text-emerald-700" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">URL Encoder & Decoder</h1>
              <p className="mt-2 text-gray-600">
                Encode query values and decode percent-encoded strings without leaving the browser.
              </p>
            </div>
          </div>

          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            rows={6}
            className="w-full rounded-2xl border border-emerald-200 bg-gray-50 px-4 py-3 font-mono text-sm outline-none focus:border-emerald-400 focus:bg-white"
            placeholder="Paste a URL or percent-encoded string"
          />

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={() => setInput(sampleUrl)}
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
              <div className="flex items-center gap-3">
                <Link2 className="h-5 w-5 text-emerald-700" />
                <h2 className="text-xl font-bold text-gray-900">Encoded Output</h2>
              </div>
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
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-emerald-700" />
                <h2 className="text-xl font-bold text-gray-900">Decoded Output</h2>
              </div>
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
