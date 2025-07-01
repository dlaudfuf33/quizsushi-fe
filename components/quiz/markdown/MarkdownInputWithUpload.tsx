"use client";

import React, { useRef, useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImageIcon } from "lucide-react";
import { UploadAPI } from "@/lib/api/upload";
import { toast } from "react-toastify";
import MarkdownRenderer from "@/components/quiz/markdown/MarkdownRenderer";
import { ALLOWED_EXTENSIONS } from "@/constants/allowedExtention";

interface Props {
  value?: string;
  onChange: (value: string | ((prev: string) => string)) => void;
  placeholder?: string;
  className?: string;
  label?: string;
  height?: number | string;
  mode: "edit" | "preview";
  uploadMode: "create" | "update";
  mediaKey?: string;
  variant?: "question" | "option" | "explanation";
}

// 마크다운 입력 및 이미지/비디오 업로드 기능을 포함한 컴포넌트
export function MarkdownInputWithUpload({
  value = "",
  onChange,
  placeholder,
  className,
  label,
  mode,
  uploadMode,
  mediaKey,
  variant,
}: Props) {
  // 숨겨진 파일 입력
  const fileInputRef = useRef<HTMLInputElement>(null);
  // textarea 참조
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  // 파일명 → 플레이스홀더 매핑
  const placeholderMap = useRef(new Map<string, string>());
  const [isDragging, setIsDragging] = useState(false);
  const [internalValue, setInternalValue] = useState(value || "");

  useEffect(() => {
    setInternalValue(value || "");
  }, [value]);

  // 입력값 수동 변경 처리
  const handleLocalChange = (next: string) => {
    setInternalValue(next);
    onChange(next);
  };

  // 기존 값을 기반으로 입력값을 변경 (replace 시 사용)
  const handleLocalReplace = (fn: (prev: string) => string) => {
    setInternalValue((prev) => {
      const updated = fn(prev);
      onChange(updated);
      return updated;
    });
  };

  // 이미지 아이콘 클릭 → 파일 선택창 열기
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // textarea 및 preview 스타일 동적 계산
  const computedTextareaClass = [
    "pr-10 border rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition",
    variant === "question" && "text-base min-h-[120px]",
    variant === "option" && "text-sm min-h-[30px] max-h-[40px]",
    variant === "explanation" && "text-sm min-h-[80px]",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const computedPreviewClass = [
    "border rounded-md p-4 prose max-w-none bg-gray-50 dark:bg-gray-700 dark:prose-invert overflow-y-auto",
    variant === "question" && "text-base",
    variant !== "question" && "text-sm",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // 확장자 추출 유틸
  const getExtension = (filename: string): string => {
    return filename.split(".").pop()?.split("?")[0]?.toLowerCase() || "";
  };

  // 공통 업로드 처리 함수
  const handleUploadFile = async (
    file: File,
    textarea: HTMLTextAreaElement,
    insertPlaceholder: (name: string, ta: HTMLTextAreaElement) => string,
    replace: (fn: (prev: string) => string) => void
  ) => {
    const ext = getExtension(file.name);
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      toast.error(`${ext}는 허용되지 않은 파일 형식입니다.`);
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      toast.error("50MB 이하 파일만 업로드할 수 있습니다.");
      return;
    }

    const placeholder = insertPlaceholder(file.name, textarea);
    const failed = `![failed ${file.name}…]()`;

    try {
      let url = "";

      if (uploadMode === "create") {
        url = await UploadAPI.uploadFiletoTmp(file);
      } else if (uploadMode === "update") {
        if (!mediaKey) {
          toast.error("mediaKey가 누락되었습니다.");
          return;
        }
        url = await UploadAPI.uploadFileToQuizFolder(file, mediaKey);
      }
      const finalMarkdown = `![${file.name}](${url})`;
      replace((prev) =>
        placeholder && prev.includes(placeholder)
          ? prev.replace(placeholder, finalMarkdown)
          : prev
      );
    } catch (error) {
      console.error("❗ 업로드 실패:", error);
      const status = (error as any)?.response?.status;
      toast.error(
        status === 413
          ? "파일이 너무 큽니다. 50MB 이하만 업로드 가능합니다."
          : "파일 업로드에 실패했습니다."
      );
      replace((prev) =>
        placeholder && prev.includes(placeholder)
          ? prev.replace(placeholder, failed)
          : prev
      );
    }
  };

  // 업로드 중 표시할 마크다운 플레이스홀더 삽입
  const insertPlaceholder = (
    fileName: string,
    textarea: HTMLTextAreaElement
  ): string => {
    const placeholder = `![Uploading ${fileName}…]()`;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    placeholderMap.current.set(fileName, placeholder);

    const before = value.substring(0, start);
    const after = value.substring(end);
    const next = before + `\n${placeholder}\n` + after;
    handleLocalChange(next);

    // 플레이스홀더 뒤로 커서 이동
    setTimeout(() => {
      textarea.focus();
      const before = value.substring(0, start);
      textarea.selectionStart = textarea.selectionEnd =
        before.length + placeholder.length + 2;
    }, 0);

    return placeholder;
  };

  // 드래그 앤 드롭 이미지/동영상 업로드 처리
  const handleDrop = async (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files || []);
    const textarea = textareaRef.current;
    if (!textarea) return;

    for (const file of files) {
      await handleUploadFile(
        file,
        textarea,
        insertPlaceholder,
        handleLocalReplace
      );
    }
  };
  // 클립보드 붙여넣기 시 이미지 파일 업로드 처리
  const handlePaste = async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const file = e.clipboardData.files?.[0];
    if (file) {
      await handleUploadFile(
        file,
        e.currentTarget,
        insertPlaceholder,
        handleLocalReplace
      );
    }
  };
  // 파일 선택창을 통한 이미지/비디오 업로드 처리
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const textarea = document.getElementById(
      "markdown-input"
    ) as HTMLTextAreaElement;
    if (!textarea) return;

    for (const file of files) {
      await handleUploadFile(
        file,
        textarea,
        insertPlaceholder,
        handleLocalReplace
      );
    }
  };

  return (
    <div className="space-y-2">
      {/* 라벨 렌더링 */}
      {label && (
        <Label className="text-center font-bold" htmlFor="markdown-input">
          {label}
        </Label>
      )}

      {/* <div onDragOver={(e) => e.preventDefault()} className="relative"> */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          setIsDragging(false);
          handleDrop(e);
        }}
        className={`relative ${
          isDragging ? "ring-2 ring-blue-400 bg-blue-50" : ""
        }`}
      >
        {mode === "edit" ? (
          <>
            {/* 마크다운 입력 textarea */}
            <Textarea
              id="markdown-input"
              value={internalValue}
              onChange={(e) => handleLocalChange(e.target.value)}
              onPaste={handlePaste}
              placeholder={placeholder}
              className={computedTextareaClass + " custom-height"}
              ref={textareaRef}
            />
            {/* 이미지 업로드 버튼 */}
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={handleUploadClick}
              className="absolute top-0 right-2"
              tabIndex={-1}
            >
              <ImageIcon className="w-2 h-2 text-gray-500" />
            </Button>
            {/* 숨겨진 파일 업로드 인풋 */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*,video/*,.gif,.mov,.webm,.mp4"
              onChange={handleFileChange}
              className="hidden"
              placeholder={placeholder || "내용을 입력하세요"}
              aria-label={label || placeholder || "markdown 입력"}
            />
          </>
        ) : (
          // 마크다운 미리보기
          <div className={computedPreviewClass + " custom-height"}>
            <MarkdownRenderer content={value} />
          </div>
        )}
      </div>
    </div>
  );
}
