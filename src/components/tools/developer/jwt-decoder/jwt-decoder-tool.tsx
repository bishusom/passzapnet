'use client'

import { useMemo, useState } from 'react'
import { AlertCircle, CheckCircle, Copy, KeyRound, Shield } from 'lucide-react'

interface DecodedToken {
  header: Record<string, unknown>
  payload: Record<string, unknown>
  signature: string
}

const sampleToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkZyZWVEZXZUb29scyBTdHVkaW8iLCJpYXQiOjE3MTAwMDAwMDAsImV4cCI6MTk5OTk5OTk5OX0.sgnatureplaceholder'

const formatUnixTime = (value: unknown) => {
  if (typeof value !== 'number') return null
  const date = new Date(value * 1000)
  if (Number.isNaN(date.getTime())) return null
  return date.toLocaleString()
}

const decodeBase64Url = (value: string) => {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/')
  const padding = normalized.length % 4 === 0 ? 0 : 4 - (normalized.length % 4)
  const padded = normalized + '='.repeat(padding)
  return decodeURIComponent(
    Array.from(atob(padded))
      .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, '0')}`)
      .join('')
  )
}

export default function JwtDecoderTool() {
  const [token, setToken] = useState(sampleToken)
  const [copied, setCopied] = useState<'header' | 'payload' | 'token' | null>(null)

  const decoded = useMemo(() => {
    try {
      const parts = token.trim().split('.')
      if (parts.length !== 3) {
        throw new Error('JWTs must contain header, payload, and signature segments.')
      }

      const header = JSON.parse(decodeBase64Url(parts[0]))
      const payload = JSON.parse(decodeBase64Url(parts[1]))

      return {
        decoded: {
          header,
          payload,
          signature: parts[2],
        } satisfies DecodedToken,
        error: null,
      }
    } catch (error) {
      return {
        decoded: null,
        error: error instanceof Error ? error.message : 'Unable to decode token.',
      }
    }
  }, [token])

  const copyValue = async (value: string, type: 'header' | 'payload' | 'token') => {
    await navigator.clipboard.writeText(value)
    setCopied(type)
    window.setTimeout(() => setCopied(null), 1500)
  }

  const exp = decoded.decoded?.payload?.exp
  const iat = decoded.decoded?.payload?.iat

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-3xl bg-white p-8 shadow-lg">
          <div className="mb-6 flex items-center gap-4">
            <div className="rounded-2xl bg-emerald-100 p-4">
              <KeyRound className="h-8 w-8 text-emerald-700" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">JWT Decoder & Inspector</h1>
              <p className="mt-2 text-gray-600">
                Inspect JWT header and payload claims locally in your browser.
              </p>
            </div>
          </div>

          <textarea
            value={token}
            onChange={(event) => setToken(event.target.value)}
            rows={6}
            className="w-full rounded-2xl border border-emerald-200 bg-gray-50 px-4 py-3 font-mono text-sm outline-none transition-colors focus:border-emerald-400 focus:bg-white"
            placeholder="Paste a JWT token here"
          />

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={() => copyValue(token, 'token')}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-medium text-white hover:bg-emerald-700"
            >
              <Copy className="h-4 w-4" />
              {copied === 'token' ? 'Copied Token' : 'Copy Token'}
            </button>
            <button
              onClick={() => setToken(sampleToken)}
              className="rounded-xl border border-emerald-200 px-4 py-3 text-sm font-medium text-emerald-700 hover:bg-emerald-50"
            >
              Load Sample Token
            </button>
            <button
              onClick={() => setToken('')}
              className="rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="mb-6 rounded-2xl border border-white/70 bg-white/90 p-5 shadow-sm">
          {decoded.error ? (
            <div className="flex items-start gap-3 text-red-700">
              <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
              <div>
                <p className="font-semibold">Token could not be decoded</p>
                <p className="text-sm">{decoded.error}</p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3 text-emerald-700">
              <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
              <div>
                <p className="font-semibold">Valid JWT structure detected</p>
                <p className="text-sm">Signature verification is not performed in this view.</p>
              </div>
            </div>
          )}
        </div>

        {decoded.decoded && (
          <>
            <div className="mb-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl bg-white p-5 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">Algorithm</p>
                <p className="mt-2 text-lg font-semibold text-gray-900">
                  {String(decoded.decoded.header.alg ?? 'Unknown')}
                </p>
              </div>
              <div className="rounded-2xl bg-white p-5 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">Issued At</p>
                <p className="mt-2 text-lg font-semibold text-gray-900">{formatUnixTime(iat) ?? 'Not set'}</p>
              </div>
              <div className="rounded-2xl bg-white p-5 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">Expires</p>
                <p className="mt-2 text-lg font-semibold text-gray-900">{formatUnixTime(exp) ?? 'Not set'}</p>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <section className="rounded-3xl bg-white p-6 shadow-lg">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Header</h2>
                  <button
                    onClick={() => copyValue(JSON.stringify(decoded.decoded.header, null, 2), 'header')}
                    className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 px-3 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-50"
                  >
                    <Copy className="h-4 w-4" />
                    {copied === 'header' ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <pre className="overflow-x-auto rounded-2xl bg-gray-950 p-4 text-sm text-emerald-100">
                  {JSON.stringify(decoded.decoded.header, null, 2)}
                </pre>
              </section>

              <section className="rounded-3xl bg-white p-6 shadow-lg">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Payload</h2>
                  <button
                    onClick={() => copyValue(JSON.stringify(decoded.decoded.payload, null, 2), 'payload')}
                    className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 px-3 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-50"
                  >
                    <Copy className="h-4 w-4" />
                    {copied === 'payload' ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <pre className="overflow-x-auto rounded-2xl bg-gray-950 p-4 text-sm text-cyan-100">
                  {JSON.stringify(decoded.decoded.payload, null, 2)}
                </pre>
              </section>
            </div>

            <section className="mt-6 rounded-3xl bg-white p-6 shadow-lg">
              <div className="mb-3 flex items-center gap-3">
                <Shield className="h-5 w-5 text-emerald-700" />
                <h2 className="text-xl font-bold text-gray-900">Signature Segment</h2>
              </div>
              <p className="mb-4 text-sm text-gray-600">
                This is the raw third segment of the JWT. It is shown for inspection only.
              </p>
              <code className="block overflow-x-auto rounded-2xl bg-gray-100 p-4 text-sm text-gray-800">
                {decoded.decoded.signature}
              </code>
            </section>
          </>
        )}
      </div>
    </div>
  )
}
