import express from "express";
import cors from "cors";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post("/api/score-listening", async (req, res) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return res
        .status(500)
        .json({ error: "OPENAI_API_KEY is missing in .env" });
    }

    const { type, question, correctAnswer, studentAnswer } = req.body;

    if (!studentAnswer?.trim()) {
      return res.status(400).json({ error: "studentAnswer is required" });
    }

    const isEssay = type === "write-essay";
    const isSst = type === "listening-sst";

    let systemPrompt =
      "You are a PTE Listener examiner .Rsturn JSON only: { Score number, feedback: string, mistakes: string[] }";

    if (isEssay) {
      systemPrompt =
        "You are a PTE Writing examiner for Write Essay. Score 0-90. Return JSON only: { score: number, feedback: string, mistakes: string[] }";
    }

    if (isSst) {
      systemPrompt = `You are a PTE Listening examiner for Summarize Spoken Text.
Compare the student's summary with the lecture transcript.
Score 0-90 based on:
1) Content coverage (main ideas from transcript)
2) Grammar and spelling
3) Word count quality (ideal 50-70 words)
Do NOT expect word-for-word copy. Accept paraphrase if meaning matches.
Return JSON only: { score: number, feedback: string, mistakes: string[] }
In mistakes, list missing key points and grammar/spelling errors.`;
    }

    const result = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: isSst
            ? `type=${type}\nquestion=${question}\ntranscript=${correctAnswer || "N/A"}\nstudent=${studentAnswer}`
            : `type=${type}\nquestion=${question}\ncorrect=${correctAnswer || "N/A"}\nstudent=${studentAnswer}`,
        },
      ],
    });

    const content = result.choices[0]?.message?.content;
    if (!content) {
      return res.status(502).json({ error: "Empty response from OpenAI" });
    }

    res.json(JSON.parse(content));
  } catch (err) {
    console.error("AI scoring error:", err);
    res.status(500).json({
      error: err.message || "AI scoring failed",
    });
  }
});

app.listen(3001, () => console.log("AI server on 3001"));
