'use client';

import { useState } from 'react';
import { Topic } from '@/lib/types';
import { createStudyPlan, generatePlan } from '@/lib/api';
import { useRouter } from 'next/navigation';

interface StepThreeProps {
  basicInfo: any;
  topics: Topic[];
  onBack: () => void;
}

export default function StepThree({ basicInfo, topics: initialTopics, onBack }: StepThreeProps) {
  const [topics, setTopics] = useState<Topic[]>(initialTopics);
  const [generating, setGenerating] = useState(false);
  const router = useRouter();

  const handleWeightChange = (index: number, newWeight: number) => {
    const updated = [...topics];
    updated[index].weight = newWeight;
    setTopics(updated);
  };

  const handleRemoveTopic = (index: number) => {
    setTopics(topics.filter((_, i) => i !== index));
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      // Create study plan
      const planData = {
        user_id: 1, // Hardcoded for now, implement auth later
        ...basicInfo,
        daily_hours: parseFloat(basicInfo.daily_hours),
      };
      
      const plan = await createStudyPlan(planData);
      
      // Generate plan with topics
      await generatePlan(plan.id, topics);
      
      // Redirect to dashboard
      router.push(`/dashboard?planId=${plan.id}`);
    } catch (error) {
      console.error('Failed to generate plan:', error);
      alert('Failed to generate study plan. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <button
          onClick={onBack}
          className="text-blue-600 hover:text-blue-700 mb-4"
        >
          ← Back
        </button>
        <h2 className="text-2xl font-bold text-gray-800">Review & Adjust Topics</h2>
        <p className="text-gray-600 mt-2">Adjust topic priorities before generating your study plan</p>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Topic
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Priority (1-10)
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {topics.map((topic, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {topic.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={topic.weight}
                    onChange={(e) => handleWeightChange(index, parseFloat(e.target.value))}
                    className="w-20 px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                  <button
                    onClick={() => handleRemoveTopic(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={handleGenerate}
        disabled={topics.length === 0 || generating}
        className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {generating ? 'Generating Plan...' : 'Generate My Study Plan'}
      </button>
    </div>
  );
}
