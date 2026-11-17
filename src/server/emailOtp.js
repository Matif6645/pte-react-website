import crypto from "node:crypto";
import nodemailer from "nodemailer";
import { createClient } from "@supabase/supabase-js";

const CODE_VALID_MS = 10 * 60 * 1000;
const RESEND_WAIT_MS = 60 * 1000;
const MAX_ATTEMPTS = 5;

const pendingCodes = new Map();

const hashCode = (code) =>
  crypto.createHash("sha256").update(String(code)).digest("hex");

const isEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

function getMailer() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });
}

function getSupabaseAdmin() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return null;
  }

  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } },
  );
}

export function registerSignupRoutes(app) {
  app.post("/api/signup/send-code", async (req, res) => {
    try {
      const email = String(req.body?.email || "")
        .trim()
        .toLowerCase();

      if (!isEmail(email)) {
        return res.status(400).json({ error: "Please enter a valid email" });
      }

      if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
        return res.status(500).json({
          error: "EMAIL_USER or EMAIL_APP_PASSWORD is missing in server .env",
        });
      }

      const previous = pendingCodes.get(email);

      if (previous && Date.now() - previous.sentAt < RESEND_WAIT_MS) {
        const wait = Math.ceil(
          (RESEND_WAIT_MS - (Date.now() - previous.sentAt)) / 1000,
        );
        return res.status(429).json({
          error: `Please wait ${wait} seconds before requesting a new code`,
        });
      }

      const code = String(crypto.randomInt(100000, 1000000));

      await getMailer().sendMail({
        from: `"PTE Academy" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Your PTE Academy verification code",
        text: `Your PTE Academy verification code is ${code}. It expires in 10 minutes.`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:420px;margin:auto;padding:24px;border:1px solid #ede9fe;border-radius:12px">
            <h2 style="color:#6d28d9;margin:0 0 12px">PTE Academy</h2>
            <p>Use this code to verify your email and create your account:</p>
            <p style="font-size:32px;font-weight:bold;letter-spacing:8px;color:#192744;margin:20px 0">${code}</p>
            <p style="color:#6b7280;font-size:13px">This code expires in 10 minutes. If you did not request it, ignore this email.</p>
          </div>
        `,
      });

      pendingCodes.set(email, {
        codeHash: hashCode(code),
        expiresAt: Date.now() + CODE_VALID_MS,
        sentAt: Date.now(),
        attempts: 0,
      });

      return res.json({ ok: true, expiresInMinutes: 10 });
    } catch (err) {
      console.error("Send code error:", err);
      return res.status(500).json({
        error:
          "Could not send the email. Check EMAIL_USER and EMAIL_APP_PASSWORD.",
      });
    }
  });

  // STEP 2: check the code, then create the Supabase account
  app.post("/api/signup/verify", async (req, res) => {
    try {
      const name = String(req.body?.name || "").trim();
      const email = String(req.body?.email || "")
        .trim()
        .toLowerCase();
      const password = String(req.body?.password || "");
      const code = String(req.body?.code || "").trim();

      if (!name || !isEmail(email) || password.length < 8) {
        return res
          .status(400)
          .json({ error: "Name, email and password are required" });
      }

      const entry = pendingCodes.get(email);

      if (!entry) {
        return res
          .status(400)
          .json({ error: "No code found. Please request a new code." });
      }

      if (Date.now() > entry.expiresAt) {
        pendingCodes.delete(email);
        return res
          .status(400)
          .json({ error: "Code expired. Please request a new code." });
      }

      if (entry.attempts >= MAX_ATTEMPTS) {
        pendingCodes.delete(email);
        return res.status(429).json({
          error: "Too many wrong attempts. Please request a new code.",
        });
      }

      if (hashCode(code) !== entry.codeHash) {
        entry.attempts += 1;
        return res.status(400).json({
          error: `Incorrect code. ${MAX_ATTEMPTS - entry.attempts} attempts left.`,
        });
      }

      const supabase = getSupabaseAdmin();

      if (!supabase) {
        return res.status(500).json({
          error:
            "SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing in server .env",
        });
      }

      const { error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: name },
      });

      if (error) {
        if (/already|registered|exists/i.test(error.message)) {
          pendingCodes.delete(email);
          return res.status(409).json({
            error: "An account with this email already exists. Please log in.",
          });
        }
        return res.status(400).json({ error: error.message });
      }

      pendingCodes.delete(email);
      return res.json({ ok: true });
    } catch (err) {
      console.error("Verify code error:", err);
      return res
        .status(500)
        .json({ error: "Verification failed. Check server terminal." });
    }
  });
}
