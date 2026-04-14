'use client'

import React, { useState, useEffect } from 'react';
import { Type, Copy, Check, RefreshCw } from 'lucide-react';

const LOREM_WORDS = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit", 
  "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore", 
  "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud", 
  "exercitation", "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo", 
  "consequat", "duis", "aute", "irure", "in", "reprehenderit", "voluptate", 
  "velit", "esse", "cillum", "eu", "fugiat", "nulla", "pariatur", "excepteur", 
  "sint", "occaecat", "cupidatat", "non", "proident", "sunt", "culpa", "qui", 
  "officia", "deserunt", "mollit", "anim", "id", "est", "laborum"
];

export default function LoremIpsum() {
  const [type, setType] = useState<'paragraphs' | 'words' | 'sentences'>('paragraphs');
  const [count, setCount] = useState<number>(3);
  const [output, setOutput] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const generateLorem = () => {
    let result = '';
    
    const getRandomWord = () => LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)];
    const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
    
    if (type === 'words') {
      const words = Array.from({ length: count }, () => getRandomWord());
      words[0] = capitalize(words[0]);
      result = words.join(' ') + '.';
    } 
    else if (type === 'sentences') {
      const sentences = Array.from({ length: count }, () => {
        const sentenceLength = Math.floor(Math.random() * 8) + 5; // 5-12 words
        const words = Array.from({ length: sentenceLength }, () => getRandomWord());
        words[0] = capitalize(words[0]);
        return words.join(' ') + '.';
      });
      result = sentences.join(' ');
    } 
    else if (type === 'paragraphs') {
      const paragraphs = Array.from({ length: count }, () => {
        const sentenceCount = Math.floor(Math.random() * 4) + 3; // 3-6 sentences
        const sentences = Array.from({ length: sentenceCount }, () => {
          const sentenceLength = Math.floor(Math.random() * 8) + 5;
          const words = Array.from({ length: sentenceLength }, () => getRandomWord());
          words[0] = capitalize(words[0]);
          return words.join(' ') + '.';
        });
        return (sentences[0].startsWith('Lorem') ? sentences.join(' ') : 'Lorem ipsum dolor sit amet. ' + sentences.slice(1).join(' '));
      });
      result = paragraphs.join('\n\n');
    }
    
    setOutput(result);
  };

  useEffect(() => {
    generateLorem();
  }, [type, count]);

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="py-8 text-gray-800">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Controls */}
        <div className="bg-white rounded-2xl shadow-sm border border-pink-100 p-6 mb-8 flex flex-col sm:flex-row items-center gap-6">
          <div className="flex-1 flex items-center gap-4 w-full">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-pink-500 focus:outline-none"
              >
                <option value="paragraphs">Paragraphs</option>
                <option value="sentences">Sentences</option>
                <option value="words">Words</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Length</label>
              <input
                type="number"
                min="1"
                max="100"
                value={count}
                onChange={(e) => setCount(parseInt(e.target.value) || 1)}
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-pink-500 focus:outline-none"
              />
            </div>
          </div>
          
          <div className="flex items-end h-full">
            <button
              onClick={generateLorem}
              className="px-6 py-2 bg-pink-50 text-pink-600 rounded-xl hover:bg-pink-100 font-medium transition-colors flex items-center gap-2 mb-[2px]"
            >
              <RefreshCw size={18} /> Regenerate
            </button>
          </div>
        </div>

        {/* Output Area */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden relative">
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-3 flex justify-between items-center">
            <h3 className="font-semibold flex items-center gap-2 text-gray-700">
              <Type size={18} className="text-pink-500" /> Output Text
            </h3>
            <button
              onClick={handleCopy}
              className={`px-4 py-1.5 rounded-lg font-medium text-sm transition-colors flex items-center gap-2
                ${copied 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? 'Copied!' : 'Copy Text'}
            </button>
          </div>
          <div className="p-6">
            <div className="prose prose-pink max-w-none text-gray-700 whitespace-pre-wrap font-serif leading-relaxed text-lg">
              {output}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
