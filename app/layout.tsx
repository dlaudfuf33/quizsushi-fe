import type React from "react";
import "@/app/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import ClientToastContainer from "@/components/ClientToastContainer";
import { TooltipProvider } from "@radix-ui/react-tooltip";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "QuizSushi - 문제를 맛있게 풀다",
  description:
    "정보처리기사, 프로그래밍, 데이터베이스 등 다양한 IT 분야의 문제를 풀고 만들고 공유하세요.",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <meta
          name="google-signin-client_id"
          content="153433419686-oj9uikp6mlr6svrgdvh1b6qgmjh1djnp.apps.googleusercontent.com"
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <TooltipProvider>
            {children}
            <ClientToastContainer />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
