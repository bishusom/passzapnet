'use client'

import { useMemo, useState } from 'react'
import { BookOpen, Copy, Eye, RefreshCw } from 'lucide-react'

const sampleMarkdown = `# Markdown Preview

Write notes, docs, or snippets in **Markdown**.

## Features

- Live preview
- Headings and paragraphs
- Lists and blockquotes
- \`inline code\`

> This preview is intentionally lightweight and browser-native.

\`\`\`
const hello = 'world'
console.log(hello)
\`\`\`
`

const escapeHtml = (input: string) =>
  input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

const renderInline = (input: string) =>
  escapeHtml(input)
    .replace(/`([^`]+)`/g, '<code class="rounded bg-gray-100 px-1.5 py-0.5 text-sm">$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')

const renderMarkdown = (source: string) => {
  const lines = source.split('\n')
  const output: string[] = []
  let inCode = false
  let listOpen = false

  const closeList = () => {
    if (listOpen) {
      output.push('</ul>')
      listOpen = false
    }
  }

  for (const line of lines) {
    if (line.trim().startsWith('```')) {
      closeList()
      output.push(inCode ? '</code></pre>' : '<pre class="overflow-x-auto rounded-2xl bg-gray-950 p-4 text-sm text-emerald-100"><code>')
      inCode = !inCode
      continue
    }

    if (inCode) {
      output.push(`${escapeHtml(line)}\n`)
      continue
    }

    if (!line.trim()) {
      closeList()
      continue
    }

    if (line.startsWith('# ')) {
      closeList()
      output.push(`<h1 class="mt-6 text-3xl font-bold text-gray-900">${renderInline(line.slice(2))}</h1>`)
      continue
    }
    if (line.startsWith('## ')) {
      closeList()
      output.push(`<h2 class="mt-5 text-2xl font-bold text-gray-900">${renderInline(line.slice(3))}</h2>`)
      continue
    }
    if (line.startsWith('### ')) {
      closeList()
      output.push(`<h3 class="mt-4 text-xl font-semibold text-gray-900">${renderInline(line.slice(4))}</h3>`)
      continue
    }
    if (line.startsWith('- ')) {
      if (!listOpen) {
        output.push('<ul class="my-4 list-disc space-y-2 pl-6 text-gray-700">')
        listOpen = true
      }
      output.push(`<li>${renderInline(line.slice(2))}</li>`)
      continue
    }
    if (line.startsWith('> ')) {
      closeList()
      output.push(`<blockquote class="my-4 border-l-4 border-emerald-300 pl-4 italic text-gray-700">${renderInline(line.slice(2))}</blockquote>`)
      continue
    }

    closeList()
    output.push(`<p class="my-4 leading-7 text-gray-700">${renderInline(line)}</p>`)
  }

  closeList()
  if (inCode) output.push('</code></pre>')
  return output.join('')
}

export default function MarkdownPreviewTool() {
  const [markdown, setMarkdown] = useState(sampleMarkdown)
  const [copied, setCopied] = useState(false)

  const rendered = useMemo(() => renderMarkdown(markdown), [markdown])

  const copyMarkdown = async () => {
    await navigator.clipboard.writeText(markdown)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-3xl bg-white p-8 shadow-lg">
          <div className="mb-6 flex items-center gap-4">
            <div className="rounded-2xl bg-emerald-100 p-4">
              <BookOpen className="h-8 w-8 text-emerald-700" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Markdown Preview</h1>
              <p className="mt-2 text-gray-600">Write Markdown on the left and preview the rendered output on the right.</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setMarkdown(sampleMarkdown)}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-medium text-white hover:bg-emerald-700"
            >
              <RefreshCw className="h-4 w-4" />
              Load Example
            </button>
            <button
              onClick={copyMarkdown}
              className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 px-4 py-3 text-sm font-medium text-emerald-700 hover:bg-emerald-50"
            >
              <Copy className="h-4 w-4" />
              {copied ? 'Copied' : 'Copy Markdown'}
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-3xl bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center gap-3">
              <BookOpen className="h-5 w-5 text-emerald-700" />
              <h2 className="text-xl font-bold text-gray-900">Markdown Source</h2>
            </div>
            <textarea
              value={markdown}
              onChange={(event) => setMarkdown(event.target.value)}
              rows={20}
              className="w-full rounded-2xl border border-emerald-200 bg-gray-50 px-4 py-3 font-mono text-sm outline-none focus:border-emerald-400 focus:bg-white"
              placeholder="Write Markdown here"
            />
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center gap-3">
              <Eye className="h-5 w-5 text-emerald-700" />
              <h2 className="text-xl font-bold text-gray-900">Preview</h2>
            </div>
            <div
              className="prose prose-emerald max-w-none rounded-2xl border border-emerald-100 bg-white p-4"
              dangerouslySetInnerHTML={{ __html: rendered }}
            />
          </section>
        </div>
      </div>
    </div>
  )
}
