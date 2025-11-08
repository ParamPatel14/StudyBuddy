'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, MessageCircle, UsersRound, Code, Trophy, 
  TrendingDown, ArrowRight, Zap, Target, Calendar
} from 'lucide-react';
import { API_URL } from '@/lib/config';

export default function PeerLearningDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await fetch(`${API_URL}/api/peer/stats`);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        setError(true);
        // Use default stats if API fails
        setStats({
          active_partners: 0,
          doubts_resolved: 0,
          groups_joined: 0,
          challenges_completed: 0,
          current_streak: 0
        });
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
      setError(true);
      // Use default stats
      setStats({
        active_partners: 0,
        doubts_resolved: 0,
        groups_joined: 0,
        challenges_completed: 0,
        current_streak: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      title: 'Find Study Partners',
      description: 'Match with peers who share your goals',
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      path: '/peer/partners',
      stats: stats?.active_partners || 0,
      statsLabel: 'Active Partners'
    },
    {
      title: 'Doubt Threads',
      description: 'Ask questions, get answers from peers & AI',
      icon: MessageCircle,
      color: 'from-green-500 to-green-600',
      path: '/peer/doubts',
      stats: stats?.doubts_resolved || 0,
      statsLabel: 'Doubts Resolved'
    },
    {
      title: 'Study Groups',
      description: 'Join focused prep rooms (max 6 members)',
      icon: UsersRound,
      color: 'from-purple-500 to-purple-600',
      path: '/peer/groups',
      stats: stats?.groups_joined || 0,
      statsLabel: 'Groups Joined'
    },
    {
      title: 'Practice Sessions',
      description: 'Solve DSA problems together in real-time',
      icon: Code,
      color: 'from-orange-500 to-orange-600',
      path: '/peer/sessions',
      stats: '4 upcoming',
      statsLabel: 'This Week'
    },
    {
      title: 'Revision Challenges',
      description: 'Compete in timed challenges & climb leaderboard',
      icon: Trophy,
      color: 'from-yellow-500 to-yellow-600',
      path: '/peer/challenges',
      stats: stats?.challenges_completed || 0,
      statsLabel: 'Completed'
    },
    {
      title: 'Group Weakness',
      description: 'Identify & improve weak topics together',
      icon: TrendingDown,
      color: 'from-red-500 to-red-600',
      path: '/peer/weakness',
      stats: '3 topics',
      statsLabel: 'Need Focus'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading peer learning...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-br from-indigo-500 to-purple-600 rounded-full mb-4">
            <Users className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Peer Learning Hub
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Learn together, grow together. Connect with peers, solve problems collaboratively, and stay motivated.
          </p>
          {error && (
            <p className="text-sm text-yellow-600 mt-2">
              ⚠️ Using demo mode - Backend connection needed for full features
            </p>
          )}
        </div>

        {/* Stats Bar */}
        {stats && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <Zap className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <p className="text-3xl font-bold text-gray-900">{stats.current_streak}</p>
                <p className="text-sm text-gray-600">Day Streak</p>
              </div>
              <div className="text-center">
                <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <p className="text-3xl font-bold text-gray-900">{stats.active_partners}</p>
                <p className="text-sm text-gray-600">Study Partners</p>
              </div>
              <div className="text-center">
                <UsersRound className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <p className="text-3xl font-bold text-gray-900">{stats.groups_joined}</p>
                <p className="text-sm text-gray-600">Groups</p>
              </div>
              <div className="text-center">
                <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <p className="text-3xl font-bold text-gray-900">{stats.challenges_completed}</p>
                <p className="text-sm text-gray-600">Challenges Won</p>
              </div>
            </div>
          </div>
        )}

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <button
              key={index}
              onClick={() => router.push(feature.path)}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2"
            >
              <div className={`h-2 bg-linear-to-r ${feature.color}`}></div>
              <div className="p-8">
                <div className={`w-16 h-16 bg-linear-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 mb-6 text-sm">
                  {feature.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{feature.stats}</p>
                    <p className="text-xs text-gray-500">{feature.statsLabel}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-12 bg-linear-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
          <h2 className="text-2xl font-bold mb-4">🚀 Quick Start Guide</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="flex items-center mb-2">
                <span className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3 font-bold">1</span>
                <span className="font-semibold">Find Partners</span>
              </div>
              <p className="text-indigo-100 text-sm ml-11">Match with 2-3 study buddies</p>
            </div>
            <div>
              <div className="flex items-center mb-2">
                <span className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3 font-bold">2</span>
                <span className="font-semibold">Join a Group</span>
              </div>
              <p className="text-indigo-100 text-sm ml-11">Pick a focused prep room</p>
            </div>
            <div>
              <div className="flex items-center mb-2">
                <span className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3 font-bold">3</span>
                <span className="font-semibold">Start Practicing</span>
              </div>
              <p className="text-indigo-100 text-sm ml-11">Solve problems together!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
