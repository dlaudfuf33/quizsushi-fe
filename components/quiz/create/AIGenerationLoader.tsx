"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Bot, Sparkles, Brain, Lightbulb, Clock, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  isGenerating: boolean;
  questionCount: number;
  topic: string;
  onCancel?: () => void;
}

const funnySteps = [
  "🧠 AI가 방금 눈을 떴습니다... 커피를 찾는 중이에요.",
  "📚 인터넷을 뒤지고 있어요. 위키백과랑 싸우는 중...",
  "🎯 첫 번째 문제를 쓰다가 자꾸 삼행시로 만들려 해요.",
  "😵‍💫 지금... 정답을 만든다면서 자기가 헷갈려해요.",
  "🤖 '이 문제... 너도 풀 수 있겠어?' 라며 도전장을 날리는 중.",
  "🎨 해설을 쓰는데 시처럼 운을 맞추려고 하고 있어요.",
  "🍣 퀴즈스시 셰프 AI가 간장을 살짝 뿌리는 중...",
  "🚀 거의 다 됐어요. 로딩바가 도망가지만 붙잡았어요.",
  "🥁 마무리 중... 드럼 롤... 두구두구...",
  "🎉 퀴즈 완성! AI가 자기 작품에 감탄하고 있어요.",
];

const funFacts = [
  "🤖 AI는 초당 수백만 개의 단어를 처리할 수 있어요",
  "📖 좋은 퀴즈 문제는 학습 효과를 3배 높입니다",
  "🧩 객관식 문제는 1905년에 처음 개발되었어요",
  "💭 인간의 뇌는 하루에 35,000번의 결정을 내립니다",
  "🎓 퀴즈를 푸는 것은 기억력을 20% 향상시켜요",
  "⚡ AI가 문제를 만드는 동안 약 1억 번의 계산을 해요",
];

const STEP_DURATION = 7;

export function AIGenerationLoader({
  isGenerating,
  questionCount,
  topic,
  onCancel,
}: Props) {
  const [currentFact, setCurrentFact] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const currentFunnyStep = Math.min(
    Math.floor(timeElapsed / STEP_DURATION),
    funnySteps.length - 1
  );

  useEffect(() => {
    if (!isGenerating) {
      setCurrentFact(0);
      setTimeElapsed(0);
      return;
    }

    // 재미있는 사실 로테이션 (8초마다)
    const factInterval = setInterval(() => {
      setCurrentFact((prev) => (prev + 1) % funFacts.length);
    }, 8000);

    // 경과 시간 업데이트
    const timeInterval = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(factInterval);
      clearInterval(timeInterval);
    };
  }, [isGenerating]);

  if (!isGenerating) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl">
        <CardContent className="p-8">
          {/* 메인 로딩 애니메이션 */}
          <div className="text-center mb-6">
            <div className="relative w-20 h-20 mx-auto mb-4">
              {/* 회전하는 외부 링 */}
              <div className="absolute inset-0 border-4 border-purple-200 dark:border-purple-800 rounded-full animate-spin">
                <div className="absolute top-0 left-1/2 w-2 h-2 bg-purple-500 rounded-full transform -translate-x-1/2 -translate-y-1"></div>
              </div>

              {/* 중앙 아이콘 */}
              <div className="absolute inset-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Bot className="h-8 w-8 text-white animate-pulse" />
              </div>

              {/* 반짝이는 효과 */}
              <div className="absolute -top-1 -right-1">
                <Sparkles className="h-4 w-4 text-yellow-400 animate-bounce" />
              </div>
            </div>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              AI가 퀴즈를 생성하고 있어요
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              "{topic}" 주제로 {questionCount}개의 문제를 만들고 있습니다
            </p>
          </div>

          {/* 경과 시간 */}
          <div className="flex items-center justify-center gap-2 mb-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm text-blue-800 dark:text-blue-200">
              경과 시간: {formatTime(timeElapsed)}
            </span>
          </div>

          {/* 현재 작업 상태 */}
          <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="h-4 w-4 text-purple-600 dark:text-purple-400 animate-pulse" />
              <span className="text-sm font-medium text-purple-800 dark:text-purple-200">
                현재 작업
              </span>
            </div>
            <p className="text-sm text-purple-700 dark:text-purple-300 animate-fade-in">
              {funnySteps[currentFunnyStep]}
            </p>
          </div>

          {/* 재미있는 사실 */}
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                알고 계셨나요?
              </span>
            </div>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              {funFacts[currentFact]}
            </p>
          </div>

          <div className="flex justify-center gap-2 mt-4">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-[0s]" />
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-[0.2s]" />
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-[0.4s]" />
          </div>

          <div className="flex gap-3 justify-center mt-7">
            <Button
              variant="outline"
              onClick={onCancel}
              className="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-900/20"
            >
              <X className="h-4 w-4 mr-2" />
              생성 중단
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
