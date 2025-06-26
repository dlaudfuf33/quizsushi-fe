import Papa from "papaparse";

export function parseCSV(text: string) {
  const { data } = Papa.parse(text, {
    header: true,
    skipEmptyLines: true,
  });

  return data.map((row: any) => ({
    question: row.question,
    options: [row.option1, row.option2, row.option3, row.option4].filter(
      Boolean
    ),
    correctIdx: parseInt(row.correctIdx, 10),
    img: row.img || null,
  }));
}

export function parseJSON(text: string) {
  try {
    const data = JSON.parse(text);

    if (!Array.isArray(data)) throw new Error("JSON 파일은 배열이어야 합니다.");

    return data.map((item, idx) => {
      if (!item.question) throw new Error(`문제 ${idx + 1}에 질문이 없습니다.`);
      return {
        question: item.question,
        options: item.options ?? [],
        correctIdx: item.correctIdx ?? null,
        correctAnswerText: item.correctAnswerText ?? null,
      };
    });
  } catch (err) {
    console.error("JSON 파싱 오류:", err);
    return [];
  }
}
