'use client'

import { useMemo, useState } from 'react'
import { CheckCircle, Copy, RefreshCw, Type } from 'lucide-react'

const sampleText = 'free dev tools studio'

const splitWords = (value: string) => {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_./-]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
}

const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1)

const toTitleCase = (words: string[]) => words.map(word => capitalize(word)).join(' ')

const buildCases = (input: string) => {
  const words = splitWords(input).map(word => word.toLowerCase())

  if (words.length === 0) {
    return []
  }

  return [
    { label: 'camelCase', value: words[0] + words.slice(1).map(capitalize).join('') },
    { label: 'PascalCase', value: words.map(capitalize).join('') },
    { label: 'snake_case', value: words.join('_') },
    { label: 'kebab-case', value: words.join('-') },
    { label: 'CONSTANT_CASE', value: words.join('_').toUpperCase() },
    { label: 'dot.case', value: words.join('.') },
    { label: 'path/case', value: words.join('/') },
    { label: 'Title Case', value: toTitleCase(words) },
    { label: 'Sentence case', value: capitalize(words.join(' ')) },
  ]
}

export default function StringCaseConverterTool() {
  const [input, setInput] = useState(sampleText)
  const [copied, setCopied] = useState<string | null>(null)

  const cases = useMemo(() => buildCases(input), [input])

  const handleCopy = async (label: string, value: string) => {
    await navigator.clipboard.writeText(value)
    setCopied(label)
    window.setTimeout(() => setCopied(null), 1200)
  }

  return (
    <div className="rounded-3xl bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-6">
      <div className="mb-8 flex items-start gap-4">
        <div className="rounded-2xl bg-emerald-500 p-4 shadow-lg">
          <Type className="h-7 w-7 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900">String Case Converter</h2>
          <p className="mt-2 max-w-2xl text-gray-600">
            Convert text into common naming conventions for JavaScript, APIs, CSS classes, and documentation.
          </p>
        </div>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-emerald-100">
        <div className="mb-4 flex items-center justify-between gap-3">
          <label className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
            Input
          </label>
          <button
            onClick={() => setInput(sampleText)}
            className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 px-3 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-50"
          >
            <RefreshCw className="h-4 w-4" />
            Load Sample
          </button>
        </div>

        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          rows={5}
          placeholder="Paste any variable, slug, heading, or identifier here"
          className="w-full rounded-2xl border border-emerald-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-emerald-400 focus:bg-white"
        />

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {cases.map((item) => (
            <div key={item.label} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
              <div className="mb-2 flex items-center justify-between gap-3">
                <span className="text-sm font-semibold text-gray-700">{item.label}</span>
                <button
                  onClick={() => handleCopy(item.label, item.value)}
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 hover:border-emerald-200 hover:text-emerald-700"
                >
                  {copied === item.label ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied === item.label ? 'Copied' : 'Copy'}
                </button>
              </div>
              <code className="block overflow-x-auto rounded-xl bg-white px-3 py-3 text-sm text-gray-900 ring-1 ring-gray-100">
                {item.value}
              </code>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
