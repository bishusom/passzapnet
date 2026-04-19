'use client'

import { useMemo, useState } from 'react'
import { CheckCircle, Copy, Flag, Search } from 'lucide-react'

type CountryRecord = {
  name: { common: string; official: string }
  cca2: string
  cca3: string
  capital?: string[]
  region?: string
  subregion?: string
  population?: number
  area?: number
  continents?: string[]
  timezones?: string[]
  borders?: string[]
  languages?: Record<string, string>
  currencies?: Record<string, { name: string; symbol?: string }>
  flags?: { png?: string; svg?: string }
  latlng?: [number, number]
}

const API_FIELDS = [
  'name',
  'cca2',
  'cca3',
  'capital',
  'region',
  'subregion',
  'population',
  'area',
  'continents',
  'timezones',
  'borders',
  'languages',
  'currencies',
  'flags',
  'latlng',
].join(',')

const quickQueries = ['United States', 'Japan', 'SG', 'Germany']

const formatNumber = (value?: number) =>
  typeof value === 'number' ? new Intl.NumberFormat().format(value) : 'Unknown'

export default function CountryInfoTool() {
  const [query, setQuery] = useState('United States')
  const [results, setResults] = useState<CountryRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  const lookupCountry = async (value?: string) => {
    const search = (value ?? query).trim()
    if (!search) return

    setLoading(true)
    setError(null)

    try {
      const endpoint = /^[a-z]{2,3}$/i.test(search)
        ? `https://restcountries.com/v3.1/alpha/${encodeURIComponent(search)}?fields=${API_FIELDS}`
        : `https://restcountries.com/v3.1/name/${encodeURIComponent(search)}?fields=${API_FIELDS}`

      const response = await fetch(endpoint)
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
      }

      const data = await response.json()
      const nextResults = Array.isArray(data) ? data : [data]
      setResults(nextResults)
    } catch (err) {
      setResults([])
      setError(err instanceof Error ? err.message : 'Failed to load country data')
    } finally {
      setLoading(false)
    }
  }

  const selectedSummary = useMemo(() => {
    if (!results.length) return null

    return results[0]
  }, [results])

  const copyCountryCode = async (code: string) => {
    await navigator.clipboard.writeText(code)
    setCopied(code)
    window.setTimeout(() => setCopied(null), 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-3xl bg-white p-8 shadow-lg ring-1 ring-emerald-100">
          <div className="mb-6 flex items-start gap-4">
            <div className="rounded-2xl bg-emerald-100 p-4">
              <Flag className="h-8 w-8 text-emerald-700" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">Country Info Tool</h1>
              <p className="mt-2 text-gray-600">
                Look up country facts, flags, capitals, currencies, languages, borders, and timezones from live public data.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-[1fr_auto]">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-900">Country name or ISO code</label>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') lookupCountry()
                }}
                placeholder="United States, Japan, SG, DE..."
                className="w-full rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
              />
            </div>
            <button
              onClick={() => lookupCountry()}
              className="inline-flex h-fit items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 font-medium text-white transition hover:bg-emerald-700"
            >
              <Search className="h-4 w-4" />
              Search
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {quickQueries.map((item) => (
              <button
                key={item}
                onClick={() => {
                  setQuery(item)
                  lookupCountry(item)
                }}
                className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100"
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {loading && (
          <div className="mb-6 rounded-2xl border border-emerald-100 bg-white p-6 text-sm text-gray-600 shadow-sm">
            Loading country data...
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 p-6 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && results.length > 0 && selectedSummary && (
          <div className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
              <div className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-emerald-100">
                <div className="overflow-hidden rounded-2xl bg-gray-100">
                  {selectedSummary.flags?.png ? (
                    <img
                      src={selectedSummary.flags.png}
                      alt={`${selectedSummary.name.common} flag`}
                      className="h-44 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-44 items-center justify-center bg-gradient-to-br from-emerald-200 to-cyan-200">
                      <Flag className="h-12 w-12 text-emerald-700" />
                    </div>
                  )}
                </div>

                <h2 className="mt-5 text-2xl font-bold text-gray-900">{selectedSummary.name.common}</h2>
                <p className="mt-1 text-sm text-gray-500">{selectedSummary.name.official}</p>

                <div className="mt-5 space-y-3">
                  <div className="rounded-2xl bg-emerald-50 px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Country Code</p>
                    <div className="mt-1 flex items-center justify-between gap-3">
                      <span className="font-mono text-lg font-bold text-gray-900">{selectedSummary.cca2}</span>
                      <button
                        onClick={() => copyCountryCode(selectedSummary.cca2)}
                        className="inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-medium text-emerald-700 ring-1 ring-emerald-200"
                      >
                        {copied === selectedSummary.cca2 ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        {copied === selectedSummary.cca2 ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-slate-50 p-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Region</p>
                      <p className="mt-1 font-medium text-gray-900">{selectedSummary.region || 'Unknown'}</p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Population</p>
                      <p className="mt-1 font-medium text-gray-900">{formatNumber(selectedSummary.population)}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {results.map((country) => {
                  const currencies = country.currencies ? Object.values(country.currencies) : []
                  const languages = country.languages ? Object.values(country.languages) : []

                  return (
                    <div key={country.cca3} className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-emerald-100">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{country.name.common}</h3>
                          <p className="mt-1 text-sm text-gray-500">{country.cca3}</p>
                        </div>
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                          {country.cca2}
                        </span>
                      </div>

                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <div className="rounded-2xl bg-slate-50 p-3">
                          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Capital</p>
                          <p className="mt-1 font-medium text-gray-900">{country.capital?.join(', ') || 'Unknown'}</p>
                        </div>
                        <div className="rounded-2xl bg-slate-50 p-3">
                          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Subregion</p>
                          <p className="mt-1 font-medium text-gray-900">{country.subregion || 'Unknown'}</p>
                        </div>
                        <div className="rounded-2xl bg-slate-50 p-3">
                          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Area</p>
                          <p className="mt-1 font-medium text-gray-900">{formatNumber(country.area)} km2</p>
                        </div>
                        <div className="rounded-2xl bg-slate-50 p-3">
                          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Timezones</p>
                          <p className="mt-1 font-medium text-gray-900">{country.timezones?.length || 0}</p>
                        </div>
                      </div>

                      <div className="mt-4 space-y-3">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Currencies</p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {currencies.length > 0 ? currencies.map((currency) => (
                              <span key={`${currency.name}-${currency.symbol ?? 'na'}`} className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
                                {currency.name}{currency.symbol ? ` (${currency.symbol})` : ''}
                              </span>
                            )) : <span className="text-sm text-gray-500">None listed</span>}
                          </div>
                        </div>

                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Languages</p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {languages.length > 0 ? languages.map((language) => (
                              <span key={language} className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
                                {language}
                              </span>
                            )) : <span className="text-sm text-gray-500">None listed</span>}
                          </div>
                        </div>

                        {country.borders?.length ? (
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Borders</p>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {country.borders.map((border) => (
                                <span key={border} className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                                  {border}
                                </span>
                              ))}
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-emerald-100">
              <h3 className="text-lg font-bold text-gray-900">Quick Facts</h3>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl bg-emerald-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Continents</p>
                  <p className="mt-2 text-sm font-medium text-gray-900">
                    {selectedSummary.continents?.join(', ') || 'Unknown'}
                  </p>
                </div>
                <div className="rounded-2xl bg-emerald-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Timezones</p>
                  <p className="mt-2 text-sm font-medium text-gray-900">
                    {selectedSummary.timezones?.slice(0, 3).join(', ') || 'Unknown'}
                  </p>
                </div>
                <div className="rounded-2xl bg-emerald-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Coordinates</p>
                  <p className="mt-2 text-sm font-medium text-gray-900">
                    {selectedSummary.latlng ? `${selectedSummary.latlng[0]}, ${selectedSummary.latlng[1]}` : 'Unknown'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
