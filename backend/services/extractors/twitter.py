"""
Twitter/X Content Extractor
Supports both oEmbed API (no auth) and Twitter API v2 (requires auth)
"""

import os
import sys
import requests
from typing import Dict, Optional

# Add backend to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from utils.parsers import ContentParser
from utils.validators import URLValidator

class TwitterExtractor:
    """Extract content from Twitter/X URLs"""
    
    def __init__(self):
        """Initialize Twitter extractor with optional API credentials"""
        self.bearer_token = os.getenv('TWITTER_BEARER_TOKEN')
        self.use_api_v2 = bool(self.bearer_token)
    
    def extract(self, url: str) -> Dict:
        """
        Extract tweet content from URL
        
        Args:
            url: Twitter/X post URL
            
        Returns:
            Dictionary with extracted data
        """
        try:
            # Extract tweet ID
            tweet_id = URLValidator.extract_twitter_id(url)
            if not tweet_id:
                return {
                    'success': False,
                    'error': 'Invalid Twitter URL'
                }
            
            # Try API v2 first if bearer token available, fall back to oEmbed
            if self.use_api_v2:
                try:
                    return self._extract_with_api_v2(tweet_id, url)
                except requests.exceptions.HTTPError as e:
                    # Fall back to oEmbed on rate limit (429) or other API errors
                    if e.response.status_code == 429:
                        print(f"Twitter API rate limit hit, falling back to oEmbed for {url}")
                    else:
                        print(f"Twitter API v2 error ({e.response.status_code}), falling back to oEmbed")
                    return self._extract_with_oembed(url)
                except Exception as e:
                    print(f"Twitter API v2 error: {str(e)}, falling back to oEmbed")
                    return self._extract_with_oembed(url)
            else:
                return self._extract_with_oembed(url)
        
        except Exception as e:
            return {
                'success': False,
                'error': f'Failed to extract tweet: {str(e)}'
            }
    
    def _extract_with_oembed(self, url: str) -> Dict:
        """
        Extract tweet using oEmbed API (no authentication required)
        
        Args:
            url: Twitter/X post URL
            
        Returns:
            Dictionary with extracted data
        """
        oembed_url = f"https://publish.twitter.com/oembed?url={url}"
        
        response = requests.get(oembed_url, timeout=10)
        response.raise_for_status()
        
        data = response.json()
        
        # Parse HTML to extract tweet text
        tweet_text = ContentParser.parse_twitter_oembed_html(data.get('html', ''))
        
        return {
            'success': True,
            'platform': 'Twitter',
            'author': data.get('author_name', '').lstrip('@'),
            'author_url': data.get('author_url', ''),
            'content': tweet_text,
            'date': None,  # oEmbed doesn't provide date
            'url': url,
            'method': 'oembed'
        }
    
    def _extract_with_api_v2(self, tweet_id: str, url: str) -> Dict:
        """
        Extract tweet using Twitter API v2 (requires authentication)
        
        Args:
            tweet_id: Tweet ID
            url: Original tweet URL
            
        Returns:
            Dictionary with extracted data
        """
        api_url = f"https://api.twitter.com/2/tweets/{tweet_id}"
        
        params = {
            'tweet.fields': 'created_at,author_id,text,public_metrics',
            'expansions': 'author_id',
            'user.fields': 'username,name'
        }
        
        headers = {
            'Authorization': f'Bearer {self.bearer_token}'
        }
        
        response = requests.get(api_url, headers=headers, params=params, timeout=10)
        response.raise_for_status()
        
        data = response.json()
        
        # Extract tweet data
        tweet_data = data.get('data', {})
        user_data = data.get('includes', {}).get('users', [{}])[0]
        
        return {
            'success': True,
            'platform': 'Twitter',
            'author': user_data.get('username', ''),
            'author_name': user_data.get('name', ''),
            'author_id': tweet_data.get('author_id', ''),
            'content': tweet_data.get('text', ''),
            'date': ContentParser.format_twitter_date(tweet_data.get('created_at', '')),
            'url': url,
            'metrics': tweet_data.get('public_metrics', {}),
            'method': 'api_v2'
        }
