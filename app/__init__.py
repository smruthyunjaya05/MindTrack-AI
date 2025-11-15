"""
MindTrack AI - Flask Application Factory
"""
from flask import Flask
from flask_cors import CORS
import os
from dotenv import load_dotenv

load_dotenv()

def create_app(config_name='development'):
    """Create and configure the Flask application"""
    app = Flask(__name__)
    
    # Load configuration
    from app.config import get_config
    config_class = get_config()
    app.config.from_object(config_class)
    
    # Enable CORS for frontend communication
    CORS(app, resources={
        r"/api/*": {
            "origins": app.config.get('CORS_ORIGINS', ['http://localhost:5173', 'http://localhost:3000']),
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })
    
    # Initialize extensions
    from app.models import db
    db.init_app(app)
    
    # Initialize JWT (import only if flask_jwt_extended is installed)
    try:
        from flask_jwt_extended import JWTManager
        jwt = JWTManager(app)
    except ImportError:
        print("⚠️  Flask-JWT-Extended not installed. Authentication features disabled.")
        pass
    
    # Register API blueprints
    try:
        from app.api import analysis_bp, timeline_bp
        app.register_blueprint(analysis_bp, url_prefix='/api/v1')
        app.register_blueprint(timeline_bp, url_prefix='/api/v1')
    except Exception:
        # Blueprints may not be present yet during early setup — ignore to allow app to start
        pass
    
    # Health check endpoint
    @app.route('/health')
    def health_check():
        return {'status': 'healthy', 'message': 'MindTrack AI is running'}, 200
    
    @app.route('/')
    def home():
        return {
            'application': 'MindTrack AI',
            'version': '1.0.0',
            'status': 'development',
            'endpoints': {
                'health': '/health',
                'api': '/api/v1'
            }
        }, 200
    
    return app
