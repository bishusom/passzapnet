'use client'

import { useMemo, useState } from 'react'
import { FileText, Search } from 'lucide-react'

const mimeTypes = [
  { extension: '.json', mime: 'application/json', notes: 'JSON APIs and config files' },
  { extension: '.js', mime: 'text/javascript', notes: 'JavaScript source files' },
  { extension: '.mjs', mime: 'text/javascript', notes: 'ES module JavaScript files' },
  { extension: '.css', mime: 'text/css', notes: 'Stylesheets' },
  { extension: '.html', mime: 'text/html', notes: 'HTML documents' },
  { extension: '.txt', mime: 'text/plain', notes: 'Plain text files' },
  { extension: '.csv', mime: 'text/csv', notes: 'Comma-separated values' },
  { extension: '.xml', mime: 'application/xml', notes: 'XML documents and feeds' },
  { extension: '.yaml', mime: 'application/yaml', notes: 'YAML config files' },
  { extension: '.toml', mime: 'application/toml', notes: 'TOML config files' },
  { extension: '.pdf', mime: 'application/pdf', notes: 'Portable Document Format' },
  { extension: '.zip', mime: 'application/zip', notes: 'ZIP archives' },
  { extension: '.gz', mime: 'application/gzip', notes: 'Gzip-compressed files' },
  { extension: '.png', mime: 'image/png', notes: 'PNG images' },
  { extension: '.jpg', mime: 'image/jpeg', notes: 'JPEG images' },
  { extension: '.svg', mime: 'image/svg+xml', notes: 'SVG vector graphics' },
  { extension: '.webp', mime: 'image/webp', notes: 'WebP images' },
  { extension: '.mp3', mime: 'audio/mpeg', notes: 'MP3 audio' },
  { extension: '.wav', mime: 'audio/wav', notes: 'WAV audio' },
  { extension: '.mp4', mime: 'video/mp4', notes: 'MP4 video' },
  { extension: '.webm', mime: 'video/webm', notes: 'WebM media' },
  { extension: '.woff', mime: 'font/woff', notes: 'WOFF web fonts' },
  { extension: '.woff2', mime: 'font/woff2', notes: 'WOFF2 web fonts' },
  { extension: '.ttf', mime: 'font/ttf', notes: 'TrueType fonts' },
] as const

export default function MimeTypesTool() {
  const [query, setQuery] = useState('')

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return mimeTypes

    return mimeTypes.filter((item) =>
      item.extension.toLowerCase().includes(normalized) ||
      item.mime.toLowerCase().includes(normalized) ||
      item.notes.toLowerCase().includes(normalized)
    )
  }, [query])

  return (
    <div className="rounded-3xl bg-gradient-to-br from-amber-50 via-white to-orange-50 p-6">
      <div className="mb-8 flex items-start gap-4">
        <div className="rounded-2xl bg-amber-500 p-4 shadow-lg">
          <FileText className="h-7 w-7 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900">MIME Types Lookup</h2>
          <p className="mt-2 max-w-2xl text-gray-600">
            Search common content types and file extensions for web servers, uploads, and API responses.
          </p>
        </div>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-amber-100">
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search .svg, application/json, font, video, etc."
            className="w-full rounded-2xl border border-amber-200 bg-gray-50 py-3 pl-12 pr-4 text-sm text-gray-900 outline-none transition focus:border-amber-400 focus:bg-white"
          />
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-100">
          <div className="grid grid-cols-[120px,1fr,1fr] bg-amber-50 px-4 py-3 text-sm font-semibold text-gray-700">
            <span>Extension</span>
            <span>MIME Type</span>
            <span>Use Case</span>
          </div>
          {results.map((item) => (
            <div key={`${item.extension}-${item.mime}`} className="grid grid-cols-[120px,1fr,1fr] gap-4 border-t border-gray-100 px-4 py-3 text-sm text-gray-800">
              <code className="font-semibold text-amber-700">{item.extension}</code>
              <code className="overflow-x-auto">{item.mime}</code>
              <span>{item.notes}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
