// app/privacy-policy/page.tsx
import type { Metadata } from 'next';
import { Shield, Lock, Eye, User, Mail, Database } from 'lucide-react';

const LAST_UPDATED = 'April 6, 2026';

export const metadata: Metadata = {
  title: 'Privacy Policy - FreeDevTools Studio',
  description: 'Learn how FreeDevTools Studio protects your privacy and handles your data. We are committed to transparency and data security.',
  keywords: 'privacy policy, data protection, GDPR, privacy, security',
  alternates: {
    canonical: 'https://freedevtools.studio/privacy-policy',
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      
      <main className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-blue-100 p-4 rounded-full">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Last updated: {LAST_UPDATED}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="prose prose-lg max-w-none">
              {/* Introduction */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
                <p className="text-gray-700 mb-4">
                  Welcome to FreeDevTools Studio. We are committed to protecting your privacy and ensuring transparency 
                  about how we handle your data. This Privacy Policy explains how we collect, use, and protect 
                  your information when you use our online tools and services.
                </p>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
                  <p className="text-blue-800 font-medium">
                    🔒 All our tools process data locally in your browser. Your data never leaves your device unless you explicitly choose to share it.
                  </p>
                </div>
              </section>

              {/* Data Collection */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>
                
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <Eye className="h-5 w-5 text-blue-600" />
                      <h3 className="font-semibold text-gray-900">Automatically Collected</h3>
                    </div>
                    <ul className="text-gray-700 space-y-2 text-sm">
                      <li>• Browser type and version</li>
                      <li>• IP address (anonymized)</li>
                      <li>• Pages visited and time spent</li>
                      <li>• Referring website</li>
                    </ul>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <User className="h-5 w-5 text-green-600" />
                      <h3 className="font-semibold text-gray-900">Optional Information</h3>
                    </div>
                    <ul className="text-gray-700 space-y-2 text-sm">
                      <li>• Contact form submissions</li>
                      <li>• Newsletter signups</li>
                      <li>• Feedback and support requests</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
                  <div className="flex items-start gap-3">
                    <Lock className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-yellow-800 mb-1">Important Note</h4>
                      <p className="text-yellow-700 text-sm">
                        Your files, code, and data processed through our tools (QR codes, CSS/JS minification, 
                        file hashing, etc.) are processed entirely in your browser and never transmitted to our servers.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* How We Use Data */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 p-2 rounded-full mt-1">
                      <Mail className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Service Improvement</h3>
                      <p className="text-gray-700">Analyze usage patterns to enhance tool performance and user experience</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-green-100 p-2 rounded-full mt-1">
                      <User className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Communication</h3>
                      <p className="text-gray-700">Respond to your inquiries and provide customer support</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-purple-100 p-2 rounded-full mt-1">
                      <Database className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Analytics</h3>
                      <p className="text-gray-700">Understand how our tools are used to guide future development</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Data Sharing */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Sharing and Disclosure</h2>
                <p className="text-gray-700 mb-4">
                  We do not sell, trade, or rent your personal information to third parties. We may share 
                  information only in the following circumstances:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>With service providers who assist in website operations (analytics, hosting)</li>
                  <li>When required by law or to protect our rights</li>
                  <li>In connection with a business transfer or merger</li>
                </ul>
              </section>

              {/* Cookies */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Cookies and Tracking</h2>
                <p className="text-gray-700 mb-4">
                  We use cookies and similar technologies to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Remember your preferences and settings</li>
                  <li>Analyze website traffic and usage patterns</li>
                  <li>Provide social media features</li>
                </ul>
                <div className="bg-gray-50 p-4 rounded-lg mt-4">
                  <p className="text-gray-700 text-sm">
                    You can control cookies through your browser settings. However, disabling cookies may 
                    affect some website functionalities.
                  </p>
                </div>
              </section>

              {/* Data Security */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Data Security</h2>
                <p className="text-gray-700 mb-4">
                  We implement appropriate security measures to protect your information:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>SSL encryption for all data transmission</li>
                  <li>Regular security assessments and updates</li>
                  <li>Limited access to personal information</li>
                  <li>Secure server infrastructure</li>
                </ul>
              </section>

              {/* Your Rights */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Your Rights</h2>
                <p className="text-gray-700 mb-4">
                  Depending on your location, you may have the following rights regarding your personal data:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-green-800 mb-2">Access and Control</h3>
                    <ul className="text-green-700 space-y-1 text-sm">
                      <li>• Access your personal data</li>
                      <li>• Correct inaccurate data</li>
                      <li>• Request data deletion</li>
                    </ul>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-800 mb-2">Preferences</h3>
                    <ul className="text-blue-700 space-y-1 text-sm">
                      <li>• Opt-out of marketing</li>
                      <li>• Manage cookie preferences</li>
                      <li>• Export your data</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Contact */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Contact Us</h2>
                <p className="text-gray-700 mb-4">
                  If you have any questions about this Privacy Policy or your data, please contact us:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700">
                    Email: privacy@freedevtools.studio<br />
                    Response time: Within 48 hours
                  </p>
                </div>
              </section>

              {/* Changes */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Changes to This Policy</h2>
                <p className="text-gray-700">
                  We may update this Privacy Policy from time to time. We will notify you of any changes 
                  by posting the new policy on this page and updating the "Last updated" date.
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
