import { getQuestions } from "./questionStore";

function splitLines(text) {
  return String(text || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function splitComma(text) {
  return String(text || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function buildOptions(adminQ) {
  return [
    { id: "A", text: adminQ.optionA || "Option A" },
    { id: "B", text: adminQ.optionB || "Option B" },
    { id: "C", text: adminQ.optionC || "Option C" },
    { id: "D", text: adminQ.optionD || "Option D" },
  ];
}

function mapToPractice(adminQ, typeId) {
  const base = {
    id: `admin-${adminQ.id}`,
    title: adminQ.title || "UNTITLED",
    difficulty: adminQ.difficulty || "Easy",
    time: adminQ.time || "00:20",
    category: adminQ.category || "SCIENCE & TECHNOLOGY",
    fromAdmin: true,
  };

  if (typeId === "mcq-single") {
    return {
      ...base,
      passage: splitLines(adminQ.passage).length
        ? splitLines(adminQ.passage)
        : ["Passage not added yet."],
      questionText: adminQ.questionText || "Choose the correct answer.",
      options: buildOptions(adminQ),
      correctAnswer: adminQ.correctAnswer || "A",
    };
  }

  if (typeId === "mcq-multiple") {
    return {
      ...base,
      passage: splitLines(adminQ.passage).length
        ? splitLines(adminQ.passage)
        : ["Passage not added yet."],
      questionText: adminQ.questionText || "Select all correct answers.",
      options: buildOptions(adminQ),
      correctAnswers: splitComma(adminQ.correctAnswers).length
        ? splitComma(adminQ.correctAnswers)
        : ["A"],
    };
  }

  if (typeId === "reorder-paragraphs") {
    const lines = splitLines(adminQ.paragraphs);
    const paragraphsList = (lines.length ? lines : ["Paragraph 1", "Paragraph 2"]).map(
      (text, index) => ({
        id: String.fromCharCode(65 + index),
        text,
      }),
    );

    return {
      ...base,
      paragraphs: paragraphsList.length,
      correctOrder: paragraphsList.map((p) => p.id),
      paragraphsList,
    };
  }

  if (typeId === "fill-blanks-dropdown" && Array.isArray(adminQ.segments)) {
    return {
      ...base,
      blanks: adminQ.correctAnswers.length,
      segments: adminQ.segments,
      correctAnswers: adminQ.correctAnswers,
    };
  }

  if (typeId === "fill-blanks-drag" || typeId === "fill-blanks-dropdown") {
    const answers = splitComma(adminQ.correctAnswers).length
      ? splitComma(adminQ.correctAnswers)
      : splitComma(adminQ.wordBank).slice(0, 3);

    const wordBank = splitComma(adminQ.wordBank).length
      ? splitComma(adminQ.wordBank)
      : [...answers, "option", "choice"];

    const passageText = adminQ.passage || "Complete the blanks below:";
    const segments = [{ type: "text", value: `${passageText} ` }];

    answers.forEach((answer, index) => {
      if (typeId === "fill-blanks-dropdown") {
        segments.push({
          type: "blank",
          options: wordBank.includes(answer)
            ? wordBank
            : [answer, ...wordBank].slice(0, 4),
        });
      } else {
        segments.push({ type: "blank" });
      }
      if (index < answers.length - 1) {
        segments.push({ type: "text", value: " " });
      }
    });

    return {
      ...base,
      blanks: answers.length || 1,
      segments,
      wordBank,
      correctAnswers: answers.length ? answers : ["answer"],
    };
  }

  return base;
}

export function getMergedQuestions(typeId, defaultQuestions = []) {
  try {
    const adminMapped = getQuestions()
      .filter((q) => q && q.type === typeId)
      .map((q) => mapToPractice(q, typeId));

    return [...defaultQuestions, ...adminMapped];
  } catch (error) {
    console.error("getMergedQuestions error:", error);
    return defaultQuestions;
  }
}
