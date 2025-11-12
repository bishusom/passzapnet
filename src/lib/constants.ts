// constants.ts
import { 
  Lock, Clock, Calculator, Palette, DollarSign, Code, 
  FileText, Hash, Ruler, QrCode, Braces,
  FileImage, Scaling, RefreshCw, Eye,
  Terminal, FileCode, Zap
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
    name: 'Currency Converter',
    description: 'Real-time exchange rates',
    href: '/currency-converter',
    icon: DollarSign,
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
    name: 'QR Code Generator',
    description: 'Create custom QR codes',
    href: '/qr-generator',
    icon: QrCode,
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
    icon: FileCode,
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
  },
  {
    name: 'Image Format Converter',
    description: 'Convert between image formats',
    href: '/image-tools/format-converter',
    icon: RefreshCw, // You'll need to import this
    color: 'text-white',
    bgColor: 'bg-emerald-500'
  },
  {
    name: 'Image Resizer',
    description: 'Resize and compress images in browser',
    href: '/image-tools/image-resizer',
    icon: Scaling, // You'll need to import this
    color: 'text-white',
    bgColor: 'bg-emerald-500'
  },
  {
    name: 'Metadata Viewer',
    description: 'View and strip image metadata',
    href: '/image-tools/metadata-viewer',
    icon: Eye, // You'll need to import this
    color: 'text-white',
    bgColor: 'bg-emerald-500'
  },
  {
    name: 'Image to Base64 Converter',
    description: 'Convert images to Base64 strings',
    href: '/image-tools/image-to-base64',
    icon: FileImage, // You'll need to import this
    color: 'text-white',
    bgColor: 'bg-emerald-500'
  },
  // Add cheat sheets as individual utilities
  {
    name: 'Bash Cheat Sheet',
    description: 'Essential terminal commands and one-liners',
    href: '/cheatsheets/bash',
    icon: Terminal,
    color: 'text-white',
    bgColor: 'bg-emerald-500'
  },
  {
    name: 'Sed & Awk Cheat Sheet',
    description: 'Powerful text processing commands',
    href: '/cheatsheets/sed-awk',
    icon: FileCode,
    color: 'text-white',
    bgColor: 'bg-emerald-500'
  },
  {
    name: 'Python Cheat Sheet',
    description: 'Quick Python snippets for common tasks',
    href: '/cheatsheets/python',
    icon: Braces,
    color: 'text-white',
    bgColor: 'bg-emerald-500'
  },
  {
    name: 'PowerShell Cheat Sheet',
    description: 'Windows administration commands',
    href: '/cheatsheets/powershell',
    icon: Zap,
    color: 'text-white',
    bgColor: 'bg-emerald-500'
  }
] as const;