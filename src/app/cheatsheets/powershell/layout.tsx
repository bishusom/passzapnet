export const metadata = {
  title: 'PowerShell One-Liners - Developer Cheat Sheets | PassZap',
  descrption: 'Important PowerShell commands and one-liners for Windows system administration and automation',
  keywords: [ 'bash one-liners', 'bash commands', 'terminal shortcuts', 'system administration', 'developer cheat sheets'],
  openGraph: {
    title: 'PowerShell One-Liners - Developer Cheat Sheets | PassZap',
    description: 'Important PowerShell commands and one-liners for Windows system administration and automation used for daily routine tasks',
    url: 'https://passzap.net/cheatsheets/sed-awk',
    siteName: 'PassZap',
    images: [
      {
        url: '/og/powershell-og.png',
        width: 1200,
        height: 630,
        alt: 'PassZap Base64 Encoder & Decoder',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PowerShell One-Liners - Developer Cheat Sheets | PassZap',
    description: 'Important PowerShell commands and one-liners for Windows system administration and automation used for daily routine tasks',
    images: ['/og/powershell-og.png'],
  },
  alternates: {
    canonical: 'https://passzap.net/cheatsheets/powershell',
  },  
};

export default function powershellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}