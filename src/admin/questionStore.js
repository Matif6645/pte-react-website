const STORAGE_KEY = "pte_admin_questions";

export const QUESTION_TYPES = [
  {
    id: "fill-blanks-dropdown",
    label: "Fill in the Blanks (Dropdown)",
  },
  {
    id: "multiple-choice-multiple-answer",
    label: "Multiple Choice (Multiple Answers)",
  },
  {
    id: "reorder-paragraphs",
    label: "Reorder Paragraphs",
  },
  {
    id: "fill-blanks-drag-drop",
    label: "Fill in the Blanks (Drag & Drop)",
  },
  {
    id: "multiple-choice-single-answer",
    label: "Multiple Choice (Single Answer)",
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
  localStorage.setItem(STORAGE_KEY, JSON, stringify(questions));
}

export function addQuestion(question){
    const list = getQuestions()
    const item = {
        ...question,
        id: Date.now(),
        createdAt: new Date().toISOString(),
    }
    list.push(item)
    saveQuestions(list)
    return item

}

export function deleteQuestion(id) {
  const list = getQuestions().filter((q) => q.id !== id)
  saveQuestions(list)

}

export function getQuestionsByType(typeId){
    return getQuestions().filter((q) => q.type === typeId)
}
