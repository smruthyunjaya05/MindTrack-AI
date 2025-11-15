"""
Main URL Extractor Service
Coordinates extraction from different social media platforms
"""

from typing import Dict
import sys
import os

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from utils.validators import URLValidator
from services.extractors import (
    TwitterExtractor, 
    RedditExtractor,
    InstagramExtractor,
    ThreadsExtractor,
    FacebookExtractor
)

class URLExtractorService:
    """Main service to extract content from social media URLs"""
    
    def __init__(self):
        """Initialize extractors for supported platforms"""
        self.extractors = {
            'twitter': TwitterExtractor(),
            'reddit': RedditExtractor(),
            'instagram': InstagramExtractor(),
            'threads': ThreadsExtractor(),
            'facebook': FacebookExtractor(),
        }
    
    def extract(self, url: str) -> Dict:
        """
        Extract content from any supported social media URL
        
        Args:
            url: Social media post URL
            
        Returns:
            Dictionary with extracted data and metadata
        """
        # Validate URL
        if not url or not isinstance(url, str):
            return {
                'success': False,
                'error': 'Invalid URL provided'
            }
        
        # Detect platform
        platform = URLValidator.detect_platform(url)
        
        if not platform:
            return {
                'success': False,
                'error': 'Unsupported platform or invalid URL format',
                'supported_platforms': list(self.extractors.keys())
            }
        
        # Check if platform is supported
        if platform not in self.extractors:
            return {
                'success': False,
                'error': f'{platform.capitalize()} extraction not yet implemented',
                'platform': platform,
                'supported_platforms': list(self.extractors.keys())
            }
        
        # Extract content using appropriate extractor
        extractor = self.extractors[platform]
        result = extractor.extract(url)
        
        return result
    
    def get_supported_platforms(self) -> list:
        """Get list of supported platforms"""
        return list(self.extractors.keys())
