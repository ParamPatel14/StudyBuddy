'use client';

import { useState, useEffect } from 'react';
import { Code, Clock, Users, Play, Calendar, Trophy, Timer } from 'lucide-react';
import { API_URL } from '@/lib/config';

interface Session {
  id: number;
  type: string;
  problem: string;
  scheduled: string;
  participants: number;
  status: string;
}

export default function PracticeSessions() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSession, setActiveSession] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds

  useEffect(() => {
    loadSessions();
  }, []);

  useEffect(() => {
    if (activeSession && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [activeSession, timeLeft]);

  

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const joinSession = (sessionId: number) => {
    setActiveSession(sessionId);
    setTimeLeft(600);
  };
const [loading, setLoading] = useState(true);
const [error, setError] = useState(false);

const loadSessions = async () => {
  try {
    const response = await fetch(`${API_URL}/api/peer/sessions`);
    if (response.ok) {
      const data = await response.json();
      setSessions(data.sessions || []);
    } else {
      setError(true);
      setSessions(DEMO_SESSIONS); // Use hardcoded demo data
    }
  } catch (error) {
    console.error('Failed to load sessions:', error);
    setError(true);
    setSessions(DEMO_SESSIONS);
  } finally {
    setLoading(false);
  }
};

// Add demo data at top
const DEMO_SESSIONS = [
  {
    id: 1,
    type: "dsa_practice",
    problem: "Two Sum Problem",
    scheduled: "Today 6:00 PM",
    participants: 4,
    status: "upcoming"
  },
  {
    id: 2,
    type: "revision_challenge",
    problem: "5 Questions in 20 Minutes",
    scheduled: "Tomorrow 7:00 PM",
    participants: 5,
    status: "upcoming"
  }
];

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 to-red-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <Code className="w-16 h-16 text-orange-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Shared Practice Sessions</h1>
          <p className="text-gray-600">Solve DSA problems together in real-time</p>
        </div>

        {activeSession ? (
          /* Active Session View */
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Two Sum Problem</h2>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-orange-600">
                    <Timer className="w-5 h-5" />
                    <span className="text-2xl font-bold">{formatTime(timeLeft)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="w-5 h-5" />
                    <span className="font-semibold">4 solving</span>
                  </div>
                </div>
              </div>

              {/* Problem Statement */}
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="font-bold text-gray-900 mb-3">Problem Statement</h3>
                <p className="text-gray-700 mb-4">
                  Given an array of integers <code className="bg-gray-200 px-2 py-1 rounded">nums</code> and an integer <code className="bg-gray-200 px-2 py-1 rounded">target</code>, 
                  return indices of the two numbers such that they add up to target.
                </p>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    <strong>Example:</strong><br />
                    Input: nums = [2,7,11,15], target = 9<br />
                    Output: [0,1]<br />
                    Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
                  </p>
                </div>
              </div>

              {/* Code Editor Placeholder */}
              <div className="bg-gray-900 rounded-lg p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-400 text-sm">Python</span>
                  <button className="px-3 py-1 bg-green-600 text-white rounded text-sm font-semibold hover:bg-green-700">
                    Run Code
                  </button>
                </div>
                <textarea
                  className="w-full bg-transparent text-green-400 font-mono text-sm resize-none"
                  rows={15}
                  placeholder="def twoSum(nums, target):\n    # Your code here\n    pass"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <button className="flex-1 px-6 py-3 bg-linear-to-r from-orange-600 to-red-600 text-white rounded-lg font-semibold hover:from-orange-700 hover:to-red-700 transition">
                  Submit Solution
                </button>
                <button 
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
                  onClick={() => setActiveSession(null)}
                >
                  Leave Session
                </button>
              </div>
            </div>

            {/* Live Participants */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Live Participants (4)
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {['Rahul', 'Priya', 'Amit', 'You'].map((name, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-linear-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold">
                      {name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{name}</p>
                      <p className="text-xs text-gray-600">Solving...</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Sessions List */
          <div className="max-w-4xl mx-auto space-y-6">
            {sessions.map((session) => (
              <div key={session.id} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold">
                        {session.type === 'dsa_practice' ? '💻 DSA Practice' : '🏆 Challenge'}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        session.status === 'upcoming' 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {session.status}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{session.problem}</h3>
                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {session.scheduled}
                      </span>
                      <span className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {session.participants} joined
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        10 minutes
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => joinSession(session.id)}
                    className="px-6 py-3 bg-linear-to-r from-orange-600 to-red-600 text-white rounded-lg font-semibold hover:from-orange-700 hover:to-red-700 transition flex items-center"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Join Session
                  </button>
                </div>
              </div>
            ))}

            {/* Create Session */}
            <div className="bg-linear-to-r from-orange-600 to-red-600 rounded-xl p-8 text-white text-center">
              <h3 className="text-2xl font-bold mb-2">Start Your Own Session</h3>
              <p className="mb-6 text-orange-100">Invite your group to solve together</p>
              <button className="px-8 py-3 bg-white text-orange-600 rounded-lg font-bold hover:bg-gray-100 transition">
                Create Session
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


