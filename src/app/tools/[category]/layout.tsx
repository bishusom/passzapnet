// app/tools/[category]/layout.tsx
import { getAllCategories, getCategoryInfo } from '@/config/tools-config';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export function generateStaticParams() {
  const categories = getAllCategories();
  return categories.map((category) => ({
    category: category.id,
  }));
}

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ category: string }> 
}): Promise<Metadata> {
  const { category } = await params;
  const categoryData = getCategoryInfo(category);

  if (!categoryData) {
    return {
      title: 'Category Not Found',
    };
  }

  return {
    title: `${categoryData.name} Tools - Free Online Utilities | PassZap`,
    description: `${categoryData.description}. Browse ${categoryData.toolCount} free tools in this category.`,
    keywords: `${categoryData.name.toLowerCase()} tools, ${categoryData.name.toLowerCase()} utilities, online ${categoryData.name.toLowerCase()}`,
  };
}

export default function CategoryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
}