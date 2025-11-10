export const metadata = {
  title: 'Sed & Awk One-Liners - Developer Cheat Sheets | PassZap',
  description: 'Powerful text processing commands for data manipulation with sed and awk one-liners that you can copy and use instantly',
  keywords: [ 'sed one-liners', 'awk commands', 'text processing', 'data manipulation', 'developer cheat sheets',
              'system administration', 'automation scripts', 'productivity tools'],
  openGraph: {
    title: 'Sed & Awk One-Liners - Developer Cheat Sheets | PassZap',
    description: 'Powerful text processing commands for data manipulation with sed and awk one-liners that you can copy and use instantly',
    url: 'https://passzap.net/cheatsheets/sed-awk',
    siteName: 'PassZap',
    images: [
      {
        url: '/og/sed-awk-og.png',
        width: 1200,
        height: 630,
        alt: 'PassZap Base64 Encoder & Decoder',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sed & Awk One-Liners - Developer Cheat Sheets | PassZap',
    description: 'Powerful text processing commands for data manipulation with sed and awk one-liners that you can copy and use instantly',
    images: ['/og/sed-awk-og.png'],
  },
  alternates: {
    canonical: 'https://passzap.net/cheatsheets/sed-awk',
  },  
};

export default function SedAwkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}