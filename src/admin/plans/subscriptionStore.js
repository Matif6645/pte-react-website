import { supabase } from "../supabaseClient";

// Available card designs
export const PLAN_THEMES = [
  { value: "basic", label: "Basic White" },
  { value: "pro", label: "Purple Outline" },
  { value: "premium", label: "Purple Premium" },
  { value: "gold", label: "Gold VIP" },
  { value: "dark", label: "Dark Modern" },
];

// Available billing periods
export const BILLING_PERIODS = [
  { value: "month", label: "Monthly" },
  { value: "year", label: "Yearly" },
];

// Convert a Supabase row to our React format
function mapPlan(row) {
  return {
    id: row.id,
    code: row.code,
    name: row.name,
    description: row.description || "",
    price: Number(row.price ?? 0),
    currency: row.currency || "USD",
    billingPeriod: row.billing_period || "month",
    theme: row.theme || "basic",
    badgeText: row.badge_text || "",
    displayOrder: Number(row.display_order ?? 0),
    privateLessons: Number(row.private_lessons_per_period ?? 0),
    groupClasses: Boolean(row.group_classes_included),
    questionLimit: Number(row.question_limit_daily ?? 0),
    aiScoreLimit: Number(row.ai_score_limit ?? 0),
    mockTests: Number(row.mock_tests_included ?? 0),
    features: Array.isArray(row.features) ? row.features : [],
    isActive: Boolean(row.is_active),
    createdAt: row.created_at,
  };
}

// Convert form values to database fields
function toDatabase(plan) {
  const payload = {
    code: plan.code.trim().toLowerCase(),
    name: plan.name.trim(),
    description: plan.description.trim(),
    price: Number(plan.price),
    currency: plan.currency,
    billing_period: plan.billingPeriod,
    theme: plan.theme,
    badge_text: plan.badgeText.trim(),
    display_order: Number(plan.displayOrder),
    private_lessons_per_period: Number(plan.privateLessons),
    group_classes_included: Boolean(plan.groupClasses),
    question_limit_daily: Number(plan.questionLimit),
    ai_score_limit: Number(plan.aiScoreLimit),
    mock_tests_included: Number(plan.mockTests),
    features: plan.features,
    is_active: Boolean(plan.isActive),
  };

  if (!payload.code || !/^[a-z0-9_]+$/.test(payload.code)) {
    throw new Error("Plan code must contain letters, numbers or underscores.");
  }

  if (!payload.name) {
    throw new Error("Plan name is required.");
  }

  if (!Number.isFinite(payload.price) || payload.price < 0) {
    throw new Error("Enter a valid plan price.");
  }

  const limits = [
    payload.display_order,
    payload.private_lessons_per_period,
    payload.question_limit_daily,
    payload.ai_score_limit,
    payload.mock_tests_included,
  ];

  if (limits.some((value) => !Number.isSafeInteger(value) || value < 0)) {
    throw new Error(
      "Plan limits and display order must be non-negative whole numbers.",
    );
  }

  if (!PLAN_THEMES.some((theme) => theme.value === payload.theme)) {
    throw new Error("Choose a valid plan theme.");
  }

  if (
    !BILLING_PERIODS.some((period) => period.value === payload.billing_period)
  ) {
    throw new Error("Choose a valid billing period.");
  }

  if (!/^[A-Z]{3}$/.test(payload.currency)) {
    throw new Error("Currency must be a 3-letter code.");
  }

  return payload;
}

// ==========================================
// GET ALL PLANS
// ==========================================

export async function getSubscriptionPlans() {
  const { data, error } = await supabase
    .from("subscription_plans")
    .select("*")
    .order("display_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) throw error;

  return (data || []).map(mapPlan);
}

// ==========================================
// CREATE NEW PLAN
// ==========================================

export async function createSubscriptionPlan(plan) {
  const payload = toDatabase(plan);

  const { data, error } = await supabase
    .from("subscription_plans")
    .insert(payload)
    .select()
    .single();

  if (error) throw error;

  return mapPlan(data);
}

// ==========================================
// UPDATE EXISTING PLAN
// ==========================================

export async function updateSubscriptionPlan(id, plan) {
  if (!id) {
    throw new Error("Plan ID is required.");
  }

  const payload = toDatabase(plan);

  // Keep the code stable for existing plans.
  // Codes are used by subscription integrations.
  delete payload.code;

  const { data, error } = await supabase
    .from("subscription_plans")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return mapPlan(data);
}

// ==========================================
// ACTIVATE / DEACTIVATE PLAN
// ==========================================

export async function setSubscriptionPlanActive(id, isActive) {
  const { data, error } = await supabase
    .from("subscription_plans")
    .update({ is_active: Boolean(isActive) })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return mapPlan(data);
}

// ==========================================
// STUDENT SUBSCRIPTION MANAGEMENT
// Add below existing functions
// ==========================================

// 1. Get registered students (admin only)
export async function getRegisteredStudents() {
  const { data, error } = await supabase.rpc("pte_admin_list_students");

  if (error) throw error;

  return (data || []).map((student) => ({
    id: student.user_id,
    email: student.email,
    createdAt: student.created_at,
  }));
}

// 2. Get current and previous subscriptions
export async function getStudentSubscriptions() {
  const { data, error } = await supabase
    .from("student_subscriptions")
    .select(
      `
      id,
      student_id,
      plan_id,
      period_start,
      period_end,
      status,
      created_at,
      subscription_plans (
        id,
        name,
        code,
        private_lessons_per_period,
        group_classes_included
      )
    `,
    )
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data || [];
}

// 3. Assign a subscription to a student
export async function assignStudentSubscription({
  studentId,
  planId,
  startDate,
  endDate,
}) {
  if (!studentId || !planId) {
    throw new Error("Select a student and plan.");
  }

  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);

  if (
    !Number.isFinite(start.getTime()) ||
    !Number.isFinite(end.getTime()) ||
    end <= start
  ) {
    throw new Error("Choose valid subscription dates.");
  }

  const { data, error } = await supabase.rpc("pte_admin_assign_subscription", {
    p_student_id: studentId,
    p_plan_id: planId,
    p_period_start: start.toISOString(),
    p_period_end: end.toISOString(),
  });

  if (error) throw error;

  return data;
}

// 4. Get the signed-in student's subscription
export async function getMySubscription() {
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError) throw userError;

  const user = userData.user;
  if (!user) return null;

  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("student_subscriptions")
    .select(
      `
      id,
      status,
      period_start,
      period_end,
      subscription_plans (
        id,
        name,
        code,
        private_lessons_per_period,
        group_classes_included
      )
    `,
    )
    .eq("student_id", user.id)
    .eq("status", "active")
    .lte("period_start", now)
    .gt("period_end", now)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;

  return data;
}
