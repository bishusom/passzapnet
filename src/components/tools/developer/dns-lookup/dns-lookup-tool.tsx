'use client'

import { useMemo, useState } from 'react'
import { Globe, RefreshCw, Search, Wifi } from 'lucide-react'

type DnsAnswer = {
  name: string
  type: number
  TTL: number
  data: string
}

type DnsResponse = {
  Status: number
  TC?: boolean
  RD?: boolean
  RA?: boolean
  AD?: boolean
  CD?: boolean
  Question?: { name: string; type: number }[]
  Answer?: DnsAnswer[]
  Authority?: DnsAnswer[]
  Additional?: DnsAnswer[]
  Comment?: string
}

const recordTypes = ['A', 'AAAA', 'CNAME', 'MX', 'TXT', 'NS', 'SOA'] as const
const quickDomains = ['google.com', 'github.com', 'openai.com', 'vercel.com']

const statusLabels: Record<number, string> = {
  0: 'NOERROR',
  1: 'FORMERR',
  2: 'SERVFAIL',
  3: 'NXDOMAIN',
  4: 'NOTIMP',
  5: 'REFUSED',
}

export default function DnsLookupTool() {
  const [domain, setDomain] = useState('google.com')
  const [recordType, setRecordType] = useState<(typeof recordTypes)[number]>('A')
  const [responseData, setResponseData] = useState<DnsResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const lookup = async (value?: string, type?: (typeof recordTypes)[number]) => {
    const name = (value ?? domain).trim()
    const nextType = type ?? recordType
    if (!name) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(
        `https://dns.google/resolve?name=${encodeURIComponent(name)}&type=${encodeURIComponent(nextType)}`
      )
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
      }

      const data = (await response.json()) as DnsResponse
      setResponseData(data)
    } catch (fetchError) {
      setResponseData(null)
      setError(fetchError instanceof Error ? fetchError.message : 'DNS lookup failed')
    } finally {
      setLoading(false)
    }
  }

  const answers = useMemo(() => responseData?.Answer ?? [], [responseData])
  const authority = useMemo(() => responseData?.Authority ?? [], [responseData])
  const additional = useMemo(() => responseData?.Additional ?? [], [responseData])
  const question = responseData?.Question?.[0] ?? null

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-3xl bg-white p-8 shadow-lg ring-1 ring-emerald-100">
          <div className="mb-6 flex items-start gap-4">
            <div className="rounded-2xl bg-emerald-100 p-4">
              <Wifi className="h-8 w-8 text-emerald-700" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">DNS Lookup Tool</h1>
              <p className="mt-2 text-gray-600">
                Resolve A, AAAA, CNAME, MX, TXT, NS, and SOA records using public DNS-over-HTTPS resolution.
              </p>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1fr_180px_auto]">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-900">Domain</label>
              <input
                value={domain}
                onChange={(event) => setDomain(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') lookup()
                }}
                placeholder="example.com"
                className="w-full rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-900">Record type</label>
              <select
                value={recordType}
                onChange={(event) => setRecordType(event.target.value as (typeof recordTypes)[number])}
                className="w-full rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
              >
                {recordTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={() => lookup()}
              className="inline-flex h-fit items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 font-medium text-white transition hover:bg-emerald-700"
            >
              <Search className="h-4 w-4" />
              Lookup
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {quickDomains.map((item) => (
              <button
                key={item}
                onClick={() => {
                  setDomain(item)
                  lookup(item)
                }}
                className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100"
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="mb-6 rounded-2xl border border-emerald-100 bg-white p-6 text-sm text-gray-600 shadow-sm">
            Resolving DNS records...
          </div>
        ) : null}

        {error ? (
          <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 p-6 text-sm font-medium text-red-700">
            {error}
          </div>
        ) : null}

        {responseData ? (
          <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
            <section className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-emerald-100">
              <h2 className="text-xl font-bold text-gray-900">Lookup Summary</h2>

              <div className="mt-4 space-y-4">
                <div className="rounded-2xl bg-emerald-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Question</p>
                  <p className="mt-1 font-medium text-gray-900">{question ? `${question.name} (${question.type})` : domain}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-slate-50 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Status</p>
                    <p className="mt-1 font-bold text-gray-900">{statusLabels[responseData.Status] || responseData.Status}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Answers</p>
                    <p className="mt-1 font-bold text-gray-900">{answers.length}</p>
                  </div>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4 text-sm text-gray-700">
                  <div className="grid grid-cols-2 gap-3">
                    <span>Recursion desired: {responseData.RD ? 'Yes' : 'No'}</span>
                    <span>Recursion available: {responseData.RA ? 'Yes' : 'No'}</span>
                    <span>Authoritative: {responseData.AD ? 'Yes' : 'No'}</span>
                    <span>Truncated: {responseData.TC ? 'Yes' : 'No'}</span>
                  </div>
                  {responseData.Comment ? <p className="mt-3 text-gray-600">{responseData.Comment}</p> : null}
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-emerald-100">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-lg font-bold text-gray-900">Answers</h3>
                  <Globe className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="mt-4 space-y-3">
                  {answers.length > 0 ? (
                    answers.map((answer) => (
                      <div key={`${answer.name}-${answer.data}-${answer.TTL}`} className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4">
                        <div className="grid gap-3 md:grid-cols-[minmax(0,1.4fr)_minmax(0,0.6fr)_minmax(0,1.2fr)]">
                          <div className="min-w-0">
                            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Name</p>
                            <p className="mt-1 break-words font-medium text-gray-900">{answer.name}</p>
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">TTL</p>
                            <p className="mt-1 font-mono text-sm text-gray-900">{answer.TTL}</p>
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Data</p>
                            <p className="mt-1 whitespace-pre-wrap break-words font-mono text-sm text-gray-900">
                              {answer.data}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-2xl bg-slate-50 px-4 py-6 text-sm text-gray-600">
                      No answers returned for this query.
                    </div>
                  )}
                </div>
              </div>

              {authority.length > 0 ? (
                <div className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-emerald-100">
                  <h3 className="text-lg font-bold text-gray-900">Authority Records</h3>
                  <div className="mt-4 space-y-3">
                    {authority.map((record) => (
                      <div key={`${record.name}-${record.data}-${record.TTL}`} className="rounded-2xl bg-slate-50 p-4">
                        <p className="break-words font-medium text-gray-900">{record.name}</p>
                        <p className="mt-1 whitespace-pre-wrap break-words font-mono text-sm text-gray-700">
                          {record.data}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {additional.length > 0 ? (
                <div className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-emerald-100">
                  <h3 className="text-lg font-bold text-gray-900">Additional Records</h3>
                  <div className="mt-4 space-y-3">
                    {additional.map((record) => (
                      <div key={`${record.name}-${record.data}-${record.TTL}`} className="rounded-2xl bg-slate-50 p-4">
                        <p className="break-words font-medium text-gray-900">{record.name}</p>
                        <p className="mt-1 whitespace-pre-wrap break-words font-mono text-sm text-gray-700">
                          {record.data}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </section>
          </div>
        ) : null}
      </div>
    </div>
  )
}
