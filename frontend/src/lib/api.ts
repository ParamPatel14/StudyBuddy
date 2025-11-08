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

export const generateQuestions = async (topicId: number, difficulty: string, count: number = 10) => {
  const response = await api.post('/api/practice/generate-questions', {
    topic_id: topicId,
    difficulty,
    question_count: count
  });
  return response.data;
};

export const getQuestions = async (
  topicId: number, 
  difficulty: string = 'medium',
  questionType: string = 'mcq',
  limit: number = 10
) => {
  const response = await api.get('/api/practice/questions/' + topicId, {
    params: { difficulty, question_type: questionType, limit }
  });
  return response.data;
};

export const getQuestionDetails = async (questionId: number, includeAnswer: boolean = false) => {
  const response = await api.get(`/api/practice/question/${questionId}/details`, {
    params: { include_answer: includeAnswer }
  });
  return response.data;
};

export const submitAnswer = async (
  questionId: number,
  answer: string,
  timeTaken: number,
  confidence: number,
  userId: number = 1
) => {
  const response = await api.post('/api/practice/submit-answer', {
    question_id: questionId,
    student_answer: answer,
    time_taken: timeTaken,
    confidence_level: confidence
  }, {
    params: { user_id: userId }
  });
  return response.data;
};

export const getTopicProgress = async (topicId: number, userId: number = 1) => {
  const response = await api.get(`/api/practice/progress/${topicId}`, {
    params: { user_id: userId }
  });
  return response.data;
};

export const getOverallProgress = async (userId: number = 1, planId?: number) => {
  const response = await api.get(`/api/practice/overall-progress/${userId}`, {
    params: { plan_id: planId }
  });
  return response.data;
};

export const getWeakTopics = async (userId: number, planId: number, threshold: number = 60) => {
  const response = await api.get(`/api/practice/weak-topics/${userId}`, {
    params: { plan_id: planId, threshold }
  });
  return response.data;
};

export const getPracticeStats = async (userId: number = 1, days: number = 7) => {
  const response = await api.get(`/api/practice/stats/${userId}`, {
    params: { days }
  });
  return response.data;
};

export const getAttemptHistory = async (userId: number = 1, topicId?: number, limit: number = 20) => {
  const response = await api.get(`/api/practice/attempt-history/${userId}`, {
    params: { topic_id: topicId, limit }
  });
  return response.data;
};

export const markTopicForReview = async (topicId: number, userId: number = 1) => {
  const response = await api.post(`/api/practice/mark-for-review/${topicId}`, null, {
    params: { user_id: userId }
  });
  return response.data;
};



export default api;
