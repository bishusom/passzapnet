'use client';

import { cheatSheets } from '@/lib/cheatsheets';
import { Code, Shield, Zap, RotateCcw, CheckCircle } from 'lucide-react';
import CheatSheetDisplay from '@/components/cheatsheets/CheatSheetDisplay';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function bashCheatSheet() {
  const sheet = cheatSheets.find(sheet => sheet.slug === 'python');
  
  if (!sheet) {
    return <div>Cheat sheet not found</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <Header />
      
      <main className="py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Main Content - 2/3 width */}
            <div className="lg:col-span-2">
              <CheatSheetDisplay cheatSheet={sheet} />
            </div>

            {/* Sidebar - 1/3 width */}
            <div className="space-y-6">
              {/* Features */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-emerald-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Code className="h-5 w-5 text-emerald-500 mr-2" />
                  Key Features
                </h3>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-start space-x-2">
                    <Zap className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Comprehensive Commands:</strong> A wide range of python one-liners for various text processing tasks</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Shield className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Instant Copy:</strong> Copy commands with a single click for quick use in your terminal</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Search & Filter:</strong> Easily find specific commands using search and category filters</span>
                  </li>
                </ul>
              </div>

              {/* Tips */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-emerald-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <RotateCcw className="h-5 w-5 text-emerald-500 mr-2" />
                  Pro Tips
                </h3>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-start space-x-2">
                    <Zap className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Combine Commands:</strong> Use python commands together in scripts for powerful text processing</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Shield className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Test Before Use:</strong> Always test commands on sample data first</span>
                  </li>
                </ul>
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

          {/* SEO Content */}
          <div className="mt-16 max-w-4xl mx-auto prose prose-emerald">
            <h2>About Python One-Liners</h2>
            <p>Python is a versatile and powerful programming language widely used for various applications, from web development to data analysis. Python one-liners are concise commands that can be executed directly in the Python interpreter or scripts to perform specific tasks efficiently.</p>
            <h3>Common Use Cases</h3>
            <ul>
              <li><strong>File Management:</strong> Quickly manipulate files and directories, such as copying, moving, and deleting files.</li>
              <li><strong>Data Processing:</strong> Parse and analyze data from various sources, including CSV, JSON, and XML files.</li>
              <li><strong>Web Scraping:</strong> Extract information from websites using libraries like BeautifulSoup and Requests.</li>
              <li><strong>Automation:</strong> Automate repetitive tasks to save time and reduce errors.</li>
            </ul>
            <h3>Why Use Python ?</h3>
            <p>Python one-liners are invaluable for developers, data scientists, and IT professionals who want to streamline their workflows and enhance productivity. By mastering these commands, users can perform tasks more efficiently and effectively.</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

const faqItems = [
  {
    question: "What is Python?",
    answer: "Python is a high-level, interpreted programming language known for its readability and versatility. It is widely used in web development, data analysis, artificial intelligence, scientific computing, and more."
  },
  {
    question: "How do I run Python one-liners?",
    answer: "You can run Python one-liners directly in the Python interactive shell (REPL) or by using the -c option in the command line. For example: python -c 'print(\"Hello, World!\")'"
  },
  {
    question: "Where can I find more Python one-liners?",
    answer: "You can find more Python one-liners in online repositories, coding forums, and cheat sheet websites dedicated to Python programming."
  },
  {
    question: "Are Python one-liners suitable for production code?",
    answer: "While Python one-liners can be useful for quick tasks and prototyping, it's generally recommended to write more structured and readable code for production applications to ensure maintainability and clarity."
  },
];