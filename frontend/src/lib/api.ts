import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error
      console.error('API Error Response:', {
        status: error.response.status,
        data: error.response.data,
        url: error.config?.url
      });
    } else if (error.request) {
      // Request made but no response
      console.error('API No Response:', error.request);
    } else {
      // Error setting up request
      console.error('API Request Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export const createStudyPlan = async (data: any) => {
  try {
    console.log('📤 Creating study plan:', data);
    const response = await api.post('/api/study-plan/create', data);
    console.log('✓ Study plan created:', response.data);
    return response.data;
  } catch (error: any) {
    const errorDetail = error.response?.data?.detail || error.message || 'Unknown error';
    console.error('❌ Create study plan error:', errorDetail);
    throw new Error(errorDetail);
  }
};

export const uploadPDF = async (file: File, fileType: string) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('file_type', fileType);
  
  try {
    console.log(`📤 Uploading ${fileType}: ${file.name}`);
    const response = await api.post('/api/upload/pdf', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log(`✓ Upload successful:`, response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ Upload error:', error.response?.data || error.message);
    throw error;
  }
};

export const extractTopicsFromJSON = async (jsonPaths: string[]) => {
  try {
    console.log(`🤖 Extracting topics from ${jsonPaths.length} JSON files`);
    const response = await api.post('/api/upload/extract-topics-from-json', jsonPaths);
    console.log(`✓ Topics extracted:`, response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ Topic extraction error:', error.response?.data || error.message);
    throw error;
  }
};

export const extractTopics = async (text: string, subject: string) => {
  try {
    const response = await api.post('/api/upload/extract-topics', { text, subject });
    return response.data;
  } catch (error: any) {
    console.error('Extract topics error:', error.response?.data || error.message);
    throw error;
  }
};

export const listExtractedFiles = async () => {
  try {
    const response = await api.get('/api/upload/list-extracted-files');
    return response.data;
  } catch (error: any) {
    console.error('List files error:', error.response?.data || error.message);
    throw error;
  }
};
export const generatePlan = async (planId: number, topics: any[]) => {
  try {
    const response = await api.post(`/api/study-plan/${planId}/generate-plan`, { topics });
    return response.data;
  } catch (error: any) {
    console.error('Generate plan error:', error.response?.data || error.message);
    throw error;
  }
};

export const getDashboard = async (planId: number) => {
  try {
    const response = await api.get(`/api/study-plan/${planId}/dashboard`);
    return response.data;
  } catch (error: any) {
    console.error('Get dashboard error:', error.response?.data || error.message);
    throw error;
  }
};

export const getLesson = async (topicId: number) => {
  try {
    const response = await api.get(`/api/lessons/${topicId}`);
    return response.data;
  } catch (error: any) {
    console.error('Get lesson error:', error.response?.data || error.message);
    throw error;
  }
};

export const markSessionComplete = async (sessionId: number) => {
  try {
    const response = await api.post(`/api/lessons/${sessionId}/complete`);
    return response.data;
  } catch (error: any) {
    console.error('Mark session complete error:', error.response?.data || error.message);
    throw error;
  }
};

export default api;
