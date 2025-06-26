"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoginForm } from "@/components/auth/LoginForm";
import { useRouter } from "next/navigation";
import FloatingBubbles from "@/components/ui/FloatingBubbles";
import { useEffect } from "react";
import { toast } from "react-toastify";

export default function Page() {
  const router = useRouter();
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const error = searchParams.get("error");
    if (error != null || error != undefined) {
      if (error === "banned") {
        toast.error(`정지된 회원입니다.`);
      } else {
        toast.error(`로그인 중 오류가 발생했습니다.`);
      }
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
              <CardDescription className="text-base text-black dark:text-white">
                아래 소셜 계정으로 간편하게 로그인하세요
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LoginForm />
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
