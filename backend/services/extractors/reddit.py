"""
Reddit Content Extractor
Uses JSON API (no authentication required)
"""

import os
import sys
import requests
from typing import Dict

# Add backend to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from utils.parsers import ContentParser
from utils.validators import URLValidator

class RedditExtractor:
    """Extract content from Reddit URLs using JSON API"""
    
    def __init__(self):
        """Initialize Reddit extractor"""
        # User-Agent is REQUIRED for Reddit API
        self.headers = {
            'User-Agent': 'MindTrack-AI/1.0 (Mental health analyzer; Academic research)'
        }
    
    def extract(self, url: str) -> Dict:
        """
        Extract Reddit post content from URL using JSON API
        
        Args:
            url: Reddit post URL
            
        Returns:
            Dictionary with extracted data
        """
        try:
            # Validate Reddit URL
            reddit_info = URLValidator.extract_reddit_info(url)
            if not reddit_info:
                return {
                    'success': False,
                    'error': 'Invalid Reddit URL format. Use: https://www.reddit.com/r/subreddit/comments/post_id/title/'
                }
            
            return self._extract_with_json(url)
        
        except Exception as e:
            return {
                'success': False,
                'error': f'Failed to extract Reddit post: {str(e)}'
            }
    
    def _extract_with_json(self, url: str) -> Dict:
        """
        Extract post using Reddit JSON API (no authentication required)
        
        Args:
            url: Reddit post URL
            
        Returns:
            Dictionary with extracted data
        """
        # Remove URL parameters (utm_source, etc.) before adding .json
        # Split at ? to remove query parameters
        clean_url = url.split('?')[0].rstrip('/')
        json_url = clean_url + '.json'
        
        response = requests.get(json_url, headers=self.headers, timeout=10)
        response.raise_for_status()
        
        # Parse JSON response
        try:
            data = response.json()
        except ValueError as e:
            return {
                'success': False,
                'error': f'Failed to parse Reddit response as JSON: {str(e)}'
            }
        
        # Extract post data
        post_data = data[0]['data']['children'][0]['data']
        
        # Combine title and selftext
        content = post_data.get('title', '')
        selftext = post_data.get('selftext', '')
        if selftext:
            content += '\n\n' + selftext
        
        return {
            'success': True,
            'platform': 'Reddit',
            'author': post_data.get('author', ''),
            'subreddit': post_data.get('subreddit', ''),
            'title': post_data.get('title', ''),
            'content': ContentParser.clean_text(content),
            'date': ContentParser.format_reddit_date(post_data.get('created_utc', 0)),
            'url': url,
            'score': post_data.get('score', 0),
            'num_comments': post_data.get('num_comments', 0),
            'method': 'json_api'
        }
