import os
import requests
from typing import List, Dict, Optional
from functools import lru_cache

class YouTubeResourceService:
    """
    Dynamic YouTube recommendations using YouTube Data API v3
    FREE with 10,000 units/day quota
    """
    
    def __init__(self):
        self.api_key = os.getenv("YOUTUBE_API_KEY")
        self.base_url = "https://www.googleapis.com/youtube/v3"
        
        # Cache for reducing API calls
        self.cache = {}
        
        # Curated channel IDs for quality filtering
        self.trusted_channels = {
            'dsa': [
                'UC-sxSmmDR_IVXwW_YFJr6jA',  # Take U Forward (Striver)
                'UCWr0mx597DnSGLFk1WfvSkQ',  # Abdul Bari
                'UCZCFT11CWBi3MHNlGf019nw',  # Abdul Bari (alternate)
                'UCEBb1b_L6zDS3xTUrIALZOw',  # William Fiset
            ],
            'system_design': [
                'UCRPMAqdtSgd0Ipeef7iFsKw',  # Gaurav Sen
                'UC9vLsnF6QPYuH3q5fg9Dung',  # System Design Interview
            ]
        }
    
    def search_videos(
        self, 
        topic: str, 
        max_results: int = 3,
        difficulty: Optional[str] = None
    ) -> List[Dict]:
        """
        Search YouTube dynamically for best videos on a topic
        """
        
        # Check cache first
        cache_key = f"{topic}_{max_results}_{difficulty}"
        if cache_key in self.cache:
            print(f"  ✓ Using cached results for: {topic}")
            return self.cache[cache_key]
        
        if not self.api_key:
            print("⚠️  YouTube API key not found. Using fallback.")
            return self._fallback_search(topic)
        
        try:
            # Build search query
            search_query = self._build_search_query(topic, difficulty)
            
            # Call YouTube API
            params = {
                'part': 'snippet',
                'q': search_query,
                'type': 'video',
                'maxResults': max_results * 2,  # Get extras to filter
                'key': self.api_key,
                'order': 'relevance',
                'videoDuration': 'medium',  # 4-20 minutes
                'videoDefinition': 'high',
                'relevanceLanguage': 'en',
            }
            
            response = requests.get(
                f"{self.base_url}/search",
                params=params,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                videos = self._process_search_results(data, topic)
                
                # Cache results
                self.cache[cache_key] = videos[:max_results]
                
                print(f"  ✓ Found {len(videos)} videos for: {topic}")
                return videos[:max_results]
            else:
                print(f"  ✗ YouTube API error: {response.status_code}")
                return self._fallback_search(topic)
                
        except Exception as e:
            print(f"  ✗ YouTube search failed: {e}")
            return self._fallback_search(topic)
    
    def _build_search_query(self, topic: str, difficulty: Optional[str]) -> str:
        """Build optimized search query"""
        
        # Base query
        query = f"{topic} tutorial programming"
        
        # Add difficulty modifier
        if difficulty == 'beginner':
            query += " for beginners explained simple"
        elif difficulty == 'intermediate':
            query += " interview questions"
        elif difficulty == 'advanced':
            query += " advanced techniques"
        
        # Add quality indicators
        query += " striver abdul bari"
        
        return query
    
    def _process_search_results(self, data: Dict, topic: str) -> List[Dict]:
        """Process and filter YouTube API results"""
        
        videos = []
        
        for item in data.get('items', []):
            snippet = item.get('snippet', {})
            
            # Extract video info
            video = {
                'title': snippet.get('title', 'Unknown'),
                'creator': snippet.get('channelTitle', 'Unknown'),
                'url': f"https://www.youtube.com/watch?v={item['id']['videoId']}",
                'thumbnail': snippet.get('thumbnails', {}).get('high', {}).get('url', ''),
                'description': snippet.get('description', '')[:200] + '...',
                'published_at': snippet.get('publishedAt', ''),
                'channel_id': snippet.get('channelId', ''),
                'topic': topic
            }
            
            # Filter quality - prefer trusted channels
            if self._is_quality_video(video):
                videos.append(video)
        
        return videos
    
    def _is_quality_video(self, video: Dict) -> bool:
        """Check if video is from trusted source"""
        
        # Check if from trusted channel
        for category, channels in self.trusted_channels.items():
            if video['channel_id'] in channels:
                return True
        
        # Check title quality indicators
        quality_keywords = [
            'tutorial', 'explained', 'complete', 'course',
            'interview', 'leetcode', 'dsa', 'algorithm'
        ]
        
        title_lower = video['title'].lower()
        return any(keyword in title_lower for keyword in quality_keywords)
    
    def _fallback_search(self, topic: str) -> List[Dict]:
        """Fallback when API fails or key missing"""
        
        # Return generic recommendations
        return [
            {
                'title': f"{topic} Tutorial - Take U Forward",
                'creator': "Take U Forward (Striver)",
                'url': f"https://www.youtube.com/results?search_query={topic}+striver",
                'description': f"Search YouTube for {topic} by Striver",
                'thumbnail': '',
                'topic': topic
            },
            {
                'title': f"{topic} Explained - Abdul Bari",
                'creator': "Abdul Bari",
                'url': f"https://www.youtube.com/results?search_query={topic}+abdul+bari",
                'description': f"Search YouTube for {topic} by Abdul Bari",
                'thumbnail': '',
                'topic': topic
            }
        ]
    
    def get_video_details(self, video_ids: List[str]) -> List[Dict]:
        """
        Get detailed info for specific videos
        Useful for getting duration, view count, etc.
        """
        
        if not self.api_key or not video_ids:
            return []
        
        try:
            params = {
                'part': 'snippet,contentDetails,statistics',
                'id': ','.join(video_ids),
                'key': self.api_key
            }
            
            response = requests.get(
                f"{self.base_url}/videos",
                params=params,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                return self._process_video_details(data)
            
        except Exception as e:
            print(f"  ✗ Failed to get video details: {e}")
        
        return []
    
    def _process_video_details(self, data: Dict) -> List[Dict]:
        """Process video details from API"""
        
        videos = []
        
        for item in data.get('items', []):
            snippet = item.get('snippet', {})
            statistics = item.get('statistics', {})
            content = item.get('contentDetails', {})
            
            video = {
                'id': item.get('id'),
                'title': snippet.get('title'),
                'creator': snippet.get('channelTitle'),
                'url': f"https://www.youtube.com/watch?v={item['id']}",
                'duration': self._parse_duration(content.get('duration', 'PT0S')),
                'view_count': int(statistics.get('viewCount', 0)),
                'like_count': int(statistics.get('likeCount', 0)),
                'thumbnail': snippet.get('thumbnails', {}).get('high', {}).get('url'),
                'description': snippet.get('description', '')[:200]
            }
            
            videos.append(video)
        
        return videos
    
    def _parse_duration(self, duration: str) -> str:
        """Parse ISO 8601 duration to readable format"""
        import re
        
        # Parse PT1H30M45S format
        match = re.match(r'PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?', duration)
        
        if not match:
            return "Unknown"
        
        hours, minutes, seconds = match.groups()
        
        parts = []
        if hours:
            parts.append(f"{hours}h")
        if minutes:
            parts.append(f"{minutes}m")
        if seconds and not hours:
            parts.append(f"{seconds}s")
        
        return ' '.join(parts) if parts else "0m"
    
    @lru_cache(maxsize=100)
    def get_channel_quality_score(self, channel_id: str) -> float:
        """Get quality score for a channel (cached)"""
        
        if not self.api_key:
            return 0.5
        
        try:
            params = {
                'part': 'statistics',
                'id': channel_id,
                'key': self.api_key
            }
            
            response = requests.get(
                f"{self.base_url}/channels",
                params=params,
                timeout=5
            )
            
            if response.status_code == 200:
                data = response.json()
                stats = data['items'][0]['statistics']
                
                # Calculate quality score
                subscribers = int(stats.get('subscriberCount', 0))
                videos = int(stats.get('videoCount', 1))
                views = int(stats.get('viewCount', 0))
                
                # Higher score = better quality
                score = min(1.0, (subscribers / 100000) * 0.5 + (views / videos / 10000) * 0.5)
                
                return score
        
        except Exception:
            pass
        
        return 0.5
