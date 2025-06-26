export function parseJSON(text: string | object) {
  try {
    const data = typeof text === "string" ? JSON.parse(text) : text;

    if (!Array.isArray(data)) throw new Error("JSON 파일은 배열이어야 합니다.");

    return data.map((item, idx) => {
      if (!item.question) throw new Error(`문제 ${idx + 1}에 질문이 없습니다.`);

      return {
        subject: item.subject ?? "",
        type: item.type ?? "MULTIPLE",
        question: item.question,
        options: item.options ?? [],
        correctAnswer: Array.isArray(item.correctAnswer)
          ? item.correctAnswer
          : undefined,
        correctAnswerText: item.correctAnswerText ?? "",
        explanation: item.explanation ?? "",
      };
    });
  } catch (err) {
    console.error("JSON 파싱 오류:", err);
    return [];
  }
}
