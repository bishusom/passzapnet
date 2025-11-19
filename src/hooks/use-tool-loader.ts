// src/hooks/use-tool-loader.ts
'use client'

import { useState, useEffect } from 'react';

export const useToolComponent = (toolId: string, category?: string) => {
  const [Component, setComponent] = useState<React.ComponentType<any> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTool = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Try multiple possible locations
        let module;
        
        try {
          // First try: category-specific folder
          if (category) {
            module = await import(`@/components/tools/${category}/${toolId}/${toolId}-tool.tsx`);
          }
        } catch (categoryError) {
          console.log(`Category-specific path not found, trying generic...`);
        }
        
        // If category-specific not found or no category, try generic tools folder
        if (!module) {
          module = await import(`@/components/tools/${toolId}/${toolId}-tool.tsx`);
        }
        
        setComponent(() => module.default);
      } catch (err) {
        console.error(`Failed to load tool component: ${toolId}`, err);
        setError(`Tool "${toolId}" not found or failed to load`);
      } finally {
        setLoading(false);
      }
    };

    loadTool();
  }, [toolId, category]);

  return { Component, loading, error };
};