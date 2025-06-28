import { apiClient } from "./axios";

export const AiAPI = {
  async generateAiQuestions(
    payload: {
      topic: string;
      description?: string;
      count: number;
      difficulty: string;
      questionType: string;
    },
    cookie?: string
  ) {
    const res = await apiClient.post("/ai/quizzes/questions", payload, {
      headers: cookie ? { Cookie: cookie } : undefined,
    });
    return res.data.data;
  },
};
