"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";

interface AICharacterWindowProps {
  message: string;
  emoji: string;
  type: "created" | "progress" | "explain";
  displayDuration: number;
}

export default function AICharacterWindow({
  message,
  emoji,
  type,
  displayDuration,
}: AICharacterWindowProps) {
  const [visibleMessage, setVisibleMessage] = useState(message);

  useEffect(() => {
    setVisibleMessage(message);

    if (message && displayDuration > 0) {
      const timer = setTimeout(() => {
        setVisibleMessage("");
      }, displayDuration);

      return () => clearTimeout(timer);
    }
  }, [message, displayDuration]);

  const bgColors = {
    created: "bg-blue-50 dark:bg-blue-900/20",
    progress: "bg-green-50 dark:bg-green-900/20",
    explain: "bg-yellow-50 dark:bg-yellow-900/20",
  };

  const textColors = {
    created: "text-blue-800 dark:text-blue-200",
    progress: "text-green-800 dark:text-green-200",
    explain: "text-yellow-800 dark:text-yellow-200",
  };

  return (
    <Card className="h-full bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-2 border-purple-200 dark:border-purple-700">
      <CardContent className="h-full flex flex-col min-h-0">
        <div className="flex items-center justify-start mb-1">
          <h3 className="text-lg font-bold text-purple-800 dark:text-purple-200 flex items-center gap-2">
            🤖 AI 어시스턴트
          </h3>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-transparent">
          <div
            className={`flex items-start gap-4 p-4 rounded-lg ${bgColors[type]} animate-slide-in`}
          >
            {/* AI 캐릭터 아바타 */}
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-2xl shadow-lg animate-bounce-subtle">
                {emoji}
              </div>
            </div>

            {/* 말풍선 */}
            <div className="flex-1 relative">
              <div
                className={`${textColors[type]} bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-md relative border-2 border-gray-100 dark:border-gray-700`}
              >
                <div className="absolute -left-3 top-6 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-white dark:border-r-gray-800"></div>

                {visibleMessage ? (
                  <div className="text-base leading-relaxed">
                    {visibleMessage}
                  </div>
                ) : (
                  <div className="flex gap-1 mt-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
