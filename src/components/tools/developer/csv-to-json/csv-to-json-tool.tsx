'use client'

import { useMemo, useState } from 'react'
import { Copy, Database, RefreshCw, TableProperties } from 'lucide-react'

const sampleCsv = `name,email,role,active\nAda,ada@example.com,admin,true\nGrace,grace@example.com,editor,false\nLinus,linus@example.com,viewer,true`

const parseCsvLine = (line: string) => {
  const values: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i]

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"'
        i += 1
      } else {
        inQuotes = !inQuotes
      }
      continue
    }

    if (char === ',' && !inQuotes) {
      values.push(current)
      current = ''
      continue
    }

    current += char
  }

  values.push(current)
  return values
}

export default function CsvToJsonTool() {
  const [csv, setCsv] = useState(sampleCsv)
  const [copied, setCopied] = useState(false)

  const result = useMemo(() => {
    try {
      const lines = csv.split('\n').map((line) => line.trim()).filter(Boolean)
      if (lines.length === 0) return { output: '[]', rows: 0, columns: 0, error: null }

      const headers = parseCsvLine(lines[0])
      const rows = lines.slice(1).map((line) => {
        const values = parseCsvLine(line)
        return headers.reduce<Record<string, string>>((acc, header, index) => {
          acc[header] = values[index] ?? ''
          return acc
        }, {})
      })

      return {
        output: JSON.stringify(rows, null, 2),
        rows: rows.length,
        columns: headers.length,
        error: null,
      }
    } catch (error) {
      return {
        output: '',
        rows: 0,
        columns: 0,
        error: error instanceof Error ? error.message : 'Unable to parse CSV.',
      }
    }
  }, [csv])

  const copyOutput = async () => {
    await navigator.clipboard.writeText(result.output)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-3xl bg-white p-8 shadow-lg">
          <div className="mb-6 flex items-center gap-4">
            <div className="rounded-2xl bg-emerald-100 p-4">
              <Database className="h-8 w-8 text-emerald-700" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">CSV to JSON Converter</h1>
              <p className="mt-2 text-gray-600">Turn CSV rows into formatted JSON arrays directly in your browser.</p>
            </div>
          </div>

          <textarea
            value={csv}
            onChange={(event) => setCsv(event.target.value)}
            rows={10}
            className="w-full rounded-2xl border border-emerald-200 bg-gray-50 px-4 py-3 font-mono text-sm outline-none focus:border-emerald-400 focus:bg-white"
            placeholder="Paste CSV here"
          />

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={() => setCsv(sampleCsv)}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-medium text-white hover:bg-emerald-700"
            >
              <RefreshCw className="h-4 w-4" />
              Load Example
            </button>
            <button
              onClick={() => setCsv('')}
              className="rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">Rows</p>
            <p className="mt-2 text-2xl font-bold text-gray-900">{result.rows}</p>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">Columns</p>
            <p className="mt-2 text-2xl font-bold text-gray-900">{result.columns}</p>
          </div>
        </div>

        <section className="rounded-3xl bg-white p-6 shadow-lg">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TableProperties className="h-5 w-5 text-emerald-700" />
              <h2 className="text-xl font-bold text-gray-900">JSON Output</h2>
            </div>
            <button
              onClick={copyOutput}
              disabled={!result.output}
              className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 px-3 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-50 disabled:opacity-50"
            >
              <Copy className="h-4 w-4" />
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>

          {result.error ? (
            <div className="rounded-2xl bg-red-50 px-4 py-4 text-sm text-red-800">{result.error}</div>
          ) : (
            <pre className="overflow-x-auto rounded-2xl bg-gray-950 p-4 text-sm text-emerald-100">{result.output}</pre>
          )}
        </section>
      </div>
    </div>
  )
}
