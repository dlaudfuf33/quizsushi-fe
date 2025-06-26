import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { QuizAPI } from "@/lib/api/quiz.api";
import { getCookieHeader } from "@/lib/serverUtils";
import QuizDetailClientPage from "./clientPage";

interface QuizPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata(
  props: Promise<QuizPageProps>
): Promise<Metadata> {
  const { params } = await props;
  const id = params.id;

  try {
    const quiz = await QuizAPI.getQuizById(id);
    if (!quiz) throw new Error("퀴즈 없음");

    return {
      title: `${quiz.title} - QuizSushi`,
      description:
        quiz.description ||
        `${quiz.title} 퀴즈를 풀어보세요. ${quiz.title}의 ${quiz.questions.length}개의 문제가 준비되어 있습니다.`,
      openGraph: {
        title: `${quiz.title} - QuizSushi`,
        description:
          quiz.description || `${quiz.title} 퀴즈를 만들고 풀어보세요.`,
        images: [
          {
            url: "https://quizsushi.com/og-quiz-image.jpg",
            width: 1200,
            height: 630,
            alt: quiz.title,
          },
        ],
        type: "website",
        url: `https://quizsushi.com/quiz/${id}`,
      },
      twitter: {
        card: "summary_large_image",
        title: `${quiz.title} - QuizSushi`,
        description: quiz.description || `${quiz.title} 퀴즈를 풀어보세요.`,
        images: ["https://quizsushi.com/og-quiz-image.jpg"],
      },
      alternates: {
        canonical: `https://quizsushi.com/quiz/${id}`,
      },
    };
  } catch (error) {
    return {
      title: "퀴즈를 찾을 수 없습니다 - QuizSushi",
      description: "요청하신 퀴즈를 찾을 수 없습니다.",
    };
  }
}

export default async function Page(props: Promise<QuizPageProps>) {
  const { params } = await props;
  const cookie = await getCookieHeader();

  try {
    const quiz = await QuizAPI.getQuizById(params.id, cookie);
    if (!quiz) throw new Error("퀴즈 없음");

    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <QuizDetailClientPage quizData={quiz} />
      </div>
    );
  } catch (error) {
    console.error("퀴즈 페이지 로딩 실패:", error);
    notFound();
  }
}
