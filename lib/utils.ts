import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { QuestionData } from "@/types/quiz.types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// export function generateAnonymousAuthor() {
//   const adjectives = [
//     "부드러운",
//     "화려한",
//     "단단한",
//     "빛나는",
//     "신선한",
//     "고소한",
//     "쫄깃한",
//     "촉촉한",
//     "은은한",
//     "진득한",
//     "기묘한",
//     "거침없는",
//     "비범한",
//     "달달한",
//     "무서운",
//     "귀여운",
//     "허세폭발",
//     "예리한",
//     "화난",
//     "도른자",
//     "미쳐버린",
//     "설익은",
//     "무명의",
//     "절묘한",
//     "살짝익은",
//     "명랑한",
//     "혼신의",
//     "쎈",
//     "곰곰한",
//     "묵직한",
//     "끈적한",
//     "청아한",
//   ];

//   const types = [
//     "연어",
//     "참치",
//     "광어",
//     "새우",
//     "계란",
//     "장어",
//     "문어",
//     "도미",
//     "오징어",
//     "전복",
//     "성게",
//     "김초밥",
//     "간장",
//     "와사비",
//     "고추냉이",
//     "유부",
//     "초생강",
//     "날치알",
//     "미소된장",
//     "생강",
//     "대뱃살",
//     "초대리",
//     "떡밥",
//     "굴",
//     "소라",
//     "참깨",
//     "고등어",
//     "냉동참치",
//     "비밀재료",
//     "치명적인재료",
//     "알수없는물고기",
//     "고래상어",
//   ];

//   const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
//   const type = types[Math.floor(Math.random() * types.length)];
//   return `${adj}${type}`;
// }

export function isAnswerCorrect(
  question: QuestionData,
  userAnswer: number | string | number[] | undefined
): boolean {
  if (userAnswer === undefined) return false;

  if (question.type === "SHORTS") {
    return (
      typeof userAnswer === "string" &&
      userAnswer.trim().toLowerCase() ===
        (question.correctAnswerText ?? "").trim().toLowerCase()
    );
  }

  if (question.type === "MULTIPLE") {
    const correct = question.correctAnswer;
    if (!Array.isArray(correct)) return false;

    const userArray = Array.isArray(userAnswer)
      ? userAnswer
      : typeof userAnswer === "number"
      ? [userAnswer]
      : [];

    const sortedCorrect = [...correct].sort();
    const sortedUser = [...userArray].sort();

    return (
      sortedCorrect.length === sortedUser.length &&
      sortedCorrect.every((v, i) => v === sortedUser[i])
    );
  }

  return false;
}
