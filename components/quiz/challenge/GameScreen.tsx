"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import MarkdownChallengeRenderer from "@/components/quiz/challenge/MarkdownChallengeRenderer";
import { Clock, Users, MessageCircle, Trophy, LogOut } from "lucide-react";

import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import {
  BroadcastLogEntry,
  ChatLogEntry,
  currentQuestion,
  Phase,
  PlayerState,
} from "@/types/ai-challenge.types";

interface GameScreenProps {
  phase?: Phase;
  currentQuestion?: currentQuestion;
  timeLeft: number;
  playerState: PlayerState[];
  chatLog: ChatLogEntry[];
  broadcastLog: BroadcastLogEntry[];
  answerInput: string;
  setAnswerInput: (value: string) => void;
  selectedOption: string;
  setSelectedOption: (value: string) => void;
  chatInput: string;
  setChatInput: (value: string) => void;
  isConnected: boolean;
  user: any;
  onSendAnswer: () => void;
  onSendChat: () => void;
  onLeaveGame?: () => void;
}
const initPhase: Phase = {
  currentRound: 0,
  phase: "INIT",
};

export default function GameScreen({
  phase = initPhase,
  currentQuestion,
  timeLeft,
  playerState,
  chatLog,
  broadcastLog,
  answerInput,
  setAnswerInput,
  selectedOption,
  setSelectedOption,
  chatInput,
  setChatInput,
  isConnected,
  user,
  onSendAnswer,
  onSendChat,
  onLeaveGame,
}: GameScreenProps) {
  const [isComposing, setIsComposing] = useState(false);

  const rankEmojis = ["🥇", "🥈", "🥉"];

  useEffect(() => {
    const el = document.querySelector("#chat-container");
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [chatLog]);

  const lastBroadcastIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (broadcastLog.length === 0) return;

    const lastIndex = broadcastLog.findIndex(
      (msg) => msg.id === lastBroadcastIdRef.current
    );
    const newLogs =
      lastIndex === -1 ? broadcastLog : broadcastLog.slice(lastIndex + 1);

    newLogs.forEach((log) => {
      toast.info(log.message, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
      });
    });

    if (newLogs.length > 0) {
      lastBroadcastIdRef.current = newLogs.at(-1)?.id ?? null;
    }
  }, [broadcastLog]);

  const renderQuestionInput = () => {
    if (!currentQuestion) return null;

    const selfPlayer = playerState.find((p) => p.nickname === user?.nickname);
    const isAnswered = !!selfPlayer?.answered;

    // 객관식 처리
    if (currentQuestion.type === "MULTIPLE" && currentQuestion.options) {
      return (
        <div className="w-full space-y-3">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            객관식 문제
          </h3>

          <div className="space-y-2">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => setSelectedOption(option)}
                disabled={isAnswered}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                  selectedOption === option
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                } ${
                  isAnswered
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 ${
                      selectedOption === option
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  >
                    {selectedOption === option && (
                      <div className="w-full h-full rounded-full bg-white scale-50"></div>
                    )}
                  </div>
                  <span className="font-medium text-lg">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  <span className="text-base">{option}</span>
                </div>
              </button>
            ))}
          </div>

          {!isAnswered && (
            <Button
              onClick={onSendAnswer}
              disabled={!isConnected || !selectedOption}
              className="w-full"
              size="lg"
            >
              정답 제출
            </Button>
          )}
        </div>
      );
    }

    // 단답형 처리
    return (
      <div className="w-full space-y-3">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          단답형 문제
        </h3>

        <div className="flex gap-3">
          <textarea
            value={answerInput}
            onChange={(e) => setAnswerInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                e.preventDefault(); // 줄바꿈 방지 또는 원하면 줄바꿈 허용
                onSendAnswer();
              }
            }}
            placeholder="정답을 입력하세요"
            disabled={isAnswered}
            className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
            rows={4}
          />
          {!isAnswered && (
            <Button
              onClick={onSendAnswer}
              disabled={!isConnected || !answerInput.trim()}
              size="lg"
            >
              정답 제출
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      {/* 고정 헤더 */}
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b">
        <div className="max-w-screen mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {phase && (
                <>
                  <Badge variant="outline" className="text-sm">
                    라운드 {phase.currentRound}
                  </Badge>
                  <Badge className="text-sm">{phase.phase}</Badge>
                </>
              )}
              {timeLeft > 0 && (
                <div className="flex items-center gap-2 text-red-500 font-bold">
                  <Clock className="w-5 h-5" />
                  <span className="text-xl">{timeLeft}초</span>
                </div>
              )}
            </div>
            <Button
              onClick={onLeaveGame}
              variant="destructive"
              size="sm"
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              게임 나가기
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-screen mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-6 flex-1 min-h-0 overflow-hidden">
          {/* 메인 게임 영역 */}
          <div className="col-span-9 flex flex-col min-h-[90vh] space-y-4">
            {/* 문제 영역 */}
            <Card className="flex-1 flex flex-col min-h-0">
              {/* 상단: 문제 제목 / 유형 뱃지 */}
              <CardHeader className="flex-shrink-0">
                <CardTitle className="flex items-center justify-between">
                  {(() => {
                    const selfPlayer = playerState.find(
                      (p) => p.nickname === user?.nickname
                    );
                    const hasAnswered = !!selfPlayer?.answered;
                    const isExplanationPhase =
                      hasAnswered && currentQuestion?.explain;

                    return (
                      <>
                        <span>
                          {isExplanationPhase ? "📘 해설" : "📝 문제"}
                        </span>
                        {currentQuestion && (
                          <Badge
                            variant={
                              currentQuestion.type === "MULTIPLE"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {currentQuestion.type === "MULTIPLE"
                              ? "객관식"
                              : "단답형"}
                          </Badge>
                        )}
                      </>
                    );
                  })()}
                </CardTitle>
              </CardHeader>
              {/* 중간: 문제 지문 or 해설 */}
              <CardContent className="flex-1 overflow-y-auto">
                {(() => {
                  const selfPlayer = playerState.find(
                    (p) => p.nickname === user?.nickname
                  );
                  const hasAnswered = !!selfPlayer?.answered;
                  const isEliminated =
                    selfPlayer?.hp !== undefined && selfPlayer.hp <= 0;

                  // 1. 게임 종료
                  if (phase?.phase === "GAMEOVER") {
                    return (
                      <div className="flex items-center justify-center h-full text-gray-700 dark:text-gray-300 text-xl font-semibold">
                        🏁 게임이 종료되었습니다. 수고하셨습니다!
                      </div>
                    );
                  }

                  // 2. 유저 탈락
                  if (isEliminated) {
                    return (
                      <div className="flex items-center justify-center h-full text-red-600 dark:text-red-400 text-xl font-semibold">
                        💀 탈락하셨습니다. 다음 기회를 노려보세요!
                      </div>
                    );
                  }

                  // 3. 문제 or 해설 렌더링
                  if (
                    currentQuestion &&
                    (phase?.phase === "PLAYING" ||
                      phase?.phase === "GRADING" ||
                      (phase?.phase === "GENERATING" && hasAnswered))
                  ) {
                    if (hasAnswered && currentQuestion.explain) {
                      return (
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl border border-yellow-300 dark:border-yellow-700">
                          <MarkdownChallengeRenderer
                            content={currentQuestion.explain}
                          />
                        </div>
                      );
                    }

                    return (
                      <div className="space-y-4">
                        <div className="prose max-w-none">
                          <MarkdownChallengeRenderer
                            content={currentQuestion.question}
                          />
                        </div>
                      </div>
                    );
                  }

                  // 4. 기본 대기 UI
                  return (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      문제를 기다리는 중...
                    </div>
                  );
                })()}
              </CardContent>{" "}
              <CardFooter className="flex gap-3 flex-shrink-0 border-t px-4 py-3">
                {renderQuestionInput()}
              </CardFooter>
            </Card>
          </div>

          {/* 사이드바 - 고정 크기 */}
          <div className="flex flex-col col-span-3 h-full min-h-0 w-full space-y-2">
            {/* 참가자 현황 */}
            <Card className="h-[30%] flex flex-col min-h-0">
              <CardHeader className="pb-3 flex-shrink-0">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Users className="w-4 h-4" />
                  참가자 현황
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 min-h-0 overflow-y-auto">
                <div className="space-y-4">
                  {playerState.map((player, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700"
                    >
                      <div className="text-lg font-bold w-8 text-center">
                        {rankEmojis[idx] || `${idx + 1}`}
                      </div>
                      <Avatar className="w-8 h-8">
                        <AvatarImage
                          src={player.avatar || "/placeholder.svg"}
                          alt={player.nickname}
                        />
                        <AvatarFallback className="text-sm">
                          {player.nickname.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-row text-sm font-semibold truncate gap-2">
                          <p>{player.nickname}</p>
                          <p>{"❤️".repeat(player.hp)}</p>
                        </div>
                        <div className="text-xs text-gray-500">
                          🏆 {player.score}점
                          {player.combo > 1 && <> 🔥 {player.combo}</>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 채팅 */}
            <Card className="h-[70%] flex flex-col min-h-0">
              <CardHeader className="pb-3 flex-shrink-0">
                <CardTitle className="flex items-center gap-2 text-base">
                  <MessageCircle className="w-4 h-4" />
                  채팅
                </CardTitle>
              </CardHeader>
              <CardContent className="h-full flex flex-col min-h-0">
                <div
                  id="chat-container"
                  className="flex-1 min-h-0 overflow-y-auto p-2 bg-gray-50 dark:bg-gray-700 rounded text-sm"
                >
                  {chatLog.slice(-14).map((chat, idx) => (
                    <div key={idx}>
                      <strong className="text-blue-600 dark:text-blue-400">
                        {chat.nickname}
                      </strong>
                      : {chat.content}
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 flex-shrink-0 mt-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onCompositionStart={() => setIsComposing(true)}
                    onCompositionEnd={() => setIsComposing(false)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !isComposing) {
                        e.preventDefault();
                        onSendChat();
                      }
                    }}
                    placeholder="채팅..."
                    className="flex-1 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm"
                  />
                  <Button
                    onClick={onSendChat}
                    disabled={!isConnected || !chatInput.trim()}
                    size="sm"
                  >
                    전송
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
