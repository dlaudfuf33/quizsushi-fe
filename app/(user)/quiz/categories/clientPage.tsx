"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FeaturedQuizCard } from "@/components/quiz/category/FeaturedQuizCard";
import { Search, Filter, Grid3X3, List } from "lucide-react";
import type { QuizSummary } from "@/types/quiz.types";
import { Category } from "@/types/category.types";
import { QuizAPI } from "@/lib/api/quiz.api";
import { FeaturedQuizCardSkeleton } from "@/components/skeleton/FeaturedQuizCardSkeleton";
import BackButton from "@/components/ui/back-button";
import InfiniteScroll from "react-infinite-scroll-component";

interface Props {
  categories: Category[];
}

export default function CategoriesClientPage({ categories }: Props) {
  const searchParams = useSearchParams();
  const rawCategoryId = searchParams.get("categoryId");
  const defaultCategoryId = rawCategoryId ?? "all";

  // 컴포넌트 내부 상수 선언
  const router = useRouter();
  const pathname = usePathname();
  const categoryFromQuery = searchParams.get("id") || defaultCategoryId;
  const initialCategoryRef = useRef(categoryFromQuery);

  // useState, useRef 선언
  const [activeTab, setActiveTab] = useState(initialCategoryRef.current);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<
    "rating" | "newest" | "views" | "solved" | "average"
  >("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [quizzes, setQuizzes] = useState<QuizSummary[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [searchType, setSearchType] = useState<"title" | "author">("title");
  const [hasMore, setHasMore] = useState(true);
  const debounceKeyRef = useRef("");

  useEffect(() => {
    const key = `${activeTab}-${searchQuery}-${sortBy}-${page}`;
    debounceKeyRef.current = key;

    const handler = setTimeout(async () => {
      const currentKey = debounceKeyRef.current;

      if (page === 0) setIsLoading(true);

      const payload = {
        page,
        size: 9,
        categoryId: activeTab === "all" ? undefined : Number(activeTab),
        searchQuery: searchQuery || undefined,
        searchType,
        sort: sortBy,
      };

      const res = await QuizAPI.getQuizList(payload);

      // 결과가 최신 요청인 경우만 적용
      if (debounceKeyRef.current === currentKey) {
        if (page === 0) {
          setQuizzes(res.quizzes);
        } else {
          const existingIds = new Set(quizzes.map((q) => q.id));
          const filteredNew = res.quizzes.filter((q) => !existingIds.has(q.id));
          setQuizzes((prev) => [...prev, ...filteredNew]);
        }

        setTotalPages(res.totalPages);
        setHasMore(page < res.totalPages);
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [activeTab, searchQuery, sortBy, page, searchType]);

  useEffect(() => {
    // 페이지 초기화 후 한 번만 요청
    setPage(0);
    setHasMore(true);
    setIsLoading(true);
    setQuizzes([]);
    debounceKeyRef.current = `${activeTab}-${searchQuery}-${sortBy}-0`;
  }, [activeTab, searchQuery, sortBy, searchType]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors ">
      <main className="container mx-auto py-12 px-4">
        <BackButton />

        {/* 헤더 영역 */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-700">
            문제 탐색
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto transition-colors ">
            다양한 카테고리의 문제를 찾아보고 풀어보세요.
          </p>
        </div>

        {/* 검색/필터 영역 */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex flex-1 gap-3">
              {/* 검색 기준 선택 Select */}
              <Select
                value={searchType}
                onValueChange={(val) =>
                  setSearchType(val as "title" | "author")
                }
              >
                <SelectTrigger className="w-[100px] h-12 bg-orange-50/50 dark:bg-slate-700/50 border-orange-200 dark:border-slate-600 rounded-xl transition-all duration-300">
                  <SelectValue placeholder="검색 기준" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-800 border-orange-200 dark:border-slate-600 rounded-xl">
                  <SelectItem value="title">제목</SelectItem>
                  <SelectItem value="author">작성자</SelectItem>
                </SelectContent>
              </Select>
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500 transition-colors " />
                <Input
                  placeholder="문제 또는 카테고리 검색..."
                  className="pl-12 h-12 bg-orange-50/50 dark:bg-slate-700/50 border-orange-200 dark:border-slate-600 focus:border-orange-500 dark:focus:border-orange-400 rounded-xl transition-all duration-300 text-gray-900 dark:text-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Select
                value={sortBy}
                onValueChange={(val) =>
                  setSortBy(
                    val as "rating" | "newest" | "views" | "solved" | "average"
                  )
                }
              >
                <SelectTrigger className="w-[180px] h-12 ...">
                  <Filter className="..." />
                  <SelectValue placeholder="정렬 기준" />
                </SelectTrigger>
                <SelectContent className="...">
                  <SelectItem value="newest">최신순</SelectItem>
                  <SelectItem value="rating">평점순</SelectItem>
                  <SelectItem value="views">조회수순</SelectItem>
                  <SelectItem value="solved">풀이횟수순</SelectItem>
                  <SelectItem value="average">평균점수순</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex bg-orange-100/80 dark:bg-slate-700/80 rounded-xl p-1 transition-all ">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setViewMode("grid")}
                  className={`h-10 w-10 rounded-lg transition-all duration-200 ${
                    viewMode === "grid"
                      ? "bg-white dark:bg-slate-600 shadow-sm text-orange-600 dark:text-orange-400"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setViewMode("list")}
                  className={`h-10 w-10 rounded-lg transition-all duration-200 ${
                    viewMode === "list"
                      ? "bg-white dark:bg-slate-600 shadow-sm text-orange-600 dark:text-orange-400"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* 탭 영역 */}
        <Tabs
          value={activeTab}
          onValueChange={(val) => {
            setActiveTab(val);
            requestAnimationFrame(() => {
              const params = new URLSearchParams(searchParams.toString());
              if (val === "0") {
                params.delete("id");
              } else {
                params.set("id", val);
              }

              const query = params.toString();
              router.replace(`${pathname}${query ? `?${query}` : ""}`);
            });
          }}
          className="w-full"
        >
          <TabsList className="mb-8 w-full justify-start overflow-x-auto bg-orange-100/80 dark:bg-slate-700/80 p-1 rounded-xl transition-all ">
            {[{ id: "all", title: "전체" }, ...categories].map((cat) => (
              <TabsTrigger
                key={cat.id}
                value={String(cat.id)}
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-600 data-[state=active]:text-orange-600 dark:data-[state=active]:text-orange-400 data-[state=active]:shadow-sm text-gray-600 dark:text-gray-300 font-semibold rounded-lg transition-all duration-200 whitespace-nowrap"
              >
                {cat.title}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* 퀴즈 목록 */}
          {[{ id: "all", title: "전체" }, ...categories].map((cat) => (
            <TabsContent key={cat.id} value={String(cat.id)} className="m-0">
              {isLoading ? (
                // 첫 로딩 시 스켈레톤
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                      : "space-y-6"
                  }
                >
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={`loading-${i}`}>
                      <FeaturedQuizCardSkeleton />
                    </div>
                  ))}
                </div>
              ) : quizzes.length > 0 ? (
                <InfiniteScroll
                  dataLength={quizzes.length}
                  next={() => setPage((prev) => prev + 1)}
                  hasMore={hasMore}
                  loader={
                    <div className="text-center text-gray-400 mt-4 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                        불러오는 중...
                      </div>
                    </div>
                  }
                >
                  <div
                    className={
                      viewMode === "grid"
                        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        : "space-y-6"
                    }
                  >
                    {quizzes.map((quiz, index) => (
                      <div
                        key={quiz.id}
                        className={`transition-opacity duration-500 delay-[${
                          index * 100
                        }ms] opacity-0 animate-fadeIn`}
                      >
                        <FeaturedQuizCard quiz={quiz} viewMode={viewMode} />
                      </div>
                    ))}
                  </div>
                </InfiniteScroll>
              ) : (
                // 결과 없음
                <div className="text-center py-20">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-orange-100 dark:bg-slate-700 flex items-center justify-center transition-colors ">
                    <Search className="w-10 h-10 text-orange-500 dark:text-orange-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 transition-colors ">
                    검색 결과가 없습니다
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 transition-colors ">
                    다른 검색어나 카테고리를 시도해보세요
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("");
                      setActiveTab("all");
                    }}
                    className="border-orange-200 dark:border-slate-600 hover:bg-orange-50 dark:hover:bg-slate-700 rounded-xl transition-all duration-300"
                  >
                    필터 초기화
                  </Button>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  );
}
