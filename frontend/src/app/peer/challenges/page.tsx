'use client';

import { useState, useEffect } from 'react';
import { Trophy, Clock, Users, Zap, Medal, Crown } from 'lucide-react';

interface Challenge {
  id: number;
  title: string;
  description: string;
  time_limit: number;
  participants: number;
  status: string;
}

interface LeaderboardEntry {
  rank: number;
  name: string;
  score: number;
  time: string;
}

export default function RevisionChallenges() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    loadChallenges();
    loadLeaderboard();
  }, []);

  const loadChallenges = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/peer/challenges');
      const data = await response.json();
      setChallenges(data.challenges);
    } catch (error) {
      console.error('Failed to load challenges:', error);
    }
  };

  const loadLeaderboard = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/peer/challenges/1/leaderboard');
      const data = await response.json();
      setLeaderboard(data.leaderboard);
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2: return <Medal className="w-6 h-6 text-gray-400" />;
      case 3: return <Medal className="w-6 h-6 text-orange-600" />;
      default: return <span className="w-6 h-6 flex items-center justify-center font-bold text-gray-600">{rank}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-yellow-50 to-orange-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <Trophy className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Revision Challenges</h1>
          <p className="text-gray-600">Compete, learn, and climb the leaderboard</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Challenges List */}
          <div className="lg:col-span-2 space-y-6">
            {challenges.map((challenge) => (
              <div key={challenge.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Zap className="w-5 h-5 text-yellow-600" />
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        challenge.status === 'active' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {challenge.status}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{challenge.title}</h3>
                    <p className="text-gray-600 mb-4">{challenge.description}</p>
                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {challenge.time_limit} minutes
                      </span>
                      <span className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {challenge.participants} participating
                      </span>
                    </div>
                  </div>
                  <button className="px-6 py-3 bg-linear-to-r from-yellow-500 to-orange-500 text-white rounded-lg font-semibold hover:from-yellow-600 hover:to-orange-600 transition whitespace-nowrap">
                    {challenge.status === 'active' ? 'Join Now' : 'Start Challenge'}
                  </button>
                </div>
              </div>
            ))}

            {/* Create Challenge */}
            <div className="bg-linear-to-r from-yellow-500 to-orange-500 rounded-xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-2">Create Custom Challenge</h3>
              <p className="mb-6 text-yellow-100">Set your own questions and time limit</p>
              <button className="px-8 py-3 bg-white text-orange-600 rounded-lg font-bold hover:bg-gray-100 transition">
                Create Challenge
              </button>
            </div>
          </div>

          {/* Leaderboard */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Trophy className="w-6 h-6 mr-2 text-yellow-600" />
                Leaderboard
              </h3>
              <div className="space-y-3">
                {leaderboard.map((entry) => (
                  <div
                    key={entry.rank}
                    className={`flex items-center gap-3 p-3 rounded-lg transition ${
                      entry.name === 'You' 
                        ? 'bg-linear-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300' 
                        : 'bg-gray-50'
                    }`}
                  >
                    <div className="shrink-0">
                      {getRankIcon(entry.rank)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 truncate">{entry.name}</p>
                      <p className="text-xs text-gray-600">{entry.time}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-gray-900">{entry.score}</p>
                      <p className="text-xs text-gray-500">points</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">12</p>
                    <p className="text-xs text-gray-600">Challenges Won</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">4th</p>
                    <p className="text-xs text-gray-600">Global Rank</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
