// components/layout/Header.tsx
'use client'

import { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Menu, ChevronDown, Search } from 'lucide-react';
import { getAllCategories, getCategoryPath, getAllTools } from '@/config/tools-config';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const categories = getAllCategories().map(cat => ({
    id: cat.id,
    name: cat.name,
    icon: cat.icon,
    path: getCategoryPath(cat.id)
  }));

  const allTools = getAllTools();

  // Filter tools based on search term
  const filteredTools = searchTerm.trim() === '' ? [] : allTools.filter(tool =>
    tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 8); // Limit to 8 results for performance

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setToolsDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Clear search when a result is clicked
  const handleResultClick = () => {
    setSearchTerm('');
    setShowSearchResults(false);
  };

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-emerald-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <a href="/" className="flex items-center space-x-3 group">
            <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
                FreeDevTools Studio
              </div>
              <p className="text-sm text-emerald-600 font-medium">Free Online Utilities</p>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 items-center">
            {/* All Tools Link */}
            <a href="/tools" className="text-gray-600 hover:text-emerald-600 transition-colors font-medium py-2">
              All Tools
            </a>
            
            {/* Categories Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setToolsDropdownOpen(!toolsDropdownOpen)}
                className="flex items-center space-x-1 text-gray-600 hover:text-emerald-600 transition-colors font-medium py-2"
              >
                <span>Categories</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${toolsDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {toolsDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-emerald-100 py-2 animate-in slide-in-from-top z-50">
                  {categories.map((category) => (
                    <a
                      key={category.id}
                      href={category.path}
                      className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                      onClick={() => setToolsDropdownOpen(false)}
                    >
                      <category.icon className="h-4 w-4 text-emerald-500" />
                      <span>{category.name}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Search Input */}
            <div className="relative" ref={searchRef}>
              <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:bg-white transition-all">
                <Search className="h-4 w-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search tools..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowSearchResults(true);
                  }}
                  onFocus={() => setShowSearchResults(true)}
                  className="ml-2 bg-transparent outline-none text-sm w-40 lg:w-56"
                />
              </div>

              {/* Search Results Dropdown */}
              {showSearchResults && filteredTools.length > 0 && (
                <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-emerald-100 py-2 max-h-96 overflow-y-auto animate-in slide-in-from-top z-50">
                  {filteredTools.map((tool) => (
                    <a
                      key={tool.id}
                      href={tool.href}
                      className="flex items-start space-x-3 px-4 py-3 hover:bg-emerald-50 transition-colors"
                      onClick={handleResultClick}
                    >
                      <tool.icon className={`h-4 w-4 mt-0.5 ${tool.color}`} />
                      <div>
                        <div className="font-medium text-gray-900">{tool.name}</div>
                        <div className="text-xs text-gray-500 line-clamp-1">{tool.description}</div>
                        <div className="text-xs text-emerald-600 mt-1">{tool.categoryName}</div>
                      </div>
                    </a>
                  ))}
                </div>
              )}
              {showSearchResults && searchTerm.trim() !== '' && filteredTools.length === 0 && (
                <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-emerald-100 py-4 px-4 text-center text-gray-500 text-sm">
                  No tools found
                </div>
              )}
            </div>
          </nav>

          {/* Mobile menu button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-emerald-600" />
            ) : (
              <Menu className="h-6 w-6 text-emerald-600" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-emerald-100 animate-in slide-in-from-top">
            <div className="flex flex-col space-y-3">
              {/* All Tools Link - Mobile */}
              <a 
                href="/tools" 
                className="flex items-center space-x-3 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 transition-colors font-medium py-3 px-4 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Sparkles className="h-5 w-5 text-emerald-500" />
                <span>All Tools</span>
              </a>
              
              <div className="border-b border-emerald-100 pb-3">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2 px-4">
                  Tool Categories
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((category) => (
                    <a
                      key={category.id}
                      href={category.path}
                      className="flex items-center space-x-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 transition-colors font-medium py-2 px-3 rounded-lg text-sm"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <category.icon className="h-4 w-4 text-emerald-500" />
                      <span>{category.name}</span>
                    </a>
                  ))}
                </div>
              </div>
              
              {/* Mobile Search */}
              <div className="px-4 py-2">
                <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:bg-white transition-all">
                  <Search className="h-4 w-4 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search tools..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      // Keep mobile menu open while typing
                    }}
                    className="ml-2 bg-transparent outline-none text-sm flex-1"
                  />
                </div>
                {/* Show results inline in mobile menu */}
                {searchTerm.trim() !== '' && (
                  <div className="mt-3 space-y-2 max-h-64 overflow-y-auto">
                    {filteredTools.length > 0 ? (
                      filteredTools.map((tool) => (
                        <a
                          key={tool.id}
                          href={tool.href}
                          className="flex items-start space-x-3 px-3 py-2 hover:bg-emerald-50 rounded-lg transition-colors"
                          onClick={() => {
                            setSearchTerm('');
                            setMobileMenuOpen(false);
                          }}
                        >
                          <tool.icon className={`h-4 w-4 mt-0.5 ${tool.color}`} />
                          <div>
                            <div className="font-medium text-gray-900">{tool.name}</div>
                            <div className="text-xs text-gray-500">{tool.description}</div>
                            <div className="text-xs text-emerald-600 mt-1">{tool.categoryName}</div>
                          </div>
                        </a>
                      ))
                    ) : (
                      <div className="text-center text-gray-500 py-4 text-sm">
                        No tools found
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
