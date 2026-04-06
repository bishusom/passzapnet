// app/faq/page.tsx
import type { Metadata } from 'next';
import { HelpCircle, Search, FileText, Code, Shield, Download } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions - PassZap Tools',
  description: 'Find answers to common questions about PassZap tools, features, security, and usage. For further questions contact us via our contact page',
  keywords: 'FAQ, frequently asked questions, help, support, PassZap tools',
  openGraph: {
    title: 'Frequently Asked Questions - PassZap Tools',
    description: 'Find answers to common questions about PassZap tools, features, security, and usage.',
    url: 'https://passzap.net/faq',
    siteName: 'PassZap',
    images: [
      {
        url: 'https://passzap.net/og-image.png',
        width: 1200,
        height: 630,
        alt: 'PassZap FAQ',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Frequently Asked Questions - PassZap Tools',
    description: 'Find answers to common questions about PassZap tools, features, security, and usage.',
    images: ['https://passzap.net/og-image.png'],
  },
  alternates: {
    canonical: 'https://passzap.net/faq',
  },
};

export default function FAQPage() {
  const faqCategories = [
    {
      title: 'General Questions',
      icon: HelpCircle,
      questions: [
        {
          question: 'What is PassZap?',
          answer: 'PassZap is a collection of free online tools for developers and content creators, including QR code generators, code formatters, file utilities, and more. All tools are designed to work entirely in your browser for maximum privacy.'
        },
        {
          question: 'Is PassZap free to use?',
          answer: 'Yes! All our tools are completely free to use. There are no hidden fees, subscriptions, or usage limits. We believe in providing valuable tools to the community without barriers.'
        },
        {
          question: 'Do I need to create an account?',
          answer: 'No account required! You can use all our tools immediately without any registration. We value your privacy and want to make our tools as accessible as possible.'
        },
        {
          question: 'What browsers are supported?',
          answer: 'PassZap works on all modern browsers including Chrome, Firefox, Safari, Edge, and Opera. We recommend using the latest browser versions for the best experience and security.'
        }
      ]
    },
    {
      title: 'Security & Privacy',
      icon: Shield,
      questions: [
        {
          question: 'Is my data safe?',
          answer: 'Yes! Most tools process your data entirely in your browser. Your files, code, and sensitive information never leave your device unless you explicitly choose to download or share them.'
        },
        {
          question: 'Do you store my files or data?',
          answer: 'No. We do not store any files, code, or data that you process through our tools. Everything happens locally in your browser. We only collect basic analytics to improve our services.'
        },
        {
          question: 'What about GDPR compliance?',
          answer: 'We are committed to GDPR compliance and user privacy. We minimize data collection, provide transparency about our practices, and offer easy ways for users to control their information.'
        },
        {
          question: 'Are the tools secure for sensitive data?',
          answer: 'While we implement security best practices, we recommend avoiding processing highly sensitive data through any online tool. For maximum security, consider using offline alternatives for critical information.'
        }
      ]
    },
    {
      title: 'Tools & Features',
      icon: Code,
      questions: [
        {
          question: 'What tools are available?',
          answer: 'We offer QR code generation, CSS/JavaScript minification and formatting, JSON formatting, file hash generation, and various other developer utilities. New tools are added regularly based on user feedback.'
        },
        {
          question: 'Can I upload files to the tools?',
          answer: 'Yes! Most tools support file uploads in addition to copy-paste functionality. We support common file formats for each tool type, with clear size limits and format requirements.'
        },
        {
          question: 'Are there file size limits?',
          answer: 'While there are no strict limits, very large files may take longer to process or could cause browser performance issues. We recommend files under 10MB for optimal performance.'
        },
        {
          question: 'Can I use these tools commercially?',
          answer: 'Yes, you can use our tools for both personal and commercial projects. However, please review our Terms of Service for specific usage guidelines and restrictions.'
        }
      ]
    },
    {
      title: 'Technical Support',
      icon: FileText,
      questions: [
        {
          question: 'How do I report a bug or issue?',
          answer: 'Please use our contact form to report any issues. Include details about the problem, your browser and operating system, and steps to reproduce the issue for faster resolution.'
        },
        {
          question: 'Can I request a new tool?',
          answer: 'Absolutely! We welcome tool suggestions and feature requests. Use our contact form to share your ideas, and we\'ll consider them for future development.'
        },
        {
          question: 'Why is a tool not working?',
          answer: 'If a tool isn\'t working, try refreshing the page, clearing your browser cache, or trying a different browser. If the issue persists, please contact us with specific details.'
        },
        {
          question: 'Do you provide API access?',
          answer: 'Currently, we don\'t offer public API access. All tools are available through our web interface. We may consider API access in the future based on user demand.'
        }
      ]
    },
    {
      title: 'Download & Export',
      icon: Download,
      questions: [
        {
          question: 'What download formats are available?',
          answer: 'Download options vary by tool. QR codes can be downloaded as PNG or SVG. Code tools support direct download of processed files. Most outputs can also be copied to clipboard.'
        },
        {
          question: 'Is there a limit on downloads?',
          answer: 'No, you can download as many files as you need. There are no download limits or restrictions on our free tools.'
        },
        {
          question: 'Can I customize download file names?',
          answer: 'File names are automatically generated based on the tool and content, but you can rename files after download. Some tools allow basic customization of output names.'
        },
        {
          question: 'Are downloads secure?',
          answer: 'All downloads are generated and served securely. Since processing happens in your browser, downloads don\'t involve server-side file generation or storage.'
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      
      <main className="py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-purple-100 p-4 rounded-full">
                <HelpCircle className="h-8 w-8 text-purple-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find quick answers to common questions about PassZap tools and services.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-md mx-auto mt-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search FAQs..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* FAQ Categories */}
          <div className="space-y-8">
            {faqCategories.map((category, categoryIndex) => (
              <section key={categoryIndex} className="bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Category Header */}
                <div className="bg-gradient-to-r from-teal-500 to-emerald-500 p-6">
                  <div className="flex items-center gap-3">
                    <category.icon className="h-6 w-6 text-white" />
                    <h2 className="text-2xl font-bold text-white">{category.title}</h2>
                  </div>
                </div>

                {/* Questions */}
                <div className="p-6">
                  <div className="space-y-6">
                    {category.questions.map((faq, faqIndex) => (
                      <div key={faqIndex} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-start gap-3">
                          <HelpCircle className="h-5 w-5 text-purple-500 mt-0.5 flex-shrink-0" />
                          {faq.question}
                        </h3>
                        <p className="text-gray-700 ml-8 leading-relaxed">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            ))}
          </div>

          {/* Still Have Questions */}
          <div className="text-center mt-12">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Still Have Questions?</h2>
              <p className="text-gray-700 mb-6">
                Can't find the answer you're looking for? Please contact our friendly team.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/contact"
                  className="bg-teal-500 text-white px-6 py-3 rounded-lg hover:bg-green-500 transition-colors font-medium"
                >
                  Contact Support
                </a>
                <a
                  href="/#tools"
                  className="border border-green-500 text-green-500 px-6 py-3 rounded-lg hover:bg-green-50 transition-colors font-medium"
                >
                  Browse Tools
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
}
