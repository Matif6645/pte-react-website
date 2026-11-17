import { useState } from "react";
import { supabase } from "../admin/supabaseClient";
import "../admin/AdminLogin.styles.css";

function ResetPassword({ onSuccess }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password.length < 12) {
      setError("Use at least 12 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const { data: sessionData } = await supabase.auth.getSession();

      if (!sessionData.session) {
        throw new Error(
          "Recovery session not found. Request a new reset email.",
        );
      }

      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) throw updateError;

      setSuccess("Password updated successfully!");
      setPassword("");
      setConfirmPassword("");

      await supabase.auth.signOut();

      setTimeout(() => {
        onSuccess?.();
      }, 1500);
    } catch (err) {
      setError(err.message || "Password reset failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin_login_page">
      <div className="admin_login_card">
        <p className="admin_login_eyebrow">PTE ACADEMY</p>

        <h1 className="admin_login_title">Reset Password</h1>

        <p className="admin_login_subtitle">
          Create a new password for your account.
        </p>

        <form className="admin_login_form" onSubmit={handleSubmit}>
          <label className="admin_field">
            <span>New Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              required
              minLength={12}
            />
          </label>

          <label className="admin_field">
            <span>Confirm Password</span>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
              minLength={12}
            />
          </label>

          {error && <p className="admin_login_error">{error}</p>}

          {success && <p>{success}</p>}

          <button
            type="submit"
            className="admin_login_submit"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
