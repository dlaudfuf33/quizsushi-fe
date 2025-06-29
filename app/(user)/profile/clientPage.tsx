"use client";

import InfiniteScroll from "react-infinite-scroll-component";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  PlusCircle,
  Clock,
  Brain,
  ChevronRight,
  ArrowLeft,
  Settings,
  Calendar,
  BookOpen,
  Target,
  Award,
  TrophyIcon,
  Plus,
  TrendingUp,
} from "lucide-react";
import type { UserData, CreatedQuiz, SolvedQuiz } from "@/types/profile.types";
import { useOptimisticUpdate } from "@/hooks/useOptimisticUpdate";
import { QuizAPI } from "@/lib/api/quiz.api";
import { toast } from "react-toastify";

import { MemberAPI } from "@/lib/api/member.api";
import { CreatedQuizCard } from "@/components/profile/CreatedQuizCard";
import { SolvedQuizCard } from "@/components/profile/SolvedQuizCard";
import { useAuth } from "@/context/AuthContext";

interface MyPageClientProps {
  userData: UserData;
  error?: string;
}

export function MyPageClient({ userData, error }: MyPageClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const { data: optimisticQuizzes, optimisticUpdate } =
    useOptimisticUpdate<CreatedQuiz>([]);
  const [createdPage, setCreatedPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [solvedQuizzes, setSolvedQuizzes] = useState<SolvedQuiz[]>([]);
  const [solvedPage, setSolvedPage] = useState(0);
  const [solvedTotalPages, setSolvedTotalPages] = useState(1);
  const [solvedLoading, setSolvedLoading] = useState(false);
  const { isLoggedIn, user, isInitialized } = useAuth();
  const toastShownRef = useRef(false);

  // 로그인 체크 및 리다이렉트
  useEffect(() => {
    if (isInitialized && !isLoggedIn && !toastShownRef.current) {
      toastShownRef.current = true;
      toast.error("로그인이 필요한 서비스입니다.");
      router.push("/login");
    }
  }, [isLoggedIn, isInitialized, router]);

  useEffect(() => {
    if (createdPage === 0 && optimisticQuizzes.length > 0) return;

    const fetchMoreQuizzes = async () => {
      try {
        const res = await MemberAPI.getCreatedQuizzes({
          params: { page: createdPage, size: 10 },
        });
        setTotalPages(res.totalPages);
        const newQuizzes = res.quizzes;
        await optimisticUpdate(
          (prev: CreatedQuiz[]) => [...prev, ...(newQuizzes as CreatedQuiz[])],
          async () => res
        );
      } catch (error) {
        console.log(error);
        toast.error("퀴즈를 더 불러오지 못했어요.");
      }
    };

    fetchMoreQuizzes();
  }, [createdPage]);

  useEffect(() => {
    setSolvedLoading(true);
    const fetchSolvedQuizzes = async () => {
      try {
        const res = await MemberAPI.getSolvedQuizzes({
          params: { page: solvedPage, size: 10 },
        });
        setSolvedTotalPages(res.totalPages);
        setSolvedQuizzes((prev) => [...prev, ...(res.quizzes as SolvedQuiz[])]);
      } catch (error) {
        toast.error("푼 퀴즈를 더 불러오지 못했어요.");
      } finally {
        setSolvedLoading(false);
      }
    };

    if (solvedPage === 0 && solvedQuizzes.length > 0) return;
    fetchSolvedQuizzes();
  }, [solvedPage]);

  // 에러 상태 표시
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <main className="container mx-auto py-8 px-4 max-w-6xl">
          <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
            <CardContent className="p-6 text-center">
              <p className="text-red-600 dark:text-red-400">{error}</p>
              <Button
                onClick={() => window.location.reload()}
                className="mt-4"
                variant="outline"
              >
                다시 시도
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const handleDeleteQuiz = async (quizId: string) => {
    await optimisticUpdate(
      (currentQuizzes) =>
        currentQuizzes.filter((quiz) => quiz.id.toString() !== quizId),
      () => QuizAPI.deleteQuiz(quizId),
      () => {
        toast.success(`삭제 성공!`);
      },
      (error) => {
        console.error("Delete quiz error:", error);
        toast.error(`퀴즈 삭제에 실패했습니다`);
      }
    );
  };

  const handleSettingsClick = async () => {
    try {
      router.push("/profile/settings");
    } catch (error) {
      console.error("Settings error:", error);
      alert("설정을 불러오는데 실패했습니다.");
    }
  };

  const handleEditQuiz = (quizId: string) => {
    router.push(`/quiz/edit/${quizId}`);
  };

  const handleViewQuiz = (quizId: string) => {
    router.push(`/quiz/solve/${quizId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <main className="container mx-auto py-8 px-4 max-w-6xl">
        {/* 뒤로가기 버튼 */}
        <Button
          variant="ghost"
          className="mb-6 hover:bg-white/50 dark:hover:bg-gray-800/50"
          onClick={() => router.push("/")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          홈으로
        </Button>

        {/* 사용자 프로필 헤더 */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 mb-8">
          <div className="flex items-center gap-6">
            <Avatar className="w-20 h-20 border-4 border-primary/20">
              <AvatarImage
                src={userData.avatar || "/placeholder.svg"}
                alt={userData.nickname}
              />
              <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                {userData.nickname.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {userData.nickname}
                </h1>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-3">
                {userData.email}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  가입일: {userData.createAt}
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              className="border-gray-300 dark:border-gray-600"
              onClick={handleSettingsClick}
            >
              <Settings className="w-4 h-4 mr-2" />
              설정
            </Button>
          </div>
        </div>

        {/* 메인 콘텐츠 */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20">
            <TabsList
              className="grid w-full h-12 bg-gray-100 dark:bg-gray-700 p-1 rounded-xl"
              style={{ gridTemplateColumns: "repeat(3, 1fr)" }}
            >
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-primary data-[state=active]:text-white text-sm font-medium rounded-lg transition-all duration-200"
              >
                <User className="w-4 h-4 mr-2" />
                개요
              </TabsTrigger>
              <TabsTrigger
                value="created"
                className="data-[state=active]:bg-primary data-[state=active]:text-white text-sm font-medium rounded-lg transition-all duration-200"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                내가 만든 퀴즈
              </TabsTrigger>
              <TabsTrigger
                value="solved"
                className="data-[state=active]:bg-primary data-[state=active]:text-white text-sm font-medium rounded-lg transition-all duration-200"
              >
                <Clock className="w-4 h-4 mr-2" />
                내가 풀었던 퀴즈
              </TabsTrigger>
            </TabsList>
          </div>

          {/* 개요 탭 */}
          <TabsContent value="overview" className="space-y-6">
            {/* 통계 그리드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  label: "퀴즈 풀이 횟수",
                  value: `${userData.stats.totalQuizzesSolved} 번`,
                  icon: BookOpen,
                  color: "text-blue-500",
                  bgColor: "bg-blue-50 dark:bg-blue-900/20",
                },
                {
                  label: "만든 퀴즈",
                  value: `${userData.stats.totalQuizzesCreated} 건`,
                  icon: PlusCircle,
                  color: "text-green-500",
                  bgColor: "bg-green-50 dark:bg-green-900/20",
                },
                {
                  label: "평균 점수",
                  value: `${userData.stats.averageScore} 점`,
                  icon: Target,
                  color: "text-primary",
                  bgColor: "bg-orange-50 dark:bg-orange-900/20",
                },
              ].map((item, index) => (
                <Card
                  key={index}
                  className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-white/20 shadow-lg"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                          {item.label}
                        </p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {item.value}
                        </p>
                      </div>
                      <div className={`p-3 rounded-full ${item.bgColor}`}>
                        <item.icon className={`w-6 h-6 ${item.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* 최근 학습 현황 */}
            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-white/20 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-primary" />
                  최근 학습 현황
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {solvedQuizzes.slice(0, 5).map((quiz, idx) => (
                    <Card
                      key={`${quiz.id ?? "deleted"}-${idx}`}
                      className="bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-3 h-3 rounded-full bg-blue-500" />
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {quiz.title ?? "삭제된 퀴즈입니다"}
                              </p>
                              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                <span>{quiz.category ?? "알 수 없음"}</span>
                                <span>{quiz.date}</span>
                                <Badge
                                  variant="outline"
                                  className="border-blue-200 text-blue-600 dark:border-blue-800 dark:text-blue-400"
                                >
                                  퀴즈 풀이
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-primary">
                              {quiz.score}점
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <Button
                  variant="outline"
                  className="w-full mt-4"
                  onClick={() => setActiveTab("solved")}
                >
                  전체 풀이 내역 보기
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 만든 퀴즈 탭 */}
          <TabsContent value="created" className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-orange-500" />
                  내가 만든 퀴즈
                </h2>
                <Badge
                  variant="secondary"
                  className="bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300"
                >
                  총 {optimisticQuizzes.length}개
                </Badge>
              </div>
              <Button
                className="bg-gradient-to-r from-primary to-[#FF8C69] hover:from-[#FF8C69] hover:to-primary text-white shadow-lg"
                onClick={() => router.push("/quiz/create")}
              >
                <PlusCircle className="w-4 h-4 mr-2" />새 퀴즈 만들기
              </Button>
            </div>

            {optimisticQuizzes.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-[#FFA07A]/30 rounded-xl bg-[#FFA07A]/5">
                <div className="max-w-md mx-auto">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#FFA07A]/20 to-[#FF8C69]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Plus className="h-6 w-6 text-[#FFA07A]" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    첫 번째 문제를 만들어보세요
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    "문제 만들기" 버튼을 클릭하여 퀴즈 문제를 만들어보세요
                  </p>
                  <Button
                    onClick={() => router.push("/quiz/create")}
                    className="bg-gradient-to-r from-[#FFA07A] to-[#FF8C69] hover:from-[#FF8C69] hover:to-[#FFA07A] text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    문제 만들기
                  </Button>
                </div>
              </div>
            ) : (
              <InfiniteScroll
                dataLength={optimisticQuizzes.length}
                next={() => setCreatedPage((prev) => prev + 1)}
                hasMore={createdPage < totalPages}
                loader={
                  <div className="text-center text-sm text-gray-500 dark:text-gray-400 py-6">
                    불러오는 중...
                  </div>
                }
              >
                <div className="space-y-4">
                  {optimisticQuizzes.map((quiz, index) => (
                    <CreatedQuizCard
                      key={quiz.id}
                      quiz={quiz}
                      index={index}
                      onEdit={handleEditQuiz}
                      onView={handleViewQuiz}
                      onDelete={handleDeleteQuiz}
                    />
                  ))}
                </div>
              </InfiniteScroll>
            )}
          </TabsContent>

          {/* 푼 퀴즈 탭 */}
          <TabsContent value="solved" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <TrophyIcon className="w-6 h-6 text-orange-500" />푼 퀴즈 목록
              </h2>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Award className="w-4 h-4" />
                <span>
                  총 {new Set(solvedQuizzes.map((q) => q.id)).size}개 완료
                </span>
              </div>
            </div>

            {solvedQuizzes.length === 0 && !solvedLoading ? (
              <div className="text-center py-12 border-2 border-dashed border-gray-300/30 rounded-xl bg-gray-100 dark:bg-gray-800/30">
                <div className="max-w-md mx-auto">
                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
                    <BookOpen className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    아직 푼 문제가 없어요!
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    퀴즈를 풀고 여러분의 실력을 확인해보세요.
                  </p>
                  <Button
                    onClick={() => router.push("/quiz/categories")}
                    className="bg-primary text-white hover:bg-primary/90"
                  >
                    퀴즈 풀러 가기
                  </Button>
                </div>
              </div>
            ) : (
              <InfiniteScroll
                dataLength={solvedQuizzes.length}
                next={() => setSolvedPage((prev) => prev + 1)}
                hasMore={solvedPage < solvedTotalPages}
                loader={
                  <div className="text-center text-sm text-gray-500 dark:text-gray-400 py-6">
                    불러오는 중...
                  </div>
                }
              >
                <div className="space-y-4">
                  {solvedQuizzes.map((quiz, idx) => (
                    <SolvedQuizCard
                      key={`${quiz.id ?? "deleted"}-${idx}`}
                      quiz={quiz}
                      index={idx}
                    />
                  ))}
                </div>
              </InfiniteScroll>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
