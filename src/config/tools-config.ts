import { 
  Lock, Clock, Calculator, Palette, DollarSign, Code, 
  FileArchive, FileText, Hash, Ruler, QrCode, Braces,
  FileCode, FileImage, RefreshCw, Eye, Terminal, Zap, 
  Crop, Type, Image, Shield, Database, Cpu, Wifi, Globe,
  Music, Video, BookOpen, Layers, Component, Scaling,
  Pipette, Search, PaintBucket, Regex, Combine, Monitor
} from 'lucide-react';

export interface ToolSEOConfig {
  title: string;
  description: string;
  keywords: string;
  ogImage: string;
  canonical: string;
}

export interface ToolConfig {
  id: string;
  name: string;
  description: string;
  category: string;
  categoryName: string;
  icon: any; // Lucide icon component
  color: string;
  bgColor: string;
  seo: ToolSEOConfig;
  featured?: boolean;
  href: string;
}

export interface CategoryConfig {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  bgColor: string;
  tools: ToolConfig[];
}

// Categories configuration - merged from constants.ts
export const categoriesConfig: Record<string, Omit<CategoryConfig, 'tools'>> = {
  'security': {
    id: 'security',
    name: 'Security & Privacy',
    description: 'Tools for security, encryption, and privacy protection',
    icon: Shield,
    color: 'text-green-500',
    bgColor: 'bg-green-50'
  },
  'date-time-tools': {
    id: 'date-time-tools',
    name: 'Date & Time Tools',
    description: 'Convert between date formats, timezones, and timestamps',
    icon: Clock,
    color: 'text-green-500',
    bgColor: 'bg-green-50'
  },
  utilities: {
    id: 'utilities',
    name: 'Uitlity Tools',
    description: 'Various calculation and conversion tools',
    icon: Calculator,
    color: 'text-green-500',
    bgColor: 'bg-green-50'
  },
  'developer': {
    id: 'developer',
    name: 'Developer Tools',
    description: 'Tools for developers and programmers',
    icon: Code,
    color: 'text-green-500',
    bgColor: 'bg-green-50'
  },
  'graphics': {
    id: 'graphics',
    name: 'Image & Graphics',
    description: 'Tools for image editing, graphics, and visual content',
    icon: Image,
    color: 'text-green-500',
    bgColor: 'bg-green-50'
  },
  'design-tools': {
    id: 'design-tools',
    name: 'Design & UI Tools',
    description: 'Tools for design, UI/UX, and visual creation',
    icon: Palette,
    color: 'text-green-500',
    bgColor: 'bg-green-50'
  },
  'media-tools': {
    id: 'media-tools',
    name: 'Media Processing',
    description: 'Tools for media files conversion and processing',
    icon: Video,
    color: 'text-green-500',
    bgColor: 'bg-green-50'
  },
  'system-tools': {
    id: 'system-tools',
    name: 'System & Network',
    description: 'Tools for system utilities and network analysis',
    icon: Cpu,
    color: 'text-green-500',
    bgColor: 'bg-green-50'
  },
  cheatsheets: {
    id: 'cheatsheets',
    name: 'Cheat Sheets',
    description: 'Quick reference guides and documentation',
    icon: BookOpen,
    color: 'text-green-500',
    bgColor: 'bg-green-50'
  }
};

// Complete tools configuration with all utilities from constants.ts + SEO
export const toolsConfig: Record<string, ToolConfig> = {
  // 🔐 Security & Privacy
  'password-generator': {
    id: 'password-generator',
    name: 'Password Generator',
    description: 'Generate secure passwords and check strength',
    category: 'security',
    categoryName: 'Security & Privacy',
    icon: Lock,
    color: 'text-red-500',
    bgColor: 'bg-red-50',
    href: '/tools/security/password-generator',
    seo: {
      title: 'Password Generator - Create Strong Secure Passwords | PassZap',
      description: 'Free online password generator tool. Create strong, secure passwords with customizable length, character types, and security options.',
      keywords: 'password generator, secure password, random password, password creator, strong password',
      ogImage: '/og/password-generator-og.png',
      canonical: 'https://passzap.net/tools/security/password-generator'
    }
  },
  'file-hash': {
    id: 'file-hash',
    name: 'File Hash Generator',
    description: 'Generate file checksums and verify integrity',
    category: 'security',
    categoryName: 'Security & Privacy',
    icon: Hash,
    color: 'text-red-500',
    bgColor: 'bg-red-50',
    href: '/tools/security/file-hash',
    seo: {
      title: 'File Hash Generator - Generate File Checksums | PassZap',
      description: 'Free online file hash generator. Generate MD5, SHA-1, SHA-256 checksums to verify file integrity and detect modifications.',
      keywords: 'file hash generator, checksum, md5, sha1, sha256, file integrity',
      ogImage: '/og/file-hash-og.png',
      canonical: 'https://passzap.net/tools/security/file-hash'
    }
  },
  'encryption-tools': {
    id: 'encryption-tools',
    name: 'Data Encryption',
    description: 'Encrypt and decrypt text securely',
    category: 'security',
    categoryName: 'Security & Privacy',
    icon: Shield,
    color: 'text-red-500',
    bgColor: 'bg-red-50',
    href: '/tools/security/encryption-tools',
    seo: {
      title: 'Data Encryption Tools - Encrypt & Decrypt Text | PassZap',
      description: 'Free online data encryption tools. Encrypt and decrypt text using various algorithms securely in your browser.',
      keywords: 'encryption tools, text encryption, data security, encrypt decrypt, crypto tools',
      ogImage: '/og/encryption-tools-og.png',
      canonical: 'https://passzap.net/tools/security/encryption-tools'
    }
  },

  // 💻 Developer Tools
  'base64-tools': {
    id: 'base64-tools',
    name: 'Base64 Tools',
    description: 'Encode and decode Base64',
    category: 'developer',
    categoryName: 'Developer Tools',
    icon: Code,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
    href: '/tools/developer/base64-tools',
    seo: {
      title: 'Base64 Tools - Encode & Decode Base64 Online | PassZap',
      description: 'Free online Base64 encoding and decoding tools. Convert text, images, and files to Base64 format securely in your browser.',
      keywords: 'base64 encode, base64 decode, base64 converter, base64 tools',
      ogImage: '/og/base64-tools-og.png',
      canonical: 'https://passzap.net/tools/developer/base64-tools'
    }
  },
  'json-formatter': {
    id: 'json-formatter',
    name: 'JSON Formatter',
    description: 'Format and validate JSON',
    category: 'developer',
    categoryName: 'Developer Tools',
    icon: Braces,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
    href: '/tools/developer/json-formatter',
    seo: {
      title: 'JSON Formatter & Validator - Beautify and Validate JSON Online | PassZap',
      description: 'Free online JSON formatter, validator, and beautifier tool. Format, validate, and minify JSON data with syntax highlighting. No data stored.',
      keywords: 'json formatter, json validator, json beautifier, json minify, json prettifier, json parser',
      ogImage: '/og/json-formatter-og.png',
      canonical: 'https://passzap.net/tools/developer/json-formatter'
    }
  },
  'javascript-minifier': {
    id: 'javascript-minifier',
    name: 'JavaScript Minifier',
    description: 'Minify and format JavaScript code',
    category: 'developer',
    categoryName: 'Developer Tools',
    icon: FileCode,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
    href: '/tools/developer/javascript-minifier',
    seo: {
      title: 'JavaScript Minifier - Minify JS Code Online | PassZap',
      description: 'Free online JavaScript minifier tool. Minify and compress JS code to reduce file size and improve website performance.',
      keywords: 'javascript minifier, js minify, code compression, javascript compressor',
      ogImage: '/og/javascript-minifier-og.png',
      canonical: 'https://passzap.net/tools/developer/javascript-minifier'
    }
  },
  'css-minifier': {
    id: 'css-minifier',
    name: 'CSS Minifier',
    description: 'Minify and format CSS code',
    category: 'developer',
    categoryName: 'Developer Tools',
    icon: FileText,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
    href: '/tools/developer/css-minifier',
    seo: {
      title: 'CSS Minifier - Minify CSS Code Online | PassZap',
      description: 'Free online CSS minifier tool. Minify and compress CSS code to reduce file size and improve website loading speed.',
      keywords: 'css minifier, css minify, css compression, stylesheet optimizer',
      ogImage: '/og/css-minifier-og.png',
      canonical: 'https://passzap.net/tools/developer/css-minifier'
    }
  },
  'sql-formatter': {
    id: 'sql-formatter',
    name: 'SQL Formatter',
    description: 'Format and beautify SQL queries',
    category: 'developer',
    categoryName: 'Developer Tools',
    icon: Database,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
    href: '/tools/developer/sql-formatter',
    seo: {
      title: 'SQL Formatter & Beautifier - Format SQL Queries Online | PassZap',
      description: 'Free online SQL formatter and beautifier tool. Format, validate, and beautify SQL queries with syntax highlighting. Supports MySQL, PostgreSQL, SQL Server.',
      keywords: 'sql formatter, sql beautifier, sql prettifier, sql validator, sql query formatter',
      ogImage: '/og/sql-formatter-og.png',
      canonical: 'https://passzap.net/tools/developer/sql-formatter'
    }
  },
  'regex-tester': {
    id: 'regex-tester',
    name: 'Regex Tester',
    description: 'Test and debug regular expressions',
    category: 'developer',
    categoryName: 'Developer Tools',
    icon: Search,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
    href: '/tools/developer/regex-tester',
    seo: {
      title: 'Regex Tester & Debugger - Test Regular Expressions Online | PassZap',
      description: 'Free online regex tester and debugger tool. Test, validate, and debug regular expressions with real-time matching, groups, and replacements.',
      keywords: 'regex tester, regular expression tester, regex debugger, regex matcher, pattern testing',
      ogImage: '/og/regex-tester-og.png',
      canonical: 'https://passzap.net/tools/developer/regex-tester'
    }
  },

  // 🖼️ Image & Graphics
  'image-format-converter': {
    id: 'image-format-converter',
    name: 'Image Format Converter',
    description: 'Convert between image formats',
    category: 'graphics',
    categoryName: 'Image & Graphics',
    icon: RefreshCw,
    color: 'text-purple-500',
    bgColor: 'bg-purple-50',
    href: '/tools/graphics/image-format-converter',
    featured: true,
    seo: {
      title: 'Image Format Converter - Convert Image Formats Online | PassZap',
      description: 'Free online image format converter tool. Convert between JPG, PNG, WebP, GIF, and other image formats instantly in your browser.',
      keywords: 'image converter, format converter, jpg to png, png to webp, image format converter',
      ogImage: '/og/image-format-converter-og.png',
      canonical: 'https://passzap.net/tools/graphics/image-format-converter'
    }
  },
  'image-resizer': {
    id: 'image-resizer',
    name: 'Image Resizer',
    description: 'Resize and compress images in browser',
    category: 'graphics',
    categoryName: 'Image & Graphics',
    icon: Scaling,
    color: 'text-purple-500',
    bgColor: 'bg-purple-50',
    href: '/tools/graphics/image-resizer',
    seo: {
      title: 'Image Resizer - Resize Photos Online | PassZap',
      description: 'Free online image resizer tool. Resize, compress, and optimize images in your browser. No uploads required, complete privacy.',
      keywords: 'image resizer, photo resizer, resize images, image compressor, photo optimization',
      ogImage: '/og/image-resizer-og.png',
      canonical: 'https://passzap.net/tools/graphics/image-resizer'
    }
  },
  'image-cropper': {
    id: 'image-cropper',
    name: 'Image Cropper',
    description: 'Crop images with precision tools',
    category: 'graphics',
    categoryName: 'Image & Graphics',
    icon: Crop,
    color: 'text-purple-500',
    bgColor: 'bg-purple-50',
    href: '/tools/graphics/image-cropper',
    seo: {
      title: 'Image Cropper - Crop Photos Online | PassZap',
      description: 'Free online image cropper tool. Crop photos, images, and pictures with precision. Adjust aspect ratios, rotate, and download cropped images instantly.',
      keywords: 'image cropper, photo cropper, crop image online, image editing, photo editing',
      ogImage: '/og/image-cropper-og.png',
      canonical: 'https://passzap.net/tools/graphics/image-cropper'
    }
  },
  'image-compressor': {
    id: 'image-compressor',
    name: 'Image Compressor',
    description: 'Compress images without losing quality',
    category: 'graphics',
    categoryName: 'Image & Graphics',
    icon: FileArchive,
    color: 'text-purple-500',
    bgColor: 'bg-purple-50',
    href: '/tools/graphics/image-compressor',
    seo: {
      title: 'Image Compressor - Compress Photos Online | PassZap',
      description: 'Free online image compressor tool. Reduce image file size while maintaining quality. Compress JPG, PNG, WebP images for web and mobile.',
      keywords: 'image compressor, photo compressor, compress images, reduce image size, image optimization',
      ogImage: '/og/image-compressor-og.png',
      canonical: 'https://passzap.net/tools/graphics/image-compressor'
    }
  },
  'image-metadata-viewer': {
    id: 'image-metadata-viewer',
    name: 'Metadata Viewer',
    description: 'View and strip image metadata',
    category: 'graphics',
    categoryName: 'Image & Graphics',
    icon: Eye,
    color: 'text-purple-500',
    bgColor: 'bg-purple-50',
    href: '/tools/graphics/image-metadata-viewer',
    seo: {
      title: 'Image Metadata Viewer - View & Remove EXIF Data | PassZap',
      description: 'Free online image metadata viewer tool. View EXIF data, GPS coordinates, and camera information. Option to strip metadata for privacy.',
      keywords: 'metadata viewer, exif data, image metadata, photo information, metadata remover',
      ogImage: '/og/metadata-viewer-og.png',
      canonical: 'https://passzap.net/tools/graphics/image-metadata-viewer'
    }
  },
  'image-to-base64': {
    id: 'image-to-base64',
    name: 'Image to Base64 Converter',
    description: 'Convert images to Base64 strings',
    category: 'graphics',
    categoryName: 'Image & Graphics',
    icon: FileImage,
    color: 'text-purple-500',
    bgColor: 'bg-purple-50',
    href: '/tools/graphics/image-to-base64',
    seo: {
      title: 'Image to Base64 Converter - Convert Images to Base64 | PassZap',
      description: 'Free online image to Base64 converter tool. Convert images to Base64 data URLs for web development and data URIs.',
      keywords: 'image to base64, base64 converter, data url, image encoder, base64 image',
      ogImage: '/og/image-to-base64-og.png',
      canonical: 'https://passzap.net/tools/graphics/image-to-base64'
    }
  },

  // 🎨 Design & UI Tools
  'color-picker': {
    id: 'color-picker',
    name: 'Color Picker',
    description: 'RGB, HEX, HSL converter',
    category: 'design-tools',
    categoryName: 'Design & UI Tools',
    icon: Pipette,
    color: 'text-pink-500',
    bgColor: 'bg-pink-50',
    href: '/tools/design-tools/color-picker',
    featured: true,
    seo: {
      title: 'Color Picker - RGB, HEX, HSL Color Converter | PassZap',
      description: 'Free online color picker tool. Convert between RGB, HEX, HSL color formats. Pick colors and get color codes for web development.',
      keywords: 'color picker, rgb converter, hex converter, hsl converter, color tools',
      ogImage: '/og/color-picker-og.png',
      canonical: 'https://passzap.net/tools/design-tools/color-picker'
    }
  },
  'color-palette': {
    id: 'color-palette',
    name: 'Color Palette Generator',
    description: 'Extract dominant colors from images',
    category: 'design-tools',
    categoryName: 'Design & UI Tools',
    icon: Palette,
    color: 'text-pink-500',
    bgColor: 'bg-pink-50',
    href: '/tools/design-tools/color-palette',
    seo: {
      title: 'Color Palette Generator - Extract Colors from Images | PassZap',
      description: 'Free online color palette generator. Extract color schemes from images, create beautiful palettes, and get HEX, RGB, HSL codes.',
      keywords: 'color palette generator, color extractor, image color picker, color scheme generator',
      ogImage: '/og/color-palette-og.png',
      canonical: 'https://passzap.net/tools/design-tools/color-palette'
    }
  },
  'qr-generator': {
    id: 'qr-generator',
    name: 'QR Code Generator',
    description: 'Create custom QR codes',
    category: 'design-tools',
    categoryName: 'Design & UI Tools',
    icon: QrCode,
    color: 'text-pink-500',
    bgColor: 'bg-pink-50',
    href: '/tools/design-tools/qr-generator',
    seo: {
      title: 'QR Code Generator - Create Custom QR Codes Online | PassZap',
      description: 'Free online QR code generator tool. Create custom QR codes for URLs, text, contact information, and more. Download in high quality.',
      keywords: 'qr code generator, qr code creator, qr code maker, custom qr codes',
      ogImage: '/og/qr-generator-og.png',
      canonical: 'https://passzap.net/tools/design-tools/qr-generator'
    }
  },
  'css-gradient-generator': {
    id: 'css-gradient-generator',
    name: 'CSS Gradient Generator',
    description: 'Create beautiful CSS gradients with preview',
    category: 'design-tools',
    categoryName: 'Design & UI Tools',
    icon: PaintBucket,
    color: 'text-pink-500',
    bgColor: 'bg-pink-50',
    href: '/tools/design-tools/css-gradient-generator',
    seo: {
      title: 'CSS Gradient Generator - Create Beautiful Gradients Online | PassZap',
      description: 'Free online CSS gradient generator. Create linear, radial, and conic gradients with color stops, angles, and preview. Get ready-to-use CSS code.',
      keywords: 'css gradient generator, gradient maker, css gradients, linear gradient, radial gradient, gradient background',
      ogImage: '/og/css-gradient-generator-og.png',
      canonical: 'https://passzap.net/tools/design-tools/css-gradient-generator'
    }
  },
  'favicon-generator': {
    id: 'favicon-generator',
    name: 'Favicon Generator',
    description: 'Create favicons for all devices',
    category: 'design-tools',
    categoryName: 'Design & UI Tools',
    icon: Globe,
    color: 'text-pink-500',
    bgColor: 'bg-pink-50',
    href: '/tools/design-tools/favicon-generator',
    seo: {
      title: 'Favicon Generator - Create Favicons for All Devices | PassZap',
      description: 'Free online favicon generator tool. Create favicons for websites that work on all devices and browsers. Multiple formats and sizes.',
      keywords: 'favicon generator, website icon, browser icon, favicon maker',
      ogImage: '/og/favicon-generator-og.png',
      canonical: 'https://passzap.net/tools/design-tools/favicon-generator'
    }
  },
  'icon-generator': {
    id: 'icon-generator',
    name: 'Icon Generator',
    description: 'Create app icons in multiple sizes',
    category: 'design-tools',
    categoryName: 'Design & UI Tools',
    icon: Component,
    color: 'text-pink-500',
    bgColor: 'bg-pink-50',
    href: '/tools/design-tools/icon-generator',
    seo: {
      title: 'Icon Generator - Create App Icons in Multiple Sizes | PassZap',
      description: 'Free online icon generator tool. Create app icons for iOS, Android, and web apps in multiple sizes and formats.',
      keywords: 'icon generator, app icon, mobile icon, icon maker, app icon generator',
      ogImage: '/og/icon-generator-og.png',
      canonical: 'https://passzap.net/tools/design-tools/icon-generator'
    }
  },
  'svg-converter': {
    id: 'svg-converter',
    name: 'SVG Converter',
    description: 'Convert images to SVG and optimize vectors',
    category: 'design-tools',
    categoryName: 'Design & UI Tools',
    icon: FileImage,
    color: 'text-pink-500',
    bgColor: 'bg-pink-50',
    href: '/tools/design-tools/svg-converter',
    seo: {
      title: 'SVG Converter - Convert & Optimize SVG Images | PassZap',
      description: 'Free online SVG converter tool. Convert images to SVG format and optimize vector graphics for web use.',
      keywords: 'svg converter, vector converter, svg optimizer, image to svg',
      ogImage: '/og/svg-converter-og.png',
      canonical: 'https://passzap.net/tools/design-tools/svg-converter'
    }
  },
  'font-converter': {
    id: 'font-converter',
    name: 'Font Converter',
    description: 'Convert between font formats',
    category: 'design-tools',
    categoryName: 'Design & UI Tools',
    icon: Type,
    color: 'text-pink-500',
    bgColor: 'bg-pink-50',
    href: '/tools/design-tools/font-converter',
    seo: {
      title: 'Font Converter - Convert Between Font Formats | PassZap',
      description: 'Free online font converter tool. Convert between TTF, OTF, WOFF, WOFF2 font formats for web and desktop use.',
      keywords: 'font converter, ttf to woff, otf to woff2, font format converter',
      ogImage: '/og/font-converter-og.png',
      canonical: 'https://passzap.net/tools/design-tools/font-converter'
    }
  },

  // 📄 Media Processing
  'audio-trimmer': {
    id: 'audio-trimmer',
    name: 'Audio Trimmer',
    description: 'Cut and trim audio files with precision',
    category: 'media-tools',
    categoryName: 'Media Processing',
    icon: Music,
    color: 'text-teal-500',
    bgColor: 'bg-teal-50',
    href: '/tools/media-tools/audio-trimmer',
    seo: {
      title: 'Audio Trimmer - Cut & Trim Audio Files Online | PassZap',
      description: 'Free online audio trimmer tool. Cut and trim audio files with sample-accurate precision. Supports MP3, WAV, OGG, M4A and other formats. No uploads required.',
      keywords: 'audio trimmer, cut audio, trim audio, audio editor, audio cutter, mp3 trimmer, wav trimmer',
      ogImage: '/og/audio-trimmer-og.png',
      canonical: 'https://passzap.net/tools/media-tools/audio-trimmer'
    }
  },
  'video-trimmer': {
    id: 'video-trimmer',
    name: 'Video Trimmer',
    description: 'Cut and trim video files in browser',
    category: 'media-tools',
    categoryName: 'Media Processing',
    icon: Video,
    color: 'text-teal-500',
    bgColor: 'bg-teal-50',
    href: '/tools/media-tools/video-trimmer',
    seo: {
      title: 'Video Trimmer - Cut & Trim Video Files Online | PassZap',
      description: 'Free online video trimmer tool. Cut and trim video files directly in your browser. Supports MP4, WebM, MOV and other formats. No uploads required.',
      keywords: 'video trimmer, cut video, trim video, video editor, video cutter, mp4 trimmer, video editing',
      ogImage: '/og/video-trimmer-og.png',
      canonical: 'https://passzap.net/tools/media-tools/video-trimmer'
    }
  },
  'audio-joiner': {
    id: 'audio-joiner',
    name: 'Audio Joiner',
    description: 'Merge multiple audio files into one',
    category: 'media-tools',
    categoryName: 'Media Processing',
    icon: Combine,
    color: 'text-teal-500',
    bgColor: 'bg-teal-50',
    href: '/tools/media-tools/audio-joiner',
    seo: {
      title: 'Audio Joiner - Merge Audio Files Online | PassZap',
      description: 'Free online audio joiner tool. Combine multiple audio files into one seamless track. Supports MP3, WAV, OGG, M4A and other formats. No uploads required.',
      keywords: 'audio joiner, merge audio, combine audio files, audio merger, join mp3, audio concatenation',
      ogImage: '/og/audio-joiner-og.png',
      canonical: 'https://passzap.net/tools/media-tools/audio-joiner'
    }
  },
  'pdf-tools': {
    id: 'pdf-tools',
    name: 'PDF Tools',
    description: 'Merge, split, and compress PDF files',
    category: 'media-tools',
    categoryName: 'Media Processing',
    icon: FileText,
    color: 'text-teal-500',
    bgColor: 'bg-teal-50',
    href: '/tools/media-tools/pdf-tools',
    seo: {
      title: 'PDF Tools - Edit, Merge, Split & Compress PDFs | PassZap',
      description: 'Free online PDF tools. Merge, split, compress, and edit PDF files. All processing happens in your browser - no file uploads, complete privacy.',
      keywords: 'pdf tools, merge pdf, split pdf, compress pdf, edit pdf, pdf editor',
      ogImage: '/og/pdf-tools-og.png',
      canonical: 'https://passzap.net/tools/media-tools/pdf-tools'
    }
  },

  // 🧮 Calculators & Converters
  'calculator': {
    id: 'calculator',
    name: 'Calculator',
    description: 'Advanced scientific calculator',
    category: 'utilities',
    categoryName: 'Utility Tools',
    icon: Calculator,
    color: 'text-green-500',
    bgColor: 'bg-green-50',
    href: '/tools/utilities/calculator',
    seo: {
      title: 'Scientific Calculator - Advanced Online Calculator | PassZap',
      description: 'Free online scientific calculator with advanced functions. Perform complex calculations, trigonometry, logarithms, and more.',
      keywords: 'calculator, scientific calculator, online calculator, math calculator, advanced calculator',
      ogImage: '/og/calculator-og.png',
      canonical: 'https://passzap.net/tools/utilities/calculator'
    }
  },
  'currency-converter': {
    id: 'currency-converter',
    name: 'Currency Converter',
    description: 'Real-time exchange rates',
    category: 'utilities',
    categoryName: 'Utility Tools',
    icon: DollarSign,
    color: 'text-green-500',
    bgColor: 'bg-green-50',
    href: '/tools/utilities/currency-converter',
    seo: {
      title: 'Currency Converter - Live Exchange Rates | PassZap',
      description: 'Free online currency converter tool. Convert between world currencies with live exchange rates. Supports USD, EUR, GBP, JPY, and many more.',
      keywords: 'currency converter, exchange rates, money converter, forex converter, usd converter, eur converter',
      ogImage: '/og/currency-converter-og.png',
      canonical: 'https://passzap.net/tools/utilities/currency-converter'
    }
  },
  'unit-converter': {
    id: 'unit-converter',
    name: 'Unit Converter',
    description: 'Convert between measurement units',
    category: 'utilities',
    categoryName: 'Utility Tools',
    icon: Ruler,
    color: 'text-green-500',
    bgColor: 'bg-green-50',
    href: '/tools/utilities/unit-converter',
    seo: {
      title: 'Unit Converter - Convert Measurement Units Online | PassZap',
      description: 'Free online unit converter tool. Convert between length, weight, temperature, volume, and other measurement units. Fast, accurate, and easy to use.',
      keywords: 'unit converter, measurement converter, length converter, weight converter, temperature converter',
      ogImage: '/og/unit-converter-og.png',
      canonical: 'https://passzap.net/tools/utilities/unit-converter'
    }
  },
  'stopwatch-timer': {
    id: 'stopwatch-timer',
    name: 'Stopwatch & Timer',
    description: 'Precision timing tools',
    category: 'date-time-tools',
    categoryName: 'Date & Time Tools',
    icon: Clock,
    color: 'text-green-500',
    bgColor: 'bg-green-50',
    href: '/tools/date-time-tools/stopwatch-timer',
    featured: true,
    seo: {
      title: 'Stopwatch & Timer - Precision Timing Tools | PassZap',
      description: 'Free online stopwatch and timer tools. Precision timing for workouts, cooking, presentations, and more. Easy to use and accurate.',
      keywords: 'stopwatch, timer, online stopwatch, countdown timer, timing tools',
      ogImage: '/og/stopwatch-timer-og.png',
      canonical: 'https://passzap.net/tools/date-time-tools/stopwatch-timer'
    }
  },
  'timezone-converter': {
    id: 'timezone-converter',
    name: 'Timezone Converter',
    description: 'Convert times between different timezones worldwide',
    category: 'date-time-tools',
    categoryName: 'Date & Time Tools',
    icon: Globe,
    color: 'text-green-500',
    bgColor: 'bg-green-50',
    href: '/tools/date-time-tools/timezone-converter',
    featured: true,
    seo: {
      title: 'Timezone Converter - Convert Time Between Timezones | PassZap',
      description: 'Free online timezone converter tool. Convert times between different timezones worldwide with daylight saving time support.',
      keywords: 'timezone converter, time zone converter, world time, time conversion, daylight saving time',
      ogImage: '/og/timezone-converter-og.png',
      canonical: 'https://passzap.net/tools/date-time-tools/timezone-converter'
    }
  },
'epoch-converter': {
  id: 'epoch-converter',
  name: 'Epoch Timestamp Converter',
  description: 'Convert Unix timestamps to human-readable dates and vice versa',
  category: 'date-time-tools',
  categoryName: 'Date & Time Tools',
  icon: Clock,
  color: 'text-green-500',
  bgColor: 'bg-green-50',
  href: '/tools/date-time-tools/epoch-converter',
  seo: {
    title: 'Epoch Converter - Unix Timestamp Converter | PassZap',
    description: 'Free online epoch timestamp converter. Convert Unix timestamps to human-readable dates and vice versa. Supports seconds, milliseconds, and microseconds.',
    keywords: 'epoch converter, unix timestamp converter, timestamp to date, date to timestamp, unix time',
    ogImage: '/og/epoch-converter-og.png',
    canonical: 'https://passzap.net/tools/date-time-tools/epoch-converter'
  }
},
'ldap-converter': {
  id: 'ldap-converter',
  name: 'LDAP Timestamp Converter',
  description: 'Convert LDAP/Active Directory timestamps to readable dates',
  category: 'date-time-tools',
  categoryName: 'Date & Time Tools',
  icon: Database,
  color: 'text-green-500',
  bgColor: 'bg-green-50',
  href: '/tools/date-time-tools/ldap-converter',
  seo: {
    title: 'LDAP Timestamp Converter - Active Directory Time Converter | PassZap',
    description: 'Free online LDAP timestamp converter. Convert LDAP/Active Directory timestamps (18-digit format) to human-readable dates and vice versa.',
    keywords: 'ldap timestamp converter, active directory timestamp, ldap time, windows time converter, 18-digit timestamp',
    ogImage: '/og/ldap-converter-og.png',
    canonical: 'https://passzap.net/tools/date-time-tools/ldap-converter'
  }
},
'unix-hex-converter': {
  id: 'unix-hex-converter',
  name: 'Unix Hex Timestamp Converter',
  description: 'Convert hexadecimal Unix timestamps to readable dates',
  category: 'date-time-tools',
  categoryName: 'Date & Time Tools',
  icon: Hash,
  color: 'text-green-500',
  bgColor: 'bg-green-50',
  href: '/tools/date-time-tools/unix-hex-converter',
  seo: {
    title: 'Unix Hex Timestamp Converter - Hexadecimal Timestamp Converter | PassZap',
    description: 'Free online Unix hex timestamp converter. Convert hexadecimal Unix timestamps to human-readable dates and vice versa.',
    keywords: 'unix hex converter, hexadecimal timestamp, hex to date, timestamp hex converter',
    ogImage: '/og/unix-hex-converter-og.png',
    canonical: 'https://passzap.net/tools/date-time-tools/unix-hex-converter'
  }
},

  // 🔧 System & Network
  'ip-tools': {
    id: 'ip-tools',
    name: 'IP Address Tools',
    description: 'IP lookup, subnet calculator, and more',
    category: 'system-tools',
    categoryName: 'System & Network',
    icon: Globe,
    color: 'text-orange-500',
    bgColor: 'bg-orange-50',
    href: '/tools/system-tools/ip-tools',
    featured: true,
    seo: {
      title: 'IP Address Tools - IP Lookup & Network Utilities | PassZap',
      description: 'Free online IP address tools. IP lookup, subnet calculator, network diagnostics, and more networking utilities.',
      keywords: 'ip tools, ip lookup, subnet calculator, network tools, ip address tools',
      ogImage: '/og/ip-tools-og.png',
      canonical: 'https://passzap.net/tools/system-tools/ip-tools'
    }
  },
  'network-tools': {
    id: 'network-tools',
    name: 'Network Tools',
    description: 'Ping, traceroute, and port scanner',
    category: 'system-tools',
    categoryName: 'System & Network',
    icon: Wifi,
    color: 'text-orange-500',
    bgColor: 'bg-orange-50',
    href: '/tools/system-tools/network-tools',
    seo: {
      title: 'Network Tools - Ping, Traceroute & Diagnostics | PassZap',
      description: 'Free online network tools including ping, traceroute, and network diagnostics. Check connectivity and troubleshoot network issues.',
      keywords: 'network tools, ping tool, traceroute, network diagnostics, connectivity test',
      ogImage: '/og/network-tools-og.png',
      canonical: 'https://passzap.net/tools/system-tools/network-tools'
    }
  },

  // 📚 Cheat Sheets
  'bash': {
    id: 'bash',
    name: 'Bash Cheat Sheet',
    description: 'Essential terminal commands and one-liners',
    category: 'cheatsheets',
    categoryName: 'Cheat Sheets',
    icon: Terminal,
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-50',
    href: '/tools/cheatsheets/bash',
    seo: {
      title: 'Bash Cheat Sheet - Essential Terminal Commands | PassZap',
      description: 'Comprehensive Bash cheat sheet with essential terminal commands, one-liners, and shell scripting tips for Linux and macOS.',
      keywords: 'bash cheat sheet, terminal commands, linux commands, shell scripting, command line',
      ogImage: '/og/bash-cheatsheet-og.png',
      canonical: 'https://passzap.net/tools/cheatsheets/bash'
    }
  },
  'sed-awk': {
    id: 'sed-awk',
    name: 'Sed & Awk Cheat Sheet',
    description: 'Powerful text processing commands',
    category: 'cheatsheets',
    categoryName: 'Cheat Sheets',
    icon: FileCode,
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-50',
    href: '/tools/cheatsheets/sed-awk',
    seo: {
      title: 'Sed & Awk Cheat Sheet - Text Processing Commands | PassZap',
      description: 'Comprehensive Sed and Awk cheat sheet with powerful text processing commands, patterns, and examples for advanced text manipulation.',
      keywords: 'sed cheat sheet, awk cheat sheet, text processing, linux commands, regex',
      ogImage: '/og/sed-awk-cheatsheet-og.png',
      canonical: 'https://passzap.net/tools/cheatsheets/sed-awk'
    }
  },
  'regex': {
    id: 'regex',
    name: 'Regex Cheat Sheet',
    description: 'Regular expressions for text matching and validation',
    category: 'cheatsheets',
    categoryName: 'Cheat Sheets',
    icon: Regex,
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-50',
    href: '/tools/cheatsheets/regex',
    seo: {
      title: 'Sed & Awk Cheat Sheet - Text Processing Commands | PassZap',
      description: 'Comprehensive Regex cheat sheet with powerful text matching and validation patterns and examples for advanced text manipulation.',
      keywords: 'regex, regular expressions, patterns, validation, cheatsheet',
      ogImage: '/og/regex-og.png',
      canonical: 'https://passzap.net/tools/cheatsheets/regex'
    }
  },
  'python': {
    id: 'python',
    name: 'Python Cheat Sheet',
    description: 'Quick Python snippets for common tasks',
    category: 'cheatsheets',
    categoryName: 'Cheat Sheets',
    icon: Braces,
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-50',
    href: '/tools/cheatsheets/python',
    seo: {
      title: 'Python Cheat Sheet - Quick Reference & Snippets | PassZap',
      description: 'Comprehensive Python cheat sheet with quick reference, common snippets, and examples for Python programming and data science.',
      keywords: 'python cheat sheet, python reference, python snippets, programming cheat sheet',
      ogImage: '/og/python-cheatsheet-og.png',
      canonical: 'https://passzap.net/tools/cheatsheets/python'
    }
  },
  'powershell': {
    id: 'powershell',
    name: 'PowerShell Cheat Sheet',
    description: 'Windows administration commands',
    category: 'cheatsheets',
    categoryName: 'Cheat Sheets',
    icon: Zap,
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-50',
    href: '/tools/cheatsheets/powershell',
    seo: {
      title: 'PowerShell Cheat Sheet - Windows Administration | PassZap',
      description: 'Comprehensive PowerShell cheat sheet with Windows administration commands, scripting tips, and system management examples.',
      keywords: 'powershell cheat sheet, windows commands, administration, scripting, windows powershell',
      ogImage: '/og/powershell-cheatsheet-og.png',
      canonical: 'https://passzap.net/tools/cheatsheets/powershell'
    }
  },
  'git': {
    id: 'git',
    name: 'Git Cheat Sheet',
    description: 'Essential Git commands and workflows',
    category: 'cheatsheets',
    categoryName: 'Cheat Sheets',
    icon: BookOpen,
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-50',
    href: '/tools/cheatsheets/git',
    seo: {
      title: 'Git Cheat Sheet - Essential Git Commands & Workflows | PassZap',
      description: 'Comprehensive Git cheat sheet with essential commands, branching strategies, workflows, and version control best practices.',
      keywords: 'git cheat sheet, git commands, version control, github, git workflow',
      ogImage: '/og/git-cheatsheet-og.png',
      canonical: 'https://passzap.net/tools/cheatsheets/git'
    }
  },
  'docker': {
    id: 'docker',
    name: 'Docker Cheat Sheet',
    description: 'Docker commands and container management',
    category: 'cheatsheets',
    categoryName: 'Cheat Sheets',
    icon: Layers,
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-50',
    href: '/tools/cheatsheets/docker',
    seo: {
      title: 'Docker Cheat Sheet - Container Management Commands | PassZap',
      description: 'Comprehensive Docker cheat sheet with container management commands, Dockerfile examples, and orchestration tips.',
      keywords: 'docker cheat sheet, docker commands, container management, dockerfile, containerization',
      ogImage: '/og/docker-cheatsheet-og.png',
      canonical: 'https://passzap.net/tools/cheatsheets/docker'
    }
  }
};

// Helper functions
export const getAllTools = (): ToolConfig[] => Object.values(toolsConfig);

export const getToolsByCategory = (category: string): ToolConfig[] => 
  getAllTools().filter(tool => tool.category === category);

export const getToolById = (id: string): ToolConfig | undefined => toolsConfig[id];

export const getCategoryById = (id: string) => {
  const category = categoriesConfig[id];
  if (!category) return null;
  
  return {
    ...category,
    tools: getToolsByCategory(id)
  };
};

export const getAllCategories = (): CategoryConfig[] => {
  return Object.values(categoriesConfig).map(category => ({
    ...category,
    tools: getToolsByCategory(category.id)
  }));
};

export const getFeaturedTools = (): ToolConfig[] => 
  getAllTools().filter(tool => tool.featured);

// Get popular categories (most tools)
export const getPopularCategories = (limit?: number) => {
  const allCats = getAllCategories().map(category => ({
    key: category.id,
    name: category.name,
    description: category.description,
    icon: category.icon,
    color: category.color,
    bgColor: category.bgColor,
    path: getCategoryPath(category.id),
    toolCount: category.tools.length
  }));
  
  const sorted = allCats.sort((a, b) => b.toolCount - a.toolCount);
  return limit ? sorted.slice(0, limit) : sorted;
};


// Get utilities grouped by category
export const getUtilitiesGroupedByCategory = () => {
  const grouped: Record<string, ToolConfig[]> = {};
  
  Object.keys(categoriesConfig).forEach(key => {
    grouped[key] = getToolsByCategory(key);
  });
  
  return grouped;
};

// Get tool by href
export const getToolByHref = (href: string): ToolConfig | undefined => {
  return getAllTools().find(tool => tool.href === href);
};

// Get category path
export const getCategoryPath = (category: string): string => {
  return `/tools/${category}`;
};

// Types for TypeScript
export type ToolCategory = keyof typeof categoriesConfig;
export type ToolId = keyof typeof toolsConfig;


export const getAllUtilities = () => getAllTools();

export const getCategoryInfo = (categoryId: string) => {
  const category = categoriesConfig[categoryId];
  if (!category) return null;
  
  const tools = getToolsByCategory(categoryId);
  return {
    key: categoryId,
    name: category.name,
    description: category.description,
    icon: category.icon,
    color: category.color,
    bgColor: category.bgColor,
    path: getCategoryPath(categoryId),
    toolCount: tools.length
  };
};
