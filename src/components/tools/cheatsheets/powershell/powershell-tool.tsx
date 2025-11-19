// components/tools/cheatsheet/powershell/powershell-tool.tsx
'use client';

import { cheatSheets } from '@/lib/cheatsheets';
import CheatSheetPage from '@/components/tools/cheatsheets/CheatSheetPage';

export default function PowerShellTool() {
  const sheet = cheatSheets.find(sheet => sheet.slug === 'powershell');
  
  if (!sheet) {
    return <div>PowerShell cheat sheet not found</div>;
  }

  const faqItems = [
    {
      question: "What is PowerShell?",
      answer: "PowerShell is a task automation and configuration management framework from Microsoft, consisting of a command-line shell and a scripting language built on .NET. It's designed for system administration and automation."
    },
    {
      question: "What's the difference between PowerShell and Command Prompt?",
      answer: "PowerShell uses cmdlets (command-lets) that return objects, while Command Prompt uses text-based commands. PowerShell is more powerful for automation, scripting, and system management tasks."
    },
    {
      question: "How do I run PowerShell scripts?",
      answer: "First, you may need to set the execution policy using 'Set-ExecutionPolicy RemoteSigned'. Then run scripts with '.\\script.ps1' or from within PowerShell with the full path."
    },
    {
      question: "What are PowerShell cmdlets?",
      answer: "Cmdlets are lightweight commands that perform specific actions in PowerShell. They follow a Verb-Noun naming convention like Get-Process, Set-Service, or Remove-Item."
    },
    {
      question: "Can PowerShell be used on Linux and macOS?",
      answer: "Yes, PowerShell Core (now PowerShell 7+) is cross-platform and runs on Windows, Linux, and macOS, though some Windows-specific features may not be available."
    }
  ];

  const seoContent = {
    title: "Master PowerShell for Windows Administration and Automation",
    description: "Comprehensive PowerShell cheat sheet with essential cmdlets for system management, process control, file operations, and automation tasks.",
    whyUse: "PowerShell is the ultimate tool for Windows system administration, offering object-oriented automation, remote management capabilities, and integration with the entire Microsoft ecosystem that dramatically improves productivity."
  };

  return (
    <CheatSheetPage 
      cheatSheet={sheet}
      faqItems={faqItems}
      seoContent={seoContent}
    />
  );
}