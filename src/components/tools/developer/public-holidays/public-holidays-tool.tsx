'use client'

import { useEffect, useMemo, useState } from 'react'
import { Calendar, CheckCircle, RefreshCw, Search } from 'lucide-react'

type CountryOption = {
  countryCode: string
  name: string
}

type Holiday = {
  date: string
  localName: string
  name: string
  global?: boolean
  counties?: string[] | null
  launchYear?: number | null
  types?: string[]
}

const quickCountries = ['US', 'SG', 'GB', 'DE', 'IN']

const formatDate = (value: string) =>
  new Intl.DateTimeFormat(undefined, { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(value))

export default function PublicHolidaysTool() {
  const [countryInput, setCountryInput] = useState('US')
  const [year, setYear] = useState(new Date().getFullYear())
  const [countries, setCountries] = useState<CountryOption[]>([])
  const [holidays, setHolidays] = useState<Holiday[]>([])
  const [loading, setLoading] = useState(false)
  const [countryLoading, setCountryLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadCountries = async () => {
      try {
        const response = await fetch('https://date.nager.at/api/v3/AvailableCountries')
        const data = (await response.json()) as CountryOption[]
        setCountries(data)
      } catch (fetchError) {
        console.error('Failed to load countries', fetchError)
      } finally {
        setCountryLoading(false)
      }
    }

    loadCountries()
  }, [])

  const resolvedCountry = useMemo(() => {
    const normalized = countryInput.trim().toLowerCase()
    if (!normalized) return null

    const exactCode = countries.find((country) => country.countryCode.toLowerCase() === normalized)
    if (exactCode) return exactCode

    const exactName = countries.find((country) => country.name.toLowerCase() === normalized)
    if (exactName) return exactName

    return countries.find((country) => country.name.toLowerCase().includes(normalized))
  }, [countryInput, countries])

  const upcomingHoliday = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10)
    return holidays
      .filter((holiday) => holiday.date >= today)
      .sort((left, right) => left.date.localeCompare(right.date))[0] ?? null
  }, [holidays])

  const todaysHoliday = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10)
    return holidays.find((holiday) => holiday.date === today) ?? null
  }, [holidays])

  const loadHolidays = async (overrideCountry?: string, overrideYear?: number) => {
    const chosenCountry = overrideCountry ? overrideCountry.trim() : countryInput.trim()
    const chosenYear = overrideYear ?? year

    if (!chosenCountry) {
      setError('Enter a country code or country name')
      return
    }

    const resolved = /^[a-z]{2}$/i.test(chosenCountry)
      ? countries.find((country) => country.countryCode.toLowerCase() === chosenCountry.toLowerCase()) ?? {
          countryCode: chosenCountry.toUpperCase(),
          name: chosenCountry.toUpperCase(),
        }
      : countries.find((country) => country.name.toLowerCase().includes(chosenCountry.toLowerCase()))

    if (!resolved) {
      setError('Country not found. Use an ISO alpha-2 code like US or SG.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(
        `https://date.nager.at/api/v3/publicholidays/${chosenYear}/${resolved.countryCode}`
      )
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
      }

      const data = (await response.json()) as Holiday[]
      setCountryInput(resolved.countryCode)
      setHolidays(data)
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : 'Failed to load holidays')
      setHolidays([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-3xl bg-white p-8 shadow-lg ring-1 ring-emerald-100">
          <div className="mb-6 flex items-start gap-4">
            <div className="rounded-2xl bg-emerald-100 p-4">
              <Calendar className="h-8 w-8 text-emerald-700" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">Public Holidays Tool</h1>
              <p className="mt-2 text-gray-600">
                Find official holiday calendars by country and year, then inspect upcoming holidays and today&apos;s status.
              </p>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.2fr_0.6fr_auto]">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-900">Country name or ISO code</label>
              <input
                value={countryInput}
                onChange={(event) => setCountryInput(event.target.value)}
                placeholder="US, Singapore, Germany..."
                className="w-full rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
              />
              <p className="mt-2 text-xs text-gray-500">
                Use a country code for best results. Supported countries load in the background.
              </p>
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-900">Year</label>
              <input
                type="number"
                min={1970}
                max={2100}
                value={year}
                onChange={(event) => setYear(Number(event.target.value))}
                className="w-full rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
              />
            </div>
            <button
              onClick={() => loadHolidays()}
              className="inline-flex h-fit items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 font-medium text-white transition hover:bg-emerald-700"
            >
              <Search className="h-4 w-4" />
              Lookup
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {quickCountries.map((code) => (
              <button
                key={code}
                onClick={() => {
                  setCountryInput(code)
                  loadHolidays(code)
                }}
                className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100"
              >
                {code}
              </button>
            ))}
          </div>
        </div>

        {countryLoading ? (
          <div className="mb-6 rounded-2xl border border-emerald-100 bg-white p-6 text-sm text-gray-600 shadow-sm">
            Loading supported countries...
          </div>
        ) : null}

        {loading ? (
          <div className="mb-6 rounded-2xl border border-emerald-100 bg-white p-6 text-sm text-gray-600 shadow-sm">
            Loading holiday calendar...
          </div>
        ) : null}

        {error ? (
          <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 p-6 text-sm font-medium text-red-700">
            {error}
          </div>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
          <section className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-emerald-100">
            <h2 className="text-xl font-bold text-gray-900">Summary</h2>

            <div className="mt-4 space-y-4">
              <div className="rounded-2xl bg-emerald-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Selected country</p>
                <p className="mt-1 text-lg font-semibold text-gray-900">
                  {resolvedCountry ? `${resolvedCountry.name} (${resolvedCountry.countryCode})` : countryInput || 'Unknown'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-slate-50 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Holidays</p>
                  <p className="mt-1 text-xl font-bold text-gray-900">{holidays.length}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Year</p>
                  <p className="mt-1 text-xl font-bold text-gray-900">{year}</p>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Today</p>
                {todaysHoliday ? (
                  <div className="mt-2 flex items-start gap-3 text-emerald-700">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">{todaysHoliday.name}</p>
                      <p className="text-sm text-gray-600">{todaysHoliday.localName}</p>
                    </div>
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-gray-600">No holiday today in this calendar.</p>
                )}
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Next upcoming</p>
                {upcomingHoliday ? (
                  <div className="mt-2">
                    <p className="font-semibold text-gray-900">{upcomingHoliday.name}</p>
                    <p className="text-sm text-gray-600">
                      {formatDate(upcomingHoliday.date)} {upcomingHoliday.global ? ' - National' : ' - Regional'}
                    </p>
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-gray-600">No holidays found.</p>
                )}
              </div>
            </div>
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-emerald-100">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-bold text-gray-900">Holiday Calendar</h2>
              <button
                onClick={() => loadHolidays()}
                className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 px-4 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-50"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {holidays.length === 0 ? (
                <div className="rounded-2xl bg-slate-50 px-4 py-6 text-sm text-gray-600">
                  Search for a country and year to see the holiday list.
                </div>
              ) : (
                holidays.map((holiday) => (
                  <div key={`${holiday.date}-${holiday.name}`} className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-gray-900">{holiday.name}</p>
                        <p className="text-sm text-gray-600">{holiday.localName}</p>
                      </div>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-emerald-700">
                        {formatDate(holiday.date)}
                      </span>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2 text-xs font-medium">
                      <span className="rounded-full bg-white px-3 py-1 text-gray-700">
                        {holiday.global ? 'National' : 'Regional'}
                      </span>
                      {holiday.types?.map((type) => (
                        <span key={type} className="rounded-full bg-white px-3 py-1 text-gray-700">
                          {type}
                        </span>
                      ))}
                      {holiday.launchYear ? (
                        <span className="rounded-full bg-white px-3 py-1 text-gray-700">
                          Since {holiday.launchYear}
                        </span>
                      ) : null}
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
