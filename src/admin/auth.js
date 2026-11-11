const ADMIN_KEY = "pte_admin_logged_in";

const ADMIN_EMAIL = "admin@pte.com";
const ADMIN_PASSWORD = "admin123";

export function login(email, password) {
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    localStorage.setItem(ADMIN_KEY, "true");
    return { ok: true };
  }

  return { ok: false, message: "Invalid email or password" };
}

export function logout() {
  localStorage.removeItem(ADMIN_KEY);
}

export function isAdminLoggedIn() {
  return localStorage.getItem(ADMIN_KEY) === "true";
}
