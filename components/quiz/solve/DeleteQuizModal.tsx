"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Trash2, AlertTriangle, Lock } from "lucide-react";
import axios from "axios";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  quizTitle: string;
}
export function DeleteQuizModal({
  isOpen,
  onClose,
  onConfirm,
  quizTitle,
}: Props) {
  const [titleInput, setTitleInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (titleInput.trim() !== quizTitle.trim()) {
        setError("제목이 정확히 일치하지 않습니다.");
        setIsLoading(false);
        return;
      }

      await onConfirm();
      handleClose();
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        const serverMessage = err.response?.data?.message;
        setError(serverMessage || "알 수 없는 오류가 발생했습니다.");
      } else {
        setError("서버 요청 중 오류가 발생했습니다.");
        console.log(err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setTitleInput("");
    setError("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800 border-0 shadow-2xl">
        <DialogHeader className="text-center space-y-4 ">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
            <AlertTriangle className="h-8 w-8 text-white" />
          </div>
          <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white text-center">
            퀴즈 삭제 확인
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg text-center">
            "
            <span className="font-extrabold text-[#6B4226] dark:text-[#FFA07A]">
              {quizTitle}
            </span>
            "을(를) 입력해 주세요.
          </DialogDescription>
        </DialogHeader>

        <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
          <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
          <AlertDescription className="text-red-700 dark:text-red-300 text-sm">
            <strong>주의:</strong>
            <p>삭제된 퀴즈는 복구할 수 없습니다.</p>
            <p>모든 문제와 데이터가 영구적으로 삭제됩니다.</p>
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            {error ? (
              <Label htmlFor="titleConfirm" className="text-red-400 font-bold">
                * {error}
              </Label>
            ) : (
              <Label htmlFor="titleConfirm">제목 입력</Label>
            )}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="titleConfirm"
                type="text"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                placeholder={`"${quizTitle}"을(를) 입력하세요`}
                className="pl-10"
              />
            </div>
          </div>

          <DialogFooter className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1"
            >
              취소
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !titleInput.trim()}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white shadow-lg"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {isLoading ? "삭제 중..." : "삭제 확인"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
