'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getWeakTopics, markTopicForReview } from '@/lib/api';
import { WeakTopic } from '@/lib/types';
import { AlertTriangle, TrendingDown, BookOpen, Clock, Target } from 'lucide-react';

export default function WeakTopicsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = searchParams.get('planId');
  const userId = 1;

  const [weakTopics, setWeakTopics] = useState<WeakTopic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (planId) {
      loadWeakTopics();
    }
  }, [planId]);

  const loadWeakTopics = async () => {
    try {
      const data = await getWeakTopics(userId, parseInt(planId!), 60);
      setWeakTopics(data.weak_topics);
    } catch (error) {
      console.error('Failed to load weak topics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (topicId: number) => {
    try {
      await markTopicForReview(topicId, userId);
      router.push(`/practice/session?topicId=${topicId}&difficulty=easy&planId=${planId}`);
    } catch (error) {
      console.error('Failed to mark for review:', error);
    }
  };

  const getSeverityColor = (mastery: number) => {
    if (mastery < 30) return 'border-red-500 bg-red-50';
    if (mastery < 50) return 'border-orange-500 bg-orange-50';
    return 'border-yellow-500 bg-yellow-50';
  };

  const getSeverityBadge = (mastery: number) => {
    if (mastery < 30) return { text: 'Critical', color: 'bg-red-100 text-red-800' };
    if (mastery < 50) return { text: 'Needs Work', color: 'bg-orange-100 text-orange-800' };
    return { text: 'Below Target', color: 'bg-yellow-100 text-yellow-800' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Analyzing weak areas...</p>
        </div>
      </div>
    );
  }

  if (weakTopics.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Great Job!</h2>
          <p className="text-gray-600 mb-6">
            You don't have any weak topics at the moment. Keep up the excellent work!
          </p>
          <button
            onClick={() => router.push(`/practice?planId=${planId}`)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
          >
            Back to Practice
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-linear-to-r from-orange-500 to-red-500 rounded-xl p-8 text-white mb-8 shadow-lg">
          <div className="flex items-center mb-4">
            <AlertTriangle className="w-12 h-12 mr-4" />
            <div>
              <h1 className="text-3xl font-bold">Topics Needing Attention</h1>
              <p className="text-orange-100">Focus on these areas to improve your overall mastery</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
              <div className="text-3xl font-bold">{weakTopics.length}</div>
              <div className="text-sm text-orange-100">Weak Topics</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
              <div className="text-3xl font-bold">
                {weakTopics.reduce((sum, t) => sum + t.attempted, 0)}
              </div>
              <div className="text-sm text-orange-100">Total Attempts</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
              <div className="text-3xl font-bold">
                {(weakTopics.reduce((sum, t) => sum + t.mastery_level, 0) / weakTopics.length).toFixed(0)}%
              </div>
              <div className="text-sm text-orange-100">Avg Mastery</div>
            </div>
          </div>
        </div>

        {/* Sorting Options */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Sorted by: Lowest Mastery First</h3>
            <span className="text-sm text-gray-600">
              {weakTopics.length} topic{weakTopics.length !== 1 ? 's' : ''} found
            </span>
          </div>
        </div>

        {/* Weak Topics List */}
        <div className="space-y-4">
          {weakTopics.map((topic, index) => {
            const badge = getSeverityBadge(topic.mastery_level);
            
            return (
              <div
                key={topic.topic_id}
                className={`border-l-4 rounded-lg bg-white shadow-md hover:shadow-lg transition p-6 ${getSeverityColor(topic.mastery_level)}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl font-bold text-gray-400">#{index + 1}</span>
                      <h3 className="text-xl font-bold text-gray-900">{topic.topic_name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${badge.color}`}>
                        {badge.text}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      This topic needs more practice to reach your target mastery level
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold text-orange-600">
                      {topic.mastery_level.toFixed(0)}%
                    </div>
                    <div className="text-xs text-gray-500">Current Mastery</div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-white rounded">
                    <div className="flex items-center justify-center text-gray-600 mb-1">
                      <BookOpen className="w-4 h-4 mr-1" />
                      <span className="text-xs">Attempted</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{topic.attempted}</div>
                  </div>
                  <div className="text-center p-3 bg-white rounded">
                    <div className="flex items-center justify-center text-gray-600 mb-1">
                      <Target className="w-4 h-4 mr-1" />
                      <span className="text-xs">Accuracy</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{topic.accuracy_rate.toFixed(0)}%</div>
                  </div>
                  <div className="text-center p-3 bg-white rounded">
                    <div className="flex items-center justify-center text-gray-600 mb-1">
                      <TrendingDown className="w-4 h-4 mr-1" />
                      <span className="text-xs">Gap to Target</span>
                    </div>
                    <div className="text-2xl font-bold text-red-600">{(60 - topic.mastery_level).toFixed(0)}%</div>
                  </div>
                </div>

                {/* Action Plan */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-blue-900 mb-2">📚 Recommended Action Plan</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Start with <strong>Easy</strong> difficulty to build confidence</li>
                    <li>• Complete at least <strong>10 more questions</strong> to improve mastery</li>
                    <li>• Review the lesson content before practicing</li>
                    <li>• Set spaced repetition reminders for this topic</li>
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleReview(topic.topic_id)}
                    className="flex-1 bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition flex items-center justify-center"
                  >
                    <Clock className="w-5 h-5 mr-2" />
                    Start Review Session
                  </button>
                  <button
                    onClick={() => router.push(`/lesson/${topic.topic_id}`)}
                    className="px-6 bg-white border-2 border-orange-600 text-orange-600 py-3 rounded-lg font-semibold hover:bg-orange-50 transition"
                  >
                    View Lesson
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tips Section */}
        <div className="mt-8 bg-linear-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
          <h3 className="text-lg font-bold text-gray-900 mb-3">💡 Tips to Improve Weak Topics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div className="flex items-start">
              <span className="text-2xl mr-3">1️⃣</span>
              <div>
                <strong>Start Easy:</strong> Begin with easy difficulty to build foundational understanding
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-2xl mr-3">2️⃣</span>
              <div>
                <strong>Spaced Repetition:</strong> Review weak topics regularly over time
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-2xl mr-3">3️⃣</span>
              <div>
                <strong>Analyze Mistakes:</strong> Understand why you got answers wrong
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-2xl mr-3">4️⃣</span>
              <div>
                <strong>Practice Daily:</strong> Consistent practice is key to mastery
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
