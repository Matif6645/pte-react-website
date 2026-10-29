import { supabase } from "./supabaseClient";

export const QUESTION_TYPES = [
  {
    id: "fill-blanks-dropdown",
    label: "Fill in the Blanks (Dropdown)",
  },
  {
    id: "reorder-paragraphs",
    label: "Reorder Paragraphs",
  },
  {
    id: "mcq-multiple",
    label: "Multiple Choice (Multiple Answers)",
  },
  {
    id: "fill-blanks-drag",
    label: "Fill in the Blanks (Drag and Drop)",
  },
  {
    id: "mcq-single",
    label: "Multiple Choice (Single Answer)",
  },
];

export const CATEGORIES = [
  "SCIENCE & TECHNOLOGY",
  "HISTORY",
  "BIOLOGY",
  "MEDICAL SCIENCE",
];

function rowToQuestion(row) {
  return {
    id: row.id,
    type: row.type,
    title: row.title,
    difficulty: row.difficulty,
    category: row.category,
    time: row.time,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    ...(row.payload && typeof row.payload === "object" ? row.payload : {}),
  };
}

function questionToRow(question) {
  const {
    id: _id,
    type,
    title,
    difficulty,
    category,
    time,
    createdAt: _createdAt,
    updatedAt: _updatedAt,
    created_at: _created_at,
    updated_at: _updated_at,
    ...payload
  } = question;

  return {
    type,
    title,
    difficulty,
    category,
    time,
    payload,
  };
}

export async function getQuestions() {
  const { data, error } = await supabase
    .from("questions")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("getQuestions error:", error);
    throw error;
  }

  return (data || []).map(rowToQuestion);
}

export async function addQuestion(question) {
  const row = questionToRow(question);
  const { data, error } = await supabase
    .from("questions")
    .insert(row)
    .select()
    .single();

  if (error) {
    console.error("addQuestion error:", error);
    throw error;
  }

  return rowToQuestion(data);
}

export async function updateQuestion(id, updates) {
  const row = {
    ...questionToRow(updates),
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("questions")
    .update(row)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("updateQuestion error:", error);
    throw error;
  }

  return rowToQuestion(data);
}

export async function deleteQuestion(id) {
  const { error } = await supabase.from("questions").delete().eq("id", id);

  if (error) {
    console.error("deleteQuestion error:", error);
    throw error;
  }
}

export async function getQuestionsByType(typeId) {
  const list = await getQuestions();
  return list.filter((q) => q.type === typeId);
}
