'use client';

import { useRouter } from 'next/navigation';
import { Briefcase, Building2, Calendar, Clock, Target, ArrowRight } from 'lucide-react';

export default function PlacementWelcome() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 to-teal-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center mb-6">
            <div className="w-16 h-16 bg-linear-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center mr-4">
              <Briefcase className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Placement Preparation</h1>
              <p className="text-gray-600">Get ready for your dream job interview</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start">
              <Building2 className="w-6 h-6 text-green-600 mr-3 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900">Company-Specific</h3>
                <p className="text-sm text-gray-600">Tailored prep for your target company</p>
              </div>
            </div>
            <div className="flex items-start">
              <Target className="w-6 h-6 text-green-600 mr-3 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900">Round-wise Planning</h3>
                <p className="text-sm text-gray-600">Prepare for each interview round</p>
              </div>
            </div>
            <div className="flex items-start">
              <Calendar className="w-6 h-6 text-green-600 mr-3 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900">Timeline Based</h3>
                <p className="text-sm text-gray-600">Study plan based on interview date</p>
              </div>
            </div>
            <div className="flex items-start">
              <Clock className="w-6 h-6 text-green-600 mr-3 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900">Flexible Schedule</h3>
                <p className="text-sm text-gray-600">Set your daily study hours</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <button
            onClick={() => router.push('/placement/create')}
            className="px-8 py-4 bg-linear-to-r from-green-600 to-teal-600 text-white rounded-xl font-bold text-lg hover:from-green-700 hover:to-teal-700 transition shadow-lg inline-flex items-center"
          >
            Create Your Preparation Plan
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
          
          <p className="text-sm text-gray-600 mt-4">
            Takes only 2 minutes to set up
          </p>
        </div>
      </div>

        <div className="text-center">
        <button
            onClick={() => router.push('/placement/create')}
            className="px-8 py-4 bg-linear-to-r from-green-600 to-teal-600 text-white rounded-xl font-bold text-lg hover:from-green-700 hover:to-teal-700 transition shadow-lg inline-flex items-center"
        >
            Create Your Preparation Plan
            <ArrowRight className="w-5 h-5 ml-2" />
        </button>
        
        <p className="text-sm text-gray-600 mt-4">
            Takes only 2 minutes to set up
        </p>
        
        {/* ADD THIS */}
        <div className="mt-6">
            <button
            onClick={() => router.push('/placement/profiles')}
            className="text-green-600 hover:text-green-700 font-semibold"
            >
            View Existing Profiles →
            </button>
        </div>
        </div>

    </div>
    
  );
}
