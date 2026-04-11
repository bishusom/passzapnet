'use client'

import { useMemo, useState } from 'react'
import { CheckCircle, Copy, Globe } from 'lucide-react'

const sampleUserAgent =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'

const browserMatchers = [
  { name: 'Edge', regex: /Edg\/([\d.]+)/ },
  { name: 'Chrome', regex: /Chrome\/([\d.]+)/ },
  { name: 'Firefox', regex: /Firefox\/([\d.]+)/ },
  { name: 'Safari', regex: /Version\/([\d.]+).*Safari/ },
]

const engineMatchers = [
  { name: 'Blink', regex: /Chrome\/|Edg\// },
  { name: 'WebKit', regex: /AppleWebKit\// },
  { name: 'Gecko', regex: /Gecko\/|Firefox\// },
]

const osMatchers = [
  { name: 'Windows', regex: /Windows NT ([\d.]+)/ },
  { name: 'macOS', regex: /Mac OS X ([\d_]+)/ },
  { name: 'iOS', regex: /iPhone OS ([\d_]+)/ },
  { name: 'Android', regex: /Android ([\d.]+)/ },
  { name: 'Linux', regex: /Linux/ },
]

const deviceType = (ua: string) => {
  if (/Tablet|iPad/.test(ua)) return 'Tablet'
  if (/Mobile|iPhone|Android/.test(ua)) return 'Mobile'
  return 'Desktop'
}

const getMatch = (ua: string, matchers: Array<{ name: string; regex: RegExp }>) => {
  for (const matcher of matchers) {
    const match = ua.match(matcher.regex)
    if (match) {
      return {
        name: matcher.name,
        version: match[1] ? match[1].replace(/_/g, '.') : 'Detected',
      }
    }
  }

  return {
    name: 'Unknown',
    version: 'Unknown',
  }
}

export default function UserAgentParserTool() {
  const [input, setInput] = useState(sampleUserAgent)
  const [copied, setCopied] = useState<string | null>(null)

  const details = useMemo(() => {
    const browser = getMatch(input, browserMatchers)
    const engine = getMatch(input, engineMatchers)
    const os = getMatch(input, osMatchers)

    return [
      { label: 'Browser', value: `${browser.name} ${browser.version}`.trim() },
      { label: 'Engine', value: engine.name },
      { label: 'Operating System', value: `${os.name} ${os.version}`.trim() },
      { label: 'Device Type', value: deviceType(input) },
      { label: 'Bot Hint', value: /bot|crawler|spider|slurp/i.test(input) ? 'Likely bot/crawler' : 'No bot markers found' },
    ]
  }, [input])

  const handleCopy = async (label: string, value: string) => {
    await navigator.clipboard.writeText(value)
    setCopied(label)
    window.setTimeout(() => setCopied(null), 1200)
  }

  return (
    <div className="rounded-3xl bg-gradient-to-br from-orange-50 via-white to-sky-50 p-6">
      <div className="mb-8 flex items-start gap-4">
        <div className="rounded-2xl bg-orange-500 p-4 shadow-lg">
          <Globe className="h-7 w-7 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900">User-Agent Parser</h2>
          <p className="mt-2 max-w-2xl text-gray-600">
            Inspect raw user-agent strings to identify likely browser, engine, operating system, and device type.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
        <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-orange-100">
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            rows={8}
            className="w-full rounded-2xl border border-orange-200 bg-gray-50 px-4 py-3 font-mono text-sm text-gray-900 outline-none transition focus:border-orange-400 focus:bg-white"
            placeholder="Paste a user-agent string here"
          />
        </section>

        <section className="space-y-4">
          {details.map((detail) => (
            <div key={detail.label} className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-orange-100">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="text-base font-semibold text-gray-900">{detail.label}</h3>
                <button
                  onClick={() => handleCopy(detail.label, detail.value)}
                  className="inline-flex items-center gap-2 rounded-xl border border-orange-200 px-3 py-2 text-sm font-medium text-orange-700 hover:bg-orange-50"
                >
                  {copied === detail.label ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied === detail.label ? 'Copied' : 'Copy'}
                </button>
              </div>
              <p className="rounded-2xl bg-gray-50 px-4 py-3 text-sm text-gray-800">{detail.value}</p>
            </div>
          ))}
        </section>
      </div>
    </div>
  )
}
