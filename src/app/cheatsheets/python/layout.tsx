export const metadata = {
  title: 'Python Cheatsheet - Developer Cheat Sheets | PassZap',
  description: 'Comprehensive Python cheatsheet covering syntax, data structures, functions, and libraries for efficient coding',
  keywords: [ 'python cheatsheet', 'python syntax', 'data structures', 'functions', 'libraries', 'developer cheat sheets',
              'programming reference', 'coding guide', 'productivity tools'],
  openGraph: {
    title: 'Python Cheatsheet - Developer Cheat Sheets | PassZap',
    description: 'Comprehensive Python cheatsheet covering syntax, data structures, functions, and libraries for efficient coding',
    url: 'https://passzap.net/cheatsheets/python',
    siteName: 'PassZap',
    images: [
      {
        url: '/og/python-og.png',
        width: 1200,
        height: 630,
        alt: 'PassZap Python Cheatsheet',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Python Cheatsheet - Developer Cheat Sheets | PassZap',
    description: 'Comprehensive Python cheatsheet covering syntax, data structures, functions, and libraries for efficient coding',
    images: ['/og/python-og.png'],
  },
  alternates: {
    canonical: 'https://passzap.net/cheatsheets/python',
  },  
};

export default function pythonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}