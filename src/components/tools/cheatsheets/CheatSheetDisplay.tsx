// components/cheatsheets/CheatSheetDisplay.tsx
'use client';

import { Copy, Search } from 'lucide-react';
import type { CheatSheet } from '@/lib/cheatsheets';
import { useState, useMemo } from 'react';

interface CheatSheetDisplayProps {
  cheatSheet: CheatSheet;
}

export default function CheatSheetDisplay({ cheatSheet }: CheatSheetDisplayProps) {
  const IconComponent = cheatSheet.icon;
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Get unique categories from items
  const categories = useMemo(() => {
    const cats = cheatSheet.items.map(item => item.category || 'general').filter(Boolean);
    return ['all', ...Array.from(new Set(cats))];
  }, [cheatSheet.items]);

  // Filter items based on search and category
  const filteredItems = useMemo(() => {
    return cheatSheet.items.filter(item => {
      const matchesSearch = 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.code.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = 
        selectedCategory === 'all' || 
        (item.category || 'general') === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [cheatSheet.items, searchTerm, selectedCategory]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-emerald-100">
      {/* Header */}
      <div className="flex items-center mb-6">
        <IconComponent className="h-7 w-7 text-emerald-500 mr-3" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{cheatSheet.title}</h1>
          <p className="text-gray-600 mt-1">{cheatSheet.description}</p>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-6 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search commands..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        {/* Category Filter */}
        {categories.length > 1 && (
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  selectedCategory === category
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="mb-4 text-sm text-gray-600">
        Showing {filteredItems.length} of {cheatSheet.items.length} commands
      </div>
      
      {/* Commands List */}
      <div className="space-y-4">
        {filteredItems.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No commands found matching your search.
          </div>
        ) : (
          filteredItems.map((item, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-emerald-300 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900">{item.title}</h3>
                {item.category && (
                  <span className="inline-block px-2 py-1 text-xs bg-emerald-100 text-emerald-800 rounded-full">
                    {item.category}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-3">{item.description}</p>
              <div className="flex items-center justify-between bg-gray-50 rounded-md p-3">
                <code className="text-sm font-mono text-gray-800 flex-1 overflow-x-auto">
                  {item.code}
                </code>
                <button
                  onClick={() => copyToClipboard(item.category)}
                  className="ml-3 p-2 text-gray-500 hover:text-emerald-600 transition-colors rounded hover:bg-gray-100"
                  title="Copy command"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}