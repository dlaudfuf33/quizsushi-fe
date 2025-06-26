export interface IntroductionCategory {
  id: number;
  title: string;
  description: string;
  count: number;
  icon: string;
}

export interface Category {
  id: string;
  title: string;
  icon?: string;
}

export interface CategoryListResponse {
  categories: Category[];
}
