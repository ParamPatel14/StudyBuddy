'use client';
import Chatbot from '@/components/Chatbot';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getDashboard } from '@/lib/api';
import { DashboardData } from '@/lib/types';
import { Calendar, CheckCircle, Clock, TrendingUp, BookOpen, Target, Brain, Zap, Users } from 'lucide-react';

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const planId = searchParams.get('planId');

  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (planId) {
      loadDashboard();
    }
  }, [planId]);

  const loadDashboard = async () => {
    try {
      const result = await getDashboard(parseInt(planId!));
      setData(result);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartSession = (topicId: number, topicName: string) => {
    console.log('Starting session for:', topicName, 'ID:', topicId);
    
    // Go directly to practice session for this topic
    router.push(`/practice/session?topicId=${topicId}&difficulty=medium&planId=${planId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Study Plan Found</h2>
          <p className="text-gray-600 mb-6">Please create a study plan first</p>
          <button
            onClick={() => router.push('/onboarding')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Create Study Plan
          </button>
          <button
  onClick={() => router.push('/peer')}
  className="px-6 py-3 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition flex items-center shadow-lg"
>
  <Users className="w-5 h-5 mr-2" />
  Peer Learning
</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Study Dashboard</h1>
          <p className="text-gray-600">
            {data.days_remaining} days until your exam
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Days Remaining</p>
                <p className="text-3xl font-bold text-blue-600">{data.days_remaining}</p>
              </div>
              <Calendar className="w-12 h-12 text-blue-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Progress</p>
                <p className="text-3xl font-bold text-green-600">{data.progress}%</p>
              </div>
              <TrendingUp className="w-12 h-12 text-green-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-3xl font-bold text-purple-600">{data.completed_sessions}</p>
              </div>
              <CheckCircle className="w-12 h-12 text-purple-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Sessions</p>
                <p className="text-3xl font-bold text-orange-600">{data.total_sessions}</p>
              </div>
              <Clock className="w-12 h-12 text-orange-600 opacity-20" />
            </div>
          </div>
        </div>

        {/* Today's Tasks */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Today's Tasks</h2>
          {data.today_tasks.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No tasks scheduled for today</p>
              <button
                onClick={() => router.push(`/practice/select?planId=${planId}`)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Start Practice Session
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {data.today_tasks.map((task, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition border border-gray-200"
                >
                  <div className="flex items-center flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                      task.completed ? 'bg-green-100' : 'bg-blue-100'
                    }`}>
                      {task.completed ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : (
                        <BookOpen className="w-6 h-6 text-blue-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{task.topic}</h3>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-sm text-gray-600 flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {task.duration} hours
                        </span>
                        {task.completed && (
                          <span className="text-sm text-green-600 font-medium">
                            ✓ Completed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {!task.completed && (
                    <button 
                      onClick={() => handleStartSession(task.topic_id, task.topic)}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold ml-4"
                    >
                      Start
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => router.push(`/practice/select?planId=${planId}`)}
            className="bg-linear-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition transform hover:scale-105 text-left"
          >
            <div className="flex items-center mb-3">
              <Target className="w-8 h-8 mr-3" />
              <h3 className="text-xl font-bold">Practice Questions</h3>
            </div>
            <p className="text-blue-100">Test your knowledge with AI-generated MCQs and written questions</p>
          </button>

          <button
            onClick={() => router.push(`/practice/weak-topics?planId=${planId}`)}
            className="bg-linear-to-r from-orange-500 to-red-500 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition transform hover:scale-105 text-left"
          >
            <div className="flex items-center mb-3">
              <TrendingUp className="w-8 h-8 mr-3" />
              <h3 className="text-xl font-bold">Weak Topics</h3>
            </div>
            <p className="text-orange-100">Focus on areas that need improvement and boost your mastery</p>
          </button>

          {/* In dashboard/page.tsx, add this quick action button: */}

          <button
            onClick={() => router.push(`/exam-day?planId=${planId}`)}
            className="bg-linear-to-r from-red-500 to-orange-500 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition transform hover:scale-105 text-left"
          >
            <div className="flex items-center mb-3">
              <Zap className="w-8 h-8 mr-3" />
              <h3 className="text-xl font-bold">Exam Day Prep</h3>
            </div>
            <p className="text-orange-100">Last-minute revision and confidence boost</p>
          </button>


          <button
            onClick={() => router.push(`/practice/reviews?planId=${planId}`)}
            className="bg-linear-to-r from-purple-500 to-pink-500 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition transform hover:scale-105 text-left"
          >
            <div className="flex items-center mb-3">
              <Brain className="w-8 h-8 mr-3" />
              <h3 className="text-xl font-bold">Review Schedule</h3>
            </div>
            <p className="text-purple-100">Check your spaced repetition schedule for optimal retention</p>
          </button>
           {planId && <Chatbot planId={parseInt(planId)} userId={1} />}
        </div>
      </div>
    </div>
  );
}
