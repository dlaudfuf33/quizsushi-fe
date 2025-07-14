"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import LeaderboardWidget from "./LeaderboardWidget";
import { useState, useEffect } from "react";
import { ChallengeMessage, MatchingMessage } from "@/types/ai-challenge.types";
import { Swords } from "lucide-react";

interface MatchingScreenProps {
  isConnected: boolean;
  receivedMessages: (ChallengeMessage | MatchingMessage)[];
  onJoinMatching: () => void;
  onCancelMatching: () => void;
}

export default function MatchingScreen({
  isConnected,
  receivedMessages,
  onJoinMatching,
  onCancelMatching,
}: MatchingScreenProps) {
  const [dots, setDots] = useState("");
  const [matchingTime, setMatchingTime] = useState(0);

  // 매칭 중 애니메이션 효과
  useEffect(() => {
    const latest = receivedMessages.at(-1);
    const isMatching =
      latest && "status" in latest && latest.status === "MATCHING";

    if (isMatching) {
      const dotsInterval = setInterval(() => {
        setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
      }, 500);

      const timeInterval = setInterval(() => {
        setMatchingTime((prev) => prev + 1);
      }, 1000);

      return () => {
        clearInterval(dotsInterval);
        clearInterval(timeInterval);
      };
    } else {
      setDots("");
      setMatchingTime(0);
    }
  }, [receivedMessages]);

  const getStatusDisplay = () => {
    const latest = receivedMessages.at(-1);
    if (latest && "status" in latest && typeof latest.status === "string") {
      switch (latest.status) {
        case "MATCHING":
          return (
            <div className="relative overflow-hidden">
              {/* 배경 애니메이션 */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 animate-pulse opacity-10"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer opacity-20"></div>

              <Card className="border-2 border-blue-400 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 relative">
                <CardContent className="p-8 text-center">
                  <div className="space-y-6">
                    {/* 로딩 스피너 */}
                    <div className="relative mx-auto w-24 h-24">
                      <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
                      <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                      <div className="absolute inset-4 border-2 border-purple-400 rounded-full border-b-transparent animate-spin-reverse"></div>
                      <Swords className="absolute inset-0 m-auto w-8 h-8 text-blue-600 animate-pulse" />
                    </div>

                    {/* 매칭 텍스트 */}
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-blue-800 dark:text-blue-200">
                        함께할 도전자를 찾는 중{dots}
                      </h3>
                      <p className="text-blue-600 dark:text-blue-300">
                        {latest.noticeMessage ||
                          "다른 도전자를 기다리고 있습니다"}
                      </p>
                      <div className="text-sm text-gray-500">
                        매칭 시간: {Math.floor(matchingTime / 60)}:
                        {(matchingTime % 60).toString().padStart(2, "0")}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        case "MATCHED":
          return (
            <Card className="border-2 border-green-400 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30">
              <CardContent className="p-6 text-center">
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto bg-green-500 rounded-full flex items-center justify-center animate-bounce">
                    <Swords className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-green-800 dark:text-green-200">
                      매칭 성공!
                    </h3>
                    <p className="text-green-600 dark:text-green-300">
                      게임이 곧 시작됩니다...
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        case "CANCELLED":
          return (
            <Card className="border-2 border-red-400 bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/30 dark:to-pink-900/30">
              <CardContent className="p-6 text-center">
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-2xl text-white">❌</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-red-800 dark:text-red-200">
                      매칭 취소됨
                    </h3>
                    <p className="text-red-600 dark:text-red-300">
                      다시 매칭을 시도해보세요
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
      }
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 py-8 px-4 relative overflow-hidden">
      {/* 배경 효과 */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>

      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            ⚔️ AI CHALLENGE
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-200">
            [정보처리] AI 퀴즈챌린지
          </p>
        </div>

        {/* 매칭 상태 */}
        <div className="max-w-2xl mx-auto">{getStatusDisplay()}</div>

        {/* 컨트롤 버튼 */}
        <div className="flex justify-center gap-6">
          <Button
            onClick={onJoinMatching}
            disabled={isConnected}
            size="lg"
            className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200"
          >
            <Swords className="w-5 h-5 mr-2" />
            매칭 시작
          </Button>
          <Button
            onClick={onCancelMatching}
            variant="outline"
            disabled={!isConnected}
            size="lg"
            className="px-8 py-4 text-lg font-semibold border-2 hover:bg-red-500/10 hover:border-red-500 transform hover:scale-105 transition-all duration-200 bg-transparent"
          >
            매칭 취소
          </Button>
        </div>

        {/* 리더보드 */}
        <div className="max-w-4xl mx-auto">
          <LeaderboardWidget />
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        @keyframes spin-reverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        .animate-spin-reverse {
          animation: spin-reverse 1s linear infinite;
        }
      `}</style>
    </div>
  );
}
