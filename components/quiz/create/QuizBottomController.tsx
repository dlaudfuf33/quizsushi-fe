"use client";

import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, Save, Loader2 } from "lucide-react";
import type { QuestionData } from "@/types/quiz.types";

interface QuizBottomControllerProps {
  showScrollButtons: boolean;
  scrollToTop: () => void;
  scrollToBottom: () => void;
  onSave: () => void;
  isLoading: boolean;
  title: string;
  categoryId: string;
  questions: QuestionData[];
}

export function QuizBottomController({
  showScrollButtons,
  scrollToTop,
  scrollToBottom,
  onSave,
  isLoading,
  title,
  categoryId,
  questions,
}: QuizBottomControllerProps) {
  const isFormValid = title.trim() && categoryId && questions.length > 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 p-4 z-40">
      <div className="container mx-auto max-w-6xl flex items-center justify-between">
        {/* 스크롤 버튼들 */}
        {showScrollButtons && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={scrollToTop}
              className="h-10 w-10 p-0"
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={scrollToBottom}
              className="h-10 w-10 p-0"
            >
              <ArrowDown className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* 퀴즈 정보 */}
        <div className="flex-1 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {questions.length}개 문제 • {title || "제목 없음"}
          </p>
        </div>

        {/* 저장 버튼 */}
        <Button
          onClick={onSave}
          disabled={!isFormValid || isLoading}
          className={`h-12 px-6 ${
            isFormValid
              ? "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
              : "bg-gray-400 cursor-not-allowed"
          } text-white shadow-lg`}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              저장 중...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              퀴즈 생성하기
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
