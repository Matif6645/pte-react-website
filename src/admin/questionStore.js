const STORAGE_KEY = "pte_admin_questions";

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

export function getQuestions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveQuestions(questions) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
}

export function addQuestion(question) {
  const list = getQuestions();
  const item = {
    ...question,
    id: Date.now(),
    createdAt: new Date().toISOString(),
  };
  list.push(item);
  saveQuestions(list);
  return item;
}

export function updateQuestion(id, updates) {
  const list = getQuestions();
  const index = list.findIndex((q) => q.id === id);
  if (index === -1) return null;

  list[index] = {
    ...list[index],
    ...updates,
    id: list[index].id,
    updatedAt: new Date().toISOString(),
  };
  saveQuestions(list);
  return list[index];
}

export function deleteQuestion(id) {
  const list = getQuestions().filter((q) => q.id !== id);
  saveQuestions(list);
}

export function getQuestionsByType(typeId) {
  return getQuestions().filter((q) => q.type === typeId);
}
