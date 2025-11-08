'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Code, Clock, CheckCircle, XCircle, TrendingUp, 
  Target, Calendar, BarChart3, Play, Save
} from 'lucide-react';
import { API_URL } from '@/lib/config';

interface TopicAnalytics {
  topic: string;
  attempted: number;
  solved: number;
  solve_rate: number;
  time_spent: number;
  weakness_score: number;
  by_difficulty: {
    easy: number;
    medium: number;
    hard: number;
  };
}

export default function PlacementPractice() {
  const searchParams = useSearchParams();
  const profileId = searchParams.get('profileId') || '1';

  const [analytics, setAnalytics] = useState<TopicAnalytics[]>([]);
  const [dailyProgress, setDailyProgress] = useState<any>(null);
  
  // Practice form
  const [topic, setTopic] = useState('Arrays');
  const [problemName, setProblemName] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [solved, setSolved] = useState(false);
  const [timeSpent, setTimeSpent] = useState(30);
  const [code, setCode] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, [profileId]);

  const loadData = async () => {
    try {
      // Load analytics
      const analyticsRes = await fetch(
        `${API_URL}/api/placement/practice/analytics/${profileId}`
      );
      const analyticsData = await analyticsRes.json();
      setAnalytics(analyticsData.topics);

      // Load daily progress
      const dailyRes = await fetch(
        `${API_URL}/api/placement/practice/daily/${profileId}`
      );
      const dailyData = await dailyRes.json();
      setDailyProgress(dailyData);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!problemName.trim()) {
      alert('Please enter problem name');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(
        `${API_URL}/api/placement/practice/record?profile_id=${profileId}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            topic,
            problem_name: problemName,
            difficulty,
            solved,
            time_spent_minutes: timeSpent,
            code: code || null,
            notes: notes || null
          })
        }
      );

      if (response.ok) {
        alert('Practice recorded successfully!');
        // Reset form
        setProblemName('');
        setCode('');
        setNotes('');
        setSolved(false);
        setTimeSpent(30);
        // Reload data
        loadData();
      }
    } catch (error) {
      console.error('Failed to record practice:', error);
      alert('Failed to record practice');
    } finally {
      setSubmitting(false);
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 to-teal-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-linear-to-r from-green-600 to-teal-600 rounded-2xl p-8 text-white mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center">
            <Code className="w-8 h-8 mr-3" />
            DSA Practice Workspace
          </h1>
          <p className="text-green-100">Track your progress and build consistency</p>
        </div>

        {/* Daily Progress */}
        {dailyProgress && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Calendar className="w-6 h-6 mr-2 text-green-600" />
              Today's Progress
            </h2>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-3xl font-bold text-gray-900">
                  {dailyProgress.completed} / {dailyProgress.target}
                </p>
                <p className="text-sm text-gray-600">Problems Completed</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600">
                  {dailyProgress.progress_percentage.toFixed(0)}%
                </p>
                <p className="text-sm text-gray-600">Goal Progress</p>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-linear-to-r from-green-500 to-teal-500 h-3 rounded-full transition-all"
                style={{ width: `${dailyProgress.progress_percentage}%` }}
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Practice Form */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Play className="w-6 h-6 mr-2 text-green-600" />
              Record Practice
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Topic
                </label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option>Arrays</option>
                  <option>Strings</option>
                  <option>LinkedList</option>
                  <option>Trees</option>
                  <option>Graphs</option>
                  <option>Dynamic Programming</option>
                  <option>Greedy</option>
                  <option>Backtracking</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Problem Name
                </label>
                <input
                  type="text"
                  value={problemName}
                  onChange={(e) => setProblemName(e.target.value)}
                  placeholder="e.g., Two Sum"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Difficulty
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Time (minutes)
                  </label>
                  <input
                    type="number"
                    value={timeSpent}
                    onChange={(e) => setTimeSpent(parseInt(e.target.value))}
                    min="1"
                    max="180"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={solved}
                  onChange={(e) => setSolved(e.target.checked)}
                  className="w-5 h-5 text-green-600"
                  id="solved"
                />
                <label htmlFor="solved" className="ml-2 text-sm font-semibold text-gray-700">
                  Solved successfully
                </label>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Notes (optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Key learnings, approach, mistakes..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full px-6 py-3 bg-linear-to-r from-green-600 to-teal-600 text-white rounded-lg font-bold hover:from-green-700 hover:to-teal-700 disabled:opacity-50 flex items-center justify-center"
              >
                <Save className="w-5 h-5 mr-2" />
                {submitting ? 'Recording...' : 'Record Practice'}
              </button>
            </form>
          </div>

          {/* Analytics */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <BarChart3 className="w-6 h-6 mr-2 text-purple-600" />
              Topic Analytics
            </h2>

            {analytics.length === 0 ? (
              <p className="text-gray-600 text-center py-8">
                No practice data yet. Start solving problems!
              </p>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {analytics.map((topic, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-gray-900">{topic.topic}</h3>
                      <span className="text-sm text-gray-600">
                        {topic.solve_rate.toFixed(0)}% solved
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-3 text-sm">
                      <div className="text-center p-2 bg-gray-50 rounded">
                        <p className="font-bold text-gray-900">{topic.attempted}</p>
                        <p className="text-xs text-gray-600">Attempted</p>
                      </div>
                      <div className="text-center p-2 bg-green-50 rounded">
                        <p className="font-bold text-green-700">{topic.solved}</p>
                        <p className="text-xs text-gray-600">Solved</p>
                      </div>
                      <div className="text-center p-2 bg-blue-50 rounded">
                        <p className="font-bold text-blue-700">{topic.time_spent}m</p>
                        <p className="text-xs text-gray-600">Time</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <div className="flex gap-2">
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded">
                          E: {topic.by_difficulty.easy}
                        </span>
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded">
                          M: {topic.by_difficulty.medium}
                        </span>
                        <span className="px-2 py-1 bg-red-100 text-red-700 rounded">
                          H: {topic.by_difficulty.hard}
                        </span>
                      </div>
                      <span className={`px-2 py-1 rounded ${
                        topic.weakness_score > 0.6 
                          ? 'bg-red-100 text-red-700' 
                          : topic.weakness_score > 0.3
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {topic.weakness_score > 0.6 ? '⚠️ Practice More' : '✓ Good'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
