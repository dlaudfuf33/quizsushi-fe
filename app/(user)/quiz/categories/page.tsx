export const dynamic = "force-dynamic";

import { CategoryAPI } from "@/lib/api/category.api";
import { Category } from "@/types/category.types";
import CategoriesClientPage from "./clientPage";

export const metadata = {
  title: "카테고리별 문제 - QuizSushi",
  description: "카테고리별로 다양한 문제를 탐색해보세요.",
};

export default async function CategoriesPage() {
  const categories: Category[] = await CategoryAPI.getCategories();
  return <CategoriesClientPage categories={categories} />;
}
