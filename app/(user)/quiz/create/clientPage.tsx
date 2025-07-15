"use client";

import { parseJSON } from "@/lib/parser/parse";
import { toast } from "react-toastify";
import { useState, useEffect, useRef } from "react";
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

import { QuizFormHeader } from "@/components/quiz/create/QuizFormHeader";
import { QuizFormInputs } from "@/components/quiz/create/QuizFormInputs";
import { QuizBottomController } from "@/components/quiz/create/QuizBottomController";
import { AIGenerationLoader } from "@/components/quiz/create/AIGenerationLoader";
import { AIGenerationSuccess } from "@/components/quiz/create/AIGenerationSuccess";
import BackButton from "@/components/ui/back-button";
import { useAuth } from "@/context/AuthContext";
import LoadingPage from "@/components/LoadingPage";
import { TermsAgreementModal } from "@/components/quiz/create/TermsAgreementModal";
import { AiAPI } from "@/lib/api/ai.api";
import { ParsedQuestion, QuestionData } from "@/types/quiz.types";

interface Props {
  categories: Category[];
}

export default function CreateQuizClientPage({ categories }: Props) {
  const router = useRouter();
  const { isLoggedIn, user, isInitialized } = useAuth();
  const toastShownRef = useRef(false);

  // 로그인 체크 및 리다이렉트
  useEffect(() => {
    if (isInitialized && !isLoggedIn && !toastShownRef.current) {
      toastShownRef.current = true;
      toast.error("로그인이 필요한 서비스입니다.");
      router.push("/login");
    }
  }, [isLoggedIn, isInitialized, router]);

  // 상태 변수 그룹화
  const [activeTab, setActiveTab] = useState("create");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [markdownMode, setMarkdownMode] = useState<"edit" | "preview">("edit");
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [title, setTitle] = useState("");
  const [useSubject, setUseSubject] = useState(false);
  const [isQuizLoading, setIsQuizLoading] = useState(false);

  // 법적 동의 모달 상태
  const [showTermsModal, setShowTermsModal] = useState(false);

  // AI 관련 상태
  const [aiTopic, setAiTopic] = useState("");
  const [aiDescription, setAiDescription] = useState("");
  const [aiQuestionCount, setAiQuestionCount] = useState(1);
  const [aiDifficulty, setAiDifficulty] = useState("medium");
  const [aiQuestionType, setAiQuestionType] = useState("multiple");
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiAbortController, setAiAbortController] =
    useState<AbortController | null>(null);

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

  // 퀴즈 저장 시도 (이용약관 모달 표시)
  const handleSaveAttempt = () => {
    // 기본 유효성 검사
    if (!title.trim()) {
      toast.error("퀴즈 제목을 입력해주세요.");
      return;
    }
    if (!categoryId) {
      toast.error("카테고리를 선택해주세요.");
      return;
    }
    if (questions.length === 0) {
      toast.error("최소 1개 이상의 문제를 추가해주세요.");
      return;
    }

    // 이용약관 동의 모달 표시
    setShowTermsModal(true);
  };

  // 퀴즈 저장
  const summitQuiz = async () => {
    setIsQuizLoading(true);
    setShowTermsModal(false);

    try {
      const payload = {
        title,
        categoryId,
        description,
        useSubject,
        questions,
        agreedToTerms: true,
      };

      const quizId = await QuizAPI.createQuiz(payload);
      toast.success("퀴즈가 성공적으로 생성되었습니다!");
      router.push(`/quiz/solve/${quizId}`);
    } catch (e) {
      console.error("퀴즈 생성 오류:", e);
      toast.error("퀴즈 생성에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsQuizLoading(false);
    }
  };

  // 이용약관 모달 취소
  const handleTermsCancel = () => {
    setShowTermsModal(false);
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
            subject: item.subject ?? "",
            type:
              item.type ??
              (item.correctAnswer !== undefined ? "MULTIPLE" : "SHORTS"),
            question: item.question,
            options: item.options || [],
            correctAnswer: Array.isArray(item.correctAnswer)
              ? item.correctAnswer.map((n) => n)
              : typeof item.correctAnswer === "number"
              ? [item.correctAnswer]
              : undefined,
            correctAnswerText: item.correctAnswerText ?? undefined,
            explanation: item.explanation ?? "",
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

    const controller = new AbortController();
    setAiAbortController(controller);
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
              Array.isArray(item.correctAnswer) &&
              item.correctAnswer.every((v: any) => typeof v === "number")
            : typeof item.correctAnswerText === "string") &&
          typeof item.explanation === "string"
        );
      };

      const filtered = rawQuestions.filter(isValidGeneratedQuestion);

      if (filtered.length === 0) {
        toast.error("AI 응답이 유효하지 않습니다.");
        return;
      }

      const generated: QuestionData[] = filtered.map(
        (item: any, idx: number) => ({
          id: crypto.randomUUID(),
          no: questions.length + idx + 1,
          subject: aiTopic,
          type: item.type === "SHORT" ? "SHORT" : "MULTIPLE",
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
    } catch (err: any) {
      if (err.name === "AbortError") {
        toast.info("AI 문제 생성이 중단되었습니다.");
      } else {
        console.error("AI 문제 생성 실패:", err);
        toast.error("문제 생성에 실패했습니다.");
      }
    } finally {
      setIsAiGenerating(false);
      setAiAbortController(null);
    }
  };

  // AI 생성 중단 함수
  const cancelAiGeneration = () => {
    if (aiAbortController) {
      aiAbortController.abort();
      setAiAbortController(null);
      setIsAiGenerating(false);
      toast.info("AI 문제 생성이 중단되었습니다.");
    }
  };

  // 성공 모달 핸들러들
  const handleViewQuestions = () => {
    setShowSuccessModal(false);
    setActiveTab("create");
    toast.success(`${generatedCount}개의 문제가 생성되었습니다.`);
  };

  const handleGenerateMore = () => {
    setShowSuccessModal(false);
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
  };

  // 초기화 중이거나 로그인하지 않은 경우 로딩 상태 표시
  if (!isInitialized) {
    return <LoadingPage />;
  }

  // 로그인하지 않은 경우 리다이렉트 처리 중
  if (!isLoggedIn) {
    return <LoadingPage />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto py-6 px-4 max-w-6xl">
        <BackButton />

        {/* 퀴즈 생성 헤더 영역 */}
        <QuizFormHeader
          questionCount={questions.length}
          selectedCategory={categoryId}
          categories={categories}
        />

        <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardContent className="p-6">
            {/* 탭 리스트 (직접 만들기/파일 가져오기/ai 문제 생성) */}
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
                  직접 만들기
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

              {/* 직접 만들기 탭 */}
              <TabsContent value="create" className="space-y-6">
                {/* 퀴즈 기본 정보 입력 영역 */}
                <QuizFormInputs
                  mode="create"
                  title={title}
                  setTitle={setTitle}
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
                  uploadMode="create"
                />
              </TabsContent>

              {/* 파일 가져오기 탭 */}
              <TabsContent value="import" className="space-y-6">
                {/* 퀴즈 기본 정보 입력 영역 */}
                <QuizFormInputs
                  title={title}
                  setTitle={setTitle}
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
                      uploadMode="create"
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
                                • 생성된 문제는 직접 만들기 탭에서 수정할 수
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
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            {
                              count: 1,
                              label: "빠른 생성",
                              icon: "⚡",
                            },
                            {
                              count: 2,
                              label: "표준 생성",
                              icon: "📝",
                            },
                            {
                              count: 3,
                              label: "충분한 생성",
                              icon: "📚",
                            },
                          ].map((option) => (
                            <div
                              key={option.count}
                              onClick={() => setAiQuestionCount(option.count)}
                              className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                                aiQuestionCount === option.count
                                  ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20 shadow-md"
                                  : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-purple-300 hover:bg-purple-25 dark:hover:bg-purple-900/10"
                              }`}
                            >
                              <div className="text-center space-y-2">
                                <div className="text-2xl">{option.icon}</div>
                                <div className="text-lg font-bold text-gray-900 dark:text-white">
                                  {option.count}개
                                </div>
                                <div className="text-xs font-medium text-purple-600 dark:text-purple-400">
                                  {option.label}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                          선택한 개수:{" "}
                          <span className="font-medium text-purple-600 dark:text-purple-400">
                            {aiQuestionCount}개
                          </span>
                          의 문제가 생성됩니다
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
                      {isAiGenerating && (
                        <Button
                          onClick={cancelAiGeneration}
                          className="w-full bg-red-500 hover:bg-red-600 text-white shadow-lg h-12 text-base"
                        >
                          취소
                        </Button>
                      )}
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
          onSave={handleSaveAttempt}
          isLoading={isQuizLoading}
          title={title}
          categoryId={categoryId}
          questions={questions}
        />
      )}

      {/* 이용약관 동의 모달 */}
      <TermsAgreementModal
        isOpen={showTermsModal}
        onAgree={summitQuiz}
        onCancel={handleTermsCancel}
        isLoading={isQuizLoading}
      />

      {/* AI 생성 로더 */}
      <AIGenerationLoader
        isGenerating={isAiGenerating}
        questionCount={aiQuestionCount}
        topic={aiTopic}
        onCancel={cancelAiGeneration}
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
