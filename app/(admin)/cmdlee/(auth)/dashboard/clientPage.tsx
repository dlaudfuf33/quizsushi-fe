"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  TrendingUp,
  AlertTriangle,
  BookOpen,
  CheckCircle,
  Loader2,
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { AdminAPI } from "@/lib/api/admin.api";
import {
  ChartDataPoint,
  DashboardStatsParams,
  StatRawResponse,
} from "@/types/admin.types";
import { format, subDays, startOfDay, endOfDay } from "date-fns";
import { ko } from "date-fns/locale";

export default function DashboardClientPage({
  initialStats,
}: {
  initialStats: StatRawResponse[];
}) {
  // 첼린지 상태
  const [challengeEnabled, setChallengeEnabled] = useState<boolean | null>(
    null
  );

  const fetchChallengeToggleStatus = async () => {
    try {
      const res = await AdminAPI.getChallengeToggleStatus();
      setChallengeEnabled(res);
    } catch (error) {
      console.error("챌린지 상태 조회 실패:", error);
      setChallengeEnabled(null);
    }
  };

  // 날짜 상태
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });

  // 시간 단위 상태
  const [timeUnit, setTimeUnit] = useState<"HOUR" | "DAY" | "WEEK" | "MONTH">(
    "DAY"
  );

  // 데이터 상태
  const [stats, setStats] = useState<StatRawResponse[]>(initialStats);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 데이터 가져오기
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const params: DashboardStatsParams = {
        start: format(startOfDay(dateRange.from), "yyyy-MM-dd'T'HH:mm:ss"),
        end: format(
          dateRange.to.toDateString() === new Date().toDateString()
            ? new Date()
            : endOfDay(dateRange.to),
          "yyyy-MM-dd'T'HH:mm:ss"
        ),
        trunc: timeUnit,
      };

      const data = await AdminAPI.getDashboardStats(params);
      setStats(data);

      if (data && data.length > 0) {
        const processedData = processAPIData(data);
        setChartData(processedData);
      } else {
        setChartData([]);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      setStats([]);
      setChartData([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 초기 로드 및 파라미터 변경 시 데이터 가져오기
  useEffect(() => {
    fetchChallengeToggleStatus();
    fetchData();
  }, [dateRange, timeUnit]);

  // API 데이터 처리
  const processAPIData = (apiData: StatRawResponse[]): ChartDataPoint[] => {
    // 시간별로 데이터 그룹화
    const timeGroups: {
      [key: string]: {
        가입자: number;
        출제: number;
        회원_퀴즈풀이: number;
        비회원_퀴즈풀이: number;
        신고: number;
      };
    } = {};

    // 모든 시간 포인트 초기화
    apiData.forEach((item) => {
      const timeKey = formatTimeKey(item.time, timeUnit);
      if (!timeGroups[timeKey]) {
        timeGroups[timeKey] = {
          가입자: 0,
          출제: 0,
          회원_퀴즈풀이: 0,
          비회원_퀴즈풀이: 0,
          신고: 0,
        };
      }
    });

    // 데이터 매핑
    apiData.forEach((item: StatRawResponse) => {
      const timeKey = formatTimeKey(item.time, timeUnit);

      if (timeGroups[timeKey]) {
        if (item.label === "가입자") {
          timeGroups[timeKey].가입자 = item.count;
        } else if (item.label === "출제") {
          timeGroups[timeKey].출제 = item.count;
        } else if (item.label === "회원_퀴즈풀이") {
          timeGroups[timeKey].회원_퀴즈풀이 = item.count;
        } else if (item.label === "비회원_퀴즈풀이") {
          timeGroups[timeKey].비회원_퀴즈풀이 = item.count;
        } else if (item.label === "신고") {
          timeGroups[timeKey].신고 = item.count;
        }
      }
    });

    // 시간순 정렬하여 반환
    return Object.entries(timeGroups)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([timeKey, data]) => ({
        name: timeKey,
        ...data,
      }));
  };

  // 시간 키 포맷팅
  const formatTimeKey = (timeStr: string, unit: string): string => {
    const date = new Date(timeStr);

    switch (unit) {
      case "HOUR":
        return format(date, "MM/dd HH:mm", { locale: ko });
      case "DAY":
        return format(date, "MM/dd", { locale: ko });
      case "WEEK":
        return format(date, "MM/dd 주", { locale: ko });
      case "MONTH":
        return format(date, "yyyy/MM", { locale: ko });
      default:
        return format(date, "MM/dd", { locale: ko });
    }
  };

  // 현재 통계 계산
  const currentStats = {
    memberJoins: stats
      .filter((s) => s.label === "가입자")
      .reduce((sum, s) => sum + s.count, 0),
    quizCreated: stats
      .filter((s) => s.label === "출제")
      .reduce((sum, s) => sum + s.count, 0),
    memberQuizSolved: stats
      .filter((s) => s.label === "회원_퀴즈풀이")
      .reduce((sum, s) => sum + s.count, 0),
    guestQuizSolved: stats
      .filter((s) => s.label === "비회원_퀴즈풀이")
      .reduce((sum, s) => sum + s.count, 0),
    reports: stats
      .filter((s) => s.label === "신고")
      .reduce((sum, s) => sum + s.count, 0),
  };

  // 빠른 날짜 선택 함수들
  const setQuickDateRange = (days: number) => {
    setDateRange({
      from: subDays(new Date(), days),
      to: new Date(),
    });
  };
  const isSameRange = (from: Date, to: Date, rangeDays: number): boolean => {
    const now = new Date();
    const expectedFrom = subDays(startOfDay(now), rangeDays - 1);
    const expectedTo = endOfDay(now);
    return (
      startOfDay(from).getTime() === expectedFrom.getTime() &&
      endOfDay(to).getTime() === expectedTo.getTime()
    );
  };

  // 커스텀 툴팁
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-lg">
          <p className="text-gray-300 font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.dataKey}: ${entry.value}${
                entry.dataKey === "가입자" ? "명" : "개"
              }`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="p-6">
        <main className="space-y-6">
          {/* 헤더 및 컨트롤 */}
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold text-white">통계 대시보드</h2>

            {/* 간단한 컨트롤 패널 */}
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-4">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="flex items-center gap-2 text-gray-400">
                    <span>|</span>
                  </div>

                  {/* 간단한 날짜 입력 */}
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-400">시작일:</label>
                    <input
                      title="시작일"
                      type="date"
                      value={format(dateRange.from, "yyyy-MM-dd")}
                      onChange={(e) => {
                        const newDate = new Date(e.target.value);
                        if (newDate <= dateRange.to) {
                          setDateRange((prev) => ({ ...prev, from: newDate }));
                        }
                      }}
                      className="px-3 py-1 bg-gray-800 border border-gray-700 rounded text-white text-sm focus:border-orange-500 focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-400">종료일:</label>
                    <input
                      title="종료일"
                      type="date"
                      max={format(new Date(), "yyyy-MM-dd")}
                      value={format(dateRange.to, "yyyy-MM-dd")}
                      onChange={(e) => {
                        const newDate = new Date(e.target.value);
                        if (newDate >= dateRange.from) {
                          setDateRange((prev) => ({ ...prev, to: newDate }));
                        }
                      }}
                      className="px-3 py-1 bg-gray-800 border border-gray-700 rounded text-white text-sm focus:border-orange-500 focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-2 text-gray-400">
                    <span>|</span>
                  </div>
                  {/* 빠른 선택 버튼들 */}
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuickDateRange(1)}
                      className="border-gray-700 text-gray-300 hover:bg-gray-800"
                    >
                      오늘
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuickDateRange(7)}
                      className="border-gray-700 text-gray-300 hover:bg-gray-800"
                    >
                      최근 7일
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuickDateRange(30)}
                      className="border-gray-700 text-gray-300 hover:bg-gray-800"
                    >
                      최근 30일
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 통계 카드들 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">
                  가입자 수
                </CardTitle>
                <Users className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {currentStats.memberJoins.toLocaleString()}
                </div>
                <p className="text-xs text-gray-400">선택 기간 신규 가입</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">
                  문제 출제 수
                </CardTitle>
                <BookOpen className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {currentStats.quizCreated.toLocaleString()}
                </div>
                <p className="text-xs text-gray-400">새로 생성된 퀴즈</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">
                  문제 풀이 수 (회원)
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {currentStats.memberQuizSolved.toLocaleString()}
                </div>
                <p className="text-xs text-gray-400">완료된 퀴즈 풀이 </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">
                  문제 풀이 수 (비회원)
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {currentStats.guestQuizSolved.toLocaleString()}
                </div>
                <p className="text-xs text-gray-400">완료된 퀴즈 풀이</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">
                  신고 건수
                </CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {currentStats.reports}
                </div>
                <p className="text-xs text-gray-400">접수된 신고</p>
              </CardContent>
            </Card>
          </div>

          {/* 메인 차트 영역 */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">활동 추이</CardTitle>
              <div className="flex flex-row justify-between">
                <CardDescription className="text-gray-400">
                  {format(dateRange.from, "yyyy/MM/dd", { locale: ko })} ~{" "}
                  {format(dateRange.to, "yyyy/MM/dd", { locale: ko })} (
                  {timeUnit.toLowerCase()}별 현황)
                </CardDescription>
                {/* 시간 단위 선택 */}
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-400">단위:</label>
                  <div className="flex gap-1">
                    {["HOUR", "DAY", "WEEK", "MONTH"].map((unit) => (
                      <button
                        key={unit}
                        onClick={() =>
                          setTimeUnit(unit as "HOUR" | "DAY" | "WEEK" | "MONTH")
                        }
                        className={`px-3 py-1 rounded text-sm border ${
                          timeUnit === unit
                            ? "bg-orange-500 text-white border-orange-600"
                            : "bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700"
                        }`}
                      >
                        {
                          {
                            HOUR: "시간별",
                            DAY: "일별",
                            WEEK: "주별",
                            MONTH: "월별",
                          }[unit]
                        }
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full">
                {isLoading ? (
                  <div className="h-full flex items-center justify-center bg-gray-800 rounded-lg">
                    <div className="text-center">
                      <Loader2 className="h-8 w-8 text-orange-500 mx-auto mb-2 animate-spin" />
                      <p className="text-gray-400">
                        차트 데이터를 불러오는 중...
                      </p>
                    </div>
                  </div>
                ) : chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={chartData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient
                          id="colorMembers"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#f97316"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="#f97316"
                            stopOpacity={0}
                          />
                        </linearGradient>
                        <linearGradient
                          id="colorQuizCreated"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#3b82f6"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="#3b82f6"
                            stopOpacity={0}
                          />
                        </linearGradient>
                        <linearGradient
                          id="colorQuizSolved"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#22c55e"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="#22c55e"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis
                        dataKey="name"
                        stroke="#9ca3af"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke="#9ca3af"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ color: "#9ca3af" }} />
                      <Area
                        type="monotone"
                        dataKey="가입자"
                        stroke="#f97316"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorMembers)"
                      />
                      <Area
                        type="monotone"
                        dataKey="출제"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorQuizCreated)"
                      />
                      <Area
                        type="monotone"
                        dataKey="회원_퀴즈풀이"
                        stroke="#22c55e"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorQuizSolved)"
                      />
                      <Area
                        type="monotone"
                        dataKey="비회원_퀴즈풀이"
                        stroke="#8b5cf6"
                        strokeWidth={2}
                        fillOpacity={0.6}
                        fill="url(#colorQuizSolved)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center bg-gray-800 rounded-lg">
                    <div className="text-center">
                      <TrendingUp className="h-12 w-12 text-gray-600 mx-auto mb-2" />
                      <p className="text-gray-500">
                        선택한 기간에 데이터가 없습니다
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 추가 차트들 */}
          {chartData.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 바 차트 - 퀴즈 풀이 현황 */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BarChart className="h-5 w-5 text-purple-500" />
                    퀴즈 풀이 현황
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={chartData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis
                          dataKey="name"
                          stroke="#9ca3af"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          stroke="#9ca3af"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar
                          dataKey="회원_퀴즈풀이"
                          fill="#22c55e"
                          radius={[4, 4, 0, 0]}
                        />
                        <Bar
                          dataKey="비회원_퀴즈풀이"
                          fill="#8b5cf6"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* 라인 차트 - 가입자 추이 */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    가입자 추이
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={chartData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis
                          dataKey="name"
                          stroke="#9ca3af"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          stroke="#9ca3af"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                          type="monotone"
                          dataKey="가입자"
                          stroke="#f97316"
                          strokeWidth={3}
                          dot={{ fill: "#f97316", strokeWidth: 2, r: 4 }}
                          activeDot={{
                            r: 6,
                            stroke: "#f97316",
                            strokeWidth: 2,
                          }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="flex items-center gap-2 text-gray-400">
                  <span>|</span>
                </div>

                {/* 챌린지 상태 */}
                <div className="flex items-center gap-3">
                  <label className="text-sm text-gray-400">챌린지 상태:</label>
                  {challengeEnabled === null ? (
                    <span className="text-sm text-gray-500">로딩 중...</span>
                  ) : (
                    <>
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          challengeEnabled
                            ? "bg-green-600 text-white"
                            : "bg-gray-600 text-white"
                        }`}
                      >
                        {challengeEnabled ? "ON" : "OFF"}
                      </span>
                      <Button
                        variant={challengeEnabled ? "destructive" : "secondary"}
                        size="sm"
                        onClick={async () => {
                          try {
                            await AdminAPI.toggleChallengeStatus();
                            fetchChallengeToggleStatus();
                          } catch (e) {
                            console.error("챌린지 상태 토글 실패", e);
                          }
                        }}
                        className="text-sm"
                      >
                        {challengeEnabled ? "OFF로 전환" : "ON으로 전환"}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
