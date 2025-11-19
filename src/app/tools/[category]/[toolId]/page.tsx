// app/tools/[category]/[toolId]/page.tsx
import { getAllTools, getToolById } from '@/config/tools-config';
import ToolClientWrapper from './ToolClientWrapper';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  const tools = getAllTools();
  
  // Return all possible category/toolId combinations
  return tools.map((tool) => ({
    category: tool.category,
    toolId: tool.id,
  }));
}

export default async function ToolPage({ 
  params 
}: { 
  params: Promise<{ category: string; toolId: string }> 
}) {
  const { category, toolId } = await params;
  const toolConfig = getToolById(toolId);

  // Additional validation to ensure the tool belongs to the category
  if (!toolConfig || toolConfig.category !== category) {
    notFound();
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <ToolClientWrapper toolId={toolId} category={category} />
    </div>
  );
}