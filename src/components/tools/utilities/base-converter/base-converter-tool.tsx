'use client'

import React, { useState } from 'react';
import { Terminal, Copy, Check, Calculator } from 'lucide-react';

export default function BaseConverter() {
  const [decimal, setDecimal] = useState('');
  const [binary, setBinary] = useState('');
  const [hex, setHex] = useState('');
  const [octal, setOctal] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, type: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const updateAll = (value: string, base: number) => {
    if (value.trim() === '') {
      setDecimal('');
      setBinary('');
      setHex('');
      setOctal('');
      return;
    }

    try {
      // Parse with error catching for huge numbers
      let parsed = BigInt(0);
      switch(base) {
        case 10:
          // Ensure valid decimal
          if (!/^-?\d+$/.test(value)) throw new Error("Invalid format");
          parsed = BigInt(value);
          break;
        case 2:
          if (!/^[01]+$/.test(value)) throw new Error("Invalid format");
          parsed = BigInt('0b' + value);
          break;
        case 16:
          if (!/^[0-9a-fA-F]+$/.test(value)) throw new Error("Invalid format");
          parsed = BigInt('0x' + value);
          break;
        case 8:
          if (!/^[0-7]+$/.test(value)) throw new Error("Invalid format");
          parsed = BigInt('0o' + value);
          break;
      }

      setDecimal(parsed.toString(10));
      setBinary(parsed.toString(2));
      setHex(parsed.toString(16).toUpperCase());
      setOctal(parsed.toString(8));
    } catch (err) {
      // If parsing fails due to invalid characters, don't update the others
      // just let the user edit the current box while it's in invalid state
    }
  };

  return (
    <div className="py-8 text-gray-800 font-sans">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl shadow-lg mb-6">
          <Calculator className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Base Number Converter</h2>
        <p className="text-gray-500 mb-10 w-full max-w-lg mx-auto">
          Type in any field and the others will convert instantly. Supports arbitrarily large numbers!
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Decimal */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100 relative group text-left">
            <label className="block text-sm font-semibold text-emerald-700 mb-2 flex justify-between">
              Decimal (Base 10)
              <span className="text-gray-400 font-normal">0-9</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={decimal}
                onChange={(e) => {
                  setDecimal(e.target.value);
                  updateAll(e.target.value, 10);
                }}
                className="w-full text-xl font-mono p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                placeholder="0"
              />
              <button
                onClick={() => copyToClipboard(decimal, 'decimal')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-emerald-600 transition-colors"
                title="Copy"
              >
                {copied === 'decimal' ? <Check size={20} /> : <Copy size={20} />}
              </button>
            </div>
          </div>

          {/* Hexadecimal */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100 relative group text-left">
            <label className="block text-sm font-semibold text-emerald-700 mb-2 flex justify-between">
              Hexadecimal (Base 16)
              <span className="text-gray-400 font-normal">0-9, A-F</span>
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-mono">0x</div>
              <input
                type="text"
                value={hex}
                onChange={(e) => {
                  setHex(e.target.value.toUpperCase());
                  updateAll(e.target.value.toUpperCase(), 16);
                }}
                className="w-full text-xl font-mono p-4 pl-10 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none uppercase"
                placeholder="0"
              />
              <button
                onClick={() => copyToClipboard(hex, 'hex')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-emerald-600 transition-colors"
                title="Copy"
              >
                {copied === 'hex' ? <Check size={20} /> : <Copy size={20} />}
              </button>
            </div>
          </div>

          {/* Binary */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100 relative group text-left">
            <label className="block text-sm font-semibold text-emerald-700 mb-2 flex justify-between">
              Binary (Base 2)
              <span className="text-gray-400 font-normal">0-1</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={binary}
                onChange={(e) => {
                  setBinary(e.target.value);
                  updateAll(e.target.value, 2);
                }}
                className="w-full text-lg font-mono p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                placeholder="0"
              />
              <button
                onClick={() => copyToClipboard(binary, 'binary')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-emerald-600 transition-colors bg-white/80"
                title="Copy"
              >
                {copied === 'binary' ? <Check size={20} /> : <Copy size={20} />}
              </button>
            </div>
          </div>

          {/* Octal */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100 relative group text-left">
            <label className="block text-sm font-semibold text-emerald-700 mb-2 flex justify-between">
              Octal (Base 8)
              <span className="text-gray-400 font-normal">0-7</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={octal}
                onChange={(e) => {
                  setOctal(e.target.value);
                  updateAll(e.target.value, 8);
                }}
                className="w-full text-xl font-mono p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                placeholder="0"
              />
              <button
                onClick={() => copyToClipboard(octal, 'octal')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-emerald-600 transition-colors"
                title="Copy"
              >
                {copied === 'octal' ? <Check size={20} /> : <Copy size={20} />}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
