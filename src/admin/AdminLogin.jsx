import { useState } from "react";
import { supabase } from "./supabaseClient";
import "./AdminLogin.styles.css";

function AdminLogin({ onLoginSuccess, onBackToSite }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Step 1: Authenticate with Supabase
      const { data, error: loginError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (loginError) throw loginError;

      // Step 2: Retrieve the authenticated user's role
      const { data: roleData, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.user.id)
        .maybeSingle();

      if (roleError) throw roleError;

      // Step 3: Route according to role
      const role = roleData?.role || "student";

      onLoginSuccess?.(role);
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

        <h1 className="admin_login_title">Login</h1>

        <p className="admin_login_subtitle">
          Sign in to your PTE Academy account.
        </p>

        <form className="admin_login_form" onSubmit={handleSubmit}>
          <label className="admin_field">
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={loading}
            />
          </label>

          <label className="admin_field">
            <span>Password</span>

            <div className="admin_password_wrap">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                disabled={loading}
              />

              <button
                type="button"
                className="admin_password_eye"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <i
                  className={`fa-solid ${
                    showPassword ? "fa-eye-slash" : "fa-eye"
                  }`}
                />
              </button>
            </div>
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
          Sign in using your registered email and password.
        </p>
      </div>
    </div>
  );
}

export default AdminLogin;
