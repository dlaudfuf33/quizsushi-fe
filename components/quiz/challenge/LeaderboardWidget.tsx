"use client";

import { useEffect, useState } from "react";
import { useSocketConnection } from "@/hooks/useSocketConnection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy } from "lucide-react";
import { LeaderboardEntry } from "@/types/ai-challenge.types";

export default function LeaderboardWidget() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);

  const handleMessage = (message: any) => {
    const data = message as LeaderboardEntry[];
    setEntries(data);
  };

  const { connect, disconnect, isConnected } = useSocketConnection(
    "leaderboard",
    handleMessage
  );

  useEffect(() => {
    fetch("/api/challenge/leaderboard/top?limit=10")
      .then((res) => res.json())
      .then((res) => setEntries(res.data as LeaderboardEntry[]))
      .catch(() => console.warn("초기 레더보드 불러오기 실패"));

    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  const getRankIcon = (index: number) => {
    const icons = ["🥇", "🥈", "🥉"];
    return icons[index] || `${index + 1}`;
  };

  const getRankColor = (index: number) => {
    const colors = [
      "text-yellow-600 dark:text-yellow-400",
      "text-gray-500 dark:text-gray-400",
      "text-amber-600 dark:text-amber-400",
    ];
    return colors[index] || "text-gray-700 dark:text-gray-300";
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          리더보드
          <Badge variant="outline" className="ml-auto">
            {isConnected ? "🟢" : "🔴"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {entries?.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Trophy className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>아직 참가자가 없습니다.</p>
            <p className="text-sm">첫 번째 챌린저가 되어보세요!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {Array.isArray(entries) &&
              entries.slice(0, 10).map((entry, index) => (
                <div
                  key={entry.memberId}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all hover:bg-gray-50 dark:hover:bg-gray-700 ${
                    index < 3
                      ? "bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20"
                      : ""
                  }`}
                >
                  {/* 순위 */}
                  <div
                    className={`text-2xl font-bold w-12 text-center ${getRankColor(
                      index
                    )}`}
                  >
                    {getRankIcon(index)}
                  </div>

                  {/* 아바타 */}
                  <Avatar className="w-12 h-12 border-2 border-primary/20">
                    <AvatarImage
                      src={entry.avatar || "/placeholder.svg"}
                      alt={entry.nickname}
                    />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">
                      {entry.nickname.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  {/* 사용자 정보 */}
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 dark:text-white truncate">
                      {entry.nickname}
                    </div>
                  </div>

                  {/* 점수 */}
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary">
                      {entry.bestScore.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      최고점수
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
