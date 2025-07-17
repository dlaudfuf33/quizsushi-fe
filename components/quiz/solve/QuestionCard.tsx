"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Lock } from "lucide-react";
import type { QuestionData } from "@/types/quiz.types";
import MarkdownRenderer from "@/components/quiz/markdown/MarkdownRenderer";
import { isAnswerCorrect } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

interface Props {
  question: QuestionData;
  userAnswer?: number[] | string;
  showResults: boolean;
  onAnswerSelect: (questionId: string, answer: number[] | string) => void;
  questionIndex: number;
  totalAnsweredCount: number;
}

export function QuestionCard({
  question,
  userAnswer,
  showResults,
  onAnswerSelect,
  questionIndex,
  totalAnsweredCount,
}: Props) {
  const { isLoggedIn } = useAuth();

  // 비로그인 사용자의 문제 풀이 제한 체크
  const isQuestionLocked = !isLoggedIn && questionIndex >= 10;
  const isAnswerLocked = !isLoggedIn && totalAnsweredCount >= 10 && !userAnswer;

  const [shuffledOptions, setShuffledOptions] = useState<
    { option: string; originalIndex: number }[]
  >([]);

  useEffect(() => {
    const optionsWithIndex = question.options.map((opt, idx) => ({
      option: opt,
      originalIndex: idx + 1,
    }));

    if (showResults) {
      setShuffledOptions(optionsWithIndex);
    } else {
      setShuffledOptions([...optionsWithIndex].sort(() => Math.random() - 0.5));
    }
  }, [question.id, showResults]);

  const isCorrect = isAnswerCorrect(question, userAnswer);

  const optionSymbols = ["①", "②", "③", "④", "⑤", "⑥", "⑦", "⑧", "⑨", "⑩"];

  const getOptionButtonStyle = (originalIndex: number, isSelected: boolean) => {
    const isCorrectOption =
      question.type === "MULTIPLE" &&
      Array.isArray(question.correctAnswer) &&
      question.correctAnswer.includes(originalIndex);
    const isWrongSelection = isSelected && !isCorrectOption;

    if (!showResults) {
      if (isQuestionLocked || isAnswerLocked) {
        return "border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed dark:border-gray-600 dark:bg-gray-800 dark:text-gray-500";
      }
      return isSelected
        ? "bg-[#FFA07A] text-white hover:bg-[#FFA07A]/90 border-[#FFA07A] shadow-md"
        : "border-gray-200 dark:border-gray-600 hover:border-[#FFA07A]/50 hover:bg-[#FFA07A]/5";
    }

    if (isCorrectOption) {
      return "border-green-500 bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400 dark:border-green-600";
    }

    if (isWrongSelection) {
      return "border-red-500 bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-400 dark:border-red-600";
    }

    return "border-gray-200 dark:border-gray-600 opacity-60";
  };

  const handleAnswerSelect = (
    questionId: string,
    answer: number[] | string
  ) => {
    if (isQuestionLocked || isAnswerLocked) {
      return;
    }
    onAnswerSelect(questionId, answer);
  };

  return (
    <Card
      className={`overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 ${
        isQuestionLocked
          ? "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 opacity-80"
          : "border-[#FFA07A]/20 dark:border-gray-700"
      }`}
    >
      <CardHeader
        className={`pb-4 ${
          isQuestionLocked
            ? "bg-gray-100 dark:bg-gray-700/50"
            : "bg-gradient-to-r from-gray-50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-800/30"
        }`}
      >
        <div className="flex justify-between items-start gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm ${
                isQuestionLocked
                  ? "bg-gray-400 dark:bg-gray-600"
                  : "bg-gradient-to-r from-[#FFA07A] to-[#FF8C69]"
              }`}
            >
              {isQuestionLocked ? <Lock className="h-4 w-4" /> : question.no}
            </div>
            {question.subject && !isQuestionLocked && (
              <Badge
                variant="outline"
                className="bg-white dark:bg-gray-800 border-[#FFA07A]/30 text-[#FFA07A] text-xs"
              >
                {question.subject}
              </Badge>
            )}
            <Badge
              variant="secondary"
              className={`text-xs ${
                isQuestionLocked
                  ? "bg-gray-200 text-gray-500 dark:bg-gray-600 dark:text-gray-400"
                  : ""
              }`}
            >
              {question.type === "MULTIPLE" ? "객관식" : "단답형"}
            </Badge>
            {isQuestionLocked && (
              <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 text-xs">
                <Lock className="h-3 w-3 mr-1" />
                로그인 필요
              </Badge>
            )}
          </div>

          {showResults && !isQuestionLocked && (
            <div className="flex items-center">
              {isCorrect ? (
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 gap-1.5 px-3 py-1">
                  <CheckCircle className="h-3.5 w-3.5" />
                  정답
                </Badge>
              ) : (
                <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 gap-1.5 px-3 py-1">
                  <XCircle className="h-3.5 w-3.5" />
                  오답
                </Badge>
              )}
            </div>
          )}
        </div>

        <CardTitle className="text-base font-medium mt-3 leading-relaxed text-gray-900 dark:text-white">
          {isQuestionLocked ? (
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <Lock className="h-4 w-4" />
              <span>로그인하면 이 문제를 풀 수 있습니다</span>
            </div>
          ) : (
            <MarkdownRenderer content={question.question} />
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-6">
        {isQuestionLocked ? (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/30 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="h-8 w-8 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
              문제가 잠겨있습니다
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
              비회원은 10문제까지만 풀 수 있습니다
              <br />
              로그인하고 모든 문제에 도전해보세요!
            </p>
            <Button
              onClick={() => (window.location.href = "/login")}
              className="bg-gradient-to-r from-[#FFA07A] to-[#FF8C69] hover:from-[#FF8C69] hover:to-[#FFA07A] text-white px-6 py-2"
            >
              <Lock className="h-4 w-4 mr-2" />
              로그인하고 계속 풀기
            </Button>
          </div>
        ) : (
          // 기존 문제 내용 표시 로직은 그대로 유지
          <>
            {/* 선택지 표시 */}
            {question.type === "MULTIPLE" ? (
              // 객관식 선택지 렌더링
              <div className="grid gap-3">
                {shuffledOptions.map(({ option, originalIndex }, index) => {
                  const isSelected =
                    Array.isArray(userAnswer) &&
                    userAnswer.includes(originalIndex);
                  const isCorrectOption = Array.isArray(question.correctAnswer)
                    ? question.correctAnswer.includes(originalIndex)
                    : false;
                  const isWrongSelection = isSelected && !isCorrectOption;

                  return (
                    <Button
                      key={`${question.id}-${originalIndex}`}
                      variant="outline"
                      onClick={() =>
                        handleAnswerSelect(question.id, [originalIndex])
                      }
                      className={`justify-start h-auto py-4 px-4 font-normal text-left transition-all duration-200 ${getOptionButtonStyle(
                        originalIndex,
                        isSelected
                      )}`}
                      disabled={showResults || isAnswerLocked}
                    >
                      <span className="mr-3 font-semibold text-base flex-shrink-0">
                        {optionSymbols[index]}
                      </span>
                      <span className="flex-1 leading-relaxed">
                        <MarkdownRenderer content={option} />
                      </span>

                      {showResults && isCorrectOption && (
                        <CheckCircle className="ml-3 h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                      )}
                      {showResults && isWrongSelection && (
                        <XCircle className="ml-3 h-4 w-4 text-red-600 dark:text-red-400 flex-shrink-0" />
                      )}
                    </Button>
                  );
                })}
              </div>
            ) : (
              //  단답형 입력 필드
              <div className="mb-4">
                {showResults ? (
                  <div className="px-4 py-2 border rounded-md text-sm bg-gray-100 dark:bg-gray-800">
                    <span className="font-semibold text-blue-700 dark:text-blue-300">
                      정답:{" "}
                    </span>
                    <MarkdownRenderer
                      content={question.correctAnswerText || "-"}
                    />
                  </div>
                ) : (
                  <div className="relative">
                    <input
                      type="text"
                      value={typeof userAnswer === "string" ? userAnswer : ""}
                      onChange={(e) =>
                        handleAnswerSelect(question.id, e.target.value)
                      }
                      className={`w-full border rounded px-4 py-2 text-sm dark:bg-gray-900 ${
                        isAnswerLocked
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-500"
                          : ""
                      }`}
                      placeholder={
                        isAnswerLocked
                          ? "로그인하면 답변할 수 있습니다"
                          : "정답을 입력하세요"
                      }
                      disabled={isAnswerLocked}
                    />
                    {isAnswerLocked && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <Lock className="h-4 w-4 text-gray-400" />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* 결과 및 해설 표시 */}
            {showResults && (
              <div className="mt-6 pt-4 border-t border-dashed border-gray-200 dark:border-gray-700">
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 space-y-3">
                  {/* 정답 표시 영역 */}
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <span className="font-semibold text-green-800 dark:text-green-400">
                        정답:
                      </span>{" "}
                      <span className="font-medium">
                        {question.type === "SHORTS" ? (
                          <MarkdownRenderer
                            content={question.correctAnswerText ?? "-"}
                          />
                        ) : (
                          question.correctAnswer?.map((idx, i) => (
                            <span key={idx}>
                              {i > 0 && ": "}
                              <span className="inline-flex items-center">
                                {optionSymbols[idx - 1]}{" "}
                                <span className="inline ml-1">
                                  <MarkdownRenderer
                                    content={question.options[idx - 1]}
                                  />
                                </span>
                              </span>
                            </span>
                          ))
                        )}
                      </span>
                    </div>
                  </div>

                  {question.explanation && (
                    <div className="flex items-start gap-2">
                      <div className="w-4 h-4 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                        <div className="w-1.5 h-1.5 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                      </div>
                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        <span className="font-semibold text-blue-800 dark:text-blue-400">
                          해설:
                        </span>{" "}
                        <span className="leading-relaxed">
                          <MarkdownRenderer content={question.explanation} />
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
