import express from "express";
import cors from "cors";
import OpenAI from "openai";
import dotenv from "dotenv";

import { SST_PROMPT, getSstResult } from "./sstPrompt.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Connect OpenAI API
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

// API route for AI scoring
app.post("/api/score-listening", async (req, res) => {
  try {
    // Check API key
    if (!openai) {
      return res.status(500).json({
        error: "OPENAI_API_KEY is missing in .env",
      });
    }

    // Get data from student practice page
    const { type, question, correctAnswer, studentAnswer } = req.body || {};

    // Check student answer
    if (typeof studentAnswer !== "string" || !studentAnswer.trim()) {
      return res.status(400).json({
        error: "studentAnswer is required",
      });
    }

    // Identify question type
    const isEssay = type === "write-essay";
    const isSst = type === "listening-sst";

    // Check SST lecture transcript
    if (isSst && (typeof correctAnswer !== "string" || !correctAnswer.trim())) {
      return res.status(400).json({
        error: "Lecture transcript is required",
      });
    }

    // Default AI scoring instructions
    let systemPrompt = `
You are a PTE practice evaluator.

Return valid JSON only:
{
  "score": 0,
  "feedback": "",
  "mistakes": []
}
`;

    // Essay instructions (temporary)
    if (isEssay) {
      systemPrompt = `
You are a PTE Writing practice evaluator.

Evaluate the student's Write Essay answer.
Give an estimated practice score from 0 to 90.

Return valid JSON only:
{
  "score": 0,
  "feedback": "",
  "mistakes": []
}
`;
    }

    // SST prompt from separate file
    if (isSst) {
      systemPrompt = SST_PROMPT;
    }

    // Send request to OpenAI
    const result = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0,
      response_format: {
        type: "json_object",
      },

      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: isSst
            ? `type=${type}\nquestion=${question}\ntranscript=${correctAnswer}\nstudent=${studentAnswer}`
            : `type=${type}\nquestion=${question}\ncorrect=${correctAnswer || "N/A"}\nstudent=${studentAnswer}`,
        },
      ],
    });

    // Read AI response
    const content = result.choices[0]?.message?.content;

    if (!content) {
      return res.status(502).json({
        error: "Empty response from OpenAI",
      });
    }

    // Convert JSON into JavaScript object
    const aiData = JSON.parse(content);

    // Calculate SST marks using sstPrompt.js
    if (isSst) {
      const sstResult = getSstResult(aiData, studentAnswer);

      return res.json({
        ...sstResult,
        tokenUsage: result.usage?.total_tokens ?? 0,
      });
    }

    // Other question types
    return res.json(aiData);
  } catch (err) {
    console.error("AI scoring error:", err);

    return res.status(500).json({
      error: "AI scoring failed. Check server terminal.",
    });
  }
});

// Start Express server
app.listen(3001, () => {
  console.log("AI server on 3001");
});
