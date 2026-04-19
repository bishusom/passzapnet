'use client'

import { useMemo, useState } from 'react'
import { Code2, Link2, Package, RefreshCw, Search } from 'lucide-react'

type RegistryPackage = {
  name: string
  description?: string
  homepage?: string
  repository?: string | { type?: string; url?: string }
  license?: string
  keywords?: string[]
  time?: Record<string, string>
  versions?: Record<string, Record<string, any>>
  'dist-tags'?: { latest?: string }
  maintainers?: { name?: string; email?: string }[]
  readme?: string
}

const quickPackages = ['react', 'next', 'zod', 'lodash']

const formatBytes = (value?: number) => {
  if (typeof value !== 'number') return 'Unknown'
  if (value < 1024) return `${value} B`
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`
  return `${(value / (1024 * 1024)).toFixed(1)} MB`
}

export default function NpmPackageInspectorTool() {
  const [packageName, setPackageName] = useState('react')
  const [data, setData] = useState<RegistryPackage | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadPackage = async (value?: string) => {
    const name = (value ?? packageName).trim()
    if (!name) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`https://registry.npmjs.org/${encodeURIComponent(name)}`)
      if (!response.ok) {
        throw new Error(`Package not found (${response.status})`)
      }

      const json = (await response.json()) as RegistryPackage
      setData(json)
    } catch (fetchError) {
      setData(null)
      setError(fetchError instanceof Error ? fetchError.message : 'Failed to load package metadata')
    } finally {
      setLoading(false)
    }
  }

  const latestVersion = data?.['dist-tags']?.latest ?? null
  const latest = latestVersion && data?.versions ? data.versions[latestVersion] : null
  const dependencies = useMemo(
    () => Object.entries((latest?.dependencies ?? {}) as Record<string, string>) as [string, string][],
    [latest]
  )
  const peerDependencies = useMemo(
    () => Object.entries((latest?.peerDependencies ?? {}) as Record<string, string>) as [string, string][],
    [latest]
  )
  const packageKeywords = (data?.keywords ?? latest?.keywords ?? []) as string[]
  const publishedAt = latestVersion && data?.time ? data.time[latestVersion] : null
  const repositoryUrl =
    typeof data?.repository === 'string'
      ? data.repository
      : data?.repository?.url?.replace(/^git\+/, '').replace(/\.git$/, '')

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-3xl bg-white p-8 shadow-lg ring-1 ring-emerald-100">
          <div className="mb-6 flex items-start gap-4">
            <div className="rounded-2xl bg-emerald-100 p-4">
              <Package className="h-8 w-8 text-emerald-700" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">NPM Package Inspector</h1>
              <p className="mt-2 text-gray-600">
                Inspect npm registry metadata, latest versions, dependencies, release dates, and package links.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-[1fr_auto]">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-900">Package name</label>
              <input
                value={packageName}
                onChange={(event) => setPackageName(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') loadPackage()
                }}
                placeholder="react, next, @tailwindcss/forms..."
                className="w-full rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
              />
            </div>
            <button
              onClick={() => loadPackage()}
              className="inline-flex h-fit items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 font-medium text-white transition hover:bg-emerald-700"
            >
              <Search className="h-4 w-4" />
              Inspect
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {quickPackages.map((item) => (
              <button
                key={item}
                onClick={() => {
                  setPackageName(item)
                  loadPackage(item)
                }}
                className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100"
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="mb-6 rounded-2xl border border-emerald-100 bg-white p-6 text-sm text-gray-600 shadow-sm">
            Loading package metadata...
          </div>
        ) : null}

        {error ? (
          <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 p-6 text-sm font-medium text-red-700">
            {error}
          </div>
        ) : null}

        {data ? (
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <section className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-emerald-100">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{data.name}</h2>
                  <p className="mt-2 text-gray-600">{data.description || 'No description available.'}</p>
                </div>
                <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-right">
                  <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Latest</p>
                  <p className="mt-1 text-lg font-bold text-gray-900">{latestVersion || 'Unknown'}</p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">License</p>
                  <p className="mt-1 font-medium text-gray-900">{data.license || 'Unknown'}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Published</p>
                  <p className="mt-1 font-medium text-gray-900">{publishedAt ? new Date(publishedAt).toLocaleString() : 'Unknown'}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Maintainers</p>
                  <p className="mt-1 font-medium text-gray-900">{data.maintainers?.length ?? 0}</p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl bg-emerald-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Repository</p>
                  {repositoryUrl ? (
                    <a href={repositoryUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-emerald-700 hover:underline">
                      <Link2 className="h-4 w-4" />
                      {repositoryUrl}
                    </a>
                  ) : (
                    <p className="mt-2 text-sm text-gray-600">Unknown</p>
                  )}
                </div>
                <div className="rounded-2xl bg-emerald-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Homepage</p>
                  {data.homepage ? (
                    <a href={data.homepage} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-emerald-700 hover:underline">
                      <Link2 className="h-4 w-4" />
                      {data.homepage}
                    </a>
                  ) : (
                    <p className="mt-2 text-sm text-gray-600">Unknown</p>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-lg font-bold text-gray-900">Dependencies</h3>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    {dependencies.length}
                  </span>
                </div>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {dependencies.length > 0 ? (
                    dependencies.map(([name, version]) => (
                      <div key={name} className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-3">
                        <p className="font-medium text-gray-900">{name}</p>
                        <p className="mt-1 font-mono text-sm text-emerald-700">{version}</p>
                      </div>
                    ))
                  ) : (
                    <p className="rounded-2xl bg-slate-50 px-4 py-4 text-sm text-gray-600">No runtime dependencies listed.</p>
                  )}
                </div>
              </div>

              {peerDependencies.length > 0 ? (
                <div className="mt-6">
                  <h3 className="text-lg font-bold text-gray-900">Peer Dependencies</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {peerDependencies.map(([name, version]) => (
                      <span key={name} className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
                        {name} {version}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
            </section>

            <section className="space-y-6">
              <div className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-emerald-100">
                <h3 className="text-lg font-bold text-gray-900">Package Metrics</h3>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Unpacked size</p>
                    <p className="mt-1 text-lg font-bold text-gray-900">{formatBytes(latest?.dist?.unpackedSize)}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Version count</p>
                    <p className="mt-1 text-lg font-bold text-gray-900">{data.versions ? Object.keys(data.versions).length : 0}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-emerald-100">
                <h3 className="text-lg font-bold text-gray-900">Keywords</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {packageKeywords.length > 0 ? (
                    packageKeywords.map((keyword) => (
                      <span key={keyword} className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
                        {keyword}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-gray-600">No keywords listed.</p>
                  )}
                </div>
              </div>

              <div className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-emerald-100">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-lg font-bold text-gray-900">Readme Excerpt</h3>
                  <Code2 className="h-5 w-5 text-emerald-600" />
                </div>
                <pre className="mt-4 max-h-96 overflow-auto whitespace-pre-wrap rounded-2xl bg-slate-950 p-4 text-sm leading-6 text-slate-100">
                  {data.readme ? data.readme.slice(0, 1200) : 'No README available.'}
                </pre>
              </div>
            </section>
          </div>
        ) : null}
      </div>
    </div>
  )
}
