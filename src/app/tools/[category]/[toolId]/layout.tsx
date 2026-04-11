// app/tools/[category]/[toolId]/layout.tsx
import { getAllTools, getToolById } from '@/config/tools-config';
import type { Metadata } from 'next';

export function generateStaticParams() {
  const tools = getAllTools();
  
  return tools.map((tool) => ({
    category: tool.category,
    toolId: tool.id,
  }));
}

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ category: string; toolId: string }> 
}): Promise<Metadata> {
  const { category, toolId } = await params;
  const toolConfig = getToolById(toolId);

  if (!toolConfig || toolConfig.category !== category) {
    return {
      title: 'Tool Not Found',
    };
  }

  return {
    title: toolConfig.seo.title,
    description: toolConfig.seo.description,
    keywords: toolConfig.seo.keywords,
    alternates: {
      canonical: toolConfig.seo.canonical,
    },
    openGraph: {
      title: toolConfig.seo.title,
      description: toolConfig.seo.description,
      url: toolConfig.seo.canonical,
      siteName: 'FreeDevTools Studio',
      locale: 'en_US',
      type: 'website',
      images: [
        {
          url: `https://freedevtools.studio${toolConfig.seo.ogImage}`,
          width: 1200,
          height: 630,
          alt: `${toolConfig.name} preview image`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: toolConfig.seo.title,
      description: toolConfig.seo.description,
      images: [`https://freedevtools.studio${toolConfig.seo.ogImage}`],
    },
  };
}

export default function ToolLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
}
