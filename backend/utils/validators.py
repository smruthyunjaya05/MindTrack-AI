"""
URL Validators
Validate and parse social media URLs
"""

import re
from typing import Optional, Dict

class URLValidator:
    """Validate and parse social media URLs"""
    
    # URL patterns for different platforms
    PATTERNS = {
        'twitter': [
            r'https?://(?:www\.)?twitter\.com/\w+/status/(\d+)',
            r'https?://(?:www\.)?x\.com/\w+/status/(\d+)',
        ],
        'reddit': [
            r'https?://(?:www\.)?reddit\.com/r/(\w+)/comments/(\w+)/([^/]+)/?',
        ],
        'instagram': [
            r'https?://(?:www\.)?instagram\.com/p/([A-Za-z0-9_-]+)/?',
            r'https?://(?:www\.)?instagram\.com/reel/([A-Za-z0-9_-]+)/?',
            r'https?://(?:www\.)?instagram\.com/tv/([A-Za-z0-9_-]+)/?',
        ],
        'threads': [
            r'https?://(?:www\.)?threads\.(?:net|com)/@[\w.]+/post/([A-Za-z0-9_-]+)/?',
        ],
        'facebook': [
            r'https?://(?:www\.)?facebook\.com/[\w.]+/posts/(\d+)',
            r'https?://(?:www\.)?facebook\.com/permalink\.php\?story_fbid=(\d+)',
            r'https?://(?:www\.)?facebook\.com/\d+/posts/(\d+)',
        ],
    }
    
    @staticmethod
    def detect_platform(url: str) -> Optional[str]:
        """
        Detect which social media platform the URL belongs to
        
        Args:
            url: Social media URL
            
        Returns:
            Platform name ('twitter', 'reddit', 'instagram', 'facebook') or None
        """
        if not url:
            return None
            
        # Normalize URL
        url = url.strip().lower()
        
        # Check each platform
        for platform, patterns in URLValidator.PATTERNS.items():
            for pattern in patterns:
                if re.match(pattern, url):
                    return platform
        
        return None
    
    @staticmethod
    def extract_twitter_id(url: str) -> Optional[str]:
        """Extract tweet ID from Twitter/X URL"""
        for pattern in URLValidator.PATTERNS['twitter']:
            match = re.match(pattern, url)
            if match:
                return match.group(1)
        return None
    
    @staticmethod
    def extract_reddit_info(url: str) -> Optional[Dict[str, str]]:
        """Extract subreddit and post ID from Reddit URL"""
        pattern = URLValidator.PATTERNS['reddit'][0]
        match = re.match(pattern, url)
        if match:
            return {
                'subreddit': match.group(1),
                'post_id': match.group(2),
                'title': match.group(3)
            }
        return None
    
    @staticmethod
    def extract_instagram_id(url: str) -> Optional[str]:
        """Extract media ID from Instagram URL"""
        pattern = URLValidator.PATTERNS['instagram'][0]
        match = re.match(pattern, url)
        if match:
            return match.group(1)
        return None
    
    @staticmethod
    def extract_facebook_id(url: str) -> Optional[str]:
        """Extract post ID from Facebook URL"""
        for pattern in URLValidator.PATTERNS['facebook']:
            match = re.match(pattern, url)
            if match:
                return match.group(1)
        return None
    
    @staticmethod
    def extract_threads_id(url: str) -> Optional[str]:
        """Extract thread ID from Threads URL"""
        pattern = URLValidator.PATTERNS['threads'][0]
        match = re.match(pattern, url)
        if match:
            return match.group(1)
        return None
    
    @staticmethod
    def is_valid_url(url: str) -> bool:
        """Check if URL is a valid social media URL"""
        return URLValidator.detect_platform(url) is not None
