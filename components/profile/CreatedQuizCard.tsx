"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  Edit3,
  Trash2,
  Star,
  Users,
  Calendar,
  BookOpen,
} from "lucide-react";

interface CreatedQuizCardProps {
  quiz: {
    id: number;
    title: string;
    category: string;
    questions: number;
    solvedCount: number;
    rating: number;
    createdAt: string;
  };
  index: number;
  onEdit: (id: string) => void;
  onView: (id: string) => void;
  onDelete: (id: string) => void;
}

export function CreatedQuizCard({
  quiz,
  index,
  onEdit,
  onView,
  onDelete,
}: CreatedQuizCardProps) {
  // 인기도에 따른 색상 및 아이콘 결정
  const getPopularityInfo = (solvedCount: number) => {
    if (solvedCount >= 100) {
      return {
        emoji: "🔥",
        label: "인기",
        bgColor: "from-red-400 to-pink-500",
        textColor: "text-red-600 dark:text-red-400",
        borderColor: "border-red-200 dark:border-red-800",
      };
    } else if (solvedCount >= 50) {
      return {
        emoji: "⭐",
        label: "주목",
        bgColor: "from-yellow-400 to-orange-500",
        textColor: "text-yellow-600 dark:text-yellow-400",
        borderColor: "border-yellow-200 dark:border-yellow-800",
      };
    } else if (solvedCount >= 20) {
      return {
        emoji: "👍",
        label: "좋음",
        bgColor: "from-green-400 to-teal-500",
        textColor: "text-green-600 dark:text-green-400",
        borderColor: "border-green-200 dark:border-green-800",
      };
    } else if (solvedCount >= 5) {
      return {
        emoji: "📈",
        label: "성장",
        bgColor: "from-blue-400 to-purple-500",
        textColor: "text-blue-600 dark:text-blue-400",
        borderColor: "border-blue-200 dark:border-blue-800",
      };
    } else {
      return {
        emoji: "🆕",
        label: "신규",
        bgColor: "from-gray-400 to-gray-600",
        textColor: "text-gray-600 dark:text-gray-400",
        borderColor: "border-gray-200 dark:border-gray-700",
      };
    }
  };

  const popularityInfo = getPopularityInfo(quiz.solvedCount);

  return (
    <Card className="hover:shadow-xl bg-white dark:bg-gray-800/80 border-gray-200 dark:border-gray-700  backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          {/* 왼쪽 콘텐츠 */}
          <div className="flex items-center gap-4 flex-1">
            {/* 인기도 아이콘 */}
            <div
              className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${popularityInfo.bgColor} flex items-center justify-center shadow-lg`}
            >
              <span className="text-2xl">{popularityInfo.emoji}</span>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-md">
                <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                  {index + 1}
                </span>
              </div>
            </div>

            {/* 퀴즈 정보 */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white truncate">
                  {quiz.title}
                </h3>
                <Badge
                  variant="outline"
                  className={`${popularityInfo.borderColor} ${popularityInfo.textColor} text-xs font-medium`}
                >
                  {popularityInfo.label}
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800"
                >
                  {quiz.category}
                </Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  <span>{quiz.questions}문항</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{quiz.solvedCount}회 풀이</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>{quiz.rating}점</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{quiz.createdAt}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 오른쪽 액션 버튼들 */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onView(quiz.id.toString())}
              className="hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-600 dark:hover:text-blue-400 "
            >
              <Eye className="w-4 h-4 mr-1" />
              보기
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(quiz.id.toString())}
              className="hover:bg-green-50 dark:hover:bg-green-900/20 hover:border-green-300 dark:hover:border-green-700 hover:text-green-600 dark:hover:text-green-400 "
            >
              <Edit3 className="w-4 h-4 mr-1" />
              수정
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(quiz.id.toString())}
              className="hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 dark:hover:border-red-700 hover:text-red-600 dark:hover:text-red-400 "
            >
              <Trash2 className="w-4 h-4 mr-1" />
              삭제
            </Button>
          </div>
        </div>

        {/* 하단 통계 바 */}
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
            <span>인기도</span>
            <span>
              {quiz.solvedCount > 0
                ? `${Math.min(100, (quiz.solvedCount / 100) * 100)}% 달성`
                : "아직 풀이 없음"}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${popularityInfo.bgColor} transition-all duration-500 rounded-full`}
              style={{
                width: `${Math.min(100, (quiz.solvedCount / 100) * 100)}%`,
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
