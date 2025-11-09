'use client'

import { useState, useEffect, useCallback } from 'react'
import { ArrowLeftRight, Copy, Check } from 'lucide-react'

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
    <div className="bg-white rounded-2xl shadow-xl border border-emerald-100 p-8 max-w-6xl mx-auto">
      {/* Category Selection */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Category</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                category === cat.id
                  ? 'bg-emerald-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat.name}
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
  )
}