"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import FloatingBubbles from "@/components/ui/FloatingBubbles";
import { useEffect, useState } from "react";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";

export default function Page() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const error = searchParams.get("error");

    if (error === "bad_credentials") {
      toast.error(`비밀번호가 올바르지 않습니다.`);
    } else if (error === "user_not_found") {
      toast.error(`존재하지 않는 계정입니다.`);
    } else if (error === "unknown") {
      toast.error(`로그인 중 오류가 발생했습니다.`);
    }
  }, []);

  return (
    <>
      <FloatingBubbles />
      <div
        className="min-h-screen flex items-center justify-center
                 bg-gradient-to-b from-primary/80 to-rice
                 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
      >
        <main className="w-full max-w-md px-4">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white text-2xl">🍣</span>
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold text-white">QuizSushi</h1>
            </div>
          </div>
          <Card
            className="bg-white/20 dark:bg-white/10 backdrop-blur-xl
                     border border-white/30 shadow-2xl ring-1 ring-white/20
                     hover:ring-white/40 transition-all duration-300"
          >
            <CardHeader>
              <CardTitle className="text-2xl text-black dark:text-white">
                로그인
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form
                action={`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/login`}
                method="POST"
                className="space-y-4"
              >
                {/* 계정 입력 */}
                <div className="space-y-2">
                  <label htmlFor="username" className="text-gray-300">
                    계정
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      placeholder="admin@quizsushi.com"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-orange-500"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* 비밀번호 입력 */}
                <div className="space-y-2">
                  <label htmlFor="password" className="text-gray-300">
                    비밀번호
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="비밀번호를 입력하세요"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-orange-500"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300"
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* 로그인 버튼 */}
                <Button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      로그인 중...
                    </div>
                  ) : (
                    "로그인"
                  )}
                </Button>
              </form>{" "}
            </CardContent>
            <CardFooter className="flex justify-center text-sm text-black dark:text-white/80">
              QuizSushi에 오신 것을 환영합니다!
            </CardFooter>
          </Card>
        </main>
      </div>
    </>
  );
}
