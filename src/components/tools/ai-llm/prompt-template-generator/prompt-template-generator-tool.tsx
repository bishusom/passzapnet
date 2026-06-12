'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  template: string;
  variables: string[];
}

const PROMPT_TEMPLATES: Record<string, PromptTemplate[]> = {
  summarization: [
    {
      id: 'summarize-text',
      name: 'Text Summarization',
      description: 'Summarize a long text into key points',
      template: `You are an expert summarizer. Your task is to summarize the following text into clear, concise bullet points.

Text to summarize:
{text}

Please provide:
- 3-5 main points
- In clear, concise language
- Numbered list format`,
      variables: ['text'],
    },
    {
      id: 'summarize-article',
      name: 'Article Summary',
      description: 'Create a professional article summary',
      template: `Summarize the following article in a professional manner:

Article:
{article}

Format:
- Headline
- 2-3 paragraph summary
- Key takeaways (3-5 points)`,
      variables: ['article'],
    },
  ],
  classification: [
    {
      id: 'sentiment-analysis',
      name: 'Sentiment Analysis',
      description: 'Classify sentiment in text',
      template: `Analyze the sentiment of the following text and provide a classification.

Text: {text}

Respond with:
1. Sentiment (Positive/Negative/Neutral)
2. Confidence score (0-100%)
3. Brief explanation (1-2 sentences)`,
      variables: ['text'],
    },
    {
      id: 'category-classifier',
      name: 'Content Classification',
      description: 'Classify content into categories',
      template: `Classify the following text into one of these categories: {categories}

Text: {text}

Respond with:
1. Category: [chosen category]
2. Confidence: [0-100%]
3. Reasoning: [brief explanation]`,
      variables: ['text', 'categories'],
    },
  ],
  translation: [
    {
      id: 'translate-text',
      name: 'Text Translation',
      description: 'Translate text with context preservation',
      template: `Translate the following text from {source_language} to {target_language}.

Text: {text}

Requirements:
- Maintain the original meaning and tone
- Preserve any technical terms if necessary
- Provide the translation only`,
      variables: ['text', 'source_language', 'target_language'],
    },
  ],
  'code-generation': [
    {
      id: 'generate-function',
      name: 'Function Generation',
      description: 'Generate code functions',
      template: `Write a {language} function that {description}

Requirements:
- Function name: {function_name}
- Input parameters: {parameters}
- Return type: {return_type}
- Include comments explaining the logic
- Add error handling if applicable`,
      variables: ['language', 'description', 'function_name', 'parameters', 'return_type'],
    },
    {
      id: 'debug-code',
      name: 'Code Debugging',
      description: 'Debug and fix code issues',
      template: `Debug the following {language} code:

\`\`\`{language}
{code}
\`\`\`

Issue: {issue}

Provide:
1. Root cause analysis
2. Fixed code
3. Explanation of the fix`,
      variables: ['language', 'code', 'issue'],
    },
  ],
  'question-answering': [
    {
      id: 'qa-expert',
      name: 'Expert Q&A',
      description: 'Get expert answers with context',
      template: `You are an expert in {topic}. Answer the following question comprehensively.

Context: {context}

Question: {question}

Provide:
- Direct answer
- Detailed explanation
- Relevant examples (if applicable)
- Related considerations`,
      variables: ['topic', 'context', 'question'],
    },
  ],
};

export default function PromptTemplateGeneratorTool() {
  const [selectedCategory, setSelectedCategory] = useState('summarization');
  const [selectedTemplate, setSelectedTemplate] = useState('summarize-text');
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);

  const categories = Object.keys(PROMPT_TEMPLATES);
  const currentTemplates = PROMPT_TEMPLATES[selectedCategory];
  const currentTemplate = currentTemplates.find((t) => t.id === selectedTemplate);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    const templates = PROMPT_TEMPLATES[category];
    setSelectedTemplate(templates[0].id);
    setVariables({});
  };

  const handleVariableChange = (key: string, value: string) => {
    setVariables((prev) => ({ ...prev, [key]: value }));
  };

  const generatePrompt = () => {
    if (!currentTemplate) return '';
    let prompt = currentTemplate.template;
    Object.entries(variables).forEach(([key, value]) => {
      prompt = prompt.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
    });
    return prompt;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatePrompt());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const finalPrompt = generatePrompt();
  const allVariablesFilled = currentTemplate?.variables.every(
    (v) => variables[v] && variables[v].trim().length > 0
  );

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-6">
      <div className="bg-gradient-to-br from-green-50 to-cyan-50 rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Prompt Template Generator</h2>
        <p className="text-gray-600">Optimized templates for common LLM tasks</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left - Template Selection */}
        <div className="lg:col-span-1 space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Category</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors capitalize ${
                    selectedCategory === category
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.replace(/-/g, ' ')}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Template</h3>
            <div className="space-y-2">
              {currentTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => {
                    setSelectedTemplate(template.id);
                    setVariables({});
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm ${
                    selectedTemplate === template.id
                      ? 'bg-cyan-50 text-cyan-700 border border-cyan-300'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="font-medium">{template.name}</div>
                  <div className="text-xs text-gray-600 mt-1">{template.description}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right - Variables & Output */}
        <div className="lg:col-span-2 space-y-6">
          {/* Variables Input */}
          {currentTemplate && currentTemplate.variables.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Variables</h3>
              <div className="space-y-3">
                {currentTemplate.variables.map((varName) => (
                  <div key={varName}>
                    <label className="block text-xs font-medium text-gray-600 mb-1 capitalize">
                      {varName.replace(/_/g, ' ')}
                    </label>
                    {varName.includes('language') || varName === 'code' ? (
                      <textarea
                        value={variables[varName] || ''}
                        onChange={(e) => handleVariableChange(varName, e.target.value)}
                        placeholder={`Enter ${varName.replace(/_/g, ' ')}`}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none h-20"
                      />
                    ) : (
                      <input
                        type="text"
                        value={variables[varName] || ''}
                        onChange={(e) => handleVariableChange(varName, e.target.value)}
                        placeholder={`Enter ${varName.replace(/_/g, ' ')}`}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Output Prompt */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-semibold text-gray-700">Generated Prompt</h3>
              <button
                onClick={handleCopy}
                disabled={!allVariablesFilled}
                className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm"
              >
                {copied ? (
                  <>
                    <Check size={16} />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    Copy
                  </>
                )}
              </button>
            </div>
            <textarea
              value={finalPrompt}
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-sm text-gray-700 resize-none focus:outline-none h-64"
            />
            {!allVariablesFilled && (
              <p className="text-xs text-green-700 mt-2">
                ⚠️ Fill in all variables to generate the complete prompt
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="mt-6 p-4 bg-cyan-50 border border-cyan-200 rounded-lg">
        <h3 className="font-semibold text-cyan-900 mb-2">💡 Tips for Better Prompts</h3>
        <ul className="text-sm text-cyan-800 space-y-1 list-disc list-inside">
          <li>Be specific with your inputs for more accurate results</li>
          <li>Include context and constraints to guide the model</li>
          <li>Use clear formatting and structure in your prompts</li>
          <li>Test templates with different variations to find what works best</li>
          <li>Iterate and refine based on the model's output</li>
        </ul>
      </div>
    </div>
  );
}
