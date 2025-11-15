"""
Content Parsers
Parse HTML and extract clean text from social media responses
"""

from bs4 import BeautifulSoup
from datetime import datetime
from typing import Optional

class ContentParser:
    """Parse and clean content from social media APIs"""
    
    @staticmethod
    def parse_twitter_oembed_html(html: str) -> str:
        """
        Extract tweet text from oEmbed HTML response
        
        Args:
            html: HTML content from Twitter oEmbed API
            
        Returns:
            Clean tweet text
        """
        if not html:
            return ""
        
        soup = BeautifulSoup(html, 'html.parser')
        
        # Remove script tags
        for script in soup.find_all('script'):
            script.decompose()
        
        # Get text and clean it
        text = soup.get_text(separator=' ', strip=True)
        
        # Remove extra whitespace
        text = ' '.join(text.split())
        
        return text
    
    @staticmethod
    def format_twitter_date(date_str: str) -> str:
        """
        Format Twitter API date to readable format
        
        Args:
            date_str: ISO 8601 date string from Twitter API
            
        Returns:
            Formatted date string
        """
        try:
            dt = datetime.fromisoformat(date_str.replace('Z', '+00:00'))
            return dt.strftime('%Y-%m-%d %H:%M:%S UTC')
        except:
            return date_str
    
    @staticmethod
    def format_reddit_date(timestamp: int) -> str:
        """
        Format Reddit UTC timestamp to readable format
        
        Args:
            timestamp: Unix timestamp from Reddit API
            
        Returns:
            Formatted date string
        """
        try:
            dt = datetime.fromtimestamp(timestamp)
            return dt.strftime('%Y-%m-%d %H:%M:%S UTC')
        except:
            return str(timestamp)
    
    @staticmethod
    def clean_text(text: str, max_length: Optional[int] = None) -> str:
        """
        Clean and normalize text content
        
        Args:
            text: Raw text content
            max_length: Maximum length to truncate to
            
        Returns:
            Cleaned text
        """
        if not text:
            return ""
        
        # Remove extra whitespace
        text = ' '.join(text.split())
        
        # Truncate if needed
        if max_length and len(text) > max_length:
            text = text[:max_length] + '...'
        
        return text
    
    @staticmethod
    def extract_mentions(text: str) -> list:
        """Extract @mentions from text"""
        import re
        return re.findall(r'@(\w+)', text)
    
    @staticmethod
    def extract_hashtags(text: str) -> list:
        """Extract #hashtags from text"""
        import re
        return re.findall(r'#(\w+)', text)
