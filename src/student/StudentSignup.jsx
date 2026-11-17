import { useEffect, useState } from "react";
import "./StudentSignup.css";
import { sendSignupCode, verifySignupCode } from "./studentAuth";

function StudentSignup({ onBackToSite, onSignupSuccess }) {
  const [step, setStep] = useState("form");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [code, setCode] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendIn, setResendIn] = useState(0);

  const cleanEmail = email.trim().toLowerCase();

  useEffect(() => {
    if (resendIn <= 0) return;

    const timer = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendIn]);

  // Ask the server to email a 6-digit code
  async function requestCode() {
    const result = await sendSignupCode(cleanEmail);

    if (!result.ok) {
      setError(result.message);
      return false;
    }

    setResendIn(60);
    return true;
  }

  // =====================================
  // STEP 1: CHECK FORM AND SEND CODE
  // =====================================

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Please enter your full name");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must contain at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      if (await requestCode()) {
        setCode("");
        setStep("code");
        setSuccess(`We sent a 6-digit code to ${cleanEmail}`);
      }
    } catch (err) {
      setError(err.message || "Could not send the code");
    } finally {
      setLoading(false);
    }
  }

  // =====================================
  // STEP 2: VERIFY CODE AND CREATE ACCOUNT
  // =====================================

  async function handleVerify(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!/^\d{6}$/.test(code)) {
      setError("Please enter the 6-digit code");
      return;
    }

    setLoading(true);

    try {
      const result = await verifySignupCode({
        name: name.trim(),
        email: cleanEmail,
        password,
        code,
      });

      if (!result.ok) {
        setError(result.message);
        return;
      }

      // Account created and student is logged in
      onSignupSuccess?.(result.student);
    } catch (err) {
      setError(err.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (resendIn > 0 || loading) return;

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (await requestCode()) {
        setCode("");
        setSuccess("A new code has been sent to your email.");
      }
    } finally {
      setLoading(false);
    }
  }

  // =====================================
  // STEP 2 SCREEN: ENTER CODE
  // =====================================

  if (step === "code") {
    return (
      <div className="student_signup_page">
        <div className="student_signup_card">
          <p className="student_signup_brand">PTE ACADEMY</p>

          <h1>Verify Your Email</h1>
          <p className="student_signup_subtitle">
            Enter the 6-digit code sent to <b>{cleanEmail}</b>. The code
            expires in 10 minutes.
          </p>

          <form onSubmit={handleVerify}>
            <label>
              Verification Code
              <input
                className="student_code_input"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                placeholder="Enter 6-digit code"
                required
                disabled={loading}
                autoFocus
              />
            </label>

            {error && <p className="student_signup_error">{error}</p>}
            {success && <p className="student_signup_success">{success}</p>}

            <button type="submit" disabled={loading}>
              {loading ? "Please wait..." : "Verify & Create Account"}
            </button>
          </form>

          <button
            type="button"
            className="student_back_btn"
            onClick={handleResend}
            disabled={resendIn > 0 || loading}
          >
            {resendIn > 0 ? `Resend code in ${resendIn}s` : "Resend code"}
          </button>

          <button
            type="button"
            className="student_back_btn"
            onClick={() => {
              setStep("form");
              setError("");
              setSuccess("");
            }}
            disabled={loading}
          >
            ← Change email
          </button>
        </div>
      </div>
    );
  }

  // =====================================
  // STEP 1 SCREEN: SIGNUP FORM
  // =====================================

  return (
    <div className="student_signup_page">
      <div className="student_signup_card">
        <p className="student_signup_brand">PTE ACADEMY</p>

        <h1>Create Student Account</h1>
        <p className="student_signup_subtitle">
          Join PTE Academy and start practising.
        </p>

        <form onSubmit={handleSubmit}>
          <label>
            Full Name
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              required
              disabled={loading}
            />
          </label>

          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={loading}
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              required
              disabled={loading}
            />
          </label>

          <label>
            Confirm Password
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
              disabled={loading}
            />
          </label>

          {error && <p className="student_signup_error">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Sending code..." : "Create Account"}
          </button>
        </form>

        <button
          type="button"
          className="student_back_btn"
          onClick={onBackToSite}
        >
          ← Back to website
        </button>
      </div>
    </div>
  );
}

export default StudentSignup;
