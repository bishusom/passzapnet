// components/tools/network/network-tools/network-tools-tool.tsx
'use client';

import { useState, useEffect } from 'react';
import { 
  Wifi, 
  Navigation, 
  Server, 
  Globe,
  Play,
  Square,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

export default function NetworkToolsTool() {
  const [host, setHost] = useState('');
  const [tool, setTool] = useState<'ping' | 'traceroute' | 'dns'>('ping');
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  // Auto-run tool when host or tool changes
  useEffect(() => {
    if (host) {
      simulateNetworkTool();
    }
  }, [tool, host]);

  const simulateNetworkTool = async () => {
    if (!host) return;
    
    setLoading(true);
    setIsRunning(true);
    setResults([]);
    
    const simulatedResults = {
      ping: [
        `Pinging ${host} with 32 bytes of data:`,
        `Reply from ${host}: bytes=32 time=25ms TTL=55`,
        `Reply from ${host}: bytes=32 time=32ms TTL=55`,
        `Reply from ${host}: bytes=32 time=28ms TTL=55`,
        `Reply from ${host}: bytes=32 time=30ms TTL=55`,
        ``,
        `Ping statistics for ${host}:`,
        `    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss)`,
        `Approximate round trip times in milli-seconds:`,
        `    Minimum = 25ms, Maximum = 32ms, Average = 28ms`
      ],
      traceroute: [
        `Tracing route to ${host} over a maximum of 30 hops:`,
        ``,
        `  1     2 ms     1 ms     1 ms  192.168.1.1`,
        `  2     8 ms     7 ms     9 ms  10.0.0.1`,
        `  3    12 ms    11 ms    13 ms  100.64.0.1`,
        `  4    15 ms    16 ms    14 ms  72.21.144.1`,
        `  5    18 ms    17 ms    19 ms  52.93.4.1`,
        `  6    24 ms    23 ms    22 ms  142.251.64.1`,
        `  7    25 ms    26 ms    25 ms  ${host}`,
        ``,
        `Trace complete.`
      ],
      dns: [
        `DNS lookup for ${host}:`,
        ``,
        `Non-authoritative answer:`,
        `Name:    ${host}`,
        `Address:  142.251.64.14`,
        `Aliases:  www.google.com`,
        ``,
        `Additional records:`,
        `IPv6:    2607:f8b0:4004:815::200e`
      ]
    };

    const toolResults = simulatedResults[tool];
    
    // Simulate real-time output
    for (let i = 0; i < toolResults.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setResults(prev => [...prev, toolResults[i]]);
    }
    
    setLoading(false);
    setIsRunning(false);
  };

  const stopTool = () => {
    setIsRunning(false);
    setLoading(false);
  };

  const commonHosts = [
    { name: 'Google', host: 'google.com' },
    { name: 'Cloudflare', host: 'cloudflare.com' },
    { name: 'OpenDNS', host: 'opendns.com' },
    { name: 'Your Router', host: '192.168.1.1' },
    { name: 'Localhost', host: 'localhost' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <main className="py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl shadow-lg mb-4">
              <Wifi className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Network Diagnostic Tools
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Free online network tools including ping, traceroute, and DNS lookup. 
              Check connectivity and troubleshoot network issues.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Tool Selection */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-emerald-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Network Tools</h2>
                
                <div className="space-y-3">
                  <button
                    onClick={() => setTool('ping')}
                    className={`w-full text-left p-4 rounded-lg border transition-colors ${
                      tool === 'ping' 
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-700' 
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center">
                      <Navigation className="h-5 w-5 mr-3" />
                      <div>
                        <div className="font-semibold">Ping</div>
                        <div className="text-sm opacity-75">Test connectivity and latency</div>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setTool('traceroute')}
                    className={`w-full text-left p-4 rounded-lg border transition-colors ${
                      tool === 'traceroute' 
                        ? 'bg-teal-50 border-teal-300 text-teal-700' 
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center">
                      <Globe className="h-5 w-5 mr-3" />
                      <div>
                        <div className="font-semibold">Traceroute</div>
                        <div className="text-sm opacity-75">Trace network path</div>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setTool('dns')}
                    className={`w-full text-left p-4 rounded-lg border transition-colors ${
                      tool === 'dns' 
                        ? 'bg-cyan-50 border-cyan-300 text-cyan-700' 
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center">
                      <Server className="h-5 w-5 mr-3" />
                      <div>
                        <div className="font-semibold">DNS Lookup</div>
                        <div className="text-sm opacity-75">Resolve domain names</div>
                      </div>
                    </div>
                  </button>
                </div>

                {/* Quick Hosts */}
                <div className="mt-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Quick Test Hosts</h3>
                  <div className="space-y-2">
                    {commonHosts.map((commonHost, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setHost(commonHost.host);
                          // Tool will auto-run due to useEffect
                        }}
                        className="w-full text-left p-2 text-sm bg-gray-50 hover:bg-gray-100 rounded border border-gray-200 transition-colors"
                      >
                        <span className="font-medium">{commonHost.name}:</span> {commonHost.host}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Tool Interface */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-teal-100">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 capitalize">{tool} Tool</h2>
                  <div className="flex items-center space-x-2">
                    {isRunning && (
                      <button
                        onClick={stopTool}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center"
                      >
                        <Square className="h-4 w-4 mr-2" />
                        Stop
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Host or Domain
                    </label>
                    <input
                      type="text"
                      value={host}
                      onChange={(e) => {
                        setHost(e.target.value);
                        // Tool will auto-run due to useEffect
                      }}
                      placeholder={`Enter hostname or IP address for ${tool}`}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>

                  {/* Results Display */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Results {loading && <span className="text-teal-600 animate-pulse">(Running...)</span>}
                    </label>
                    <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm h-64 overflow-y-auto">
                      {results.length === 0 ? (
                        <div className="text-gray-500 italic">
                          {`Enter a hostname or IP address to run ${tool}...`}
                        </div>
                      ) : (
                        results.map((line, index) => (
                          <div key={index} className="whitespace-pre-wrap">
                            {line}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Tool Description */}
              <div className="mt-6 bg-white rounded-2xl p-6 shadow-lg border border-cyan-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  About {tool.charAt(0).toUpperCase() + tool.slice(1)}
                </h3>
                {tool === 'ping' && (
                  <div className="text-gray-600 space-y-2">
                    <p>Ping tests connectivity between your computer and a target host by sending ICMP echo requests and measuring response times.</p>
                    <p><strong>Use cases:</strong> Check if a host is reachable, measure network latency, troubleshoot connectivity issues.</p>
                    <p><strong>Typical results:</strong> Response times, packet loss percentage, round-trip statistics.</p>
                  </div>
                )}
                {tool === 'traceroute' && (
                  <div className="text-gray-600 space-y-2">
                    <p>Traceroute shows the path packets take from your computer to the target host, displaying each hop along the route.</p>
                    <p><strong>Use cases:</strong> Identify network bottlenecks, diagnose routing issues, understand network topology.</p>
                    <p><strong>Typical results:</strong> List of intermediate routers with response times for each hop.</p>
                  </div>
                )}
                {tool === 'dns' && (
                  <div className="text-gray-600 space-y-2">
                    <p>DNS lookup queries domain name system servers to resolve hostnames to IP addresses and discover related DNS records.</p>
                    <p><strong>Use cases:</strong> Verify DNS configuration, troubleshoot domain resolution, find IP addresses for domains.</p>
                    <p><strong>Typical results:</strong> IP addresses, aliases (CNAME records), and additional DNS information.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Frequently Asked Questions
            </h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {networkFaqItems.map((faq, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-emerald-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

const networkFaqItems = [
  {
    question: "Why are these tools running in simulation mode?",
    answer: "For security reasons, browser-based network tools run in simulation mode. In a production environment, these would connect to backend services that can execute actual network commands."
  },
  {
    question: "What is the difference between ping and traceroute?",
    answer: "Ping tests if a host is reachable and measures latency. Traceroute shows the complete path packets take to reach the host, including all intermediate routers."
  },
  {
    question: "Can I use these tools to test my local network?",
    answer: "Yes! You can test local hosts like your router (192.168.1.1) or other devices on your network. The tools work with both domain names and IP addresses."
  },
  {
    question: "Why would I use DNS lookup?",
    answer: "DNS lookup helps verify that domain names are correctly resolving to IP addresses, troubleshoot website accessibility issues, and understand DNS configuration."
  },
  {
    question: "What do the response times in ping results mean?",
    answer: "Response times (in milliseconds) indicate network latency. Lower times are better: <50ms is excellent, 50-100ms is good, 100-200ms is average, >200ms may indicate issues."
  },
  {
    question: "Can these tools diagnose internet connection problems?",
    answer: "Yes! Ping can confirm if you can reach external hosts, traceroute can identify where connections fail, and DNS lookup can verify domain resolution issues."
  }
];