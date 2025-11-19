// app/tools/[category]/[toolId]/layout.tsx
import { getAllTools, getToolById } from '@/config/tools-config';
import { notFound } from 'next/navigation';
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
    title: `${toolConfig.name} - Free Online Tool | PassZap`,
    description: toolConfig.description,
    keywords: `${toolConfig.name}, ${toolConfig.category} tools, online utility`,
  };
}

export default function ToolLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
}