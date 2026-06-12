'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface RequestBuilder {
  provider: string;
  model: string;
  messages: Array<{ role: string; content: string }>;
  temperature: number;
  maxTokens: number;
  topP?: number;
}

const PROVIDERS = {
  openai: {
    name: 'OpenAI',
    endpoint: 'https://api.openai.com/v1/chat/completions',
    models: ['gpt-4o', 'gpt-4-turbo', 'gpt-3.5-turbo'],
    defaultModel: 'gpt-4o',
  },
  anthropic: {
    name: 'Anthropic (Claude)',
    endpoint: 'https://api.anthropic.com/v1/messages',
    models: ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku'],
    defaultModel: 'claude-3-sonnet',
  },
  google: {
    name: 'Google Gemini',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models',
    models: ['gemini-1.5-pro', 'gemini-1.5-flash'],
    defaultModel: 'gemini-1.5-pro',
  },
};

export default function APIRequestBuilderTool() {
  const [provider, setProvider] = useState<keyof typeof PROVIDERS>('openai');
  const [model, setModel] = useState('gpt-4o');
  const [systemPrompt, setSystemPrompt] = useState('You are a helpful assistant.');
  const [userMessage, setUserMessage] = useState('');
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(1000);
  const [topP, setTopP] = useState(1);
  const [copied, setCopied] = useState(false);

  const currentProvider = PROVIDERS[provider];

  const buildRequest = () => {
    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage },
    ];

    const baseRequest = {
      model,
      messages,
      temperature,
      max_tokens: maxTokens,
      top_p: topP,
    };

    // Format based on provider
    if (provider === 'openai') {
      return {
        ...baseRequest,
        messages: messages.filter((m) => m.content),
      };
    } else if (provider === 'anthropic') {
      return {
        model,
        max_tokens: maxTokens,
        temperature,
        messages: [{ role: 'user', content: userMessage }],
        system: systemPrompt,
      };
    } else if (provider === 'google') {
      return {
        model: `models/${model}`,
        generationConfig: {
          temperature,
          maxOutputTokens: maxTokens,
          topP,
        },
        contents: [
          {
            role: 'user',
            parts: [{ text: userMessage }],
          },
        ],
        systemInstruction: {
          parts: [{ text: systemPrompt }],
        },
      };
    }

    return baseRequest;
  };

  const requestJson = JSON.stringify(buildRequest(), null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(requestJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-6">
      <div className="bg-gradient-to-br from-green-50 to-cyan-50 rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">API Request Builder</h2>
        <p className="text-gray-600">Build and test LLM API requests</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left - Configuration */}
        <div className="space-y-4">
          {/* Provider Selection */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Provider</h3>
            <div className="space-y-2">
              {Object.entries(PROVIDERS).map(([key, prov]) => (
                <label key={key} className="flex items-center gap-3 p-3 border border-gray-200 rounded cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    value={key}
                    checked={provider === key}
                    onChange={(e) => {
                      setProvider(e.target.value as keyof typeof PROVIDERS);
                      setModel(prov.defaultModel);
                    }}
                    className="w-4 h-4"
                  />
                  <div>
                    <div className="font-medium text-gray-800 text-sm">{prov.name}</div>
                    <div className="text-xs text-gray-500">{prov.endpoint}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Model Selection */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Model</label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            >
              {currentProvider.models.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* System Prompt */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">System Prompt</label>
            <textarea
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none h-24"
            />
          </div>

          {/* User Message */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">User Message</label>
            <textarea
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              placeholder="Enter your prompt here..."
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none h-24"
            />
          </div>

          {/* Parameters */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Parameters</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Temperature: {temperature.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Lower = more focused, Higher = more creative
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Max Tokens: {maxTokens}
                </label>
                <input
                  type="range"
                  min="10"
                  max="4000"
                  step="10"
                  value={maxTokens}
                  onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Top P: {topP.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={topP}
                  onChange={(e) => setTopP(parseFloat(e.target.value))}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Nucleus sampling (0-1)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right - Request JSON */}
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-semibold text-gray-700">Request JSON</h3>
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
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
            <div className="bg-gray-900 rounded p-4 font-mono text-sm text-gray-100 overflow-x-auto max-h-96 overflow-y-auto">
              <pre>{requestJson}</pre>
            </div>
          </div>

          {/* Endpoint Info */}
          <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-cyan-900 mb-2">Endpoint Information</h3>
            <div className="space-y-2 text-sm text-cyan-800">
              <div>
                <span className="font-medium">URL:</span>
                <div className="text-xs bg-white p-2 rounded mt-1 break-all font-mono">
                  {currentProvider.endpoint}
                </div>
              </div>
              <div>
                <span className="font-medium">Method:</span>
                <span className="ml-2 bg-white px-2 py-1 rounded text-xs font-mono">POST</span>
              </div>
              <div>
                <span className="font-medium">Auth:</span>
                <span className="ml-2 text-xs">Bearer {'{YOUR_API_KEY}'}</span>
              </div>
            </div>
          </div>

          {/* Quick Tips */}
          <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-cyan-900 mb-2">⚡ Quick Tips</h3>
            <ul className="text-xs text-cyan-800 space-y-1 list-disc list-inside">
              <li>Replace {'{YOUR_API_KEY}'} with your actual API key</li>
              <li>Add required headers (Content-Type, Authorization)</li>
              <li>Test in Postman or your API client</li>
              <li>Check provider docs for rate limits</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
