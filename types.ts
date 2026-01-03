
export enum DrillLevel {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  ADVANCED = 'Advanced'
}

export interface Drill {
  id: string;
  title: string;
  level: DrillLevel;
  type: 'Warm-up' | 'Essay' | 'Journalism';
  originalText: string;
  wordCount: number;
  description: string;
}

export interface FeedbackMetric {
  name: string;
  score: number; // 0-100
  feedback: string;
}

export interface EditorialAnnotation {
  originalFragment: string;
  editedFragment: string;
  comment: string;
  category: 'Clarity' | 'Grammar' | 'Style' | 'Structure' | 'Ethics';
}

export interface DrillResult {
  drillId: string;
  userText: string;
  metrics: FeedbackMetric[];
  overallEvaluation: string;
  annotations: EditorialAnnotation[];
  expertVersion: string;
  timestamp: number;
}
