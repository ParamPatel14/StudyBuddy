export interface Topic {
  id?: number;
  name: string;
  weight: number;
  allocated_hours?: number;
  order_index?: number;
  mastery_level?: number;
}

export interface BasicInfo {
  subject: string;
  exam_type: string;
  exam_date: string;
  daily_hours: string;
  target_grade: string;
}

export interface ExtractedData {
  extractedText: string;
  topics: Topic[];
}

export interface DashboardData {
  exam_date: string;
  days_remaining: number;
  progress: number;
  total_sessions: number;
  completed_sessions: number;
  today_tasks: Array<{
    topic: string;
    duration: number;
    completed: boolean;
  }>;
}

// NEW: Practice Types
export interface MCQOption {
  label: string;
  text: string;
  is_correct?: boolean;
  explanation?: string;
}

export interface Question {
  id: number;
  type: 'mcq' | 'written';
  question_text: string;
  marks: number;
  time_limit: number;
  difficulty: string;
  options?: MCQOption[];
  expected_length?: string;
  topic_id?: number;
  topic_name?: string;
}

export interface QuestionAttempt {
  id?: number;
  question_id: number;
  student_answer: string;
  time_taken: number;
  confidence_level: number;
  is_correct?: boolean;
  score?: number;
}

export interface AnswerEvaluation {
  attempt_id: number;
  correct?: boolean;
  score: number;
  max_score: number;
  percentage?: number;
  correct_answer?: string;
  explanation?: string;
  feedback?: string;
  strengths?: string[];
  improvements?: string[];
  keyword_coverage?: number;
  keyword_total?: number;
  model_answer?: string;
  time_taken: number;
}

export interface TopicProgress {
  topic_id: number;
  topic_name: string;
  total_questions: number;
  attempted: number;
  completion_percentage: number;
  average_score: number;
  accuracy_rate: number;
  mastery_level: number;
  difficulty_breakdown: Array<{
    difficulty: string;
    attempted: number;
    average_score: number;
  }>;
}

export interface PracticeStats {
  period_days: number;
  total_attempts: number;
  average_score: number;
  total_time_minutes: number;
  daily_breakdown: Array<{
    date: string;
    attempts: number;
    average_score: number;
  }>;
}

export interface WeakTopic {
  topic_id: number;
  topic_name: string;
  mastery_level: number;
  accuracy_rate: number;
  attempted: number;
  needs_review: boolean;
}

export interface LessonContent {
  topic_name: string;
  content: {
    explanation: string;
    key_points: string[];
    example: string;
    common_mistakes: string[];
  };
}
