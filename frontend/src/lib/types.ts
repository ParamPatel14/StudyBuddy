export interface Topic {
  id?: number;
  name: string;
  weight: number;
  allocated_hours?: number;
  order_index?: number;
}

export interface StudyPlanData {
  user_id: number;
  subject: string;
  exam_type: string;
  exam_date: string;
  daily_hours: number;
  target_grade: string;
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

export interface LessonContent {
  topic_name: string;
  content: {
    explanation: string;
    key_points: string[];
    example: string;
    common_mistakes: string[];
  };
}
