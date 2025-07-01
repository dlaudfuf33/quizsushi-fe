"use client";

import { nanoid } from "nanoid";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Star,
  Trophy,
  Clock,
  Target,
  BookOpen,
  CheckCircle2,
  Trash2,
  Pencil,
  ListFilter,
  ListX,
  Lock,
  AlertTriangle,
  Siren,
} from "lucide-react";
import { QuestionCard } from "@/components/quiz/solve/QuestionCard";
import { QuestionCardSkeleton } from "@/components/skeleton/QuestionCardSkeleton";
import { DeleteQuizModal } from "@/components/quiz/solve/DeleteQuizModal";
import type { QuizSet } from "@/types/quiz.types";
import { toast } from "react-toastify";
import { QuizAPI } from "@/lib/api/quiz.api";
import { isAnswerCorrect } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import BackButton from "@/components/ui/back-button";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ReportModal from "@/components/quiz/solve/ReportModal";
import QuizDetailSkeleton from "@/components/skeleton/QuizDetailSkeleton";

interface Props {
  quizData: QuizSet;
}

export default function QuizDetailClientPage({ quizData }: Props) {
  const { isLoggedIn, user, isInitialized } = useAuth();

  const router = useRouter();
  const quiz = quizData;
  const [activeTab, setActiveTab] = useState("all");
  const [userAnswers, setUserAnswers] = useState<
    Record<string, number[] | string>
  >({});
  const [showResults, setShowResults] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(quiz.userRating);
  const [startTime, setStartTime] = useState(Date.now());
  const [endTime, setEndTime] = useState<number | null>(null);
  const [showOnlyIncorrect, setShowOnlyIncorrect] = useState(false);

  // 모달 상태
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const questionsPerPage = 5;

  // 본인이 만든 퀴즈인지 확인
  const isOwner = user && String(quiz.author.id) === String(user.id);

  // 정답 수 계산 함수
  const getCorrectAnswerCount = () => {
    return Object.keys(userAnswers).filter((questionId) => {
      const question = quiz.questions.find(
        (q) => q.id.toString() === questionId
      );
      const userAnswer = userAnswers[questionId];
      return question && isAnswerCorrect(question, userAnswer);
    }).length;
  };

  // 점수 % 계산 함수
  const getScorePercentage = () => {
    const correct = getCorrectAnswerCount();
    return displayQuestions.length
      ? Math.round((correct / displayQuestions.length) * 100)
      : 0;
  };

  // 사용자가 퀴즈에 평점을 매기는 함수
  const handleRateQuiz = async (rating: number) => {
    try {
      setIsLoading(true);

      let anonKey = localStorage.getItem("quiz_anonKey");
      if (!anonKey) {
        anonKey = nanoid();
        localStorage.setItem("quiz_anonKey", anonKey);
      }

      await QuizAPI.rateQuiz(Number(quiz.id), rating, anonKey);

      setUserRating(rating);
    } catch (error) {
      console.error("퀴즈 평가 오류:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 삭제 버튼 클릭 핸들러
  const handleDeleteClick = () => {
    if (!isOwner) {
      toast.error("본인이 만든 퀴즈만 삭제할 수 있습니다.");
      return;
    }
    setShowDeleteModal(true);
  };

  // 수정 버튼 클릭 핸들러
  const handleEditClick = () => {
    if (!isOwner) {
      toast.error("본인이 만든 퀴즈만 수정할 수 있습니다.");
      return;
    }
    router.push(`/quiz/edit/${quiz.id}`);
  };

  // 삭제 확인 및 처리
  const handleDeleteConfirm = async () => {
    try {
      await QuizAPI.deleteQuiz(quiz.id);
      toast.success("퀴즈가 성공적으로 삭제되었습니다.");
      router.push("/quiz/categories");
    } catch (error) {
      console.log(error);
    }
  };

  const handleReportConfirm = async ({
    reason,
    title,
    message,
  }: {
    reason: string;
    title: string;
    message: string;
  }) => {
    try {
      await QuizAPI.reportQuiz({
        reason,
        title,
        message,
        targetType: "QUIZ",
        targetId: quiz.id,
      });
      toast.success("신고가 접수되었습니다.");
    } catch (err) {
      console.error(err);
      toast.error("신고 중 오류가 발생했습니다.");
    }
  };
  // 현재 선택된 탭에 따라 문제를 필터링하는 값
  const questions = Array.isArray(quiz?.questions) ? quiz.questions : [];

  const filteredQuestions =
    activeTab === "all"
      ? questions
      : typeof activeTab === "string"
      ? questions.filter(
          (q) =>
            typeof q.subject === "string" &&
            q.subject.trim().toLowerCase() === activeTab.toLowerCase()
        )
      : questions;

  // 비로그인 사용자는 10문제까지만 표시
  const displayQuestions = !isLoggedIn
    ? filteredQuestions.slice(0, 10)
    : filteredQuestions;

  // 틀린 문제들만
  const displayedQuestions =
    showResults && showOnlyIncorrect
      ? displayQuestions.filter(
          (q) => !isAnswerCorrect(q, userAnswers[q.id.toString()])
        )
      : displayQuestions;

  // 현재 페이지에 보여줄 문제들만 슬라이싱하는 값
  const startIndex = (currentPage - 1) * questionsPerPage;
  const endIndex = startIndex + questionsPerPage;
  const currentQuestions = displayedQuestions.slice(
    startIndex,
    Math.min(endIndex, displayedQuestions.length)
  );
  const totalPages = Math.ceil(displayedQuestions.length / questionsPerPage);

  // 사용자가 선택한 문제 수를 세는 값
  const answeredCount = Object.keys(userAnswers).length;

  // 사용자가 맞힌 문제 수를 계산하는 값
  const correctCount = getCorrectAnswerCount();

  // 문제 풀이 진행률(%)을 계산하는 값
  const progressPercentage =
    displayQuestions.length > 0
      ? (answeredCount / displayQuestions.length) * 100
      : 0;

  // 제출 후 정답률(%)을 계산하는 값
  const scorePercentage = getScorePercentage();

  // 사용자의 보기 선택을 기록하는 함수
  const handleAnswerSelect = (
    questionId: string,
    value: number[] | string,
    isShortType: boolean
  ) => {
    // 비로그인 사용자의 답변 제한 체크
    if (!isLoggedIn && answeredCount >= 10 && !userAnswers[questionId]) {
      toast.warning(
        "비회원은 10문제까지만 풀 수 있습니다. 로그인하고 계속 풀어보세요!"
      );
      return;
    }

    setUserAnswers((prev) => {
      if (isShortType) {
        return {
          ...prev,
          [questionId]: value as string,
        };
      }

      const prevAnswer = prev[questionId];
      const prevArray = Array.isArray(prevAnswer) ? prevAnswer : [];
      const clicked = (value as number[])[0];

      const newArray = prevArray.includes(clicked)
        ? prevArray.filter((v) => v !== clicked)
        : [...prevArray, clicked];

      return {
        ...prev,
        [questionId]: newArray,
      };
    });
  };

  // 사용자가 퀴즈를 제출할 때 호출되는 함수
  const handleSubmit = async () => {
    setEndTime(Date.now());
    setShowResults(true);
    const score = getScorePercentage();
    await QuizAPI.submitResult(quiz.id, score);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 퀴즈를 초기 상태로 리셋하는 함수
  const handleReset = () => {
    setUserAnswers({});
    setShowResults(false);
    setCurrentPage(1);
    setEndTime(null);
    setStartTime(Date.now());
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 현재 페이지를 변경(이전/다음)하는 함수
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setIsLoading(true);
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => setIsLoading(false), 300);
    }
  };

  // 전체 문제에서 고유한 과목명(subject)을 추출하는 값
  const subjects: string[] = Array.from(
    new Set(
      (quiz?.questions ?? [])
        .map((q) => q.subject)
        .filter((s): s is string => typeof s === "string" && s.trim() !== "")
    )
  );

  // 정답률에 따라 등급 및 시각 요소를 반환하는 함수
  const getScoreGrade = (percentage: number) => {
    if (percentage >= 90)
      return { grade: "A+", color: "text-green-600", emoji: "🏆" };
    if (percentage >= 80)
      return { grade: "A", color: "text-green-500", emoji: "🥇" };
    if (percentage >= 70)
      return { grade: "B", color: "text-blue-500", emoji: "🥈" };
    if (percentage >= 60)
      return { grade: "C", color: "text-yellow-500", emoji: "🥉" };
    return { grade: "D", color: "text-red-500", emoji: "📚" };
  };

  // 퀴즈 풀이에 소요된 시간을 계산하는 값
  const elapsedTime = endTime ? Math.round((endTime - startTime) / 1000) : 0;
  const { grade, color, emoji } = getScoreGrade(scorePercentage);

  if (!isInitialized) {
    return <QuizDetailSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="relative">
        <main className="container mx-auto py-8 px-4 max-w-4xl">
          {/* 비로그인 사용자 알림 */}
          {!isLoggedIn && (
            <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-amber-800 dark:text-amber-200 font-medium">
                    비회원 제한 안내
                  </p>
                  <p className="text-amber-700 dark:text-amber-300 text-sm mt-1">
                    비회원은 10문제까지만 풀 수 있습니다. 로그인하면 모든 문제를
                    풀 수 있어요!
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => router.push("/login")}
                  className="bg-amber-600 hover:bg-amber-700 text-white"
                >
                  로그인하기
                </Button>
              </div>
            </div>
          )}

          {/* 헤더 */}
          <div className="mb-8">
            <BackButton />

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
              <div className="flex flex-wrap gap-3 items-center mb-4">
                <Badge
                  variant="outline"
                  className="bg-[#FFA07A]/10 border-[#FFA07A]/30 text-[#FFA07A]"
                >
                  <BookOpen className="h-3 w-3 mr-1" />
                  {quiz.category.title}
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                >
                  <Target className="h-3 w-3 mr-1" />
                  {!isLoggedIn && questions.length > 10 ? (
                    <>
                      10/{questions.length}문제
                      <Lock className="h-3 w-3 ml-1" />
                    </>
                  ) : (
                    `${questions.length}문제`
                  )}
                </Badge>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <span>by</span>
                  <div className="flex items-center">
                    <Avatar className="w-8 h-8 border-2 border-primary/20">
                      <AvatarImage
                        src={quiz.author.avatar || "/placeholder.svg"}
                        alt={quiz.author.nickName}
                      />
                      <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                        {quiz.author.nickName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-gray-700 dark:text-gray-300">
                      {quiz.author.nickName}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold mb-3 text-gray-900 dark:text-white">
                    {quiz.title}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 my-4 leading-relaxed">
                    {quiz.description}
                  </p>
                </div>

                {/* 수정/삭제 버튼 - 본인 퀴즈만 표시 */}
                {isLoggedIn && isOwner ? (
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleEditClick}
                      className="border-blue-300 text-blue-600 hover:bg-blue-50 dark:border-blue-600 dark:text-blue-400 dark:hover:bg-blue-900/20"
                    >
                      <Pencil className="h-4 w-4 mr-1" />
                      수정
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDeleteClick}
                      className="border-red-300 text-red-500 hover:bg-red-50 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      삭제
                    </Button>
                  </div>
                ) : (
                  isLoggedIn && (
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="outline"
                        onClick={() => setShowReportModal(true)}
                        size="sm"
                        className="border-red-300 text-red-500 hover:bg-red-50 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-900/20"
                      >
                        <Siren className="h-4 w-4 mr-1" />
                        신고
                      </Button>
                    </div>
                  )
                )}
              </div>

              {/* 평점 시스템 */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Tooltip key={star}>
                      <TooltipTrigger asChild>
                        <span>
                          <Star
                            className={`h-5 w-5 cursor-pointer transition-colors ${
                              star <= (userRating || quiz.rating)
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300 dark:text-gray-600 hover:text-yellow-300"
                            }`}
                            onClick={() => handleRateQuiz(star)}
                          />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent
                        side="top"
                        sideOffset={6}
                        className="bg-white text-gray-800 dark:bg-gray-800 dark:text-gray-100 text-xs rounded-md px-3 py-1.5 shadow-md z-50"
                      >
                        클릭해서 {star}점으로 평가
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
                <span className="text-sm font-medium">
                  {quiz.rating.toFixed(1)} ({quiz.ratingCount}명 평가)
                </span>
              </div>
            </div>
          </div>

          {/* 결과 카드 */}
          {showResults && (
            <Card className="mb-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-[#FFA07A]/30 shadow-lg">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-20 h-20 bg-gradient-to-r from-[#FFA07A] to-[#FF8C69] rounded-full flex items-center justify-center text-3xl shadow-lg">
                    {emoji}
                  </div>
                </div>
                <CardTitle className="text-2xl flex items-center justify-center gap-2">
                  <Trophy className="h-6 w-6 text-yellow-500" />
                  퀴즈 완료!
                </CardTitle>
                <CardDescription className="text-lg">
                  총 {displayQuestions.length}문제 중 {correctCount}문제 정답
                  {!isLoggedIn && questions.length > 10 && (
                    <div className="text-sm text-amber-600 dark:text-amber-400 mt-2">
                      (비회원은 10문제까지만 풀 수 있습니다)
                    </div>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                    <div className={`text-2xl font-bold ${color}`}>
                      {scorePercentage}%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      점수
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                    <div className={`text-2xl font-bold ${color}`}>{grade}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      등급
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 flex items-center justify-center gap-1">
                      <Clock className="h-5 w-5" />
                      {elapsedTime}초
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      소요시간
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span>정답률</span>
                    <span className="font-medium">{scorePercentage}%</span>
                  </div>
                  <Progress value={scorePercentage} className="h-3" />
                </div>

                <div className="flex justify-center gap-2">
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="gap-2 w-40 justify-center"
                  >
                    <RotateCcw className="h-4 w-4" />
                    다시 풀기
                  </Button>
                  <Button
                    onClick={() => setShowOnlyIncorrect((prev) => !prev)}
                    variant="outline"
                    className="gap-2 w-40 justify-center"
                  >
                    {showOnlyIncorrect ? (
                      <>
                        <ListFilter className="h-4 w-4" />
                        전체 문제 보기
                      </>
                    ) : (
                      <>
                        <ListX className="h-4 w-4" />
                        틀린 문제만 보기
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 탭 및 필터 */}
          <div className="mb-6">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20">
                <TabsList
                  className="grid w-full h-12 bg-gray-100 dark:bg-gray-700 p-1 mb-4"
                  style={{
                    gridTemplateColumns: `repeat(${Math.min(
                      subjects.length + 1,
                      6
                    )}, 1fr)`,
                  }}
                >
                  <TabsTrigger
                    value="all"
                    className="data-[state=active]:bg-[#FFA07A] data-[state=active]:text-white text-sm font-medium"
                  >
                    전체 (
                    {!isLoggedIn && questions.length > 10
                      ? "10"
                      : questions.length}
                    )
                  </TabsTrigger>
                  {subjects.slice(0, 5).map((subject) => (
                    <TabsTrigger
                      key={subject}
                      value={subject}
                      className="data-[state=active]:bg-[#FFA07A] data-[state=active]:text-white text-sm font-medium"
                    >
                      {subject} (
                      {
                        (quiz?.questions ?? []).filter(
                          (q) => q.subject === subject
                        ).length
                      }
                      )
                    </TabsTrigger>
                  ))}
                </TabsList>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center gap-3">
                    <Badge
                      variant="outline"
                      className="bg-gray-50 dark:bg-gray-800"
                    >
                      <Target className="h-3 w-3 mr-1" />
                      {displayQuestions.length} 문제
                    </Badge>
                    <Badge
                      variant="outline"
                      className="bg-gray-50 dark:bg-gray-800"
                    >
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      {answeredCount} / {displayQuestions.length} 완료
                    </Badge>
                    {showResults && (
                      <Badge
                        variant="outline"
                        className={`${color} bg-gray-50 dark:bg-gray-800`}
                      >
                        <Trophy className="h-3 w-3 mr-1" />
                        {correctCount} / {displayQuestions.length} 정답
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="h-8"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm font-medium px-2">
                      {currentPage} / {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="h-8"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span>진행률</span>
                    <span className="font-medium">
                      {Math.round(progressPercentage)}%
                    </span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                </div>
              </div>
            </Tabs>
          </div>

          {/* 문제 목록 */}
          <div className="space-y-6 mb-8">
            {isLoading
              ? [...Array(questionsPerPage)].map((_, i) => (
                  <QuestionCardSkeleton key={i} />
                ))
              : (currentQuestions ?? []).map((question, index) => (
                  <QuestionCard
                    key={question.id}
                    question={question}
                    userAnswer={
                      question.id ? userAnswers[question.id] : undefined
                    }
                    showResults={showResults}
                    onAnswerSelect={(id, value) =>
                      handleAnswerSelect(id, value, question.type === "SHORTS")
                    }
                    questionIndex={startIndex + index}
                    totalAnsweredCount={answeredCount}
                  />
                ))}
          </div>

          {/* 하단 네비게이션 */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20">
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                이전 페이지
              </Button>

              {!showResults && (
                <Button
                  onClick={handleSubmit}
                  disabled={answeredCount === 0}
                  className="bg-gradient-to-r from-[#FFA07A] to-[#FF8C69] hover:from-[#FF8C69] hover:to-[#FFA07A] text-white shadow-lg px-8 gap-2"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  제출하기 ({answeredCount}/{displayQuestions.length})
                </Button>
              )}

              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="gap-2"
              >
                다음 페이지
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </main>
      </div>
      {/* 삭제 모달 */}
      <DeleteQuizModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        quizTitle={quiz.title}
      />
      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        onConfirm={handleReportConfirm}
      />
    </div>
  );
}
