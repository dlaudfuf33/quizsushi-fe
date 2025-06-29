import type { Metadata } from "next";
import { HeroSection } from "@/components/home/HeroSection";
import { CategorySection } from "@/components/home/CategorySection";

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
        url: "https://minio.cmdlee.com/quizsushi/public/default/profiles/egg.webp",
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
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <main>
        <HeroSection />
        <CategorySection />
      </main>
    </div>
  );
}
