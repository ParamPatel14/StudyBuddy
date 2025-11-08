'use client';

import { useState } from 'react';
import { uploadPDF, extractTopics } from '@/lib/api';
import { Upload, FileText, Loader2 } from 'lucide-react';

interface StepTwoProps {
  basicInfo: any;
  onNext: (data: any) => void;
  onBack: () => void;
}

export default function StepTwo({ basicInfo, onNext, onBack }: StepTwoProps) {
  const [files, setFiles] = useState<{ [key: string]: File | null }>({
    pyq: null,
    syllabus: null,
    notes: null,
  });
  const [uploading, setUploading] = useState(false);
  const [extractedText, setExtractedText] = useState('');

  const handleFileChange = (type: string, file: File | null) => {
    setFiles(prev => ({ ...prev, [type]: file }));
  };

  const handleUpload = async () => {
    setUploading(true);
    try {
      let allText = '';
      
      for (const [type, file] of Object.entries(files)) {
        if (file) {
          const result = await uploadPDF(file, type);
          allText += result.text + '\n\n';
        }
      }
      
      setExtractedText(allText);
      
      // Extract topics
      const topicsResult = await extractTopics(allText, basicInfo.subject);
      onNext({ extractedText: allText, topics: topicsResult.topics });
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload files. Please try again.');
    } finally {
      setUploading(false);
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
        <h2 className="text-2xl font-bold text-gray-800">Upload Study Materials</h2>
        <p className="text-gray-600 mt-2">Upload PDFs to extract topics and create your study plan</p>
      </div>

      {['pyq', 'syllabus', 'notes'].map((type) => (
        <div key={type} className="border-2 border-dashed border-gray-300 rounded-lg p-6">
          <label className="flex flex-col items-center cursor-pointer">
            <Upload className="w-12 h-12 text-gray-400 mb-2" />
            <span className="text-sm font-medium text-gray-700 capitalize">
              {type === 'pyq' ? 'Previous Year Questions' : type}
            </span>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => handleFileChange(type, e.target.files?.[0] || null)}
              className="hidden"
            />
            {files[type] && (
              <div className="mt-2 flex items-center text-sm text-green-600">
                <FileText className="w-4 h-4 mr-1" />
                {files[type]?.name}
              </div>
            )}
          </label>
        </div>
      ))}

      <button
        onClick={handleUpload}
        disabled={!Object.values(files).some(f => f) || uploading}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {uploading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          'Extract Topics & Continue'
        )}
      </button>
    </div>
  );
}
