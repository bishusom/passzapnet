// components/tools/QrCodeGenerator.tsx
'use client';

import { useState, useEffect } from 'react';
import { 
  QrCode, 
  Download, 
  Copy, 
  Wifi, 
  User,
  Mail,
  Phone,
  Link,
  Text,
  Palette,
  RefreshCw,
  Sparkles,
  Shield,
  Zap,
  Scan
} from 'lucide-react';
import QRCode from 'qrcode';

type QrCodeType = 'url' | 'text' | 'wifi' | 'contact' | 'email' | 'phone';

interface WiFiConfig {
  ssid: string;
  password: string;
  encryption: 'WPA' | 'WEP' | 'nopass';
}

interface ContactInfo {
  name: string;
  company: string;
  phone: string;
  email: string;
  website: string;
}

export default function QrCodeGenerator() {
  const [content, setContent] = useState<string>('passzap.net');
  const [qrType, setQrType] = useState<QrCodeType>('url');
  const [size, setSize] = useState<number>(256);
  const [foregroundColor, setForegroundColor] = useState<string>('#000000');
  const [backgroundColor, setBackgroundColor] = useState<string>('#ffffff');
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [hasGenerated, setHasGenerated] = useState<boolean>(false);
  const [wifiConfig, setWifiConfig] = useState<WiFiConfig>({
    ssid: '',
    password: '',
    encryption: 'WPA'
  });
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    name: '',
    company: '',
    phone: '',
    email: '',
    website: ''
  });

  // FAQ items
  const qrCodeFaqItems = [
    {
      question: "Is there a limit to how much data a QR code can store?",
      answer: "QR codes can store up to 4,296 alphanumeric characters or 2,953 bytes of binary data. For most use cases like URLs, contact info, or WiFi credentials, this is more than sufficient."
    },
    {
      question: "Can I customize the colors of my QR code?",
      answer: "Yes! Our generator allows you to choose any colors for both the foreground (dots) and background. We recommend using high-contrast colors for better scannability."
    },
    {
      question: "What's the difference between PNG and SVG downloads?",
      answer: "PNG is a raster format ideal for web use and printing. SVG is a vector format that can be scaled to any size without quality loss, perfect for logos and designs."
    },
    {
      question: "Are the generated QR codes scannable by all devices?",
      answer: "Yes, our QR codes follow the standard QR code specification and are compatible with all modern smartphones and QR code scanner apps."
    },
    {
      question: "Can I generate QR codes for WiFi networks?",
      answer: "Absolutely! Use the WiFi option to generate QR codes that automatically connect devices to your WiFi network when scanned."
    },
    {
      question: "Is my data secure when generating QR codes?",
      answer: "Yes! All QR code generation happens entirely in your browser. We never send your data to our servers or store it anywhere. Your information remains completely private."
    }
  ];

  // Generate QR code
  const generateQRCode = async () => {
    const finalContent = getFinalContent();
    if (!finalContent.trim()) {
      alert('Please enter some content to generate QR code');
      return;
    }

    setIsGenerating(true);
    setHasGenerated(true);
    
    try {
      const url = await QRCode.toDataURL(finalContent, {
        width: size,
        margin: 2,
        color: {
          dark: foregroundColor,
          light: backgroundColor,
        },
      });
      
      setQrCodeUrl(url);
      console.log('QR Code generated successfully!');
    } catch (error) {
      console.error('Error generating QR code:', error);
      alert('Error generating QR code. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Get final content based on type
  const getFinalContent = (): string => {
    switch (qrType) {
      case 'wifi':
        return `WIFI:S:${wifiConfig.ssid};T:${wifiConfig.encryption};P:${wifiConfig.password};;`;
      case 'contact':
        return `BEGIN:VCARD\nVERSION:3.0\nFN:${contactInfo.name}\nORG:${contactInfo.company}\nTEL:${contactInfo.phone}\nEMAIL:${contactInfo.email}\nURL:${contactInfo.website}\nEND:VCARD`;
      case 'email':
        return content ? `mailto:${content}` : '';
      case 'phone':
        return content ? `tel:${content}` : '';
      case 'url':
        return content ? (content.startsWith('http') ? content : `https://${content}`) : '';
      case 'text':
        return content;
      default:
        return content;
    }
  };

  const downloadQRCode = () => {
    if (!qrCodeUrl) return;

    const link = document.createElement('a');
    link.download = `qrcode-${qrType}-${Date.now()}.png`;
    link.href = qrCodeUrl;
    link.click();
  };

  const copyQRCode = async () => {
    if (!qrCodeUrl) return;

    try {
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob
        })
      ]);
      alert('QR code copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy QR code: ', err);
      alert('Failed to copy QR code. Download instead.');
      downloadQRCode();
    }
  };

  const resetForm = () => {
    setContent('passzap.net');
    setQrCodeUrl('');
    setHasGenerated(false);
    setWifiConfig({ ssid: '', password: '', encryption: 'WPA' });
    setContactInfo({ name: '', company: '', phone: '', email: '', website: '' });
  };

  const getPlaceholder = (type: QrCodeType): string => {
    switch (type) {
      case 'url': return 'example.com';
      case 'text': return 'Enter any text...';
      case 'email': return 'email@example.com';
      case 'phone': return '+1234567890';
      case 'wifi': return 'Enter WiFi details below';
      case 'contact': return 'Enter contact details below';
      default: return 'Enter content...';
    }
  };

  const isFormValid = (): boolean => {
    const finalContent = getFinalContent();
    if (!finalContent.trim()) return false;

    if (qrType === 'wifi') {
      return wifiConfig.ssid.trim() !== '';
    }
    
    if (qrType === 'contact') {
      return contactInfo.name.trim() !== '' || contactInfo.email.trim() !== '' || contactInfo.phone.trim() !== '';
    }

    return content.trim() !== '';
  };

  // Auto-generate when type changes to show default content
  useEffect(() => {
    if (content && !hasGenerated) {
      generateQRCode();
    }
  }, [qrType]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Generator */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-emerald-100">
              {/* Header */}
              <div className="text-center mb-6">
                <div className="flex items-center justify-center mb-3">
                  <div className="bg-emerald-100 p-3 rounded-full">
                    <QrCode className="h-6 w-6 text-emerald-600" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  QR Code Generator
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  Create custom QR codes instantly
                </p>
              </div>

              <div className="flex flex-col lg:flex-row gap-8">
                {/* Left Column - Controls */}
                <div className="flex-1 space-y-6">
                  {/* QR Type Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      QR Code Type
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {[
                        { type: 'url' as QrCodeType, label: 'URL', icon: <Link className="h-4 w-4" /> },
                        { type: 'text' as QrCodeType, label: 'Text', icon: <Text className="h-4 w-4" /> },
                        { type: 'wifi' as QrCodeType, label: 'WiFi', icon: <Wifi className="h-4 w-4" /> },
                        { type: 'contact' as QrCodeType, label: 'Contact', icon: <User className="h-4 w-4" /> },
                        { type: 'email' as QrCodeType, label: 'Email', icon: <Mail className="h-4 w-4" /> },
                        { type: 'phone' as QrCodeType, label: 'Phone', icon: <Phone className="h-4 w-4" /> },
                      ].map(({ type, label, icon }) => (
                        <button
                          key={type}
                          onClick={() => setQrType(type)}
                          className={`flex items-center justify-center gap-2 p-3 rounded-lg border text-sm font-medium transition-colors ${
                            qrType === type
                              ? 'bg-emerald-500 text-white border-emerald-500'
                              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {icon}
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Content Input */}
                  {qrType !== 'wifi' && qrType !== 'contact' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {qrType === 'url' ? 'Website URL' : 
                         qrType === 'email' ? 'Email Address' :
                         qrType === 'phone' ? 'Phone Number' : 'Text Content'}
                      </label>
                      <input
                        type="text"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder={getPlaceholder(qrType)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>
                  )}

                  {/* WiFi Configuration */}
                  {qrType === 'wifi' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Network Name (SSID) *
                        </label>
                        <input
                          type="text"
                          value={wifiConfig.ssid}
                          onChange={(e) => setWifiConfig(prev => ({ ...prev, ssid: e.target.value }))}
                          placeholder="MyWiFiNetwork"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Password
                        </label>
                        <input
                          type="password"
                          value={wifiConfig.password}
                          onChange={(e) => setWifiConfig(prev => ({ ...prev, password: e.target.value }))}
                          placeholder="WiFi password"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Encryption Type
                        </label>
                        <select
                          value={wifiConfig.encryption}
                          onChange={(e) => setWifiConfig(prev => ({ ...prev, encryption: e.target.value as 'WPA' | 'WEP' | 'nopass' }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        >
                          <option value="WPA">WPA/WPA2</option>
                          <option value="WEP">WEP</option>
                          <option value="nopass">No Encryption</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Contact Information */}
                  {qrType === 'contact' && (
                    <div className="space-y-4">
                      {[
                        { key: 'name' as keyof ContactInfo, label: 'Full Name', placeholder: 'John Doe', required: false },
                        { key: 'company' as keyof ContactInfo, label: 'Company', placeholder: 'Acme Inc', required: false },
                        { key: 'phone' as keyof ContactInfo, label: 'Phone', placeholder: '+1 234 567 8900', required: false },
                        { key: 'email' as keyof ContactInfo, label: 'Email', placeholder: 'john@example.com', required: false },
                        { key: 'website' as keyof ContactInfo, label: 'Website', placeholder: 'https://example.com', required: false },
                      ].map(({ key, label, placeholder, required }) => (
                        <div key={key}>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {label} {required && <span className="text-red-500">*</span>}
                          </label>
                          <input
                            type="text"
                            value={contactInfo[key]}
                            onChange={(e) => setContactInfo(prev => ({ ...prev, [key]: e.target.value }))}
                            placeholder={placeholder}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Customization Options */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <Palette className="h-5 w-5 text-emerald-500" />
                      Customization
                    </h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Size: {size}px
                      </label>
                      <input
                        type="range"
                        min="128"
                        max="512"
                        step="32"
                        value={size}
                        onChange={(e) => setSize(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>128px</span>
                        <span>512px</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          QR Color
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={foregroundColor}
                            onChange={(e) => setForegroundColor(e.target.value)}
                            className="w-12 h-12 cursor-pointer rounded border border-gray-300"
                          />
                          <input
                            type="text"
                            value={foregroundColor}
                            onChange={(e) => setForegroundColor(e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-mono text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Background
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={backgroundColor}
                            onChange={(e) => setBackgroundColor(e.target.value)}
                            className="w-12 h-12 cursor-pointer rounded border border-gray-300"
                          />
                          <input
                            type="text"
                            value={backgroundColor}
                            onChange={(e) => setBackgroundColor(e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-mono text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Generate Button */}
                  <div className="pt-4">
                    <button
                      onClick={generateQRCode}
                      disabled={!isFormValid() || isGenerating}
                      className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isGenerating ? (
                        <>
                          <RefreshCw className="h-5 w-5 animate-spin" />
                          Generating QR Code...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-5 w-5" />
                          Generate QR Code
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Right Column - Preview */}
                <div className="flex-1 flex flex-col items-center justify-start lg:pt-0">
                  <div className="bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-200 w-full max-w-md min-h-[300px] flex items-center justify-center">
                    {isGenerating ? (
                      <div className="flex flex-col items-center gap-3">
                        <RefreshCw className="h-8 w-8 text-emerald-500 animate-spin" />
                        <p className="text-gray-600">Generating QR code...</p>
                      </div>
                    ) : qrCodeUrl ? (
                      <div className="text-center">
                        <img 
                          src={qrCodeUrl} 
                          alt="Generated QR Code" 
                          className="max-w-full h-auto border border-gray-200 rounded shadow-sm mx-auto"
                          width={size}
                          height={size}
                        />
                        <p className="text-sm text-gray-600 mt-3">
                          Scan this QR code with your phone's camera
                        </p>
                      </div>
                    ) : (
                      <div className="text-center text-gray-500">
                        <QrCode className="h-16 w-16 mx-auto mb-3 opacity-50" />
                        <p>{
                          qrType === 'url' && !content ? 'Enter a website URL above' :
                          qrType === 'email' && !content ? 'Enter an email address above' :
                          qrType === 'phone' && !content ? 'Enter a phone number above' :
                          qrType === 'text' && !content ? 'Enter text content above' :
                          qrType === 'wifi' && !wifiConfig.ssid ? 'Enter WiFi details above' :
                          qrType === 'contact' && !contactInfo.name && !contactInfo.email && !contactInfo.phone ? 'Enter contact details above' :
                          'Click "Generate QR Code" to create your QR code'
                        }</p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  {qrCodeUrl && (
                    <div className="flex gap-3 mt-6 w-full max-w-md">
                      <button
                        onClick={resetForm}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                      >
                        <RefreshCw className="h-4 w-4" />
                        Reset
                      </button>
                      <button
                        onClick={downloadQRCode}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </button>
                      <button
                        onClick={copyQRCode}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        <Copy className="h-4 w-4" />
                        Copy
                      </button>
                    </div>
                  )}

                  {/* Preview Info */}
                  {qrCodeUrl && (
                    <div className="mt-4 text-center text-sm text-gray-600">
                      <p>Size: {size} × {size} pixels</p>
                      <p>Type: {qrType.toUpperCase()}</p>
                    </div>
                  )}
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
                  <span><strong>Client-Side Generation</strong> - All QR codes created in your browser</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Shield className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>No Data Stored</strong> - Your content never leaves your device</span>
                </li>
                <li className="flex items-start space-x-2">
                  <QrCode className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Instant Generation</strong> - Real-time QR code preview</span>
                </li>
              </ul>
            </div>

            {/* Features */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-emerald-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-2">
                  <Palette className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Custom Colors</strong> - Choose any foreground and background colors</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Download className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Multiple Formats</strong> - Download as PNG or SVG</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Scan className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>High Quality</strong> - Crisp, scalable QR codes</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Copy className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Multiple Types</strong> - URLs, text, WiFi, contact info, and more</span>
                </div>
              </div>
            </div>

            {/* Use Cases */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-emerald-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Use Cases</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <h4 className="font-semibold text-blue-800 mb-1">🌐 Websites & Links</h4>
                  <ul className="space-y-1 text-blue-700">
                    <li>• Share website URLs</li>
                    <li>• Social media profiles</li>
                    <li>• Download links</li>
                  </ul>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <h4 className="font-semibold text-green-800 mb-1">📱 Mobile & Business</h4>
                  <ul className="space-y-1 text-green-700">
                    <li>• WiFi network sharing</li>
                    <li>• Contact information</li>
                    <li>• Event details</li>
                  </ul>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                  <h4 className="font-semibold text-purple-800 mb-1">🎨 Marketing</h4>
                  <ul className="space-y-1 text-purple-700">
                    <li>• Business cards</li>
                    <li>• Flyers and posters</li>
                    <li>• Product packaging</li>
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
            {qrCodeFaqItems.map((faq, index) => (
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
            Free Online QR Code Generator
          </h2>
          
          <p className="text-gray-700 mb-4">
            Create professional QR codes instantly with our free online generator. 
            Whether you need to share website links, contact information, WiFi credentials, 
            or any other data, our tool provides high-quality, customizable QR codes with 
            complete client-side processing for maximum privacy.
          </p>

          <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
            What Are QR Codes?
          </h3>
          <p className="text-gray-700 mb-4">
            QR (Quick Response) codes are two-dimensional barcodes that can store various types 
            of information. They're widely used for sharing URLs, contact details, product information, 
            and more. QR codes can be scanned by smartphone cameras, making them incredibly convenient 
            for mobile users.
          </p>

          <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
            Best Practices for QR Codes
          </h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Use high contrast colors for better scannability</li>
            <li>Test your QR code with multiple devices before distribution</li>
            <li>Include a call-to-action near the QR code</li>
            <li>Ensure sufficient quiet zone (white space) around the code</li>
            <li>Choose appropriate size for your use case (larger for distance scanning)</li>
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
            "mainEntity": qrCodeFaqItems.map(faq => ({
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
    </div>
  );
}