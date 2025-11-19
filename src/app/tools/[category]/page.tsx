// app/tools/[category]/page.tsx
import { getAllCategories, getCategoryInfo, getToolsByCategory } from '@/config/tools-config';
import ToolCard from '@/components/ui/ToolCard';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  const categories = getAllCategories();
  return categories.map((category) => ({
    category: category.id,
  }));
}

export default async function CategoryPage({ 
  params 
}: { 
  params: Promise<{ category: string }> 
}) {
  const { category } = await params;
  const categoryData = getCategoryInfo(category);

  if (!categoryData) {
    notFound();
  }

  const tools = getToolsByCategory(category);

  /*console.log('Tools data:', tools.map(tool => ({
    name: tool.name,
    icon: tool.icon,
    hasIcon: !!tool.icon,
    iconType: typeof tool.icon
  })))*/

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-8">
          <Link 
            href="/tools" 
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to All Tools
          </Link>
          
          <div className="flex items-center space-x-4 mb-4">
            <div className={`p-3 rounded-xl ${categoryData.bgColor}`}>
              <categoryData.icon className={`h-8 w-8 ${categoryData.color}`} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{categoryData.name}</h1>
              <p className="text-gray-600">{categoryData.description}</p>
            </div>
          </div>
          
          <div className="text-sm text-gray-500">
            {tools.length} tool{tools.length !== 1 ? 's' : ''} in this category
          </div>
        </header>

        {/* Tools Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <ToolCard
              key={tool.id}
              name={tool.name}
              description={tool.description}
              href={tool.href}
              icon={tool.icon}
              category={tool.category}
            />
          ))}
        </div>
      </div>
    </div>
  );
}