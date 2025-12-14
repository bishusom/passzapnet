// app/contact/page.tsx
import type { Metadata } from 'next';
import { Mail, MessageCircle, Clock, Send, CheckCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Us - PassZap Tools Support',
  description: 'Get in touch with the PassZap team. We\'re here to help with any questions, feedback, or support needs.',
  keywords: 'contact, support, help, feedback, PassZap contact',
  alternates: {
    canonical: 'https://passzap.net/contact',
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      
      <main className="py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-blue-100 p-4 rounded-full">
                <MessageCircle className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Have questions, feedback, or need support? We'd love to hear from you.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Information */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
                
                <div className="space-y-6">
                  {/* Response Time */}
                  <div className="flex items-start gap-4">
                    <div className="bg-green-100 p-3 rounded-full">
                      <Clock className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Response Time</h3>
                      <p className="text-gray-700 text-sm">Typically within 24-48 hours</p>
                    </div>
                  </div>

                  {/* Support Hours */}
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <Send className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Support Hours</h3>
                      <p className="text-gray-700 text-sm">Monday - Friday, 9AM - 6PM EST</p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-4">
                    <div className="bg-purple-100 p-3 rounded-full">
                      <Mail className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                      <p className="text-gray-700 text-sm">support@passzap.net</p>
                    </div>
                  </div>
                </div>

                {/* Quick Tips */}
                <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">Before Contacting</h4>
                  <ul className="text-blue-700 text-sm space-y-1">
                    <li>• Check our <a href="/faq" className="underline">FAQ page</a></li>
                    <li>• Include relevant tool names</li>
                    <li>• Describe steps to reproduce issues</li>
                    <li>• Mention your browser and OS</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
                
                {/* Netlify Form */}
                <form
                  name="contact"
                  method="POST"
                  data-netlify="true"
                  netlify-honeypot="bot-field"
                  className="space-y-6"
                >
                  {/* Netlify Form Hidden Fields */}
                  <input type="hidden" name="form-name" value="contact" />
                  <p className="hidden">
                    <label>
                      Don't fill this out if you're human: <input name="bot-field" />
                    </label>
                  </p>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        placeholder="Your full name"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    >
                      <option value="">Select a topic</option>
                      <option value="general">General Inquiry</option>
                      <option value="support">Technical Support</option>
                      <option value="bug">Bug Report</option>
                      <option value="feature">Feature Request</option>
                      <option value="partnership">Partnership</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/* Tool Selection */}
                  <div>
                    <label htmlFor="tool" className="block text-sm font-medium text-gray-700 mb-2">
                      Related Tool (if applicable)
                    </label>
                    <select
                      id="tool"
                      name="tool"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    >
                      <option value="">Select a tool</option>
                      <option value="qr-code-generator">QR Code Generator</option>
                      <option value="css-minifier">CSS Minifier & Formatter</option>
                      <option value="javascript-minifier">JavaScript Minifier</option>
                      <option value="json-formatter">JSON Formatter</option>
                      <option value="file-hash-generator">File Hash Generator</option>
                      <option value="multiple">Multiple Tools</option>
                      <option value="general">General/All Tools</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                      placeholder="Please describe your inquiry, issue, or feedback in detail..."
                    ></textarea>
                  </div>

                  {/* File Attachment */}
                  <div>
                    <label htmlFor="attachment" className="block text-sm font-medium text-gray-700 mb-2">
                      Attachment (Optional)
                    </label>
                    <input
                      type="file"
                      id="attachment"
                      name="attachment"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Maximum file size: 10MB. Supported formats: images, text files, code files.
                    </p>
                  </div>

                  {/* Submit Button */}
                  <div className="flex items-center gap-4">
                    <button
                      type="submit"
                      className="flex items-center gap-2 bg-blue-500 text-white px-8 py-4 rounded-lg hover:bg-blue-600 transition-colors font-medium"
                    >
                      <Send className="h-5 w-5" />
                      Send Message
                    </button>
                    <p className="text-sm text-gray-600">
                      We'll get back to you as soon as possible.
                    </p>
                  </div>
                </form>

                {/* Success Message (will be shown after form submission) */}
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg hidden" id="success-message">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <h4 className="font-semibold text-green-800">Message Sent Successfully!</h4>
                      <p className="text-green-700 text-sm">
                        Thank you for contacting us. We'll respond to your message within 24-48 hours.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Support Options */}
              <div className="grid md:grid-cols-2 gap-6 mt-8">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Community Support</h3>
                  <p className="text-gray-700 mb-4">
                    Join our community to get help from other users and share your experiences.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• GitHub Discussions</li>
                    <li>• Community Forums</li>
                    <li>• User Guides & Tutorials</li>
                  </ul>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Documentation</h3>
                  <p className="text-gray-700 mb-4">
                    Check our comprehensive documentation for detailed tool guides and tutorials.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Tool Usage Guides</li>
                    <li>• Best Practices</li>
                    <li>• Troubleshooting Guides</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}