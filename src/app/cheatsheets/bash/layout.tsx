export const metadata = {
  title: 'Bash One-Liners - Developer Cheat Sheets | PassZap | PassZap',
  descrption: 'Essential Bash commands and one-liners for efficient terminal usage and system administration',
  keywords: [ 'bash one-liners', 'bash commands', 'terminal shortcuts', 'system administration', 'developer cheat sheets'],
  openGraph: {
    title: 'Bash One-Liners - Developer Cheat Sheets | PassZap | PassZap',
    description: 'Essential Bash commands and one-liners for efficient terminal usage and system administration used for daily routine tasks',
    url: 'https://passzap.net/cheatsheets/sed-awk',
    siteName: 'PassZap',
    images: [
      {
        url: '/og/bash-og.png',
        width: 1200,
        height: 630,
        alt: 'PassZap Base64 Encoder & Decoder',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bash One-Liners - Developer Cheat Sheets | PassZap | PassZap',
    description: 'Powerful text processing commands for data manipulation with sed and awk one-liners that you can copy and use instantly',
    images: ['/og/bash-og.png'],
  },
  alternates: {
    canonical: 'https://passzap.net/cheatsheets/bash',
  },  
};

export default function bashLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}