export interface LeaderboardEntry {
  memberId: string;
  nickname: string;
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
