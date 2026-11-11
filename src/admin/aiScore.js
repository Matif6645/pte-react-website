export async function scoreListening({
  type,
  question,
  correctAnswer,
  studentAnswer,
}) {
  const res = await fetch("http://localhost:3001/api/score-listening", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type,
      question,
      correctAnswer,
      studentAnswer,
    }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || `AI scoring failed: ${res.status}`);
  }

  return data;
}