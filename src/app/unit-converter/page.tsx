import type { Metadata } from 'next'
import { Ruler, ArrowLeftRight } from 'lucide-react'
import UnitsConverter from './../../components/utilities/units/UnitsConverter'
import Header from './../../components/layout/Header'
import Footer from './../../components/layout/Footer'

export const metadata: Metadata = {
  title: 'Unit Converter - Convert Length, Weight, Temperature & More | PassZap',
  description: 'Free online unit converter for length, weight, temperature, area, volume, speed, time, and digital storage. Convert between metric, imperial, and US customary units.',
  keywords: 'unit converter, measurement converter, length converter, weight converter, temperature converter, metric to imperial',
  openGraph: {
    title: 'Unit Converter - Convert Length, Weight, Temperature & More | PassZap',
    description: 'Free online unit converter for length, weight, temperature, area, volume, speed, time, and digital storage. Convert between metric, imperial, and US customary units.',
    url: 'https://passzap.net/unit-converter',
    siteName: 'PassZap',
    images: [
      {
        url: '/og/unit-converter-og.png',
        width: 1200,
        height: 630,
        alt: 'PassZap Unit Converter',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Unit Converter - Convert Length, Weight, Temperature & More | PassZap',
    description: 'Free online unit converter for length, weight, temperature, area, volume, speed, time, and digital storage. Convert between metric, imperial, and US customary units.',
    images: ['/og/unit-converter-og.png'],
  },
  alternates: {
    canonical: 'https://passzap.net/unit-converter',
  },
}

export default function UnitConverterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <Header />
      
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
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
          </div>

          <UnitsConverter />
        </div>

        {/* Categories Section */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Conversion Categories
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
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
                "name": "Unit Converter",
                "item": "https://passzap.net/unit-converter"
              }
            ]
          })
        }}
      />
    </div>
  )
}

const categories = [
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