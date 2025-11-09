import { LucideIcon } from 'lucide-react'
import Link from 'next/link'

interface ToolCardProps {
  name: string
  description: string
  href: string
  icon: LucideIcon
  bgColor: string
  color: string
}

export default function ToolCard({ name, description, href, icon: Icon, bgColor, color }: ToolCardProps) {
  return (
    <Link href={href}>
      <div className="group relative bg-white rounded-xl p-6 border border-gray-200 hover:border-emerald-300 transition-all duration-300 hover:transform hover:scale-105 cursor-pointer shadow-sm hover:shadow-lg h-full">
        <div className={`inline-flex p-3 rounded-xl ${bgColor} shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-emerald-700 transition-colors">
          {name}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed">
          {description}
        </p>
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
    </Link>
  )
}