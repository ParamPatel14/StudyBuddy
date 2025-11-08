'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { getDashboard } from '@/lib/api';
import { DashboardData } from '@/lib/types';
import { Calendar, CheckCircle, Clock, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
  const searchParams = useSearchParams();
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

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!data) {
    return <div className="flex items-center justify-center min-h-screen">No data found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Study Dashboard</h1>

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
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Today's Tasks</h2>
          {data.today_tasks.length === 0 ? (
            <p className="text-gray-600">No tasks scheduled for today</p>
          ) : (
            <div className="space-y-3">
              {data.today_tasks.map((task, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center">
                    <CheckCircle
                      className={`w-6 h-6 mr-3 ${
                        task.completed ? 'text-green-600' : 'text-gray-300'
                      }`}
                    />
                    <div>
                      <p className="font-medium text-gray-900">{task.topic}</p>
                      <p className="text-sm text-gray-600">{task.duration} hours</p>
                    </div>
                  </div>
                  {!task.completed && (
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      Start
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
