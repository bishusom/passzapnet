// constants.ts
import { 
  Lock, Clock, Calculator, Palette, DollarSign, Code, 
  FileText, Hash, Ruler, QrCode, Braces 
} from 'lucide-react'

export const utilities = [
  {
    name: 'Password Generator',
    description: 'Generate secure passwords and check strength',
    href: '/password-generator',
    icon: Lock,
    color: 'text-white',
    bgColor: 'bg-emerald-500'
  },
  {
    name: 'Stopwatch & Timer',
    description: 'Precision timing tools',
    href: '/stopwatch-timer',
    icon: Clock,
    color: 'text-white',
    bgColor: 'bg-emerald-500'
  },
  {
    name: 'Unit Converter',
    description: 'Convert between measurement units',
    href: '/unit-converter',
    icon: Ruler,
    color: 'text-white',
    bgColor: 'bg-emerald-500'
  },
  {
    name: 'Calculator',
    description: 'Advanced scientific calculator',
    href: '/calculator',
    icon: Calculator,
    color: 'text-white',
    bgColor: 'bg-emerald-500'
  },
  {
    name: 'Color Picker',
    description: 'RGB, HEX, HSL converter',
    href: '/color-picker',
    icon: Palette,
    color: 'text-white',
    bgColor: 'bg-emerald-500'
  },
  {
    name: 'Currency Converter',
    description: 'Real-time exchange rates',
    href: '/currency-converter',
    icon: DollarSign,
    color: 'text-white',
    bgColor: 'bg-emerald-500'
  },
  {
    name: 'Base64 Tools',
    description: 'Encode and decode Base64',
    href: '/base64-tools',
    icon: Code,
    color: 'text-white',
    bgColor: 'bg-emerald-500'
  },
  {
    name: 'JSON Formatter',
    description: 'Format and validate JSON',
    href: '/json-formatter',
    icon: FileText,
    color: 'text-white',
    bgColor: 'bg-emerald-500'
  },
  {
    name: 'JavaScript Minifier',
    description: 'Minify and format JavaScript code',
    href: '/javascript-minifier',
    icon: Code,
    color: 'text-white',
    bgColor: 'bg-emerald-500'
  },
  {
    name: 'QR Code Generator',
    description: 'Create custom QR codes',
    href: '/qr-generator',
    icon: QrCode,
    color: 'text-white',
    bgColor: 'bg-emerald-500'
  },
  {
    name: 'File Hash Generator',
    description: 'Generate file checksums',
    href: '/file-hash',
    icon: Hash,
    color: 'text-white',
    bgColor: 'bg-emerald-500'
  },
  {
    name: 'CSS Minifier',
    description: 'Minify and format CSS code',
    href: '/css-minifier',
    icon: FileText,
    color: 'text-white',
    bgColor: 'bg-emerald-500'
  }
] as const