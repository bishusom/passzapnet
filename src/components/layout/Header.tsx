'use client'

import { useState } from 'react'
import { Sparkles, X, Menu } from 'lucide-react'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-emerald-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <a href="/" className="flex items-center space-x-3 group">
            <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
                PassZap
              </h1>
              <p className="text-sm text-emerald-600 font-medium">Free Online Utilities</p>
            </div>
          </a>

          {/* Desktop Navigation */}
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
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-emerald-600" />
            ) : (
              <Menu className="h-6 w-6 text-emerald-600" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-emerald-100 animate-in slide-in-from-top">
            <div className="flex flex-col space-y-3">
              <a 
                href="/#tools" 
                className="text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 transition-colors font-medium py-3 px-4 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                Tools
              </a>
              <a 
                href="/#generator" 
                className="text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 transition-colors font-medium py-3 px-4 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                Generator
              </a>
              <a 
                href="/#features" 
                className="text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 transition-colors font-medium py-3 px-4 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </a>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}