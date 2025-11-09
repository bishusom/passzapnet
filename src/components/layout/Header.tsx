'use client'

import { Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-emerald-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
                PassZap
              </h1>
              <p className="text-sm text-emerald-600 font-medium">Free Online Utilities</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a href="/#tools" className="text-gray-600 hover:text-emerald-600 transition-colors font-medium py-2">
              Tools
            </a>
            <a href="/#generator" className="text-gray-600 hover:text-emerald-600 transition-colors font-medium py-2">
              Generator
            </a>
            <a href="/#features" className="text-gray-600 hover:text-emerald-600 transition-colors font-medium py-2">
              Features
            </a>
          </nav>

          {/* Mobile menu button */}
          <button className="md:hidden p-2 rounded-lg bg-emerald-50 border border-emerald-100">
            <div className="w-6 h-0.5 bg-emerald-600 mb-1.5"></div>
            <div className="w-6 h-0.5 bg-emerald-600 mb-1.5"></div>
            <div className="w-6 h-0.5 bg-emerald-600"></div>
          </button>
        </div>
      </div>
    </header>
  )
}