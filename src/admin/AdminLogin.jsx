import { useState } from "react";
import { login } from "./auth";
import "./AdminLogin.css";

function AdminLogin({ onLoginSuccess, onBackToSite }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await login(email.trim(), password);

      if (!result.ok) {
        setError(result.message);
        return;
      }

      onLoginSuccess?.();
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin_login_page">
      <div className="admin_login_card">
        <p className="admin_login_eyebrow">PTE ACADEMY</p>
        <h1 className="admin_login_title">Admin Login</h1>
        <p className="admin_login_subtitle">
          Sign in to manage questions and practice content.
        </p>

        <form className="admin_login_form" onSubmit={handleSubmit}>
          <label className="admin_field">
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@yourdomain.com"
              required
              disabled={loading}
            />
          </label>

          <label className="admin_field">
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
              disabled={loading}
            />
          </label>

          {error && <p className="admin_login_error">{error}</p>}

          <button
            type="submit"
            className="admin_login_submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <button
          type="button"
          className="admin_back_site_btn"
          onClick={onBackToSite}
        >
          ← Back to website
        </button>

        <p className="admin_login_hint">
          Use the admin email and password from your Supabase Auth users.
        </p>
      </div>
    </div>
  );
}

export default AdminLogin;
