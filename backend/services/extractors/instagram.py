"""
Instagram Content Extractor
Primary: Meta oEmbed API (official, requires app review)
Fallback: Apify Scraper (development/testing)
"""

import requests
import os
from datetime import datetime
from bs4 import BeautifulSoup


class InstagramExtractor:
    """Extract content from Instagram posts with multiple methods"""
    
    def __init__(self):
        self.oembed_url = "https://graph.facebook.com/v18.0/instagram_oembed"
        self.graph_url = "https://graph.instagram.com"
        self.app_id = os.getenv('INSTAGRAM_APP_ID')
        self.app_secret = os.getenv('INSTAGRAM_APP_SECRET')
        self.access_token = os.getenv('INSTAGRAM_ACCESS_TOKEN')
        self.apify_token = os.getenv('APIFY_API_TOKEN')
        self.use_apify = bool(self.apify_token)
    
    def extract(self, url):
        """
        Extract Instagram post content
        Priority: oEmbed API → Apify Scraper → Error message
        """
        try:
            # Method 1: Try oEmbed first (official, but requires app review)
            if self.app_id and self.app_secret:
                print(f"Attempting Instagram extraction via Meta oEmbed...")
                result = self._extract_with_oembed(url)
                if result and 'error' not in result:
                    return result
                print(f"Meta oEmbed blocked (app review required)")
            
            # Method 2: Try Apify Scraper (costs credits, works immediately)
            if self.use_apify:
                print(f"Falling back to Apify scraper...")
                result = self._extract_with_apify(url)
                if result and 'error' not in result:
                    return result
            
            # Method 3: Try Graph API if available (rarely works without proper auth)
            if self.access_token:
                return self._extract_with_graph_api(url)
            
            return {
                'error': 'Instagram extraction requires Meta app review or Apify API token. Try Twitter/Reddit!',
                'platform': 'Instagram',
                'suggestion': 'Instagram support coming soon after Meta approval'
            }
            
        except Exception as e:
            return {
                'error': f'Instagram extraction failed: {str(e)}',
                'platform': 'Instagram'
            }
    
    def _extract_with_oembed(self, url):
        """
        Extract using Facebook's Instagram oEmbed API
        Works for public posts without authentication (sometimes)
        """
        try:
            # Try without access token first for public posts
            params = {'url': url}
            
            response = requests.get(self.oembed_url, params=params, timeout=10)
            
            # If that fails and we have app credentials, try with app token
            if response.status_code != 200 and self.app_id and self.app_secret:
                params['access_token'] = f"{self.app_id}|{self.app_secret}"
                response = requests.get(self.oembed_url, params=params, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                
                # Parse HTML to extract caption
                html = data.get('html', '')
                soup = BeautifulSoup(html, 'html.parser')
                
                # Extract text from blockquote or similar
                caption = ''
                if soup:
                    text_elem = soup.find('blockquote') or soup.find('div')
                    if text_elem:
                        caption = text_elem.get_text(strip=True, separator=' ')
                
                return {
                    'platform': 'Instagram',
                    'author': data.get('author_name', 'Unknown'),
                    'author_url': data.get('author_url', ''),
                    'content': caption or 'No caption available',
                    'media_type': 'photo/video',
                    'url': url,
                    'thumbnail': data.get('thumbnail_url', ''),
                    'width': data.get('thumbnail_width'),
                    'height': data.get('thumbnail_height'),
                    'method': 'oembed'
                }
            
            return None
            
        except Exception as e:
            print(f"oEmbed extraction failed: {e}")
            return None
    
    def _extract_with_graph_api(self, url):
        """
        Extract using Instagram Graph API
        Requires access token and user authorization
        Note: Can only access posts from authenticated user's account
        """
        try:
            # Extract media ID from URL
            # Instagram URLs: https://www.instagram.com/p/MEDIA_CODE/
            media_code = self._extract_media_code(url)
            if not media_code:
                return {'error': 'Invalid Instagram URL format'}
            
            # Get media ID (requires conversion from shortcode)
            # This is complex and requires additional API calls
            # For now, we'll return a message about limitations
            
            return {
                'platform': 'Instagram',
                'error': 'Instagram Graph API requires media ID. Only posts from your authenticated account can be accessed.',
                'info': 'Use oEmbed for public posts or authenticate with your Instagram account.',
                'url': url
            }
            
        except Exception as e:
            return {
                'error': f'Graph API extraction failed: {str(e)}',
                'platform': 'Instagram'
            }
    
    def _extract_media_code(self, url):
        """Extract media code from Instagram URL"""
        # https://www.instagram.com/p/ABC123xyz/
        # https://www.instagram.com/reel/ABC123xyz/
        parts = url.rstrip('/').split('/')
        if len(parts) >= 5 and parts[3] in ['p', 'reel', 'tv']:
            return parts[4]
        return None
    
    def get_user_media(self, user_id=None):
        """
        Get media from authenticated user
        Only works if user has authorized the app
        """
        if not self.access_token:
            return {'error': 'No access token available'}
        
        try:
            endpoint = f"{self.graph_url}/me/media"
            params = {
                'fields': 'id,caption,media_type,media_url,permalink,timestamp,username',
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
                'error': f'Failed to get user media: {str(e)}'
            }
    
    def _extract_with_apify(self, url):
        """
        Extract Instagram post using Apify scraper
        Costs ~$0.05-0.10 per run from your credit balance
        """
        try:
            from apify_client import ApifyClient
            
            client = ApifyClient(self.apify_token)
            
            # Configure scraper to get just this one post
            run_input = {
                "directUrls": [url],
                "resultsType": "posts",
                "resultsLimit": 1,
                "searchType": "hashtag",
                "searchLimit": 1
            }
            
            print(f"Starting Apify Instagram scraper (this costs ~$0.05 from your credits)...")
            
            # Run the Instagram scraper actor
            run = client.actor("apify/instagram-scraper").call(run_input=run_input)
            
            # Get results from the run
            results = []
            for item in client.dataset(run["defaultDatasetId"]).iterate_items():
                results.append(item)
            
            if not results:
                return {
                    'error': 'No data found for this Instagram post',
                    'platform': 'Instagram'
                }
            
            post = results[0]
            
            print(f"✅ Successfully extracted Instagram post via Apify!")
            print(f"   Author: {post.get('ownerUsername', 'Unknown')}")
            print(f"   Caption length: {len(post.get('caption', ''))} chars")
            
            return {
                'platform': 'Instagram',
                'author': post.get('ownerUsername', 'Unknown'),
                'author_name': post.get('ownerFullName', ''),
                'content': post.get('caption', ''),
                'date': post.get('timestamp', ''),
                'url': url,
                'likes': post.get('likesCount', 0),
                'comments': post.get('commentsCount', 0),
                'media_type': post.get('type', 'unknown'),
                'method': 'apify_scraper'
            }
        
        except ImportError:
            return {
                'error': 'Apify client not installed. Run: pip install apify-client',
                'platform': 'Instagram'
            }
        except Exception as e:
            print(f"❌ Apify scraping failed: {str(e)}")
            return {
                'error': f'Apify scraping failed: {str(e)}',
                'platform': 'Instagram'
            }


def test_instagram_extractor():
    """Test Instagram extraction with sample URLs"""
    extractor = InstagramExtractor()
    
    # Test with a public Instagram post URL
    test_urls = [
        "https://www.instagram.com/p/ABC123xyz/",  # Replace with real URL
    ]
    
    for url in test_urls:
        print(f"\n{'='*60}")
        print(f"Testing: {url}")
        print('='*60)
        
        result = extractor.extract(url)
        
        if 'error' in result:
            print(f"❌ Error: {result['error']}")
        else:
            print(f"✅ Platform: {result.get('platform')}")
            print(f"   Author: {result.get('author')}")
            print(f"   Content: {result.get('content')[:100]}...")
            print(f"   Method: {result.get('method')}")


if __name__ == "__main__":
    test_instagram_extractor()
