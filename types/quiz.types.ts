import { Category } from "./category.types";

export type QuestionType = "MULTIPLE" | "SHORTS";

export interface QuizSet {
  id: string;
  author: Author;
  title: string;
  description: string;
  useSubject: boolean;
  mediaKey: string;
  category: Category;
  rating: number;
  ratingCount: number;
  userRating: number;
  questions: QuestionData[];
}

export interface Author {
  id: string;
  nickName: string;
  avatar: string;
}

export interface QuestionData {
  id: string;
  no: number;
  type: QuestionType;
  subject?: string;
  question: string;
  options: string[];
  correctAnswer?: number[];
  correctAnswerText?: string;
  explanation?: string;
  isPreview?: boolean;
}
export interface ParsedQuestion {
  type?: QuestionType;
  subject?: string;
  question: string;
  options: string[];
  correctAnswer?: number[];
  correctAnswerText?: string;
  explanation?: string;
}
export interface QuizSummary {
  id: string;
  title: string;
  authorName: string;
  category: string;
  categoryId: string;
  categoryIcon: string;
  questionCount: number;
  rating: number;
  ratingCount: number;
  viewCount: number;
  solveCount: number;
  averageScore: number;
}

export interface QuizSummaryList {
  quizzes: QuizSummary[];
  totalPages: number;
  totalElements: number;
  currentPage: number;
}
