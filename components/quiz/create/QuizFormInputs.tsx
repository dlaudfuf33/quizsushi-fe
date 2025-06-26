"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Category } from "@/types/category.types";

interface Props {
  mode?: string;
  title: string;
  setTitle?: (value: string) => void;
  categories: Category[];
  category?: Category;
  categoryId?: string;
  setCategoryId: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
}

export function QuizFormInputs({
  mode = "create",
  title,
  setTitle,
  category,
  categoryId,
  setCategoryId,
  description,
  setDescription,
  categories,
}: Props) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 mb-6">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label
            htmlFor="title"
            className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
          >
            퀴즈 제목 <span className="text-red-500 ml-1">*</span>
          </Label>
          {mode === "create" ? (
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle?.(e.target.value)}
              placeholder="퀴즈 제목을 입력하세요"
              className="h-10 text-sm border-gray-200 dark:border-gray-600 focus:border-[#FFA07A] focus:ring-[#FFA07A]"
            />
          ) : (
            <p className="h-10 text-sm px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600">
              {title}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="category"
            className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
          >
            카테고리 <span className="text-red-500 ml-1">*</span>
          </Label>
          {mode === "create" ? (
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger
                id="category"
                className="h-10 text-sm border-gray-200 dark:border-gray-600 focus:border-[#FFA07A]"
              >
                <SelectValue placeholder="카테고리 선택" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <p className="h-10 text-sm px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600">
              {category?.title}
            </p>
          )}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label
            htmlFor="description"
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            퀴즈 설명
          </Label>
          <Input
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="간단한 설명을 입력하세요"
            className="h-10 text-sm border-gray-200 dark:border-gray-600 focus:border-[#FFA07A] focus:ring-[#FFA07A]"
          />
        </div>
      </div>
    </div>
  );
}
