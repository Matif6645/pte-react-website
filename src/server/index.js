import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import cors from "cors";
import OpenAI, { toFile } from "openai";
import multer from "multer";
import dotenv from "dotenv";

import { READ_ALOUD_PROMPT, getReadAloudResult } from "./readAloudPrompt.js";
import { SST_PROMPT, getSstResult } from "./sstPrompt.js";
import { ESSAY_PROMPT, getEssayResult } from "./essayPrompt.js";
import { registerSignupRoutes } from "./emailOtp.js";

/* =====================================
   LOAD .env (always from this folder)
===================================== */

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();

app.use(cors());
app.use(express.json());

/* =====================================
   SIGNUP EMAIL CODE ROUTES
   /api/signup/send-code
   /api/signup/verify
===================================== */

registerSignupRoutes(app);

/* =====================================
   READ ALOUD AUDIO UPLOAD CONFIGURATION
===================================== */

// Supported audio types -> file extension
const AUDIO_EXTENSIONS = {
  "audio/webm": "webm",
  "audio/ogg": "ogg",
  "audio/mp4": "mp4",
  "audio/mpeg": "mp3",
  "audio/wav": "wav",
  "audio/x-wav": "wav",
};

// "audio/webm;codecs=opus" -> "audio/webm"
function getBaseAudioType(mimetype) {
  return String(mimetype || "").split(";")[0].trim().toLowerCase();
}

const audioUpload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
    files: 1,
  },

  fileFilter: (req, file, callback) => {
    if (!AUDIO_EXTENSIONS[getBaseAudioType(file.mimetype)]) {
      return callback(new Error("Unsupported audio format."));
    }

    callback(null, true);
  },
});

/* =====================================
   OPENAI CONNECTION
===================================== */

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

/* =====================================
   AI SCORING: ESSAY / SST / OTHERS
===================================== */

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

    if (isEssay) {
      systemPrompt = ESSAY_PROMPT;
    }

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

    if (isEssay) {
      const essayResult = getEssayResult(aiData, studentAnswer);

      return res.json({
        ...essayResult,
        tokenUsage: result.usage?.total_tokens ?? 0,
      });
    }

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

/* ==========================================
   READ ALOUD - OPENAI AUDIO SCORING
   React sends FormData:
   - audio:   the recording (file)
   - passage: the original text
========================================== */

app.post(
  "/api/score-read-aloud",
  (req, res, next) => {
    audioUpload.single("audio")(req, res, (err) => {
      if (err) {
        return res.status(400).json({
          error: err.message || "Audio upload failed.",
        });
      }

      next();
    });
  },

  async (req, res) => {
    try {
      // 1. Check OpenAI connection
      if (!openai) {
        return res.status(500).json({
          error: "OPENAI_API_KEY is missing.",
        });
      }

      // 2. Get uploaded recording
      const audio = req.file;

      if (!audio || !audio.buffer?.length) {
        return res.status(400).json({
          error: "Audio recording is required.",
        });
      }

      if (audio.buffer.length < 1000) {
        return res.status(400).json({
          error: "Recording is too short. Please record again.",
        });
      }

      // 3. Get original Read Aloud passage
      const passage = req.body?.passage;

      if (
        typeof passage !== "string" ||
        !passage.trim() ||
        passage.length > 5000
      ) {
        return res.status(400).json({
          error: "A valid reading passage is required.",
        });
      }

      // 4. Identify audio type and extension
      const audioType = getBaseAudioType(audio.mimetype);
      const extension = AUDIO_EXTENSIONS[audioType] || "webm";

      // 5. Convert audio buffer to an OpenAI file
      const audioFile = await toFile(audio.buffer, `read-aloud.${extension}`, {
        type: audioType,
      });

      // 6. Speech-to-text
      // The passage is NOT sent here, otherwise the model
      // would "correct" the student's mistakes.
      const transcription = await openai.audio.transcriptions.create({
        file: audioFile,
        model: "gpt-4o-mini-transcribe",
        language: "en",
      });

      const studentTranscript = transcription.text?.trim() || "";

      if (!studentTranscript) {
        return res.status(422).json({
          error: "No speech was detected in the recording.",
        });
      }

      // 7. Compare transcript to original passage
      const evaluation = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0,

        response_format: {
          type: "json_object",
        },

        messages: [
          {
            role: "system",
            content: READ_ALOUD_PROMPT,
          },
          {
            role: "user",
            content: `ORIGINAL PASSAGE:\n${passage.trim()}\n\nSTUDENT TRANSCRIPT:\n${studentTranscript}`,
          },
        ],
      });

      // 8. Parse OpenAI evaluation
      const content = evaluation.choices[0]?.message?.content;

      if (!content) {
        return res.status(502).json({
          error: "OpenAI returned an empty evaluation.",
        });
      }

      const aiData = JSON.parse(content);

      // 9. Validate and format result
      const finalResult = getReadAloudResult(aiData);

      // 10. Return to React
      return res.json({
        ...finalResult,
        transcript: studentTranscript,
        originalPassage: passage,
        tokenUsage: evaluation.usage?.total_tokens ?? 0,
      });
    } catch (error) {
      console.error("Read Aloud scoring error:", error);

      return res.status(500).json({
        error: "Read Aloud scoring failed. Check server terminal.",
      });
    }
  },
);

/* =====================================
   START EXPRESS SERVER
===================================== */

app.listen(3001, () => {
  console.log("AI server on 3001");

  if (!process.env.OPENAI_API_KEY) {
    console.warn("Warning: OPENAI_API_KEY is missing in src/server/.env");
  }

  if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
    console.warn("Warning: EMAIL_USER / EMAIL_APP_PASSWORD missing, signup codes will not send");
  }
});
