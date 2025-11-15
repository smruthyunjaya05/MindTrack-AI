"""Database models for MindTrack AI."""
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

from app.models.user import User
from app.models.emotion_analysis import EmotionAnalysis

__all__ = ['db', 'User', 'EmotionAnalysis']
