// app/page.tsx
'use client'

import {
  ArrowRight,
  Compass,
  Globe,
  Search,
  Shield,
  Sparkles,
  Users,
} from 'lucide-react'
import ToolCard from '@/components/ui/ToolCard'
import { getAllCategories, getAllTools, getPopularCategories, type ToolConfig } from '@/config/tools-config'

export default function Home() {
  const allTools = getAllTools()
  const allFeaturedTools = allTools.filter((tool) => tool.featured)
  const featuredToolCount = allFeaturedTools.length >= 8 ? 8 : allFeaturedTools.length >= 4 ? 4 : allFeaturedTools.length
  const featuredTools = allFeaturedTools.slice(0, featuredToolCount)
  const popularCategories = getPopularCategories(6)
  const allCategories = getAllCategories()

  const quickStarts = [
    allTools.find((tool) => tool.id === 'json-formatter'),
    allTools.find((tool) => tool.id === 'qr-generator'),
    allTools.find((tool) => tool.id === 'image-resizer'),
    allTools.find((tool) => tool.id === 'currency-converter'),
    allTools.find((tool) => tool.id === 'file-hash'),
    allTools.find((tool) => tool.id === 'audio-trimmer'),
  ].filter((tool): tool is ToolConfig => Boolean(tool))

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#d1fae5,transparent_28%),linear-gradient(180deg,#ecfdf5_0%,#f0fdfa_42%,#ffffff_100%)]">
      <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-4 py-2 text-sm font-medium text-emerald-700 shadow-sm">
                <Sparkles className="h-4 w-4" />
                FreeDevTools Studio
              </div>

              <h1 className="max-w-4xl text-5xl font-bold tracking-tight text-gray-900 md:text-6xl">
                Free online tools for building, debugging, converting, and creating.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600">
                Browse developer utilities, design tools, media processors, calculators, and quick
                converters in one place. Fast to use, easy to search, and built for one-off tasks.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <a
                  href="/tools"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-4 font-medium text-white shadow-lg shadow-emerald-200 transition-colors hover:bg-emerald-700"
                >
                  Browse All Tools
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="#categories"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-white px-6 py-4 font-medium text-emerald-700 transition-colors hover:border-emerald-300 hover:bg-emerald-50"
                >
                  Explore Categories
                  <Compass className="h-4 w-4" />
                </a>
              </div>

              <div className="mt-10 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm">
                  <Shield className="mb-3 h-5 w-5 text-emerald-600" />
                  <p className="text-sm font-semibold text-gray-900">Private by default</p>
                  <p className="mt-1 text-sm text-gray-600">Many tools run directly in your browser.</p>
                </div>
                <div className="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm">
                  <Users className="mb-3 h-5 w-5 text-emerald-600" />
                  <p className="text-sm font-semibold text-gray-900">No account required</p>
                  <p className="mt-1 text-sm text-gray-600">Open a tool and start immediately.</p>
                </div>
                <div className="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm">
                  <Globe className="mb-3 h-5 w-5 text-emerald-600" />
                  <p className="text-sm font-semibold text-gray-900">Wide tool coverage</p>
                  <p className="mt-1 text-sm text-gray-600">
                    {allTools.length}+ tools across {allCategories.length} categories.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-emerald-100 bg-white/85 p-6 shadow-xl shadow-emerald-100 backdrop-blur-sm">
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-xl bg-emerald-100 p-3">
                  <Search className="h-5 w-5 text-emerald-700" />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
                    Start Here
                  </p>
                  <h2 className="text-2xl font-bold text-gray-900">Jump into a common task</h2>
                </div>
              </div>

              <div className="space-y-3">
                {quickStarts.map((tool) => (
                  <a
                    key={tool.id}
                    href={tool.href}
                    className="flex items-start justify-between gap-4 rounded-2xl border border-emerald-100 px-4 py-4 transition-all hover:border-emerald-300 hover:bg-emerald-50"
                  >
                    <div>
                      <p className="text-base font-semibold text-gray-900">{tool.name}</p>
                      <p className="mt-1 text-sm text-gray-600">{tool.description}</p>
                    </div>
                    <ArrowRight className="mt-1 h-4 w-4 flex-shrink-0 text-emerald-600" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="categories" className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
                Explore by Category
              </p>
              <h2 className="mt-3 text-4xl font-bold text-gray-900">Find the right tool family first</h2>
            </div>
            <a href="/tools" className="text-sm font-medium text-emerald-700 hover:text-emerald-800">
              See the full directory
            </a>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {popularCategories.map((category) => (
              <a
                key={category.key}
                href={category.path}
                className="group rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-emerald-300 hover:shadow-xl"
              >
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
                  <category.icon className="h-6 w-6" />
                </div>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-emerald-700">
                      {category.name}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-gray-600">{category.description}</p>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    {category.toolCount} tools
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {featuredTools.length > 0 && (
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
                Popular Picks
              </p>
              <h2 className="mt-3 text-4xl font-bold text-gray-900">Featured tools across the site</h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
                Jump into the tools people use most for quick formatting, generation, conversion,
                and lightweight editing tasks.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
              {featuredTools.map((tool) => (
                <ToolCard key={tool.id} {...tool} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-[2rem] border border-emerald-100 bg-white p-8 shadow-sm lg:p-10">
          <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
                Common Workflows
              </p>
              <h2 className="mt-3 text-4xl font-bold text-gray-900">Start with what you need to do</h2>
            </div>
            <p className="max-w-2xl text-gray-600">
              The homepage should help people land on a task quickly, not force one tool to dominate
              the story.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <a
              href="/tools/developer/json-formatter"
              className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5 transition-colors hover:border-emerald-300 hover:bg-emerald-50"
            >
              <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">Format Code</p>
              <h3 className="mt-2 text-xl font-semibold text-gray-900">Clean up JSON and source text</h3>
              <p className="mt-3 text-sm leading-6 text-gray-600">
                Open formatter tools for JSON, SQL, CSS, JavaScript, and regex testing.
              </p>
            </a>
            <a
              href="/tools/design-tools/qr-generator"
              className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5 transition-colors hover:border-emerald-300 hover:bg-emerald-50"
            >
              <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">Create Assets</p>
              <h3 className="mt-2 text-xl font-semibold text-gray-900">Generate QR codes and UI resources</h3>
              <p className="mt-3 text-sm leading-6 text-gray-600">
                Build QR codes, color palettes, gradients, icons, and other design-ready assets.
              </p>
            </a>
            <a
              href="/tools/graphics/image-resizer"
              className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5 transition-colors hover:border-emerald-300 hover:bg-emerald-50"
            >
              <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">Edit Media</p>
              <h3 className="mt-2 text-xl font-semibold text-gray-900">Resize, compress, and trim files</h3>
              <p className="mt-3 text-sm leading-6 text-gray-600">
                Use browser-based image, audio, video, and PDF tools for quick cleanup work.
              </p>
            </a>
            <a
              href="/tools/utilities/calculator"
              className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5 transition-colors hover:border-emerald-300 hover:bg-emerald-50"
            >
              <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">Convert & Calculate</p>
              <h3 className="mt-2 text-xl font-semibold text-gray-900">Handle numbers, units, and time</h3>
              <p className="mt-3 text-sm leading-6 text-gray-600">
                Reach calculators, unit converters, currency tools, and timezone utilities fast.
              </p>
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
