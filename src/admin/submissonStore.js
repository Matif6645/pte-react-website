const STORAGE_KEY = "pte_sst_submissions";

export function getSubmissions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveSubmissions(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function addSubmission(submission) {
  const list = getSubmissions();
  const item = {
    ...submission,
    id: Date.now(),
    status: "pending",
    score: "",
    feedback: "",
    createdAt: new Date().toISOString(),
  };
  list.unshift(item);
  saveSubmissions(list);
  return item;
}

export function updateSubmission(id, updates) {
  const list = getSubmissions();
  const index = list.findIndex((item) => item.id === id);
  if (index === -1) return null;

  list[index] = {
    ...list[index],
    ...updates,
    id: list[index].id,
    updatedAt: new Date().toISOString(),
  };
  saveSubmissions(list);
  return list[index];
}

export function deleteSubmission(id) {
  const list = getSubmissions().filter((item) => item.id !== id);
  saveSubmissions(list);
}

export function getSubmissionsByType(typeId) {
  return getSubmissions().filter((item) => item.type === typeId);
}