import { apiClient } from "./axios";
import type { QuestionData, QuizSummaryList } from "@/types/quiz.types";

export const QuizAPI = {
  async getQuizList(params?: {
    categoryId?: number | undefined;
    searchType?: "title" | "author";
    searchQuery?: string;
    sort?: "rating" | "newest" | "views" | "solved" | "average";
    page?: number;
    size?: number;
  }): Promise<QuizSummaryList> {
    const res = await apiClient.get("/quizzes", { params });
    console.log(res);
    return res.data.data;
  },

  async getQuizById(id: string, cookie?: string) {
    const res = await apiClient.get(`/quizzes/${id}`, {
      headers: cookie ? { Cookie: cookie } : undefined,
    });
    console.log(res);
    return res.data.data;
  },

  async createQuiz(
    payload: {
      title: string;
      categoryId: string;
      description?: string;
      useSubject: boolean;
      questions: QuestionData[];
    },
    cookie?: string
  ) {
    const res = await apiClient.post("/quizzes", payload, {
      headers: cookie ? { Cookie: cookie } : undefined,
    });

    return res.data.data.quizId;
  },

  async deleteQuiz(quizId: string, cookie?: string) {
    const res = await apiClient.delete(`/quizzes/${quizId}`, {
      headers: cookie ? { Cookie: cookie } : undefined,
    });
    return res.data;
  },

  async updateQuiz(
    payload: {
      id: string;
      description?: string;
      questions: QuestionData[];
    },
    cookie?: string
  ) {
    const res = await apiClient.patch("/quizzes", payload, {
      headers: cookie ? { Cookie: cookie } : undefined,
    });
    return res.data.data.quizId;
  },

  async submitResult(quizId: string, score: number, cookie?: string) {
    const res = await apiClient.post(
      `/quizzes/${quizId}/results`,
      {
        score,
      },
      {
        headers: cookie ? { Cookie: cookie } : undefined,
      }
    );
    return res.data;
  },

  async rateQuiz(
    quizId: number,
    rating: number,
    anonKey: string,
    cookie?: string
  ) {
    const res = await apiClient.put(
      `/quizzes/${quizId}/rate`,
      {
        rating,
        anonKey,
      },
      {
        headers: cookie ? { Cookie: cookie } : undefined,
      }
    );
    return res.data;
  },

  async reportQuiz(
    report: {
      reason: string;
      title: string;
      message: string;
      targetType: "QUIZ";
      targetId: string | number;
    },
    cookie?: string
  ) {
    const res = await apiClient.post(`/reports`, report, {
      headers: cookie ? { Cookie: cookie } : undefined,
    });
    return res.data;
  },
};
