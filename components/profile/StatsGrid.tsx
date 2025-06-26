"use client";

import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, PlusCircle, Target, TrendingUp } from "lucide-react";

interface StatsGridProps {
  stats: {
    totalQuizzesTaken: number;
    totalQuizzesCreated: number;
    averageScore: number;
    streak: number;
  };
}

export function StatsGrid({ stats }: StatsGridProps) {
  const statItems = [
    {
      label: "푼 퀴즈",
      value: stats.totalQuizzesTaken,
      icon: BookOpen,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      label: "만든 퀴즈",
      value: stats.totalQuizzesCreated,
      icon: PlusCircle,
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-900/20",
    },
    {
      label: "평균 점수",
      value: `${stats.averageScore}%`,
      icon: Target,
      color: "text-[#FFA07A]",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
    },
    {
      label: "연속 학습",
      value: `${stats.streak}일`,
      icon: TrendingUp,
      color: "text-red-500",
      bgColor: "bg-red-50 dark:bg-red-900/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((item, index) => (
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
  );
}
