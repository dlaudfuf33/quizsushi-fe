"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import {
  Moon,
  Sun,
  BookOpen,
  Edit3,
  User,
  X,
  Menu,
  Trophy,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export function SushiHeader() {
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user, isLoggedIn, logout } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header
      className="fixed top-0 z-50 w-full border-b bg-[#F4F4F4]
      dark:bg-gray-900 dark:border-gray-800 backdrop-blur-md"
    >
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🍣</span>
            <span className="font-bold text-xl bg-gradient-to-r  from-primary to-secondary bg-clip-text text-transparent">
              QuizSushi
            </span>
          </Link>
          <span className="hidden md:inline-block text-xs text-gray-500 dark:text-gray-400 ml-2">
            문제를 맛있게 풀다
          </span>
        </div>

        {/* 데스크톱 메뉴 */}
        <nav className="hidden md:flex items-center gap-1">
          <Button asChild variant="ghost" size="sm">
            <Link href="/quiz/challenge">
              <Trophy className="mr-2 h-4 w-4" /> 챌린지
            </Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/quiz/categories">
              <BookOpen className="mr-2 h-4 w-4" /> 문제 풀기
            </Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/quiz/create">
              <Edit3 className="mr-2 h-4 w-4" /> 문제 만들기
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="ml-1"
            disabled={!mounted}
          >
            {!mounted ? (
              <div className="h-5 w-5" />
            ) : theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {isLoggedIn ? (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/profile">내 정보 </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout} className="text-red-500">
                    로그아웃
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/login" className="cursor-pointer">
                      로그인
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>

      <div className="md:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* 모바일 메뉴 */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-white dark:bg-gray-900 dark:border-gray-800">
          <nav className="flex flex-col p-4 space-y-4">
            <Link
              href="/quiz/challenge"
              className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-[#FFA07A] dark:hover:text-[#FFA07A] transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <Trophy className="h-5 w-5" /> 챌린지
            </Link>
            <Link
              href="/quiz/categories"
              className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-[#FFA07A] dark:hover:text-[#FFA07A] transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <BookOpen className="h-5 w-5" /> 문제 풀기
            </Link>
            <Link
              href="/quiz/create"
              className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-[#FFA07A] dark:hover:text-[#FFA07A] transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <Edit3 className="h-5 w-5" /> 문제 만들기
            </Link>

            {isLoggedIn ? (
              <Link
                href="/mypage"
                className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-[#FFA07A] dark:hover:text-[#FFA07A] transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <User className="h-5 w-5" /> 내 정보
              </Link>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-[#FFA07A] dark:hover:text-[#FFA07A] transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <User className="h-5 w-5" /> 로그인
              </Link>
            )}

            <div className="flex items-center justify-between pt-2 border-t">
              {mounted && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleTheme}
                  className="text-gray-700 dark:text-gray-300"
                >
                  {theme === "dark" ? (
                    <div className="flex items-center gap-2">
                      <Sun className="h-4 w-4" />
                      <span>라이트 모드</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Moon className="h-4 w-4" />
                      <span>다크 모드</span>
                    </div>
                  )}
                </Button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
