'use client'

import { useMemo, useState } from 'react'
import { CheckCircle, Combine, Copy, ListFilter } from 'lucide-react'

const sampleList = `apple
banana
banana
cherry`

const quote = (value: string) => `'${value.replace(/'/g, "\\'")}'`

export default function ListConverterTool() {
  const [input, setInput] = useState(sampleList)
  const [trimItems, setTrimItems] = useState(true)
  const [removeEmpty, setRemoveEmpty] = useState(true)
  const [dedupe, setDedupe] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  const toggleOptions = [
    { label: 'Trim Items', checked: trimItems, setter: setTrimItems },
    { label: 'Remove Empty', checked: removeEmpty, setter: setRemoveEmpty },
    { label: 'Deduplicate', checked: dedupe, setter: setDedupe },
  ]

  const items = useMemo(() => {
    const parsed = input.split('\n').map(item => trimItems ? item.trim() : item)
    const withoutEmpty = removeEmpty ? parsed.filter(Boolean) : parsed
    return dedupe ? Array.from(new Set(withoutEmpty)) : withoutEmpty
  }, [dedupe, input, removeEmpty, trimItems])

  const outputs = useMemo(() => {
    return [
      { label: 'Comma Separated', value: items.join(', ') },
      { label: 'Quoted CSV', value: items.map(quote).join(', ') },
      { label: 'JSON Array', value: JSON.stringify(items, null, 2) },
      { label: 'SQL IN (...)', value: `(${items.map(quote).join(', ')})` },
    ]
  }, [items])

  const handleCopy = async (label: string, value: string) => {
    await navigator.clipboard.writeText(value)
    setCopied(label)
    window.setTimeout(() => setCopied(null), 1200)
  }

  return (
    <div className="rounded-3xl bg-gradient-to-br from-amber-50 via-white to-emerald-50 p-6">
      <div className="mb-8 flex items-start gap-4">
        <div className="rounded-2xl bg-amber-500 p-4 shadow-lg">
          <Combine className="h-7 w-7 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900">List Converter</h2>
          <p className="mt-2 max-w-2xl text-gray-600">
            Transform line-separated values into CSV, JSON arrays, SQL fragments, and quoted lists without leaving the browser.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
        <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-emerald-100">
          <div className="mb-4 flex items-center gap-2">
            <ListFilter className="h-5 w-5 text-emerald-700" />
            <h3 className="text-lg font-semibold text-gray-900">Source List</h3>
          </div>
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            rows={14}
            className="w-full rounded-2xl border border-emerald-200 bg-gray-50 px-4 py-3 font-mono text-sm text-gray-900 outline-none transition focus:border-emerald-400 focus:bg-white"
            placeholder="Enter one item per line"
          />

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {toggleOptions.map((option) => (
              <label key={option.label} className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={option.checked}
                  onChange={(event) => option.setter(event.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          {outputs.map((output) => (
            <div key={output.label} className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-emerald-100">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="text-base font-semibold text-gray-900">{output.label}</h3>
                <button
                  onClick={() => handleCopy(output.label, output.value)}
                  className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 px-3 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-50"
                >
                  {copied === output.label ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied === output.label ? 'Copied' : 'Copy'}
                </button>
              </div>
              <pre className="overflow-x-auto rounded-2xl bg-gray-950 p-4 text-sm text-emerald-100">
                {output.value || '// Output will appear here'}
              </pre>
            </div>
          ))}
        </section>
      </div>
    </div>
  )
}
