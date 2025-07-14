export interface DashboardStatsParams {
  start: string;
  end: string;
  trunc: "HOUR" | "DAY" | "WEEK" | "MONTH";
}

export interface StatRawResponse {
  label: string;
  time: string;
  count: number;
}

export interface ChartDataPoint {
  name: string;
  가입자: number;
  출제: number;
  회원_퀴즈풀이: number;
  비회원_퀴즈풀이: number;
  신고: number;
  [key: string]: string | number;
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

export interface Reporter {
  id?: number | string;
  email: string;
}

export interface Reported {
  type: string;
  id?: number | string;
  targetName: string;
  reason: string;
}

export interface Report {
  id: number;
  title: string;
  message: string;
  reporter: Reporter;
  reported: Reported;
  read: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Admin {
  id: number;
  alias: string;
  username: string;
  role: string;
}

export interface AdminContextType {
  admin: Admin | null;
  isInitialized: boolean;
  isLoggedIn: boolean;
  logout: () => Promise<void>;
  refreshAdmin: () => Promise<void>;
}