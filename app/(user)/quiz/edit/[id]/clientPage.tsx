"use client";
import { parseJSON } from "@/lib/parser/parse";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileUploader } from "@/components/quiz/create/FileUploader";
import QuestionListCreate from "@/components/quiz/create/QuestionListCreate";
import { BookOpen, Upload, Edit, Bot, Sparkles, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Category } from "@/types/category.types";
import { useRouter } from "next/navigation";
import { QuizAPI } from "@/lib/api/quiz.api";

// 컴포넌트 임포트
import { QuizFormHeader } from "@/components/quiz/create/QuizFormHeader";
import { QuizFormInputs } from "@/components/quiz/create/QuizFormInputs";
import { QuizBottomController } from "@/components/quiz/create/QuizBottomController";
import { AIGenerationLoader } from "@/components/quiz/create/AIGenerationLoader";
import { AIGenerationSuccess } from "@/components/quiz/create/AIGenerationSuccess";
import { QuestionData, QuizSet } from "@/types/quiz.types";
import axios from "axios";
import { AiAPI } from "@/lib/api/ai.api";

import { QuestionData, QuizSet, ParsedQuestion } from "@/types/quiz.types";

interface Props {
  categories: Category[];
  initQuiz: QuizSet;
}

export default function EditQuizClientPage({ categories, initQuiz }: Props) {
  const router = useRouter();

  // 상태 변수 그룹화
  const [activeTab, setActiveTab] = useState("create");
  const [categoryId, setCategoryId] = useState(initQuiz.category.id);
  const [description, setDescription] = useState(initQuiz.description);
  const [markdownMode, setMarkdownMode] = useState<"edit" | "preview">("edit");
  const [questions, setQuestions] = useState<QuestionData[]>(
    initQuiz.questions
  );
  const [title] = useState(initQuiz.title);
  const [useSubject, setUseSubject] = useState(initQuiz.useSubject);
  const [isQuizLoading, setIsQuizLoading] = useState(false);

  // AI 관련 상태
  const [aiTopic, setAiTopic] = useState("");
  const [aiDescription, setAiDescription] = useState("");
  const [aiQuestionCount, setAiQuestionCount] = useState(1);
  const [aiDifficulty, setAiDifficulty] = useState("medium");
  const [aiQuestionType, setAiQuestionType] = useState("multiple");
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [generatedCount, setGeneratedCount] = useState(0);

  // UI 상태
  const [showScrollButtons, setShowScrollButtons] = useState(false);

  // 스크롤 위치 감지
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      setShowScrollButtons(
        documentHeight > windowHeight * 1.5 && scrollTop > 200
      );
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 스크롤 함수들
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const scrollToBottom = () =>
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });

  // 새 문제 추가
  const addNewQuestion = () => {
    const newQuestion: QuestionData = {
      id: crypto.randomUUID(),
      no: questions.length + 1,
      subject: "",
      type: "MULTIPLE",
      question: "",
      options: ["", "", "", ""],
      correctAnswer: undefined,
      explanation: "",
    };
    setQuestions((prev) => [...prev, newQuestion]);
  };

  // 문제 업데이트
  const updateQuestion = (index: number, updated: QuestionData) => {
    const newQuestions = [...questions];
    newQuestions[index] = updated;
    setQuestions(newQuestions);
  };

  // 문제 삭제 및 번호 재정렬
  const deleteQuestion = (index: number) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    const reordered = newQuestions.map((q, i) => ({ ...q, no: i + 1 }));
    setQuestions(reordered);
  };

  // 퀴즈 저장
  const summitQuiz = async () => {
    setIsQuizLoading(true);
    try {
      const payload = {
        id: initQuiz.id,
        description,
        useSubject,
        questions,
      };
      console.log(payload);
      const quizId = await QuizAPI.updateQuiz(payload);
      toast.success("성공적으로 수정되었습니다!");
      router.push(`/quiz/solve/${quizId}`);
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        const serverMessage = err.response?.data?.message;
        const errorMsg = serverMessage || "알 수 없는 오류가 발생했습니다.";
        toast.error(
          <>
            {errorMsg}
            <br />
            다시 시도해주세요.
          </>
        );
      } else {
        toast.error(
          <>
            퀴즈 수정 중<br />알 수 없는 오류가 발생했습니다.
          </>
        );
      }
    } finally {
      setIsQuizLoading(false);
    }
  };

  // 파일 업로드 처리 함수
  const handleFileUpload = (file: File) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target?.result;
      if (typeof text === "string") {
        let parsedData: ParsedQuestion[] = [];

        if (file.name.endsWith(".json")) {
          parsedData = parseJSON(text);
        }
        const convertedQuestions: QuestionData[] = parsedData.map(
          (item, idx) => ({
            id: crypto.randomUUID(),
            no: questions.length + idx + 1,
            subject: "",
            type: item.correctIdx !== undefined ? "MULTIPLE" : "SHORTS",
            question: item.question,
            options: item.options || [],
            correctAnswer:
              item.correctIdx !== undefined ? [item.correctIdx + 1] : undefined,
            correctAnswerText: item.correctAnswerText ?? undefined,
            explanation: "",
          })
        );

        setQuestions((prev) => [...prev, ...convertedQuestions]);
      }
    };

    reader.readAsText(file);
  };

  // AI 문제 생성 함수
  const generateAiQuestions = async () => {
    if (!aiTopic.trim()) {
      toast.warning("주제를 입력해주세요.");
      return;
    }
    if (aiQuestionCount > 3) {
      toast.warning("문제 최대 생성 갯수는 3개 입니다.");
      return;
    }

    setIsAiGenerating(true);
    const payload = {
      topic: aiTopic,
      description: aiDescription,
      count: aiQuestionCount,
      difficulty: aiDifficulty,
      questionType: aiQuestionType,
    };

    try {
      const res = await AiAPI.generateAiQuestions(payload);

      const rawQuestions = res ?? [];

      const isValidGeneratedQuestion = (item: any): boolean => {
        return (
          typeof item.question === "string" &&
          (item.type === "MULTIPLE"
            ? Array.isArray(item.options) &&
              typeof item.correctAnswer === "number"
            : typeof item.correctAnswerText === "string") &&
          typeof item.explanation === "string"
        );
      };

      const filtered = rawQuestions.filter(isValidGeneratedQuestion);
      console.log("filtered: ", filtered);

      if (filtered.length === 0) {
        toast.error("AI 응답이 유효하지 않습니다.");
        return;
      }

      const generated: QuestionData[] = filtered.map(
        (item: any, idx: number) => ({
          id: crypto.randomUUID(),
          no: questions.length + idx + 1,
          subject: aiTopic,
          type: item.type === "SHORTS" ? "SHORTS" : "MULTIPLE",
          question: item.question,
          options: item.options || [],
          correctAnswer: item.correctAnswer,
          correctAnswerText: item.correctAnswerText,
          explanation: item.explanation || "",
        })
      );

      setQuestions((prev) => [...prev, ...generated]);
      setGeneratedCount(generated.length);
      setShowSuccessModal(true);
    } catch (err) {
      console.error("AI 문제 수정 실패:", err);
      toast.error("문제 수정에 실패했습니다.");
    } finally {
      setIsAiGenerating(false);
    }
  };

  // 성공 모달 핸들러들
  const handleViewQuestions = () => {
    setShowSuccessModal(false);
    setActiveTab("create");
    toast.success(`${generatedCount}개의 문제가 수정되었습니다.`);
  };

  const handleGenerateMore = () => {
    setShowSuccessModal(false);
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto py-6 px-4 max-w-6xl">
        {/* 퀴즈 수정 헤더 영역 */}
        <QuizFormHeader
          mode={"update"}
          questionCount={questions.length}
          selectedCategory={categoryId}
          categories={categories}
        />

        <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardContent className="p-6">
            {/* 탭 리스트 (직접 만들기/파일 가져오기/ai 문제 수정) */}
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-6"
            >
              <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto h-10 bg-gray-100 dark:bg-gray-700 p-1">
                <TabsTrigger
                  value="create"
                  className="flex items-center gap-2 text-sm data-[state=active]:shadow-sm
                  data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800"
                >
                  <Edit className="h-5 w-5" />
                  직접 수정
                </TabsTrigger>
                <TabsTrigger
                  value="import"
                  className="flex items-center gap-2 text-sm data-[state=active]:shadow-sm
                  data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800"
                >
                  <Upload className="h-5 w-5" />
                  파일 가져오기
                </TabsTrigger>
                <TabsTrigger
                  value="ai"
                  className="flex items-center gap-2 text-sm data-[state=active]:shadow-sm
                  data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800"
                >
                  <Bot className="h-5 w-5" />
                  AI 출제
                </TabsTrigger>
              </TabsList>

              {/* 직접 수정 탭 */}
              <TabsContent value="create" className="space-y-6">
                {/* 퀴즈 기본 정보 입력 영역 */}
                <QuizFormInputs
                  mode={"update"}
                  title={title}
                  category={initQuiz.category}
                  categoryId={categoryId}
                  setCategoryId={setCategoryId}
                  description={description}
                  setDescription={setDescription}
                  categories={categories}
                />

                {/* 문제 입력 영역 */}
                <QuestionListCreate
                  questions={questions}
                  onUpdate={updateQuestion}
                  onDelete={deleteQuestion}
                  markdownMode={markdownMode}
                  onToggleMarkdownMode={() =>
                    setMarkdownMode((prev) =>
                      prev === "edit" ? "preview" : "edit"
                    )
                  }
                  useSubject={useSubject}
                  onToggleUseSubject={() => setUseSubject((prev) => !prev)}
                  addNewQuestion={addNewQuestion}
                  uploadMode="update"
                  mediaKey={initQuiz.mediaKey}
                />
              </TabsContent>

              {/* 파일 가져오기 탭 */}
              <TabsContent value="import" className="space-y-6">
                {/* 퀴즈 기본 정보 입력 영역 */}
                <QuizFormInputs
                  title={title}
                  category={initQuiz.category}
                  categoryId={categoryId}
                  setCategoryId={setCategoryId}
                  description={description}
                  setDescription={setDescription}
                  categories={categories}
                />

                <FileUploader onFileUpload={handleFileUpload} />

                {/* 파일 가져오기 탭 - 문제 영역 */}
                {questions.length > 0 && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      가져온 문제 목록
                    </h3>

                    <QuestionListCreate
                      questions={questions}
                      onUpdate={updateQuestion}
                      onDelete={deleteQuestion}
                      markdownMode={markdownMode}
                      onToggleMarkdownMode={() =>
                        setMarkdownMode((prev) =>
                          prev === "edit" ? "preview" : "edit"
                        )
                      }
                      useSubject={useSubject}
                      onToggleUseSubject={() => setUseSubject((prev) => !prev)}
                      addNewQuestion={addNewQuestion}
                      uploadMode="update"
                      mediaKey={initQuiz.mediaKey}
                    />
                  </div>
                )}
              </TabsContent>

              {/* AI 출제 탭 */}
              <TabsContent value="ai" className="space-y-6">
                <div className="max-w-2xl mx-auto">
                  <div className="text-center mb-8">
                    <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      AI 문제 생성
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300">
                      주제와 조건을 입력하면 AI가 자동으로 퀴즈 문제를
                      생성해드립니다
                    </p>
                  </div>

                  <Card className="border border-gray-200 dark:border-gray-700">
                    <CardContent className="p-6 space-y-6">
                      {/* 안내 메시지 */}
                      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <Bot className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                          <div className="text-sm text-blue-800 dark:text-blue-200">
                            <p className="font-medium mb-1">
                              AI 문제 생성 안내
                            </p>
                            <ul className="space-y-1 text-xs">
                              <li>
                                • 생성된 문제는 직접 수정 탭에서 수정할 수
                                있습니다
                              </li>
                              <li>
                                • 더 구체적인 설명을 제공할수록 정확한 문제가
                                생성됩니다
                              </li>
                              <li>• 생성 후 문제의 정확성을 검토해주세요</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* 주제 입력 */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="ai-topic"
                          className="text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          문제 주제 <span className="text-red-500">*</span>
                        </Label>
                        <input
                          id="ai-topic"
                          value={aiTopic}
                          onChange={(e) => setAiTopic(e.target.value)}
                          placeholder="예: 한국사, 프로그래밍, 영어 문법 등"
                          className="w-full h-10 px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFA07A] focus:border-[#FFA07A] bg-white dark:bg-gray-900"
                        />
                      </div>

                      {/* 상세 설명 */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="ai-description"
                          className="text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          상세 설명 (선택사항)
                        </Label>
                        <Textarea
                          id="ai-description"
                          value={aiDescription}
                          onChange={(e) => setAiDescription(e.target.value)}
                          placeholder="어떤 내용의 문제를 원하는지 구체적으로 설명해주세요"
                          className="min-h-[80px] border-gray-200 dark:border-gray-600 focus:border-[#FFA07A] focus:ring-[#FFA07A] resize-none"
                        />
                      </div>

                      {/* 문제 개수 */}
                      <div className="space-y-3">
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          문제 개수
                        </Label>
                        <div className="flex gap-2">
                          {[1, 2, 3].map((count) => (
                            <button
                              key={count}
                              type="button"
                              onClick={() => setAiQuestionCount(count)}
                              className={`flex-1 h-12 rounded-lg border-2 transition-all duration-200 font-medium text-sm ${
                                aiQuestionCount === count
                                  ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 shadow-md"
                                  : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:border-purple-300 hover:bg-purple-25 dark:hover:bg-purple-900/10"
                              }`}
                            >
                              <div className="flex flex-col items-center justify-center">
                                <span className="text-lg font-bold">
                                  {count}
                                </span>
                                <span className="text-xs">문제</span>
                              </div>
                            </button>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                          선택한 개수: {aiQuestionCount}개의 문제가 생성됩니다
                        </p>
                      </div>

                      {/* 난이도 선택 */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          난이도
                        </Label>
                        <Select
                          value={aiDifficulty}
                          onValueChange={setAiDifficulty}
                        >
                          <SelectTrigger className="border-gray-200 dark:border-gray-600 focus:border-[#FFA07A]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="easy">쉬움</SelectItem>
                            <SelectItem value="medium">보통</SelectItem>
                            <SelectItem value="hard">어려움</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* 문제 유형 선택 */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          문제 유형
                        </Label>
                        <Select
                          value={aiQuestionType}
                          onValueChange={setAiQuestionType}
                        >
                          <SelectTrigger className="border-gray-200 dark:border-gray-600 focus:border-[#FFA07A]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="multiple">객관식만</SelectItem>
                            <SelectItem value="short">단답형만</SelectItem>
                            <SelectItem value="mixed">
                              객관식 + 단답형
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* 생성 버튼 */}
                      <Button
                        onClick={generateAiQuestions}
                        disabled={!aiTopic.trim() || isAiGenerating}
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg h-12 text-base"
                      >
                        {isAiGenerating ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            AI가 문제를 생성하고 있습니다...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4 mr-2" />
                            AI 문제 생성하기
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* 하단 컨트롤러 영역 */}
      {questions.length > 0 && (
        <QuizBottomController
          showScrollButtons={showScrollButtons}
          scrollToTop={scrollToTop}
          scrollToBottom={scrollToBottom}
          onSave={summitQuiz}
          isLoading={isQuizLoading}
          title={title}
          categoryId={categoryId}
          questions={questions}
        />
      )}

      {/* AI 생성 로더 */}
      <AIGenerationLoader
        isGenerating={isAiGenerating}
        questionCount={aiQuestionCount}
        topic={aiTopic}
      />

      {/* AI 생성 성공 모달 */}
      <AIGenerationSuccess
        isVisible={showSuccessModal}
        questionCount={generatedCount}
        topic={aiTopic}
        onViewQuestions={handleViewQuestions}
        onGenerateMore={handleGenerateMore}
        onClose={handleCloseSuccessModal}
      />
    </div>
  );
}
