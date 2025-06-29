import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { CategoryCard } from "@/components/quiz/category/CategoryCard";
import { CategoryCardSkeleton } from "@/components/skeleton/CategoryCardSkeleton";
import { CategoryAPI } from "@/lib/api/category.api";

export async function CategorySection() {
  const introCategories = await CategoryAPI.getIntroductions();
  if (!introCategories) {
    return (
      <section className="py-12 border-b">
        <div className="container px-4 mx-auto">
          <SectionHeader />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[...Array(8)].map((_, i) => (
              <CategoryCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // 빈 배열인 경우 → 사용자 메시지 출력
  if (introCategories.length === 0) {
    return (
      <section className="py-12 border-b">
        <div className="container px-4 mx-auto">
          <SectionHeader />
          <p className="text-gray-500 dark:text-gray-400 text-center py-12">
            아직 등록된 카테고리가 없습니다.
          </p>
        </div>
      </section>
    );
  }

  // 정상 렌더링
  return (
    <section className="py-12 border-b">
      <div className="container px-4 mx-auto">
        <SectionHeader />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {introCategories.map((intro) => (
            <CategoryCard key={intro.id} category={{ ...intro }} />
          ))}
        </div>
      </div>
    </section>
  );
}

// 공통 헤더 분리
function SectionHeader() {
  return (
    <div className="flex justify-between items-center mb-8">
      <h2 className="text-2xl md:text-3xl font-bold">카테고리별 문제</h2>
      <Button asChild variant="ghost" className="gap-1">
        <Link href="/quiz/categories">
          모든 카테고리 <ArrowRight className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}
