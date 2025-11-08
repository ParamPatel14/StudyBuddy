'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, ThumbsUp, CheckCircle, Plus, Search } from 'lucide-react';

interface Doubt {
  id: number;
  topic: string;
  title: string;
  question: string;
  user: string;
  upvotes: number;
  responses: number;
  is_resolved: boolean;
}

export default function DoubtThreads() {
  const [doubts, setDoubts] = useState<Doubt[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedDoubt, setSelectedDoubt] = useState<number | null>(null);

  useEffect(() => {
    loadDoubts();
  }, []);

  const loadDoubts = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/peer/doubts');
      const data = await response.json();
      setDoubts(data.doubts);
    } catch (error) {
      console.error('Failed to load doubts:', error);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 to-teal-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Doubt Threads</h1>
            <p className="text-gray-600">Ask questions, get answers from peers & AI</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-linear-to-r from-green-600 to-teal-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-teal-700 transition flex items-center shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Ask Doubt
          </button>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search doubts by topic or keyword..."
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Doubts List */}
        <div className="space-y-4">
          {doubts.map((doubt) => (
            <div
              key={doubt.id}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition cursor-pointer"
              onClick={() => setSelectedDoubt(doubt.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                      {doubt.topic}
                    </span>
                    {doubt.is_resolved && (
                      <span className="flex items-center text-green-600 text-sm font-semibold">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Resolved
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{doubt.title}</h3>
                  <p className="text-gray-600 line-clamp-2">{doubt.question}</p>
                </div>
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-600">
                <span className="flex items-center">
                  <ThumbsUp className="w-4 h-4 mr-1" />
                  {doubt.upvotes} upvotes
                </span>
                <span className="flex items-center">
                  <MessageCircle className="w-4 h-4 mr-1" />
                  {doubt.responses} responses
                </span>
                <span className="text-gray-500">by {doubt.user}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
