import type { Metadata } from 'next'
import { Download, FileText, Github, MonitorDown, ShieldAlert, Terminal } from 'lucide-react'

const downloadUrl = '/downloads/Buffer.dmg'
const sha256 = 'c8c91e3a19f4b79d2ed26cab48ff08e34d20cc897483396332968bd1c5129596'

export const metadata: Metadata = {
  title: 'Buffer for macOS - FreeDevTools Studio',
  description:
    'Download Buffer, a free open-source persistent scratchpad editor for macOS.',
  alternates: {
    canonical: 'https://freedevtools.studio/buffer',
  },
  openGraph: {
    title: 'Buffer for macOS',
    description:
      'A free open-source persistent scratchpad editor for macOS from FreeDevTools Studio.',
    url: 'https://freedevtools.studio/buffer',
    siteName: 'FreeDevTools Studio',
    type: 'website',
  },
}

export default function BufferPage() {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#ecfdf5_0%,#ffffff_45%,#f8fafc_100%)]">
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm">
              <MonitorDown className="h-4 w-4" />
              Free macOS app
            </div>
            <h1 className="max-w-3xl text-5xl font-bold tracking-tight text-gray-900 md:text-6xl">
              Buffer
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-600">
              A lightweight persistent scratchpad editor for macOS. Keep quick notes, snippets,
              drafts, and temporary text in a fast native desktop app.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a
                href={downloadUrl}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-4 font-semibold text-white shadow-lg shadow-emerald-200 transition-colors hover:bg-emerald-700"
              >
                <Download className="h-5 w-5" />
                Download Buffer.dmg
              </a>
              <a
                href="https://github.com/bishusom/buffer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-white px-6 py-4 font-semibold text-emerald-700 transition-colors hover:border-emerald-300 hover:bg-emerald-50"
              >
                <Github className="h-5 w-5" />
                Source Code
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-xl shadow-emerald-100">
            <div className="rounded-xl border border-gray-200 bg-gray-950 p-4 text-sm text-gray-100">
              <div className="mb-4 flex gap-2">
                <span className="h-3 w-3 rounded-full bg-red-400" />
                <span className="h-3 w-3 rounded-full bg-yellow-400" />
                <span className="h-3 w-3 rounded-full bg-green-400" />
              </div>
              <div className="space-y-3 font-mono">
                <p className="text-emerald-300">Buffer</p>
                <p>Untitled.txt</p>
                <p className="text-gray-400">Quick notes stay ready between sessions.</p>
                <p className="text-gray-400">Use it for snippets, drafts, and temporary edits.</p>
                <p className="text-emerald-300">Status: saved locally</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <FileText className="mb-4 h-6 w-6 text-emerald-600" />
            <h2 className="text-xl font-semibold text-gray-900">Open source</h2>
            <p className="mt-3 text-sm leading-6 text-gray-600">
              Buffer is released for public use with source availability and third-party notices
              included in the project.
            </p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <Terminal className="mb-4 h-6 w-6 text-emerald-600" />
            <h2 className="text-xl font-semibold text-gray-900">Verify the download</h2>
            <p className="mt-3 text-sm leading-6 text-gray-600">
              SHA-256:
            </p>
            <p className="mt-3 break-all rounded-lg bg-gray-50 p-3 font-mono text-xs text-gray-700">
              {sha256}
            </p>
          </div>
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
            <ShieldAlert className="mb-4 h-6 w-6 text-amber-700" />
            <h2 className="text-xl font-semibold text-gray-900">Unsigned macOS build</h2>
            <p className="mt-3 text-sm leading-6 text-gray-700">
              This free build is not Apple Developer ID signed. If macOS blocks first launch,
              open System Settings, go to Privacy & Security, and choose Open Anyway for Buffer.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
