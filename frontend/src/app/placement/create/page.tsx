'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Briefcase, Calendar, Clock, Plus, Trash2, ArrowRight, Building2 } from 'lucide-react';

const ROUND_TYPES = [
  { value: 'aptitude', label: '📊 Aptitude Test', duration: 60 },
  { value: 'technical', label: '💻 Technical Round', duration: 60 },
  { value: 'dsa_coding', label: '🔢 DSA/Coding', duration: 90 },
  { value: 'system_design', label: '🏗️ System Design', duration: 60 },
  { value: 'hr', label: '👥 HR Round', duration: 30 },
];

const ROLES = [
  'Software Development Engineer (SDE)',
  'Data Analyst',
  'QA Engineer',
  'Data Engineer',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'DevOps Engineer',
];

interface Round {
  round_number: number;
  type: string;
  duration: number;
}

export default function CreatePlacementProfile() {
  const router = useRouter();
  
  const [companyName, setCompanyName] = useState('');
  const [role, setRole] = useState('');
  const [interviewDate, setInterviewDate] = useState('');
  const [hoursPerDay, setHoursPerDay] = useState(2);
  const [rounds, setRounds] = useState<Round[]>([
    { round_number: 1, type: 'aptitude', duration: 60 }
  ]);
  const [loading, setLoading] = useState(false);

  const addRound = () => {
    const newRound: Round = {
      round_number: rounds.length + 1,
      type: 'technical',
      duration: 60
    };
    setRounds([...rounds, newRound]);
  };

  const removeRound = (index: number) => {
    const newRounds = rounds.filter((_, i) => i !== index);
    // Renumber rounds
    const renumbered = newRounds.map((r, i) => ({ 
      ...r, 
      round_number: i + 1 
    }));
    setRounds(renumbered);
  };

  const updateRound = (index: number, field: keyof Round, value: any) => {
    const newRounds = [...rounds];
    newRounds[index] = { ...newRounds[index], [field]: value };
    setRounds(newRounds);
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!companyName || !role || !interviewDate || rounds.length === 0) {
    alert('Please fill all required fields');
    return;
  }

  setLoading(true);

  try {
    const response = await fetch('http://localhost:8000/api/placement/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        company_name: companyName,
        role: role,
        interview_date: interviewDate,
        hours_per_day: hoursPerDay,
        round_structure: rounds
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to create profile');
    }

    const data = await response.json();
    console.log('✅ Profile created:', data);

    // SUCCESS - REDIRECT TO DASHBOARD
    router.push(`/placement/dashboard?profileId=${data.id}`);
    
  } catch (error: any) {
    console.error('❌ Error:', error);
    alert(error.message || 'Failed to create placement profile');
  } finally {
    setLoading(false);
  }
};

  const calculateDaysRemaining = () => {
    if (!interviewDate) return 0;
    const today = new Date();
    const interview = new Date(interviewDate);
    const diff = interview.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 to-teal-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-linear-to-r from-green-600 to-teal-600 rounded-2xl p-8 text-white mb-8 shadow-xl">
          <div className="flex items-center mb-4">
            <Briefcase className="w-12 h-12 mr-4" />
            <div>
              <h1 className="text-3xl font-bold">Create Placement Profile</h1>
              <p className="text-green-100">Set up your interview preparation plan</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 space-y-6">
          {/* Company Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Building2 className="w-4 h-4 inline mr-2" />
              Company Name *
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g., Amazon, Google, Microsoft"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Role / Position *
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            >
              <option value="">Select role</option>
              {ROLES.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* Interview Date & Hours */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Interview Date *
              </label>
              <input
                type="date"
                value={interviewDate}
                onChange={(e) => setInterviewDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
              {interviewDate && (
                <p className="text-sm text-gray-600 mt-2">
                  📅 {calculateDaysRemaining()} days remaining
                </p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Clock className="w-4 h-4 inline mr-2" />
                Hours Available per Day *
              </label>
              <input
                type="number"
                value={hoursPerDay}
                onChange={(e) => setHoursPerDay(parseFloat(e.target.value))}
                min="0.5"
                max="24"
                step="0.5"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
              <p className="text-sm text-gray-600 mt-2">
                ⏱️ Total: {(hoursPerDay * calculateDaysRemaining()).toFixed(1)} hours
              </p>
            </div>
          </div>

          {/* Interview Rounds */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-semibold text-gray-700">
                Interview Rounds ({rounds.length})
              </label>
              <button
                type="button"
                onClick={addRound}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center text-sm font-semibold"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Round
              </button>
            </div>

            <div className="space-y-4">
              {rounds.map((round, index) => (
                <div 
                  key={index} 
                  className="border-2 border-gray-200 rounded-lg p-4 hover:border-green-300 transition"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900 flex items-center">
                      <span className="w-8 h-8 bg-green-100 text-green-700 rounded-full flex items-center justify-center mr-2 font-bold text-sm">
                        {round.round_number}
                      </span>
                      Round {round.round_number}
                    </h4>
                    {rounds.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRound(index)}
                        className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Round Type</label>
                      <select
                        value={round.type}
                        onChange={(e) => updateRound(index, 'type', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500"
                      >
                        {ROUND_TYPES.map(rt => (
                          <option key={rt.value} value={rt.value}>{rt.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Duration (minutes)</label>
                      <input
                        type="number"
                        value={round.duration}
                        onChange={(e) => updateRound(index, 'duration', parseInt(e.target.value))}
                        min="15"
                        max="180"
                        step="15"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-linear-to-r from-green-50 to-teal-50 rounded-lg p-6 border border-green-200">
            <h3 className="font-semibold text-gray-900 mb-3">📋 Preparation Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Company</p>
                <p className="font-semibold text-gray-900">{companyName || '-'}</p>
              </div>
              <div>
                <p className="text-gray-600">Days Left</p>
                <p className="font-semibold text-gray-900">{calculateDaysRemaining() || '-'}</p>
              </div>
              <div>
                <p className="text-gray-600">Total Hours</p>
                <p className="font-semibold text-gray-900">
                  {(hoursPerDay * calculateDaysRemaining()).toFixed(1)}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Rounds</p>
                <p className="font-semibold text-gray-900">{rounds.length}</p>
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-linear-to-r from-green-600 to-teal-600 text-white py-4 rounded-lg font-bold text-lg hover:from-green-700 hover:to-teal-700 transition disabled:opacity-50 flex items-center justify-center shadow-lg"
          >
            {loading ? (
              'Creating Profile...'
            ) : (
              <>
                Create Placement Profile
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
