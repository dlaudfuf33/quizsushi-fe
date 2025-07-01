import type React from "react";
import "@/app/globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import ClientToastContainer from "@/components/ClientToastContainer";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { Metadata } from "next";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "QuizSushi - 문제를 맛있게 풀다",
  description:
    "다양한 분야의 시험 문제를 공유하고 풀어볼 수 있는 퀴즈 플랫폼입니다. 정보처리기사, 토익, 전기기사 등 여러 분야의 문제를 준비했습니다.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "QuizSushi - 문제를 맛있게 풀다",
    description:
      "다양한 분야의 시험 문제를 공유하고 풀어볼 수 있는 퀴즈 플랫폼입니다.",
    images: [
      {
        url: "https://minio.cmdlee.com/quizsushi/public/default/profiles/egg.webp",
        width: 1200,
        height: 630,
        alt: "QuizSushi",
      },
    ],
    type: "website",
    url: "https://quizsushi.cmdlee.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "QuizSushi - 문제를 맛있게 풀다",
    description:
      "다양한 분야의 시험 문제를 공유하고 풀어볼 수 있는 퀴즈 플랫폼입니다.",
  },
  alternates: {
    canonical: "https://quizsushi.cmdlee.com",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <Head>
        <meta
          name="google-signin-client_id"
          content="153433419686-oj9uikp6mlr6svrgdvh1b6qgmjh1djnp.apps.googleusercontent.com"
        />
        <link rel="icon" type="image/png" href="/favicon.png" />
      </Head>
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
