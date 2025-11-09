import './globals.css'
import type { Metadata } from 'next'
import { GoogleAnalytics } from '@next/third-parties/google';
import { Breadcrumbs, SeoBreadcrumbs } from '@/components/layout/Breadcrumbs'; 

export const metadata: Metadata = {
  title: 'PassZap - Free Online Utilities & Tools for Developers',
  description: 'Free online tools including password generator, stopwatch, unit converter, calculator, color picker, currency converter, and more developer utilities.',
  keywords: 'password generator, online tools, unit converter, calculator, developer utilities',
  openGraph: {
    title: 'PassZap - Free Online Utilities & Tools for Developers',
    description: 'Free online tools including password generator, stopwatch, unit converter, calculator, color picker, currency converter, and more developer utilities.',
    url: 'https://passzap.net',
    siteName: 'PassZap',
    images: [
      {
        url: 'https://passzap.net/og-image.png',
        width: 1200,
        height: 630,
        alt: 'PassZap Open Graph Image',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PassZap - Free Online Utilities & Tools for Developers',
    description: 'Free online tools including password generator, stopwatch, unit converter, calculator, color picker, currency converter, and more developer utilities.',
    images: ['https://passzap.net/og-image.png'],
  },
  alternates: {
    canonical: 'https://passzap.net',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const isProduction = process.env.NODE_ENV === 'production';
  
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "PassZap",
              "url": "https://passzap.net",
              "description": "Free online utilities and tools for developers and everyday use",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://passzap.net/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
        <SeoBreadcrumbs />
      </head>
      <body className="min-h-screen bg-gray-50 antialiased">
        <Breadcrumbs />
        <main className="min-h-screen">
          {children}
        </main>
        
        {isProduction && <GoogleAnalytics gaId="G-P7DG67YFC0" />}
      </body>
    </html>
  )
}