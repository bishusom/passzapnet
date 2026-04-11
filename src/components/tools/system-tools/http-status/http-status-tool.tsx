'use client'

import { useMemo, useState } from 'react'
import { Monitor, Search } from 'lucide-react'

const statuses = [
  { code: 100, title: 'Continue', category: 'Informational', summary: 'Initial request received, continue sending the body.' },
  { code: 101, title: 'Switching Protocols', category: 'Informational', summary: 'Server accepted a protocol upgrade request.' },
  { code: 200, title: 'OK', category: 'Success', summary: 'Standard successful response with the requested resource.' },
  { code: 201, title: 'Created', category: 'Success', summary: 'A resource was created successfully.' },
  { code: 202, title: 'Accepted', category: 'Success', summary: 'The request was accepted for later processing.' },
  { code: 204, title: 'No Content', category: 'Success', summary: 'The request succeeded and there is no body to return.' },
  { code: 206, title: 'Partial Content', category: 'Success', summary: 'Server is returning a requested byte range.' },
  { code: 301, title: 'Moved Permanently', category: 'Redirection', summary: 'Resource has a permanent new URL.' },
  { code: 302, title: 'Found', category: 'Redirection', summary: 'Temporary redirect to another location.' },
  { code: 304, title: 'Not Modified', category: 'Redirection', summary: 'Cached version can be reused.' },
  { code: 307, title: 'Temporary Redirect', category: 'Redirection', summary: 'Temporary redirect that preserves the HTTP method.' },
  { code: 308, title: 'Permanent Redirect', category: 'Redirection', summary: 'Permanent redirect that preserves the HTTP method.' },
  { code: 400, title: 'Bad Request', category: 'Client Error', summary: 'The request is malformed or invalid.' },
  { code: 401, title: 'Unauthorized', category: 'Client Error', summary: 'Authentication is required or has failed.' },
  { code: 403, title: 'Forbidden', category: 'Client Error', summary: 'The client is authenticated but not allowed.' },
  { code: 404, title: 'Not Found', category: 'Client Error', summary: 'The requested resource could not be found.' },
  { code: 405, title: 'Method Not Allowed', category: 'Client Error', summary: 'The endpoint does not support the HTTP method used.' },
  { code: 408, title: 'Request Timeout', category: 'Client Error', summary: 'The server timed out waiting for the request.' },
  { code: 409, title: 'Conflict', category: 'Client Error', summary: 'The request conflicts with current resource state.' },
  { code: 410, title: 'Gone', category: 'Client Error', summary: 'The resource has been permanently removed.' },
  { code: 412, title: 'Precondition Failed', category: 'Client Error', summary: 'A required conditional header check failed.' },
  { code: 413, title: 'Content Too Large', category: 'Client Error', summary: 'The payload is too large for the server to accept.' },
  { code: 415, title: 'Unsupported Media Type', category: 'Client Error', summary: 'The server does not support the payload format.' },
  { code: 418, title: "I'm a Teapot", category: 'Client Error', summary: 'An Easter egg response defined by RFC 2324.' },
  { code: 422, title: 'Unprocessable Content', category: 'Client Error', summary: 'The payload is well-formed but semantically invalid.' },
  { code: 429, title: 'Too Many Requests', category: 'Client Error', summary: 'Rate limiting or throttling has been triggered.' },
  { code: 500, title: 'Internal Server Error', category: 'Server Error', summary: 'Generic server-side failure.' },
  { code: 501, title: 'Not Implemented', category: 'Server Error', summary: 'Server does not support the requested functionality.' },
  { code: 502, title: 'Bad Gateway', category: 'Server Error', summary: 'An upstream service returned an invalid response.' },
  { code: 503, title: 'Service Unavailable', category: 'Server Error', summary: 'Service is overloaded or down for maintenance.' },
  { code: 504, title: 'Gateway Timeout', category: 'Server Error', summary: 'An upstream service failed to respond in time.' },
  { code: 507, title: 'Insufficient Storage', category: 'Server Error', summary: 'Server cannot store the representation needed to complete the request.' },
  { code: 511, title: 'Network Authentication Required', category: 'Server Error', summary: 'Client must authenticate to gain network access.' },
] as const

const categoryStyles: Record<string, string> = {
  Informational: 'bg-sky-50 text-sky-700',
  Success: 'bg-emerald-50 text-emerald-700',
  Redirection: 'bg-amber-50 text-amber-700',
  'Client Error': 'bg-rose-50 text-rose-700',
  'Server Error': 'bg-violet-50 text-violet-700',
}

export default function HttpStatusTool() {
  const [query, setQuery] = useState('')

  const filteredStatuses = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) return statuses

    return statuses.filter((status) =>
      status.code.toString().includes(normalizedQuery) ||
      status.title.toLowerCase().includes(normalizedQuery) ||
      status.category.toLowerCase().includes(normalizedQuery) ||
      status.summary.toLowerCase().includes(normalizedQuery)
    )
  }, [query])

  return (
    <div className="rounded-3xl bg-gradient-to-br from-orange-50 via-white to-amber-50 p-6">
      <div className="mb-8 flex items-start gap-4">
        <div className="rounded-2xl bg-orange-500 p-4 shadow-lg">
          <Monitor className="h-7 w-7 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900">HTTP Status Code Reference</h2>
          <p className="mt-2 max-w-2xl text-gray-600">
            Search standard HTTP response codes and keep the common meanings close at hand while debugging APIs and web apps.
          </p>
        </div>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-orange-100">
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by code, title, or category"
            className="w-full rounded-2xl border border-orange-200 bg-gray-50 py-3 pl-12 pr-4 text-sm text-gray-900 outline-none transition focus:border-orange-400 focus:bg-white"
          />
        </div>

        <div className="grid gap-4">
          {filteredStatuses.map((status) => (
            <article key={status.code} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-white px-3 py-2 text-lg font-bold text-gray-900 ring-1 ring-gray-100">
                    {status.code}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{status.title}</h3>
                    <p className="text-sm text-gray-600">{status.summary}</p>
                  </div>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${categoryStyles[status.category]}`}>
                  {status.category}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
