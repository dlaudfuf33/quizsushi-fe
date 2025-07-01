"use client";

import type React from "react";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileJson, Upload, CheckCircle } from "lucide-react";

interface Props {
  onFileUpload: (file: File) => void;
}

export function FileUploader({ onFileUpload }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.name.endsWith(".json") || file.name.endsWith(".csv")) {
        setIsUploading(true);
        onFileUpload(file);
        setTimeout(() => setIsUploading(false), 1000);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.name.endsWith(".json") || file.name.endsWith(".csv")) {
        setIsUploading(true);
        onFileUpload(file);
        setTimeout(() => setIsUploading(false), 1000);
      }
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card
      className={`border-2 border-dashed p-8 text-center transition-all duration-300 ${
        isDragging
          ? "border-[#FFA07A] bg-[#FFA07A]/10 scale-105"
          : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
      } ${
        isUploading ? "border-green-400 bg-green-50 dark:bg-green-900/20" : ""
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center justify-center space-y-6">
        <div
          className={`rounded-full p-4 transition-colors ${
            isUploading
              ? "bg-green-100 dark:bg-green-900/30"
              : isDragging
              ? "bg-[#FFA07A]/20 dark:bg-[#FFA07A]/10"
              : "bg-gray-100 dark:bg-gray-800"
          }`}
        >
          {isUploading ? (
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
          ) : (
            <Upload
              className={`h-8 w-8 ${
                isDragging
                  ? "text-[#FFA07A]"
                  : "text-gray-600 dark:text-gray-400"
              }`}
            />
          )}
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {isUploading ? "업로드 완료!" : "파일 업로드"}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md">
            JSON 파일을 드래그하여 놓거나 클릭하여 업로드하세요
          </p>
        </div>

        <div className="flex gap-6 mt-6">
          <div className="flex flex-col items-center space-y-2">
            <div className="rounded-xl bg-[#FFA07A]/20 dark:bg-[#FFA07A]/10 p-3">
              <FileJson className="h-6 w-6 text-[#FFA07A]" />
            </div>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              JSON
            </span>
          </div>
        </div>

        <Button
          onClick={handleButtonClick}
          variant="outline"
          className="mt-6 border-[#FFA07A]/30 text-[#FFA07A] hover:bg-[#FFA07A]/10 dark:border-[#FFA07A]/40"
          disabled={isUploading}
        >
          {isUploading ? "업로드 중..." : "파일 선택하기"}
        </Button>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".json,.csv"
          className="hidden"
          placeholder="file"
        />
      </div>
    </Card>
  );
}
