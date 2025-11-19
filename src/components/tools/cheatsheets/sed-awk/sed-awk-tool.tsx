// components/tools/cheatsheet/sed-awk/sed-awk-tool.tsx
'use client';

import { cheatSheets } from '@/lib/cheatsheets';
import CheatSheetPage from '@/components/tools/cheatsheets/CheatSheetPage';

export default function SedAwkTool() {
  const sheet = cheatSheets.find(sheet => sheet.slug === 'sed-awk');
  
  if (!sheet) {
    return <div>Sed & Awk cheat sheet not found</div>;
  }

  const faqItems = [
    {
      question: "What are sed and awk?",
      answer: "sed (stream editor) and awk are powerful command-line text processing tools. sed is ideal for simple text transformations, while awk is better for pattern scanning and processing structured data."
    },
    {
      question: "When should I use sed vs awk?",
      answer: "Use sed for simple text substitutions, deletions, and insertions. Use awk when you need to process columns of data, perform calculations, or work with structured records and fields."
    },
    {
      question: "What does the 'g' flag mean in sed?",
      answer: "The 'g' flag in sed commands like 's/old/new/g' means 'global' - it replaces all occurrences on each line, not just the first one."
    },
    {
      question: "How do awk fields work?",
      answer: "awk automatically splits each line into fields separated by whitespace. $1 is the first field, $2 the second, and so on. $0 represents the entire line. You can change the field separator with -F."
    },
    {
      question: "Can I combine sed and awk?",
      answer: "Yes! You can pipe sed output to awk and vice versa. For example: 'sed 's/foo/bar/' file.txt | awk '{print $1}' - this replaces text with sed then extracts the first column with awk."
    },
    {
      question: "What are some common sed options?",
      answer: "-i: edit files in-place, -n: suppress automatic printing, -e: add multiple commands. For example: 'sed -i 's/old/new/g' file.txt' modifies the file directly."
    }
  ];

  const seoContent = {
    title: "Master Text Processing with Sed and Awk One-Liners",
    description: "Comprehensive sed and awk cheat sheet with powerful text manipulation commands for data extraction, transformation, and reporting tasks.",
    whyUse: "Sed and awk are indispensable tools for text processing and data manipulation in Unix-like systems. They enable complex text transformations with concise one-liner commands, making them essential for log analysis, data cleaning, and automation workflows."
  };

  return (
    <CheatSheetPage 
      cheatSheet={sheet}
      faqItems={faqItems}
      seoContent={seoContent}
    />
  );
}