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

export interface Report {
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
