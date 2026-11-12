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

// ============================================
// TYPE -> TABLE MAPPING
// ============================================

const OPT4 = ["option_a", "option_b", "option_c", "option_d"];
const OPT5 = [...OPT4, "option_e"];
const OPT6 = [...OPT5, "option_f"];

const TABLES = {
  // Reading
  "fill-blanks-dropdown": { table: "fill_blanks_dropdown", columns: [] },
  "fill-blanks-drag": { table: "fill_blanks_drag_drop", columns: [] },
  "reorder-paragraphs": { table: "reorder_paragraphs", columns: [] },
  "mcq-multiple": {
    table: "multiple_choice_multiple",
    columns: ["question_text", ...OPT5],
  },
  "mcq-single": {
    table: "multiple_choice_single",
    columns: ["question_text", ...OPT4],
  },

  // Speaking
  "read-aloud": { table: "speaking_read_aloud", columns: ["passage"] },
  "repeat-sentence": {
    table: "speaking_repeat_sentence",
    columns: ["audio_url", "transcript"],
  },
  "describe-image": {
    table: "speaking_describe_image",
    columns: ["image_url", "sample_answer"],
  },
  "retell-lecture": {
    table: "speaking_retell_lecture",
    columns: ["audio_url", "image_url", "transcript", "sample_answer"],
  },
  "answer-short-question": {
    table: "speaking_answer_short_question",
    columns: ["question_text", "audio_url", "correct_answer"],
  },

  // Writing
  "summarize-written-text": {
    table: "writing_summarize_written_text",
    columns: ["passage", "sample_answer"],
  },
  "write-essay": {
    table: "writing_write_essay",
    columns: ["question_text", "sample_answer"],
  },

  // Listening
  "listening-sst": {
    table: "listening_summarize_spoken_text",
    columns: ["question_text", "audio_url", "transcript", "correct_answer"],
  },
  "listening-mcq-multiple": {
    table: "listening_mcq_multiple",
    columns: ["question_text", "audio_url", ...OPT6, "correct_answers"],
  },
  "listening-fib": {
    table: "listening_fill_blanks",
    columns: ["question_text", "audio_url", "transcript", "blanks"],
  },
  "listening-hcs": {
    table: "listening_highlight_correct_summary",
    columns: ["question_text", "audio_url", ...OPT4, "correct_answer"],
  },
  "listening-mcq-single": {
    table: "listening_mcq_single",
    columns: ["question_text", "audio_url", ...OPT4, "correct_answer"],
  },
  "listening-smw": {
    table: "listening_select_missing_word",
    columns: ["question_text", "audio_url", ...OPT4, "correct_answer"],
  },
  "listening-hiw": {
    table: "listening_highlight_incorrect_words",
    columns: ["question_text", "audio_url", "transcript", "incorrect_words"],
  },
  "listening-wfd": {
    table: "listening_write_from_dictation",
    columns: ["question_text", "audio_url", "transcript", "correct_answer"],
  },
};

// db column -> app field
const FIELD_MAP = {
  passage: "passage",
  question_text: "questionText",
  option_a: "optionA",
  option_b: "optionB",
  option_c: "optionC",
  option_d: "optionD",
  option_e: "optionE",
  option_f: "optionF",
  correct_answer: "correctAnswer",
  correct_answers: "correctAnswers",
  audio_url: "audioUrl",
  image_url: "imageUrl",
  transcript: "transcript",
  sample_answer: "sampleAnswer",
  blanks: "blanks",
  incorrect_words: "incorrectWords",
};

// jsonb array columns
const ARRAY_COLUMNS = ["correct_answers", "blanks", "incorrect_words"];

function getTable(type) {
  const config = TABLES[type];
  if (!config) throw new Error(`Unknown question type: ${type}`);
  return config;
}

function toArray(value) {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  return String(value)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function handleError(error, label) {
  if (error) {
    console.error(label, error);
    throw new Error(label ? `${label}: ${error.message}` : error.message);
  }
}

// ============================================
// CONVERTERS
// ============================================

function fromDb(row, type) {
  if (!row) return null;
  const { columns } = getTable(type);

  const question = {
    passage: "",
    questionText: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    optionE: "",
    correctAnswer: "A",
    correctAnswers: "",
    wordBank: "",
    paragraphs: "",
    audioUrl: "",
    segments: null,
    // payload mein jo bhi save hai (wordBank, paragraphs, segments...)
    ...(row.payload || {}),
    id: row.id,
    type,
    title: row.title || "",
    difficulty: row.difficulty || "Easy",
    category: row.category || "SCIENCE & TECHNOLOGY",
    time: row.time || "00:20",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };

  // asli columns payload se zyada important hain
  for (const col of columns) {
    const value = row[col];
    if (value === null || value === undefined || value === "") continue;
    question[FIELD_MAP[col]] =
      col === "correct_answers" ? toArray(value).join(",") : value;
  }

  return question;
}

function toDb(question) {
  const { columns } = getTable(question.type);

  const payload = { ...question };
  delete payload.id;
  delete payload.createdAt;
  delete payload.updatedAt;

  const row = {
    type: question.type,
    title: question.title || "",
    difficulty: question.difficulty || "Easy",
    category: question.category || "SCIENCE & TECHNOLOGY",
    time: question.time || "00:20",
    payload,
  };

  for (const col of columns) {
    const value = question[FIELD_MAP[col]];
    row[col] = ARRAY_COLUMNS.includes(col) ? toArray(value) : value || "";
  }

  return row;
}

// ============================================
// CRUD
// ============================================

export async function getQuestions() {
  const results = await Promise.all(
    Object.entries(TABLES).map(async ([type, { table }]) => {
      const { data, error } = await supabase.from(table).select("*");
      handleError(error, table);
      return (data || []).map((row) => fromDb(row, type));
    }),
  );

  return results
    .flat()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function getQuestionsByType(typeId) {
  const { table } = getTable(typeId);
  const { data, error } = await supabase
    .from(table)
    .select("*")
    .order("created_at", { ascending: false });

  handleError(error, table);
  return (data || []).map((row) => fromDb(row, typeId));
}

export async function addQuestion(question) {
  const { table } = getTable(question.type);
  const { data, error } = await supabase
    .from(table)
    .insert(toDb(question))
    .select()
    .single();

  handleError(error, table);
  return fromDb(data, question.type);
}

export async function updateQuestion(id, updates) {
  const { table } = getTable(updates.type);
  const { data, error } = await supabase
    .from(table)
    .update(toDb(updates))
    .eq("id", id)
    .select()
    .single();

  handleError(error, table);
  return fromDb(data, updates.type);
}

export async function deleteQuestion(id, type) {
  const { table } = getTable(type);
  const { error } = await supabase.from(table).delete().eq("id", id);

  handleError(error, table);
}
