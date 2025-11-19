// app/tools/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'All Tools - Free Online Developer Tools | PassZap',
  description: 'Discover our collection of free online tools for developers, designers, and creators.',
};

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
}