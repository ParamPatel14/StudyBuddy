'use client';

import { useRouter } from 'next/navigation';
import { BookOpen, Target, Calendar } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-600 to-indigo-700">
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center text-white mb-16">
          <h1 className="text-5xl font-bold mb-4">Smart Exam Prep</h1>
          <p className="text-xl opacity-90">Your AI-powered study companion</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-white">
            <BookOpen className="w-12 h-12 mb-4" />
            <h3 className="text-xl font-semibold mb-2">AI-Powered Learning</h3>
            <p className="opacity-90">Generate personalized lessons from your study materials</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-white">
            <Target className="w-12 h-12 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Smart Planning</h3>
            <p className="opacity-90">Optimized study schedules based on exam date and topics</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-white">
            <Calendar className="w-12 h-12 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
            <p className="opacity-90">Monitor your learning journey and stay on track</p>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={() => router.push('/onboarding')}
            className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}
