from fastapi import APIRouter, HTTPException
from app.services.youtube_service import YouTubeResourceService
from typing import Optional

router = APIRouter(prefix="/api/youtube", tags=["youtube"])
youtube_service = YouTubeResourceService()

@router.get("/recommend/{topic}")
async def recommend_videos(
    topic: str,
    max_results: int = 3,
    difficulty: Optional[str] = None
):
    """
    Get recommended YouTube videos for a topic
    100% FREE - No API calls needed
    """
    try:
        videos = youtube_service.get_topic_videos(
            topic=topic,
            max_results=max_results,
            difficulty=difficulty
        )
        
        if not videos:
            return {
                "topic": topic,
                "videos": [],
                "message": f"No curated videos found for {topic}. Try: Arrays, Trees, Graphs, Dynamic Programming"
            }
        
        return {
            "topic": topic,
            "videos": videos,
            "count": len(videos)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/topics")
async def get_all_topics():
    """Get list of all topics with YouTube resources"""
    topics = youtube_service.get_all_topics()
    return {
        "topics": topics,
        "count": len(topics)
    }

@router.get("/search")
async def search_videos(
    query: str,
    max_results: int = 5
):
    """Search across all YouTube resources"""
    results = youtube_service.search_videos(query, max_results)
    return {
        "query": query,
        "results": results,
        "count": len(results)
    }
