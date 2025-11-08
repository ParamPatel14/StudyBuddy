'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Building2,
  Calendar,
  Clock,
  Target,
  TrendingUp,
  BookOpen,
  Code,
  Layers,
  Users,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Map,
} from 'lucide-react';

interface CompanyQuestions {
  company: string;
  data_source: string;
  total_questions?: number;
  difficulty_distribution?: any;
  topics: {
    [key: string]: {
      questions: string[];
      frequency: string;
      recommended_hours: number;
      question_count: number;
    };
  };
  system_design: string[];
  behavioral_focus: string[];
  role_specific_notes: string;
}

interface PlacementProfile {
  id: number;
  company_name: string;
  role: string;
  interview_date: string;
  days_remaining: number;
  hours_per_day: number;
  round_structure: any[];
  status: string;
}

export default function PlacementDashboard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const profileId = searchParams.get('profileId');

  const [profile, setProfile] = useState<PlacementProfile | null>(null);
  const [questions, setQuestions] = useState<CompanyQuestions | null>(null);
  const [hasRoadmap, setHasRoadmap] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profileId) {
      loadDashboardData();
      checkRoadmap();
    }
  }, [profileId]);

  const checkRoadmap = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/placement/roadmap/${profileId}`
      );
      setHasRoadmap(response.ok);
    } catch (error) {
      setHasRoadmap(false);
    }
  };

  const loadDashboardData = async () => {
    try {
      // Load profile
      const profileRes = await fetch(
        `http://localhost:8000/api/placement/profile/${profileId}`
      );
      const profileData = await profileRes.json();
      setProfile(profileData);

      // Load company questions
      const questionsRes = await fetch(
        `http://localhost:8000/api/placement/company-questions/${profileData.company_name}?role=${profileData.role}`
      );
      const questionsData = await questionsRes.json();
      setQuestions(questionsData);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateRoadmap = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/placement/generate-roadmap/${profileId}`,
        { method: 'POST' }
      );

      if (response.ok) {
        setHasRoadmap(true);
        router.push(`/placement/roadmap?profileId=${profileId}`);
      } else {
        console.error('Failed to generate roadmap');
      }
    } catch (error) {
      console.error('Error generating roadmap:', error);
    }
  };

  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case 'very_high':
        return 'text-red-600 bg-red-100';
      case 'high':
        return 'text-orange-600 bg-orange-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your preparation plan...</p>
        </div>
      </div>
    );
  }

  // Error / Missing Profile
  if (!profile || !questions) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Profile Not Found
          </h2>
          <button
            onClick={() => router.push('/placement/create')}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Create New Profile
          </button>
        </div>
      </div>
    );
  }

  // Main Dashboard
  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 to-teal-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-linear-to-r from-green-600 to-teal-600 rounded-2xl p-8 text-white mb-8 shadow-xl">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center mb-2">
                <Building2 className="w-8 h-8 mr-3" />
                <h1 className="text-3xl font-bold">
                  {profile.company_name}
                </h1>
              </div>
              <p className="text-green-100 text-lg mb-4">{profile.role}</p>
              <div className="flex items-center gap-6">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  <span>{profile.days_remaining} days left</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  <span>{profile.hours_per_day}h per day</span>
                </div>
                <div className="flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  <span>{profile.round_structure.length} rounds</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleGenerateRoadmap}
              className="flex items-center px-6 py-3 bg-white text-green-600 rounded-xl font-bold hover:bg-green-50 transition shadow-lg"
            >
              <Map className="w-5 h-5 mr-2" />
              {hasRoadmap ? 'View Roadmap' : 'Generate Roadmap'}
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>

        {/* Roadmap Banner */}
        {!hasRoadmap && (
          <div className="bg-linear-to-r from-blue-500 to-purple-500 rounded-xl p-6 text-white mb-8 shadow-lg">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2 flex items-center">
                  <Map className="w-6 h-6 mr-2" />
                  Ready to start preparing?
                </h3>
                <p className="text-blue-100 mb-4">
                  Generate your personalized day-by-day roadmap based on{' '}
                  {profile.company_name}'s interview patterns
                </p>
                <button
                  onClick={handleGenerateRoadmap}
                  className="px-6 py-3 bg-white text-purple-600 rounded-lg font-bold hover:bg-gray-100 transition inline-flex items-center"
                >
                  Generate My Roadmap
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Data Source Tags */}
        {questions.data_source === 'curated' && (
          <span className="px-4 py-2 bg-white/20 rounded-full text-sm font-semibold">
            ✓ Curated Data
          </span>
        )}
        {questions.data_source === 'ai_generated' && (
          <span className="px-4 py-2 bg-white/20 rounded-full text-sm font-semibold">
            🤖 AI Generated
          </span>
        )}

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 mt-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <Code className="w-8 h-8 text-blue-600" />
              <span className="text-3xl font-bold text-gray-900">
                {Object.keys(questions.topics).length}
              </span>
            </div>
            <p className="text-sm text-gray-600">DSA Topics</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <BookOpen className="w-8 h-8 text-green-600" />
              <span className="text-3xl font-bold text-gray-900">
                {Object.values(questions.topics).reduce(
                  (sum, t) => sum + t.question_count,
                  0
                )}
              </span>
            </div>
            <p className="text-sm text-gray-600">Total Questions</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <Layers className="w-8 h-8 text-purple-600" />
              <span className="text-3xl font-bold text-gray-900">
                {questions.system_design.length}
              </span>
            </div>
            <p className="text-sm text-gray-600">System Design</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 text-orange-600" />
              <span className="text-3xl font-bold text-gray-900">
                {questions.behavioral_focus.length}
              </span>
            </div>
            <p className="text-sm text-gray-600">Behavioral Areas</p>
          </div>
        </div>

        {/* Role-Specific Notes */}
        {questions.role_specific_notes && (
          <div className="bg-blue-50 border-l-4 border-blue-600 rounded-lg p-6 mb-8">
            <h3 className="font-bold text-blue-900 mb-2 flex items-center">
              <Target className="w-5 h-5 mr-2" />
              Role-Specific Strategy
            </h3>
            <p className="text-blue-800">{questions.role_specific_notes}</p>
          </div>
        )}

        {/* DSA Topics */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Code className="w-6 h-6 mr-2 text-green-600" />
            DSA Topics & Questions
          </h2>

          <div className="space-y-6">
            {Object.entries(questions.topics).map(([topic, data]) => (
              <div
                key={topic}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {topic}
                    </h3>
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getFrequencyColor(
                          data.frequency
                        )}`}
                      >
                        {data.frequency.replace('_', ' ').toUpperCase()}
                      </span>
                      <span className="text-sm text-gray-600">
                        <Clock className="w-4 h-4 inline mr-1" />
                        {data.recommended_hours}h recommended
                      </span>
                      <span className="text-sm text-gray-600">
                        {data.question_count} questions
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {data.questions.map((question, idx) => (
                    <div
                      key={idx}
                      className="flex items-start bg-gray-50 rounded-lg p-3"
                    >
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 shrink-0" />
                      <span className="text-sm text-gray-700">{question}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Design + Behavioral Focus */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Layers className="w-6 h-6 mr-2 text-purple-600" />
              System Design Questions
            </h2>
            <div className="space-y-3">
              {questions.system_design.map((question, idx) => (
                <div
                  key={idx}
                  className="flex items-start bg-purple-50 rounded-lg p-3"
                >
                  <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center mr-3 text-xs font-bold shrink-0">
                    {idx + 1}
                  </span>
                  <span className="text-sm text-gray-700">{question}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Users className="w-6 h-6 mr-2 text-orange-600" />
              Behavioral Focus Areas
            </h2>
            <div className="space-y-3">
              {questions.behavioral_focus.map((area, idx) => (
                <div
                  key={idx}
                  className="flex items-start bg-orange-50 rounded-lg p-3"
                >
                  <TrendingUp className="w-5 h-5 text-orange-600 mr-3 shrink-0" />
                  <span className="text-sm text-gray-700">{area}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Interview Rounds */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Interview Rounds
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {profile.round_structure.map((round, idx) => (
              <div
                key={idx}
                className="border-2 border-gray-200 rounded-lg p-4 hover:border-green-500 transition"
              >
                <div className="flex items-center mb-2">
                  <span className="w-8 h-8 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-bold mr-2">
                    {round.round_number}
                  </span>
                  <span className="font-semibold text-gray-900">
                    Round {round.round_number}
                  </span>
                </div>
                <p className="text-sm text-gray-600 capitalize">
                  {round.type.replace('_', ' ')}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {round.duration} minutes
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
