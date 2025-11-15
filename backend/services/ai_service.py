"""
Google Gemini AI Service - Generate dynamic mental health recommendations
Uses Gemini 1.5 Flash for fast, FREE, personalized suggestions
"""
import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

class AIRecommendationService:
    def __init__(self):
        self.api_key = os.getenv('GOOGLE_API_KEY')
        if self.api_key:
            genai.configure(api_key=self.api_key)
            self.model = genai.GenerativeModel('gemini-2.5-flash')
            print("✓ Google Gemini AI service initialized")
        else:
            print("⚠️  GOOGLE_API_KEY not configured - using fallback recommendations")
            self.model = None
        
    def generate_recommendations(self, text, sentiment, confidence, emotions, concerns, tone):
        """
        Generate personalized mental health recommendations using Google Gemini AI
        
        Args:
            text: User's input text (MOST IMPORTANT - AI analyzes this directly)
            sentiment: Detected sentiment (Normal, At-Risk, Crisis)
            confidence: Model confidence score
            emotions: List of detected emotions
            concerns: List of specific concerns
            tone: Detected tone
            
        Returns:
            {
                'suggestions': [...],
                'immediate_actions': [...],
                'ai_generated': True/False
            }
        """
        if not self.api_key or not self.model:
            print("⚠️  GOOGLE_API_KEY not configured")
            return None
        
        # Generate AI recommendations for ALL content
        # AI reads the actual TEXT, not just the labels, so it can detect nuances
        
        # Create AI prompt with full text for better analysis
        prompt = self._create_prompt(text, sentiment, confidence, emotions, concerns, tone)
        
        try:
            from google.generativeai.types import HarmCategory, HarmBlockThreshold
            
            response = self.model.generate_content(
                prompt,
                generation_config=genai.GenerationConfig(
                    temperature=0.7,
                    max_output_tokens=2000
                ),
                safety_settings={
                    HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_NONE,
                    HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_NONE,
                    HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_NONE,
                    HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_NONE
                }
            )
            
            # Extract text from response
            if not response or not response.parts:
                print(f"⚠️  Gemini blocked response. Finish reason: {response.candidates[0].finish_reason if response.candidates else 'unknown'}")
                return None
            
            # Parse JSON response - remove markdown code blocks if present
            text = response.text.strip()
            
            # Remove ```json and ``` markers
            if '```json' in text:
                text = text.split('```json')[1].split('```')[0].strip()
            elif '```' in text:
                # Generic code block
                parts = text.split('```')
                if len(parts) >= 3:
                    text = parts[1].strip()
            
            # Parse JSON with better error handling
            try:
                content = json.loads(text)
            except json.JSONDecodeError as je:
                print(f"❌ Gemini API request failed: {str(je)}")
                print(f"⚠️  Raw response (first 800 chars):\n{text[:800]}")
                
                # Try to fix common JSON issues
                try:
                    # Attempt to fix unescaped quotes and newlines
                    import re
                    # Replace unescaped newlines in strings
                    fixed_text = text.replace('\n', '\\n').replace('\r', '\\r').replace('\t', '\\t')
                    content = json.loads(fixed_text)
                    print("✓ JSON fixed and parsed successfully")
                except:
                    # If still fails, return fallback
                    print("⚠️  Using fallback recommendations due to JSON parse error")
                    return None
            
            return {
                'suggestions': content.get('suggestions', []),
                'immediate_actions': content.get('immediate_actions', []),
                'ai_generated': True
            }
                
        except Exception as e:
            print(f"❌ Gemini API request failed: {e}")
            return None
    
    def _create_prompt(self, text, sentiment, confidence, emotions, concerns, tone):
        """Create structured prompt for Google Gemini - AI reads the ACTUAL TEXT for context"""
        
        # Special handling for crisis situations
        if sentiment == "Crisis":
            return self._create_crisis_prompt(emotions, concerns, tone)
        
        # Let AI analyze the actual text content for emotional nuance
        # This allows it to detect heartbreak, rejection, etc. even if model says "Normal"
        return f"""Analyze this person's emotional state from their actual words and provide personalized recommendations.

**Their actual text:**
"{text}"

**AI model detected:** {sentiment} (but you should read the text yourself for accuracy)
**Emotions flagged:** {', '.join(emotions) if emotions else 'None flagged'}
**Concerns flagged:** {', '.join(concerns) if concerns else 'None flagged'}

**Your task:**
1. Read the actual text to understand the TRUE emotional state
2. If you detect heartbreak, rejection, relationship issues, disappointment - address THOSE
3. If you detect schadenfreude (joy at others' misfortune) - guide toward healthier mindset
4. If genuinely positive - help maintain and amplify it
5. Provide 2-3 specific, actionable recommendations based on what YOU detect

Return ONLY valid JSON with NO markdown formatting. CRITICAL: Escape all quotes and special characters properly in strings:
{{
  "suggestions": [
    {{
      "title": "Specific to their situation",
      "description": "Actionable steps addressing their ACTUAL emotional state",
      "rationale": "Why this helps for THEIR specific situation"
    }}
  ],
  "immediate_actions": [
    "Action addressing their real emotion",
    "Practical step they can do now",
    "Coping technique for their situation"
  ]
}}

IMPORTANT: 
- Use \\\" for quotes inside strings
- Use \\n for line breaks
- Keep all text on single lines within JSON strings"""
    
    def _create_crisis_prompt(self, emotions, concerns, tone):
        """Special prompt for crisis situations - supportive tasks only"""
        
        return f"""Provide calming techniques for someone in emotional distress.

Context:
- Emotions: {', '.join(emotions) if emotions else 'High distress'}
- Concerns: {', '.join(concerns) if concerns else 'Intense emotions'}

Provide 2-3 immediate calming techniques focusing on breathing, grounding, and self-soothing.

Return ONLY valid JSON with NO markdown formatting. CRITICAL: Escape all quotes and special characters properly:
{{
  "suggestions": [
    {{
      "title": "Reach Out for Support",
      "description": "Talk to someone you trust - a friend, family member, or someone who cares. You don't have to face this alone.",
      "rationale": "Social connection helps reduce isolation and provides emotional support."
    }},
    {{
      "title": "Grounding Technique",
      "description": "Use 5-4-3-2-1: Name 5 things you see, 4 you touch, 3 you hear, 2 you smell, 1 you taste.",
      "rationale": "Grounding brings you to the present moment and calms your nervous system."
    }}
  ],
  "immediate_actions": [
    "Take 5 slow deep breaths - in for 4, hold for 4, out for 6",
    "Put your hand over your heart - you are here, you are safe",
    "Reach out to someone you trust"
  ]
}}"""

# Global instance
ai_service = AIRecommendationService()
