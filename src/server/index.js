
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
  const { type, question, correctAnswer, studentAnswer } = req.body;

  const result = await openai.chat.completions.create({
   model: "gpt-5-nano",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          "PTE Listening examiner. Return JSON: { score: number, feedback: string, mistakes: string[] }",
      },
      {
        role: "user",
        content: `type=${type}\nquestion=${question}\ncorrect=${correctAnswer}\nstudent=${studentAnswer}`,
      },
    ],
  });

  res.json(JSON.parse(result.choices[0].message.content));
});

app.listen(3001, () => console.log("AI server on 3001"));