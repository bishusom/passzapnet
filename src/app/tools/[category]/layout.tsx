// app/tools/[category]/layout.tsx
import { getAllCategories, getCategoryInfo } from '@/config/tools-config';
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
    alternates: {
      canonical: `https://passzap.net/tools/${category}`,
    },
    openGraph: {
      title: `${categoryData.name} Tools - Free Online Utilities | PassZap`,
      description: `${categoryData.description}. Browse ${categoryData.toolCount} free tools in this category.`,
      url: `https://passzap.net/tools/${category}`,
      siteName: 'PassZap',
      locale: 'en_US',
      type: 'website',
      images: [
        {
          url: 'https://passzap.net/og-image.png',
          width: 1200,
          height: 630,
          alt: `${categoryData.name} tools on PassZap`,
        },
      ],
    },
  };
}

export default function CategoryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
}
