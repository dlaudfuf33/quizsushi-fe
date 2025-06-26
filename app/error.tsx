"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-800">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <div className="text-9xl text-gray-900 dark:text-gray-100">🍱</div>
          <h1 className="text-6xl font-bold text-gray-900 dark:text-gray-100">
            오류가 발생했습니다
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            서버에서 문제가 발생했습니다. 잠시 후 다시 시도해주세요.
          </p>

          {process.env.NODE_ENV === "development" && (
            <details className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-center w-full max-w-lg mx-auto">
              <summary className="text-xl cursor-pointer font-medium text-red-800 dark:text-red-200">
                개발자 정보 (개발 환경에서만 표시)
              </summary>
              <div
                className="mt-2 text-sm text-red-700 dark:text-red-300 max-h-48 overflow-auto 
                whitespace-pre-wrap break-words border rounded p-2"
              >
                <pre className="whitespace-pre-wrap break-words text-left text-sm">
                  {error.message}
                </pre>
              </div>
            </details>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={reset}
            className="bg-[#FFA07A] hover:bg-[#FFA07A]/80 text-white"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            다시 시도
          </Button>

          <Button variant="outline" asChild>
            <Link href="/" className="text-gray-900 dark:text-gray-100">
              <Home className="mr-2 h-4 w-4 text-gray-900 dark:text-gray-100" />
              홈으로 돌아가기
            </Link>
          </Button>
        </div>

        <div className="pt-8">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            문제가 계속 발생한다면{" "}
            <Link href="/contact" className="text-[#FFA07A] hover:underline">
              고객지원
            </Link>
            으로 문의해주세요.
          </p>
        </div>
      </div>
    </div>
  );
}
