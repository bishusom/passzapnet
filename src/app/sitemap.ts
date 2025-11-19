// app/sitemap.ts
import { MetadataRoute } from 'next'
import { getAllCategories, getAllTools } from '@/config/tools-config'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://passzap.net'
  const allCategories = getAllCategories()
  const allTools = getAllTools()
  
  // Main pages
  const mainPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms-of-service`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    },
  ]

  // Category pages
  const categoryPages = allCategories.map(category => ({
    url: `${baseUrl}/tools/${category.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority:0.9,
  }))
    

  // Tool pages - dynamically generated from tools-config
  const toolPages = allTools.map(tool => ({
    url: `${baseUrl}${tool.href}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: tool.featured ? 0.9 : 0.8,
  }))


  return [
    ...mainPages,
    ...categoryPages,
    ...toolPages
  ]
}

// Add this for static export compatibility
export const dynamic = 'force-static'