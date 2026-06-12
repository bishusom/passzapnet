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

interface TokenElement {
  text: string;
  tokens: number;
  isSpace?: boolean;
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
const TOKEN_COLORS = [
  'bg-cyan-100 text-cyan-800',
  'bg-green-100 text-green-800',
  'bg-cyan-50 text-cyan-700',
  'bg-green-100 text-green-800',
  'bg-green-50 text-green-700',
  'bg-cyan-100 text-cyan-800',
  'bg-green-100 text-green-800',
  'bg-cyan-100 text-cyan-800',
];

// Simulate tokenization by breaking text into word-based tokens
const tokenizeText = (text: string): TokenElement[] => {
  if (!text.trim()) return [];
  
  // Split by spaces but keep track of spaces
  const parts: TokenElement[] = [];
  const tokens = text.split(/(\s+)/);
  
  tokens.forEach((token) => {
    if (token.match(/^\s+$/)) {
      // Whitespace
      parts.push({
        text: token,
        tokens: 0,
        isSpace: true,
      });
    } else if (token) {
      // Estimate tokens: longer words/punctuation get more tokens
      let tokenCount = 1;
      if (token.length > 4) tokenCount = 2;
      if (token.length > 8) tokenCount = 3;
      if (token.length > 15) tokenCount = 4;
      
      parts.push({
        text: token,
        tokens: tokenCount,
        isSpace: false,
      });
    }
  });
  
  return parts;
};

export default function AITokenCalculatorTool() {
  const [textInput, setTextInput] = useState('');
  const [inputTokens, setInputTokens] = useState(0);
  const [outputTokens, setOutputTokens] = useState(0);
  const [selectedModel, setSelectedModel] = useState('gpt-4o');
  const [copied, setCopied] = useState(false);
  const [tokenElements, setTokenElements] = useState<TokenElement[]>([]);

  // Tokenize and estimate
  useEffect(() => {
    const elements = tokenizeText(textInput);
    setTokenElements(elements);
    
    const totalTokens = elements.reduce((sum, el) => sum + el.tokens, 0);
    setInputTokens(totalTokens);
  }, [textInput]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const totalTokens = inputTokens + outputTokens;
  const model = MODELS[selectedModel];
  const nonSpaceTokens = tokenElements.filter(el => !el.isSpace);

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-6">
      <div className="bg-gradient-to-br from-green-50 to-cyan-50 rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">AI Token Calculator</h2>
        <p className="text-gray-600">Visualize and estimate token usage for LLM models</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column - Input & Config */}
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
              Character count: {textInput.length}
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
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border-2 border-cyan-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Token Summary</h3>
            
            {/* Input Tokens */}
            <div className="mb-3">
              <p className="text-xs text-gray-600 mb-1">Input Tokens</p>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-cyan-600">{inputTokens}</span>
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
                <span className="text-3xl font-bold text-cyan-600">{outputTokens}</span>
              </div>
            </div>

            <div className="border-t border-gray-200 my-3"></div>

            {/* Total Tokens */}
            <div>
              <p className="text-xs text-gray-600 mb-1">Total Tokens</p>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-cyan-700">{totalTokens}</span>
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

      {/* Token Visualization */}
      {textInput.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Token Breakdown</h3>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex flex-wrap gap-2">
              {tokenElements.map((element, idx) => {
                if (element.isSpace) {
                  return (
                    <span key={idx} className="inline-block">
                      {element.text === ' ' ? '\u00A0' : '\u00A0'}
                    </span>
                  );
                }
                
                const colorClass = TOKEN_COLORS[idx % TOKEN_COLORS.length];
                return (
                  <span
                    key={idx}
                    className={`px-2 py-1 rounded text-xs font-medium ${colorClass} border border-current border-opacity-30 cursor-help`}
                    title={`"${element.text}" = ${element.tokens} token${element.tokens > 1 ? 's' : ''}`}
                  >
                    {element.text}
                    <span className="ml-1 opacity-70 text-xs">×{element.tokens}</span>
                  </span>
                );
              })}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                <div>
                  <span className="text-gray-600">Total Words:</span>
                  <span className="ml-2 font-semibold text-gray-800">{nonSpaceTokens.length}</span>
                </div>
                <div>
                  <span className="text-gray-600">Avg Tokens/Word:</span>
                  <span className="ml-2 font-semibold text-gray-800">
                    {(inputTokens / nonSpaceTokens.length || 0).toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Total Tokens:</span>
                  <span className="ml-2 font-semibold text-cyan-600">{inputTokens}</span>
                </div>
                <div>
                  <span className="text-gray-600">Chars/Token:</span>
                  <span className="ml-2 font-semibold text-gray-800">
                    {(textInput.length / inputTokens || 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Info Section */}
      <div className="mt-6 p-4 bg-cyan-50 border border-cyan-200 rounded-lg">
        <h3 className="font-semibold text-cyan-900 mb-2">ℹ️ About Token Counting</h3>
        <ul className="text-sm text-cyan-800 space-y-1 list-disc list-inside">
          <li>Each word is broken into tokens (shown as colored boxes in the visualization)</li>
          <li>Longer words use more tokens (e.g., "international" = 3-4 tokens vs "run" = 1 token)</li>
          <li>Hover over tokens to see the exact count per word</li>
          <li>Actual token counts may vary slightly by model and tokenizer</li>
          <li>Prices shown are approximate and current as of June 2026</li>
          <li>Use official model documentation for exact pricing</li>
        </ul>
      </div>
    </div>
  );
}
