'use client';

import { useState, useEffect } from 'react';
import { TrendingDown, AlertCircle, Target, Calendar, BarChart3 } from 'lucide-react';
import { API_URL } from '@/lib/config';

interface Weakness {
  topic: string;
  avg_score: number;
  level: string;
  next_session: string;
}

export default function WeaknessAnalysis() {
  const [weaknesses, setWeaknesses] = useState<Weakness[]>([]);

  useEffect(() => {
    loadWeaknesses();
  }, []);

  const loadWeaknesses = async () => {
    try {
      const response = await fetch(`${API_URL}/api/peer/group/1/weakness`);
      const data = await response.json();
      setWeaknesses(data.weak_topics);
    } catch (error) {
      console.error('Failed to load weaknesses:', error);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'high': return 'from-red-500 to-red-600';
      case 'medium': return 'from-yellow-500 to-yellow-600';
      case 'low': return 'from-green-500 to-green-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-red-50 to-pink-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <TrendingDown className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Group Weakness Analysis</h1>
          <p className="text-gray-600">Identify and improve weak topics together</p>
        </div>

        {/* Summary Card */}
        <div className="bg-linear-to-r from-red-600 to-pink-600 rounded-2xl p-8 text-white mb-8 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Your Group Struggles Most With:</h2>
              <div className="flex items-center gap-4">
                <span className="text-4xl font-bold">Graphs</span>
                <span className="px-4 py-2 bg-white/20 rounded-full text-sm font-semibold">
                  Avg Score: 42%
                </span>
              </div>
            </div>
            <button className="px-6 py-3 bg-white text-red-600 rounded-lg font-bold hover:bg-gray-100 transition">
              Schedule Group Session
            </button>
          </div>
        </div>

        {/* Weakness List */}
        <div className="space-y-6">
          {weaknesses.map((weakness, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-2xl font-bold text-gray-900">{weakness.topic}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getLevelBadge(weakness.level)}`}>
                      {weakness.level.toUpperCase()} Priority
                    </span>
                  </div>

                  {/* Score Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Group Average Score</span>
                      <span className="text-sm font-bold text-gray-900">{weakness.avg_score}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full bg-linear-to-r ${getLevelColor(weakness.level)}`}
                        style={{ width: `${weakness.avg_score}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Next Session: {weakness.next_session}
                    </span>
                    <span className="flex items-center">
                      <Target className="w-4 h-4 mr-1" />
                      Target: 80%+
                    </span>
                  </div>
                </div>

                <button className={`px-6 py-3 bg-linear-to-r ${getLevelColor(weakness.level)} text-white rounded-lg font-semibold hover:opacity-90 transition whitespace-nowrap`}>
                  Practice Now
                </button>
              </div>

              {/* Recommendations */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">📚 Recommended Actions:</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• Watch curated YouTube videos on {weakness.topic}</li>
                  <li>• Solve 5-7 easy problems first, then move to medium</li>
                  <li>• Join group practice session scheduled for {weakness.next_session}</li>
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Group Improvement Graph */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <BarChart3 className="w-6 h-6 mr-2 text-red-600" />
            Group Progress Over Time
          </h3>
          <div className="h-64 bg-linear-to-t from-gray-50 to-white rounded-lg flex items-center justify-center">
            <p className="text-gray-500">📈 Graph showing improvement trends would appear here</p>
          </div>
        </div>
      </div>
    </div>
  );
}
