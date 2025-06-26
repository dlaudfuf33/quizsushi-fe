import { CategoryAPI } from "@/lib/api/category.api";
import type { Category } from "@/types/category.types";
import CreateQuizClientPage from "./clientPage";

export default async function Page() {
  let categories: Category[] = [];

  try {
    categories = await CategoryAPI.getCategories();
  } catch (e) {
    console.error("카테고리 로딩 실패", e);
    categories = [];
  }

  return (
    <div>
      <CreateQuizClientPage categories={categories} />
    </div>
  );
}
