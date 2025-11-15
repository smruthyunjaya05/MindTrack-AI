import React from 'react';
import { Link } from 'react-router-dom';
import {
  Brain,
  Activity,
  Target,
  Mic,
  Link as LinkIcon,
  Type,
  CheckCircle,
  AlertTriangle,
  Database,
  Twitter,
  MessageCircle,
  Facebook,
  Instagram,
} from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import PrimaryButton from '../components/ui/PrimaryButton';
import ScrollingTicker from '../components/ui/ScrollingTicker';

export default function HomePage() {
  // Sample messages for scrolling ticker
  const liveExamples = [
    { text: "I can't do this anymore...", sentiment: 'Stressed', confidence: 94.2 },
    { text: 'Great day with friends today!', sentiment: 'Normal', confidence: 91.5 },
    { text: 'Everything feels overwhelming...', sentiment: 'Stressed', confidence: 88.7 },
    { text: 'Feeling grateful and peaceful', sentiment: 'Normal', confidence: 93.1 },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section with Gradient Glow */}
      <section className="relative h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
        {/* Gradient Glow Background */}
        <div className="absolute inset-0 bg-gradient-glow pointer-events-none"></div>
        
        {/* Content - Moved up */}
        <div className="relative z-10 text-center space-y-4 max-w-4xl mx-auto animate-fade-in -mt-24">
          {/* Logo with Glow */}
          <div className="flex justify-center">
            <div className="relative">
              <Brain className="w-16 h-16 text-accent-primary drop-shadow-[0_0_15px_rgba(255,125,41,0.5)]" />
            </div>
          </div>

          {/* MindTrack AI Brand Name */}
          <h1 className="text-2xl font-bold">
            <span className="gradient-text">MindTrack AI</span>
          </h1>

          {/* Bold Inspirational Quote */}
          <h2 className="heading-hero text-glow px-4 leading-tight max-w-3xl mt-2">
            Your thoughts matter. Understanding them is the first step toward emotional wellness.
          </h2>

          {/* Large CTA Button */}
          <div className="flex justify-center pt-4">
            <Link to="/analyze">
              <PrimaryButton className="text-lg px-12 py-4 shadow-glow-orange-lg">
                Start Analysis →
              </PrimaryButton>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="heading-page mb-4">Understanding Mental Health Through AI</h2>
          <p className="body-large max-w-2xl mx-auto">
            Our advanced natural language processing system analyzes your thoughts in three simple steps
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <GlassCard className="text-center space-y-4 hover:scale-105 transition-transform">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-16 bg-gradient-primary flex items-center justify-center shadow-glow-orange">
                <div className="flex gap-2">
                  <Type className="w-6 h-6 text-white" />
                  <Mic className="w-6 h-6 text-white" />
                  <LinkIcon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
            <h3 className="heading-section">Enter Text, Voice, or Link</h3>
            <p className="body-default">
              Type your thoughts, speak them aloud, or paste a social media post URL for analysis
            </p>
          </GlassCard>

          {/* Step 2 */}
          <GlassCard className="text-center space-y-4 hover:scale-105 transition-transform">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-16 bg-gradient-primary flex items-center justify-center shadow-glow-orange">
                <Brain className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="heading-section">AI Analysis</h3>
            <p className="body-default">
              DistilBERT processes your content with 94.4% accuracy, detecting emotional patterns
            </p>
          </GlassCard>

          {/* Step 3 */}
          <GlassCard className="text-center space-y-4 hover:scale-105 transition-transform">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-16 bg-gradient-primary flex items-center justify-center shadow-glow-orange">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="heading-section">Get Insights</h3>
            <p className="body-default">
              Receive personalized wellness action plans and emotional state analysis
            </p>
          </GlassCard>
        </div>
      </section>

      {/* Model Performance Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="heading-page mb-4">Powered by Advanced AI Technology</h2>
          <p className="body-large max-w-2xl mx-auto">
            Trained on real social media conversations with state-of-the-art deep learning
          </p>
        </div>

        {/* Primary Stats */}
        <GlassCard variant="elevated" className="mb-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="space-y-3">
              <Target className="w-12 h-12 text-accent-primary mx-auto" />
              <div className="text-5xl font-bold text-white">94.4%</div>
              <p className="text-text-secondary">Model Accuracy</p>
            </div>
            <div className="space-y-3">
              <Database className="w-12 h-12 text-accent-primary mx-auto" />
              <div className="text-5xl font-bold text-white">359K+</div>
              <p className="text-text-secondary">Training Samples</p>
            </div>
            <div className="space-y-3">
              <Activity className="w-12 h-12 text-accent-primary mx-auto" />
              <div className="text-5xl font-bold text-white">DistilBERT</div>
              <p className="text-text-secondary">66.9M Parameters</p>
            </div>
          </div>
        </GlassCard>

        {/* Dataset Transparency */}
        <GlassCard variant="accent">
          <h3 className="heading-section mb-6">Trained on 3 Social Media Platforms</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Twitter className="w-5 h-5 text-accent-primary" />
                <span className="text-text-primary font-medium">Twitter</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-text-secondary">99,708 posts</span>
                <span className="text-accent-primary font-semibold">27.7%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5 text-accent-primary" />
                <span className="text-text-primary font-medium">Reddit</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-text-secondary">232,043 posts</span>
                <span className="text-accent-primary font-semibold">64.5%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Instagram className="w-5 h-5 text-accent-primary" />
                <span className="text-text-primary font-medium">Instagram</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-text-secondary">27,943 posts</span>
                <span className="text-accent-primary font-semibold">7.8%</span>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-border-subtle text-center">
            <p className="text-text-secondary">
              Total Dataset: <span className="text-accent-primary font-bold">359,694</span> analyzed conversations
            </p>
          </div>
        </GlassCard>
      </section>

      {/* Live Detection Demo */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h2 className="heading-page mb-4">See MindTrack AI in Action</h2>
          <p className="body-large max-w-2xl mx-auto">
            Real-time examples of our AI detecting emotional states from text
          </p>
        </div>

        {/* Scrolling Ticker */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Activity className="w-6 h-6 text-accent-primary" />
            <span className="text-text-primary font-semibold text-lg">Live Analysis Stream</span>
          </div>
          <ScrollingTicker messages={liveExamples} speed={25} />
        </div>

        {/* Example Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* High Stress Example */}
          <GlassCard className="border-danger/30">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-8 h-8 text-danger flex-shrink-0" />
              <div className="flex-1 space-y-3">
                <div>
                  <h3 className="text-xl font-bold text-danger mb-1">HIGH STRESS DETECTION</h3>
                  <p className="text-text-secondary text-sm">Danger Assessment</p>
                </div>
                <div className="bg-bg-secondary p-4 rounded-12">
                  <p className="text-text-primary italic">
                    "Nobody understands what I'm going through..."
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Detection:</span>
                    <span className="text-danger font-bold">STRESSED</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Confidence:</span>
                    <span className="text-white font-bold">92.4%</span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-border-subtle">
                    <p className="text-text-tertiary text-sm mb-2">Key Indicators:</p>
                    <ul className="text-text-secondary text-sm space-y-1">
                      <li>• Isolation language</li>
                      <li>• Despair expression</li>
                      <li>• Hopelessness</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Normal Example */}
          <GlassCard className="border-success/30">
            <div className="flex items-start gap-4">
              <CheckCircle className="w-8 h-8 text-success flex-shrink-0" />
              <div className="flex-1 space-y-3">
                <div>
                  <h3 className="text-xl font-bold text-success mb-1">NORMAL DETECTION</h3>
                  <p className="text-text-secondary text-sm">Healthy State</p>
                </div>
                <div className="bg-bg-secondary p-4 rounded-12">
                  <p className="text-text-primary italic">
                    "Excited about new opportunities ahead!"
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Detection:</span>
                    <span className="text-success font-bold">NORMAL</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Confidence:</span>
                    <span className="text-white font-bold">95.1%</span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-border-subtle">
                    <p className="text-text-tertiary text-sm mb-2">Key Indicators:</p>
                    <ul className="text-text-secondary text-sm space-y-1">
                      <li>• Positive emotion</li>
                      <li>• Future-oriented</li>
                      <li>• Excitement cues</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border-subtle bg-bg-secondary mt-30">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-3 gap-12">
            {/* Brand Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Brain className="w-8 h-8 text-accent-primary" />
                <span className="text-xl font-bold gradient-text">MindTrack AI</span>
              </div>
              <p className="text-text-secondary text-sm">
                AI-powered mental health detection system using advanced NLP technology
              </p>
            </div>

            {/* Product Links */}
            <div className="space-y-4">
              <h3 className="label-text text-text-primary">PRODUCT</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/analyze" className="text-text-secondary hover:text-accent-primary transition-colors">
                    Analysis
                  </Link>
                </li>
                <li>
                  <a href="#" className="text-text-secondary hover:text-accent-primary transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="text-text-secondary hover:text-accent-primary transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div className="space-y-4">
              <h3 className="label-text text-text-primary">RESOURCES</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-text-secondary hover:text-accent-primary transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-text-secondary hover:text-accent-primary transition-colors">
                    API Docs
                  </a>
                </li>
                <li>
                  <a href="#" className="text-text-secondary hover:text-accent-primary transition-colors">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-text-secondary hover:text-accent-primary transition-colors">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-border-subtle text-center">
            <p className="text-text-tertiary text-sm">
              © 2025 MindTrack AI. All rights reserved.
            </p>
            <p className="text-text-tertiary text-xs mt-2">
              Mental health detection system using NLP technology
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
