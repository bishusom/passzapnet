// components/tools/cheatsheet/bash/bash-tool.tsx
'use client';

import { cheatSheets } from '@/lib/cheatsheets';
import CheatSheetPage from '@/components/tools/cheatsheets/CheatSheetPage';

export default function BashTool() {
  const sheet = cheatSheets.find(sheet => sheet.slug === 'bash');
  
  if (!sheet) {
    return <div>Bash cheat sheet not found</div>;
  }

  const faqItems = [
    {
      question: "What is Bash?",
      answer: "Bash (Bourne Again SHell) is a Unix shell and command language used as the default shell on most Linux distributions and macOS. It's used for executing commands, scripting, and automating tasks."
    },
    {
      question: "How do I make a Bash script executable?",
      answer: "Use 'chmod +x script.sh' to make a script executable, then run it with './script.sh' or 'bash script.sh'."
    },
    {
      question: "What's the difference between source and executing a script?",
      answer: "Using 'source script.sh' or '. script.sh' runs the script in the current shell environment, while './script.sh' runs it in a subshell. Changes to environment variables in a subshell don't affect the parent shell."
    },
    {
      question: "How do I handle errors in Bash scripts?",
      answer: "Use 'set -e' to exit on errors, 'set -u' to treat unset variables as errors, and 'set -o pipefail' to catch errors in pipelines. Use 'trap' for cleanup operations."
    },
    {
      question: "What are some common Bash special variables?",
      answer: "$0: script name, $1-$9: arguments, $@: all arguments, $#: number of arguments, $?: exit status of last command, $$: current process ID."
    }
  ];

  const seoContent = {
    title: "Master Bash Shell Commands for Efficient System Administration",
    description: "Comprehensive Bash cheat sheet with essential commands for file management, text processing, system monitoring, and automation scripting.",
    whyUse: "Bash is the fundamental shell for Unix-like systems, providing powerful command-line tools for system administration, file manipulation, and automation that every developer and sysadmin should master."
  };

  return (
    <CheatSheetPage 
      cheatSheet={sheet}
      faqItems={faqItems}
      seoContent={seoContent}
    />
  );
}