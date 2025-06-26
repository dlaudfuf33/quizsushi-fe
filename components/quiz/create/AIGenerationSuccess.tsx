"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Sparkles, ArrowRight, RotateCcw } from "lucide-react";

interface Props {
  isVisible: boolean;
  questionCount: number;
  topic: string;
  onViewQuestions: () => void;
  onGenerateMore: () => void;
  onClose: () => void;
}

export function AIGenerationSuccess({
  isVisible,
  questionCount,
  topic,
  onViewQuestions,
  onGenerateMore,
  onClose,
}: Props) {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => setShowContent(true), 300);
      return () => clearTimeout(timer);
    } else {
      setShowContent(false);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl">
        <CardContent className="p-8 text-center">
          {/* 성공 애니메이션 */}
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 bg-green-100 dark:bg-green-900/30 rounded-full animate-ping"></div>
            <div className="relative w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-white animate-bounce" />
            </div>
            <div className="absolute -top-2 -right-2">
              <Sparkles className="h-6 w-6 text-yellow-400 animate-spin" />
            </div>
          </div>

          {/* 성공 메시지 */}
          <div
            className={`transition-all duration-500 ${
              showContent
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              🎉 생성 완료!
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              "{topic}" 주제로{" "}
              <span className="font-semibold text-green-600 dark:text-green-400">
                {questionCount}개
              </span>
              의 퀴즈 문제가 성공적으로 생성되었습니다.
            </p>

            {/* 액션 버튼들 */}
            <div className="space-y-3">
              <Button
                onClick={onViewQuestions}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg h-12"
              >
                <ArrowRight className="h-4 w-4 mr-2" />
                문제 확인하기
              </Button>

              <div className="flex gap-2">
                <Button
                  onClick={onGenerateMore}
                  variant="outline"
                  className="flex-1 border-purple-200 text-purple-600 hover:bg-purple-50 dark:border-purple-700 dark:text-purple-400 dark:hover:bg-purple-900/20"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  추가 생성
                </Button>

                <Button
                  onClick={onClose}
                  variant="ghost"
                  className="flex-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  닫기
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
