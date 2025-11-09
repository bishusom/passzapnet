'use client'

import { Sparkles, Shield, Users, Globe } from 'lucide-react'
import Header from './../components/layout/Header'
import Footer from './../components/layout/Footer'
import ToolCard from './../components/ui/ToolCard'
import { utilities } from './../lib/constants'
import PasswordGenerator from './../components/utilities/password/PasswordGenerator'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-100 border border-emerald-200 mb-6">
            <Sparkles className="h-4 w-4 text-emerald-600 mr-2" />
            <span className="text-sm font-medium text-emerald-700">100% Free • No Registration</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            All Your
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent"> Utilities </span>
            in One Place
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Free online tools for developers, designers, and everyday users. 
            Clean, fast, and completely free - no strings attached.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="flex items-center text-emerald-600">
              <Shield className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">100% Secure & Local</span>
            </div>
            <div className="flex items-center text-emerald-600">
              <Users className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">No Registration</span>
            </div>
            <div className="flex items-center text-emerald-600">
              <Globe className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">Works Offline</span>
            </div>
          </div>
        </div>
      </section>

      {/* Password Generator Section */}
      <section id="generator" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <PasswordGenerator compact />
        </div>
      </section>

      {/* Tools Grid Section */}
      <section id="tools" className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Complete <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Toolkit</span>
            </h2>
            <p className="text-xl text-gray-600">Everything you need, completely free and easy to use</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {utilities.map((utility) => (
              <ToolCard key={utility.name} {...utility} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-emerald-50 to-teal-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">Why Choose PassZap?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl mb-4 shadow-lg mx-auto">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">100% Secure</h3>
              <p className="text-gray-600">All processing happens locally in your browser</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl mb-4 shadow-lg mx-auto">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Registration</h3>
              <p className="text-gray-600">Start using immediately without signing up</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl mb-4 shadow-lg mx-auto">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Works Offline</h3>
              <p className="text-gray-600">Most tools work without internet connection</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}