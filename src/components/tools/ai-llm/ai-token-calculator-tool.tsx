'use client';

import { useState, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';

interface TokenEstimate {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
}

interface ModelPricing {
  name: string;
  inputCost: number; // per 1M tokens
  outputCost: number; // per 1M tokens
}

const MODELS: Record<string, ModelPricing> = {
  'gpt-4o': { name: 'GPT-4o', inputCost: 5, outputCost: 15 },
  'gpt-4-turbo': { name: 'GPT-4 Turbo', inputCost: 10, outputCost: 30 },
  'gpt-3.5-turbo': { name: 'GPT-3.5 Turbo', inputCost: 0.5, outputCost: 1.5 },
  'claude-3-opus': { name: 'Claude 3 Opus', inputCost: 15, outputCost: 75 },
  'claude-3-sonnet': { name: 'Claude 3 Sonnet', inputCost: 3, outputCost: 15 },
  'claude-3-haiku': { name: 'Claude 3 Haiku', inputCost: 0.8, outputCost: 4 },
  'gemini-1.5-pro': { name: 'Gemini 1.5 Pro', inputCost: 1.25, outputCost: 5 },
  'gemini-1.5-flash': { name: 'Gemini 1.5 Flash', inputCost: 0.075, outputCost: 0.3 },
};

const AVERAGE_TOKENS_PER_WORD = 1.3;

export default function AITokenCalculatorTool() {
  const [textInput, setTextInput] = useState('');
  const [inputTokens, setInputTokens] = useState(0);
  const [outputTokens, setOutputTokens] = useState(0);
  const [selectedModel, setSelectedModel] = useState('gpt-4o');
  const [copied, setCopied] = useState(false);

  // Rough token estimation (word count * average tokens per word)
  useEffect(() => {
    const words = textInput.trim().split(/\s+/).filter(w => w.length > 0).length;
    const estimatedTokens = Math.ceil(words * AVERAGE_TOKENS_PER_WORD);
    setInputTokens(words > 0 ? estimatedTokens : 0);
  }, [textInput]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const totalTokens = inputTokens + outputTokens;
  const model = MODELS[selectedModel];

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6">
      <div className="bg-gradient-to-br from-green-50 to-cyan-50 rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">AI Token Calculator</h2>
        <p className="text-gray-600">Estimate token usage and costs for various LLM models</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Input */}
        <div className="lg:col-span-2 space-y-6">
          {/* Text Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Prompt Text
            </label>
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Paste your prompt or text here to estimate token count..."
              className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
            />
            <p className="text-xs text-gray-500 mt-2">
              Uses approximate token calculation (1 word ≈ {AVERAGE_TOKENS_PER_WORD} tokens)
            </p>
          </div>

          {/* Output Tokens Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Expected Output Tokens
            </label>
            <input
              type="number"
              value={outputTokens}
              onChange={(e) => setOutputTokens(Math.max(0, Number(e.target.value)))}
              placeholder="100"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-2">
              Estimate how many tokens the model will generate in response
            </p>
          </div>

          {/* Model Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              LLM Model
            </label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            >
              <optgroup label="OpenAI">
                <option value="gpt-4o">GPT-4o</option>
                <option value="gpt-4-turbo">GPT-4 Turbo</option>
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
              </optgroup>
              <optgroup label="Anthropic">
                <option value="claude-3-opus">Claude 3 Opus</option>
                <option value="claude-3-sonnet">Claude 3 Sonnet</option>
                <option value="claude-3-haiku">Claude 3 Haiku</option>
              </optgroup>
              <optgroup label="Google">
                <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
                <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
              </optgroup>
            </select>
          </div>
        </div>

        {/* Right Column - Results */}
        <div className="space-y-4">
          <div className="bg-white border-2 border-cyan-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Token Estimates</h3>
            
            {/* Input Tokens */}
            <div className="mb-3">
              <p className="text-xs text-gray-600 mb-1">Input Tokens</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-cyan-600">{inputTokens}</span>
                <button
                  onClick={() => handleCopy(inputTokens.toString())}
                  className="p-2 hover:bg-gray-100 rounded transition-colors"
                  title="Copy"
                >
                  {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                </button>
              </div>
            </div>

            <div className="border-t border-gray-200 my-3"></div>

            {/* Output Tokens */}
            <div className="mb-3">
              <p className="text-xs text-gray-600 mb-1">Output Tokens</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-cyan-600">{outputTokens}</span>
              </div>
            </div>

            <div className="border-t border-gray-200 my-3"></div>

            {/* Total Tokens */}
            <div>
              <p className="text-xs text-gray-600 mb-1">Total Tokens</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-cyan-700">{totalTokens}</span>
              </div>
            </div>
          </div>

          {/* Cost Estimation */}
          <div className="bg-gradient-to-br from-green-50 to-cyan-50 border border-green-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Cost Preview</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Model:</span>
                <span className="font-semibold text-gray-800">{model.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Input Cost:</span>
                <span className="text-gray-800">${((inputTokens / 1_000_000) * model.inputCost).toFixed(6)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Output Cost:</span>
                <span className="text-gray-800">${((outputTokens / 1_000_000) * model.outputCost).toFixed(6)}</span>
              </div>
              <div className="border-t border-green-200 my-2"></div>
              <div className="flex justify-between font-bold">
                <span className="text-gray-700">Total Estimate:</span>
                <span className="text-green-600">
                  ${(((inputTokens / 1_000_000) * model.inputCost) + ((outputTokens / 1_000_000) * model.outputCost)).toFixed(6)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-6 p-4 bg-cyan-50 border border-cyan-200 rounded-lg">
        <h3 className="font-semibold text-cyan-900 mb-2">ℹ️ About Token Counting</h3>
        <ul className="text-sm text-cyan-800 space-y-1 list-disc list-inside">
          <li>This tool estimates tokens based on word count (1 word ≈ 1.3 tokens)</li>
          <li>Actual token counts may vary by model and tokenizer</li>
          <li>Prices shown are approximate and current as of June 2024</li>
          <li>Use official model documentation for exact pricing</li>
        </ul>
      </div>
    </div>
  );
}
