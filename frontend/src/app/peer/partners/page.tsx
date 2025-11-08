'use client';

import { useState, useEffect } from 'react';
import { Users, Clock, Target, Star, Check, X } from 'lucide-react';
import { API_URL } from '@/lib/config';

interface Partner {
  id: number;
  name: string;
  goal_type: string;
  company?: string;
  subject?: string;
  hours_per_day: number;
  skill_level: string;
  confidence_rating: number;
  match_score: number;
}

export default function StudyPartners() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPartners();
  }, []);

  const loadPartners = async () => {
    try {
      const response = await fetch(`${API_URL}/api/peer/find-partners`);
      const data = await response.json();
      setPartners(data.matches);
    } catch (error) {
      console.error('Failed to load partners:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (partnerId: number) => {
    try {
      const response = await fetch(`${API_URL}/api/peer/partner/connect/${partnerId}`, {
        method: 'POST'
      });
      const data = await response.json();
      alert(data.message);
    } catch (error) {
      console.error('Failed to connect:', error);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <Users className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Find Study Partners</h1>
          <p className="text-gray-600">
            Smart matching based on goals, schedule, and skill level
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {partners.map((partner) => (
              <div key={partner.id} className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-6 flex-1">
                    {/* Avatar */}
                    <div className="w-20 h-20 bg-linear-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      {partner.name.charAt(0)}
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-bold text-gray-900">{partner.name}</h3>
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                          {partner.match_score}% Match
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Goal</p>
                          <p className="font-semibold text-gray-900">
                            {partner.company || partner.subject}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Daily Hours</p>
                          <p className="font-semibold text-gray-900 flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {partner.hours_per_day}h
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Skill Level</p>
                          <p className="font-semibold text-gray-900 capitalize">
                            {partner.skill_level}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Confidence</p>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < partner.confidence_rating
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleConnect(partner.id)}
                      className="px-6 py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition flex items-center"
                    >
                      <Check className="w-5 h-5 mr-2" />
                      Connect
                    </button>
                    <button className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
