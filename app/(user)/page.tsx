import type { Metadata } from "next";
import { HeroSection } from "@/components/home/HeroSection";
import { CategorySection } from "@/components/home/CategorySection";
import { CategoryAPI } from "@/lib/api/category.api";

export const metadata: Metadata = {
  title: "QuizSushi - 문제를 맛있게 풀다",
  description:
    "다양한 분야의 시험 문제를 공유하고 풀어볼 수 있는 퀴즈 플랫폼입니다. 정보처리기사, 토익, 전기기사 등 여러 분야의 문제를 준비했습니다.",
  openGraph: {
    title: "QuizSushi - 문제를 맛있게 풀다",
    description:
      "다양한 분야의 시험 문제를 공유하고 풀어볼 수 있는 퀴즈 플랫폼입니다.",
    images: [
      {
        url: "https://quizsushi.cmdlee.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "QuizSushi",
      },
    ],
    type: "website",
    url: "https://quizsushi.cmdlee.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "QuizSushi - 문제를 맛있게 풀다",
    description:
      "다양한 분야의 시험 문제를 공유하고 풀어볼 수 있는 퀴즈 플랫폼입니다.",
    images: ["https://quizsushi.cmdlee.com/og-image.jpg"],
  },
  alternates: {
    canonical: "https://quizsushi.cmdlee.com",
  },
};

export default async function HomePage() {
  // 서버에서 데이터 미리 불러오기
  const introCategories = await fetchIntroductionCategories();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <main>
        <HeroSection />
        <CategorySection props={introCategories} />
      </main>
    </div>
  );
}

async function fetchIntroductionCategories() {
  try {
    const categories = await CategoryAPI.getIntroductions();
    return categories;
  } catch (error) {
    console.error("소개카테고리 불러오기 실패:", error);
    return [];
  }
}
