'use client'

import { useEffect, useMemo, useState } from 'react'
import { AlertCircle, CalendarClock, CheckCircle, Clock, Copy } from 'lucide-react'

type CronFieldName = 'minute' | 'hour' | 'dayOfMonth' | 'month' | 'dayOfWeek'

const fieldConfig: Record<CronFieldName, { label: string; min: number; max: number }> = {
  minute: { label: 'Minute', min: 0, max: 59 },
  hour: { label: 'Hour', min: 0, max: 23 },
  dayOfMonth: { label: 'Day of Month', min: 1, max: 31 },
  month: { label: 'Month', min: 1, max: 12 },
  dayOfWeek: { label: 'Day of Week', min: 0, max: 6 },
}

const presetMap = {
  everyMinute: '* * * * *',
  everyHour: '0 * * * *',
  everyDayAtNine: '0 9 * * *',
  weekdaysAtNine: '0 9 * * 1,2,3,4,5',
  firstOfMonth: '0 9 1 * *',
  custom: '',
} as const

type PresetKey = keyof typeof presetMap

const splitExpression = (expression: string) => {
  const parts = expression.trim().split(/\s+/)
  if (parts.length !== 5) {
    throw new Error('Cron expressions must have exactly five fields.')
  }
  return parts
}

const parseField = (value: string, min: number, max: number) => {
  const results = new Set<number>()

  const addRange = (start: number, end: number, step = 1) => {
    if (start < min || end > max || start > end || step < 1) {
      throw new Error(`Range ${start}-${end} is out of bounds for ${min}-${max}.`)
    }
    for (let current = start; current <= end; current += step) {
      results.add(current)
    }
  }

  for (const part of value.split(',')) {
    if (part === '*') {
      addRange(min, max)
      continue
    }

    if (part.startsWith('*/')) {
      const step = Number(part.slice(2))
      if (!Number.isInteger(step) || step < 1) {
        throw new Error(`Invalid step value in "${part}".`)
      }
      addRange(min, max, step)
      continue
    }

    if (part.includes('/')) {
      const [rangePart, stepPart] = part.split('/')
      const step = Number(stepPart)
      if (!Number.isInteger(step) || step < 1) {
        throw new Error(`Invalid step value in "${part}".`)
      }
      const [start, end] = rangePart.split('-').map(Number)
      addRange(start, end, step)
      continue
    }

    if (part.includes('-')) {
      const [start, end] = part.split('-').map(Number)
      addRange(start, end)
      continue
    }

    const numeric = Number(part)
    if (!Number.isInteger(numeric) || numeric < min || numeric > max) {
      throw new Error(`Value "${part}" is out of bounds for ${min}-${max}.`)
    }
    results.add(numeric)
  }

  return results
}

const describeField = (field: CronFieldName, value: string) => {
  if (value === '*') return `${fieldConfig[field].label.toLowerCase()}: every value`
  if (value.startsWith('*/')) return `${fieldConfig[field].label.toLowerCase()}: every ${value.slice(2)}`
  return `${fieldConfig[field].label.toLowerCase()}: ${value}`
}

const getNextRuns = (expression: string) => {
  const [minuteField, hourField, dayOfMonthField, monthField, dayOfWeekField] = splitExpression(expression)
  const minutes = parseField(minuteField, 0, 59)
  const hours = parseField(hourField, 0, 23)
  const daysOfMonth = parseField(dayOfMonthField, 1, 31)
  const months = parseField(monthField, 1, 12)
  const daysOfWeek = parseField(dayOfWeekField, 0, 6)

  const now = new Date()
  const cursor = new Date(now.getTime())
  cursor.setSeconds(0, 0)
  cursor.setMinutes(cursor.getMinutes() + 1)

  const next: string[] = []
  const maxChecks = 60 * 24 * 366

  for (let checks = 0; checks < maxChecks && next.length < 5; checks += 1) {
    if (
      minutes.has(cursor.getMinutes()) &&
      hours.has(cursor.getHours()) &&
      daysOfMonth.has(cursor.getDate()) &&
      months.has(cursor.getMonth() + 1) &&
      daysOfWeek.has(cursor.getDay())
    ) {
      next.push(cursor.toLocaleString())
    }
    cursor.setMinutes(cursor.getMinutes() + 1)
  }

  return next
}

export default function CronParserTool() {
  const [preset, setPreset] = useState<PresetKey>('everyHour')
  const [expression, setExpression] = useState<string>(presetMap.everyHour)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (preset !== 'custom') {
      setExpression(presetMap[preset])
    }
  }, [preset])

  const parsed = useMemo(() => {
    try {
      const [minute, hour, dayOfMonth, month, dayOfWeek] = splitExpression(expression)

      parseField(minute, 0, 59)
      parseField(hour, 0, 23)
      parseField(dayOfMonth, 1, 31)
      parseField(month, 1, 12)
      parseField(dayOfWeek, 0, 6)

      return {
        fields: { minute, hour, dayOfMonth, month, dayOfWeek },
        nextRuns: getNextRuns(expression),
        error: null,
      }
    } catch (error) {
      return {
        fields: null,
        nextRuns: [],
        error: error instanceof Error ? error.message : 'Unable to parse cron expression.',
      }
    }
  }, [expression])

  const updateField = (field: CronFieldName, value: string) => {
    setPreset('custom')
    const parts = parsed.fields
      ? { ...parsed.fields, [field]: value }
      : { minute: '*', hour: '*', dayOfMonth: '*', month: '*', dayOfWeek: '*', [field]: value }
    setExpression([parts.minute, parts.hour, parts.dayOfMonth, parts.month, parts.dayOfWeek].join(' '))
  }

  const copyExpression = async () => {
    await navigator.clipboard.writeText(expression)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-3xl bg-white p-8 shadow-lg">
          <div className="mb-6 flex items-center gap-4">
            <div className="rounded-2xl bg-emerald-100 p-4">
              <CalendarClock className="h-8 w-8 text-emerald-700" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Cron Expression Builder & Parser</h1>
              <p className="mt-2 text-gray-600">Build cron expressions, inspect fields, and preview the next run times.</p>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-900">Preset</label>
              <select
                value={preset}
                onChange={(event) => setPreset(event.target.value as PresetKey)}
                className="w-full rounded-xl border border-emerald-200 bg-white px-3 py-3 outline-none focus:border-emerald-400"
              >
                <option value="everyMinute">Every minute</option>
                <option value="everyHour">Every hour</option>
                <option value="everyDayAtNine">Every day at 09:00</option>
                <option value="weekdaysAtNine">Weekdays at 09:00</option>
                <option value="firstOfMonth">First day of month at 09:00</option>
                <option value="custom">Custom</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-900">Cron Expression</label>
              <div className="flex gap-3">
                <input
                  value={expression}
                  onChange={(event) => {
                    setPreset('custom')
                    setExpression(event.target.value)
                  }}
                  className="w-full rounded-xl border border-emerald-200 bg-gray-50 px-4 py-3 font-mono text-sm outline-none focus:border-emerald-400 focus:bg-white"
                  placeholder="* * * * *"
                />
                <button
                  onClick={copyExpression}
                  className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 px-4 py-3 text-sm font-medium text-emerald-700 hover:bg-emerald-50"
                >
                  <Copy className="h-4 w-4" />
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6 rounded-2xl border border-white/70 bg-white/90 p-5 shadow-sm">
          {parsed.error ? (
            <div className="flex items-start gap-3 text-red-700">
              <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
              <div>
                <p className="font-semibold">Invalid cron expression</p>
                <p className="text-sm">{parsed.error}</p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3 text-emerald-700">
              <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
              <div>
                <p className="font-semibold">Expression parsed successfully</p>
                <p className="text-sm">Supported syntax includes `*`, comma lists, ranges, and step values like `*/15`.</p>
              </div>
            </div>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-3xl bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center gap-3">
              <Clock className="h-5 w-5 text-emerald-700" />
              <h2 className="text-xl font-bold text-gray-900">Field Builder</h2>
            </div>

            <div className="grid gap-4">
              {(Object.keys(fieldConfig) as CronFieldName[]).map((field) => (
                <div key={field} className="rounded-2xl bg-gray-50 p-4">
                  <label className="mb-2 block text-sm font-semibold text-gray-900">
                    {fieldConfig[field].label}
                  </label>
                  <input
                    value={parsed.fields ? parsed.fields[field] : ''}
                    onChange={(event) => updateField(field, event.target.value)}
                    className="w-full rounded-xl border border-emerald-200 bg-white px-3 py-2 font-mono text-sm outline-none focus:border-emerald-400"
                    placeholder="*"
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    {describeField(field, parsed.fields ? parsed.fields[field] : '*')}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-bold text-gray-900">Next 5 Runs</h2>
            <div className="space-y-3">
              {parsed.nextRuns.length === 0 ? (
                <p className="rounded-2xl bg-gray-50 px-4 py-4 text-sm text-gray-600">
                  Fix the cron expression to preview future schedules.
                </p>
              ) : (
                parsed.nextRuns.map((run) => (
                  <div key={run} className="rounded-2xl bg-emerald-50 px-4 py-4 text-sm font-medium text-emerald-900">
                    {run}
                  </div>
                ))
              )}
            </div>

            {parsed.fields && (
              <div className="mt-6 rounded-2xl bg-gray-50 p-5">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-600">Field Summary</h3>
                <ul className="mt-3 space-y-2 text-sm text-gray-700">
                  <li>{describeField('minute', parsed.fields.minute)}</li>
                  <li>{describeField('hour', parsed.fields.hour)}</li>
                  <li>{describeField('dayOfMonth', parsed.fields.dayOfMonth)}</li>
                  <li>{describeField('month', parsed.fields.month)}</li>
                  <li>{describeField('dayOfWeek', parsed.fields.dayOfWeek)}</li>
                </ul>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
