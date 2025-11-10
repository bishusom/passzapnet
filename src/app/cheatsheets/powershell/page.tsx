'use client';

import { cheatSheets } from '@/lib/cheatsheets';
import { Code, Shield, Zap, RotateCcw, CheckCircle } from 'lucide-react';
import CheatSheetDisplay from '@/components/cheatsheets/CheatSheetDisplay';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function powershellCheatSheet() {
  const sheet = cheatSheets.find(sheet => sheet.slug === 'powershell');
  
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
                    <span><strong>Comprehensive Commands:</strong> A wide range of powershell one-liners for various text processing tasks</span>
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
                    <span><strong>Combine Commands:</strong> Use powershell pipelines to chain commands for complex tasks</span>
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
            <h2>About Powershell One-Liners</h2>
            <p>PowerShell is a powerful scripting language and command-line shell designed for system administration and automation on Windows operating systems. It enables users to perform complex tasks efficiently through concise one-liner commands.</p>
            <h3>Common Use Cases</h3>
            <ul>
              <li><strong>File Management:</strong> Quickly manipulate files and directories, such as copying, moving, and deleting files.</li>
              <li><strong>System Administration:</strong> Manage system settings, services, and processes with ease.</li>
              <li><strong>Data Processing:</strong> Parse and analyze data from various sources, including CSV, JSON, and XML files.</li>
              <li><strong>Automation:</strong> Automate repetitive tasks to save time and reduce errors.</li>
            </ul>
            <h3>Why Use Powershell ?</h3>
            <p>PowerShell one-liners are invaluable for IT professionals, system administrators, and developers who want to streamline their workflows and enhance productivity. By mastering these commands, users can perform tasks more efficiently and effectively.</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

const faqItems = [
  {
    question: "What is PowerShell?",
    answer: "PowerShell is a task automation and configuration management framework from Microsoft, consisting of a command-line shell and associated scripting language."
  },
  {
    question: "How do I run a PowerShell one-liner?",
    answer: "You can run a PowerShell one-liner by opening the PowerShell terminal and typing or pasting the command directly into the prompt, then pressing Enter."
  },
  {
    question: "Are PowerShell one-liners safe to use?",
    answer: "Yes, but always review and understand the commands before executing them, especially if they involve system changes or data manipulation."
  },
  {
    question: "Can I use PowerShell one-liners on non-Windows systems?",
    answer: "Yes, with PowerShell Core (now known as PowerShell 7), you can run PowerShell on macOS and Linux as well."
  }
];