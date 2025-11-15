"""
Facebook Content Extractor
Uses Meta Graph API and oEmbed for content extraction
"""

import requests
import os
from datetime import datetime
from bs4 import BeautifulSoup


class FacebookExtractor:
    """Extract content from Facebook posts"""
    
    def __init__(self):
        self.graph_api = "https://graph.facebook.com/v18.0"
        self.oembed_url = "https://graph.facebook.com/v18.0/oembed_post"
        self.app_id = os.getenv('INSTAGRAM_APP_ID')  # Same app for all Meta platforms
        self.app_secret = os.getenv('INSTAGRAM_APP_SECRET')
        self.access_token = os.getenv('FACEBOOK_ACCESS_TOKEN')
    
    def extract(self, url):
        """
        Extract Facebook post content
        Tries oEmbed first (works for some public posts), then Graph API
        """
        try:
            # Try oEmbed first (limited support)
            result = self._extract_with_oembed(url)
            if result and 'error' not in result:
                return result
            
            # Try Graph API if we have access token
            if self.access_token:
                return self._extract_with_graph_api(url)
            
            return {
                'platform': 'Facebook',
                'error': 'Could not extract Facebook post. Authentication required for most posts.',
                'info': 'Set FACEBOOK_ACCESS_TOKEN to access posts.',
                'url': url
            }
            
        except Exception as e:
            return {
                'error': f'Facebook extraction failed: {str(e)}',
                'platform': 'Facebook'
            }
    
    def _extract_with_oembed(self, url):
        """
        Extract using Facebook oEmbed API
        Limited support - works for some public posts
        """
        try:
            params = {
                'url': url,
                'access_token': f"{self.app_id}|{self.app_secret}" if self.app_id and self.app_secret else None
            }
            
            response = requests.get(self.oembed_url, params=params, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                
                # Parse HTML to extract content
                html = data.get('html', '')
                soup = BeautifulSoup(html, 'html.parser')
                
                # Extract text from embed
                content = ''
                if soup:
                    text_elem = soup.find('blockquote') or soup.find('div')
                    if text_elem:
                        content = text_elem.get_text(strip=True, separator=' ')
                
                return {
                    'platform': 'Facebook',
                    'author': data.get('author_name', 'Unknown'),
                    'author_url': data.get('author_url', ''),
                    'content': content or 'No content available',
                    'url': url,
                    'width': data.get('width'),
                    'height': data.get('height'),
                    'method': 'oembed'
                }
            
            return None
            
        except Exception as e:
            print(f"oEmbed extraction failed: {e}")
            return None
    
    def _extract_with_graph_api(self, url):
        """
        Extract using Facebook Graph API
        Requires access token and appropriate permissions
        """
        try:
            # Extract post ID from URL
            post_id = self._extract_post_id(url)
            if not post_id:
                return {
                    'platform': 'Facebook',
                    'error': 'Invalid Facebook URL format',
                    'url': url
                }
            
            # Get post data
            endpoint = f"{self.graph_api}/{post_id}"
            params = {
                'fields': 'message,created_time,from,permalink_url,story,type',
                'access_token': self.access_token
            }
            
            response = requests.get(endpoint, params=params, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                
                return {
                    'platform': 'Facebook',
                    'author': data.get('from', {}).get('name', 'Unknown'),
                    'content': data.get('message') or data.get('story', 'No content available'),
                    'date': data.get('created_time', ''),
                    'url': data.get('permalink_url', url),
                    'post_type': data.get('type', 'status'),
                    'post_id': post_id,
                    'method': 'graph_api'
                }
            else:
                return {
                    'platform': 'Facebook',
                    'error': f'Graph API request failed: {response.status_code}',
                    'details': response.text,
                    'info': 'You may need Page Public Content Access permission from Meta.'
                }
                
        except Exception as e:
            return {
                'platform': 'Facebook',
                'error': f'Graph API extraction failed: {str(e)}'
            }
    
    def _extract_post_id(self, url):
        """
        Extract post ID from Facebook URL
        Facebook URLs can be complex with various formats:
        - https://www.facebook.com/PAGE_NAME/posts/POST_ID
        - https://www.facebook.com/permalink.php?story_fbid=POST_ID&id=PAGE_ID
        - https://www.facebook.com/USER_ID/posts/POST_ID
        """
        # Try to parse different URL formats
        if '/posts/' in url:
            parts = url.rstrip('/').split('/posts/')
            if len(parts) == 2:
                return parts[1].split('/')[0].split('?')[0]
        
        if 'story_fbid=' in url:
            # Parse query parameters
            from urllib.parse import urlparse, parse_qs
            parsed = urlparse(url)
            params = parse_qs(parsed.query)
            story_fbid = params.get('story_fbid', [None])[0]
            page_id = params.get('id', [None])[0]
            if story_fbid and page_id:
                return f"{page_id}_{story_fbid}"
        
        return None
    
    def get_page_posts(self, page_id):
        """
        Get posts from a Facebook page
        Requires page access token
        """
        if not self.access_token:
            return {'error': 'No access token available'}
        
        try:
            endpoint = f"{self.graph_api}/{page_id}/posts"
            params = {
                'fields': 'message,created_time,permalink_url,story,type',
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
                'error': f'Failed to get page posts: {str(e)}'
            }


def test_facebook_extractor():
    """Test Facebook extraction with sample URLs"""
    extractor = FacebookExtractor()
    
    # Test with Facebook post URLs
    test_urls = [
        "https://www.facebook.com/username/posts/1234567890",  # Replace with real URL
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
            print(f"   Method: {result.get('method')}")


if __name__ == "__main__":
    test_facebook_extractor()
