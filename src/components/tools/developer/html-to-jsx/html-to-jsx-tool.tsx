'use client'

import { useMemo, useState } from 'react'
import { CheckCircle, Copy, FileCode, RefreshCw } from 'lucide-react'

const sampleHtml = `<label for="email" class="field">
  <span data-test-id="email-label">Email Address</span>
  <input type="email" tabindex="0" readonly />
</label>`

const attributeMap: Record<string, string> = {
  'class=': 'className=',
  'for=': 'htmlFor=',
  'tabindex=': 'tabIndex=',
  'readonly': 'readOnly',
  'maxlength=': 'maxLength=',
  'minlength=': 'minLength=',
  'autocomplete=': 'autoComplete=',
  'autofocus': 'autoFocus',
  'contenteditable': 'contentEditable',
  'colspan=': 'colSpan=',
  'rowspan=': 'rowSpan=',
  'srcset=': 'srcSet=',
}

const selfClosingTags = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']

const convertHtmlToJsx = (html: string) => {
  let output = html.trim()

  Object.entries(attributeMap).forEach(([from, to]) => {
    output = output.split(from).join(to)
  })

  output = output.replace(/style="([^"]*)"/g, (_, styleValue: string) => {
    const entries = styleValue
      .split(';')
      .map(part => part.trim())
      .filter(Boolean)
      .map(part => {
        const [property, value] = part.split(':').map(piece => piece.trim())
        if (!property || !value) return null
        return `${property.replace(/-([a-z])/g, (_, char: string) => char.toUpperCase())}: '${value}'`
      })
      .filter(Boolean)

    return entries.length > 0 ? `style={{ ${entries.join(', ')} }}` : ''
  })

  selfClosingTags.forEach((tag) => {
    const pattern = new RegExp(`<${tag}([^>]*)></${tag}>`, 'gi')
    output = output.replace(pattern, `<${tag}$1 />`)
    const plainPattern = new RegExp(`<${tag}([^>]*)>`, 'gi')
    output = output.replace(plainPattern, (match) => (match.endsWith('/>') ? match : match.replace(/>$/, ' />')))
  })

  return output
}

export default function HtmlToJsxTool() {
  const [input, setInput] = useState(sampleHtml)
  const [copied, setCopied] = useState(false)
  const output = useMemo(() => convertHtmlToJsx(input), [input])

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1200)
  }

  return (
    <div className="rounded-3xl bg-gradient-to-br from-cyan-50 via-white to-emerald-50 p-6">
      <div className="mb-8 flex items-start gap-4">
        <div className="rounded-2xl bg-cyan-600 p-4 shadow-lg">
          <FileCode className="h-7 w-7 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900">HTML to JSX</h2>
          <p className="mt-2 max-w-2xl text-gray-600">
            Convert raw HTML snippets into React-friendly JSX with common attribute fixes and self-closing tags.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-emerald-100">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-gray-900">HTML Input</h3>
            <button
              onClick={() => setInput(sampleHtml)}
              className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 px-3 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-50"
            >
              <RefreshCw className="h-4 w-4" />
              Load Sample
            </button>
          </div>
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            rows={14}
            className="w-full rounded-2xl border border-emerald-200 bg-gray-50 px-4 py-3 font-mono text-sm text-gray-900 outline-none transition focus:border-emerald-400 focus:bg-white"
            placeholder="Paste HTML markup here"
          />
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-emerald-100">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-gray-900">JSX Output</h3>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
            >
              {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Copied' : 'Copy JSX'}
            </button>
          </div>
          <pre className="min-h-[22rem] overflow-x-auto rounded-2xl bg-gray-950 p-4 text-sm text-emerald-100">
            {output || '// JSX output will appear here'}
          </pre>
          <p className="mt-4 text-sm text-gray-500">
            This converter handles common attribute changes, but complex templates may still need manual cleanup.
          </p>
        </section>
      </div>
    </div>
  )
}
