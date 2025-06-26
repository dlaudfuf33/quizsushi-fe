import { apiClient } from "./axios";
import type { Category, IntroductionCategory } from "@/types/category.types";

export const CategoryAPI = {
  async getIntroductions(): Promise<IntroductionCategory[]> {
    const res = await apiClient.get("/quizzes/categories/introductions");
    return res.data.data;
  },

  async getCategories(): Promise<Category[]> {
    const res = await apiClient.get("/quizzes/categories");
    if (!res.data.success || !res.data?.data) {
      console.error("카테고리 불러오기 실패:", res.data.message);
      return [];
    }
    return res.data.data;
  },
};
