// components/tools/cheatsheet/regex/regex-tool.tsx
'use client';

import { cheatSheets } from '@/lib/cheatsheets';
import CheatSheetPage from '@/components/tools/cheatsheets/CheatSheetPage';

export default function RegexTool() {
  const sheet = cheatSheets.find(sheet => sheet.slug === 'regex');
  
  if (!sheet) {
    return <div>Regex cheat sheet not found</div>;
  }

  const faqItems = [
    {
      question: "What are regular expressions?",
      answer: "Regular expressions (regex) are patterns used to match character combinations in strings. They provide a powerful way to search, extract, and manipulate text based on patterns rather than fixed strings."
    },
    {
      question: "What's the difference between greedy and lazy quantifiers?",
      answer: "Greedy quantifiers (*, +, {}) match as much as possible, while lazy quantifiers (*?, +?, {}?) match as little as possible. For example, 'a.*b' on 'aabb' matches 'aabb' (greedy) while 'a.*?b' matches 'aab' (lazy)."
    },
    {
      question: "How do I make regex case-insensitive?",
      answer: "Use the 'i' flag: /pattern/i in JavaScript or (?i)pattern in some regex engines. Most programming languages have flags to control case sensitivity."
    },
    {
      question: "What are common regex metacharacters I need to escape?",
      answer: "The main metacharacters to escape are: . * + ? ^ $ { } [ ] ( ) | \\ /. When matching these literally, use backslash before them: \\. \\* \\+ etc."
    },
    {
      question: "How do I test and debug regex patterns?",
      answer: "Use online tools like regex101.com or regexr.com to test patterns with live previews, explanations, and debugging features. Most IDEs also have built-in regex testing."
    },
    {
      question: "What's the difference between [0-9] and \\d?",
      answer: "In most regex engines, they're equivalent and both match digits 0-9. However, \\d may match additional digit characters in Unicode-aware engines, while [0-9] is always just 0-9."
    }
  ];

  const seoContent = {
    title: "Master Regular Expressions with Comprehensive Regex Patterns",
    description: "Complete regex cheat sheet with patterns for validation, text extraction, data parsing, and string manipulation across all programming languages.",
    whyUse: "Regular expressions are essential for text processing, data validation, and pattern matching in programming. They provide a concise and powerful way to work with text that would otherwise require complex string manipulation code."
  };

  return (
    <CheatSheetPage 
      cheatSheet={sheet}
      faqItems={faqItems}
      seoContent={seoContent}
    />
  );
}