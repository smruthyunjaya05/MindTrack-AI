"""Emotion Analysis model for MindTrack AI."""
from datetime import datetime
from uuid import uuid4
from app.models import db


class EmotionAnalysis(db.Model):
    """Model for storing emotion analysis results."""
    
    __tablename__ = 'emotion_analyses'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=True, index=True)
    text = db.Column(db.Text, nullable=False)
    sentiment = db.Column(db.String(50), nullable=False, index=True)
    confidence = db.Column(db.Float, nullable=False)
    model_version = db.Column(db.String(50), default='distilbert-v1')
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False, index=True)
    metadata = db.Column(db.JSON, default=dict)
    
    def __init__(self, text, sentiment, confidence, user_id=None, model_version='distilbert-v1', metadata=None):
        """Initialize emotion analysis."""
        self.text = text
        self.sentiment = sentiment
        self.confidence = confidence
        self.user_id = user_id
        self.model_version = model_version
        self.metadata = metadata or {}
    
    def to_dict(self):
        """Convert analysis to dictionary."""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'text': self.text,
            'sentiment': self.sentiment,
            'confidence': float(self.confidence),
            'model_version': self.model_version,
            'created_at': self.created_at.isoformat(),
            'metadata': self.metadata
        }
    
    @staticmethod
    def get_user_timeline(user_id, limit=20, offset=0):
        """Get user's analysis timeline."""
        return EmotionAnalysis.query.filter_by(user_id=user_id)\
            .order_by(EmotionAnalysis.created_at.desc())\
            .limit(limit)\
            .offset(offset)\
            .all()
    
    @staticmethod
    def get_user_stats(user_id):
        """Get statistics for a user's analyses."""
        analyses = EmotionAnalysis.query.filter_by(user_id=user_id).all()
        
        if not analyses:
            return {
                'total_analyses': 0,
                'sentiment_distribution': {},
                'average_confidence': 0
            }
        
        sentiment_counts = {}
        total_confidence = 0
        
        for analysis in analyses:
            sentiment = analysis.sentiment
            sentiment_counts[sentiment] = sentiment_counts.get(sentiment, 0) + 1
            total_confidence += analysis.confidence
        
        return {
            'total_analyses': len(analyses),
            'sentiment_distribution': sentiment_counts,
            'average_confidence': total_confidence / len(analyses)
        }
    
    def __repr__(self):
        """String representation of EmotionAnalysis."""
        return f'<EmotionAnalysis {self.id} - {self.sentiment}>'
