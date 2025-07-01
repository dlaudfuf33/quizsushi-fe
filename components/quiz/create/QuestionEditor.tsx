"use client";

import type React from "react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { QuestionData, QuestionType } from "@/types/quiz.types";
import {
  Trash2,
  BookOpen,
  Target,
  MessageSquare,
  MessageCircleMore,
  ListOrdered,
} from "lucide-react";
import { MarkdownInputWithUpload } from "@/components/quiz//markdown/MarkdownInputWithUpload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Props {
  question: QuestionData;
  questionNo: number;
  onUpdate: (updated: QuestionData) => void;
  onDelete: () => void;
  markdownMode: "edit" | "preview";
  useSubject: boolean;
  scrollRef?: React.RefObject<HTMLDivElement>;
  uploadMode: "create" | "update";
  mediaKey?: string;
}

export function QuestionEditor({
  question,
  questionNo,
  onUpdate,
  onDelete,
  markdownMode,
  useSubject,
  scrollRef,
  uploadMode,
  mediaKey,
}: Props) {
  // 파일 입력 엘리먼트에 대한 참조 생성
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 필드값 변경 처리 함수
  const handleChange = (
    field: keyof QuestionData,
    value: string | number | string[] | number[] | ((prev: string) => string)
  ) => {
    const prev = question[field];
    const next =
      typeof value === "function" && typeof prev === "string"
        ? (value as (prev: string) => string)(prev)
        : value;
    onUpdate({ ...question, [field]: next } as QuestionData);
  };

  // 문제 유형 토글 함수 (객관식 <-> 단답형)
  const toggleType = () => {
    const nextType: QuestionType =
      question.type === "MULTIPLE" ? "SHORTS" : "MULTIPLE";
    handleChange("type", nextType);
  };

  // 선택지 추가 함수 (최대 10개 제한)
  const addOption = () => {
    if (question.options.length < 10) {
      handleChange("options", [...question.options, ""]);
    }
  };

  // 선택지 삭제 및 정답 인덱스 조정 함수
  const removeOption = (index: number) => {
    const newOptions = [...question.options];
    newOptions.splice(index, 1);

    let newCorrectAnswer = question.correctAnswer;
    if (Array.isArray(newCorrectAnswer)) {
      newCorrectAnswer = newCorrectAnswer
        .filter((answerIndex) => answerIndex !== index + 1)
        .map((answerIndex) =>
          answerIndex > index + 1 ? answerIndex - 1 : answerIndex
        );
    }
    onUpdate({
      ...question,
      options: newOptions,
      correctAnswer: newCorrectAnswer,
    });
  };

  // 선택지 내용 업데이트 함수 (함수형 업데이트 지원)
  const updateOption = (
    index: number,
    value: string | ((prev: string) => string)
  ) => {
    const newOptions = [...question.options];
    const prev = newOptions[index];
    const next =
      typeof value === "function"
        ? (value as (prev: string) => string)(prev)
        : value;
    newOptions[index] = next;
    onUpdate({ ...question, options: newOptions });
  };

  return (
    <Card
      ref={scrollRef}
      className="border-0 shadow-lg bg-white dark:bg-gray-800 overflow-hidden"
    >
      <CardHeader className="bg-gradient-to-r from-[#FFA07A]/10 to-[#FF8C69]/10 dark:from-[#FFA07A]/5 dark:to-[#FF8C69]/5 border-b border-gray-200 dark:border-gray-600 py-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-[#FFA07A] to-[#FF8C69] rounded-lg flex items-center justify-center text-white font-bold text-sm">
              {questionNo}
            </div>
            <span className="text-gray-900 dark:text-white">
              문제 {questionNo}
            </span>
            <Badge
              variant={question.type === "MULTIPLE" ? "default" : "secondary"}
              className="bg-[#FFA07A]/20 text-[#FFA07A] border-[#FFA07A]/30 text-xs"
            >
              {question.type === "MULTIPLE" ? "객관식" : "단답형"}
            </Badge>
          </CardTitle>

          <div className="flex items-center gap-2">
            {/* 문제 유형 토글 버튼 */}
            <Button
              variant="destructive"
              size="sm"
              onClick={toggleType}
              className="bg-[#FFA07A] hover:bg-[#d08d73] shadow-sm h-8 text-xs "
            >
              {question.type === "MULTIPLE" ? (
                <>
                  <ListOrdered className="h-3 w-3" />
                  객관식
                </>
              ) : (
                <>
                  <MessageCircleMore className="h-3 w-3" />
                  단답형
                </>
              )}
            </Button>

            {/* 문제 삭제 버튼 */}
            <Button
              variant="destructive"
              size="sm"
              onClick={onDelete}
              className="bg-red-500 hover:bg-red-600 shadow-sm h-8 text-xs"
            >
              <Trash2 className="h-3 w-3 mr-1" /> 삭제
            </Button>
          </div>
        </div>
      </CardHeader>

      {/*  문제 편집 영역  */}
      <CardContent className="p-6 space-y-6">
        {/*  과목명 입력 필드 (조건부 렌더링)  */}
        {useSubject && (
          <div className="space-y-1">
            <Label
              htmlFor={`subject-${question.id}`}
              className="text-xs font-medium text-gray-700 dark:text-gray-300"
            >
              과목명
            </Label>
            <Input
              id={`subject-${question.id}`}
              value={question.subject || ""}
              onChange={(e) => handleChange("subject", e.target.value)}
              placeholder="과목명을 입력하세요"
              className="h-9 text-sm border-gray-200 dark:border-gray-600 focus:border-[#FFA07A] focus:ring-[#FFA07A]"
            />
          </div>
        )}

        {/*  문제 내용 입력  */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
            <BookOpen className="h-3 w-3" />
            문제 내용 *
          </Label>
          <MarkdownInputWithUpload
            value={question.question}
            onChange={(val) => handleChange("question", val)}
            placeholder="문제 내용을 입력하세요 (마크다운 지원)"
            mode={markdownMode}
            uploadMode={uploadMode}
            mediaKey={mediaKey}
            variant="question"
          />
        </div>

        {/*  객관식 선택지 입력  */}
        {question.type === "MULTIPLE" && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label className="text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                <Target className="h-3 w-3" />
                선택지
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addOption}
                className="h-7 px-2 text-xs border-[#FFA07A]/30 text-[#FFA07A] hover:bg-[#FFA07A]/10 dark:border-[#FFA07A]/40"
                disabled={question.options.length >= 10}
              >
                선택지 추가
              </Button>
            </div>

            <div className="grid gap-3">
              {question.options.map((option, index) => (
                <div className="flex gap-2 items-start" key={index}>
                  <div className="flex-shrink-0 w-6 h-6 bg-[#FFA07A]/20 rounded-full flex items-center justify-center text-xs font-medium text-[#FFA07A] mt-1">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <MarkdownInputWithUpload
                      value={option}
                      onChange={(val) => updateOption(index, val)}
                      placeholder={`선택지 ${index + 1}을 입력하세요`}
                      mode={markdownMode}
                      uploadMode={uploadMode}
                      mediaKey={mediaKey}
                      variant="option"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeOption(index)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 mt-1 h-6 w-6"
                    disabled={question.options.length <= 2}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/*  정답 설정 영역  */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
            <Target className="h-3 w-3" />
            정답 설정 *
          </Label>

          {question.type === "MULTIPLE" ? (
            <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
              {question.options.map((_, index) => (
                <Button
                  key={index}
                  type="button"
                  variant={
                    Array.isArray(question.correctAnswer) &&
                    question.correctAnswer.includes(index + 1)
                      ? "default"
                      : "outline"
                  }
                  className={
                    Array.isArray(question.correctAnswer) &&
                    question.correctAnswer.includes(index + 1)
                      ? "bg-[#FFA07A] hover:bg-[#FF8C69] border-[#FFA07A] text-white h-8 text-xs"
                      : "border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 h-8 text-lg"
                  }
                  onClick={() => {
                    const current = question.correctAnswer ?? [];
                    const next = current.includes(index + 1)
                      ? current.filter((v) => v !== index + 1)
                      : [...current, index + 1];
                    handleChange("correctAnswer", next);
                  }}
                >
                  {["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"][index]}
                </Button>
              ))}
            </div>
          ) : (
            <Input
              value={question.correctAnswerText || ""}
              onChange={(e) =>
                handleChange("correctAnswerText", e.target.value)
              }
              placeholder="정답 텍스트를 입력하세요"
              className="h-9 text-sm border-gray-200 dark:border-gray-600 focus:border-[#FFA07A] focus:ring-[#FFA07A]"
            />
          )}
        </div>

        {/*  문제 해설 입력  */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
            <MessageSquare className="h-3 w-3" />
            해설
          </Label>
          <MarkdownInputWithUpload
            value={question.explanation || ""}
            onChange={(val) => handleChange("explanation", val)}
            placeholder="문제 해설을 입력하세요 (선택사항)"
            mode={markdownMode}
            uploadMode={uploadMode}
            mediaKey={mediaKey}
            variant="explanation"
          />
        </div>
      </CardContent>
    </Card>
  );
}
