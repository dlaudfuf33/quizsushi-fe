"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, RotateCcw, BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";

interface SolvedQuizCardProps {
  quiz: {
    id?: number;
    title?: string;
    category?: string;
    date: string;
    score: number;
  };
  index: number;
}

export function SolvedQuizCard({ quiz, index }: SolvedQuizCardProps) {
  const router = useRouter();

  const getScoreInfo = (score: number) => {
    if (score >= 90) {
      return {
        emoji: "👑",
        label: "초밥 마스터!",
        bgColor: "from-yellow-400 to-orange-500",
        textColor: "text-yellow-700 dark:text-yellow-400",
        borderColor: "border-yellow-200 dark:border-yellow-800",
        iconColor: "text-yellow-600",
      };
    } else if (score >= 80) {
      return {
        emoji: "🐟",
        label: "신선한 실력!",
        bgColor: "from-orange-400 to-red-500",
        textColor: "text-orange-700 dark:text-orange-400",
        borderColor: "border-orange-200 dark:border-orange-800",
        iconColor: "text-orange-600",
      };
    } else if (score >= 70) {
      return {
        emoji: "🍣",
        label: "초밥 연습생",
        bgColor: "from-blue-400 to-purple-500",
        textColor: "text-blue-700 dark:text-blue-400",
        borderColor: "border-blue-200 dark:border-blue-800",
        iconColor: "text-blue-600",
      };
    } else if (score >= 60) {
      return {
        emoji: "🔪",
        label: "김밥일지도...?",
        bgColor: "from-green-400 to-teal-500",
        textColor: "text-green-700 dark:text-green-400",
        borderColor: "border-green-200 dark:border-green-800",
        iconColor: "text-green-600",
      };
    } else {
      return {
        emoji: "💤",
        label: "다시 도전하쥬~",
        bgColor: "from-gray-400 to-gray-600",
        textColor: "text-gray-700 dark:text-gray-400",
        borderColor: "border-gray-200 dark:border-gray-700",
        iconColor: "text-gray-600",
      };
    }
  };

  const scoreInfo = getScoreInfo(quiz.score);

  const handleRetry = () => {
    if (quiz.id) {
      router.push(`/quiz/solve/${quiz.id}`);
    }
  };

  const isDeleted = !quiz.id || !quiz.title;

  return (
    <Card className="hover:shadow-lg bg-white dark:bg-gray-800/80 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          {/* 왼쪽 콘텐츠 */}
          <div className="flex items-center gap-4 flex-1">
            {/* 점수 아이콘 */}
            <div
              className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${scoreInfo.bgColor} flex items-center justify-center shadow-lg`}
            >
              <span className="text-2xl">{scoreInfo.emoji}</span>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-md">
                <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                  {index + 1}
                </span>
              </div>
            </div>

            {/* 퀴즈 정보 */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h3
                  className={`font-bold text-lg ${
                    isDeleted
                      ? "text-gray-400 dark:text-gray-500"
                      : "text-gray-900 dark:text-white"
                  } truncate`}
                >
                  {quiz.title ?? "삭제된 퀴즈입니다"}
                </h3>
                {!isDeleted && (
                  <Badge
                    variant="outline"
                    className={`${scoreInfo.borderColor} ${scoreInfo.textColor} text-xs font-medium`}
                  >
                    {scoreInfo.label}
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  <span>{quiz.category ?? "알 수 없음"}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{quiz.date}</span>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                >
                  퀴즈 풀이
                </Badge>
              </div>
            </div>
          </div>

          {/* 오른쪽 점수 및 액션 */}
          <div className="flex items-center gap-4">
            {/* 점수 표시 */}
            <div className="text-right">
              <div
                className={`text-3xl font-bold ${scoreInfo.textColor} flex items-center gap-1`}
              >
                <span>{quiz.score}</span>
                <span className="text-lg text-gray-400">점</span>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                100점 만점
              </div>
            </div>
            {/* 다시풀기 버튼 */}
            {!isDeleted ? (
              <Button
                onClick={handleRetry}
                variant="outline"
                size="sm"
                className="hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-600 dark:hover:text-blue-400 "
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                재도전!
              </Button>
            ) : (
              <Button
                disabled
                variant="outline"
                size="sm"
                className="cursor-not-allowed opacity-50"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                퀴즈 삭제됨
              </Button>
            )}
          </div>
        </div>

        {/* 하단 진행 바 (점수 시각화) */}
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
            <span>점수</span>
            <span>{quiz.score}% 달성</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${scoreInfo.bgColor} transition-all duration-500 rounded-full`}
              style={{ width: `${quiz.score}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
