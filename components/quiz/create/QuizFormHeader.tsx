import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";
import type { Category } from "@/types/category.types";

interface Props {
  mode?: string;
  questionCount: number;
  selectedCategory: string;
  categories: Category[];
}

export function QuizFormHeader({
  mode = "create",
  questionCount,
  selectedCategory,
  categories,
}: Props) {
  // 카테고리 ID로 카테고리 제목 찾기
  const getCategoryTitle = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    return category?.title || "카테고리 미선택";
  };

  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-gradient-to-r from-[#FFA07A] to-[#FF8C69] rounded-lg shadow-lg">
          <BookOpen className="h-5 w-5 text-white" />
        </div>
        <div>
          {mode === "create" ? (
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              퀴즈 만들기
            </h1>
          ) : (
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              퀴즈 수정
            </h1>
          )}

          <p className="text-sm text-gray-600 dark:text-gray-300">
            나만의 퀴즈를 만들어 지식을 공유해보세요
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Badge variant="information" className="text-base">
            {selectedCategory
              ? getCategoryTitle(selectedCategory)
              : "카테고리 미선택"}
          </Badge>
          <Badge variant="information" className="text-base">
            {questionCount} 문항
          </Badge>
        </div>
      </div>
    </div>
  );
}
