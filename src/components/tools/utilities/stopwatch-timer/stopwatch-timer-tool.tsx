// components/tools/utilities/stopwatch-timer/stopwatch-timer-tool.tsx
'use client';

import CountdownTimer from './CountdownTimer';
import { 
  Clock, 
  Presentation, 
  Users, 
  ChefHat, 
  Dumbbell, 
  Video 
} from 'lucide-react';

export default function StopwatchTimerTool() {
  // Define use cases
  const useCases = [
    {
      title: 'Presentations',
      description: 'Keep track of speaking time during conferences, meetings, and talks. Full screen mode makes it visible to entire audiences.',
      icon: 'Presentation',
      duration: '5-60 min'
    },
    {
      title: 'Team Meetings',
      description: 'Timebox discussions and ensure meetings stay productive and on schedule. Great for agile ceremonies and brainstorming.',
      icon: 'Users',
      duration: '15-90 min'
    },
    {
      title: 'Classroom Activities',
      description: 'Perfect for timing tests, group activities, and transitions between lessons. Visual countdown helps students manage time.',
      icon: 'Clock',
      duration: '1 min - 3 hours'
    },
    {
      title: 'Cooking & Kitchen',
      description: 'Reliable kitchen timer for recipes, baking, and meal prep. Set hours for slow cooking or minutes for quick tasks.',
      icon: 'ChefHat',
      duration: '1 min - 12 hours'
    },
    {
      title: 'Workout Intervals',
      description: 'Ideal for HIIT training, rest periods, and exercise timing. Switch between countdown and stopwatch modes as needed.',
      icon: 'Dumbbell',
      duration: '10s - 2 hours'
    },
    {
      title: 'Virtual Meetings',
      description: 'Share your screen during online meetings to keep everyone on track. Large display is easily readable in video conferences.',
      icon: 'Video',
      duration: 'Any duration'
    }
  ];

  // Icon mapping
  const iconMap = {
    'Presentation': Presentation,
    'Users': Users,
    'Clock': Clock,
    'ChefHat': ChefHat,
    'Dumbbell': Dumbbell,
    'Video': Video
  };

  // FAQ items
  const timerFaqItems = [
    {
      question: "Can I use the timer in full screen mode?",
      answer: "Yes! Click the fullscreen button to enter full screen mode, perfect for presentations, classrooms, or when you need a large, visible timer display."
    },
    {
      question: "Does the timer work when my computer is asleep?",
      answer: "No, like most web-based timers, it requires your browser to be active. For long durations, keep your computer awake or use a dedicated hardware timer."
    },
    {
      question: "Can I set custom alarm sounds?",
      answer: "Currently, we offer a standard alarm sound that can be toggled on or off. We're working on adding custom sound options in future updates."
    },
    {
      question: "Is there a limit to how long I can set the timer?",
      answer: "You can set the timer for any duration, from seconds to days. However, for very long durations, remember that the timer requires your browser to remain open."
    },
    {
      question: "Can I use both countdown and stopwatch simultaneously?",
      answer: "The timer operates in one mode at a time - either countdown or stopwatch. You can easily switch between modes, but they don't run simultaneously."
    },
    {
      question: "Does the timer work on mobile devices?",
      answer: "Yes! Our timer is fully responsive and works on smartphones and tablets. The interface adapts to different screen sizes for optimal usability."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl shadow-lg mb-4">
              <Clock className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Countdown Timer & Stopwatch
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Perfect for presentations, meetings, classrooms, and cooking. 
              Features full screen mode for projection and screen sharing.
            </p>
          </div>

          <CountdownTimer />
        </div>

        {/* Features Section */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Perfect For Every Situation
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => {
              const IconComponent = iconMap[useCase.icon as keyof typeof iconMap]
              return (
                <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-300 to-green-600 rounded-xl mb-4">
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{useCase.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{useCase.description}</p>
                  <div className="mt-3">
                    <span className="inline-block bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">
                      {useCase.duration}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Tips Section */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-emerald-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Pro Tips for Better Timing
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Use Full Screen for Presentations</h4>
                    <p className="text-gray-600 text-sm mt-1">Click the fullscreen button when projecting to make the timer clearly visible to your audience.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Quick Preset Times</h4>
                    <p className="text-gray-600 text-sm mt-1">Use the preset buttons for common durations like 5, 10, or 15 minutes.</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Color-Coded Alerts</h4>
                    <p className="text-gray-600 text-sm mt-1">The timer changes color as time runs out: green → yellow → red for easy visual cues.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm font-bold">4</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Audio Alarms</h4>
                    <p className="text-gray-600 text-sm mt-1">Toggle sound on/off. Perfect for when you need an audible alert or silent operation.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {timerFaqItems.map((faq, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-emerald-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* SEO Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 prose prose-emerald">
          <h2>Why Use Our Online Timer & Stopwatch?</h2>
          <p>Our free online timer and stopwatch tool provides professional-grade timing functionality without any installation required. Whether you're giving a presentation, conducting a meeting, teaching a class, or cooking a meal, this tool adapts to your needs.</p>
          
          <h3>Key Benefits</h3>
          <ul>
            <li><strong>No Installation Required:</strong> Works directly in your browser on any device</li>
            <li><strong>Full Screen Mode:</strong> Perfect for presentations and classroom use</li>
            <li><strong>Dual Functionality:</strong> Switch between countdown timer and stopwatch modes</li>
            <li><strong>Customizable Alerts:</strong> Visual and optional audio notifications</li>
            <li><strong>Quick Presets:</strong> One-click setup for common time intervals</li>
            <li><strong>Mobile Friendly:</strong> Works seamlessly on smartphones and tablets</li>
          </ul>

          <h3>Professional Applications</h3>
          <p>From corporate boardrooms to home kitchens, our timer serves diverse needs. Presenters use it to stay on schedule, teachers employ it for timed activities, fitness enthusiasts rely on it for interval training, and home cooks depend on it for perfect meal timing.</p>
        </div>
      </main>

      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": timerFaqItems.map(faq => ({
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