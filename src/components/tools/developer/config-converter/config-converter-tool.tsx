'use client'

import { useMemo, useState } from 'react'
import { AlertCircle, Braces, CheckCircle, Copy, RefreshCw } from 'lucide-react'

type Format = 'json' | 'yaml' | 'toml'
type Primitive = string | number | boolean | null
type JsonValue = Primitive | JsonValue[] | { [key: string]: JsonValue }

const sampleJson = `{
  "app": {
    "name": "FreeDevTools Studio",
    "port": 3000,
    "enabled": true
  },
  "features": ["search", "converters", "media-tools"]
}`

const getLeadingSpaces = (value: string) => value.length - value.trimStart().length

const parseScalar = (value: string): JsonValue => {
  const trimmed = value.trim()
  if (trimmed === 'true') return true
  if (trimmed === 'false') return false
  if (trimmed === 'null') return null
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) return Number(trimmed)
  if (trimmed.startsWith('"') && trimmed.endsWith('"')) return trimmed.slice(1, -1)
  if (trimmed.startsWith("'") && trimmed.endsWith("'")) return trimmed.slice(1, -1)
  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    const body = trimmed.slice(1, -1).trim()
    if (!body) return []
    return body.split(',').map(part => parseScalar(part))
  }
  return trimmed
}

const parseYaml = (input: string): JsonValue => {
  const lines = input
    .split('\n')
    .map(line => line.replace(/\t/g, '  '))
    .filter(line => line.trim() !== '' && !line.trim().startsWith('#'))

  const root: Record<string, JsonValue> = {}
  const stack: Array<{ indent: number; value: Record<string, JsonValue> | JsonValue[] }> = [{ indent: -1, value: root }]

  for (let index = 0; index < lines.length; index += 1) {
    const rawLine = lines[index]
    const indent = getLeadingSpaces(rawLine)
    const line = rawLine.trim()

    while (stack.length > 1 && indent <= stack[stack.length - 1].indent) {
      stack.pop()
    }

    const parent = stack[stack.length - 1].value

    if (line.startsWith('- ')) {
      if (!Array.isArray(parent)) {
        throw new Error('Unsupported YAML structure. Arrays must be nested under a key.')
      }
      parent.push(parseScalar(line.slice(2)))
      continue
    }

    const separatorIndex = line.indexOf(':')
    if (separatorIndex === -1) {
      throw new Error('Invalid YAML line. Expected key: value format.')
    }

    const key = line.slice(0, separatorIndex).trim()
    const rawValue = line.slice(separatorIndex + 1).trim()
    const nextLine = lines[index + 1]?.trim() ?? ''

    if (rawValue === '') {
      const child: Record<string, JsonValue> | JsonValue[] = nextLine.startsWith('- ') ? [] : {}
      if (Array.isArray(parent)) {
        throw new Error('Nested object arrays are not supported in this converter.')
      }
      parent[key] = child
      stack.push({ indent, value: child })
      continue
    }

    if (Array.isArray(parent)) {
      throw new Error('Nested object arrays are not supported in this converter.')
    }
    parent[key] = parseScalar(rawValue)
  }

  return root
}

const parseToml = (input: string): JsonValue => {
  const root: Record<string, JsonValue> = {}
  let current: Record<string, JsonValue> = root

  input.split('\n').forEach((rawLine) => {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) return

    if (line.startsWith('[') && line.endsWith(']')) {
      const path = line.slice(1, -1).split('.').map(part => part.trim()).filter(Boolean)
      current = root

      path.forEach((segment) => {
        const existing = current[segment]
        if (!existing || Array.isArray(existing) || typeof existing !== 'object') {
          current[segment] = {}
        }
        current = current[segment] as Record<string, JsonValue>
      })
      return
    }

    const equalsIndex = line.indexOf('=')
    if (equalsIndex === -1) {
      throw new Error('Invalid TOML line. Expected key = value format.')
    }

    const key = line.slice(0, equalsIndex).trim()
    const value = line.slice(equalsIndex + 1).trim()
    current[key] = parseScalar(value)
  })

  return root
}

const parseInput = (input: string, format: Format): JsonValue => {
  if (format === 'json') return JSON.parse(input) as JsonValue
  if (format === 'yaml') return parseYaml(input)
  return parseToml(input)
}

const formatPrimitive = (value: Primitive) => {
  if (typeof value === 'string') return JSON.stringify(value)
  if (value === null) return 'null'
  return String(value)
}

const toYaml = (value: JsonValue, indent = 0): string => {
  const spacing = '  '.repeat(indent)

  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (item !== null && typeof item === 'object') {
          return `${spacing}-\n${toYaml(item, indent + 1)}`
        }
        return `${spacing}- ${formatPrimitive(item as Primitive)}`
      })
      .join('\n')
  }

  if (value !== null && typeof value === 'object') {
    return Object.entries(value)
      .map(([key, item]) => {
        if (item !== null && typeof item === 'object') {
          return `${spacing}${key}:\n${toYaml(item, indent + 1)}`
        }
        return `${spacing}${key}: ${formatPrimitive(item as Primitive)}`
      })
      .join('\n')
  }

  return `${spacing}${formatPrimitive(value)}`
}

const formatTomlValue = (value: JsonValue): string => {
  if (Array.isArray(value)) return `[${value.map(item => formatTomlValue(item)).join(', ')}]`
  if (value !== null && typeof value === 'object') return JSON.stringify(value)
  return formatPrimitive(value)
}

const toToml = (value: JsonValue): string => {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('TOML output requires an object at the top level.')
  }

  const lines: string[] = []

  const walk = (objectValue: Record<string, JsonValue>, path: string[] = []) => {
    const scalarEntries = Object.entries(objectValue).filter(([, item]) => item === null || typeof item !== 'object' || Array.isArray(item))
    const objectEntries = Object.entries(objectValue).filter(([, item]) => item !== null && typeof item === 'object' && !Array.isArray(item))

    if (path.length > 0) {
      lines.push(`[${path.join('.')}]`)
    }

    scalarEntries.forEach(([key, item]) => {
      lines.push(`${key} = ${formatTomlValue(item)}`)
    })

    if (scalarEntries.length > 0 && objectEntries.length > 0) {
      lines.push('')
    }

    objectEntries.forEach(([key, item], index) => {
      walk(item as Record<string, JsonValue>, [...path, key])
      if (index < objectEntries.length - 1) lines.push('')
    })
  }

  walk(value)
  return lines.join('\n').trim()
}

const serializeOutput = (value: JsonValue, format: Format) => {
  if (format === 'json') return JSON.stringify(value, null, 2)
  if (format === 'yaml') return toYaml(value)
  return toToml(value)
}

export default function ConfigConverterTool() {
  const [sourceFormat, setSourceFormat] = useState<Format>('json')
  const [targetFormat, setTargetFormat] = useState<Format>('yaml')
  const [input, setInput] = useState(sampleJson)
  const [copied, setCopied] = useState(false)

  const result = useMemo(() => {
    try {
      const parsed = parseInput(input, sourceFormat)
      return {
        output: serializeOutput(parsed, targetFormat),
        error: '',
      }
    } catch (error) {
      return {
        output: '',
        error: error instanceof Error ? error.message : 'Unable to convert this input.',
      }
    }
  }, [input, sourceFormat, targetFormat])

  const handleCopy = async () => {
    if (!result.output) return
    await navigator.clipboard.writeText(result.output)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1200)
  }

  return (
    <div className="rounded-3xl bg-gradient-to-br from-emerald-50 via-white to-cyan-50 p-6">
      <div className="mb-8 flex items-start gap-4">
        <div className="rounded-2xl bg-emerald-600 p-4 shadow-lg">
          <Braces className="h-7 w-7 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900">YAML JSON TOML Converter</h2>
          <p className="mt-2 max-w-2xl text-gray-600">
            Convert common config snippets between JSON, YAML, and TOML. Nested objects and scalar arrays are supported.
          </p>
        </div>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-[1fr,auto,1fr]">
        <select value={sourceFormat} onChange={(event) => setSourceFormat(event.target.value as Format)} className="rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-sm font-medium text-gray-900">
          <option value="json">Source: JSON</option>
          <option value="yaml">Source: YAML</option>
          <option value="toml">Source: TOML</option>
        </select>
        <button
          onClick={() => {
            setSourceFormat(targetFormat)
            setTargetFormat(sourceFormat)
            setInput(result.output || input)
          }}
          className="rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-sm font-medium text-emerald-700 hover:bg-emerald-50"
        >
          Switch
        </button>
        <select value={targetFormat} onChange={(event) => setTargetFormat(event.target.value as Format)} className="rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-sm font-medium text-gray-900">
          <option value="json">Target: JSON</option>
          <option value="yaml">Target: YAML</option>
          <option value="toml">Target: TOML</option>
        </select>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-emerald-100">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Input</h3>
            <button
              onClick={() => setInput(sampleJson)}
              className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 px-3 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-50"
            >
              <RefreshCw className="h-4 w-4" />
              Load Sample
            </button>
          </div>
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            rows={16}
            className="w-full rounded-2xl border border-emerald-200 bg-gray-50 px-4 py-3 font-mono text-sm text-gray-900 outline-none transition focus:border-emerald-400 focus:bg-white"
          />
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-emerald-100">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Output</h3>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
            >
              {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>

          {result.error ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Conversion warning</p>
                  <p className="mt-1">{result.error}</p>
                </div>
              </div>
            </div>
          ) : (
            <pre className="min-h-[22rem] overflow-x-auto rounded-2xl bg-gray-950 p-4 text-sm text-emerald-100">
              {result.output}
            </pre>
          )}
        </section>
      </div>
    </div>
  )
}
