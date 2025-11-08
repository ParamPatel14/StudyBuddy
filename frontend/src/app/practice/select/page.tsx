'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getOverallProgress } from '@/lib/api';
import { TopicProgress } from '@/lib/types';
import { Brain, TrendingUp, Target, Zap, ChevronRight } from 'lucide-react';

export default function TopicSelectionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = searchParams.get('planId');
  const userId = 1;

  const [topics, setTopics] = useState<TopicProgress[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('medium');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (planId) {
      loadTopics();
    }
  }, [planId]);

  const loadTopics = async () => {
    try {
      const data = await getOverallProgress(userId, parseInt(planId!));
      setTopics(data.topics);
    } catch (error) {
      console.error('Failed to load topics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartPractice = () => {
    if (!selectedTopic) {
      alert('Please select a topic');
      return;
    }
    router.push(`/practice/session?topicId=${selectedTopic}&difficulty=${selectedDifficulty}&planId=${planId}`);
  };

  const getMasteryBadge = (level: number) => {
    if (level >= 80) return { text: 'Mastered', color: 'bg-green-100 text-green-800' };
    if (level >= 60) return { text: 'Good', color: 'bg-yellow-100 text-yellow-800' };
    if (level >= 40) return { text: 'Learning', color: 'bg-blue-100 text-blue-800' };
    return { text: 'Needs Work', color: 'bg-red-100 text-red-800' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading topics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Choose Your Practice Topic</h1>
          <p className="text-gray-600">Select a topic and difficulty level to begin</p>
        </div>

        {/* Topics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {topics.map((topic) => {
            const badge = getMasteryBadge(topic.mastery_level);
            const isSelected = selectedTopic === topic.topic_id;

            return (
              <div
                key={topic.topic_id}
                onClick={() => setSelectedTopic(topic.topic_id)}
                className={`bg-white rounded-xl p-6 cursor-pointer transition transform hover:scale-105 ${
                  isSelected ? 'ring-4 ring-blue-500 shadow-xl' : 'shadow-md hover:shadow-lg'
                }`}
              >
                {/* Topic Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900 mb-2">{topic.topic_name}</h3>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${badge.color}`}>
                      {badge.text}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-blue-600">
                      {topic.mastery_level.toFixed(0)}%
                    </div>
                    <div className="text-xs text-gray-500">Mastery</div>
                  </div>
                </div>

                {/* Stats */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center">
                      <Target className="w-4 h-4 mr-1" />
                      Progress
                    </span>
                    <span className="font-semibold">{topic.completion_percentage.toFixed(0)}%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      Accuracy
                    </span>
                    <span className="font-semibold">{topic.accuracy_rate.toFixed(1)}%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center">
                      <Brain className="w-4 h-4 mr-1" />
                      Attempted
                    </span>
                    <span className="font-semibold">{topic.attempted}/{topic.total_questions}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${topic.completion_percentage}%` }}
                  />
                </div>

                {/* Difficulty Breakdown */}
                <div className="flex gap-1">
                  {topic.difficulty_breakdown.map((diff) => (
                    <div key={diff.difficulty} className="flex-1 text-center">
                      <div className="text-xs text-gray-500 capitalize">{diff.difficulty}</div>
                      <div className="text-sm font-bold">{diff.attempted}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Difficulty Selection */}
        {selectedTopic && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6 animate-fade-in">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Zap className="w-6 h-6 mr-2 text-yellow-500" />
              Choose Difficulty Level
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['easy', 'medium', 'hard'].map((difficulty) => (
                <button
                  key={difficulty}
                  onClick={() => setSelectedDifficulty(difficulty)}
                  className={`p-4 rounded-lg border-2 transition ${
                    selectedDifficulty === difficulty
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">
                      {difficulty === 'easy' && '🟢'}
                      {difficulty === 'medium' && '🟡'}
                      {difficulty === 'hard' && '🔴'}
                    </div>
                    <div className="font-bold text-lg capitalize">{difficulty}</div>
                    <div className="text-sm text-gray-600">
                      {difficulty === 'easy' && 'Basic concepts & recall'}
                      {difficulty === 'medium' && 'Application & reasoning'}
                      {difficulty === 'hard' && 'Advanced problem solving'}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Start Button */}
        {selectedTopic && (
          <div className="text-center">
            <button
              onClick={handleStartPractice}
              className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition transform hover:scale-105 shadow-lg flex items-center justify-center mx-auto"
            >
              Start Practice Session
              <ChevronRight className="w-6 h-6 ml-2" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
