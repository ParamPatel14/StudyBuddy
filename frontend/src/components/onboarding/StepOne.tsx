'use client';

import { useForm } from 'react-hook-form';
import { Calendar } from 'lucide-react';

interface StepOneProps {
  onNext: (data: any) => void;
}

export default function StepOne({ onNext }: StepOneProps) {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data: any) => {
    onNext(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Basic Information</h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Subject
        </label>
        <input
          {...register('subject', { required: 'Subject is required' })}
          type="text"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="e.g., Mathematics, Physics"
        />
        {errors.subject && (
          <p className="mt-1 text-sm text-red-600">{errors.subject.message as string}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Exam Type
        </label>
        <select
          {...register('exam_type', { required: 'Exam type is required' })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select exam type</option>
          <option value="midterm">Midterm</option>
          <option value="final">Final Exam</option>
          <option value="placement">Placement Test</option>
          <option value="competitive">Competitive Exam</option>
        </select>
        {errors.exam_type && (
          <p className="mt-1 text-sm text-red-600">{errors.exam_type.message as string}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Exam Date
        </label>
        <input
          {...register('exam_date', { required: 'Exam date is required' })}
          type="date"
          min={new Date().toISOString().split('T')[0]}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {errors.exam_date && (
          <p className="mt-1 text-sm text-red-600">{errors.exam_date.message as string}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Daily Study Hours
        </label>
        <input
          {...register('daily_hours', { 
            required: 'Daily hours is required',
            min: { value: 1, message: 'Minimum 1 hour' },
            max: { value: 12, message: 'Maximum 12 hours' }
          })}
          type="number"
          step="0.5"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="e.g., 3"
        />
        {errors.daily_hours && (
          <p className="mt-1 text-sm text-red-600">{errors.daily_hours.message as string}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Target Grade
        </label>
        <select
          {...register('target_grade', { required: 'Target grade is required' })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select target grade</option>
          <option value="A+">A+ (90-100%)</option>
          <option value="A">A (80-89%)</option>
          <option value="B">B (70-79%)</option>
          <option value="C">C (60-69%)</option>
        </select>
        {errors.target_grade && (
          <p className="mt-1 text-sm text-red-600">{errors.target_grade.message as string}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
      >
        Next Step
      </button>
    </form>
  );
}
