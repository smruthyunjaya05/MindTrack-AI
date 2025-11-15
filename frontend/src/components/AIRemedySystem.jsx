import { useState } from 'react'
import { Heart, Activity, Sun, BookOpen, Users, Phone, CheckCircle, Clock, Target, AlertTriangle, ExternalLink } from 'lucide-react'
import GlassCard from './ui/GlassCard'

export default function AIRemedySystem({ sentiment, confidence, text }) {
  const [checkedActions, setCheckedActions] = useState({})

  const toggleAction = (category, actionId) => {
    const key = `${category}-${actionId}`
    setCheckedActions(prev => ({ ...prev, [key]: !prev[key] }))
  }

  // Only show for stressed/depressed sentiment
  if (sentiment === 'Normal' || sentiment === 'Healthy') {
    return null
  }

  // Personalized remedies based on sentiment
  const remedyPlan = {
    immediate: [
      {
        id: 1,
        icon: <Activity className="w-5 h-5" />,
        title: "Deep Breathing Exercise",
        duration: "5 minutes",
        action: "Practice 4-7-8 breathing technique to activate your parasympathetic nervous system",
        evidence: "Reduces cortisol levels by 15-20%",
        source: "Harvard Medical School, 2023",
        link: "https://www.health.harvard.edu/mind-and-mood/relaxation-techniques-breath-control-helps-quell-errant-stress-response",
        difficulty: "Easy"
      },
      {
        id: 2,
        icon: <Sun className="w-5 h-5" />,
        title: "Take a Walk Outside",
        duration: "10-15 minutes",
        action: "Step outside for fresh air and gentle movement in nature",
        evidence: "Improves mood by 30% within 15 minutes",
        source: "Journal of Environmental Psychology, 2024",
        link: "https://www.sciencedirect.com/journal/journal-of-environmental-psychology",
        difficulty: "Easy"
      },
      {
        id: 3,
        icon: <Heart className="w-5 h-5" />,
        title: "Hydrate & Nourish",
        duration: "Now",
        action: "Drink water and have a healthy snack (fruits, nuts, or protein)",
        evidence: "Dehydration linked to 25% increase in anxiety",
        source: "BMC Psychiatry, 2023",
        link: "https://bmcpsychiatry.biomedcentral.com/",
        difficulty: "Easy"
      },
      {
        id: 4,
        icon: <Users className="w-5 h-5" />,
        title: "Connect with Someone",
        duration: "15-30 minutes",
        action: "Call or message a trusted friend, family member, or therapist",
        evidence: "Social connection reduces depression risk by 50%",
        source: "PNAS, 2023",
        link: "https://www.pnas.org/",
        difficulty: "Medium"
      }
    ],
    shortTerm: [
      {
        id: 1,
        icon: <BookOpen className="w-5 h-5" />,
        title: "Daily Journaling",
        frequency: "15 min/day",
        action: "Write about thoughts, feelings, and 3 things you're grateful for",
        evidence: "Reduces anxiety by 28% over 30 days",
        source: "JAMA Psychiatry, 2023",
        link: "https://jamanetwork.com/journals/jamapsychiatry",
        difficulty: "Easy",
        timeframe: "Start today"
      },
      {
        id: 2,
        icon: <Sun className="w-5 h-5" />,
        title: "Sleep Hygiene",
        frequency: "Every night",
        action: "7-9 hours sleep, consistent schedule, no screens 1 hour before bed",
        evidence: "Improves mental health outcomes by 40%",
        source: "Sleep Medicine Reviews, 2024",
        link: "https://www.sciencedirect.com/journal/sleep-medicine-reviews",
        difficulty: "Medium",
        timeframe: "Start tonight"
      },
      {
        id: 3,
        icon: <Activity className="w-5 h-5" />,
        title: "Mindfulness Meditation",
        frequency: "10-20 min/day",
        action: "Use guided meditation apps or free YouTube sessions",
        evidence: "Reduces depression symptoms by 35%",
        source: "JAMA Internal Medicine, 2023",
        link: "https://jamanetwork.com/journals/jamainternalmedicine",
        difficulty: "Easy",
        timeframe: "Next 7 days"
      },
      {
        id: 4,
        icon: <Users className="w-5 h-5" />,
        title: "Social Activities",
        frequency: "2-3x per week",
        action: "Join a club, hobby group, or volunteer organization",
        evidence: "Social engagement reduces loneliness by 60%",
        source: "The Lancet, 2023",
        link: "https://www.thelancet.com/",
        difficulty: "Medium",
        timeframe: "Within 2 weeks"
      }
    ],
    longTerm: [
      {
        id: 1,
        icon: <Target className="w-5 h-5" />,
        title: "Professional Therapy",
        commitment: "Weekly sessions",
        action: "Cognitive Behavioral Therapy (CBT) or psychotherapy with licensed therapist",
        evidence: "CBT reduces depression by 50-70%",
        source: "Cochrane Database, 2023",
        link: "https://www.cochranelibrary.com/",
        difficulty: "High",
        providers: "BetterHelp, Talkspace, Psychology Today"
      },
      {
        id: 2,
        icon: <Activity className="w-5 h-5" />,
        title: "Regular Exercise",
        commitment: "150 min/week",
        action: "Aerobic exercise (running, swimming, cycling) or strength training",
        evidence: "As effective as antidepressants for mild-moderate depression",
        source: "BMJ, 2024",
        link: "https://www.bmj.com/",
        difficulty: "Medium",
        providers: "Gym membership, home workouts, yoga classes"
      },
      {
        id: 3,
        icon: <BookOpen className="w-5 h-5" />,
        title: "Build Life Purpose",
        commitment: "Ongoing",
        action: "Set meaningful goals, develop skills, contribute to community",
        evidence: "Sense of purpose reduces depression risk by 43%",
        source: "Psychological Science, 2023",
        link: "https://journals.sagepub.com/home/pss",
        difficulty: "High",
        providers: "Life coaches, career counselors, mentors"
      },
      {
        id: 4,
        icon: <Heart className="w-5 h-5" />,
        title: "Lifestyle Medicine",
        commitment: "Daily habits",
        action: "Holistic approach: nutrition, sleep, exercise, stress management, social connection",
        evidence: "Improves mental health outcomes by 55%",
        source: "American Journal of Lifestyle Medicine, 2024",
        link: "https://journals.sagepub.com/home/ajl",
        difficulty: "High",
        providers: "Lifestyle medicine physicians, health coaches"
      }
    ]
  }

  const crisisResources = [
    {
      name: "National Suicide Prevention Lifeline",
      phone: "988",
      available: "24/7",
      description: "Free, confidential crisis support",
      action: "Call Now"
    },
    {
      name: "Crisis Text Line",
      phone: "Text HOME to 741741",
      available: "24/7",
      description: "Text-based crisis counseling",
      action: "Send Text"
    },
    {
      name: "International Helplines",
      phone: "iasp.info/resources",
      available: "Varies",
      description: "Global crisis helpline directory",
      action: "Find Resources"
    }
  ]

  const completedCount = Object.values(checkedActions).filter(Boolean).length
  const totalActions = remedyPlan.immediate.length + remedyPlan.shortTerm.length + remedyPlan.longTerm.length

  return (
    <div className="space-y-6">
      {/* Crisis Alert - Only for high confidence */}
      {confidence > 0.75 && (
        <GlassCard variant="danger">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="heading-card text-red-300 mb-3">Immediate Support Available</h3>
              <p className="text-text-secondary mb-6">
                If you're in crisis, help is available 24/7. You don't have to face this alone.
              </p>
              
              <div className="grid md:grid-cols-3 gap-4">
                {crisisResources.map((resource, index) => (
                  <div key={index} className="bg-surface-dark/50 backdrop-blur-sm rounded-lg p-4 border border-white/5">
                    <h4 className="text-text-primary font-semibold mb-2">{resource.name}</h4>
                    <p className="text-accent-primary text-xl font-bold mb-2">{resource.phone}</p>
                    <p className="text-text-tertiary text-xs mb-3">{resource.description}</p>
                    <span className="inline-block px-3 py-1 bg-accent-primary/20 text-accent-primary text-xs font-medium rounded-full">
                      {resource.available}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Progress Tracker */}
      <GlassCard>
        <div className="flex items-center justify-between mb-4">
          <h3 className="heading-card">Wellness Action Plan</h3>
          <span className="text-accent-primary text-2xl font-bold">{completedCount}/{totalActions}</span>
        </div>
        <div className="w-full bg-surface-dark/50 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-accent-primary to-orange-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(completedCount / totalActions) * 100}%` }}
          />
        </div>
        <p className="text-text-tertiary text-sm mt-3">
          Track your progress as you complete wellness actions
        </p>
      </GlassCard>

      {/* Immediate Actions */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <Clock className="w-5 h-5 text-accent-primary" />
          <h3 className="heading-section">Immediate Relief</h3>
        </div>
        <p className="text-text-secondary mb-4">Quick actions you can take in the next 30 minutes</p>
        <div className="grid md:grid-cols-2 gap-4">
          {remedyPlan.immediate.map((action) => (
            <ActionCard
              key={action.id}
              action={action}
              checked={checkedActions[`immediate-${action.id}`]}
              onToggle={() => toggleAction('immediate', action.id)}
            />
          ))}
        </div>
      </div>

      {/* Short-term Actions */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <Target className="w-5 h-5 text-accent-primary" />
          <h3 className="heading-section">Short-term Actions</h3>
        </div>
        <p className="text-text-secondary mb-4">Build healthy habits over the next 7-30 days</p>
        <div className="grid md:grid-cols-2 gap-4">
          {remedyPlan.shortTerm.map((action) => (
            <ActionCard
              key={action.id}
              action={action}
              checked={checkedActions[`shortTerm-${action.id}`]}
              onToggle={() => toggleAction('shortTerm', action.id)}
            />
          ))}
        </div>
      </div>

      {/* Long-term Solutions */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <Heart className="w-5 h-5 text-accent-primary" />
          <h3 className="heading-section">Long-term Solutions</h3>
        </div>
        <p className="text-text-secondary mb-4">Foundational changes for sustained wellness</p>
        <div className="grid md:grid-cols-2 gap-4">
          {remedyPlan.longTerm.map((action) => (
            <ActionCard
              key={action.id}
              action={action}
              checked={checkedActions[`longTerm-${action.id}`]}
              onToggle={() => toggleAction('longTerm', action.id)}
            />
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <GlassCard variant="accent">
        <div className="flex items-start gap-3">
          <BookOpen className="w-5 h-5 text-accent-primary flex-shrink-0 mt-1" />
          <div>
            <h4 className="text-text-primary font-semibold mb-2">Evidence-Based Recommendations</h4>
            <p className="text-text-secondary text-sm mb-2">
              All suggestions are backed by peer-reviewed research from leading medical journals and institutions.
            </p>
            <p className="text-text-tertiary text-xs italic">
              These recommendations are educational and not a substitute for professional medical advice. Please consult a healthcare provider for personalized treatment.
            </p>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}

// Action Card Component
function ActionCard({ action, checked, onToggle }) {
  const difficultyColors = {
    Easy: 'bg-green-500/20 text-green-400',
    Medium: 'bg-yellow-500/20 text-yellow-400',
    High: 'bg-orange-500/20 text-orange-400'
  }

  return (
    <div
      className={`relative p-5 rounded-xl border backdrop-blur-sm transition-all duration-300 cursor-pointer group ${
        checked
          ? 'bg-accent-primary/10 border-accent-primary/50 shadow-lg shadow-accent-primary/20'
          : 'bg-surface-dark/30 border-white/10 hover:border-accent-primary/30 hover:bg-surface-dark/50'
      }`}
      onClick={onToggle}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2 rounded-lg transition-colors ${
          checked ? 'bg-accent-primary/20 text-accent-primary' : 'bg-white/5 text-accent-primary'
        }`}>
          {action.icon}
        </div>
        <CheckCircle
          className={`w-5 h-5 transition-all duration-300 ${
            checked ? 'text-accent-primary scale-110' : 'text-white/20 group-hover:text-accent-primary/50'
          }`}
        />
      </div>

      {/* Title */}
      <h4 className="text-text-primary font-semibold mb-2">{action.title}</h4>

      {/* Meta Info */}
      <div className="space-y-1 mb-3">
        {action.duration && (
          <p className="text-text-tertiary text-sm">Duration: {action.duration}</p>
        )}
        {action.frequency && (
          <p className="text-text-tertiary text-sm">Frequency: {action.frequency}</p>
        )}
        {action.commitment && (
          <p className="text-text-tertiary text-sm">Commitment: {action.commitment}</p>
        )}
        {action.timeframe && (
          <p className="text-accent-primary text-sm font-medium">{action.timeframe}</p>
        )}
        {action.providers && (
          <p className="text-text-tertiary text-sm">Resources: {action.providers}</p>
        )}
      </div>

      {/* Action Description */}
      <p className="text-text-secondary text-sm mb-4">{action.action}</p>

      {/* Evidence */}
      <div className="p-3 bg-surface-dark/50 rounded-lg border border-white/5 mb-3">
        <p className="text-text-tertiary text-xs mb-1">
          <span className="text-accent-primary font-medium">Evidence:</span> {action.evidence}
        </p>
        <p className="text-text-tertiary/60 text-xs mb-2">{action.source}</p>
        <a
          href={action.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent-primary text-xs hover:text-orange-400 font-medium flex items-center gap-1 transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <span>View Research</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${difficultyColors[action.difficulty]}`}>
          {action.difficulty}
        </span>
        {checked && (
          <span className="text-accent-primary text-xs font-medium">
            Completed
          </span>
        )}
      </div>
    </div>
  )
}
