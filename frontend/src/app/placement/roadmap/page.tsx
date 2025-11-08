'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import YouTubeModal from '@/components/YouTubeModal';
import { 
  Calendar, Code, CheckCircle, Clock, Target, 
  TrendingUp, Users, Layers, AlertCircle, Zap, Play
} from 'lucide-react';

interface DayPlan {
  day: number;
  date: string;
  topic: string;
  frequency: string;
  dsa_questions: string[];
  question_count: number;
  side_task: {
    type: string;
    task: string;
  } | null;
  estimated_hours: number;
}

interface RoadmapData {
  roadmap: DayPlan[];
  statistics: {
    total_days: number;
    total_questions: number;
    unique_topics: number;
    total_hours: number;
    avg_questions_per_day: number;
    side_task_distribution: { [key: string]: number };
  };
  daily_dsa_count: number;
}

export default function PlacementRoadmap() {
  const searchParams = useSearchParams();
  const profileId = searchParams.get('profileId');

  const [roadmap, setRoadmap] = useState<RoadmapData | null>(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  
  // YouTube Modal State
  const [youtubeModal, setYoutubeModal] = useState({
    isOpen: false,
    topic: ''
  });

  useEffect(() => {
    if (profileId) {
      loadRoadmap();
    }
  }, [profileId]);

  const loadRoadmap = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/api/placement/roadmap/${profileId}`);
      if (response.ok) {
        const data = await response.json();
        setRoadmap({ roadmap: data.roadmap, statistics: data as any, daily_dsa_count: 0 });
      }
    } catch (error) {
      console.log('No existing roadmap, need to generate');
    } finally {
      setLoading(false);
    }
  };

  const generateRoadmap = async () => {
    setGenerating(true);
    try {
      const response = await fetch(
        `http://localhost:8000/api/placement/generate-roadmap/${profileId}`,
        { method: 'POST' }
      );
      const data = await response.json();
      setRoadmap(data);
    } catch (error) {
      console.error('Failed to generate roadmap:', error);
      alert('Failed to generate roadmap');
    } finally {
      setGenerating(false);
    }
  };

  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case 'very_high': return 'bg-red-100 text-red-700 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      default: return 'bg-green-100 text-green-700 border-green-300';
    }
  };

  const getSideTaskIcon = (type: string) => {
    switch (type) {
      case 'system_design': return <Layers className="w-5 h-5" />;
      case 'behavioral': return <Users className="w-5 h-5" />;
      case 'aptitude': return <Target className="w-5 h-5" />;
      case 'mock': return <Zap className="w-5 h-5" />;
      default: return <AlertCircle className="w-5 h-5" />;
    }
  };

  const getSideTaskColor = (type: string) => {
    switch (type) {
      case 'system_design': return 'bg-purple-50 border-purple-200 text-purple-700';
      case 'behavioral': return 'bg-blue-50 border-blue-200 text-blue-700';
      case 'aptitude': return 'bg-green-50 border-green-200 text-green-700';
      case 'mock': return 'bg-red-50 border-red-200 text-red-700';
      default: return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading roadmap...</p>
        </div>
      </div>
    );
  }

  if (!roadmap) {
    return (
      <div className="min-h-screen bg-linear-to-br from-green-50 to-teal-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-12 max-w-md text-center">
          <Calendar className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Generate Your Roadmap
          </h2>
          <p className="text-gray-600 mb-8">
            Create a personalized day-by-day preparation plan based on your interview date and available time.
          </p>
          <button
            onClick={generateRoadmap}
            disabled={generating}
            className="px-8 py-4 bg-linear-to-r from-green-600 to-teal-600 text-white rounded-xl font-bold hover:from-green-700 hover:to-teal-700 disabled:opacity-50"
          >
            {generating ? 'Generating...' : 'Generate Roadmap'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 to-teal-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header with Stats */}
        <div className="bg-linear-to-r from-green-600 to-teal-600 rounded-2xl p-8 text-white mb-8 shadow-xl">
          <h1 className="text-3xl font-bold mb-6 flex items-center">
            <Calendar className="w-8 h-8 mr-3" />
            Your Placement Roadmap
          </h1>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-green-100 text-sm">Total Days</p>
              <p className="text-3xl font-bold">{roadmap.statistics.total_days}</p>
            </div>
            <div>
              <p className="text-green-100 text-sm">DSA Questions</p>
              <p className="text-3xl font-bold">{roadmap.statistics.total_questions}</p>
            </div>
            <div>
              <p className="text-green-100 text-sm">Topics Covered</p>
              <p className="text-3xl font-bold">{roadmap.statistics.unique_topics}</p>
            </div>
            <div>
              <p className="text-green-100 text-sm">Total Hours</p>
              <p className="text-3xl font-bold">{roadmap.statistics.total_hours}h</p>
            </div>
          </div>
        </div>

        {/* Roadmap Timeline */}
        <div className="space-y-4">
          {roadmap.roadmap.map((day) => (
            <div
              key={day.day}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="p-6">
                {/* Day Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-linear-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                      {day.day}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{day.topic}</h3>
                      <p className="text-sm text-gray-600">{new Date(day.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getFrequencyColor(day.frequency)}`}>
                      {day.frequency.toUpperCase()}
                    </span>
                    <span className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-1" />
                      {day.estimated_hours}h
                    </span>
                  </div>
                </div>

                {/* DSA Questions */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900 flex items-center">
                      <Code className="w-5 h-5 mr-2 text-green-600" />
                      DSA Practice ({day.question_count} questions)
                    </h4>
                    
                    {/* YouTube Button */}
                    <button
                      onClick={() => setYoutubeModal({ isOpen: true, topic: day.topic })}
                      className="px-4 py-2 bg-linear-to-r from-red-500 to-pink-500 text-white rounded-lg font-semibold hover:from-red-600 hover:to-pink-600 transition flex items-center text-sm shadow-lg"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Learn on YouTube
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {day.dsa_questions.map((question, idx) => (
                      <div key={idx} className="flex items-center bg-gray-50 rounded-lg p-3">
                        <CheckCircle className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
                        <span className="text-sm text-gray-700">{question}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Side Task */}
                {day.side_task && (
                  <div className={`border-2 rounded-lg p-4 ${getSideTaskColor(day.side_task.type)}`}>
                    <div className="flex items-center">
                      {getSideTaskIcon(day.side_task.type)}
                      <span className="ml-2 font-semibold capitalize">{day.side_task.type.replace('_', ' ')}</span>
                    </div>
                    <p className="text-sm mt-2">{day.side_task.task}</p>
                  </div>
                )}
              </div>

              {/* Progress Indicator */}
              <div className="h-1 bg-gray-200">
                <div
                  className="h-full bg-linear-to-r from-green-500 to-teal-500 transition-all"
                  style={{ width: `${((day.day) / roadmap.statistics.total_days) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* YouTube Modal */}
      <YouTubeModal
        topic={youtubeModal.topic}
        isOpen={youtubeModal.isOpen}
        onClose={() => setYoutubeModal({ isOpen: false, topic: '' })}
      />
    </div>
  );
}
