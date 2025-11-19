// components/tools/cheatsheet/docker/docker-tool.tsx
'use client';

import { cheatSheets } from '@/lib/cheatsheets';
import CheatSheetPage from '@/components/tools/cheatsheets/CheatSheetPage';

export default function DockerTool() {
  const sheet = cheatSheets.find(sheet => sheet.slug === 'docker');
  
  if (!sheet) {
    return <div>Docker cheat sheet not found</div>;
  }

  const faqItems = [
    {
      question: "What is Docker?",
      answer: "Docker is a platform for developing, shipping, and running applications in containers, which are lightweight, portable, and self-sufficient units that can run anywhere."
    },
    {
      question: "What's the difference between an image and a container?",
      answer: "An image is a read-only template with instructions for creating a container, while a container is a runnable instance of an image."
    },
    {
      question: "How do I remove unused Docker resources?",
      answer: "Use 'docker system prune' to remove all unused containers, networks, and images, or 'docker system prune -a' to remove all unused images including dangling ones."
    },
    {
      question: "What is Docker Compose?",
      answer: "Docker Compose is a tool for defining and running multi-container Docker applications using a YAML file to configure the application's services."
    }
  ];

  const seoContent = {
    title: "Master Docker Container Management with Essential Commands",
    description: "Comprehensive Docker cheat sheet with commands for container management, image building, networking, and orchestration.",
    whyUse: "Docker simplifies application deployment by packaging applications and dependencies into containers, ensuring consistent environments across development, testing, and production."
  };

  return (
    <CheatSheetPage 
      cheatSheet={sheet}
      faqItems={faqItems}
      seoContent={seoContent}
    />
  );
}