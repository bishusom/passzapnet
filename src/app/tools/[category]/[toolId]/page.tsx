// app/tools/[category]/[toolId]/page.tsx
import { getAllTools, getToolById, getToolsByCategory } from '@/config/tools-config';
import ToolClientWrapper from './ToolClientWrapper';
import { notFound } from 'next/navigation';
import Link from 'next/link';

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

  const relatedTools = getToolsByCategory(category)
    .filter((tool) => tool.id !== toolId)
    .slice(0, 4);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <div className="container mx-auto px-4 py-8">
        <section className="mx-auto mb-8 max-w-4xl rounded-2xl bg-white/90 p-8 shadow-sm ring-1 ring-emerald-100">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
            {toolConfig.categoryName}
          </p>
          <h1 className="mb-4 text-4xl font-bold text-gray-900">{toolConfig.name}</h1>
          <p className="mb-6 text-lg leading-8 text-gray-700">{toolConfig.seo.description}</p>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl bg-emerald-50 p-4">
              <h2 className="mb-2 text-lg font-semibold text-gray-900">What It Does</h2>
              <p className="text-sm leading-6 text-gray-700">{toolConfig.description}</p>
            </div>
            <div className="rounded-xl bg-emerald-50 p-4">
              <h2 className="mb-2 text-lg font-semibold text-gray-900">Privacy</h2>
              <p className="text-sm leading-6 text-gray-700">
                PassZap tools are designed to run in the browser so your content stays on your device whenever possible.
              </p>
            </div>
            <div className="rounded-xl bg-emerald-50 p-4">
              <h2 className="mb-2 text-lg font-semibold text-gray-900">Best For</h2>
              <p className="text-sm leading-6 text-gray-700">
                Quick one-off tasks, lightweight developer workflows, and everyday utility work without installation.
              </p>
            </div>
          </div>
        </section>

        <ToolClientWrapper toolId={toolId} category={category} />

        {relatedTools.length > 0 && (
          <section className="mx-auto mt-8 max-w-4xl rounded-2xl bg-white p-8 shadow-sm ring-1 ring-emerald-100">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">Related {toolConfig.categoryName}</h2>
            <p className="mb-6 text-gray-600">
              Explore other tools in this category to handle adjacent tasks without leaving the workflow.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              {relatedTools.map((relatedTool) => (
                <Link
                  key={relatedTool.id}
                  href={relatedTool.href}
                  className="rounded-xl border border-emerald-100 p-4 transition-colors hover:border-emerald-300 hover:bg-emerald-50"
                >
                  <h3 className="font-semibold text-gray-900">{relatedTool.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-gray-600">{relatedTool.description}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
