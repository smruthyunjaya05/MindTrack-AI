import { useState, useEffect } from 'react'
import { getTimeline, getStats, clearHistory } from '../services/api'
import { Loader2, Trash2, TrendingDown, TrendingUp, Activity } from 'lucide-react'

export default function TimelinePage() {
  const [timeline, setTimeline] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    loadData()
  }, [])
  
  const loadData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const [timelineData, statsData] = await Promise.all([
        getTimeline(20),
        getStats()
      ])
      setTimeline(timelineData.analyses || [])
      setStats(statsData)
    } catch (err) {
      setError('Failed to load timeline data')
    } finally {
      setLoading(false)
    }
  }
  
  const handleClearHistory = async () => {
    if (!confirm('Are you sure you want to clear all history?')) return
    
    try {
      await clearHistory()
      setTimeline([])
      setStats({ total_analyses: 0, sentiment_distribution: {} })
    } catch (err) {
      alert('Failed to clear history')
    }
  }
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
      </div>
    )
  }
  
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Your Timeline</h1>
          <p className="text-gray-600">Track your emotional journey over time</p>
        </div>
        {timeline.length > 0 && (
          <button
            onClick={handleClearHistory}
            className="btn bg-red-100 text-red-700 hover:bg-red-200 flex items-center space-x-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear History</span>
          </button>
        )}
      </div>
      
      {/* Stats Cards */}
      {stats && stats.total_analyses > 0 && (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="card">
            <div className="flex items-center space-x-3">
              <Activity className="w-10 h-10 text-primary-600" />
              <div>
                <p className="text-sm text-gray-600">Total Analyses</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total_analyses}</p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-10 h-10 text-normal" />
              <div>
                <p className="text-sm text-gray-600">Normal</p>
                <p className="text-3xl font-bold text-normal">
                  {stats.sentiment_distribution.Normal || 0}
                </p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center space-x-3">
              <TrendingDown className="w-10 h-10 text-stressed" />
              <div>
                <p className="text-sm text-gray-600">Stressed/Depressed</p>
                <p className="text-3xl font-bold text-stressed">
                  {stats.sentiment_distribution['Stressed/Depressed'] || 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Error */}
      {error && (
        <div className="card bg-red-50 border-red-200 text-red-700">
          {error}
        </div>
      )}
      
      {/* Timeline */}
      {timeline.length === 0 ? (
        <div className="card text-center py-12">
          <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Analyses Yet</h3>
          <p className="text-gray-600 mb-6">
            Start analyzing your thoughts to see them appear here
          </p>
          <a href="/analyze" className="btn btn-primary">
            Analyze Now
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {timeline.map((analysis, index) => (
            <div
              key={index}
              className={`card hover:shadow-md transition-shadow ${
                analysis.sentiment === 'Normal'
                  ? 'border-l-4 border-normal'
                  : 'border-l-4 border-stressed'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center space-x-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      analysis.sentiment === 'Normal'
                        ? 'bg-normal-light text-normal-dark'
                        : 'bg-stressed-light text-stressed-dark'
                    }`}
                  >
                    {analysis.sentiment}
                  </span>
                  <span className="text-sm text-gray-500">
                    Confidence: {(analysis.confidence * 100).toFixed(1)}%
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(analysis.timestamp).toLocaleString()}
                </span>
              </div>
              <p className="text-gray-700 line-clamp-3">{analysis.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
