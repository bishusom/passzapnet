import type { Metadata } from 'next'
import { Calculator, FunctionSquare, Code2, History } from 'lucide-react'
import CalculatorComponent from './../../components/utilities/calculator/CalculatorComponent'
import Header from './../../components/layout/Header'
import Footer from './../../components/layout/Footer'

export const metadata: Metadata = {
  title: 'Calculator - Scientific, Basic & Programming Modes | PassZap',
  description: 'Free online calculator with scientific, basic, and programming modes. Perform complex calculations, unit conversions, and mathematical functions.',
  keywords: 'calculator, scientific calculator, online calculator, math calculator, programming calculator, unit converter',
}

export default function CalculatorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <Header />
      
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl shadow-lg mb-4">
              <Calculator className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Advanced Calculator
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Scientific calculator with basic, scientific, and programming modes. 
              Perfect for students, engineers, and everyday calculations.
            </p>
          </div>

          <CalculatorComponent />
        </div>

        {/* Features Section */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Calculator Modes & Features
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-emerald-100 hover:shadow-xl transition-shadow">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl mb-4">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-3">{feature.description}</p>
                <div className="flex flex-wrap gap-1">
                  {feature.functions.map((func, funcIndex) => (
                    <span key={funcIndex} className="bg-emerald-50 text-emerald-700 text-xs px-2 py-1 rounded">
                      {func}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />

      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://passzap.net"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Calculator",
                "item": "https://passzap.net/calculator"
              }
            ]
          })
        }}
      />
    </div>
  )
}

const features = [
  {
    title: 'Basic Calculator',
    description: 'Simple arithmetic operations for everyday calculations including addition, subtraction, multiplication, and division.',
    icon: Calculator,
    functions: ['+', '-', '×', '÷', '%', '±']
  },
  {
    title: 'Scientific Functions',
    description: 'Advanced mathematical functions including trigonometry, logarithms, exponents, and constants.',
    icon: FunctionSquare,
    functions: ['sin/cos/tan', 'log/ln', 'x²/x³', 'π/e', '√', '!']
  },
  {
    title: 'Programmer Calculator',
    description: 'Bitwise operations, number system conversion, and binary manipulation for developers and programmers.',
    icon: Code2,
    functions: ['AND/OR/XOR', 'Bit Shifting', 'BIN/OCT/HEX', 'Bit Toggling']
  },
  {
    title: 'Memory & History',
    description: 'Store multiple values in memory and view calculation history. Perfect for complex multi-step calculations.',
    icon: History,
    functions: ['MC', 'MR', 'M+', 'M-', 'History', 'Copy Results']
  }
]