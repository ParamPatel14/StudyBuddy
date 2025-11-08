'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Calendar, Target, ArrowRight, Plus } from 'lucide-react';

interface Profile {
  id: number;
  company_name: string;
  role: string;
  interview_date: string;
  days_remaining: number;
  status: string;
  total_rounds: number;
}

export default function PlacementProfiles() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/placement/profiles');
      const data = await response.json();
      setProfiles(data.profiles);
    } catch (error) {
      console.error('Failed to load profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profiles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 to-teal-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Placement Profiles</h1>
          <button
            onClick={() => router.push('/placement/create')}
            className="px-6 py-3 bg-linear-to-r from-green-600 to-teal-600 text-white rounded-lg font-bold hover:from-green-700 hover:to-teal-700 transition inline-flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Profile
          </button>
        </div>

        {profiles.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">No profiles yet</h2>
            <p className="text-gray-600 mb-6">Create your first placement preparation profile</p>
            <button
              onClick={() => router.push('/placement/create')}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Create Profile
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {profiles.map((profile) => (
              <button
                key={profile.id}
                onClick={() => router.push(`/placement/dashboard?profileId=${profile.id}`)}
                className="bg-white rounded-xl shadow-lg p-6 text-left hover:shadow-xl transition-all transform hover:scale-105"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{profile.company_name}</h3>
                    <p className="text-gray-600">{profile.role}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    profile.status === 'active' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {profile.status}
                  </span>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    {profile.days_remaining} days remaining
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Target className="w-4 h-4 mr-2" />
                    {profile.total_rounds} interview rounds
                  </div>
                </div>
                
                <div className="flex items-center text-green-600 font-semibold">
                  View Dashboard
                  <ArrowRight className="w-5 h-5 ml-2" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
