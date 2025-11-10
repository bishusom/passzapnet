import type { Metadata } from 'next'
import { Palette, Droplets, Contrast, Eye, Palette as PaletteIcon } from 'lucide-react'
import ColorPicker from './../../components/utilities/color/ColorPicker'
import Header from './../../components/layout/Header'
import Footer from './../../components/layout/Footer'

export const metadata: Metadata = {
  title: 'Color Picker - RGB, HEX, HSL Converter & Palette Generator | PassZap',
  description: 'Advanced color picker with RGB, HEX, HSL conversion, color palette generation, contrast checking, and accessibility tools. Perfect for designers and developers.',
  keywords: 'color picker, rgb to hex, hex to rgb, hsl converter, color palette generator, color contrast checker, web design colors',
  openGraph: {
    title: 'Base64 Encoder & Decoder - Online Text & File Converter | PassZap',
    description: 'Advanced color picker with RGB, HEX, HSL conversion, color palette generation, contrast checking, and accessibility tools. Perfect for designers and developers',
    url: 'https://passzap.net/color-picker',
    siteName: 'PassZap',
    images: [
      {
        url: '/og/color-picker-og.png',
        width: 1200,
        height: 630,
        alt: 'PassZap Base64 Encoder & Decoder',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Base64 Encoder & Decoder - Online Text & File Converter | PassZap',
    description: 'Advanced color picker with RGB, HEX, HSL conversion, color palette generation, contrast checking, and accessibility tools. Perfect for designers and developers',
    images: ['/og/color-picker-og.png'],
  },
  alternates: {
    canonical: 'https://passzap.net/color-picker',
  },
}

export default function ColorPickerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <Header />
      
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl shadow-lg mb-4">
              <Palette className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Advanced Color Picker
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Professional color tools with real-time conversion, palette generation, 
              contrast checking, and accessibility features for designers and developers.
            </p>
          </div>

          <ColorPicker />
        </div>

        {/* Features Section */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Color Tools & Features
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl mb-4">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />

      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": colorPickerFaqItems.map(faq => ({
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

const colorPickerFaqItems = [
  {
    question: "What color formats are supported?",
    answer: "We support RGB, HEX, HSL, and CMYK color formats with real-time conversion between all formats. You can input colors in any format and instantly see the equivalent values in other formats."
  },
  {
    question: "How does the color palette generator work?",
    answer: "Our palette generator creates harmonious color schemes based on color theory principles. It can generate complementary, analogous, triadic, and monochromatic palettes from your base color."
  },
  {
    question: "What is WCAG contrast ratio and why is it important?",
    answer: "WCAG (Web Content Accessibility Guidelines) contrast ratio measures the difference in luminance between text and background colors. A minimum ratio of 4.5:1 is required for normal text to ensure readability for users with visual impairments."
  },
  {
    question: "Can I simulate color blindness?",
    answer: "Yes! Our color vision simulator shows how your colors appear to people with different types of color vision deficiencies including protanopia, deuteranopia, and tritanopia."
  },
  {
    question: "Are the generated palettes copyright-free?",
    answer: "Yes, all color palettes generated by our tool are free to use for any purpose. Colors themselves cannot be copyrighted, so you can use the palettes in personal and commercial projects."
  },
  {
    question: "How accurate is the color conversion?",
    answer: "Our color conversions are mathematically precise and follow industry standards. The conversions between RGB, HEX, and HSL are exact, while CMYK conversions use standard conversion algorithms used in design software."
  }
]

const features = [
  {
    title: 'Color Conversion',
    description: 'Convert between RGB, HEX, HSL, and CMYK color formats with real-time updates.',
    icon: Droplets
  },
  {
    title: 'Palette Generator',
    description: 'Generate beautiful color palettes with complementary, analogous, and triadic schemes.',
    icon: PaletteIcon
  },
  {
    title: 'Contrast Checker',
    description: 'Check WCAG compliance with real-time contrast ratios for accessibility.',
    icon: Contrast
  },
  {
    title: 'Vision Simulator',
    description: 'See how colors appear to users with different types of color vision deficiencies.',
    icon: Eye
  }
]