"""
Threads Content Extractor
Uses Meta's Threads API for content extraction
"""

import requests
import os
from datetime import datetime


class ThreadsExtractor:
    """Extract content from Threads posts"""
    
    def __init__(self):
        self.api_base = "https://graph.threads.net/v1.0"
        self.access_token = os.getenv('THREADS_ACCESS_TOKEN')
        self.app_id = os.getenv('INSTAGRAM_APP_ID')  # Threads uses same app
        self.app_secret = os.getenv('INSTAGRAM_APP_SECRET')
    
    def extract(self, url):
        """
        Extract Threads post content
        Note: Threads API is still evolving - implementation may need updates
        """
        try:
            if not self.access_token:
                return {
                    'platform': 'Threads',
                    'error': 'Threads API requires authentication. Please set THREADS_ACCESS_TOKEN.',
                    'info': 'Get access token from Meta Developer Portal → Threads API',
                    'url': url
                }
            
            # Extract thread ID from URL
            thread_id = self._extract_thread_id(url)
            if not thread_id:
                return {
                    'platform': 'Threads',
                    'error': 'Invalid Threads URL format',
                    'url': url
                }
            
            # Get thread data
            return self._get_thread_data(thread_id)
            
        except Exception as e:
            return {
                'error': f'Threads extraction failed: {str(e)}',
                'platform': 'Threads'
            }
    
    def _extract_thread_id(self, url):
        """
        Extract thread ID from Threads URL
        Example: https://www.threads.net/@username/post/THREAD_ID
        """
        parts = url.rstrip('/').split('/')
        if 'threads.net' in url and len(parts) >= 5:
            if parts[-2] == 'post':
                return parts[-1]
        return None
    
    def _get_thread_data(self, thread_id):
        """
        Get thread data from Threads API
        """
        try:
            endpoint = f"{self.api_base}/{thread_id}"
            params = {
                'fields': 'id,text,username,timestamp,media_type,media_url,permalink',
                'access_token': self.access_token
            }
            
            response = requests.get(endpoint, params=params, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                
                return {
                    'platform': 'Threads',
                    'author': data.get('username', 'Unknown'),
                    'content': data.get('text', 'No text content'),
                    'date': data.get('timestamp', ''),
                    'media_type': data.get('media_type', 'text'),
                    'media_url': data.get('media_url', ''),
                    'url': data.get('permalink', ''),
                    'thread_id': thread_id
                }
            else:
                return {
                    'platform': 'Threads',
                    'error': f'API request failed: {response.status_code}',
                    'details': response.text
                }
                
        except Exception as e:
            return {
                'platform': 'Threads',
                'error': f'Failed to get thread data: {str(e)}'
            }
    
    def get_user_threads(self, user_id=None):
        """
        Get threads from authenticated user
        Requires user authorization
        """
        if not self.access_token:
            return {'error': 'No access token available'}
        
        try:
            endpoint = f"{self.api_base}/me/threads"
            params = {
                'fields': 'id,text,username,timestamp,media_type,permalink',
                'access_token': self.access_token
            }
            
            response = requests.get(endpoint, params=params, timeout=10)
            
            if response.status_code == 200:
                return response.json()
            else:
                return {
                    'error': f'API request failed: {response.status_code}',
                    'details': response.text
                }
                
        except Exception as e:
            return {
                'error': f'Failed to get user threads: {str(e)}'
            }


def test_threads_extractor():
    """Test Threads extraction with sample URLs"""
    extractor = ThreadsExtractor()
    
    # Test with a Threads post URL
    test_urls = [
        "https://www.threads.net/@username/post/ABC123xyz",  # Replace with real URL
    ]
    
    for url in test_urls:
        print(f"\n{'='*60}")
        print(f"Testing: {url}")
        print('='*60)
        
        result = extractor.extract(url)
        
        if 'error' in result:
            print(f"❌ Error: {result['error']}")
            if 'info' in result:
                print(f"   Info: {result['info']}")
        else:
            print(f"✅ Platform: {result.get('platform')}")
            print(f"   Author: {result.get('author')}")
            print(f"   Content: {result.get('content')[:100]}...")
            print(f"   Date: {result.get('date')}")


if __name__ == "__main__":
    test_threads_extractor()
