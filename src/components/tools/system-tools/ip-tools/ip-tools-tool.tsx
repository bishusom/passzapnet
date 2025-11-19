// components/tools/network/ip-tools/ip-tools-tool.tsx
'use client';

import { useState, useEffect } from 'react';
import { 
  Globe, 
  MapPin, 
  Shield,
  Wifi,
  User,
  Building,
  Clock,
  Copy,
  CheckCircle,
  AlertCircle,
  Loader2,
  Navigation,
  Search
} from 'lucide-react';

interface IpApiResponse {
  status: string;
  country: string;
  countryCode: string;
  region: string;
  regionName: string;
  city: string;
  zip: string;
  lat: number;
  lon: number;
  timezone: string;
  isp: string;
  org: string;
  as: string;
  query: string;
}

export default function IpToolsTool() {
  const [ipAddress, setIpAddress] = useState('');
  const [lookupResult, setLookupResult] = useState<IpApiResponse | null>(null);
  const [myIpInfo, setMyIpInfo] = useState<IpApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [myIp, setMyIp] = useState<string>('');

  // Get user's public IP on component mount
  useEffect(() => {
    fetchMyIp();
  }, []);

  const fetchMyIp = async () => {
    try {
      const response = await fetch('https://ipwho.is/');
      const data = await response.json();
      if (data.success) {
        setMyIp(data.ip);
        setMyIpInfo({
          status: 'success',
          country: data.country,
          countryCode: data.country_code,
          region: data.region_code,
          regionName: data.region,
          city: data.city,
          zip: data.postal,
          lat: data.latitude,
          lon: data.longitude,
          timezone: data.timezone?.id,
          isp: data.connection?.isp,
          org: data.connection?.org,
          as: data.connection?.asn,
          query: data.ip
        });
      }
    } catch (error) {
      console.error('Failed to fetch IP:', error);
    }
  };

  const handleIpLookup = async (ip?: string) => {
    const targetIp = ip || ipAddress;
    if (!targetIp) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://ipwho.is/${targetIp}`);
      const data = await response.json();
      
      if (data.success) {
        setLookupResult({
          status: 'success',
          country: data.country,
          countryCode: data.country_code,
          region: data.region_code,
          regionName: data.region,
          city: data.city,
          zip: data.postal,
          lat: data.latitude,
          lon: data.longitude,
          timezone: data.timezone?.id,
          isp: data.connection?.isp,
          org: data.connection?.org,
          as: data.connection?.asn,
          query: data.ip
        });
      } else {
        setError(data.message || 'IP lookup failed');
      }
    } catch (error) {
      setError('Network error occurred. Please try again.');
      console.error('IP lookup failed:', error);
    } finally {
      setLoading(false);
    }
  };


  const validateIpFormat = (ip: string) => {
    if (!ip) {
      alert('❌ Please enter an IP address first');
      return false;
    }
    
    const isValid = /^(\d{1,3}\.){3}\d{1,3}$/.test(ip);
    if (isValid) {
      // Additional validation for each octet
      const parts = ip.split('.');
      const validParts = parts.every(part => {
        const num = parseInt(part);
        return num >= 0 && num <= 255;
      });
      
      if (validParts) {
        alert('✅ Valid IP address format');
        return true;
      }
    }
    
    alert('❌ Invalid IP address format');
    return false;
  };

  const copyToClipboard = (text: string) => {
    if (!text) {
      alert('❌ No IP address to copy');
      return;
    }
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const commonIps = [
    { name: 'Google DNS', ip: '8.8.8.8' },
    { name: 'Cloudflare DNS', ip: '1.1.1.1' },
    { name: 'OpenDNS', ip: '208.67.222.222' },
    { name: 'Your Router', ip: '192.168.1.1' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <main className="py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl shadow-lg mb-4">
              <Globe className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              IP Address Lookup & Information
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover your IP address, check geolocation, and get detailed information 
              about any IP address. Protect your privacy and understand your digital footprint.
            </p>
          </div>

          {/* My IP Address Card */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-emerald-100 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <User className="h-6 w-6 text-emerald-500 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Your Public IP Address</h2>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-emerald-500" />
                <span className="text-sm text-emerald-600 font-medium">Live Information</span>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
                <div className="text-3xl font-mono font-bold text-emerald-600 mb-3">
                  {myIp || 'Loading...'}
                </div>
                <p className="text-gray-600 mb-4">This is your public IP address visible to websites and services</p>
                <button
                  onClick={() => copyToClipboard(myIp)}
                  disabled={!myIp}
                  className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium"
                >
                  {copied ? 'Copied!' : 'Copy IP'}
                </button>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Location:</span>
                  <span className="font-medium text-right">
                    {myIpInfo?.city || 'Unknown'}, {myIpInfo?.country || 'Unknown'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">ISP:</span>
                  <span className="font-medium">{myIpInfo?.isp || 'Unknown'}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium text-emerald-600">Public IP</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content - 2/3 width */}
            <div className="lg:col-span-2 space-y-8">
              {/* IP Lookup Tool */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-teal-100">
                <div className="flex items-center mb-6">
                  <Search className="h-6 w-6 text-teal-500 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">IP Address Lookup</h2>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Enter IP Address to Lookup
                    </label>
                    <input
                      type="text"
                      value={ipAddress}
                      onChange={(e) => setIpAddress(e.target.value)}
                      placeholder="Enter any IP address (e.g., 8.8.8.8)"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => {
                        if (ipAddress) {
                          handleIpLookup(ipAddress);
                        } else {
                          alert('❌ Please enter an IP address first');
                        }
                      }}
                      disabled={loading}
                      className="bg-teal-500 hover:bg-teal-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium flex items-center"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Looking up...
                        </>
                      ) : (
                        'Lookup IP'
                      )}
                    </button>

                    <button
                      onClick={() => validateIpFormat(ipAddress)}
                      className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg font-medium"
                    >
                      Validate Format
                    </button>

                    <button
                      onClick={() => copyToClipboard(ipAddress)}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium"
                    >
                      {copied ? 'Copied!' : 'Copy IP'}
                    </button>
                  </div>

                  {/* Quick IP Buttons */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quick Lookup:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {commonIps.map((commonIp, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setIpAddress(commonIp.ip);
                            handleIpLookup(commonIp.ip);
                          }}
                          className="px-3 py-2 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg text-teal-700 text-sm font-medium transition-colors"
                        >
                          {commonIp.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {loading && (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 text-teal-500 animate-spin mr-3" />
                      <span className="text-teal-600">Looking up IP address information...</span>
                    </div>
                  )}

                  {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
                      <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
                      <span className="text-red-700">{error}</span>
                    </div>
                  )}

                  {lookupResult && ipAddress && (
                    <div className="mt-6 p-6 bg-gray-50 rounded-xl border border-teal-200">
                      <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                        <CheckCircle className="h-5 w-5 text-teal-500 mr-2" />
                        Lookup Results for {lookupResult.query}
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600 flex items-center">
                              <MapPin className="h-4 w-4 mr-2" />
                              Location:
                            </span>
                            <span className="font-medium text-right">
                              {lookupResult.city}, {lookupResult.regionName}<br />
                              <span className="text-sm text-gray-500">{lookupResult.country}</span>
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 flex items-center">
                              <Building className="h-4 w-4 mr-2" />
                              ISP:
                            </span>
                            <span className="font-medium">{lookupResult.isp}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 flex items-center">
                              <User className="h-4 w-4 mr-2" />
                              Organization:
                            </span>
                            <span className="font-medium">{lookupResult.org}</span>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600 flex items-center">
                              <Clock className="h-4 w-4 mr-2" />
                              Timezone:
                            </span>
                            <span className="font-medium">{lookupResult.timezone}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">ZIP Code:</span>
                            <span className="font-medium">{lookupResult.zip}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Coordinates:</span>
                            <span className="font-medium">{lookupResult.lat}, {lookupResult.lon}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* IP Information Section */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-cyan-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">About IP Addresses</h2>
                <div className="prose prose-emerald max-w-none">
                  <h3>What is an IP Address?</h3>
                  <p>An IP (Internet Protocol) address is a unique numerical identifier assigned to every device connected to a network. It serves two main functions:</p>
                  <ul>
                    <li><strong>Network Interface Identification:</strong> Identifies your device on the network</li>
                    <li><strong>Location Addressing:</strong> Provides information about your geographic location</li>
                  </ul>

                  <h3>IPv4 vs IPv6</h3>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="p-4 bg-emerald-50 rounded-lg">
                      <h4 className="font-semibold text-emerald-700">IPv4</h4>
                      <p className="text-sm">32-bit address (e.g., 192.168.1.1)<br />4.3 billion possible addresses</p>
                    </div>
                    <div className="p-4 bg-teal-50 rounded-lg">
                      <h4 className="font-semibold text-teal-700">IPv6</h4>
                      <p className="text-sm">128-bit address (e.g., 2001:0db8:85a3::)<br />340 undecillion possible addresses</p>
                    </div>
                  </div>

                  <h3>Protecting Your IP Privacy</h3>
                  <p>Your IP address can reveal your approximate location and internet service provider. To protect your privacy:</p>
                  <ul>
                    <li>Use a VPN (Virtual Private Network)</li>
                    <li>Enable proxy servers</li>
                    <li>Use Tor browser for anonymous browsing</li>
                    <li>Avoid public Wi-Fi for sensitive activities</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Sidebar - 1/3 width */}
            <div className="space-y-6">
              {/* Quick Tools */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-emerald-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Wifi className="h-5 w-5 text-emerald-500 mr-2" />
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      setIpAddress(myIp);
                      handleIpLookup(myIp);
                    }}
                    className="w-full text-left p-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
                  >
                    <div className="font-medium text-emerald-700">Lookup My IP</div>
                    <div className="text-sm text-emerald-600">Get detailed information about your current IP</div>
                  </button>
                  
                  <button
                    onClick={() => {
                      setIpAddress('');
                      setLookupResult(null);
                    }}
                    className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors"
                  >
                    <div className="font-medium text-gray-700">Clear Search</div>
                    <div className="text-sm text-gray-600">Reset the lookup tool</div>
                  </button>
                </div>
              </div>

              {/* VPN & Security Info */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-teal-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Shield className="h-5 w-5 text-teal-500 mr-2" />
                  VPN & Security
                </h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-teal-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <span><strong>Hide Your Location:</strong> VPNs mask your real IP address</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-teal-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <span><strong>Encrypt Traffic:</strong> Protect your data from eavesdroppers</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-teal-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <span><strong>Bypass Restrictions:</strong> Access geo-blocked content</span>
                  </div>
                </div>
              </div>

              {/* IP Types Info */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-cyan-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Navigation className="h-5 w-5 text-cyan-500 mr-2" />
                  IP Address Types
                </h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div>
                    <strong className="text-cyan-700">Public IP</strong>
                    <p>Visible to the internet, assigned by your ISP</p>
                  </div>
                  <div>
                    <strong className="text-cyan-700">Private IP</strong>
                    <p>Used within local networks (e.g., 192.168.x.x)</p>
                  </div>
                  <div>
                    <strong className="text-cyan-700">Static IP</strong>
                    <p>Permanent address that doesn't change</p>
                  </div>
                  <div>
                    <strong className="text-cyan-700">Dynamic IP</strong>
                    <p>Temporary address that can change</p>
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
              {ipFaqItems.map((faq, index) => (
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

const ipFaqItems = [
  {
    question: "Can someone find my exact location with my IP address?",
    answer: "No, IP addresses typically only reveal your approximate location (city or region level), not your exact physical address. The accuracy depends on your ISP's data."
  },
  {
    question: "Is it safe to share my IP address?",
    answer: "Generally yes, but avoid sharing it with untrusted parties. Your IP is already visible to every website you visit. For enhanced privacy, consider using a VPN."
  },
  {
    question: "Why does my IP address change?",
    answer: "Most residential ISPs assign dynamic IP addresses that change periodically. Business connections often have static IPs that remain constant."
  },
  {
    question: "What's the difference between IPv4 and IPv6?",
    answer: "IPv4 uses 32-bit addresses (4.3 billion possible) while IPv6 uses 128-bit addresses (virtually unlimited). IPv6 was created to address IPv4 exhaustion and offers better security features."
  },
  {
    question: "Can I hide my IP address?",
    answer: "Yes, using VPNs, proxy servers, or the Tor browser can mask your real IP address and enhance your online privacy."
  },
  {
    question: "Why do websites block IP addresses?",
    answer: "Websites may block IPs due to security threats, spam, geographic restrictions, or to enforce access controls. VPNs can often bypass these blocks."
  }
];