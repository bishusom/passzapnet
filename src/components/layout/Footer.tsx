import { Sparkles, Github, Twitter, Mail } from 'lucide-react'
import { getFeaturedTools } from '@/config/tools-config'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const featuredTools = getFeaturedTools().slice(0, 4)
  
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl shadow-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">PassZap</h3>
                <p className="text-emerald-600 font-medium">Free Online Utilities</p>
              </div>
            </div>
            <p className="text-gray-600 max-w-md">
              Your trusted source for free, secure, and easy-to-use online tools. 
              No registration required, no data collection - just pure utility.
            </p>
          </div>

          {/* Tools */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Tools</h4>
            <ul className="space-y-2 text-gray-600">
              {featuredTools.map((tool) => (
              <li key={tool.id}>
                <a href={tool.href} className="hover:text-emerald-600 transition-colors">
                  {tool.name}
                </a>
              </li>
            ))}
            </ul>  
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Support</h4>
            <ul className="space-y-2 text-gray-600">
               <li><a href="/contact" className="hover:text-emerald-600 transition-colors">Contact</a></li>
              <li><a href="/privacy-policy" className="hover:text-emerald-600 transition-colors">Privacy Policy</a></li>
              <li><a href="/terms-of-service" className="hover:text-emerald-600 transition-colors">Terms of Service</a></li>
              <li><a href="/faq" className="hover:text-emerald-600 transition-colors">FAQ</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            © {currentYear} PassZap. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="https://github.com/bishusom" className="text-gray-400 hover:text-emerald-600 transition-colors">
              <Github className="h-5 w-5" />
            </a>
            <a href="https://x.com/bishusom" className="text-gray-400 hover:text-emerald-600 transition-colors">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="/contact" className="text-gray-400 hover:text-emerald-600 transition-colors">
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}