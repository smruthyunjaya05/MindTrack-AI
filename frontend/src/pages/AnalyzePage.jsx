import { useState } from 'react'
import { analyzeText, analyzeUrl } from '../services/api'
import {
  AlertCircle,
  CheckCircle,
  Loader2,
  Activity,
  Database,
  List,
  AlertTriangle,
  Heart,
  Phone,
  Link as LinkIcon,
  Type,
} from 'lucide-react'
import GlassCard from '../components/ui/GlassCard'
import PrimaryButton from '../components/ui/PrimaryButton'
import SecondaryButton from '../components/ui/SecondaryButton'
import ToggleSwitch from '../components/ui/ToggleSwitch'
import VoiceInputButton from '../components/ui/VoiceInputButton'
import URLPreviewCard from '../components/ui/URLPreviewCard'
import ShareButton from '../components/ui/ShareButton'
import ShareButtonComplete from '../components/ui/ShareButtonComplete'
import AIRemedySystem from '../components/AIRemedySystem'
import AISuggestions from '../components/AISuggestions'

export default function AnalyzePage() {
  const [inputMode, setInputMode] = useState('text') // 'text' or 'url'
  const [text, setText] = useState('')
  const [url, setUrl] = useState('')
  const [urlPreview, setUrlPreview] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  const charCount = text.length
  const isValid = inputMode === 'text' 
    ? (charCount >= 50 && charCount <= 5000)
    : (url.trim().length > 0)
  
  const handleAnalyze = async () => {
    if (!isValid) return
    
    setLoading(true)
    setError(null)
    setResult(null)
    setUrlPreview(null)
    
    try {
      if (inputMode === 'text') {
        // Analyze text directly
        const data = await analyzeText(text)
        setResult(data)
      } else {
        // First extract content from URL
        const urlData = await analyzeUrl(url)
        
        if (!urlData.success) {
          setError(urlData.error || urlData.message || 'Failed to extract content from URL')
          return
        }
        
        // Set URL preview
        setUrlPreview({
          platform: urlData.platform,
          author: urlData.data.author,
          content: urlData.data.content,
          date: urlData.data.date,
          url: urlData.data.url
        })
        
        // Then analyze the extracted content
        if (urlData.data.content) {
          const analysis = await analyzeText(urlData.data.content)
          setResult(analysis)
        } else {
          setError('No content found in the post. It may be empty or deleted.')
        }
      }
    } catch (err) {
      console.error('Analysis error:', err)
      setError(err.response?.data?.error || err.message || 'Failed to analyze. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleVoiceTranscript = (transcript) => {
    setText(prevText => prevText + ' ' + transcript)
  }
  
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4 animate-fade-in">
        <h1 className="heading-page">Emotional Analysis</h1>
        <p className="body-large max-w-2xl mx-auto">
          Share your thoughts or paste a social media post to understand your emotional state
        </p>
      </div>
      
      {/* Input Section with Toggle */}
      <GlassCard className="space-y-6">
        <div>
          <h3 className="heading-section mb-2">Enter content for emotional analysis</h3>
          <p className="text-text-tertiary text-sm">Choose how you want to provide input</p>
        </div>

        {/* Toggle Switch */}
        <ToggleSwitch
          leftLabel="Text Input"
          rightLabel="URL Input"
          leftIcon={<Type size={16} />}
          rightIcon={<LinkIcon size={16} />}
          isLeft={inputMode === 'text'}
          onToggle={() => setInputMode(inputMode === 'text' ? 'url' : 'text')}
        />

        {/* Text Mode */}
        {inputMode === 'text' && (
          <div className="space-y-4 animate-fade-in">
            <div className="relative">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste social media content or write your thoughts here..."
                className="textarea-field w-full pr-16"
                disabled={loading}
                rows={6}
              />
              <VoiceInputButton 
                onTranscript={handleVoiceTranscript}
                disabled={loading}
              />
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className={`${
                charCount < 50
                  ? 'text-text-tertiary'
                  : charCount <= 5000
                  ? 'text-success'
                  : 'text-danger'
              }`}>
                {charCount} / 5000 characters
                {charCount < 50 && charCount > 0 && ` (${50 - charCount} more needed)`}
              </span>
              {!isValid && charCount > 0 && (
                <span className="text-danger text-sm font-medium">
                  {charCount < 50 ? 'Minimum 50 characters' : 'Maximum 5000 characters'}
                </span>
              )}
            </div>
          </div>
        )}

        {/* URL Mode */}
        {inputMode === 'url' && (
          <div className="space-y-4 animate-fade-in">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-text-secondary">
                <LinkIcon size={18} />
                <span className="text-sm">Enter social media post URL</span>
              </div>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://twitter.com/user/status/123..."
                className="input-field"
                disabled={loading}
              />
              <p className="text-text-tertiary text-xs">
                ✅ Supported: Twitter, Reddit, Instagram | ⏳ Coming soon: Facebook, Threads
              </p>
            </div>

            {/* URL Preview (if URL is fetched) */}
            {urlPreview && (
              <URLPreviewCard 
                platform={urlPreview.platform}
                author={urlPreview.author}
                date={urlPreview.date}
                content={urlPreview.content}
              />
            )}
          </div>
        )}

        {/* Analyze Button */}
        <PrimaryButton
          onClick={handleAnalyze}
          disabled={!isValid || loading}
          className="w-full"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Analyzing...</span>
            </span>
          ) : (
            'Analyze Content'
          )}
        </PrimaryButton>
      </GlassCard>
      
      {/* Error Message */}
      {error && (
        <GlassCard className="border-danger/30 bg-danger/5 animate-fade-in">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-danger flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-danger mb-1">Analysis Error</h3>
              <p className="text-text-secondary">{error}</p>
            </div>
          </div>
        </GlassCard>
      )}
      
      {/* Results Bento Grid */}
      {result && (
        <div className="space-y-6 animate-fade-in">
          {/* Share Buttons */}
          <div className="flex justify-end gap-3">
            <ShareButton result={result} text={text} urlPreview={urlPreview} />
            <ShareButtonComplete result={result} text={text} urlPreview={urlPreview} />
          </div>

          {/* Top Row: Primary Result + Confidence */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Primary Result - Large */}
            <GlassCard variant="elevated" className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                {result.sentiment === 'Normal' ? (
                  <CheckCircle className="w-10 h-10 text-success" />
                ) : (
                  <AlertTriangle className="w-10 h-10 text-danger" />
                )}
                <div>
                  <p className="text-text-tertiary text-sm">Detection Status</p>
                  <h2 className={`text-4xl font-bold ${
                    result.sentiment === 'Normal' ? 'text-success' : 'text-danger'
                  }`}>
                    {result.sentiment.toUpperCase()}
                  </h2>
                </div>
              </div>
              <p className="text-text-secondary">
                {result.sentiment === 'Normal' 
                  ? 'Your emotional state appears healthy and balanced.'
                  : 'Indicators of stress or emotional distress detected.'}
              </p>
              <div className="pt-4 border-t border-border-subtle text-sm text-text-tertiary">
                Analyzed at: {new Date(result.timestamp).toLocaleString()}
              </div>
            </GlassCard>

            {/* Confidence Meter */}
            <GlassCard className="space-y-4">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-accent-primary" />
                <p className="text-text-secondary text-sm font-medium">Model Confidence</p>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-white mb-2">
                  {(result.confidence * 100).toFixed(1)}%
                </div>
                <div className="w-full bg-bg-tertiary rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      result.sentiment === 'Normal' ? 'bg-success' : 'bg-danger'
                    }`}
                    style={{ width: `${result.confidence * 100}%` }}
                  />
                </div>
                <p className="text-text-tertiary text-sm mt-2">
                  {result.confidence >= 0.9 ? 'Very High' : result.confidence >= 0.7 ? 'High' : 'Moderate'} Confidence
                </p>
              </div>
            </GlassCard>
          </div>

          {/* Bottom Row: Key Indicators + Source Info */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Key Indicators */}
            <GlassCard className="space-y-4">
              <div className="flex items-center gap-2">
                <List className="w-5 h-5 text-accent-primary" />
                <h3 className="font-semibold text-white">Key Indicators</h3>
              </div>
              <div className="space-y-2">
                <p className="text-text-secondary text-sm">Detected patterns:</p>
                <ul className="text-text-secondary text-sm space-y-1">
                  {result.sentiment === 'Stressed' ? (
                    <>
                      <li>• Negative sentiment</li>
                      <li>• Stress indicators</li>
                      <li>• Emotional language</li>
                    </>
                  ) : (
                    <>
                      <li>• Positive sentiment</li>
                      <li>• Balanced tone</li>
                      <li>• Healthy expression</li>
                    </>
                  )}
                </ul>
              </div>
            </GlassCard>

            {/* Source Information - Combined */}
            <GlassCard className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-accent-primary" />
                <h3 className="font-semibold text-white">Source Information</h3>
              </div>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-text-tertiary mb-1">Source Type</p>
                  <p className="text-white font-medium">
                    {inputMode === 'url' ? 'URL Extract' : 'Direct Text'}
                  </p>
                </div>
                <div>
                  <p className="text-text-tertiary mb-1">Model</p>
                  <p className="text-white font-medium">DistilBERT</p>
                  <p className="text-text-tertiary text-xs">66.9M parameters</p>
                </div>
                <div>
                  <p className="text-text-tertiary mb-1">Training Data</p>
                  <p className="text-white font-medium">359K posts</p>
                  <p className="text-text-tertiary text-xs">Twitter, Reddit, Instagram</p>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* AI-Powered Personalized Suggestions */}
          <AISuggestions result={result} />

          {/* Wellness Action Plan */}
          <AIRemedySystem 
            sentiment={result.sentiment}
            confidence={result.confidence}
            text={text}
          />

          {/* Crisis Resources - Only for high confidence stressed */}
          {result.sentiment === 'Stressed' && result.confidence >= 0.8 && (
            <GlassCard className="border-danger/50 bg-danger/5">
              <div className="flex items-start gap-4">
                <Phone className="w-6 h-6 text-danger flex-shrink-0" />
                <div className="flex-1 space-y-3">
                  <div>
                    <h3 className="text-danger font-bold text-lg">Immediate Support Available</h3>
                    <p className="text-text-secondary text-sm mt-1">
                      If you're in crisis, please reach out to these resources immediately
                    </p>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="text-white">
                      <strong>National Suicide Prevention Lifeline:</strong> <span className="text-danger font-bold">988</span>
                    </p>
                    <p className="text-white">
                      <strong>Crisis Text Line:</strong> Text <span className="text-danger font-bold">HOME</span> to <span className="text-danger font-bold">741741</span>
                    </p>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <PrimaryButton className="bg-danger hover:bg-danger/90">
                      Call Now
                    </PrimaryButton>
                    <SecondaryButton>
                      Find Resources
                    </SecondaryButton>
                  </div>
                </div>
              </div>
            </GlassCard>
          )}
        </div>
      )}
      
      {/* Info Card */}
      <GlassCard variant="accent" className="border-accent-primary/30">
        <div className="flex items-start gap-3">
          <Activity className="w-5 h-5 text-accent-primary flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-white mb-2">About the Analysis</h3>
            <p className="text-text-secondary text-sm">
              Our AI uses DistilBERT with 94.4% accuracy to analyze your content and classify it as either 
              "Normal" or "Stressed". The confidence score indicates model certainty. All results are saved 
              to your timeline for emotional pattern tracking over time.
            </p>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}
