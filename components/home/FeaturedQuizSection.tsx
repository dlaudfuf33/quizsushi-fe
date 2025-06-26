"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FeaturedQuizCard } from "@/components/quiz/category/FeaturedQuizCard";
import { QuizCardSkeleton } from "@/components/skeleton/QuizCardSkeleton";

interface Props {
  featuredQuizzes: any[];
  popularQuizzes: any[];
}

export function FeaturedQuizSection({
  featuredQuizzes,
  popularQuizzes,
}: Props) {
  const [activeTab, setActiveTab] = useState("featured");

  // 퀴즈 데이터가 없을 경우 스켈레톤 UI 표시
  const renderQuizCards = (quizzes: any[]) => {
    if (!quizzes || quizzes.length === 0) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <QuizCardSkeleton key={i} />
          ))}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((quiz) => (
          <FeaturedQuizCard key={quiz.id} quiz={quiz} />
        ))}
      </div>
    );
  };

  return (
    <section className="py-12">
      <div className="container px-4 mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold">추천 퀴즈</h2>
            <TabsList>
              <TabsTrigger
                value="featured"
                className="data-[state=active]:bg-[#FFA07A] data-[state=active]:text-white"
              >
                추천
              </TabsTrigger>
              <TabsTrigger
                value="popular"
                className="data-[state=active]:bg-[#FFA07A] data-[state=active]:text-white"
              >
                인기
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="featured" className="m-0">
            {renderQuizCards(featuredQuizzes)}
          </TabsContent>

          <TabsContent value="popular" className="m-0">
            {renderQuizCards(popularQuizzes)}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
