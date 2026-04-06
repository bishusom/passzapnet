// app/tools/[category]/[toolId]/ToolClientWrapper.tsx
'use client'

import { useToolComponent } from '@/hooks/use-tool-loader';
import { getToolById } from '@/config/tools-config';

interface ToolClientWrapperProps {
  toolId: string;
  category?: string;
}

export default function ToolClientWrapper({ toolId, category }: ToolClientWrapperProps) {
  const toolConfig = getToolById(toolId);
  const { Component, loading, error } = useToolComponent(toolId, category);

  if (!toolConfig) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Tool Not Found</h1>
          <p className="text-gray-600">The tool "{toolId}" does not exist.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading {toolConfig.name}...</p>
        </div>
      </div>
    );
  }

  if (error || !Component) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Error Loading Tool</h1>
          <p className="text-gray-600">{error || `Failed to load ${toolConfig.name}`}</p>
        </div>
      </div>
    );
  }

  return (
    <section aria-label={`${toolConfig.name} tool`} className="mx-auto max-w-4xl">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <Component />
      </div>
    </section>
  );
}
