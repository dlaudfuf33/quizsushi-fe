"use client";

import { useState, useEffect } from "react";
import { useSocketConnection } from "@/hooks/useSocketConnection";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import MatchingScreen from "@/components/quiz/challenge/MatchingScreen";
import GameScreen from "@/components/quiz/challenge/GameScreen";

import { MatchingMessage, ChallengeMessage, SessionState, Phase, BroadcastLogEntry, ChatLogEntry, PlayerState, currentQuestion } from "@/types/ai-challenge.types";

export default function TestChallengePage() {
  const [currentChallengeId, setCurrentChallengeId] = useState("");
  const [currentChannel, setCurrentChannel] = useState("");
  const [receivedMessages, setReceivedMessages] = useState<
    (ChallengeMessage | MatchingMessage)[]
  >([]);
  const [phase, setPhase] = useState<Phase>();
  const [broadcastLog, setBroadcastLog] = useState<BroadcastLogEntry[]>([]);
  const [chatLog, setChatLog] = useState<ChatLogEntry[]>([]);
  const [playerState, setPlayerState] = useState<PlayerState[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<currentQuestion>();

  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [answerInput, setAnswerInput] = useState("");
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [chatInput, setChatInput] = useState("");
  const [isInGame, setIsInGame] = useState(false);

  const { isLoggedIn, user, isInitialized } = useAuth();
  const router = useRouter();
  const memberId = user?.id;

  useEffect(() => {
    if (isInitialized && !isLoggedIn) {
      toast.error("로그인이 필요한 서비스입니다.");
      router.push("/login");
    }
  }, [isLoggedIn, isInitialized, router]);

  const { connect, send, disconnect, isConnected, setConnectHeaders } =
    useSocketConnection(currentChannel, (message) => {
      console.log("📡 소켓 메시지 수신:", JSON.stringify(message));
      setReceivedMessages((prev) => [...prev, message]);
      if ("status" in message && message.status === "DISABLED") {
        toast.error(message.noticeMessage || "챌린지가 비활성화되어 있습니다.");
        disconnect();
        return;
      }
      if (message.sessionState?.chatLog) {
        setChatLog(message.sessionState.chatLog);
      }
      if (message.sessionState?.broadcastLog) {
        setBroadcastLog(message.sessionState.broadcastLog);
      }
      if (message.sessionState?.playerState) {
        setPlayerState(message.sessionState.playerState);
      }
      setPhase(message.sessionState?.phase);
      setCurrentQuestion(message.sessionState?.currentQuestion);
    });

  // 매칭 시작 (matching/{memberId} 채널로 연결)
  const handleJoinMatching = () => {
    const matchingChannel = `matching/${memberId}`;
    if (!isConnected) {
      connect();
      setCurrentChannel(matchingChannel);
      setTimeout(() => {
        send("matching/join", {});
      }, 300);
    } else {
      send("matching/join", {});
    }
  };

  const handleCancelMatching = () => {
    send("matching/cancel", {});
    setCurrentChallengeId("");
    setReceivedMessages([]);
    disconnect();
  };

  const handleLeaveGame = () => {
    send("challenge/leave", {
      sessionId: currentChallengeId,
    });
    setCurrentChallengeId("");
    setReceivedMessages([]);
    setIsInGame(false);
    disconnect();
  };

  // 매칭시 해당 방 세션으로 전환
  useEffect(() => {
    const latest = receivedMessages.at(-1);
    const sessionId =
      typeof latest === "object" &&
      latest !== null &&
      "sessionId" in latest &&
      typeof (latest as any).sessionId === "string"
        ? (latest as any).sessionId
        : null;

    if (sessionId && sessionId !== currentChallengeId) {
      console.log("🎮 세션 배정됨 → 채널 전환:", sessionId);
      disconnect();
      setTimeout(() => {
        setReceivedMessages([]);
        setConnectHeaders({
          "x-session-id": sessionId,
        });
        setCurrentChallengeId(sessionId);
        setCurrentChannel(`challenge/${sessionId}`);
        setIsInGame(true);
      }, 100);
    }
  }, [receivedMessages, currentChallengeId, disconnect]);

  // 시간제한 타이머
  useEffect(() => {
    if (currentQuestion) {
      const now = Date.now();
      const startAt = new Date(currentQuestion.givenAt).getTime();
      const deadline = startAt + currentQuestion.limitTime * 1000;
      const remaining = Math.max(0, deadline - now);

      setTimeLeft(Math.floor(remaining / 1000));

      const interval = setInterval(() => {
        const newTimeLeft = Math.max(
          0,
          Math.floor((deadline - Date.now()) / 1000)
        );
        setTimeLeft(newTimeLeft);

        if (newTimeLeft <= 0) {
          clearInterval(interval);
        }
      }, 1000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [currentQuestion]);

  useEffect(() => {
    const handleUnload = () => {
      disconnect();
    };
    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, [disconnect]);

  const handleSendAnswer = () => {
    if (isConnected) {
      const answer =
        currentQuestion?.type === "MULTIPLE"
          ? selectedOption
          : answerInput.trim();
      if (answer) {
        send("challenge/answer", {
          sessionId: currentChallengeId,
          content: answer,
        });
        setAnswerInput("");
        setSelectedOption("");
      }
    }
  };

  const handleSendChat = () => {
    if (isConnected && chatInput.trim()) {
      send("challenge/chat", {
        sessionId: currentChallengeId,
        content: chatInput,
      });
      setChatInput("");
    }
  };

  // 게임 중이면 게임 화면, 아니면 매칭 화면
  if (isInGame && currentChallengeId) {
    return (
      <GameScreen
        phase={phase}
        currentQuestion={currentQuestion}
        timeLeft={timeLeft}
        playerState={playerState}
        broadcastLog={broadcastLog}
        chatLog={chatLog}
        answerInput={answerInput}
        setAnswerInput={setAnswerInput}
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
        chatInput={chatInput}
        setChatInput={setChatInput}
        isConnected={isConnected}
        user={user}
        onSendAnswer={handleSendAnswer}
        onSendChat={handleSendChat}
        onLeaveGame={handleLeaveGame}
        displayedAiMessage={displayedAiMessage}
      />
    );
  }

  return (
    <MatchingScreen
      isConnected={isConnected}
      receivedMessages={receivedMessages}
      onJoinMatching={handleJoinMatching}
      onCancelMatching={handleCancelMatching}
    />
  );
}
