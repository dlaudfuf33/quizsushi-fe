export interface MatchingMessage {
  sessionId?: string;
  status: "JOINED" | "MATCHING" | "MATCHED" | "CANCELLED" | "DISABLED";
  noticeMessage?: string;
}

export interface ChallengeMessage {
  sessionId: string;
  error?: string;
  sessionState?: SessionState;
}

export interface SessionState {
  phase: Phase;
  broadcastLog: BroadcastLogEntry[];
  chatLog: ChatLogEntry[];
  playerState: PlayerState[];
  generating: boolean;
  currentQuestion?: currentQuestion;
}

export interface Phase {
  currentRound: number;
  phase: "INIT" | "WAITING" | "PLAYING" | "GRADING" | "GENERATING" | "GAMEOVER";
}
export interface BroadcastLogEntry {
  id: string;
  message: string;
  timestamp: string;
}

export interface ChatLogEntry {
  chatAt: string;
  nickname: string;
  content: string;
}

export interface PlayerState {
  nickname: string;
  avatar: string;
  hp: number;
  maxHp: number;
  score: number;
  combo: number;
  answered: boolean;
  submittedAnswer: string;
}

export interface currentQuestion {
  question: string;
  explain: string;
  type: "SHORTS" | "MULTIPLE";
  options?: string[];
  givenAt: string;
  limitTime: number;
  deadlineTime: number;
}

export interface LeaderboardEntry {
  memberId: string;
  nickname: string;
  avatar: string;
  bestScore: number;
}

export interface MultipleQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number[];
  explanation: string;
  difficulty?: "easy" | "medium" | "hard";
  timeLimit?: number;
  score?: number;
}

export interface ShortsQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string[];
  explanation: string;
  difficulty?: "easy" | "medium" | "hard";
  timeLimit?: number;
  score?: number;
}

export interface Reaction {
  onCorrect: string[];
  onWrong: string[];
  taunt?: string[];
}

export interface GameState {
  phase: "waiting" | "playing" | "gameOver";
  currentRound: number;
  playerHearts: number;
  maxHearts: number;
  currentScore: number;
  bestScore: number;
  timeLeft: number;
  isPlayerTurn: boolean;
  selectedAnswer: string;
  showFeedback: boolean;
  lastResult: "correct" | "incorrect" | "timeout" | null;
  combo: number;
  battleLog: string[];
  isGenerating: boolean;
}
