import { utilities } from '@/lib/constants';
import ToolCard from '@/components/ui/ToolCard';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata = {
  title: 'Image Tools - Format Converter, Base64, Resizer & Metadata Viewer | PassZap',
  description: 'Collection of image tools including format converter, Base64 encoder, resizer, and metadata viewer for easy image management',
  keywords: [ 'developer cheat sheets', 'bash one-liners', 'python snippets', 'sed awk commands', 'powershell commands',
              'programming reference', 'code snippets', 'system administration', 'automation scripts', 'productivity tools'],
  openGraph: {
    title: 'Image Tools - Format Converter, Base64, Resizer & Metadata Viewer | PassZap',
    description: 'Collection of image tools including format converter, Base64 encoder, resizer, and metadata viewer for easy image management',
    url: 'https://passzap.net/image-tools',
    siteName: 'PassZap',
    images: [
      {
        url: 'https://passzap.net/og-images/image-tools.png',
        width: 1200,
        height: 630,
        alt: 'Developer Cheat Sheets - PassZap',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Image Tools - Format Converter, Base64, Resizer & Metadata Viewer | PassZap',
    description: 'Collection of image tools including format converter, Base64 encoder, resizer, and metadata viewer for easy image management',
    images: ['https://passzap.net/og-images/cheatsheets-overview.png'],
  },
  alternates: {
    canonical: 'https://passzap.net/image-tools',
  },
};

export default function ImageToolsPage() {
   const cheatSheetUtilities = utilities.filter(utility => 
    utility.href.startsWith('/image-tools/')
  );  
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
          <Header />
          
          <main className="py-8">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Image Tools</h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    A suite of powerful image tools including format converter, Base64 encoder, resizer, and metadata viewer to help you manage and optimize your images with ease. Quickly convert formats, resize images, encode to Base64, and strip metadata for privacy.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {cheatSheetUtilities.map((sheet) => (
                  <ToolCard key={sheet.href} {...sheet} />
                ))}
              </div>

              <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">💡 Pro Tips</h3>
                <ul className="text-blue-700 space-y-2">
                  <li>Use the Image Format Converter to quickly switch between PNG, JPEG, and WebP formats for optimal web performance.</li>
                  <li>Leverage the Image Resizer to reduce file sizes without compromising quality, perfect for faster loading times.</li>
                  <li>Utilize the Image to Base64 Converter for embedding images directly into HTML or CSS files.</li>
                  <li>Ensure your privacy by using the Image Metadata Viewer to inspect and strip sensitive metadata from your images before sharing.</li>
                </ul>
              </div>
            </div>
          </main>
          <Footer />
          
          {/* FAQ Schema */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": imageToolsFaqItems.map(faq => ({
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

const imageToolsFaqItems = [
  {
    question: "What image formats does the Image Format Converter support?",
    answer: "The Image Format Converter supports popular formats including PNG, JPEG, and WebP, allowing you to easily switch between them for different use cases."
  },
  {
    question: "How does the Image Resizer help with web performance?",
    answer: "By reducing the dimensions and file size of images, the Image Resizer helps decrease load times on websites, leading to a better user experience and improved SEO."
  },
  {
    question: "When should I use the Image to Base64 Converter?",
    answer: "The Image to Base64 Converter is useful when you want to embed images directly into HTML or CSS files, reducing the number of HTTP requests and potentially speeding up page load times."
  },
  {
    question: "Why is it important to strip metadata from images?",
    answer: "Stripping metadata from images is crucial for privacy, as metadata can contain sensitive information such as location data, device details, and timestamps that you may not want to share publicly."
  }
];