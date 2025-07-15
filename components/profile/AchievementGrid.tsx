"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Achievement } from "@/types/profile.types";

interface AchievementGridProps {
  achievements: Achievement[];
}

export function AchievementGrid({ achievements }: AchievementGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {achievements.map((achievement) => (
        <Card
          key={achievement.id}
          className={`backdrop-blur-sm border-white/20 shadow-lg ${
            achievement.unlocked
              ? "bg-white/90 dark:bg-gray-800/90"
              : "bg-white/50 dark:bg-gray-800/50 opacity-60"
          }`}
        >
          <CardContent className="p-6 text-center">
            <div className="text-4xl mb-3">{achievement.icon}</div>
            <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">
              {achievement.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              {achievement.description}
            </p>
            {achievement.unlocked ? (
              <Badge className="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400">
                달성 완료
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400"
              >
                미달성
              </Badge>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
