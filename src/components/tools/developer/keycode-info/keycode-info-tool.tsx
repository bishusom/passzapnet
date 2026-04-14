'use client'

import React, { useState, useEffect } from 'react';
import { Keyboard, Copy, Check } from 'lucide-react';

interface KeyRecord {
  key: string;
  code: string;
  keyCode: number;
}

export default function KeycodeInfo() {
  const [lastEvent, setLastEvent] = useState<KeyRecord | null>(null);
  const [history, setHistory] = useState<KeyRecord[]>([]);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault(); // Prevent scrolling on Space, etc.
      
      const record = {
        key: e.key === ' ' ? 'Space' : e.key,
        code: e.code,
        keyCode: e.keyCode
      };

      setLastEvent(record);
      setHistory(prev => [record, ...prev].slice(0, 10)); // keep last 10
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-[600px] flex flex-col pt-8 pb-12">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl shadow-lg mb-6 animate-pulse">
          <Keyboard className="h-10 w-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Press Any Key</h2>
        <p className="text-gray-500">Get the JavaScript event codes for any keystroke instantly</p>
      </div>

      {!lastEvent && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-xl text-gray-400 border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center w-full max-w-2xl bg-gray-50">
            Waiting for a key to be pressed...
          </div>
        </div>
      )}

      {lastEvent && (
        <div className="max-w-4xl mx-auto w-full px-4">
          <div className="bg-white rounded-3xl shadow-xl border border-blue-100 p-8 md:p-12 mb-8 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 to-indigo-500" />
            
            <p className="text-blue-600 font-semibold uppercase tracking-widest mb-4">You Pressed</p>
            <div className="text-8xl md:text-9xl font-bold text-gray-900 mb-12 truncate px-4 pb-4">
              {lastEvent.key}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'event.key', value: lastEvent.key },
                { label: 'event.keyCode', value: lastEvent.keyCode.toString() },
                { label: 'event.code', value: lastEvent.code }
              ].map((item, i) => (
                <div key={i} className="bg-blue-50 rounded-2xl p-6 relative group">
                  <p className="text-sm text-blue-600 font-medium mb-2">{item.label}</p>
                  <p className="text-2xl font-mono text-gray-900 truncate">{item.value}</p>
                  <button
                    onClick={() => copyToClipboard(item.value, item.label)}
                    className="absolute top-4 right-4 p-2 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity hover:text-blue-600 rounded-lg hover:bg-blue-100"
                    title="Copy"
                  >
                    {copied === item.label ? <Check size={18} /> : <Copy size={18} />}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {history.length > 1 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 px-2">Recent History</h3>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-sm font-medium text-gray-500">
                      <th className="px-6 py-4">Key</th>
                      <th className="px-6 py-4">keyCode</th>
                      <th className="px-6 py-4 border-r-0">Code</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.slice(1).map((record, i) => (
                      <tr key={i} className="border-b border-gray-50 hover:bg-blue-50/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-900">{record.key}</td>
                        <td className="px-6 py-4 font-mono text-gray-600">{record.keyCode}</td>
                        <td className="px-6 py-4 font-mono text-gray-600">{record.code}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
