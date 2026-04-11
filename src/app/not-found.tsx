// app/not-found.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, Search, ArrowRight, FileQuestion, Zap } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Page Not Found - 404 Error | FreeDevTools Studio',
  description: 'The page you are looking for does not exist. Return to the FreeDevTools Studio home page or explore our tools.',
};

export default function NotFound() {
  const popularTools = [
    { name: 'QR Code Generator', href: '/qr-code-generator', description: 'Create custom QR codes' },
    { name: 'CSS Formatter', href: '/css-minifier', description: 'Minify and format CSS' },
    { name: 'JSON Formatter', href: '/json-formatter', description: 'Validate and format JSON' },
    { name: 'JavaScript Minifier', href: '/javascript-minifier', description: 'Minify JS code' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      
      <main className="flex-grow py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Error Content */}
          <div className="text-center mb-16">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-32 h-32 bg-red-100 rounded-full mb-6">
                <FileQuestion className="h-16 w-16 text-red-500" />
              </div>
              <div className="inline-block bg-red-500 text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
                404 Error
              </div>
              <h1 className="text-6xl font-bold text-gray-900 mb-4">Page Not Found</h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                Oops! The page you're looking for seems to have wandered off into the digital void. 
                Don't worry, let's get you back on track.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 bg-green-500 text-white px-8 py-4 rounded-lg hover:bg-green-600 transition-colors font-medium"
              >
                <Home className="h-5 w-5" />
                Back to Homepage
              </Link>
              <Link
                href="/#tools"
                className="inline-flex items-center justify-center gap-2 border border-green-500 text-green-500 px-8 py-4 rounded-lg hover:bg-emrald-50 transition-colors font-medium"
              >
                <Search className="h-5 w-5" />
                Browse All Tools
              </Link>
            </div>
          </div>

          {/* Popular Tools Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
                <Zap className="h-4 w-4" />
                Popular Tools
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                While You're Here, Check Out Our Tools
              </h2>
              <p className="text-gray-600 text-lg">
                Discover our most popular utilities that developers love
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {popularTools.map((tool, index) => (
                <Link
                  key={index}
                  href={tool.href}
                  className="group p-6 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {tool.name}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {tool.description}
                      </p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                  </div>
                  <div className="flex items-center gap-2 text-sm text-blue-600 font-medium">
                    <span>Try it now</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Help Section */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-green-500 to-green-800 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Need Help Finding Something?</h3>
              <p className="text-white-100 mb-6 max-w-2xl mx-auto">
                Can't find what you're looking for? Our support team is here to help you navigate 
                and find the right tools for your needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/faq"
                  className="inline-flex items-center justify-center gap-2 bg-white text-green-600 px-6 py-3 rounded-lg hover:bg-green-50 transition-colors font-medium"
                >
                  <Search className="h-4 w-4" />
                  Visit FAQ
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 border border-white text-white px-6 py-3 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors font-medium"
                >
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
}
