'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { API_URL } from '@/lib/config';

export default function TestCompanyQuestions() {
  const [company, setCompany] = useState('Amazon');
  const [role, setRole] = useState('SDE');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/api/placement/company-questions/${company}?role=${role}`
      );
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Test Company Questions</h1>
        
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Company name"
              className="px-4 py-2 border border-gray-300 rounded-lg"
            />
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Role"
              className="px-4 py-2 border border-gray-300 rounded-lg"
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center"
            >
              <Search className="w-4 h-4 mr-2" />
              {loading ? 'Loading...' : 'Search'}
            </button>
          </div>
          
          <p className="text-sm text-gray-600">
            Try: Amazon, Google, Microsoft (curated) or any other company (AI-generated)
          </p>
        </div>

        {result && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                result.data_source === 'curated' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {result.data_source}
              </span>
            </div>
            <pre className="bg-gray-50 p-4 rounded-lg overflow-auto text-xs">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
