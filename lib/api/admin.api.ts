import { adminApiClient } from "./axios";
import { DashboardStatsParams, Member, Report } from "@/types/admin.types";

export const AdminAPI = {
  async getSession(cookie?: string) {
    const res = await adminApiClient.get(`/me`, {
      headers: cookie ? { Cookie: cookie } : undefined,
    });
    return res.data.data;
  },

  async getDashboardStats(params: DashboardStatsParams): Promise<any[]> {
    const res = await adminApiClient.get(`/dashboard/data`, {
      params,
    });
    return res.data.data;
  },

  async getAdminList(cookie?: string): Promise<any[]> {
    const res = await adminApiClient.get(`/admin`, {
      headers: cookie ? { Cookie: cookie } : undefined,
    });
    return res.data.data;
  },

  async createAdmin(
    alias: string,
    username: string,
    rawPassword: string,
    role: string
  ): Promise<void> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    const res = await adminApiClient.post(`/admin`, {
      alias,
      username,
      rawPassword,
      role,
    });
    return res.data.data;
  },

  async updateAdminRole(id: number, role: string): Promise<any[]> {
    const res = await adminApiClient.patch(`/admin/${id}/role`, { role });
    return res.data.data;
  },

  async updateMyProfile(
    newAlias: string,
    newRawPassword: string
  ): Promise<any[]> {
    const res = await adminApiClient.patch(`/admin/me`, {
      newAlias,
      newRawPassword,
    });
    return res.data.data;
  },

  async deleteAdmin(id: number): Promise<any[]> {
    const res = await adminApiClient.delete(`/admin/${id}`);
    return res.data.data;
  },

  async getMemberList(params?: {
    searchQuery?: string;
    status?: string;
    page?: number;
    size?: number;
  }): Promise<{ members: Member[]; totalPages: number }> {
    const res = await adminApiClient.get("/members", { params });
    return res.data.data;
  },

  async updateMemberStatus(
    memberId: number,
    status: "활성" | "정지"
  ): Promise<void> {
    await adminApiClient.patch(`/members/${memberId}/status`, { status });
  },

  async deleteQuiz(quizId?: string | number): Promise<void> {
    await adminApiClient.delete(`/quizzes/${quizId}`);
  },

  async getReportList(params?: {
    searchQuery?: string;
    status?: string;
    page?: number;
    size?: number;
  }): Promise<{ reports: Report[]; totalPages: number }> {
    const res = await adminApiClient.get("/reports", { params });
    return res.data.data;
  },

  async markReportAsRead(id: number | string): Promise<void> {
    await adminApiClient.patch(`/reports/${id}/read`);
  },

  async updateReportStatus(
    id: number | string,
    newStatus: string
  ): Promise<void> {
    await adminApiClient.patch(`/reports/${id}/status`, { newStatus });
  },

  async getChallengeToggleStatus(): Promise<boolean> {
    const res = await adminApiClient.get("/challenge/toggle");
    return res.data.data;
  },

  async toggleChallengeStatus(): Promise<void> {
    await adminApiClient.post("/challenge/toggle");
  },
};
