// components/ui/ToolCard.tsx
import { LucideIcon } from 'lucide-react'

interface ToolCardProps {
  name: string
  description: string
  href: string
  icon: LucideIcon
  category: string
}

export default function ToolCard({ name, description, href, icon: Icon }: ToolCardProps) {
  return (
    <a
      href={href}
      className="group bg-white rounded-xl p-6 shadow-lg border border-emerald-100 hover:border-emerald-300 transition-all hover:shadow-xl"
    >
      <div className="text-center">
        {/* Green icon with white text */}
        <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg mb-4 group-hover:scale-110 transition-transform">
          <Icon className="h-6 w-6 text-white" />
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
          {name}
        </h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {description}
        </p>
        <div className="flex items-center justify-center text-emerald-600 text-sm font-medium">
          <span>Use Tool</span>
          <svg 
            className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </a>
  )
}