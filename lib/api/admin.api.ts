import { adminApiClient } from "./axios";
export interface DashboardStatsParams {
  start: string;
  end: string;
  trunc: "HOUR" | "DAY" | "WEEK" | "MONTH";
}

export interface Member {
  id: number;
  email: string;
  nickname: string;
  planTier: string;
  createdAt: string;
  updatedAt: string;
  status: string;
}

interface Report {
  id: number;
  title: string;
  message: string;
  reporter: {
    id?: number | string;
    email: string;
  };
  reported: {
    type: string;
    id?: number | string;
    targetName: string;
    reason: string;
  };
  read: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
}

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
};
