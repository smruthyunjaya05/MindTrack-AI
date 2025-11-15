import { Lightbulb, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react'
import GlassCard from './ui/GlassCard'

export default function AISuggestions({ result }) {
  if (!result.ai_suggestions || result.ai_suggestions.length === 0) {
    return null
  }

  const priorityConfig = {
    critical: {
      color: 'text-red-400',
      bg: 'bg-red-500/20',
      border: 'border-red-500/50',
      icon: AlertCircle
    },
    high: {
      color: 'text-orange-400',
      bg: 'bg-orange-500/20',
      border: 'border-orange-500/50',
      icon: AlertCircle
    },
    medium: {
      color: 'text-blue-400',
      bg: 'bg-blue-500/20',
      border: 'border-blue-500/50',
      icon: Lightbulb
    },
    low: {
      color: 'text-gray-400',
      bg: 'bg-gray-500/20',
      border: 'border-gray-500/50',
      icon: CheckCircle
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <Lightbulb className="w-6 h-6 text-accent-primary" />
        <h2 className="heading-section">AI-Powered Recommendations</h2>
      </div>

      <p className="text-text-secondary mb-6">
        Based on the context and emotional tone of your text, our AI has generated personalized recommendations to help you address your specific situation.
      </p>

      <div className="grid gap-4">
        {result.ai_suggestions.map((suggestion, index) => {
          const config = priorityConfig[suggestion.priority] || priorityConfig.medium
          const Icon = config.icon

          return (
            <GlassCard 
              key={index}
              className={`${config.border} border-l-4 relative overflow-hidden`}
            >
              {/* Priority Badge */}
              <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.color} uppercase`}>
                {suggestion.priority} Priority
              </div>

              {/* Icon and Number */}
              <div className="flex items-start gap-4 mb-4">
                <div className={`p-3 rounded-lg ${config.bg} ${config.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 pr-32">
                  <h3 className="text-text-primary font-semibold text-lg mb-2">
                    {index + 1}. {suggestion.title}
                  </h3>
                </div>
              </div>

              {/* Description */}
              <p className="text-text-secondary mb-4 pl-16">
                {suggestion.description}
              </p>

              {/* Rationale - Evidence-based explanation */}
              <div className="pl-16 pt-3 border-t border-white/10">
                <p className="text-text-tertiary text-sm">
                  <span className="text-accent-primary font-medium">Why this helps: </span>
                  {suggestion.rationale}
                </p>
              </div>
            </GlassCard>
          )
        })}
      </div>

      {/* Immediate Actions */}
      {result.immediate_actions && result.immediate_actions.length > 0 && (
        <GlassCard variant="accent" className="mt-6">
          <h3 className="text-text-primary font-semibold text-lg mb-4">
            🚀 Take Action Now (Next 30 Minutes)
          </h3>
          <div className="space-y-3">
            {result.immediate_actions.slice(0, 5).map((action, index) => (
              <div key={index} className="flex items-start gap-3">
                <span className="text-accent-primary font-bold text-lg">{index + 1}.</span>
                <p className="text-text-secondary flex-1">{action}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* Support Resources */}
      {result.support_resources && result.support_resources.length > 0 && (
        <GlassCard className="mt-6">
          <h3 className="text-text-primary font-semibold text-lg mb-4">
            📞 Support Resources
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {result.support_resources.map((resource, index) => (
              <div key={index} className="p-4 bg-surface-dark/50 rounded-lg border border-white/10">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-text-primary font-semibold">{resource.name}</h4>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    resource.type === 'crisis' 
                      ? 'bg-red-500/20 text-red-400' 
                      : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {resource.type}
                  </span>
                </div>
                <p className="text-accent-primary text-lg font-bold mb-1">{resource.contact}</p>
                <p className="text-text-tertiary text-sm mb-2">{resource.description}</p>
                <p className="text-text-tertiary text-xs">Available: {resource.availability}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      )}
    </div>
  )
}
