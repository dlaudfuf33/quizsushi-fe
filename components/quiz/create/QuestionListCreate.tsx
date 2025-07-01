"use client";

import React, { useRef } from "react";
import { QuestionEditor } from "./QuestionEditor";
import { Button } from "@/components/ui/button";
import { ChevronRight, Plus } from "lucide-react";
import type { QuestionData } from "@/types/quiz.types";
import { SubjectToggle } from "@/components/quiz/create/SubjectToggle";
import { PreviewToggle } from "./PreviewToggle";

interface Props {
  questions: QuestionData[];
  onUpdate: (index: number, updated: QuestionData) => void;
  onDelete: (index: number) => void;
  markdownMode: "edit" | "preview";
  onToggleMarkdownMode: () => void;
  useSubject: boolean;
  onToggleUseSubject: () => void;
  addNewQuestion: () => void;
  questionRefs?: React.RefObject<HTMLDivElement>[];
  onGoToQuestion?: (index: number) => void;
  uploadMode: "create" | "update";
  mediaKey?: string;
}

export default function QuestionListCreate({
  questions,
  onUpdate,
  onDelete,
  markdownMode,
  onToggleMarkdownMode,
  useSubject,
  onToggleUseSubject,
  addNewQuestion,
  questionRefs,
  onGoToQuestion,
  uploadMode,
  mediaKey,
}: Props) {
  const localRefs = useRef<React.RefObject<HTMLDivElement>[]>([]);
  const controllerRef = useRef<HTMLDivElement>(null);

  // 스크롤 이동을 위한 ref 배열 초기화
  if (!questionRefs && localRefs.current.length !== questions.length) {
    localRefs.current = Array(questions.length)
      .fill(null)
      .map((_, i) => localRefs.current[i] || React.createRef<HTMLDivElement>());
  }
  const refs = questionRefs || localRefs.current;

  const handleGoTo = (i: number) => {
    const targetRef = refs[i];
    const controllerElement = controllerRef.current;

    if (targetRef?.current && controllerElement) {
      const controllerHeight = controllerElement.offsetHeight;
      const scrollPosition = targetRef.current.offsetTop - controllerHeight;

      window.scrollTo({
        top: scrollPosition,
        behavior: "smooth",
      });

      onGoToQuestion?.(i);
    }
  };

  return (
    <div className="space-y-6">
      {/* 상단 고정 컨트롤 영역 */}
      <div
        ref={controllerRef}
        className="sticky top-14 z-10 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm"
      >
        <div className="flex flex-col gap-4">
          {/* 컨트롤 버튼 그룹 */}
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <PreviewToggle
                markdownMode={markdownMode}
                onToggleMarkdownMode={onToggleMarkdownMode}
              />
              <SubjectToggle
                useSubject={useSubject}
                onToggleUseSubject={onToggleUseSubject}
              />
            </div>

            <Button
              onClick={addNewQuestion}
              className="bg-gradient-to-r from-[#FFA07A] to-[#FF8C69] hover:from-[#FF8C69] hover:to-[#FFA07A] text-white shadow-lg flex items-center gap-2 h-9 text-sm"
            >
              <Plus className="h-3 w-3" />
              문제 추가하기
            </Button>
          </div>

          {/* 문제 바로가기 버튼 목록 */}
          {questions.length > 1 && (
            <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
              <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-1">
                <ChevronRight className="h-3 w-3" />
                문제 바로가기
              </h4>
              <div className="flex flex-wrap gap-1">
                {questions.map((_, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    size="sm"
                    className="h-7 w-7 p-0 text-xs border-[#FFA07A]/30 hover:bg-[#FFA07A]/10 hover:border-[#FFA07A] dark:border-[#FFA07A]/40 dark:hover:bg-[#FFA07A]/20"
                    onClick={() => handleGoTo(i)}
                  >
                    {i + 1}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 문제 리스트 렌더링 */}
      {questions.length > 0 ? (
        <div className="space-y-6">
          {questions.map((question, index) => (
            <div key={question.id} ref={refs[index]}>
              <QuestionEditor
                question={question}
                questionNo={question.no}
                onUpdate={(updated) => onUpdate(index, updated)}
                onDelete={() => onDelete(index)}
                markdownMode={markdownMode}
                useSubject={useSubject}
                scrollRef={refs[index]}
                uploadMode={uploadMode}
                mediaKey={mediaKey}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border-2 border-dashed border-[#FFA07A]/30 rounded-xl bg-[#FFA07A]/5">
          <div className="max-w-md mx-auto">
            <div className="w-12 h-12 bg-gradient-to-r from-[#FFA07A]/20 to-[#FF8C69]/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Plus className="h-6 w-6 text-[#FFA07A]" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              첫 번째 문제를 만들어보세요
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              위의 "문제 추가하기" 버튼을 클릭하여 퀴즈 문제를 만들어보세요
            </p>
            <Button
              onClick={addNewQuestion}
              className="bg-gradient-to-r from-[#FFA07A] to-[#FF8C69] hover:from-[#FF8C69] hover:to-[#FFA07A] text-white"
            >
              <Plus className="h-4 w-4 mr-2" />첫 문제 만들기
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
