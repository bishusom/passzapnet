// components/tools/CssGradientGenerator.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  Palette,
  PaintBucket, 
  Copy, 
  Download,
  Plus,
  Trash2,
  RotateCw,
  Shield,
  Zap,
  Code,
  Layout,
  Smartphone,
  Monitor
} from 'lucide-react';

interface ColorStop {
  id: string;
  color: string;
  position: number;
}

interface GradientConfig {
  type: 'linear' | 'radial' | 'conic';
  angle: number;
  colors: ColorStop[];
}

export default function CssGradientGenerator() {
  const [gradientConfig, setGradientConfig] = useState<GradientConfig>({
    type: 'linear',
    angle: 90,
    colors: [
      { id: '1', color: '#667eea', position: 0 },
      { id: '2', color: '#764ba2', position: 100 }
    ]
  });
  const [copied, setCopied] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  // FAQ items
  const gradientFaqItems = [
    {
      question: "What's the difference between linear, radial, and conic gradients?",
      answer: "Linear gradients transition colors along a straight line, radial gradients radiate from a center point, and conic gradients rotate around a center point like a color wheel."
    },
    {
      question: "Can I use these gradients in any CSS project?",
      answer: "Yes! The generated CSS code works in all modern browsers including Chrome, Firefox, Safari, and Edge. The code follows standard CSS gradient syntax."
    },
    {
      question: "How many color stops can I add to a gradient?",
      answer: "You can add as many color stops as needed. Each stop defines a color and its position in the gradient. More stops create more complex and detailed gradients."
    },
    {
      question: "What's the best way to use gradients in web design?",
      answer: "Gradients work great for backgrounds, buttons, text effects, and overlays. Use subtle gradients for professional designs and bold gradients for creative projects."
    },
    {
      question: "Are CSS gradients better than gradient images?",
      answer: "Yes! CSS gradients are rendered by the browser, so they're faster to load, scalable without quality loss, and easier to modify than image-based gradients."
    },
    {
      question: "Can I create gradient text with this generator?",
      answer: "Absolutely! Use the generated gradient with background-clip: text and color: transparent to create stunning gradient text effects."
    }
  ];

  const addColorStop = () => {
    const newColorStop: ColorStop = {
      id: Date.now().toString(),
      color: '#ffffff',
      position: Math.min(100, gradientConfig.colors[gradientConfig.colors.length - 1].position + 20)
    };
    
    setGradientConfig(prev => ({
      ...prev,
      colors: [...prev.colors, newColorStop]
    }));
  };

  const removeColorStop = (id: string) => {
    if (gradientConfig.colors.length <= 2) return;
    
    setGradientConfig(prev => ({
      ...prev,
      colors: prev.colors.filter(stop => stop.id !== id)
    }));
  };

  const updateColorStop = (id: string, updates: Partial<ColorStop>) => {
    setGradientConfig(prev => ({
      ...prev,
      colors: prev.colors.map(stop => 
        stop.id === id ? { ...stop, ...updates } : stop
      )
    }));
  };

  const getGradientCSS = (): string => {
    const colorStops = gradientConfig.colors
        .sort((a, b) => a.position - b.position)
        .map(stop => `${stop.color} ${stop.position}%`)
        .join(', ');

    switch (gradientConfig.type) {
        case 'linear':
        return `linear-gradient(${gradientConfig.angle}deg, ${colorStops})`;
        case 'radial':
        return `radial-gradient(circle, ${colorStops})`;
        case 'conic':
        // Create a proper CSS with @supports fallback
        return `
            /* Fallback for browsers without conic gradient support */
            background: linear-gradient(${gradientConfig.angle}deg, ${colorStops});
            
            /* Conic gradient for supporting browsers */
            @supports (background: conic-gradient(from 0deg, red, blue)) {
            background: conic-gradient(from ${gradientConfig.angle}deg, ${colorStops});
            }
        `;
        default:
        return `linear-gradient(${gradientConfig.angle}deg, ${colorStops})`;
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`background: ${getGradientCSS()};`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const downloadAsImage = () => {
    if (!previewRef.current) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 400;

    // Create gradient based on type
    let gradient;
    switch (gradientConfig.type) {
        case 'linear':
        gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        // Apply angle for linear gradients
        const angleInRadians = (gradientConfig.angle * Math.PI) / 180;
        const x2 = Math.cos(angleInRadians) * canvas.width;
        const y2 = Math.sin(angleInRadians) * canvas.height;
        gradient = ctx.createLinearGradient(0, 0, x2, y2);
        break;
        case 'radial':
        gradient = ctx.createRadialGradient(
            canvas.width / 2, canvas.height / 2, 0,
            canvas.width / 2, canvas.height / 2, canvas.width / 2
        );
        break;
        case 'conic':
        // For conic gradients, we need to manually draw segments
        // This is a simplified approximation
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(canvas.width, canvas.height) / 2;
        
        // Sort colors by position
        const sortedColors = [...gradientConfig.colors].sort((a, b) => a.position - b.position);
        
        // Draw conic gradient as circular segments
        for (let i = 0; i < sortedColors.length; i++) {
            const currentStop = sortedColors[i];
            const nextStop = sortedColors[i + 1];
            
            const startAngle = (currentStop.position / 100) * 2 * Math.PI;
            const endAngle = nextStop ? (nextStop.position / 100) * 2 * Math.PI : 2 * Math.PI;
            
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            ctx.closePath();
            ctx.fillStyle = currentStop.color;
            ctx.fill();
        }
        
        // Download the canvas as is
        const link = document.createElement('a');
        link.download = 'gradient-background.png';
        link.href = canvas.toDataURL();
        link.click();
        return; // Exit early since we've already drawn the conic gradient
        default:
        gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    }

    // Add color stops for linear and radial gradients
    if (gradientConfig.type === 'linear' || gradientConfig.type === 'radial') {
        gradientConfig.colors
        .sort((a, b) => a.position - b.position)
        .forEach(stop => {
            gradient.addColorStop(stop.position / 100, stop.color);
        });

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Download
    const link = document.createElement('a');
    link.download = 'gradient-background.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  const resetGradient = () => {
    setGradientConfig({
      type: 'linear',
      angle: 90,
      colors: [
        { id: '1', color: '#667eea', position: 0 },
        { id: '2', color: '#764ba2', position: 100 }
      ]
    });
  };

  const getGradientExamples = () => [
    {
        name: 'Ocean Blue',
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        colors: ['#667eea', '#764ba2']
    },
    {
        name: 'Sunset',
        gradient: 'linear-gradient(45deg, #ff6b6b 0%, #ffa726 50%, #ffeb3b 100%)',
        colors: ['#ff6b6b', '#ffa726', '#ffeb3b']
    },
    {
        name: 'Emerald',
        gradient: 'linear-gradient(120deg, #059669 0%, #10b981 50%, #34d399 100%)',
        colors: ['#059669', '#10b981', '#34d399']
    },
    {
        name: 'Radial Sunset',
        gradient: 'radial-gradient(circle, #ff6b6b 0%, #ffa726 50%, #ffeb3b 100%)',
        colors: ['#ff6b6b', '#ffa726', '#ffeb3b']
    },
    {
        name: 'Conic Rainbow',
        gradient: 'conic-gradient(from 0deg, #ff6b6b 0%, #ffa726 25%, #ffeb3b 50%, #10b981 75%, #667eea 100%)',
        colors: ['#ff6b6b', '#ffa726', '#ffeb3b', '#10b981', '#667eea']
    }
  ];

  const applyExample = (example: any) => {
    // Parse the example gradient to extract colors and positions
    const colorMatches = example.gradient.match(/#[a-fA-F0-9]{6}/g);
    
    // Extract positions from the gradient string
    const positionMatches = example.gradient.match(/(\d+)%/g);
    const positions = positionMatches ? positionMatches.map((p: string) => parseInt(p)) : [];
    
    const colors: ColorStop[] = colorMatches?.map((color: string, index: number) => ({
        id: (index + 1).toString(),
        color,
        position: positions[index] || index * (100 / (colorMatches.length - 1))
    })) || [];
    
    const type = example.gradient.includes('radial') ? 'radial' : 
                example.gradient.includes('conic') ? 'conic' : 'linear';
    
    // Extract angle from linear gradient examples
    let angle = 135; // default
    if (type === 'linear') {
        const angleMatch = example.gradient.match(/(\d+)deg/);
        angle = angleMatch ? parseInt(angleMatch[1]) : 135;
    } else if (type === 'conic') {
        // For conic gradients, extract the starting angle
        const angleMatch = example.gradient.match(/from\s+(\d+)deg/);
        angle = angleMatch ? parseInt(angleMatch[1]) : 0;
    }
    
    setGradientConfig({
        type,
        angle,
        colors
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Gradient Generator */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-emerald-100">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center mb-3">
                  <div className="bg-emerald-100 p-3 rounded-full">
                    <PaintBucket className="h-6 w-6 text-emerald-600" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  CSS Gradient Generator
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  Create beautiful CSS gradients with live preview
                </p>
              </div>

              {/* Gradient Type Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                    Gradient Type
                </label>
                
                {gradientConfig.type === 'conic' && (
                    <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                        <strong>Pro Tip:</strong> Conic gradients work best in Chrome, Edge, and Opera. 
                        If you don't see the gradient, try a different browser or use linear/radial gradients.
                    </p>
                    </div>
                )}
  
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { type: 'linear' as const, label: 'Linear', icon: '→' },
                    { type: 'radial' as const, label: 'Radial', icon: '●' },
                    { type: 'conic' as const, label: 'Conic', icon: '↻' },
                  ].map(({ type, label, icon }) => (
                    <button
                      key={type}
                      onClick={() => setGradientConfig(prev => ({ ...prev, type }))}
                      className={`flex items-center justify-center gap-2 p-3 rounded-lg border text-sm font-medium transition-colors ${
                        gradientConfig.type === type
                          ? 'bg-emerald-500 text-white border-emerald-500'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-lg">{icon}</span>
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Angle Control for Linear and Conic */}
              {(gradientConfig.type === 'linear' || gradientConfig.type === 'conic') && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Angle: {gradientConfig.angle}°
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={gradientConfig.angle}
                    onChange={(e) => setGradientConfig(prev => ({ 
                      ...prev, 
                      angle: parseInt(e.target.value) 
                    }))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-emerald"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0°</span>
                    <span>360°</span>
                  </div>
                </div>
              )}

              {/* Color Stops */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Color Stops
                  </label>
                  <button
                    onClick={addColorStop}
                    className="flex items-center gap-1 px-3 py-1 bg-emerald-500 text-white rounded text-sm hover:bg-emerald-600 transition-colors"
                  >
                    <Plus className="h-3 w-3" />
                    Add Color
                  </button>
                </div>

                <div className="space-y-3">
                  {gradientConfig.colors
                    .sort((a, b) => a.position - b.position)
                    .map((stop) => (
                    <div key={stop.id} className="flex items-center gap-3">
                      <input
                        type="color"
                        value={stop.color}
                        onChange={(e) => updateColorStop(stop.id, { color: e.target.value })}
                        className="w-12 h-12 cursor-pointer rounded border border-gray-300"
                      />
                      <div className="flex-1">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={stop.position}
                          onChange={(e) => updateColorStop(stop.id, { position: parseInt(e.target.value) })}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-emerald"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>0%</span>
                          <span>{stop.position}%</span>
                          <span>100%</span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeColorStop(stop.id)}
                        disabled={gradientConfig.colors.length <= 2}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gradient Preview */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Live Preview
                </label>
                <div
                  ref={previewRef}
                  className="w-full h-48 rounded-lg border-2 border-gray-200 shadow-inner"
                  style={{
                    background: getGradientCSS()
                  }}
                />
              </div>

              {/* CSS Output */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  CSS Code
                </label>
                <div className="bg-gray-800 rounded-lg p-4">
                  <pre className="text-green-400 text-sm overflow-x-auto">
                    {`background: ${getGradientCSS()};`}
                  </pre>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={resetGradient}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                >
                  <RotateCw className="h-4 w-4" />
                  Reset
                </button>
                <button
                  onClick={copyToClipboard}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                >
                  <Copy className="h-4 w-4" />
                  {copied ? 'Copied!' : 'Copy CSS'}
                </button>
                <button
                  onClick={downloadAsImage}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  Download PNG
                </button>
              </div>

              {/* Quick Examples */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Quick Examples
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {getGradientExamples().map((example, index) => (
                    <button
                      key={index}
                      onClick={() => applyExample(example)}
                      className="p-3 rounded-lg border border-gray-200 hover:border-emerald-300 transition-colors text-left"
                    >
                      <div
                        className="w-full h-12 rounded mb-2"
                        style={{ background: example.gradient }}
                      />
                      <p className="text-xs font-medium text-gray-800">{example.name}</p>
                      <div className="flex gap-1 mt-1">
                        {example.colors.map((color, colorIndex) => (
                          <div
                            key={colorIndex}
                            className="w-3 h-3 rounded border border-gray-200"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Info & Tips */}
          <div className="space-y-6">
            {/* Security Features */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-emerald-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Shield className="h-5 w-5 text-emerald-500 mr-2" />
                Security Features
              </h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start space-x-2">
                  <Zap className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Client-Side Processing</strong> - All generation happens in your browser</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Shield className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>No Data Stored</strong> - Your gradient designs never leave your device</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Code className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Instant Generation</strong> - Real-time CSS code preview</span>
                </li>
              </ul>
            </div>

            {/* Features */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-emerald-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-2">
                  <Palette className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Multiple Gradient Types</strong> - Linear, radial, and conic gradients</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Layout className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Live Preview</strong> - See your gradient in real-time</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Copy className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>CSS Code Output</strong> - Get ready-to-use CSS code</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Download className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>PNG Export</strong> - Download gradients as images</span>
                </div>
              </div>
            </div>

            {/* Use Cases */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-emerald-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Use Cases</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <h4 className="font-semibold text-blue-800 mb-1 flex items-center">
                    <Monitor className="h-4 w-4 mr-2" />
                    Website Backgrounds
                  </h4>
                  <ul className="space-y-1 text-blue-700">
                    <li>• Hero section backgrounds</li>
                    <li>• Page headers and footers</li>
                    <li>• Content sections</li>
                  </ul>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <h4 className="font-semibold text-green-800 mb-1 flex items-center">
                    <Layout className="h-4 w-4 mr-2" />
                    UI Elements
                  </h4>
                  <ul className="space-y-1 text-green-700">
                    <li>• Buttons and call-to-actions</li>
                    <li>• Cards and containers</li>
                    <li>• Progress bars and loaders</li>
                  </ul>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                  <h4 className="font-semibold text-purple-800 mb-1 flex items-center">
                    <Smartphone className="h-4 w-4 mr-2" />
                    Modern Design
                  </h4>
                  <ul className="space-y-1 text-purple-700">
                    <li>• App interfaces</li>
                    <li>• Brand elements</li>
                    <li>• Visual effects</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {gradientFaqItems.map((faq, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-emerald-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* SEO Content */}
        <div className="max-w-4xl mx-auto mt-12 prose prose-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Free CSS Gradient Generator
          </h2>
          
          <p className="text-gray-700 mb-4">
            Create stunning CSS gradients instantly with our free online gradient generator. 
            Design linear, radial, and conic gradients with unlimited color stops, real-time 
            preview, and ready-to-use CSS code. All processing happens securely in your browser.
          </p>

          <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
            Why Use CSS Gradients?
          </h3>
          <p className="text-gray-700 mb-4">
            CSS gradients are lightweight, scalable, and render perfectly on all devices. 
            Unlike image-based gradients, they load instantly, adapt to any screen size, 
            and can be easily modified without graphic design software.
          </p>

          <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
            Gradient Types Explained
          </h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Linear Gradients</strong> - Colors transition along a straight line, perfect for headers and backgrounds</li>
            <li><strong>Radial Gradients</strong> - Colors radiate from a center point, great for circular elements and focus points</li>
            <li><strong>Conic Gradients</strong> - Colors rotate around a center point, ideal for pie charts and color wheels</li>
          </ul>

          <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
            Best Practices for Gradient Design
          </h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Use 2-4 colors for clean, professional gradients</li>
            <li>Choose complementary colors for better visual harmony</li>
            <li>Test gradients on both light and dark text for readability</li>
            <li>Consider using subtle gradients for professional designs</li>
            <li>Use bold gradients for creative and attention-grabbing elements</li>
            <li>Always provide fallback colors for older browsers</li>
          </ul>
        </div>
      </div>

      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": gradientFaqItems.map(faq => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
              }
            }))
          })
        }}
      />

      {/* Custom slider styles */}
      <style jsx>{`
        .slider-emerald::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #10b981;
          cursor: pointer;
          border: 2px solid #fff;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .slider-emerald::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #10b981;
          cursor: pointer;
          border: 2px solid #fff;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
}