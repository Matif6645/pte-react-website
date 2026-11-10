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

function buildOptions(adminQ, withE = false) {
  const options = [
    { id: "A", text: adminQ.optionA || "Option A" },
    { id: "B", text: adminQ.optionB || "Option B" },
    { id: "C", text: adminQ.optionC || "Option C" },
    { id: "D", text: adminQ.optionD || "Option D" },
  ];
  if (withE && adminQ.optionE) {
    options.push({ id: "E", text: adminQ.optionE });
  }
  return options;
}

/** Listening FIB: passage with ___ blanks + correct_answers "a,b,c" */
function parseFibSegments(passage, answers) {
  const parts = String(passage || "").split(/___+/);
  const segments = [];
  parts.forEach((text, i) => {
    if (text) segments.push({ type: "text", value: text });
    if (i < parts.length - 1) {
      segments.push({ type: "blank", answer: answers[i] || "" });
    }
  });
  if (!segments.length) {
    return [
      { type: "text", value: "Type the missing words: " },
      { type: "blank", answer: answers[0] || "answer" },
    ];
  }
  return segments;
}

/**
 * HIW transcript: normal words, or {{wrong|correct}} for incorrect words.
 * Example: Although {{comments|comets}} have been viewed
 */
function parseHiwWords(passage) {
  const raw = String(passage || "").trim();
  if (!raw) {
    return [{ id: 0, text: "Transcript", isWrong: false, correct: "" }];
  }

  const tokens = [];
  const re = /\{\{([^|}]+)\|([^}]+)\}\}|(\S+)/g;
  let match;
  let id = 0;
  while ((match = re.exec(raw)) !== null) {
    if (match[1] != null) {
      tokens.push({
        id: id++,
        text: match[1],
        isWrong: true,
        correct: match[2],
      });
    } else {
      tokens.push({
        id: id++,
        text: match[3],
        isWrong: false,
        correct: "",
      });
    }
  }
  return tokens.length
    ? tokens
    : [{ id: 0, text: raw, isWrong: false, correct: "" }];
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

  if (
    typeId === "mcq-single" ||
    typeId === "listening-mcq-single" ||
    typeId === "listening-hcs" ||
    typeId === "listening-smw"
  ) {
    const defaultText =
      typeId === "listening-hcs"
        ? "Click on the paragraph that best relates to the recording."
        : typeId === "listening-smw"
          ? "At the end of the recording the last word is replaced by a beep. Select the correct option."
          : "Choose the correct answer.";

    return {
      ...base,
      audioUrl: adminQ.audioUrl || "",
      passage: splitLines(adminQ.passage).length
        ? splitLines(adminQ.passage)
        : ["Passage not added yet."],
      questionText: adminQ.questionText || defaultText,
      prompt: adminQ.passage || "",
      options: buildOptions(adminQ),
      correctAnswer: adminQ.correctAnswer || "A",
    };
  }

  if (typeId === "mcq-multiple" || typeId === "listening-mcq-multiple") {
    return {
      ...base,
      audioUrl: adminQ.audioUrl || "",
      passage: splitLines(adminQ.passage).length
        ? splitLines(adminQ.passage)
        : ["Passage not added yet."],
      questionText:
        adminQ.questionText || "Select all correct answers.",
      options: buildOptions(adminQ, true),
      correctAnswers: splitComma(adminQ.correctAnswers).length
        ? splitComma(adminQ.correctAnswers)
        : ["A"],
    };
  }

  if (typeId === "reorder-paragraphs") {
    const lines = splitLines(adminQ.paragraphs);
    const paragraphsList = (
      lines.length ? lines : ["Paragraph 1", "Paragraph 2"]
    ).map((text, index) => ({
      id: String.fromCharCode(65 + index),
      text,
    }));

    return {
      ...base,
      paragraphs: paragraphsList.length,
      correctOrder: paragraphsList.map((p) => p.id),
      paragraphsList,
    };
  }

  if (typeId === "fill-blanks-dropdown" && Array.isArray(adminQ.segments)) {
    const answers = Array.isArray(adminQ.correctAnswers)
      ? adminQ.correctAnswers
      : [];
    return {
      ...base,
      blanks: answers.length,
      segments: adminQ.segments,
      correctAnswers: answers,
    };
  }

  if (typeId === "listening-sst") {
    return {
      ...base,
      audioUrl: adminQ.audioUrl || "",
      questionText:
        adminQ.questionText ||
        "You will hear a short lecture. Write a summary for a fellow student who was not present. You should write 50–70 words.",
    };
  }

  if (typeId === "write-essay") {
    return {
      ...base,
      prompt:
        adminQ.passage?.trim() ||
        adminQ.questionText?.trim() ||
        "Write an essay on the given topic.",
      questionText:
        adminQ.questionText ||
        "You will have 20 minutes to plan, write and revise an essay about the topic below. Your response will be judged on how well you develop a position, organize your ideas, present supporting details, and control the elements of standard written English. You should write 200–300 words.",
      minWords: 200,
      maxWords: 300,
    };
  }

  if (typeId === "summarize-written-text") {
    return {
      ...base,
      passage: adminQ.passage || "",
      questionText:
        adminQ.questionText ||
        "Read the passage below and summarize it using one sentence. You should write 5–75 words.",
      minWords: 5,
      maxWords: 75,
    };
  }

  if (typeId === "listening-fib") {
    const answers = splitComma(adminQ.correctAnswers);
    return {
      ...base,
      audioUrl: adminQ.audioUrl || "",
      questionText:
        adminQ.questionText ||
        "Listen to the recording and type the missing words in the blanks.",
      segments: parseFibSegments(adminQ.passage, answers),
    };
  }

  if (typeId === "listening-wfd") {
    return {
      ...base,
      audioUrl: adminQ.audioUrl || "",
      answer:
        adminQ.passage?.trim() ||
        adminQ.correctAnswers ||
        adminQ.questionText ||
        "",
    };
  }

  if (typeId === "listening-hiw") {
    return {
      ...base,
      audioUrl: adminQ.audioUrl || "",
      questionText:
        adminQ.questionText ||
        "Listen to the recording and click on the words in the transcript that are different from what the speaker says.",
      words: parseHiwWords(adminQ.passage),
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

export async function getMergedQuestions(typeId, defaultQuestions = []) {
  try {
    const list = await getQuestions();
    const adminList = Array.isArray(list) ? list : [];

    const adminMapped = adminList
      .filter((q) => q && q.type === typeId)
      .map((q) => mapToPractice(q, typeId));

    return [...defaultQuestions, ...adminMapped];
  } catch (error) {
    console.error("getMergedQuestions error:", error);
    return defaultQuestions;
  }
}
