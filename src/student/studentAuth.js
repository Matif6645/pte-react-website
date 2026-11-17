import { supabase } from "../admin/supabaseClient";

// Express server (emailOtp.js routes)
const API_URL = "http://localhost:3001";

// =====================================
// OLD SIGNUP (direct Supabase, no email code)
// Not used by StudentSignup.jsx anymore.
// =====================================

export async function signupStudent(name, email, password) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
      },
    },
  });

  if (error) {
    return { ok: false, message: error.message };
  }

  return {
    ok: true,
    user: data.user,
    session: data.session,
  };
}

// =====================================
// HELPER: send JSON to the Express server
// =====================================

async function postJson(path, body) {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    return {
      ok: false,
      message: data.error || `Request failed (${res.status})`,
    };
  }

  return { ok: true, ...data };
}

// =====================================
// SIGNUP STEP 1: email a 6-digit code
// =====================================

export async function sendSignupCode(email) {
  try {
    return await postJson("/api/signup/send-code", { email });
  } catch {
    return {
      ok: false,
      message: "Cannot reach the server. Is it running on port 3001?",
    };
  }
}

// =====================================
// SIGNUP STEP 2: check code, create account, log in
// =====================================

export async function verifySignupCode({ name, email, password, code }) {
  // Server checks the code and creates the Supabase account
  try {
    const result = await postJson("/api/signup/verify", {
      name,
      email,
      password,
      code,
    });

    if (!result.ok) return result;
  } catch {
    return {
      ok: false,
      message: "Cannot reach the server. Is it running on port 3001?",
    };
  }

  // Account is ready: log the student in
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      ok: false,
      message: "Account created, but login failed. Please log in manually.",
    };
  }

  return { ok: true, student: data.user };
}
