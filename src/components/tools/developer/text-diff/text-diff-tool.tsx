'use client'

import { useMemo, useState } from 'react'
import { Copy, FileDiff, RefreshCw } from 'lucide-react'

type DiffLine =
  | { type: 'equal'; left?: string; right?: string }
  | { type: 'removed'; left?: string; right?: string }
  | { type: 'added'; left?: string; right?: string }

const sampleLeft = `const greeting = 'hello'
const tools = ['json', 'regex', 'uuid']

export function welcome(name) {
  return greeting + ', ' + name
}`

const sampleRight = `const greeting = 'hello'
const tools = ['json', 'regex', 'uuid', 'cron']

export function welcomeUser(name) {
  return \`\${greeting}, \${name}!\`
}`

const diffLines = (leftText: string, rightText: string): DiffLine[] => {
  const left = leftText.split('\n')
  const right = rightText.split('\n')
  const dp = Array.from({ length: left.length + 1 }, () => Array(right.length + 1).fill(0))

  for (let i = left.length - 1; i >= 0; i -= 1) {
    for (let j = right.length - 1; j >= 0; j -= 1) {
      dp[i][j] = left[i] === right[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1])
    }
  }

  const output: DiffLine[] = []
  let i = 0
  let j = 0

  while (i < left.length && j < right.length) {
    if (left[i] === right[j]) {
      output.push({ type: 'equal', left: left[i], right: right[j] })
      i += 1
      j += 1
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      output.push({ type: 'removed', left: left[i] })
      i += 1
    } else {
      output.push({ type: 'added', right: right[j] })
      j += 1
    }
  }

  while (i < left.length) {
    output.push({ type: 'removed', left: left[i] })
    i += 1
  }

  while (j < right.length) {
    output.push({ type: 'added', right: right[j] })
    j += 1
  }

  return output
}

export default function TextDiffTool() {
  const [leftText, setLeftText] = useState(sampleLeft)
  const [rightText, setRightText] = useState(sampleRight)

  const lines = useMemo(() => diffLines(leftText, rightText), [leftText, rightText])

  const summary = useMemo(() => {
    return lines.reduce(
      (acc, line) => {
        acc[line.type] += 1
        return acc
      },
      { equal: 0, added: 0, removed: 0 }
    )
  }, [lines])

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-3xl bg-white p-8 shadow-lg">
          <div className="mb-6 flex items-center gap-4">
            <div className="rounded-2xl bg-emerald-100 p-4">
              <FileDiff className="h-8 w-8 text-emerald-700" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Text Diff & Compare</h1>
              <p className="mt-2 text-gray-600">Compare two versions of text or code line by line.</p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Original</h2>
                <button
                  onClick={() => navigator.clipboard.writeText(leftText)}
                  className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 px-3 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-50"
                >
                  <Copy className="h-4 w-4" />
                  Copy
                </button>
              </div>
              <textarea
                value={leftText}
                onChange={(event) => setLeftText(event.target.value)}
                rows={12}
                className="w-full rounded-2xl border border-emerald-200 bg-gray-50 px-4 py-3 font-mono text-sm outline-none focus:border-emerald-400 focus:bg-white"
              />
            </div>
            <div>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Updated</h2>
                <button
                  onClick={() => navigator.clipboard.writeText(rightText)}
                  className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 px-3 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-50"
                >
                  <Copy className="h-4 w-4" />
                  Copy
                </button>
              </div>
              <textarea
                value={rightText}
                onChange={(event) => setRightText(event.target.value)}
                rows={12}
                className="w-full rounded-2xl border border-emerald-200 bg-gray-50 px-4 py-3 font-mono text-sm outline-none focus:border-emerald-400 focus:bg-white"
              />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={() => {
                setLeftText(sampleLeft)
                setRightText(sampleRight)
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-medium text-white hover:bg-emerald-700"
            >
              <RefreshCw className="h-4 w-4" />
              Load Example
            </button>
            <button
              onClick={() => {
                setLeftText('')
                setRightText('')
              }}
              className="rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">Unchanged</p>
            <p className="mt-2 text-2xl font-bold text-gray-900">{summary.equal}</p>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wide text-green-600">Added</p>
            <p className="mt-2 text-2xl font-bold text-green-700">{summary.added}</p>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wide text-red-600">Removed</p>
            <p className="mt-2 text-2xl font-bold text-red-700">{summary.removed}</p>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl bg-white shadow-lg">
          <div className="grid grid-cols-[56px_1fr] border-b border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-600">
            <span>#</span>
            <span>Diff Output</span>
          </div>
          <div className="max-h-[700px] overflow-auto">
            {lines.map((line, index) => {
              const background =
                line.type === 'equal'
                  ? 'bg-white'
                  : line.type === 'added'
                    ? 'bg-green-50'
                    : 'bg-red-50'
              const symbol = line.type === 'equal' ? ' ' : line.type === 'added' ? '+' : '-'
              const content = line.left ?? line.right ?? ''

              return (
                <div
                  key={`${line.type}-${index}`}
                  className={`grid grid-cols-[56px_1fr] border-b border-gray-100 px-4 py-2 font-mono text-sm ${background}`}
                >
                  <span className="text-gray-400">{index + 1}</span>
                  <span className={line.type === 'added' ? 'text-green-800' : line.type === 'removed' ? 'text-red-800' : 'text-gray-800'}>
                    {symbol} {content}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
