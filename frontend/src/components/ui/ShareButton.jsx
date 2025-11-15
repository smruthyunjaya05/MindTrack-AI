import { useState } from 'react'
import { Share2, Download, Check, X } from 'lucide-react'
import SecondaryButton from './SecondaryButton'
import GlassCard from './GlassCard'

export default function ShareButton({ result, text, urlPreview }) {
  const [showModal, setShowModal] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [exported, setExported] = useState(false)

  const handleExport = async () => {
    setExporting(true)
    
    try {
      // Create a canvas element
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      // Set canvas size (1200x630 - optimal for social media)
      const width = 1200
      const height = 630
      canvas.width = width
      canvas.height = height
      
      // Enable better text rendering
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
      
      // Background gradient (dark theme)
      const bgGradient = ctx.createLinearGradient(0, 0, width, height)
      bgGradient.addColorStop(0, '#0A0A0B')
      bgGradient.addColorStop(0.5, '#1A1A1B')
      bgGradient.addColorStop(1, '#0A0A0B')
      ctx.fillStyle = bgGradient
      ctx.fillRect(0, 0, width, height)
      
      // Add subtle grid pattern overlay
      ctx.strokeStyle = 'rgba(255, 125, 41, 0.03)'
      ctx.lineWidth = 1
      for (let i = 0; i < width; i += 50) {
        ctx.beginPath()
        ctx.moveTo(i, 0)
        ctx.lineTo(i, height)
        ctx.stroke()
      }
      for (let i = 0; i < height; i += 50) {
        ctx.beginPath()
        ctx.moveTo(0, i)
        ctx.lineTo(width, i)
        ctx.stroke()
      }
      
      // Top accent bar with gradient
      const accentGradient = ctx.createLinearGradient(0, 0, width, 0)
      accentGradient.addColorStop(0, '#FF7D29')
      accentGradient.addColorStop(1, '#FF9D29')
      ctx.fillStyle = accentGradient
      ctx.fillRect(0, 0, width, 6)
      
      // Brand section (top-left)
      const padding = 60
      
      // Draw brain icon circle
      ctx.fillStyle = 'rgba(255, 125, 41, 0.2)'
      ctx.beginPath()
      ctx.arc(padding + 20, 70, 28, 0, Math.PI * 2)
      ctx.fill()
      
      ctx.fillStyle = '#FF7D29'
      ctx.font = 'bold 24px system-ui, -apple-system, sans-serif'
      ctx.fillText('🧠', padding + 6, 82)
      
      // Brand text
      ctx.fillStyle = '#FFFFFF'
      ctx.font = 'bold 42px system-ui, -apple-system, sans-serif'
      ctx.fillText('MindTrack AI', padding + 60, 80)
      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
      ctx.font = '18px system-ui, -apple-system, sans-serif'
      ctx.fillText('Mental Health Analysis Report', padding + 60, 105)
      
      // Main result card with glassmorphic effect
      const cardX = padding
      const cardY = 150
      const cardWidth = width - (padding * 2)
      const cardHeight = 400
      
      // Card shadow
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'
      ctx.shadowBlur = 40
      ctx.shadowOffsetX = 0
      ctx.shadowOffsetY = 10
      
      // Card background
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)'
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
      ctx.lineWidth = 2
      roundRect(ctx, cardX, cardY, cardWidth, cardHeight, 24)
      ctx.fill()
      ctx.stroke()
      
      // Reset shadow
      ctx.shadowColor = 'transparent'
      ctx.shadowBlur = 0
      ctx.shadowOffsetX = 0
      ctx.shadowOffsetY = 0
      
      // Inner card content padding
      const innerPadding = 40
      let currentY = cardY + innerPadding
      
      // Result status with icon
      const isNormal = result.sentiment === 'Normal'
      const statusColor = isNormal ? '#10B981' : '#EF4444'
      
      // Status icon
      ctx.fillStyle = isNormal ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'
      ctx.beginPath()
      ctx.arc(cardX + innerPadding + 30, currentY + 30, 30, 0, Math.PI * 2)
      ctx.fill()
      
      ctx.fillStyle = statusColor
      ctx.font = 'bold 32px system-ui, -apple-system, sans-serif'
      ctx.fillText(isNormal ? '✓' : '⚠', cardX + innerPadding + 18, currentY + 42)
      
      // Status text
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
      ctx.font = '16px system-ui, -apple-system, sans-serif'
      ctx.fillText('DETECTION STATUS', cardX + innerPadding + 80, currentY + 15)
      
      ctx.fillStyle = statusColor
      ctx.font = 'bold 56px system-ui, -apple-system, sans-serif'
      ctx.fillText(result.sentiment.toUpperCase(), cardX + innerPadding + 80, currentY + 60)
      
      currentY += 100
      
      // Description text
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
      ctx.font = '20px system-ui, -apple-system, sans-serif'
      const description = isNormal 
        ? 'Emotional state appears healthy and balanced'
        : 'Indicators of stress or emotional distress detected'
      ctx.fillText(description, cardX + innerPadding, currentY)
      
      currentY += 50
      
      // Divider line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(cardX + innerPadding, currentY)
      ctx.lineTo(cardX + cardWidth - innerPadding, currentY)
      ctx.stroke()
      
      currentY += 40
      
      // Stats section in a grid
      const statsStartX = cardX + innerPadding
      const statWidth = (cardWidth - (innerPadding * 2)) / 3
      
      // Confidence stat
      ctx.fillStyle = '#FF7D29'
      ctx.font = 'bold 48px system-ui, -apple-system, sans-serif'
      ctx.fillText(`${Math.round(result.confidence * 100)}%`, statsStartX, currentY)
      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
      ctx.font = '16px system-ui, -apple-system, sans-serif'
      ctx.fillText('Confidence', statsStartX, currentY + 28)
      
      // Model stat
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
      ctx.font = 'bold 24px system-ui, -apple-system, sans-serif'
      ctx.fillText('DistilBERT', statsStartX + statWidth, currentY)
      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
      ctx.font = '16px system-ui, -apple-system, sans-serif'
      ctx.fillText('66.9M parameters', statsStartX + statWidth, currentY + 28)
      
      // Dataset stat
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
      ctx.font = 'bold 24px system-ui, -apple-system, sans-serif'
      ctx.fillText('359K posts', statsStartX + (statWidth * 2), currentY)
      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
      ctx.font = '16px system-ui, -apple-system, sans-serif'
      ctx.fillText('Training Data', statsStartX + (statWidth * 2), currentY + 28)
      
      currentY += 70
      
      // URL preview badge if available
      if (urlPreview) {
        const badgeX = cardX + innerPadding
        const badgeY = currentY
        const badgeWidth = cardWidth - (innerPadding * 2)
        const badgeHeight = 70
        
        // Badge background
        ctx.fillStyle = 'rgba(255, 125, 41, 0.15)'
        ctx.strokeStyle = 'rgba(255, 125, 41, 0.3)'
        ctx.lineWidth = 1
        roundRect(ctx, badgeX, badgeY, badgeWidth, badgeHeight, 12)
        ctx.fill()
        ctx.stroke()
        
        // Platform icon
        ctx.fillStyle = '#FF7D29'
        ctx.font = '24px system-ui, -apple-system, sans-serif'
        ctx.fillText('🔗', badgeX + 20, badgeY + 35)
        
        // Platform name
        ctx.fillStyle = '#FF7D29'
        ctx.font = 'bold 18px system-ui, -apple-system, sans-serif'
        ctx.fillText(`Source: ${urlPreview.platform}`, badgeX + 60, badgeY + 30)
        
        // Author
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
        ctx.font = '16px system-ui, -apple-system, sans-serif'
        ctx.fillText(`@${urlPreview.author}`, badgeX + 60, badgeY + 52)
      }
      
      // Footer with timestamp
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
      ctx.font = '14px system-ui, -apple-system, sans-serif'
      const timestamp = new Date(result.timestamp).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
      ctx.fillText(`Generated on ${timestamp}`, padding, cardY + cardHeight + 30)
      
      // Watermark
      ctx.fillStyle = 'rgba(255, 125, 41, 0.3)'
      ctx.font = '14px system-ui, -apple-system, sans-serif'
      ctx.textAlign = 'right'
      ctx.fillText('mindtrack.ai', width - padding, cardY + cardHeight + 30)
      ctx.textAlign = 'left'
      
      // Convert to blob and download
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.download = `mindtrack-analysis-${Date.now()}.png`
        link.href = url
        link.click()
        URL.revokeObjectURL(url)
        
        setExported(true)
        setTimeout(() => {
          setExported(false)
          setShowModal(false)
        }, 2000)
      }, 'image/png', 1.0)
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setExporting(false)
    }
  }

  // Helper function to draw rounded rectangles
  function roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath()
    ctx.moveTo(x + radius, y)
    ctx.lineTo(x + width - radius, y)
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
    ctx.lineTo(x + width, y + height - radius)
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
    ctx.lineTo(x + radius, y + height)
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
    ctx.lineTo(x, y + radius)
    ctx.quadraticCurveTo(x, y, x + radius, y)
    ctx.closePath()
  }

  return (
    <>
      <SecondaryButton
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2"
      >
        <Share2 className="w-4 h-4" />
        <span>Share Results</span>
      </SecondaryButton>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <GlassCard className="max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="heading-card">Share Your Results</h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-text-tertiary" />
              </button>
            </div>

            <p className="text-text-secondary mb-6">
              Export your mental health analysis as a beautiful image to share with your therapist, 
              doctor, or save for your records.
            </p>

            <div className="space-y-3">
              <button
                onClick={handleExport}
                disabled={exporting || exported}
                className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-medium transition-all ${
                  exported
                    ? 'bg-green-500/20 text-green-400 border-2 border-green-500/50'
                    : 'bg-accent-primary hover:bg-orange-600 text-white border-2 border-accent-primary'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {exported ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Downloaded Successfully!</span>
                  </>
                ) : exporting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Generating Image...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    <span>Download as Image</span>
                  </>
                )}
              </button>

              <div className="p-4 bg-surface-dark/50 rounded-lg border border-white/5">
                <p className="text-text-tertiary text-sm">
                  <span className="text-accent-primary font-medium">Privacy Note:</span> This image is 
                  generated locally in your browser. Your data is never uploaded to our servers.
                </p>
              </div>
            </div>
          </GlassCard>
        </div>
      )}
    </>
  )
}
