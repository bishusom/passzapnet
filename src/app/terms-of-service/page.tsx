// app/terms-of-service/page.tsx
import type { Metadata } from 'next';
import { FileText, Scale, AlertTriangle, CheckCircle, Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service - PassZap Tools',
  description: 'Terms and conditions for using PassZap online tools. Learn about acceptable use, limitations, and user responsibilities.',
  keywords: 'terms of service, terms and conditions, user agreement',
  alternates: {
    canonical: 'https://passzap.net/terms-of-service',
  },
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      
      <main className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-emerald-100 p-4 rounded-full">
                <Scale className="h-8 w-8 text-emerald-600" />
              </div>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Last updated: {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="prose prose-lg max-w-none">
              {/* Acceptance */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                <p className="text-gray-700 mb-4">
                  By accessing and using PassZap ("the Service"), you accept and agree to be bound by 
                  the terms and provision of this agreement. If you do not agree to these terms, please 
                  do not use our services.
                </p>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                  <p className="text-blue-800">
                    By using our tools, you acknowledge that you have read, understood, and agree to be 
                    bound by these Terms of Service.
                  </p>
                </div>
              </section>

              {/* Description */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Service Description</h2>
                <p className="text-gray-700 mb-4">
                  PassZap provides online utilities and tools including but not limited to:
                </p>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Development Tools</h3>
                    <ul className="text-gray-700 space-y-1 text-sm">
                      <li>• QR Code Generator</li>
                      <li>• CSS Minifier & Formatter</li>
                      <li>• JavaScript Minifier</li>
                      <li>• JSON Formatter</li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Utility Tools</h3>
                    <ul className="text-gray-700 space-y-1 text-sm">
                      <li>• File Hash Generator</li>
                      <li>• Text Utilities</li>
                      <li>• Code Formatters</li>
                    </ul>
                  </div>
                </div>
                <p className="text-gray-700">
                  All tools are provided "as is" for convenience and educational purposes.
                </p>
              </section>

              {/* User Responsibilities */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Responsibilities</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Acceptable Use</h3>
                      <p className="text-gray-700">Use tools for legitimate, legal purposes</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Compliance</h3>
                      <p className="text-gray-700">Adhere to all applicable laws and regulations</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Security</h3>
                      <p className="text-gray-700">Maintain the security of your own systems</p>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-yellow-800 mb-1">Prohibited Activities</h4>
                      <ul className="text-yellow-700 text-sm space-y-1">
                        <li>• Attempting to disrupt or overload the service</li>
                        <li>• Using tools for illegal or malicious purposes</li>
                        <li>• Automated scraping or data collection</li>
                        <li>• Reverse engineering or hacking attempts</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              {/* Intellectual Property */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Intellectual Property</h2>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Our Rights</h3>
                    <p className="text-gray-700 text-sm">
                      PassZap and its original content, features, and functionality are owned by PassZap 
                      and are protected by international copyright, trademark, and other intellectual 
                      property laws.
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Your Content</h3>
                    <p className="text-gray-700 text-sm">
                      You retain all rights to the content you process through our tools. We do not claim 
                      ownership over any files, code, or data you upload or process.
                    </p>
                  </div>
                </div>
              </section>

              {/* Disclaimer */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Disclaimer of Warranties</h2>
                <p className="text-gray-700 mb-4">
                  The Service is provided on an "AS IS" and "AS AVAILABLE" basis. PassZap makes no 
                  representations or warranties of any kind, express or implied, including but not limited to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Accuracy, reliability, or completeness of results</li>
                  <li>Uninterrupted or error-free service</li>
                  <li>Suitability for any particular purpose</li>
                  <li>Security of processed data (though we implement best practices)</li>
                </ul>
              </section>

              {/* Limitation of Liability */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Limitation of Liability</h2>
                <p className="text-gray-700 mb-4">
                  To the fullest extent permitted by law, PassZap shall not be liable for any indirect, 
                  incidental, special, consequential, or punitive damages, including without limitation:
                </p>
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                  <ul className="text-red-700 space-y-2">
                    <li>• Loss of profits, data, or use</li>
                    <li>• Business interruption</li>
                    <li>• Personal injury or property damage</li>
                    <li>• Third-party claims</li>
                  </ul>
                </div>
                <p className="text-gray-700">
                  This limitation applies regardless of the legal theory of the claim.
                </p>
              </section>

              {/* Data Processing */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Data Processing</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Local Processing</h3>
                      <p className="text-gray-700">
                        Most tools process data locally in your browser. Your sensitive data never leaves 
                        your device unless you explicitly choose to share it.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Privacy</h3>
                      <p className="text-gray-700">
                        We respect your privacy. Please refer to our Privacy Policy for detailed information 
                        about data collection and usage.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Termination */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Termination</h2>
                <p className="text-gray-700 mb-4">
                  We may terminate or suspend access to our Service immediately, without prior notice 
                  or liability, for any reason whatsoever, including without limitation if you breach 
                  the Terms.
                </p>
                <p className="text-gray-700">
                  All provisions of the Terms which by their nature should survive termination shall 
                  survive termination, including ownership provisions, warranty disclaimers, and 
                  limitations of liability.
                </p>
              </section>

              {/* Changes */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Changes to Terms</h2>
                <p className="text-gray-700 mb-4">
                  We reserve the right, at our sole discretion, to modify or replace these Terms at 
                  any time. We will provide notice of significant changes by:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Posting the new terms on this page</li>
                  <li>Updating the "Last updated" date</li>
                  <li>Where appropriate, email notification</li>
                </ul>
              </section>

              {/* Governing Law */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Governing Law</h2>
                <p className="text-gray-700">
                  These Terms shall be governed and construed in accordance with the laws of the 
                  jurisdiction where PassZap is established, without regard to its conflict of law provisions.
                </p>
              </section>

              {/* Contact */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Contact Information</h2>
                <p className="text-gray-700">
                  If you have any questions about these Terms, please contact us at:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg mt-4">
                  <p className="text-gray-700">
                    Email: legal@passzap.net<br />
                    We aim to respond to all inquiries within 48 hours.
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
}