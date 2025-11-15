import Marquee from "react-fast-marquee"
import { AlertCircle, TrendingUp, Brain, Heart, Twitter, MessageCircle, Share2 } from 'lucide-react'

export default function SocialMediaAnalysisShowcase() {
  // Real-time analysis examples - showing how the system detects issues
  const analysisExamples = [
    "� Analyzing: 'I can't sleep anymore... everything feels hopeless' → Detected: High Stress (94% confidence)",
    "� Analyzing: 'Another day, another panic attack' → Detected: Anxiety (91% confidence)",
    "🔍 Analyzing: 'Nobody understands what I'm going through' → Detected: Depression (88% confidence)",
    "� Analyzing: 'Feeling overwhelmed with work and life' → Detected: Stress (86% confidence)",
    "✅ Analyzed: 'Had a great day with friends!' → Detected: Normal (95% confidence)",
    "� Analyzing: 'Can't focus, can't eat, can't think straight' → Detected: High Stress (92% confidence)",
    "✅ Analyzed: 'Grateful for small wins today' → Detected: Normal (89% confidence)",
    "� Analyzing: 'Why do I even bother anymore...' → Detected: Depression (93% confidence)",
  ]

  const statistics = [
    {
      icon: <Brain className="w-10 h-10 text-blue-500" />,
      value: "359K+",
      label: "Social Posts Analyzed",
      change: "Twitter, Reddit, Facebook",
      severity: "info",
      source: "Training Dataset"
    },
    {
      icon: <AlertCircle className="w-10 h-10 text-red-500" />,
      value: "94.4%",
      label: "Detection Accuracy",
      change: "DistilBERT NLP Model",
      severity: "success",
      source: "Model Performance"
    },
    {
      icon: <Heart className="w-10 h-10 text-purple-500" />,
      value: "82.2%",
      label: "Stress/Depression Cases",
      change: "Early detection crucial",
      severity: "warning",
      source: "Dataset Distribution"
    }
  ]

  // Key detection capabilities
  const capabilities = [
    {
      emoji: "🔍",
      title: "Deep Text Analysis",
      description: "NLP analyzes linguistic patterns, word choice, and sentiment",
      action: "Try Analysis",
      color: "blue",
      examples: "Detects: hopelessness, isolation, panic"
    },
    {
      emoji: "🧠",
      title: "Context Understanding",
      description: "AI understands context beyond keywords",
      action: "Learn More",
      color: "purple",
      examples: "Handles: sarcasm, idioms, slang"
    },
    {
      emoji: "⚡",
      title: "Real-time Detection",
      description: "Instant analysis of social media posts",
      action: "Test Now",
      color: "yellow",
      examples: "Speed: <2 seconds per post"
    },
    {
      emoji: "�",
      title: "Confidence Scoring",
      description: "Probability-based predictions with transparency",
      action: "View Details",
      color: "green",
      examples: "Range: 0-100% confidence"
    },
    {
      emoji: "🎯",
      title: "Multi-Platform",
      description: "Trained on Twitter, Reddit, Facebook posts",
      action: "See Sources",
      color: "orange",
      examples: "Platforms: 3 major networks"
    },
    {
      emoji: "🛡️",
      title: "Privacy First",
      description: "No data stored, analysis happens locally",
      action: "Read Policy",
      color: "red",
      examples: "Security: End-to-end encrypted"
    }
  ]

  return (
    <div className="space-y-8">
      {/* Real-time Analysis Ticker */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-xl shadow-lg overflow-hidden">
        <div className="flex items-center space-x-3 px-4 mb-2">
          <Brain className="w-6 h-6 animate-pulse" />
          <h3 className="font-bold text-lg">🔴 Live Social Media Mental Health Detection</h3>
        </div>
        <Marquee
          gradient={false}
          speed={50}
          pauseOnHover={true}
          className="py-2"
        >
          {analysisExamples.map((example, index) => (
            <span
              key={index}
              className="mx-8 text-white/90 font-medium text-base"
            >
              {example}
            </span>
          ))}
        </Marquee>
        <p className="text-center text-white/70 text-sm mt-2">
          ← Live demonstration of NLP-based emotion detection • Hover to pause →
        </p>
      </div>

      {/* System Performance Dashboard */}
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
          <TrendingUp className="w-8 h-8 text-primary-600" />
          <span>🎯 Detection System Performance</span>
        </h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          {statistics.map((stat, index) => (
            <div
              key={index}
              className="group relative bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl border-2 border-gray-200 hover:border-primary-300 hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div>{stat.icon}</div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  stat.severity === 'danger' ? 'bg-red-100 text-red-700' :
                  stat.severity === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  Research-backed
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-4xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-lg font-semibold text-gray-700">{stat.label}</p>
                <p className="text-sm text-gray-500">{stat.change}</p>
              </div>
              
              {/* Tooltip on hover */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap">
                  Source: {stat.source}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>💡 How it works:</strong> Our DistilBERT model analyzes text patterns from 359,694 social media posts 
            (Twitter, Reddit, Facebook) to detect emotional distress indicators with 94.4% accuracy. 
            <a href="#" className="underline font-medium ml-1">Learn about our methodology →</a>
          </p>
        </div>
      </div>

      {/* Detection Capabilities */}
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          � What Makes Our Detection System Powerful
        </h2>
        
        <div className="grid md:grid-cols-3 gap-4 overflow-x-auto">
          {capabilities.map((capability, index) => (
            <div
              key={index}
              className={`group bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border-2 border-gray-200 hover:border-${capability.color}-400 hover:shadow-lg transition-all duration-300`}
            >
              <div className="text-5xl mb-3">{capability.emoji}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{capability.title}</h3>
              <p className="text-gray-700 mb-3">{capability.description}</p>
              <p className="text-sm text-gray-600 mb-4 italic">{capability.examples}</p>
              <button className={`btn w-full bg-primary-500 hover:bg-primary-600 text-white`}>
                {capability.action}
              </button>
            </div>
          ))}
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-gray-600 mb-3">← Explore our advanced NLP capabilities →</p>
          <button className="btn btn-primary">
            🧪 Test the Detection System Now
          </button>
        </div>
      </div>

      {/* Sample Social Media Posts Examples */}
      <div className="card bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
          <MessageCircle className="w-8 h-8 text-purple-600" />
          <span>📱 Example: How We Analyze Social Media Posts</span>
        </h2>
        
        <div className="space-y-4">
          {/* Example 1 - High Stress */}
          <div className="bg-white p-5 rounded-xl border-2 border-red-200 hover:shadow-lg transition-all">
            <div className="flex items-start space-x-4">
              <Twitter className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <p className="text-gray-800 italic mb-3">
                  "I can't do this anymore. Every day feels like a struggle. Nobody understands what I'm going through..."
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="px-3 py-1 bg-red-100 text-red-700 font-semibold rounded-full text-sm">
                      ⚠️ High Stress Detected
                    </span>
                    <span className="text-sm text-gray-600">Confidence: 94%</span>
                  </div>
                  <button className="text-primary-600 font-medium text-sm hover:underline">
                    View Analysis Details →
                  </button>
                </div>
                <div className="mt-3 p-3 bg-red-50 rounded-lg text-sm text-red-800">
                  <strong>🔍 Key Indicators:</strong> Expressions of hopelessness, isolation phrases, struggle language
                </div>
              </div>
            </div>
          </div>

          {/* Example 2 - Normal */}
          <div className="bg-white p-5 rounded-xl border-2 border-green-200 hover:shadow-lg transition-all">
            <div className="flex items-start space-x-4">
              <Share2 className="w-6 h-6 text-orange-400 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <p className="text-gray-800 italic mb-3">
                  "Just finished a great workout session! Feeling energized and ready to tackle the day 💪"
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="px-3 py-1 bg-green-100 text-green-700 font-semibold rounded-full text-sm">
                      ✅ Normal/Healthy
                    </span>
                    <span className="text-sm text-gray-600">Confidence: 95%</span>
                  </div>
                  <button className="text-primary-600 font-medium text-sm hover:underline">
                    View Analysis Details →
                  </button>
                </div>
                <div className="mt-3 p-3 bg-green-50 rounded-lg text-sm text-green-800">
                  <strong>🔍 Key Indicators:</strong> Positive language, achievement expressions, energetic tone
                </div>
              </div>
            </div>
          </div>

          {/* Example 3 - Depression */}
          <div className="bg-white p-5 rounded-xl border-2 border-red-200 hover:shadow-lg transition-all">
            <div className="flex items-start space-x-4">
              <MessageCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <p className="text-gray-800 italic mb-3">
                  "Why do I even bother? Nothing I do matters. I just want to disappear..."
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="px-3 py-1 bg-red-100 text-red-700 font-semibold rounded-full text-sm">
                      🚨 Depression Indicators
                    </span>
                    <span className="text-sm text-gray-600">Confidence: 92%</span>
                  </div>
                  <button className="text-primary-600 font-medium text-sm hover:underline">
                    View Analysis Details →
                  </button>
                </div>
                <div className="mt-3 p-3 bg-red-50 rounded-lg text-sm text-red-800">
                  <strong>🔍 Key Indicators:</strong> Self-worth questioning, despair language, withdrawal expressions
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-purple-100 rounded-lg border border-purple-300">
          <p className="text-sm text-purple-900">
            <strong>🎯 Our Mission:</strong> Early detection of mental health issues through social media text analysis 
            can save lives. Our NLP system identifies linguistic patterns that indicate emotional distress, enabling 
            timely intervention and support. <a href="#" className="underline font-medium">Read our research →</a>
          </p>
        </div>
      </div>
    </div>
  )
}
