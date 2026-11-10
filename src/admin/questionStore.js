import { supabase } from "./supabaseClient";

export const QUESTION_TYPES = [
  // Reading
  {
    id: "fill-blanks-dropdown",
    label: "Fill in the Blanks (Dropdown)",
    skill: "reading",
  },
  { id: "reorder-paragraphs", label: "Reorder Paragraphs", skill: "reading" },
  {
    id: "mcq-multiple",
    label: "Multiple Choice (Multiple Answers)",
    skill: "reading",
  },
  {
    id: "fill-blanks-drag",
    label: "Fill in the Blanks (Drag and Drop)",
    skill: "reading",
  },
  {
    id: "mcq-single",
    label: "Multiple Choice (Single Answer)",
    skill: "reading",
  },
  // Speaking
  { id: "read-aloud", label: "Read Aloud", skill: "speaking" },
  { id: "repeat-sentence", label: "Repeat Sentence", skill: "speaking" },
  { id: "describe-image", label: "Describe Image", skill: "speaking" },
  { id: "retell-lecture", label: "Retell Lecture", skill: "speaking" },
  {
    id: "answer-short-question",
    label: "Answer Short Question",
    skill: "speaking",
  },
  // Writing
  {
    id: "summarize-written-text",
    label: "Summarize Written Text",
    skill: "writing",
  },
  { id: "write-essay", label: "Write Essay", skill: "writing" },
  // Listening
  { id: "listening-sst", label: "Summarize Spoken Text", skill: "listening" },
  {
    id: "listening-mcq-multiple",
    label: "Multiple Choice (Multiple)",
    skill: "listening",
  },
  { id: "listening-fib", label: "Fill in the Blanks", skill: "listening" },
  {
    id: "listening-hcs",
    label: "Highlight Correct Summary",
    skill: "listening",
  },
  {
    id: "listening-mcq-single",
    label: "Multiple Choice (Single)",
    skill: "listening",
  },
  { id: "listening-smw", label: "Select Missing Word", skill: "listening" },
  {
    id: "listening-hiw",
    label: "Highlight Incorrect Words",
    skill: "listening",
  },
  { id: "listening-wfd", label: "Write from Dictation", skill: "listening" },
];

export const ADMIN_NAV_SECTIONS = [
  {
    id: "reading",
    label: "READING",
    icon: "fa-solid fa-book-open",
    items: QUESTION_TYPES.filter((t) => t.skill === "reading"),
  },
  {
    id: "speaking",
    label: "SPEAKING",
    icon: "fa-solid fa-microphone",
    items: QUESTION_TYPES.filter((t) => t.skill === "speaking"),
  },
  {
    id: "writing",
    label: "WRITING",
    icon: "fa-solid fa-pen",
    items: QUESTION_TYPES.filter((t) => t.skill === "writing"),
  },
  {
    id: "listening",
    label: "LISTENING",
    icon: "fa-solid fa-headphones",
    items: QUESTION_TYPES.filter((t) => t.skill === "listening"),
  },
];

export const CATEGORIES = [
  "SCIENCE & TECHNOLOGY",
  "HISTORY",
  "BIOLOGY",
  "MEDICAL SCIENCE",
];

function fromDb(row) {
  if (!row) return null;
  return {
    id: row.id,
    type: row.type,
    title: row.title || "",
    difficulty: row.difficulty || "Easy",
    category: row.category || "SCIENCE & TECHNOLOGY",
    time: row.time || "00:20",
    passage: row.passage || "",
    questionText: row.question_text || "",
    optionA: row.option_a || "",
    optionB: row.option_b || "",
    optionC: row.option_c || "",
    optionD: row.option_d || "",
    optionE: row.option_e || "",
    correctAnswer: row.correct_answer || "A",
    correctAnswers: row.correct_answers || "",
    wordBank: row.word_bank || "",
    paragraphs: row.paragraphs || "",
    audioUrl: row.audio_url || "",
    segments: row.segments || null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toDb(question) {
  return {
    type: question.type,
    title: question.title || "",
    difficulty: question.difficulty || "Easy",
    category: question.category || "SCIENCE & TECHNOLOGY",
    time: question.time || "00:20",
    passage: question.passage || "",
    question_text: question.questionText || "",
    option_a: question.optionA || "",
    option_b: question.optionB || "",
    option_c: question.optionC || "",
    option_d: question.optionD || "",
    option_e: question.optionE || "",
    correct_answer: question.correctAnswer || "A",
    correct_answers: Array.isArray(question.correctAnswers)
      ? question.correctAnswers.join(",")
      : question.correctAnswers || "",
    word_bank: question.wordBank || "",
    paragraphs: question.paragraphs || "",
    audio_url: question.audioUrl || "",
    segments: question.segments || null,
  };
}

export async function getQuestions() {
  const { data, error } = await supabase
    .from("questions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  return (data || []).map(fromDb);
}

export async function addQuestion(question) {
  const { data, error } = await supabase
    .from("questions")
    .insert(toDb(question))
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  return fromDb(data);
}

export async function updateQuestion(id, updates) {
  const { data, error } = await supabase
    .from("questions")
    .update({
      ...toDb(updates),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  return fromDb(data);
}

export async function deleteQuestion(id) {
  const { error } = await supabase.from("questions").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }
}

export async function getQuestionsByType(typeId) {
  const list = await getQuestions();
  return list.filter((q) => q.type === typeId);
}
