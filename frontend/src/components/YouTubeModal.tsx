'use client';

import { useState, useEffect } from 'react';
import { X, Play, Clock, Eye, Star, ExternalLink, Youtube } from 'lucide-react';
import { API_URL } from '@/lib/config';

interface Video {
  title: string;
  creator: string;
  url: string;
  duration?: string;
  difficulty?: string;
  views?: string;
  rating?: number;
  description: string;
  thumbnail?: string;
}

interface YouTubeModalProps {
  topic: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function YouTubeModal({ topic, isOpen, onClose }: YouTubeModalProps) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && topic) {
      loadVideos();
    }
  }, [isOpen, topic]);

  const loadVideos = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/api/youtube/recommend/${encodeURIComponent(topic)}?max_results=3`
      );
      const data = await response.json();
      setVideos(data.videos || []);
    } catch (error) {
      console.error('Failed to load videos:', error);
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  const extractVideoId = (url: string): string | null => {
    // Extract YouTube video ID from URL
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([^&?\/\s]+)/);
    return match ? match[1] : null;
  };

  const getYouTubeThumbnail = (url: string): string => {
    const videoId = extractVideoId(url);
    if (videoId) {
      // Use maxresdefault for best quality, fallback to hqdefault
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }
    return '';
  };

  const getDifficultyColor = (difficulty?: string) => {
    if (!difficulty) return 'bg-gray-100 text-gray-700';
    if (difficulty.includes('beginner')) return 'bg-green-100 text-green-700';
    if (difficulty.includes('intermediate')) return 'bg-yellow-100 text-yellow-700';
    if (difficulty.includes('advanced')) return 'bg-red-100 text-red-700';
    return 'bg-gray-100 text-gray-700';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-in fade-in duration-200">
        {/* Header */}
        <div className="bg-linear-to-r from-red-600 via-red-500 to-pink-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold flex items-center">
                <Youtube className="w-7 h-7 mr-3 animate-pulse" />
                Learn: {topic}
              </h2>
              <p className="text-red-100 text-sm mt-1 flex items-center">
                <Play className="w-4 h-4 mr-1" />
                High-quality YouTube resources curated for interview prep
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-all hover:rotate-90 duration-300"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)] bg-linear-to-b from-gray-50 to-white">
          {loading ? (
            <div className="text-center py-16">
              <div className="relative w-16 h-16 mx-auto mb-6">
                <div className="absolute inset-0 border-4 border-red-200 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-red-600 rounded-full border-t-transparent animate-spin"></div>
              </div>
              <p className="text-gray-600 font-medium">Finding best videos for you...</p>
            </div>
          ) : videos.length === 0 ? (
            <div className="text-center py-16">
              <Youtube className="w-20 h-20 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No videos found</h3>
              <p className="text-gray-600">
                Try searching for: Arrays, Trees, Graphs, or Dynamic Programming
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {videos.map((video, index) => {
                const thumbnailUrl = video.thumbnail || getYouTubeThumbnail(video.url);
                
                return (
                  <a
                    key={index}
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-white rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-red-300 transform hover:-translate-y-1"
                  >
                    <div className="flex flex-col md:flex-row gap-4">
                      {/* Thumbnail Section */}
                      <div className="relative md:w-80 h-48 md:h-auto bg-gray-900 shrink-0 group">
                        {thumbnailUrl ? (
                          <>
                            <img 
                              src={thumbnailUrl} 
                              alt={video.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                // Fallback to default thumbnail if maxres fails
                                const videoId = extractVideoId(video.url);
                                if (videoId) {
                                  e.currentTarget.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                                }
                              }}
                            />
                            {/* Play Overlay */}
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all flex items-center justify-center">
                              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform shadow-xl">
                                <Play className="w-8 h-8 text-white ml-1" fill="white" />
                              </div>
                            </div>
                            {/* Video Duration Badge */}
                            {video.duration && (
                              <div className="absolute bottom-3 right-3 bg-black/80 text-white px-2 py-1 rounded text-xs font-semibold">
                                {video.duration}
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="w-full h-full bg-linear-to-br from-red-500 via-red-600 to-pink-500 flex items-center justify-center">
                            <Youtube className="w-16 h-16 text-white opacity-80" />
                          </div>
                        )}
                      </div>

                      {/* Video Info Section */}
                      <div className="flex-1 p-4 md:p-5 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-bold text-gray-900 text-lg leading-tight hover:text-red-600 transition pr-2">
                            {video.title}
                          </h3>
                          <ExternalLink className="w-5 h-5 text-gray-400 shrink-0" />
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-3 font-medium">{video.creator}</p>
                        
                        <p className="text-sm text-gray-700 mb-4 line-clamp-2">{video.description}</p>
                        
                        {/* Metadata */}
                        <div className="flex items-center gap-3 text-sm flex-wrap">
                          {video.views && (
                            <span className="flex items-center text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                              <Eye className="w-4 h-4 mr-1.5" />
                              {video.views}
                            </span>
                          )}
                          {video.rating && (
                            <span className="flex items-center text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full">
                              <Star className="w-4 h-4 mr-1.5 fill-current" />
                              {video.rating}/5
                            </span>
                          )}
                          {video.difficulty && (
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(video.difficulty)}`}>
                              {video.difficulty.replace('_', ' ').toUpperCase()}
                            </span>
                          )}
                        </div>

                        {/* Watch Now Button */}
                        <div className="mt-4">
                          <span className="inline-flex items-center px-4 py-2 bg-linear-to-r from-red-500 to-pink-500 text-white rounded-lg font-semibold text-sm hover:from-red-600 hover:to-pink-600 transition shadow-md">
                            <Play className="w-4 h-4 mr-2" />
                            Watch on YouTube
                          </span>
                        </div>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            💡 Tip: Watch at 1.5x speed for faster learning • Take notes for better retention
          </p>
        </div>
      </div>
    </div>
  );
}
