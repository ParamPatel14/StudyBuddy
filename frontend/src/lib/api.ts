import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const uploadPDF = async (file: File, fileType: string) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('file_type', fileType);
  
  const response = await api.post('/api/upload/pdf', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const extractTopics = async (text: string, subject: string) => {
  const response = await api.post('/api/upload/extract-topics', { text, subject });
  return response.data;
};

export const createStudyPlan = async (data: any) => {
  const response = await api.post('/api/study-plan/create', data);
  return response.data;
};

export const generatePlan = async (planId: number, topics: any[]) => {
  const response = await api.post(`/api/study-plan/${planId}/generate-plan`, { topics });
  return response.data;
};

export const getDashboard = async (planId: number) => {
  const response = await api.get(`/api/study-plan/${planId}/dashboard`);
  return response.data;
};

export const getLesson = async (topicId: number) => {
  const response = await api.get(`/api/lessons/${topicId}`);
  return response.data;
};

export const markSessionComplete = async (sessionId: number) => {
  const response = await api.post(`/api/lessons/${sessionId}/complete`);
  return response.data;
};

export default api;
