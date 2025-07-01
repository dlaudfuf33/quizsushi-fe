"use client";

import React, { useState } from "react";
import { createPortal } from "react-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// size 파라미터 매핑
const DEFAULT_MEDIA_CLASS = "w-[480px] h-auto rounded my-2 cursor-pointer";

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
  const [zoomedMedia, setZoomedMedia] = useState<{
    src: string;
    type: "image" | "video";
  } | null>(null);

  return (
    <>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: () => null,
          img: ({ src = "", alt }) => {
            if (!isSafeUrl(String(src))) return null;

            const ext = getExtension(String(src));
            if (["mp4", "webm", "mov"].includes(ext)) {
              // 동영상
              return (
                <video
                  controls
                  src={src}
                  className={DEFAULT_MEDIA_CLASS}
                  onClick={() =>
                    setZoomedMedia({ src: String(src), type: "video" })
                  }
                />
              );
            }

            if (["mp3", "wav", "ogg", "m4a"].includes(ext)) {
              return <audio controls src={src} className="my-2" />;
            }

            // 이미지
            return (
              <img
                src={src}
                alt={alt || ""}
                className={DEFAULT_MEDIA_CLASS}
                loading="lazy"
                onClick={() =>
                  setZoomedMedia({ src: String(src), type: "image" })
                }
              />
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>

      {zoomedMedia &&
        createPortal(
          <div
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
            onClick={() => setZoomedMedia(null)}
          >
            {zoomedMedia.type === "image" ? (
              <img
                src={zoomedMedia.src}
                alt="확대 이미지"
                className="max-w-[90%] max-h-[90%] rounded shadow-xl"
              />
            ) : (
              <video
                controls
                src={zoomedMedia.src}
                className="max-w-[90%] max-h-[90%] rounded shadow-xl"
                autoPlay
              />
            )}
          </div>,
          document.body
        )}
    </>
  );
};

export default MarkdownRenderer;
