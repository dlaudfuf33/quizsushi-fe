"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// size 파라미터 매핑
const sizeMap = {
  s: "w-[120px] h-auto",
  m: "w-[240px] h-auto",
  lg: "w-[480px] h-auto",
  xl: "w-full max-w-screen-md h-auto",
};

// XSS 방지
function isSafeUrl(url: string): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url, "https://example.com");
    return (
      ["https:", "http:"].includes(parsed.protocol) ||
      url.startsWith("data:image/")
    );
  } catch {
    return false;
  }
}

// 확장자 추출
function getExtension(url: string): string {
  try {
    const u = new URL(url);
    const pathname = u.pathname;
    return pathname.split(".").pop()?.toLowerCase() || "";
  } catch {
    return "";
  }
}

const MarkdownRenderer = ({ content }: { content: string }) => {
  return (
    <>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: () => null,
          img: ({ src = "", alt }) => {
            if (!isSafeUrl(src as string)) return null;

            const url = new URL(src as string);
            const ext = getExtension(src as string);
            const size = url.searchParams.get("size") ?? "m";
            const sizeClass =
              sizeMap[size as keyof typeof sizeMap] ?? sizeMap["m"];

            if (["mp4", "webm", "mov"].includes(ext)) {
              return (
                <video
                  controls
                  src={src}
                  className={`rounded my-2 ${sizeClass}`}
                  playsInline
                />
              );
            }

            if (["mp3", "wav", "ogg", "m4a"].includes(ext)) {
              return <audio controls src={src} className="my-2" />;
            }

            return (
              <img
                src={src}
                alt={alt || ""}
                className={`rounded my-2 ${sizeClass}`}
                loading="lazy"
              />
            );
          },
          p: ({ children }) => <>{children}</>,
        }}
      >
        {content}
      </ReactMarkdown>
    </>
  );
};

export default MarkdownRenderer;
