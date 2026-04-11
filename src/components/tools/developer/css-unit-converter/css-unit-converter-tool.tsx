'use client'

import { useMemo, useState } from 'react'
import { CheckCircle, Copy, Ruler } from 'lucide-react'

const formatNumber = (value: number) => {
  if (!Number.isFinite(value)) return '0'
  return Number(value.toFixed(4)).toString()
}

export default function CssUnitConverterTool() {
  const [input, setInput] = useState('24')
  const [rootFontSize, setRootFontSize] = useState('16')
  const [parentFontSize, setParentFontSize] = useState('16')
  const [viewportWidth, setViewportWidth] = useState('1440')
  const [viewportHeight, setViewportHeight] = useState('900')
  const [copied, setCopied] = useState<string | null>(null)

  const fields = [
    { label: 'Pixel Value', value: input, setter: setInput },
    { label: 'Root Font Size', value: rootFontSize, setter: setRootFontSize },
    { label: 'Parent Font Size', value: parentFontSize, setter: setParentFontSize },
    { label: 'Viewport Width', value: viewportWidth, setter: setViewportWidth },
    { label: 'Viewport Height', value: viewportHeight, setter: setViewportHeight },
  ]

  const conversions = useMemo(() => {
    const px = Number(input) || 0
    const remBase = Number(rootFontSize) || 16
    const emBase = Number(parentFontSize) || remBase
    const vwBase = Number(viewportWidth) || 1440
    const vhBase = Number(viewportHeight) || 900

    return [
      { label: 'Pixels', value: `${formatNumber(px)}px` },
      { label: 'REM', value: `${formatNumber(px / remBase)}rem` },
      { label: 'EM', value: `${formatNumber(px / emBase)}em` },
      { label: 'Percent', value: `${formatNumber((px / emBase) * 100)}%` },
      { label: 'VW', value: `${formatNumber((px / vwBase) * 100)}vw` },
      { label: 'VH', value: `${formatNumber((px / vhBase) * 100)}vh` },
    ]
  }, [input, parentFontSize, rootFontSize, viewportHeight, viewportWidth])

  const copyValue = async (label: string, value: string) => {
    await navigator.clipboard.writeText(value)
    setCopied(label)
    window.setTimeout(() => setCopied(null), 1200)
  }

  return (
    <div className="rounded-3xl bg-gradient-to-br from-sky-50 via-white to-emerald-50 p-6">
      <div className="mb-8 flex items-start gap-4">
        <div className="rounded-2xl bg-sky-600 p-4 shadow-lg">
          <Ruler className="h-7 w-7 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900">CSS Unit Converter</h2>
          <p className="mt-2 max-w-2xl text-gray-600">
            Convert a pixel value into rem, em, percent, vw, and vh using the typography and viewport values from your design system.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.95fr,1.05fr]">
        <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-sky-100">
          <div className="grid gap-4">
            {fields.map((field) => (
              <label key={field.label} className="block">
                <span className="mb-2 block text-sm font-semibold text-gray-700">{field.label}</span>
                <input
                  type="number"
                  value={field.value}
                  onChange={(event) => field.setter(event.target.value)}
                  className="w-full rounded-2xl border border-sky-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-sky-400 focus:bg-white"
                />
              </label>
            ))}
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          {conversions.map((item) => (
            <div key={item.label} className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-sky-100">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="text-base font-semibold text-gray-900">{item.label}</h3>
                <button
                  onClick={() => copyValue(item.label, item.value)}
                  className="inline-flex items-center gap-2 rounded-xl border border-sky-200 px-3 py-2 text-sm font-medium text-sky-700 hover:bg-sky-50"
                >
                  {copied === item.label ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied === item.label ? 'Copied' : 'Copy'}
                </button>
              </div>
              <code className="block rounded-2xl bg-gray-950 px-4 py-4 text-lg font-semibold text-sky-100">
                {item.value}
              </code>
            </div>
          ))}
        </section>
      </div>
    </div>
  )
}
