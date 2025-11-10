import type { Metadata } from 'next'
import { Key, Shield, Lock, Users, Zap } from 'lucide-react'
import PasswordGenerator from './../../components/utilities/password/PasswordGenerator'
import Header from './../../components/layout/Header'
import Footer from './../../components/layout/Footer'

export const metadata: Metadata = {
  title: 'Password Generator - Create Strong & Secure Passwords | PassZap',
  description: 'Free online password generator tool. Create strong, secure passwords and memorable passphrases with local processing. No data stored.',
  keywords: 'password generator, secure password, random password, passphrase generator, password strength checker',
  openGraph: {
    title: 'Password Generator - Create Strong & Secure Passwords | PassZap',
    description: 'Free online password generator tool. Create strong, secure passwords and memorable passphrases with local processing. No data stored.',
    url: 'https://passzap.net/password-generator',
    siteName: 'PassZap',
    images: [
      {
        url: '/og/password-generator-og.png',
        width: 1200,
        height: 630,
        alt: 'PassZap Password Generator',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Password Generator - Create Strong & Secure Passwords | PassZap',
    description: 'Free online password generator tool. Create strong, secure passwords and memorable passphrases with local processing. No data stored.',
    images: ['/og/password-generator-og.png'],
  },
  alternates: {
    canonical: 'https://passzap.net/password-generator',
  },
}

export default function PasswordGeneratorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <Header />
      
      <main className="py-8">
        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Generator */}
            <div className="lg:col-span-2">
              <PasswordGenerator compact={false} />
            </div>

            {/* Right Column - Info & Tips */}
            <div className="space-y-6">
              {/* Security Features */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-emerald-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Shield className="h-5 w-5 text-emerald-500 mr-2" />
                  Security Features
                </h3>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-start space-x-2">
                    <Zap className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Local Processing</strong> - Everything happens in your browser</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Lock className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span><strong>No Data Stored</strong> - We never see or store your passwords</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Users className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span><strong>No Registration</strong> - Use immediately without signing up</span>
                  </li>
                </ul>
              </div>

              {/* Password Tips */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-emerald-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Password Best Practices</h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <h4 className="font-semibold text-green-800 mb-1">✅ Do</h4>
                    <ul className="space-y-1 text-green-700">
                      <li>• Use 12+ characters for important accounts</li>
                      <li>• Combine letters, numbers, and symbols</li>
                      <li>• Use unique passwords for each site</li>
                      <li>• Consider a password manager</li>
                    </ul>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <h4 className="font-semibold text-red-800 mb-1">❌ Don't</h4>
                    <ul className="space-y-1 text-red-700">
                      <li>• Use personal information</li>
                      <li>• Reuse passwords across sites</li>
                      <li>• Use common words or patterns</li>
                      <li>• Write passwords in plain text</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Use Case Guide */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-emerald-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Which to Use?</h3>
                <div className="space-y-4 text-sm">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <h4 className="font-semibold text-blue-800 mb-1">🔐 Random Passwords</h4>
                    <p className="text-blue-700">
                      Best for accounts where you don't need to remember the password (use a password manager).
                    </p>
                    <div className="mt-2 text-xs text-blue-600">
                      <strong>Examples:</strong> Banking, Email, Social Media
                    </div>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                    <h4 className="font-semibold text-purple-800 mb-1">📝 Passphrases</h4>
                    <p className="text-purple-700">
                      Best for passwords you need to remember (master passwords, WiFi, encryption).
                    </p>
                    <div className="mt-2 text-xs text-purple-600">
                      <strong>Examples:</strong> Password Manager Master, WiFi, Disk Encryption
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Frequently Asked Questions
            </h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {faqItems.map((faq, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-emerald-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
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
            "mainEntity": faqItems.map(faq => ({
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

const faqItems = [
  {
    question: "Is this password generator really secure?",
    answer: "Yes! All password generation happens locally in your browser using cryptographically secure random number generation. We never send your passwords to our servers or store them anywhere."
  },
  {
    question: "What's the difference between passwords and passphrases?",
    answer: "Passwords are random character strings best for accounts where you use a password manager. Passphrases are memorable word combinations ideal for master passwords or accounts you need to remember."
  },
  {
    question: "How long should my password be?",
    answer: "For most accounts, 12-16 characters is sufficient. For highly sensitive accounts like banking or email, consider 16+ characters. Passphrases should be 4-6 words minimum."
  },
  {
    question: "Why should I use a password manager?",
    answer: "Password managers help you generate, store, and autofill strong unique passwords for every account. This eliminates password reuse and makes managing hundreds of passwords easy."
  },
  {
    question: "Are the generated passwords truly random?",
    answer: "Yes! We use the Web Crypto API's getRandomValues() method, which provides cryptographically secure random numbers suitable for password generation."
  },
  {
    question: "Can I use this on mobile devices?",
    answer: "Absolutely! PassZap is fully responsive and works perfectly on smartphones, tablets, and desktop computers. All features are available on mobile."
  }
]