'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getOverallProgress, getWeakTopics, getPracticeStats } from '@/lib/api';
import { TopicProgress, WeakTopic, PracticeStats } from '@/lib/types';
import { BookOpen, TrendingUp, AlertTriangle, Clock, Target, Brain } from 'lucide-react';

export default function PracticeDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = searchParams.get('planId');
  const userId = 1; // TODO: Get from auth context

  const [progress, setProgress] = useState<any>(null);
  const [weakTopics, setWeakTopics] = useState<WeakTopic[]>([]);
  const [stats, setStats] = useState<PracticeStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (planId) {
      loadData();
    }
  }, [planId]);

  const loadData = async () => {
    try {
      const [progressData, weakData, statsData] = await Promise.all([
        getOverallProgress(userId, parseInt(planId!)),
        getWeakTopics(userId, parseInt(planId!)),
        getPracticeStats(userId, 7)
      ]);

      setProgress(progressData);
      setWeakTopics(weakData.weak_topics);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load practice data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMasteryColor = (level: number) => {
    if (level >= 80) return 'text-green-600';
    if (level >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your practice data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Practice Dashboard</h1>
          <p className="text-gray-600">Track your progress and master your topics</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Questions Attempted</p>
                <p className="text-3xl font-bold text-blue-600">{stats?.total_attempts || 0}</p>
              </div>
              <BookOpen className="w-12 h-12 text-blue-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Average Score</p>
                <p className="text-3xl font-bold text-green-600">{stats?.average_score.toFixed(1) || '0.0'}</p>
              </div>
              <Target className="w-12 h-12 text-green-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Study Time (This Week)</p>
                <p className="text-3xl font-bold text-purple-600">{stats?.total_time_minutes.toFixed(0) || 0}m</p>
              </div>
              <Clock className="w-12 h-12 text-purple-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Weak Topics</p>
                <p className="text-3xl font-bold text-orange-600">{weakTopics.length}</p>
              </div>
              <AlertTriangle className="w-12 h-12 text-orange-600 opacity-20" />
            </div>
          </div>
        </div>

        {/* Weak Topics Alert */}
        {weakTopics.length > 0 && (
          <div className="bg-orange-50 border-l-4 border-orange-500 p-4 mb-8 rounded">
            <div className="flex items-start">
              <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5 mr-3" />
              <div className="flex-1">
                <h3 className="font-semibold text-orange-900 mb-2">Topics Needing Attention</h3>
                <p className="text-sm text-orange-800 mb-3">
                  You're struggling with {weakTopics.length} topic{weakTopics.length > 1 ? 's' : ''}. 
                  Focus on these to improve your overall mastery.
                </p>
                <div className="flex flex-wrap gap-2">
                  {weakTopics.map(topic => (
                    <span 
                      key={topic.topic_id}
                      className="px-3 py-1 bg-white rounded-full text-sm text-orange-800 cursor-pointer hover:bg-orange-100"
                      onClick={() => router.push(`/practice/session?topicId=${topic.topic_id}&difficulty=easy`)}
                    >
                      {topic.topic_name} ({topic.mastery_level.toFixed(0)}%)
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Topics Grid */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Brain className="w-6 h-6 mr-2 text-blue-600" />
            Your Topics
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {progress?.topics.map((topic: TopicProgress) => (
              <div 
                key={topic.topic_id}
                className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:shadow-md transition cursor-pointer"
                onClick={() => router.push(`/practice/session?topicId=${topic.topic_id}`)}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">{topic.topic_name}</h3>
                  <span className={`text-2xl font-bold ${getMasteryColor(topic.mastery_level)}`}>
                    {topic.mastery_level.toFixed(0)}%
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Progress:</span>
                    <span className="font-medium">{topic.attempted}/{topic.total_questions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Accuracy:</span>
                    <span className="font-medium">{topic.accuracy_rate.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Avg Score:</span>
                    <span className="font-medium">{topic.average_score.toFixed(1)}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${topic.completion_percentage}%` }}
                  />
                </div>

                {/* Difficulty Badges */}
                <div className="mt-3 flex gap-1">
                  {topic.difficulty_breakdown.map(diff => (
                    <span 
                      key={diff.difficulty}
                      className={`px-2 py-1 text-xs rounded ${getDifficultyColor(diff.difficulty)}`}
                    >
                      {diff.difficulty}: {diff.attempted}
                    </span>
                  ))}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/practice/session?topicId=${topic.topic_id}`);
                  }}
                  className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition text-sm font-medium"
                >
                  Start Practice
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Activity Chart */}
        {stats && stats.daily_breakdown.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="w-6 h-6 mr-2 text-green-600" />
              Weekly Activity
            </h2>
            <div className="flex items-end justify-between h-48 gap-2">
              {stats.daily_breakdown.map((day, index) => {
                const maxAttempts = Math.max(...stats.daily_breakdown.map(d => d.attempts));
                const height = (day.attempts / maxAttempts) * 100;
                
                return (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-blue-600 rounded-t hover:bg-blue-700 transition cursor-pointer relative group"
                      style={{ height: `${height}%` }}
                    >
                      <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                        {day.attempts} questions
                        <br />
                        Avg: {day.average_score.toFixed(1)}
                      </div>
                    </div>
                    <span className="text-xs text-gray-600 mt-2">
                      {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
