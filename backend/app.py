"""
Flask Backend for MindTrack AI
Provides API endpoints for URL extraction and mental health analysis
"""

import sys
import os
from pathlib import Path

# Add backend directory to Python path for imports
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import traceback

from services.url_extractor import URLExtractorService
from services.model_service import model_service
from services.ai_service import ai_service

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Configure CORS - Allow frontend to make requests
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

# Initialize services
url_extractor = URLExtractorService()

# Load AI model on startup
print("\n" + "="*70)
print("INITIALIZING MINDTRACK AI BACKEND")
print("="*70)
model_service.load_model()


def analyze_text_context(text):
    """
    Analyze text for emotional context, tone, and provide AI-generated suggestions
    Uses trained DistilBERT model for accurate sentiment classification
    """
    import re
    
    text_lower = text.lower()
    
    # Get AI prediction from DistilBERT model
    bert_prediction = model_service.predict(text)
    
    # Mental health keyword validation (to reduce false positives)
    mental_health_keywords = [
        # Depression
        'depressed', 'hopeless', 'worthless', 'empty', 'numb', 'lonely', 'isolated', 
        'giving up', 'no point', 'meaningless', 'sad', 'unhappy', 'miserable',
        # Anxiety
        'anxious', 'worried', 'panic', 'nervous', 'scared', 'terrified', 'fear', 
        'cant breathe', 'overwhelming', 'anxiety', 'nervous breakdown',
        # Stress
        'stressed', 'overwhelmed', 'pressure', 'burden', 'exhausted', 'tired', 
        'cant cope', 'too much', 'breaking down', 'burnout',
        # Crisis
        'suicide', 'suicidal', 'kill myself', 'end it', 'dont want to live', 
        'better off dead', 'cant do this anymore', 'want to die',
        # Emotions
        'crying', 'tears', 'sobbing', 'hurt', 'pain', 'suffering', 'anguish',
        'despair', 'desperate', 'helpless', 'broken'
    ]
    
    # Check if text contains mental health indicators
    has_mental_health_keywords = any(keyword in text_lower for keyword in mental_health_keywords)
    
    if bert_prediction:
        # Use BERT model prediction
        raw_sentiment = bert_prediction['sentiment']
        confidence = bert_prediction['confidence']
        prediction_source = 'AI Model (DistilBERT)'
        
        # Apply intelligent filtering:
        # If model says "Stressed" with high confidence but no mental health keywords,
        # it's likely a false positive (e.g., MBA fees complaint)
        if raw_sentiment == "Stressed" and confidence > 0.90 and not has_mental_health_keywords:
            # Override to Normal - calculate adjusted confidence
            sentiment = "Normal"
            # Since we're overriding a false positive, use moderate confidence
            # Map the model's stressed confidence to normal confidence
            # High stressed confidence (99%) -> High normal confidence (85-90%)
            confidence = 0.85 + (confidence - 0.90) * 0.5  # Maps 90-100% stressed to 85-90% normal
            confidence = min(0.95, max(0.75, confidence))  # Clamp between 75-95%
            prediction_source = 'AI Model (DistilBERT) - Keyword Validated'
        else:
            sentiment = raw_sentiment
    else:
        # Fallback to keyword-based analysis if model not available
        if has_mental_health_keywords:
            sentiment = "Stressed"
            confidence = 0.75
        else:
            sentiment = "Normal"
            confidence = 0.80
        prediction_source = 'Keyword Analysis'
    
    # Emotion detection patterns (enhanced context analysis)
    emotion_patterns = {
        'depression': ['depressed', 'hopeless', 'worthless', 'empty', 'numb', 'lonely', 'isolated', 'giving up', 'no point', 'meaningless'],
        'anxiety': ['anxious', 'worried', 'panic', 'nervous', 'scared', 'terrified', 'fear', 'cant breathe', 'overwhelming'],
        'stress': ['stressed', 'overwhelmed', 'pressure', 'burden', 'exhausted', 'tired', 'cant cope', 'too much'],
        'suicidal': ['suicide', 'suicidal', 'kill myself', 'end it', 'dont want to live', 'better off dead', 'cant do this anymore'],
        'anger': ['angry', 'furious', 'hate', 'rage', 'frustrated', 'pissed'],
        'grief': ['loss', 'died', 'death', 'grief', 'mourning', 'miss them', 'gone'],
        'trauma': ['traumatic', 'ptsd', 'flashback', 'nightmare', 'haunted', 'triggered']
    }
    
    # Detect emotions
    detected_emotions = []
    emotion_scores = {}
    
    for emotion, keywords in emotion_patterns.items():
        matches = sum(1 for keyword in keywords if keyword in text_lower)
        if matches > 0:
            detected_emotions.append(emotion)
            emotion_scores[emotion] = matches
    
    # Determine primary emotion
    if detected_emotions:
        primary_emotion = max(emotion_scores, key=emotion_scores.get)
        # If BERT detected stress/depression, prioritize the keyword emotion
        if sentiment == "Stressed" and not detected_emotions:
            detected_emotions = ["stress"]
    else:
        primary_emotion = "neutral"
        if sentiment == "Normal":
            detected_emotions = ["positive"]
        else:
            detected_emotions = ["stress"]
    
    # Tone analysis
    tone_indicators = {
        'urgent': ['help', 'please', 'now', 'cant', 'urgent', 'emergency'],
        'desperate': ['desperate', 'hopeless', 'helpless', 'lost', 'broken'],
        'seeking_help': ['need help', 'what should i do', 'how do i', 'advice', 'suggestions'],
        'isolated': ['alone', 'nobody', 'no one', 'isolated', 'lonely'],
        'overwhelmed': ['too much', 'cant handle', 'overwhelming', 'drowning']
    }
    
    tone_analysis = []
    for tone, indicators in tone_indicators.items():
        if any(indicator in text_lower for indicator in indicators):
            tone_analysis.append(tone)
    
    # Extract key concerns from text
    # Only detect concerns if there's actual stress/mental health indicators
    concerns = []
    
    # Only analyze concerns if person is actually stressed/depressed
    if sentiment == "Stressed" or has_mental_health_keywords:
        concern_patterns = {
            'work_stress': ['work stress', 'job stress', 'boss', 'workload', 'deadline pressure', 'workplace', 'burnout', 'overworked'],
            'relationships': ['relationship', 'partner', 'spouse', 'breakup', 'divorce', 'lonely', 'alone'],
            'health': ['sick', 'ill', 'pain', 'disease', 'medical'],
            'financial': ['money stress', 'debt', 'bills', 'financial stress', 'broke', 'cant afford'],
            'academic': ['exam stress', 'grades stress', 'study pressure', 'assignment stress', 'academic pressure'],
            'sleep': ['sleep', 'insomnia', 'cant sleep', 'nightmares'],
            'eating': ['eating disorder', 'appetite', 'weight', 'not eating']
        }
        
        for concern, keywords in concern_patterns.items():
            if any(keyword in text_lower for keyword in keywords):
                concerns.append(concern.replace('_', ' ').title())
    
    # Generate AI-powered recommendations via Google Gemini
    ai_result = ai_service.generate_recommendations(
        text=text,
        sentiment=sentiment,
        confidence=confidence,
        emotions=detected_emotions,
        concerns=concerns,
        tone=tone_analysis
    )
    
    # Use AI results if available, otherwise fallback to hardcoded
    if ai_result:
        suggestions = ai_result.get('suggestions', [])
        immediate_actions = ai_result.get('immediate_actions', [])
        ai_generated = ai_result.get('ai_generated', True)
    else:
        # Fallback to hardcoded recommendations if Gemini fails
        suggestions = generate_contextual_suggestions(primary_emotion, tone_analysis, concerns, text_lower)
        immediate_actions = generate_immediate_actions(primary_emotion, tone_analysis)
        ai_generated = False
    
    result = {
        'sentiment': sentiment,
        'confidence': confidence,
        'categories': detected_emotions,
        'emotions': detected_emotions,
        'concerns': concerns if concerns else ["General wellness"],
        'tone': tone_analysis if tone_analysis else ["calm"],
        'suggestions': suggestions,
        'immediate_actions': immediate_actions,
        'ai_generated': ai_generated,
        'prediction_source': prediction_source
    }
    
    # Add BERT probabilities if available
    if bert_prediction and 'probabilities' in bert_prediction:
        result['probabilities'] = bert_prediction['probabilities']
    
    return result


def generate_contextual_suggestions(emotion, tone, concerns, text):
    """Generate personalized AI suggestions based on emotional context"""
    suggestions = []
    
    # Crisis-level suggestions
    if emotion == 'suicidal' or 'desperate' in tone:
        suggestions.extend([
            {
                'priority': 'critical',
                'title': 'Reach Out for Immediate Help',
                'description': 'Your safety is the top priority. Please contact a crisis helpline immediately (988 in USA).',
                'rationale': 'Professional crisis counselors are trained to help in situations like yours and are available 24/7.'
            },
            {
                'priority': 'critical',
                'title': 'Don\'t Stay Alone Right Now',
                'description': 'Call a trusted friend, family member, or go to a public place. Physical presence of others can provide immediate safety.',
                'rationale': 'Social connection during crisis moments has been shown to significantly reduce risk and provide emotional grounding.'
            }
        ])
    
    # Depression-specific suggestions
    if emotion == 'depression':
        suggestions.extend([
            {
                'priority': 'high',
                'title': 'Start with One Small Action',
                'description': 'Choose just one small task today - make your bed, take a 5-minute walk, or drink a glass of water.',
                'rationale': 'Depression makes everything feel impossible. Small wins create momentum and prove you can still take action.'
            },
            {
                'priority': 'high',
                'title': 'Schedule a Therapy Session',
                'description': 'Consider reaching out to a mental health professional. Cognitive Behavioral Therapy (CBT) has strong evidence for treating depression.',
                'rationale': 'Professional support provides structured approaches to address underlying patterns and develop coping strategies.'
            },
            {
                'priority': 'medium',
                'title': 'Get Sunlight Exposure',
                'description': 'Spend 15-30 minutes outdoors in natural sunlight, especially in the morning.',
                'rationale': 'Sunlight helps regulate circadian rhythm and boosts serotonin production, which is often low in depression.'
            }
        ])
    
    # Anxiety-specific suggestions
    if emotion == 'anxiety':
        suggestions.extend([
            {
                'priority': 'high',
                'title': 'Practice Grounding Techniques',
                'description': 'Use the 5-4-3-2-1 method: Name 5 things you see, 4 you feel, 3 you hear, 2 you smell, 1 you taste.',
                'rationale': 'Grounding techniques interrupt anxiety spirals by bringing your focus back to the present moment.'
            },
            {
                'priority': 'high',
                'title': 'Box Breathing Exercise',
                'description': 'Breathe in for 4 counts, hold for 4, out for 4, hold for 4. Repeat for 5 minutes.',
                'rationale': 'This technique activates your parasympathetic nervous system, physically calming your anxiety response.'
            },
            {
                'priority': 'medium',
                'title': 'Write Down Your Worries',
                'description': 'Set aside 15 minutes to write all your anxious thoughts. Then schedule a time tomorrow to address them.',
                'rationale': 'Externalizing worries reduces mental load and helps distinguish between productive and unproductive anxiety.'
            }
        ])
    
    # Stress-specific suggestions
    if emotion == 'stress':
        suggestions.extend([
            {
                'priority': 'high',
                'title': 'Prioritize and Delegate',
                'description': 'List everything overwhelming you. Identify top 3 priorities and see what can be delegated, delayed, or dropped.',
                'rationale': 'Stress often comes from feeling everything is urgent. Prioritization reduces cognitive load and creates clarity.'
            },
            {
                'priority': 'medium',
                'title': 'Take Strategic Breaks',
                'description': 'Use the Pomodoro technique: 25 minutes focused work, then 5-minute break. Every 4 cycles, take 15-30 minutes.',
                'rationale': 'Regular breaks prevent burnout and actually improve productivity by maintaining mental freshness.'
            }
        ])
    
    # Work-related concerns
    if 'Work Stress' in concerns:
        suggestions.append({
            'priority': 'medium',
            'title': 'Set Clear Work Boundaries',
            'description': 'Establish specific work hours and communicate them. Turn off notifications outside these hours.',
            'rationale': 'Boundary-setting reduces work-life conflict and prevents chronic stress from constant availability.'
        })
    
    # Relationship concerns
    if 'Relationships' in concerns:
        suggestions.append({
            'priority': 'medium',
            'title': 'Practice "I Feel" Communication',
            'description': 'Express concerns using "I feel [emotion] when [situation]" instead of blaming language.',
            'rationale': 'This communication style reduces defensiveness and opens pathways for genuine understanding and resolution.'
        })
    
    # Sleep concerns
    if 'Sleep' in concerns:
        suggestions.append({
            'priority': 'high',
            'title': 'Create a Sleep Routine',
            'description': 'Go to bed and wake at consistent times. Avoid screens 1 hour before bed. Keep bedroom cool and dark.',
            'rationale': 'Sleep hygiene directly impacts mental health. Poor sleep amplifies depression and anxiety by 40-60%.'
        })
    
    # General wellness if no specific emotion detected
    # Only show for neutral content that might benefit from general advice
    # Don't show for clearly positive/normal content
    if emotion == 'neutral' and ('seeking_help' in tone or 'overwhelmed' in tone):
        suggestions.extend([
            {
                'priority': 'medium',
                'title': 'Maintain Mental Fitness',
                'description': 'Continue daily practices like journaling, exercise, and social connection to build resilience.',
                'rationale': 'Preventive mental health care is as important as physical fitness for long-term wellbeing.'
            }
        ])
    
    # If no suggestions (truly normal/positive content), return empty list
    return suggestions[:5] if suggestions else []


def generate_immediate_actions(emotion, tone):
    """Generate immediate action steps based on emotional state"""
    actions = []
    
    if emotion == 'suicidal' or 'desperate' in tone:
        actions = [
            "Call 988 (Suicide Prevention Lifeline) immediately",
            "Text 'HOME' to 741741 (Crisis Text Line)",
            "Go to nearest emergency room if in immediate danger",
            "Call a trusted friend or family member right now",
            "Remove any means of self-harm from your environment"
        ]
    elif emotion == 'depression':
        actions = [
            "Take a 5-minute walk outside",
            "Drink a glass of water and eat something nutritious",
            "Call or text one person you trust",
            "Write down one thing you're grateful for",
            "Take a warm shower"
        ]
    elif emotion == 'anxiety':
        actions = [
            "Practice deep breathing for 2 minutes",
            "Name 5 things you can see around you",
            "Splash cold water on your face",
            "Listen to calming music for 10 minutes",
            "Step away from the stressful situation if possible"
        ]
    elif emotion == 'stress':
        actions = [
            "Write down everything on your mind",
            "Identify your top 3 priorities for today",
            "Take a 15-minute break from work/tasks",
            "Do 10 jumping jacks to release tension",
            "Drink water and check if you're hungry"
        ]
    elif emotion == 'neutral' and any(t in tone for t in ['seeking_help', 'overwhelmed']):
        # Only show for neutral content that seems like user is asking for help
        actions = [
            "Continue your current wellness practices",
            "Take a moment to check in with yourself",
            "Maintain your sleep and exercise routines"
        ]
    else:
        # Truly normal/positive content - no actions needed
        actions = []
    
    return actions


def generate_support_resources(emotion, concerns):
    """Generate relevant support resources based on context"""
    resources = []
    
    if emotion == 'suicidal':
        resources.extend([
            {
                'name': '988 Suicide & Crisis Lifeline',
                'type': 'crisis',
                'contact': '988 (USA)',
                'description': '24/7 crisis support by trained counselors',
                'availability': 'Immediate'
            },
            {
                'name': 'Crisis Text Line',
                'type': 'crisis',
                'contact': 'Text HOME to 741741',
                'description': 'Text-based crisis counseling',
                'availability': 'Immediate'
            }
        ])
    
    if emotion in ['depression', 'anxiety']:
        resources.extend([
            {
                'name': 'BetterHelp',
                'type': 'therapy',
                'contact': 'betterhelp.com',
                'description': 'Online therapy with licensed therapists',
                'availability': 'Within 48 hours'
            },
            {
                'name': 'Psychology Today Therapist Finder',
                'type': 'therapy',
                'contact': 'psychologytoday.com/us/therapists',
                'description': 'Find local therapists by specialty',
                'availability': 'Varies'
            }
        ])
    
    if 'Work Stress' in concerns:
        resources.append({
            'name': 'Employee Assistance Program (EAP)',
            'type': 'workplace',
            'contact': 'Check with your HR department',
            'description': 'Free confidential counseling through employer',
            'availability': 'Varies by employer'
        })
    
    if 'Financial' in concerns:
        resources.append({
            'name': 'National Foundation for Credit Counseling',
            'type': 'financial',
            'contact': 'nfcc.org',
            'description': 'Free financial counseling and debt management',
            'availability': 'Within days'
        })
    
    # Only include general NAMI resource if there are mental health concerns
    # Don't show for truly normal/positive content
    if emotion != 'neutral' or resources:
        resources.append({
            'name': 'NAMI Helpline',
            'type': 'support',
            'contact': '1-800-950-NAMI (6264)',
            'description': 'Mental health information and support',
            'availability': 'Mon-Fri 10am-10pm ET'
        })
    
    return resources[:5] if resources else []


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "service": "MindTrack AI Backend",
        "version": "1.0.0"
    }), 200


@app.route('/api/analyze/url', methods=['POST'])
def analyze_url():
    """
    Extract content from social media URL
    Currently supports: Twitter, Reddit
    Coming soon: Instagram, Facebook, Threads (pending Meta app review)
    
    Request body:
    {
        "url": "https://twitter.com/username/status/123456"
    }
    
    Response:
    {
        "success": true,
        "platform": "Twitter",
        "data": {
            "content": "Post text content",
            "author": "username",
            "date": "2024-01-01 12:00:00",
            "url": "original_url"
        }
    }
    """
    try:
        # Get JSON data from request
        data = request.get_json()
        
        # Validate request
        if not data:
            return jsonify({
                "success": False,
                "error": "No data provided"
            }), 400
        
        url = data.get('url', '').strip()
        
        if not url:
            return jsonify({
                "success": False,
                "error": "URL is required"
            }), 400
        
        # Extract content from URL
        result = url_extractor.extract(url)
        
        # Check if extraction was successful
        if 'error' in result:
            # Return the error from the extractor
            # (Instagram extractor now has Apify fallback built-in)
            return jsonify({
                "success": False,
                "error": result['error'],
                "platform": result.get('platform', 'Unknown'),
                "message": result.get('suggestion', '') or result.get('message', '')
            }), 400
        
        # Success - return extracted data
        return jsonify({
            "success": True,
            "platform": result.get('platform', 'Unknown'),
            "data": {
                "content": result.get('content', ''),
                "author": result.get('author', 'Unknown'),
                "date": result.get('date', ''),
                "url": url,
                "extraction_method": result.get('method', 'unknown')
            }
        }), 200
    
    except Exception as e:
        # Log the error for debugging
        print(f"Error in /api/analyze/url: {str(e)}")
        print(traceback.format_exc())
        
        return jsonify({
            "success": False,
            "error": "Internal server error occurred while processing URL",
            "details": str(e)
        }), 500


@app.route('/api/analyze/text', methods=['POST'])
def analyze_text():
    """
    Analyze text content for mental health indicators
    TODO: Integrate with DistilBERT model when training completes
    
    Request body:
    {
        "text": "Text content to analyze"
    }
    
    Response:
    {
        "success": true,
        "analysis": {
            "risk_level": "low|moderate|high",
            "confidence": 0.85,
            "categories": ["depression", "anxiety"],
            "sentiment": "negative",
            "recommendations": ["resource1", "resource2"]
        }
    }
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                "success": False,
                "error": "No data provided"
            }), 400
        
        text = data.get('text', '').strip()
        
        if not text:
            return jsonify({
                "success": False,
                "error": "Text is required"
            }), 400
        
        # TODO: Replace with actual DistilBERT model inference
        # For now, return enhanced analysis with AI suggestions
        import time
        import re
        
        # Analyze text context and tone
        analysis_result = analyze_text_context(text)
        
        return jsonify({
            "sentiment": analysis_result['sentiment'],
            "confidence": analysis_result['confidence'],
            "timestamp": int(time.time() * 1000),
            "categories": analysis_result['categories'],
            "detected_emotions": analysis_result['emotions'],
            "key_concerns": analysis_result['concerns'],
            "tone_analysis": analysis_result['tone'],
            "ai_suggestions": analysis_result['suggestions'],
            "immediate_actions": analysis_result['immediate_actions'],
            "ai_generated": analysis_result.get('ai_generated', False),
            "message": "AI-powered contextual analysis complete"
        }), 200
    
    except Exception as e:
        print(f"Error in /api/analyze/text: {str(e)}")
        print(traceback.format_exc())
        
        return jsonify({
            "success": False,
            "error": "Internal server error occurred while analyzing text",
            "details": str(e)
        }), 500


@app.route('/api/platforms', methods=['GET'])
def get_supported_platforms():
    """
    Get list of currently supported platforms
    """
    return jsonify({
        "success": True,
        "platforms": {
            "available": [
                {
                    "name": "Twitter",
                    "status": "active",
                    "authentication": "Bearer Token configured",
                    "features": ["oEmbed fallback", "API v2"]
                },
                {
                    "name": "Reddit",
                    "status": "active",
                    "authentication": "No auth required",
                    "features": ["JSON API"]
                }
            ],
            "pending": [
                {
                    "name": "Instagram",
                    "status": "pending_review",
                    "reason": "Awaiting Meta app review approval",
                    "eta": "1-2 weeks"
                },
                {
                    "name": "Facebook",
                    "status": "pending_review",
                    "reason": "Awaiting Meta app review approval",
                    "eta": "1-2 weeks"
                },
                {
                    "name": "Threads",
                    "status": "pending_configuration",
                    "reason": "Requires access token generation",
                    "eta": "After Meta app review"
                }
            ]
        }
    }), 200


# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({
        "success": False,
        "error": "Endpoint not found"
    }), 404


@app.errorhandler(405)
def method_not_allowed(error):
    return jsonify({
        "success": False,
        "error": "Method not allowed"
    }), 405


@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        "success": False,
        "error": "Internal server error"
    }), 500


if __name__ == '__main__':
    print("=" * 60)
    print("🚀 MindTrack AI Backend Server")
    print("=" * 60)
    print("✅ Twitter extraction: ACTIVE")
    print("✅ Reddit extraction: ACTIVE")
    print("⏳ Instagram/Facebook/Threads: Pending Meta app review")
    print("=" * 60)
    print("📍 Server starting on http://localhost:5000")
    print("📍 API endpoints:")
    print("   - POST /api/analyze/url")
    print("   - POST /api/analyze/text")
    print("   - GET  /api/platforms")
    print("   - GET  /api/health")
    print("=" * 60)
    
    app.run(debug=True, host='0.0.0.0', port=5000)
