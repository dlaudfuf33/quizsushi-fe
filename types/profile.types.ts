export interface UserData {
  nickname: string;
  email: string;
  birthDate: string;
  gender: string;
  avatar: string;
  createAt: string;
  stats: {
    totalQuizzesSolved: number;
    totalQuizzesCreated: number;
    averageScore: number;
  };
}

export interface CreatedQuiz {
  id: number;
  title: string;
  category: string;
  questions: number;
  solvedCount: number;
  rating: number;
  createdAt: string;
}

export interface SolvedQuiz {
  id: number;
  type: "solved";
  title: string;
  score: number;
  date: string;
  category: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

// 사용자 설정 타입 추가
export interface UserSettings {
  notifications: boolean;
}

// 프로필 업데이트 타입 추가
export interface ProfileUpdateData {
  nickname?: string;
  birth?: string;
  gender?: string;
}

// API 응답 타입들
export interface CreatedQuizzesResponse {
  quizzes: CreatedQuiz[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
}

export interface SolvedQuizzesResponse {
  quizzes: SolvedQuiz[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
}

export interface AchievementsResponse {
  achievements: Achievement[];
}
