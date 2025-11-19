'use client'

import { useState, useEffect, useCallback } from 'react'
import { ArrowLeftRight, Copy, Check, Ruler, Shield, Zap, CheckCircle } from 'lucide-react'

type Category = 'length' | 'weight' | 'temperature' | 'area' | 'volume' | 'speed' | 'time' | 'digital' | 'pressure' | 'energy'

interface Unit {
  name: string
  symbol: string
  category: Category
  toBase: (value: number) => number
  fromBase: (value: number) => number
}

const unitsData: Unit[] = [
  // Length units
  { name: 'Meters', symbol: 'm', category: 'length', toBase: (v) => v, fromBase: (v) => v },
  { name: 'Kilometers', symbol: 'km', category: 'length', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
  { name: 'Centimeters', symbol: 'cm', category: 'length', toBase: (v) => v / 100, fromBase: (v) => v * 100 },
  { name: 'Millimeters', symbol: 'mm', category: 'length', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
  { name: 'Miles', symbol: 'mi', category: 'length', toBase: (v) => v * 1609.344, fromBase: (v) => v / 1609.344 },
  { name: 'Yards', symbol: 'yd', category: 'length', toBase: (v) => v * 0.9144, fromBase: (v) => v / 0.9144 },
  { name: 'Feet', symbol: 'ft', category: 'length', toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
  { name: 'Inches', symbol: 'in', category: 'length', toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
  { name: 'Nautical Miles', symbol: 'nmi', category: 'length', toBase: (v) => v * 1852, fromBase: (v) => v / 1852 },

  // Weight/Mass units
  { name: 'Kilograms', symbol: 'kg', category: 'weight', toBase: (v) => v, fromBase: (v) => v },
  { name: 'Grams', symbol: 'g', category: 'weight', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
  { name: 'Milligrams', symbol: 'mg', category: 'weight', toBase: (v) => v / 1000000, fromBase: (v) => v * 1000000 },
  { name: 'Pounds', symbol: 'lb', category: 'weight', toBase: (v) => v * 0.45359237, fromBase: (v) => v / 0.45359237 },
  { name: 'Ounces', symbol: 'oz', category: 'weight', toBase: (v) => v * 0.028349523125, fromBase: (v) => v / 0.028349523125 },
  { name: 'Stones', symbol: 'st', category: 'weight', toBase: (v) => v * 6.35029318, fromBase: (v) => v / 6.35029318 },
  { name: 'Metric Tons', symbol: 't', category: 'weight', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
  { name: 'US Tons', symbol: 'ton', category: 'weight', toBase: (v) => v * 907.18474, fromBase: (v) => v / 907.18474 },

  // Temperature units (special handling)
  { name: 'Celsius', symbol: '°C', category: 'temperature', toBase: (v) => v, fromBase: (v) => v },
  { name: 'Fahrenheit', symbol: '°F', category: 'temperature', toBase: (v) => (v - 32) * 5/9, fromBase: (v) => (v * 9/5) + 32 },
  { name: 'Kelvin', symbol: 'K', category: 'temperature', toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },

  // Area units
  { name: 'Square Meters', symbol: 'm²', category: 'area', toBase: (v) => v, fromBase: (v) => v },
  { name: 'Square Kilometers', symbol: 'km²', category: 'area', toBase: (v) => v * 1000000, fromBase: (v) => v / 1000000 },
  { name: 'Square Feet', symbol: 'ft²', category: 'area', toBase: (v) => v * 0.092903, fromBase: (v) => v / 0.092903 },
  { name: 'Square Yards', symbol: 'yd²', category: 'area', toBase: (v) => v * 0.836127, fromBase: (v) => v / 0.836127 },
  { name: 'Acres', symbol: 'ac', category: 'area', toBase: (v) => v * 4046.856, fromBase: (v) => v / 4046.856 },
  { name: 'Hectares', symbol: 'ha', category: 'area', toBase: (v) => v * 10000, fromBase: (v) => v / 10000 },
  { name: 'Square Miles', symbol: 'mi²', category: 'area', toBase: (v) => v * 2589988.11, fromBase: (v) => v / 2589988.11 },

  // Volume units
  { name: 'Liters', symbol: 'L', category: 'volume', toBase: (v) => v, fromBase: (v) => v },
  { name: 'Milliliters', symbol: 'mL', category: 'volume', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
  { name: 'Gallons (US)', symbol: 'gal', category: 'volume', toBase: (v) => v * 3.78541, fromBase: (v) => v / 3.78541 },
  { name: 'Gallons (UK)', symbol: 'gal UK', category: 'volume', toBase: (v) => v * 4.54609, fromBase: (v) => v / 4.54609 },
  { name: 'Fluid Ounces (US)', symbol: 'fl oz', category: 'volume', toBase: (v) => v * 0.0295735, fromBase: (v) => v / 0.0295735 },
  { name: 'Cubic Meters', symbol: 'm³', category: 'volume', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
  { name: 'Cubic Feet', symbol: 'ft³', category: 'volume', toBase: (v) => v * 28.3168, fromBase: (v) => v / 28.3168 },
  { name: 'Cubic Inches', symbol: 'in³', category: 'volume', toBase: (v) => v * 0.0163871, fromBase: (v) => v / 0.0163871 },

  // Speed units
  { name: 'Meters per Second', symbol: 'm/s', category: 'speed', toBase: (v) => v, fromBase: (v) => v },
  { name: 'Kilometers per Hour', symbol: 'km/h', category: 'speed', toBase: (v) => v / 3.6, fromBase: (v) => v * 3.6 },
  { name: 'Miles per Hour', symbol: 'mph', category: 'speed', toBase: (v) => v * 0.44704, fromBase: (v) => v / 0.44704 },
  { name: 'Knots', symbol: 'kn', category: 'speed', toBase: (v) => v * 0.514444, fromBase: (v) => v / 0.514444 },
  { name: 'Feet per Second', symbol: 'ft/s', category: 'speed', toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },

  // Time units
  { name: 'Seconds', symbol: 's', category: 'time', toBase: (v) => v, fromBase: (v) => v },
  { name: 'Minutes', symbol: 'min', category: 'time', toBase: (v) => v * 60, fromBase: (v) => v / 60 },
  { name: 'Hours', symbol: 'h', category: 'time', toBase: (v) => v * 3600, fromBase: (v) => v / 3600 },
  { name: 'Days', symbol: 'd', category: 'time', toBase: (v) => v * 86400, fromBase: (v) => v / 86400 },
  { name: 'Weeks', symbol: 'wk', category: 'time', toBase: (v) => v * 604800, fromBase: (v) => v / 604800 },

  // Digital Storage units
  { name: 'Bytes', symbol: 'B', category: 'digital', toBase: (v) => v, fromBase: (v) => v },
  { name: 'Kilobytes', symbol: 'KB', category: 'digital', toBase: (v) => v * 1024, fromBase: (v) => v / 1024 },
  { name: 'Megabytes', symbol: 'MB', category: 'digital', toBase: (v) => v * 1048576, fromBase: (v) => v / 1048576 },
  { name: 'Gigabytes', symbol: 'GB', category: 'digital', toBase: (v) => v * 1073741824, fromBase: (v) => v / 1073741824 },
  { name: 'Terabytes', symbol: 'TB', category: 'digital', toBase: (v) => v * 1099511627776, fromBase: (v) => v / 1099511627776 },
]

const categories: { id: Category; name: string; description: string }[] = [
  { id: 'length', name: 'Length', description: 'Convert between different length units' },
  { id: 'weight', name: 'Weight & Mass', description: 'Convert between weight and mass units' },
  { id: 'temperature', name: 'Temperature', description: 'Convert between temperature scales' },
  { id: 'area', name: 'Area', description: 'Convert between area measurement units' },
  { id: 'volume', name: 'Volume', description: 'Convert between volume units' },
  { id: 'speed', name: 'Speed', description: 'Convert between speed units' },
  { id: 'time', name: 'Time', description: 'Convert between time units' },
  { id: 'digital', name: 'Digital Storage', description: 'Convert between digital storage units' },
]

const conversionCategories = [
  {
    title: 'Length',
    description: 'Convert between meters, feet, inches, miles, kilometers, and more.',
    icon: Ruler,
    units: ['Meters', 'Feet', 'Inches', 'Miles', 'Kilometers', 'Yards', 'Centimeters', 'Millimeters']
  },
  {
    title: 'Weight & Mass',
    description: 'Convert kilograms, pounds, ounces, grams, stones, and other weight units.',
    icon: ArrowLeftRight,
    units: ['Kilograms', 'Pounds', 'Ounces', 'Grams', 'Stones', 'Metric Tons', 'US Tons']
  },
  {
    title: 'Temperature',
    description: 'Convert between Celsius, Fahrenheit, Kelvin, and other temperature scales.',
    icon: ArrowLeftRight,
    units: ['Celsius', 'Fahrenheit', 'Kelvin']
  },
  {
    title: 'Area',
    description: 'Convert square meters, square feet, acres, hectares, and other area units.',
    icon: ArrowLeftRight,
    units: ['Square Meters', 'Square Feet', 'Acres', 'Hectares', 'Square Miles', 'Square Yards']
  },
  {
    title: 'Volume',
    description: 'Convert liters, gallons, milliliters, cubic meters, and other volume units.',
    icon: ArrowLeftRight,
    units: ['Liters', 'Gallons', 'Milliliters', 'Cubic Meters', 'Cubic Feet', 'Fluid Ounces']
  },
  {
    title: 'Speed',
    description: 'Convert kilometers per hour, miles per hour, meters per second, and knots.',
    icon: ArrowLeftRight,
    units: ['km/h', 'mph', 'm/s', 'Knots', 'Feet per second']
  }
]

const unitConverterFaqItems = [
  {
    question: "How accurate are the unit conversions?",
    answer: "Our unit converter uses precise conversion factors and algorithms to ensure maximum accuracy. All conversions are based on internationally recognized standards and are calculated in real-time with high precision."
  },
  {
    question: "Can I convert between different measurement systems?",
    answer: "Yes! You can easily convert between metric, imperial, and US customary units. The tool supports conversions across different measurement systems for all available categories."
  },
  {
    question: "Is there a limit to the number of conversions I can perform?",
    answer: "No, there are no limits. You can perform unlimited conversions completely free. All processing happens in your browser, so you can use the tool as much as you need."
  },
  {
    question: "Do you support temperature conversions with special formulas?",
    answer: "Yes, temperature conversions use specific formulas for accurate results. For example, Fahrenheit to Celsius uses (F - 32) × 5/9, and Celsius to Kelvin uses C + 273.15. All temperature scales are properly handled."
  },
  {
    question: "Can I copy the conversion results?",
    answer: "Absolutely! Click the copy button next to the result field to quickly copy the converted value with its unit symbol. This makes it easy to paste the results into other applications."
  },
  {
    question: "Are my conversion inputs stored or tracked?",
    answer: "No, all conversions happen entirely in your browser. We don't store, track, or transmit your data to any servers. Your privacy is completely protected."
  }
]

export default function UnitsConverter() {
  const [category, setCategory] = useState<Category>('length')
  const [fromUnit, setFromUnit] = useState<Unit>(unitsData[0])
  const [toUnit, setToUnit] = useState<Unit>(unitsData[1])
  const [fromValue, setFromValue] = useState('1')
  const [toValue, setToValue] = useState('')
  const [copied, setCopied] = useState(false)

  // Filter units by selected category
  const categoryUnits = unitsData.filter(unit => unit.category === category)

  // Conversion function
  const convert = useCallback((value: string, from: Unit, to: Unit): string => {
    if (!value || isNaN(parseFloat(value))) return ''
    
    const numValue = parseFloat(value)
    
    // Special handling for temperature
    if (category === 'temperature') {
      if (from.name === 'Celsius' && to.name === 'Fahrenheit') {
        return ((numValue * 9/5) + 32).toFixed(6)
      } else if (from.name === 'Fahrenheit' && to.name === 'Celsius') {
        return ((numValue - 32) * 5/9).toFixed(6)
      } else if (from.name === 'Celsius' && to.name === 'Kelvin') {
        return (numValue + 273.15).toFixed(6)
      } else if (from.name === 'Kelvin' && to.name === 'Celsius') {
        return (numValue - 273.15).toFixed(6)
      } else if (from.name === 'Fahrenheit' && to.name === 'Kelvin') {
        return ((numValue - 32) * 5/9 + 273.15).toFixed(6)
      } else if (from.name === 'Kelvin' && to.name === 'Fahrenheit') {
        return ((numValue - 273.15) * 9/5 + 32).toFixed(6)
      }
      return numValue.toString()
    }
    
    // Standard conversion for other categories
    const baseValue = from.toBase(numValue)
    const convertedValue = to.fromBase(baseValue)
    
    // Format the result nicely
    if (Math.abs(convertedValue) < 0.000001 && convertedValue !== 0) {
      return convertedValue.toExponential(6)
    } else if (Math.abs(convertedValue) < 1) {
      return convertedValue.toFixed(6)
    } else if (Math.abs(convertedValue) < 1000) {
      return convertedValue.toFixed(4)
    } else {
      return convertedValue.toFixed(2)
    }
  }, [category])

  // Update conversion when inputs change
  useEffect(() => {
    const result = convert(fromValue, fromUnit, toUnit)
    setToValue(result)
  }, [fromValue, fromUnit, toUnit, convert])

  // Initialize units when category changes
  useEffect(() => {
    const categoryUnits = unitsData.filter(unit => unit.category === category)
    setFromUnit(categoryUnits[0])
    setToUnit(categoryUnits[1] || categoryUnits[0])
  }, [category])

  const swapUnits = () => {
    setFromUnit(toUnit)
    setToUnit(fromUnit)
    setFromValue(toValue)
  }

  const copyResult = () => {
    navigator.clipboard.writeText(`${toValue} ${toUnit.symbol}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatNumber = (num: string): string => {
    if (!num) return ''
    const number = parseFloat(num)
    if (isNaN(number)) return num
    
    // Remove trailing zeros and decimal point if not needed
    return number.toString().replace(/(\.0*|(?<=(\..*[1-9]))0*)$/, '')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Header */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl shadow-lg mb-4">
            <Ruler className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Unit Converter
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Convert between metric, imperial, and US customary units for length, 
            weight, temperature, area, volume, and more.
          </p>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Converter Component */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl border border-emerald-100 p-8">
                {/* Category Selection */}
                <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Category</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 gap-2">
                        {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setCategory(cat.id)}
                            className={`px-2 py-3 rounded-xl text-xs sm:text-sm font-medium transition-all text-center min-h-[3rem] flex items-center justify-center break-words ${
                            category === cat.id
                                ? 'bg-emerald-500 text-white shadow-lg'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            <span className="line-clamp-2 leading-tight px-1">{cat.name}</span>
                        </button>
                        ))}
                    </div>
                </div>

              {/* Converter Interface */}
              <div className="grid md:grid-cols-5 gap-6 items-end">
                {/* From Unit */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    From
                  </label>
                  <div className="space-y-3">
                    <select
                      value={`${fromUnit.name}-${fromUnit.symbol}`}
                      onChange={(e) => {
                        const [name, symbol] = e.target.value.split('-')
                        const unit = categoryUnits.find(u => u.name === name && u.symbol === symbol)
                        if (unit) setFromUnit(unit)
                      }}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      {categoryUnits.map((unit) => (
                        <option key={`${unit.name}-${unit.symbol}`} value={`${unit.name}-${unit.symbol}`}>
                          {unit.name} ({unit.symbol})
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={fromValue}
                      onChange={(e) => setFromValue(e.target.value)}
                      placeholder="Enter value"
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-lg font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Swap Button */}
                <div className="flex justify-center items-center">
                  <button
                    onClick={swapUnits}
                    className="p-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-colors shadow-lg hover:shadow-xl"
                    title="Swap units"
                  >
                    <ArrowLeftRight className="h-5 w-5" />
                  </button>
                </div>

                {/* To Unit */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    To
                  </label>
                  <div className="space-y-3">
                    <select
                      value={`${toUnit.name}-${toUnit.symbol}`}
                      onChange={(e) => {
                        const [name, symbol] = e.target.value.split('-')
                        const unit = categoryUnits.find(u => u.name === name && u.symbol === symbol)
                        if (unit) setToUnit(unit)
                      }}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      {categoryUnits.map((unit) => (
                        <option key={`${unit.name}-${unit.symbol}`} value={`${unit.name}-${unit.symbol}`}>
                          {unit.name} ({unit.symbol})
                        </option>
                      ))}
                    </select>
                    <div className="relative">
                      <input
                        type="text"
                        value={formatNumber(toValue)}
                        readOnly
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 text-lg font-mono bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                      <button
                        onClick={copyResult}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-emerald-600 transition-colors"
                        title="Copy result"
                      >
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Conversion Details */}
              {fromValue && toValue && (
                <div className="mt-8 p-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Conversion Result</h4>
                  <div className="font-mono text-lg text-gray-700">
                    {formatNumber(fromValue)} {fromUnit.symbol} = {formatNumber(toValue)} {toUnit.symbol}
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    {categories.find(c => c.id === category)?.description}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Side Content */}
          <div className="space-y-6">
            {/* Security Features */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-emerald-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Shield className="h-5 w-5 text-emerald-500 mr-2" />
                Security Features
              </h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start space-x-2">
                  <Zap className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Client-Side Processing</strong> - All conversions happen in your browser</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Shield className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>No Data Stored</strong> - We never see or store your conversion data</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Instant Results</strong> - Real-time conversion calculations</span>
                </li>
              </ul>
            </div>

            {/* Use Cases */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-emerald-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Common Use Cases</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <h4 className="font-semibold text-blue-800 mb-1">🏗️ Construction & DIY</h4>
                  <ul className="space-y-1 text-blue-700">
                    <li>• Convert between metric and imperial measurements</li>
                    <li>• Calculate material requirements</li>
                    <li>• Blueprint measurements</li>
                  </ul>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <h4 className="font-semibold text-green-800 mb-1">👨‍🍳 Cooking & Baking</h4>
                  <ul className="space-y-1 text-green-700">
                    <li>• Convert recipe measurements</li>
                    <li>• Temperature conversions for ovens</li>
                    <li>• Volume and weight conversions</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-emerald-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Pro Tips</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-2">
                  <Copy className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Quick Copy:</strong> Click the copy button for instant results</span>
                </div>
                <div className="flex items-start space-x-2">
                  <ArrowLeftRight className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Swap Units:</strong> Use the swap button to reverse conversion</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Multiple Categories:</strong> Switch between different unit types</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Section */}
        <div className="max-w-6xl mx-auto mt-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Conversion Categories
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {conversionCategories.map((category, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl mb-4">
                  <category.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-3">{category.description}</p>
                <div className="flex flex-wrap gap-1">
                  {category.units.slice(0, 4).map((unit, unitIndex) => (
                    <span key={unitIndex} className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded">
                      {unit}
                    </span>
                  ))}
                  {category.units.length > 4 && (
                    <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                      +{category.units.length - 4} more
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {unitConverterFaqItems.map((faq, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-emerald-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* SEO Content */}
        <div className="max-w-4xl mx-auto mt-12 prose prose-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Free Online Unit Converter
          </h2>
          
          <p className="text-gray-700 mb-4">
            Our comprehensive unit converter provides instant, accurate conversions between 
            metric, imperial, and US customary units. Whether you're working on construction 
            projects, cooking recipes, scientific calculations, or everyday measurements, 
            our tool delivers precise results with complete privacy.
          </p>

          <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
            Why Use Our Unit Converter?
          </h3>
          <p className="text-gray-700 mb-4">
            Unit conversion is essential in many fields including engineering, cooking, 
            science, education, and international business. Our converter supports all 
            major measurement categories with high precision and real-time results.
          </p>

          <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
            Supported Measurement Systems
          </h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Metric System:</strong> Used worldwide in science and most countries</li>
            <li><strong>Imperial System:</strong> Traditional British measurement system</li>
            <li><strong>US Customary:</strong> Used in the United States for everyday measurements</li>
            <li><strong>International Standards:</strong> Based on SI units and recognized standards</li>
          </ul>
        </div>
      </div>

      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": unitConverterFaqItems.map(faq => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
              }
            }))
          })
        }}
      />
    </div>
  )
}