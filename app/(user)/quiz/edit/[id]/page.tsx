export const dynamic = "force-dynamic";
import { CategoryAPI } from "@/lib/api/category.api";
import { QuizAPI } from "@/lib/api/quiz.api";
import { getCookieHeader } from "@/lib/serverUtils";
import { notFound } from "next/navigation";
import EditQuizClientPage from "./clientPage";

interface QuizPageProps {
  params: {
    id: string;
  };
}

export default async function Page({ params }: QuizPageProps) {
  const cookie = await getCookieHeader();

  try {
    const quiz = await QuizAPI.getQuizById(params.id, cookie);
    const categories = await CategoryAPI.getCategories();
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <EditQuizClientPage categories={categories} initQuiz={quiz} />
      </div>
    );
  } catch (error) {
    notFound();
  }
}
