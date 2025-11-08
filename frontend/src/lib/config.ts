// API URL configuration
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

console.log('🔗 API URL:', API_URL);

// Helper function for API calls
export const fetchAPI = async (endpoint: string, options?: RequestInit) => {
  const url = `${API_URL}${endpoint}`;
  console.log('📡 Calling:', url);
  const response = await fetch(url, options);
  return response;
};
