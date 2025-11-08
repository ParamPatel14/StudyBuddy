'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getLesson } from '@/lib/api';
import { LessonContent } from '@/lib/types';
import { BookOpen, Lightbulb, AlertTriangle } from 'lucide-react';

export default function LessonPage() {
  const params = useParams();
  const topicId = params.topicId as string;
  const [content, setContent] = useState<LessonContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLesson();
  }, [topicId]);

  const loadLesson = async () => {
    try {
      const result = await getLesson(parseInt(topicId));
      setContent(result);
    } catch (error) {
      console.error('Failed to load lesson:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading lesson...</div>;
  }

  if (!content) {
    return <div className="flex items-center justify-center min-h-screen">Lesson not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">{content.topic_name}</h1>

          {/* Explanation */}
          <div className="mb-8">
            <div className="flex items-center mb-3">
              <BookOpen className="w-6 h-6 text-blue-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-800">Concept Explanation</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">{content.content.explanation}</p>
          </div>

          {/* Key Points */}
          <div className="mb-8">
            <div className="flex items-center mb-3">
              <Lightbulb className="w-6 h-6 text-yellow-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-800">Key Points</h2>
            </div>
            <ul className="space-y-2">
              {content.content.key_points.map((point, index) => (
                <li key={index} className="flex items-start">
                  <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-3 mt-0.5 shrink-0">
                    {index + 1}
                  </span>
                  <span className="text-gray-700">{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Example */}
          <div className="mb-8 bg-blue-50 p-6 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2">Example:</h3>
            <p className="text-gray-700">{content.content.example}</p>
          </div>

          {/* Common Mistakes */}
          <div className="mb-8">
            <div className="flex items-center mb-3">
              <AlertTriangle className="w-6 h-6 text-red-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-800">Common Mistakes</h2>
            </div>
            <ul className="space-y-2">
              {content.content.common_mistakes.map((mistake, index) => (
                <li key={index} className="flex items-start text-red-700">
                  <span className="mr-2">⚠️</span>
                  <span>{mistake}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700">
              Mark as Complete
            </button>
            <button className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300">
              Next Topic
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
