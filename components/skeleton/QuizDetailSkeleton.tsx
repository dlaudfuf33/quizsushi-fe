"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function QuizDetailSkeleton() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      {/* 헤더 스켈레톤 */}
      <Card className="mb-6">
        <CardHeader>
          <Skeleton className="h-8 w-3/4 mb-2" />
          <Skeleton className="h-5 w-full" />
        </CardHeader>
        <CardContent className="flex gap-2 mt-4">
          <Skeleton className="h-6 w-20 rounded-md" />
          <Skeleton className="h-6 w-24 rounded-md" />
        </CardContent>
      </Card>

      {/* 질문 카드 스켈레톤 */}
      {[...Array(3)].map((_, i) => (
        <Card key={i} className="mb-4">
          <CardHeader>
            <Skeleton className="h-5 w-2/3 mb-1" />
            <Skeleton className="h-4 w-1/3" />
          </CardHeader>
          <CardContent className="space-y-2">
            {[...Array(4)].map((_, j) => (
              <Skeleton key={j} className="h-10 w-full rounded-md" />
            ))}
          </CardContent>
        </Card>
      ))}

      {/* 하단 제출 버튼 */}
      <div className="flex justify-center mt-6">
        <Skeleton className="h-10 w-40 rounded-md" />
      </div>
    </div>
  );
}
