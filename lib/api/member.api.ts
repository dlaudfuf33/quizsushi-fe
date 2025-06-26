import { apiClient } from "./axios";
import type {
  UserData,
  CreatedQuizzesResponse,
  ProfileUpdateData,
  SolvedQuizzesResponse,
} from "@/types/profile.types";

export const MemberAPI = {
  // 사용자 정보 조회
  async getUserProfile(cookie?: string): Promise<UserData> {
    const res = await apiClient.get(`/members/profiles`, {
      headers: cookie ? { Cookie: cookie } : undefined,
    });
    return res.data.data;
  },

  // 사용자가 만든 퀴즈 목록 조회
  async getCreatedQuizzes(options?: {
    cookie?: string;
    params?: { page?: number; size?: number };
  }): Promise<CreatedQuizzesResponse> {
    const res = await apiClient.get(`/members/quizzes/created`, {
      headers: options?.cookie ? { Cookie: options.cookie } : undefined,
      params: options?.params,
    });
    return res.data.data;
  },

  // 사용자가 풀었던 퀴즈 목록 조회
  async getSolvedQuizzes(options?: {
    cookie?: string;
    params?: { page?: number; size?: number };
  }): Promise<SolvedQuizzesResponse> {
    const res = await apiClient.get(`/members/quizzes/solved`, {
      headers: options?.cookie ? { Cookie: options.cookie } : undefined,
      params: options?.params,
    });
    return res.data.data;
  },

  // 퀴즈 삭제
  async deleteCreatedQuiz(quizId: string, cookie?: string): Promise<void> {
    const res = await apiClient.delete(`/quizzes/${quizId}`, {
      headers: cookie ? { Cookie: cookie } : undefined,
    });
    return res.data;
  },

  // 프로필 업데이트
  async updateProfile(
    profileData: ProfileUpdateData,
    cookie?: string
  ): Promise<void> {
    const res = await apiClient.put(`/members/profiles`, profileData, {
      headers: cookie ? { Cookie: cookie } : undefined,
    });
    return res.data;
  },

  // 탈퇴
  async deleteMe(cookie?: string): Promise<void> {
    const res = await apiClient.delete(`/members/me`, {
      headers: cookie ? { Cookie: cookie } : undefined,
    });
    return res.data;
  },

  async getDashboardStats(
    type: "DAILY" | "WEEKLY" | "MONTHLY",
    limit?: number
  ): Promise<any[]> {
    const res = await apiClient.get("/cmdlee-qs/dashboard/data", {
      params: { type, limit },
    });
    return res.data;
  },
};
