import { supabase } from "./supabaseClient";

export async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { ok: false, message: error.message || "Invalid email or password" };
  }

  return { ok: true, session: data.session };
}

export async function logout() {
  await supabase.auth.signOut();
}

export async function getAdminSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) return null;
  return data.session;
}

export async function isAdminLoggedIn() {
  const session = await getAdminSession();
  return Boolean(session);
}

export function onAuthChange(callback) {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session);
  });

  return () => subscription.unsubscribe();
}
