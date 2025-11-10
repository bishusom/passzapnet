'use client';

import { cheatSheets } from '@/lib/cheatsheets';
import { Code, Shield, Zap, RotateCcw, CheckCircle } from 'lucide-react';
import CheatSheetDisplay from '@/components/cheatsheets/CheatSheetDisplay';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function bashCheatSheet() {
  const sheet = cheatSheets.find(sheet => sheet.slug === 'bash');
  
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
                    <span><strong>Comprehensive Commands:</strong> A wide range of bash one-liners for various text processing tasks</span>
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
                    <span><strong>Combine Commands:</strong> Use bash pipes to chain commands for complex tasks</span>
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
            <h2>About Bash One-Liners</h2>
            <p>Bash one-liners are concise commands that can be executed directly in the terminal to perform various tasks efficiently. They are invaluable for system administrators, developers, and power users who want to automate routine tasks and enhance productivity.</p>
            <h3>Common Use Cases</h3>
            <ul>
              <li><strong>File Management:</strong> Quickly manipulate files and directories.</li>
              <li><strong>Text Processing:</strong> Use tools like grep, sed, and awk for searching and transforming text.</li>
              <li><strong>System Monitoring:</strong> Check system performance and resource usage.</li>
              <li><strong>Networking:</strong> Manage network configurations and monitor traffic.</li>
            </ul>
            <h3>Why Use Bash?</h3>
            <p>Bash is a powerful and versatile shell that is widely used across various Unix-like operating systems. Its scripting capabilities allow users to automate complex workflows, making it an essential tool for anyone working in a command-line environment.</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

const faqItems = [
  {
    question: "What is a bash one-liner?",
    answer: "A bash one-liner is a concise command or script that can be executed in a single line in the bash shell to perform a specific task."
  },
  {
    question: "How do I copy a command from the cheat sheet?",
    answer: "Simply click the copy button next to the command you want to copy, and it will be copied to your clipboard for easy pasting into your terminal."
  },
  {
    question: "Can I filter commands by category?",
    answer: "Yes, you can use the category buttons at the top of the cheat sheet to filter commands based on their categories."
  },
  {
    question: "Are these commands safe to use?",
    answer: "While the commands provided are generally safe, it's always recommended to review and understand them before executing, especially on production systems."
  }
];