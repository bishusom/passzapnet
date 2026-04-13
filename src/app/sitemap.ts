// app/sitemap.ts
import { MetadataRoute } from 'next'
import { getAllCategories, getAllTools } from '@/config/tools-config'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://freedevtools.studio'
  const lastModified = new Date()
  const allCategories = getAllCategories()
  const allTools = getAllTools()
  
  // Main pages
  const mainPages = [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/tools`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.95,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified,
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified,
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified,
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms-of-service`,
      lastModified,
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    },
  ]

  // Category pages
  const categoryPages = allCategories.map(category => ({
    url: `${baseUrl}/tools/${category.id}`,
    lastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }))
    

  // Tool pages come from each tool's canonical URL so the sitemap only lists final URLs.
  const toolPages = allTools.map(tool => ({
    url: tool.seo.canonical,
    lastModified,
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
