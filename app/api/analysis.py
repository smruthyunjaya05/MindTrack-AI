"""API blueprint: text analysis (Phase 1 starter implementation).

This file implements a minimal POST /api/v1/analyze/text endpoint that
performs input validation and a simple rule-based classification. It is
intended to provide a runnable endpoint during Phase 1 before the
actual ML model is integrated.
"""
from flask import Blueprint, request, jsonify
from datetime import datetime
import re

analysis_bp = Blueprint('analysis', __name__)

# Simple keyword-based indicators for a quick prototype
STRESS_KEYWORDS = {
    'anxious', 'anxiety', 'overwhelmed', 'stressed', 'stress',
    'deadline', 'panic', 'nervous', 'worried', 'pressure'
}

DEPRESSION_KEYWORDS = {
    'depress', 'depressed', 'hopeless', 'worthless', 'suicide', 'alone', 'give up'
}

def minimal_preprocess(text: str) -> str:
    # Minimal cleaning: normalize whitespace
    return re.sub(r"\s+", ' ', str(text)).strip()

def simple_rule_classifier(text: str):
    """Return label, emotion_class and a naive confidence score."""
    lower = text.lower()
    score = 0
    matches = []
    for kw in STRESS_KEYWORDS:
        if kw in lower:
            score += 1
            matches.append(kw)
    for kw in DEPRESSION_KEYWORDS:
        if kw in lower:
            score += 2
            matches.append(kw)

    if score == 0:
        label = 0
        emotion_class = 'Normal'
        confidence = 0.80
    else:
        label = 1
        emotion_class = 'Stressed/Depressed'
        # confidence increases with number and weight of matches
        confidence = min(0.50 + 0.15 * score, 0.98)

    return {
        'label': label,
        'emotion_class': emotion_class,
        'confidence': round(confidence, 3),
        'matches': matches
    }


@analysis_bp.route('/analyze/text', methods=['POST'])
def analyze_text():
    """Analyze text input (validation + simple rule-based prediction)."""
    data = request.get_json(silent=True) or {}
    text = data.get('text', '')

    # Validation rules from PRD
    if not text or len(str(text).strip()) == 0:
        return jsonify({'error': 'Text input is required'}), 400
    if len(text) < 50:
        return jsonify({'error': 'Please provide at least 50 characters for accurate analysis'}), 400
    if len(text) > 5000:
        return jsonify({'error': 'Text exceeds maximum length of 5000 characters'}), 400

    processed = minimal_preprocess(text)
    pred = simple_rule_classifier(processed)

    response = {
        'analysis_id': f"tmp-{int(datetime.utcnow().timestamp())}",
        'timestamp': datetime.utcnow().isoformat(),
        'input_text': text,
        'prediction': {
            'emotion_class': pred['emotion_class'],
            'label': pred['label'],
            'confidence': pred['confidence'],
            'class_probabilities': {
                'Normal': round(1 - pred['confidence'], 3) if pred['label'] == 1 else round(1.0, 3),
                'Stressed/Depressed': pred['confidence'] if pred['label'] == 1 else round(0.0, 3)
            }
        },
        'processing_time_ms': 5,
        'notes': 'Prototype rule-based classifier - replace with ML inference in Phase 3',
    }

    return jsonify(response), 200
