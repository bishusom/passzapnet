// components/tools/cheatsheet/git/git-tool.tsx
'use client';

import { cheatSheets } from '@/lib/cheatsheets';
import CheatSheetPage from '@/components/tools/cheatsheets/CheatSheetPage';

export default function GitTool() {
  const sheet = cheatSheets.find(sheet => sheet.slug === 'git');
  
  if (!sheet) {
    return <div>Git cheat sheet not found</div>;
  }

  const faqItems = [
    {
      question: "What is Git?",
      answer: "Git is a distributed version control system that tracks changes in source code during software development, enabling multiple developers to work together on non-linear development."
    },
    {
      question: "How do I undo the last commit?",
      answer: "Use 'git reset --soft HEAD~1' to undo the commit but keep changes staged, or 'git reset --hard HEAD~1' to completely remove the commit and changes."
    },
    {
      question: "What's the difference between git pull and git fetch?",
      answer: "git fetch downloads changes from remote without merging, while git pull does both fetch and merge in one command."
    },
    {
      question: "How do I resolve merge conflicts?",
      answer: "Edit the conflicted files to resolve differences, then stage the resolved files with 'git add' and complete the merge with 'git commit'."
    }
  ];

  const seoContent = {
    title: "Master Git Version Control with Essential Commands",
    description: "Comprehensive Git cheat sheet with commands for version control, branching, merging, and collaboration workflows.",
    whyUse: "Git is essential for modern software development, enabling efficient version control, collaboration, and code management across teams of all sizes."
  };

  return (
    <CheatSheetPage 
      cheatSheet={sheet}
      faqItems={faqItems}
      seoContent={seoContent}
    />
  );
}