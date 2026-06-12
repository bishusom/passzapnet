'use client';

import { useState } from 'react';
import { ArrowRight, Copy, Check } from 'lucide-react';

interface ModelCost {
  provider: string;
  name: string;
  inputCost: number; // per 1M tokens
  outputCost: number; // per 1M tokens
}

const LLM_MODELS: ModelCost[] = [
  // OpenAI
  { provider: 'OpenAI', name: 'GPT-4o', inputCost: 5, outputCost: 15 },
  { provider: 'OpenAI', name: 'GPT-4 Turbo', inputCost: 10, outputCost: 30 },
  { provider: 'OpenAI', name: 'GPT-3.5 Turbo', inputCost: 0.5, outputCost: 1.5 },
  // Anthropic
  { provider: 'Anthropic', name: 'Claude 3 Opus', inputCost: 15, outputCost: 75 },
  { provider: 'Anthropic', name: 'Claude 3 Sonnet', inputCost: 3, outputCost: 15 },
  { provider: 'Anthropic', name: 'Claude 3 Haiku', inputCost: 0.8, outputCost: 4 },
  // Google
  { provider: 'Google', name: 'Gemini 1.5 Pro', inputCost: 1.25, outputCost: 5 },
  { provider: 'Google', name: 'Gemini 1.5 Flash', inputCost: 0.075, outputCost: 0.3 },
  // Meta
  { provider: 'Meta', name: 'Llama 2 (70B)', inputCost: 0.99, outputCost: 0.99 },
];

export default function LLMCostCalculatorTool() {
  const [inputTokens, setInputTokens] = useState(1000000);
  const [outputTokens, setOutputTokens] = useState(500000);
  const [copied, setCopied] = useState<string | null>(null);
  const [selectedModels, setSelectedModels] = useState<string[]>([
    'GPT-4o',
    'Claude 3 Sonnet',
    'Gemini 1.5 Flash',
  ]);

  const handleModelToggle = (modelName: string) => {
    setSelectedModels((prev) =>
      prev.includes(modelName)
        ? prev.filter((m) => m !== modelName)
        : [...prev, modelName]
    );
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const calculateCost = (model: ModelCost) => {
    const inputCost = (inputTokens / 1_000_000) * model.inputCost;
    const outputCost = (outputTokens / 1_000_000) * model.outputCost;
    return inputCost + outputCost;
  };

  const filteredAndSortedModels = LLM_MODELS.filter((m) =>
    selectedModels.includes(m.name)
  ).sort((a, b) => calculateCost(a) - calculateCost(b));

  const totalCost = filteredAndSortedModels.reduce((sum, model) => sum + calculateCost(model), 0);
  const avgCost = filteredAndSortedModels.length > 0 ? totalCost / filteredAndSortedModels.length : 0;

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-6">
      <div className="bg-gradient-to-br from-green-50 to-cyan-50 rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">LLM Cost Calculator</h2>
        <p className="text-gray-600">Compare API costs across multiple LLM providers</p>
      </div>

      {/* Input Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Input Tokens */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Input Tokens
          </label>
          <div className="flex items-center gap-2 mb-2">
            <input
              type="number"
              value={inputTokens}
              onChange={(e) => setInputTokens(Math.max(0, Number(e.target.value)))}
              className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
            <span className="text-xs text-gray-500">tokens</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <button
              onClick={() => setInputTokens(1000)}
              className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
            >
              1K
            </button>
            <button
              onClick={() => setInputTokens(1_000_000)}
              className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
            >
              1M
            </button>
            <button
              onClick={() => setInputTokens(10_000_000)}
              className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
            >
              10M
            </button>
          </div>
        </div>

        {/* Output Tokens */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Output Tokens
          </label>
          <div className="flex items-center gap-2 mb-2">
            <input
              type="number"
              value={outputTokens}
              onChange={(e) => setOutputTokens(Math.max(0, Number(e.target.value)))}
              className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
            <span className="text-xs text-gray-500">tokens</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <button
              onClick={() => setOutputTokens(1000)}
              className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
            >
              1K
            </button>
            <button
              onClick={() => setOutputTokens(1_000_000)}
              className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
            >
              1M
            </button>
            <button
              onClick={() => setOutputTokens(10_000_000)}
              className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
            >
              10M
            </button>
          </div>
        </div>
      </div>

      {/* Model Selection */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-8">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Select Models to Compare</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {Array.from(new Set(LLM_MODELS.map((m) => m.name))).map((modelName) => (
            <label key={modelName} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
              <input
                type="checkbox"
                checked={selectedModels.includes(modelName)}
                onChange={() => handleModelToggle(modelName)}
                className="w-4 h-4 rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">{modelName}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Results Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-800">Cost Comparison</h3>

        {filteredAndSortedModels.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Summary Stats */}
              <div className="bg-gradient-to-br from-green-50 to-cyan-50 border border-green-200 rounded-lg p-4">
                <p className="text-xs text-green-700 mb-1">Cheapest Model</p>
                <p className="text-2xl font-bold text-green-600">
                  ${calculateCost(filteredAndSortedModels[0]).toFixed(4)}
                </p>
                <p className="text-xs text-green-600 mt-1">{filteredAndSortedModels[0].name}</p>
              </div>

              <div className="bg-gradient-to-br from-cyan-50 to-green-50 border border-cyan-200 rounded-lg p-4">
                <p className="text-xs text-cyan-700 mb-1">Average Cost</p>
                <p className="text-2xl font-bold text-cyan-600">
                  ${avgCost.toFixed(4)}
                </p>
                <p className="text-xs text-cyan-600 mt-1">Across {filteredAndSortedModels.length} models</p>
              </div>

              <div className="bg-gradient-to-br from-cyan-50 to-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-xs text-green-700 mb-1">Most Expensive</p>
                <p className="text-2xl font-bold text-green-600">
                  ${calculateCost(filteredAndSortedModels[filteredAndSortedModels.length - 1]).toFixed(4)}
                </p>
                <p className="text-xs text-green-600 mt-1">{filteredAndSortedModels[filteredAndSortedModels.length - 1].name}</p>
              </div>
            </div>

            {/* Model Comparison Table */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Model</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Provider</th>
                      <th className="px-4 py-3 text-right font-semibold text-gray-700">Input Cost</th>
                      <th className="px-4 py-3 text-right font-semibold text-gray-700">Output Cost</th>
                      <th className="px-4 py-3 text-right font-semibold text-gray-700">Total</th>
                      <th className="px-4 py-3 text-center font-semibold text-gray-700">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAndSortedModels.map((model, idx) => {
                      const inputCost = (inputTokens / 1_000_000) * model.inputCost;
                      const outputCost = (outputTokens / 1_000_000) * model.outputCost;
                      const total = inputCost + outputCost;
                      const isVisuallyBest = idx === 0;

                      return (
                        <tr
                          key={model.name}
                          className={`border-b border-gray-200 hover:bg-gray-50 ${
                            isVisuallyBest ? 'bg-green-50' : ''
                          }`}
                        >
                          <td className="px-4 py-3 font-medium text-gray-800">{model.name}</td>
                          <td className="px-4 py-3 text-gray-600">{model.provider}</td>
                          <td className="px-4 py-3 text-right text-gray-700">${inputCost.toFixed(4)}</td>
                          <td className="px-4 py-3 text-right text-gray-700">${outputCost.toFixed(4)}</td>
                          <td className="px-4 py-3 text-right font-bold text-cyan-600">${total.toFixed(4)}</td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => handleCopy(total.toFixed(4), model.name)}
                              className="p-1.5 hover:bg-gray-200 rounded transition-colors inline-flex"
                              title="Copy cost"
                            >
                              {copied === model.name ? (
                                <Check size={16} className="text-green-600" />
                              ) : (
                                <Copy size={16} className="text-gray-600" />
                              )}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>Select at least one model to see cost comparison</p>
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="mt-6 p-4 bg-cyan-50 border border-cyan-200 rounded-lg">
        <h3 className="font-semibold text-cyan-900 mb-2">ℹ️ How to Use</h3>
        <ul className="text-sm text-cyan-800 space-y-1 list-disc list-inside">
          <li>Enter your input and output token counts</li>
          <li>Select which LLM models you want to compare</li>
          <li>View the costs side-by-side to find the best option</li>
          <li>Use preset buttons (1K, 1M, 10M) for quick estimation</li>
          <li>Prices are approximate and updated regularly</li>
        </ul>
      </div>
    </div>
  );
}
