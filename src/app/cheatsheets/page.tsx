import { utilities } from '@/lib/constants';
import ToolCard from '@/components/ui/ToolCard';
import Header from './../../components/layout/Header';
import Footer from './../../components/layout/Footer';

export const metadata = {
  title: 'Developer Cheat Sheets - Essential One-Liners | PassZap',
  description: 'Collection of developer cheat sheets with Bash, Python, Sed/Awk, and PowerShell one-liners for quick reference',
  keywords: [ 'developer cheat sheets', 'bash one-liners', 'python snippets', 'sed awk commands', 'powershell commands',
              'programming reference', 'code snippets', 'system administration', 'automation scripts', 'productivity tools'],
  openGraph: {
    title: 'Developer Cheat Sheets - Essential One-Liners | PassZap',
    description: 'Collection of developer cheat sheets with Bash, Python, Sed/Awk, and PowerShell one-liners for quick reference',
    url: 'https://passzap.net/cheatsheets',
    siteName: 'PassZap',
    images: [
      {
        url: 'https://passzap.net/og-images/cheatsheets-overview.png',
        width: 1200,
        height: 630,
        alt: 'Developer Cheat Sheets - PassZap',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Developer Cheat Sheets - Essential One-Liners | PassZap',
    description: 'Collection of developer cheat sheets with Bash, Python, Sed/Awk, and PowerShell one-liners for quick reference',
    images: ['https://passzap.net/og-images/cheatsheets-overview.png'],
  },
  alternates: {
    canonical: 'https://passzap.net/cheatsheets',
  },
};

export default function CheatSheetsPage() {
   const cheatSheetUtilities = utilities.filter(utility => 
    utility.href.startsWith('/cheatsheets/')
  );  
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
          <Header />
          
          <main className="py-8">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Developer Cheat Sheets</h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Essential one-liners and commands for developers and system administrators. 
                  Copy with one click and boost your productivity.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {cheatSheetUtilities.map((sheet) => (
                  <ToolCard key={sheet.href} {...sheet} />
                ))}
              </div>

              <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">💡 Pro Tips</h3>
                <ul className="text-blue-700 space-y-2">
                  <li>• Use the search and filter features to quickly find specific commands</li>
                  <li>• Click the copy button to instantly copy any command to your clipboard</li>
                  <li>• Bookmark your most frequently used cheat sheets for quick access</li>
                  <li>• Combine commands to create powerful automation scripts</li>
                </ul>
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
                "mainEntity": cheetSheetsFaqItems.map(faq => ({
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
  );
}

const cheetSheetsFaqItems = [
  {
    question: "What is a developer cheat sheet?",
    answer: "A developer cheat sheet is a concise reference guide that provides quick access to essential commands, code snippets, and best practices for various programming languages and tools."
  },
  {
    question: "How can I use these cheat sheets effectively?",
    answer: "You can use these cheat sheets by searching for specific commands, filtering by categories, and copying commands directly to your clipboard for quick use in your development environment."
  },
  {
    question: "Are these cheat sheets suitable for beginners?",
    answer: "Yes, these cheat sheets are designed to be user-friendly and provide valuable information for both beginners and experienced developers."
  },
  {
    question: "Can I contribute to the cheat sheets?",
    answer: "Currently, contributions are not accepted directly through the website. However, you can reach out to us via our contact page for suggestions or improvements."
  }
];