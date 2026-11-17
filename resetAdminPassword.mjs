import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

const { error } = await supabase.auth.admin.updateUserById(
  process.env.ADMIN_USER_ID,
  {
    password: process.env.NEW_ADMIN_PASSWORD,
  },
);

if (error) {
  console.error("Error:", error.message);
} else {
  console.log("Admin password updated successfully!");
}
