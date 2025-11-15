import { Download } from 'lucide-react'
import { useState } from 'react'
import SecondaryButton from './SecondaryButton'

export default function ShareButton({ result, text, urlPreview }) {
  const [exporting, setExporting] = useState(false)

  const exportCompleteReport = async () => {
    setExporting(true)
    
    try {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      // Larger canvas for comprehensive report
      canvas.width = 1200
      canvas.height = 3200
      
      // High-quality rendering
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
      
      // Helper function for rounded rectangles (define early)
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
      
      // Helper function for text wrapping
      function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
        const words = text.split(' ')
        let line = ''
        let currentY = y
        const lines = []
        
        for (let word of words) {
          const testLine = line + word + ' '
          const metrics = ctx.measureText(testLine)
          
          if (metrics.width > maxWidth && line !== '') {
            lines.push(line.trim())
            line = word + ' '
          } else {
            line = testLine
          }
        }
        if (line.trim()) {
          lines.push(line.trim())
        }
        
        lines.forEach(lineText => {
          ctx.fillText(lineText, x, currentY)
          currentY += lineHeight
        })
        
        return currentY
      }
      
      // ==================== DARK THEME BACKGROUND ====================
      const bgGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      bgGradient.addColorStop(0, '#0A0A0B')
      bgGradient.addColorStop(0.4, '#1A1A1B')
      bgGradient.addColorStop(0.7, '#0F0F10')
      bgGradient.addColorStop(1, '#0A0A0B')
      ctx.fillStyle = bgGradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Subtle grid pattern overlay
      ctx.strokeStyle = 'rgba(255, 125, 41, 0.03)'
      ctx.lineWidth = 1
      for (let i = 0; i < canvas.width; i += 50) {
        ctx.beginPath()
        ctx.moveTo(i, 0)
        ctx.lineTo(i, canvas.height)
        ctx.stroke()
      }
      for (let i = 0; i < canvas.height; i += 50) {
        ctx.beginPath()
        ctx.moveTo(0, i)
        ctx.lineTo(canvas.width, i)
        ctx.stroke()
      }
      
      // Top accent bar
      const accentGradient = ctx.createLinearGradient(0, 0, canvas.width, 0)
      accentGradient.addColorStop(0, '#FF7D29')
      accentGradient.addColorStop(1, '#FF9D29')
      ctx.fillStyle = accentGradient
      ctx.fillRect(0, 0, canvas.width, 8)
      
      const padding = 60
      let yPos = 80
      
      // ==================== HEADER WITH BRANDING ====================
      // Brain icon circle
      ctx.fillStyle = 'rgba(255, 125, 41, 0.2)'
      ctx.beginPath()
      ctx.arc(padding + 24, yPos, 32, 0, Math.PI * 2)
      ctx.fill()
      
      ctx.fillStyle = '#FF7D29'
      ctx.font = 'bold 28px system-ui, -apple-system, sans-serif'
      ctx.fillText('🧠', padding + 8, yPos + 12)
      
      // Brand text
      ctx.fillStyle = '#FFFFFF'
      ctx.font = 'bold 52px system-ui, -apple-system, sans-serif'
      ctx.fillText('MindTrack AI', padding + 75, yPos + 10)
      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
      ctx.font = '22px system-ui, -apple-system, sans-serif'
      ctx.fillText('Complete Mental Health Analysis Report', padding + 75, yPos + 42)
      
      // Timestamp
      const date = new Date().toLocaleString('en-US', { 
        month: 'short', day: 'numeric', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      })
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
      ctx.font = '18px system-ui, -apple-system, sans-serif'
      ctx.fillText(`Generated: ${date}`, padding + 75, yPos + 68)
      
      yPos += 130
      
      // ==================== GLASSMORPHIC STATUS CARD ====================
      const cardWidth = canvas.width - (padding * 2)
      
      // Card shadow
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'
      ctx.shadowBlur = 40
      ctx.shadowOffsetY = 10
      
      // Card background with glassmorphism
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)'
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
      ctx.lineWidth = 2
      roundRect(ctx, padding, yPos, cardWidth, 220, 20)
      ctx.fill()
      ctx.stroke()
      
      // Reset shadow
      ctx.shadowColor = 'transparent'
      ctx.shadowBlur = 0
      ctx.shadowOffsetY = 0
      
      const cardPadding = 40
      let cardY = yPos + cardPadding
      
      // Status icon with background circle
      const isNormal = result.sentiment === 'Normal'
      const statusColor = isNormal ? '#10B981' : '#EF4444'
      
      ctx.fillStyle = isNormal ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'
      ctx.beginPath()
      ctx.arc(padding + cardPadding + 35, cardY + 35, 35, 0, Math.PI * 2)
      ctx.fill()
      
      ctx.fillStyle = statusColor
      ctx.font = 'bold 36px system-ui, -apple-system, sans-serif'
      ctx.fillText(isNormal ? '✓' : '⚠', padding + cardPadding + 21, cardY + 48)
      
      // Status label
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
      ctx.font = '18px system-ui, -apple-system, sans-serif'
      ctx.fillText('DETECTION STATUS', padding + cardPadding + 90, cardY + 15)
      
      // Sentiment status
      ctx.fillStyle = statusColor
      ctx.font = 'bold 64px system-ui, -apple-system, sans-serif'
      ctx.fillText(result.sentiment.toUpperCase(), padding + cardPadding + 90, cardY + 70)
      
      cardY += 95
      
      // Description
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
      ctx.font = '22px system-ui, -apple-system, sans-serif'
      const description = isNormal 
        ? 'Emotional state appears healthy and balanced'
        : 'Indicators of stress or emotional distress detected'
      ctx.fillText(description, padding + cardPadding, cardY)
      
      cardY += 45
      
      // Divider line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(padding + cardPadding, cardY)
      ctx.lineTo(padding + cardWidth - cardPadding, cardY)
      ctx.stroke()
      
      cardY += 40
      
      // Stats grid (3 columns)
      const statWidth = (cardWidth - (cardPadding * 2)) / 3
      const statsX = padding + cardPadding
      
      // Confidence
      ctx.fillStyle = '#FF7D29'
      ctx.font = 'bold 52px system-ui, -apple-system, sans-serif'
      ctx.fillText(`${Math.round(result.confidence * 100)}%`, statsX, cardY)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
      ctx.font = '16px system-ui, -apple-system, sans-serif'
      ctx.fillText('Confidence', statsX, cardY + 28)
      
      // Model
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
      ctx.font = 'bold 26px system-ui, -apple-system, sans-serif'
      ctx.fillText('DistilBERT', statsX + statWidth, cardY)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
      ctx.font = '16px system-ui, -apple-system, sans-serif'
      ctx.fillText('66.9M params', statsX + statWidth, cardY + 28)
      
      // Dataset
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
      ctx.font = 'bold 26px system-ui, -apple-system, sans-serif'
      ctx.fillText('359K posts', statsX + (statWidth * 2), cardY)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
      ctx.font = '16px system-ui, -apple-system, sans-serif'
      ctx.fillText('Training Data', statsX + (statWidth * 2), cardY + 28)
      
      yPos += 280
      
      // ==================== KEY INDICATORS SECTION ====================
      if ((result.detected_emotions && result.detected_emotions.length > 0) ||
          (result.key_concerns && result.key_concerns.length > 0)) {
        
        // Section header
        ctx.fillStyle = '#FFFFFF'
        ctx.font = 'bold 36px system-ui, -apple-system, sans-serif'
        ctx.fillText('Key Indicators', padding, yPos)
        
        yPos += 20
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
        ctx.font = '18px system-ui, -apple-system, sans-serif'
        ctx.fillText('Detected patterns from your content', padding, yPos)
        
        yPos += 50
        
        // Glassmorphic card for indicators
        const indicatorCardHeight = Math.min(300, 60 + Math.max(
          (result.detected_emotions || []).length, 
          (result.key_concerns || []).length
        ) * 45)
        
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)'
        ctx.shadowBlur = 30
        ctx.shadowOffsetY = 8
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)'
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
        ctx.lineWidth = 2
        roundRect(ctx, padding, yPos, cardWidth, indicatorCardHeight, 16)
        ctx.fill()
        ctx.stroke()
        
        ctx.shadowColor = 'transparent'
        ctx.shadowBlur = 0
        
        let indicatorY = yPos + 40
        const indicatorX = padding + 35
        const columnWidth = cardWidth / 2 - 70
        
        // Emotions column
        if (result.detected_emotions && result.detected_emotions.length > 0) {
          ctx.fillStyle = '#FF7D29'
          ctx.font = 'bold 22px system-ui, -apple-system, sans-serif'
          ctx.fillText('Emotions', indicatorX, indicatorY)
          
          indicatorY += 35
          
          result.detected_emotions.slice(0, 5).forEach(emotion => {
            ctx.fillStyle = 'rgba(255, 125, 41, 0.6)'
            ctx.beginPath()
            ctx.arc(indicatorX + 6, indicatorY - 6, 4, 0, Math.PI * 2)
            ctx.fill()
            
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
            ctx.font = '20px system-ui, -apple-system, sans-serif'
            // Truncate long emotions to fit column
            const emotionText = emotion.length > 25 ? emotion.substring(0, 22) + '...' : emotion
            ctx.fillText(emotionText, indicatorX + 20, indicatorY)
            indicatorY += 38
          })
        }
        
        // Concerns column (if space)
        if (result.key_concerns && result.key_concerns.length > 0 && indicatorCardHeight > 200) {
          indicatorY = yPos + 40
          const concernX = padding + cardWidth / 2 + 20
          
          ctx.fillStyle = '#FF7D29'
          ctx.font = 'bold 22px system-ui, -apple-system, sans-serif'
          ctx.fillText('Concerns', concernX, indicatorY)
          
          indicatorY += 35
          
          result.key_concerns.slice(0, 5).forEach(concern => {
            ctx.fillStyle = 'rgba(255, 125, 41, 0.6)'
            ctx.beginPath()
            ctx.arc(concernX + 6, indicatorY - 6, 4, 0, Math.PI * 2)
            ctx.fill()
            
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
            ctx.font = '20px system-ui, -apple-system, sans-serif'
            // Truncate long concerns to fit column
            const concernText = concern.length > 25 ? concern.substring(0, 22) + '...' : concern
            ctx.fillText(concernText, concernX + 20, indicatorY)
            indicatorY += 38
          })
        }
        
        yPos += indicatorCardHeight + 60
      }
      
      // ==================== AI RECOMMENDATIONS SECTION ====================
      if (result.ai_suggestions && result.ai_suggestions.length > 0) {
        // Section header
        ctx.fillStyle = '#FFFFFF'
        ctx.font = 'bold 36px system-ui, -apple-system, sans-serif'
        ctx.fillText('AI-Powered Recommendations', padding, yPos)
        
        yPos += 20
        
        ctx.fillStyle = result.ai_generated ? '#10B981' : 'rgba(255, 255, 255, 0.5)'
        ctx.font = '18px system-ui, -apple-system, sans-serif'
        ctx.fillText(result.ai_generated ? '✓ Generated by Google Gemini AI' : 'Standard recommendations', padding, yPos)
        
        yPos += 50
        
        // Each suggestion in its own glassmorphic card
        result.ai_suggestions.slice(0, 3).forEach((suggestion, index) => {
          if (yPos > canvas.height - 600) return // Stop if too close to bottom
          
          // Calculate card height based on content length more accurately
          let estimatedHeight = 180
          if (suggestion.description) {
            const descLines = Math.ceil((suggestion.description.length * 12) / (cardWidth - 100))
            estimatedHeight += descLines * 34
          }
          if (suggestion.rationale) {
            const ratioLines = Math.ceil((suggestion.rationale.length * 10) / (cardWidth - 100))
            estimatedHeight += ratioLines * 30 + 20
          }
          estimatedHeight = Math.min(estimatedHeight, 400) // Cap at 400px per card
          
          // Glassmorphic card
          ctx.shadowColor = 'rgba(0, 0, 0, 0.3)'
          ctx.shadowBlur = 25
          ctx.shadowOffsetY = 8
          
          ctx.fillStyle = 'rgba(255, 255, 255, 0.05)'
          ctx.strokeStyle = 'rgba(255, 255, 41, 0.1)'
          ctx.lineWidth = 2
          roundRect(ctx, padding, yPos, cardWidth, estimatedHeight, 16)
          ctx.fill()
          ctx.stroke()
          
          ctx.shadowColor = 'transparent'
          
          let suggestionY = yPos + 35
          const suggestionX = padding + 35
          
          // Priority badge
          const priorityColors = {
            'critical': '#EF4444',
            'high': '#F59E0B',
            'medium': '#3B82F6',
            'low': '#6B7280'
          }
          const priorityColor = priorityColors[suggestion.priority] || '#FF7D29'
          
          ctx.fillStyle = `${priorityColor}40`
          roundRect(ctx, suggestionX, suggestionY - 8, 90, 32, 16)
          ctx.fill()
          
          ctx.fillStyle = priorityColor
          ctx.font = 'bold 16px system-ui, -apple-system, sans-serif'
          ctx.fillText((suggestion.priority || 'Priority').toUpperCase(), suggestionX + 12, suggestionY + 12)
          
          // Title
          ctx.fillStyle = '#FFFFFF'
          ctx.font = 'bold 28px system-ui, -apple-system, sans-serif'
          const titleText = `${index + 1}. ${suggestion.title}`
          ctx.fillText(titleText.length > 45 ? titleText.substring(0, 42) + '...' : titleText, suggestionX, suggestionY + 60)
          
          suggestionY += 90
          
          // Description (wrapped using helper)
          if (suggestion.description) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
            ctx.font = '20px system-ui, -apple-system, sans-serif'
            
            const maxWidth = cardWidth - 100
            suggestionY = wrapText(ctx, suggestion.description, suggestionX, suggestionY, maxWidth, 34)
            suggestionY += 20
          }
          
          // Rationale (if available and space)
          if (suggestion.rationale && suggestionY < yPos + estimatedHeight - 40) {
            ctx.fillStyle = 'rgba(255, 125, 41, 0.8)'
            ctx.font = 'italic 18px system-ui, -apple-system, sans-serif'
            
            const maxWidth = cardWidth - 100
            suggestionY = wrapText(ctx, `💡 ${suggestion.rationale}`, suggestionX, suggestionY, maxWidth, 30)
          }
          
          yPos += estimatedHeight + 30
        })
        
        yPos += 30
      }
      
      // ==================== IMMEDIATE ACTIONS SECTION ====================
      if (result.immediate_actions && result.immediate_actions.length > 0 && yPos < canvas.height - 500) {
        // Section header
        ctx.fillStyle = '#FFFFFF'
        ctx.font = 'bold 36px system-ui, -apple-system, sans-serif'
        ctx.fillText('Take Action Now', padding, yPos)
        
        yPos += 20
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
        ctx.font = '18px system-ui, -apple-system, sans-serif'
        ctx.fillText('Quick steps you can do right now', padding, yPos)
        
        yPos += 50
        
        // Actions card
        const actionsHeight = Math.min(400, 80 + result.immediate_actions.length * 60)
        
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)'
        ctx.shadowBlur = 25
        ctx.shadowOffsetY = 8
        
        ctx.fillStyle = 'rgba(255, 125, 41, 0.08)'
        ctx.strokeStyle = 'rgba(255, 125, 41, 0.3)'
        ctx.lineWidth = 2
        roundRect(ctx, padding, yPos, cardWidth, actionsHeight, 16)
        ctx.fill()
        ctx.stroke()
        
        ctx.shadowColor = 'transparent'
        
        let actionY = yPos + 45
        const actionX = padding + 40
        
        result.immediate_actions.slice(0, 4).forEach((action, index) => {
          if (actionY > yPos + actionsHeight - 50) return
          
          // Number badge with circle
          ctx.fillStyle = '#FF7D29'
          ctx.beginPath()
          ctx.arc(actionX + 18, actionY - 6, 18, 0, Math.PI * 2)
          ctx.fill()
          
          ctx.fillStyle = '#FFFFFF'
          ctx.font = 'bold 20px system-ui, -apple-system, sans-serif'
          ctx.textAlign = 'center'
          ctx.fillText(`${index + 1}`, actionX + 18, actionY + 2)
          ctx.textAlign = 'left'
          
          // Action text (wrapped using helper)
          ctx.fillStyle = 'rgba(255, 255, 255, 0.95)'
          ctx.font = '22px system-ui, -apple-system, sans-serif'
          
          const maxWidth = cardWidth - 120
          const endY = wrapText(ctx, action, actionX + 50, actionY, maxWidth, 32)
          
          actionY = endY + 38
        })
        
        yPos += actionsHeight + 50
      }
      
      // ==================== FOOTER SECTION ====================
      yPos = Math.max(yPos, canvas.height - 200)
      
      // Footer accent line
      const footerGradient = ctx.createLinearGradient(padding, yPos, canvas.width - padding, yPos)
      footerGradient.addColorStop(0, 'rgba(255, 125, 41, 0)')
      footerGradient.addColorStop(0.5, 'rgba(255, 125, 41, 0.5)')
      footerGradient.addColorStop(1, 'rgba(255, 125, 41, 0)')
      ctx.strokeStyle = footerGradient
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(padding, yPos)
      ctx.lineTo(canvas.width - padding, yPos)
      ctx.stroke()
      
      yPos += 45
      
      // Disclaimer (wrapped for safety)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)'
      ctx.font = '17px system-ui, -apple-system, sans-serif'
      const disclaimer1 = '⚠️  This report is for informational purposes only and not a substitute for professional medical advice.'
      yPos = wrapText(ctx, disclaimer1, padding, yPos, cardWidth, 32)
      
      yPos += 10
      const disclaimer2 = 'If you\'re in crisis, please contact a mental health professional or emergency services.'
      yPos = wrapText(ctx, disclaimer2, padding, yPos, cardWidth, 32)
      
      yPos += 50
      
      // Branding footer
      ctx.fillStyle = '#FF7D29'
      ctx.font = 'bold 20px system-ui, -apple-system, sans-serif'
      ctx.fillText('MindTrack AI', padding, yPos)
      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
      ctx.font = '16px system-ui, -apple-system, sans-serif'
      ctx.textAlign = 'right'
      ctx.fillText('mindtrack.ai', canvas.width - padding, yPos)
      
      // Convert to PNG and download
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `mindtrack-complete-report-${Date.now()}.png`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        setExporting(false)
      }, 'image/png', 1.0)
      
    } catch (error) {
      console.error('Export failed:', error)
      alert('Failed to export report. Please try again.')
      setExporting(false)
    }
  }

  return (
    <SecondaryButton
      onClick={exportCompleteReport}
      disabled={exporting}
    >
      <Download className="w-4 h-4" />
      <span>{exporting ? 'Generating Report...' : 'Export Complete Report'}</span>
    </SecondaryButton>
  )
}
