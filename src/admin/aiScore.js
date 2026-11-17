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

/* =========================================
   READ ALOUD - AI SCORING API
========================================= */

export async function scoreReadAloud(audioBlob, passage) {
  // Check if audio recording exists
  if (!(audioBlob instanceof Blob) || audioBlob.size === 0) {
    throw new Error("Please record your voice first.");
  }

  // Check if reading passage exists
  if (typeof passage !== "string" || !passage.trim()) {
    throw new Error("Reading passage is missing.");
  }

  // Prepare audio file for upload
  const formData = new FormData();

  const mimeType = audioBlob.type.split(";")[0];

  const extension =
    mimeType === "audio/mp4"
      ? "mp4"
      : mimeType === "audio/mpeg"
        ? "mp3"
        : mimeType === "audio/wav" || mimeType === "audio/x-wav"
          ? "wav"
          : "webm";

  // Attach student recording
  formData.append("audio", audioBlob, `read-aloud.${extension}`);

  // Attach original passage
  formData.append("passage", passage);

  // Send recording to Express server
  const response = await fetch("http://localhost:3001/api/score-read-aloud", {
    method: "POST",
    body: formData,
  });

  // Receive evaluation results
  const data = await response.json().catch(() => ({}));

  // Handle errors
  if (!response.ok) {
    throw new Error(
      data.error || `Read Aloud scoring failed: ${response.status}`,
    );
  }

  // Send AI result back to ReadAloud.jsx
  return data;
}
