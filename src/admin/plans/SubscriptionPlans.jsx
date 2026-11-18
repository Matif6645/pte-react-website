import { useEffect, useState } from "react";

import {
  getSubscriptionPlans,
  createSubscriptionPlan,
  updateSubscriptionPlan,
  setSubscriptionPlanActive,
  PLAN_THEMES,
  BILLING_PERIODS,
  getRegisteredStudents,
  getStudentSubscriptions,
  assignStudentSubscription,
} from "./subscriptionStore";

import "./SubscriptionPlans.css";

const EMPTY_PLAN = {
  code: "",
  name: "",
  description: "",
  price: 0,
  currency: "USD",
  billingPeriod: "month",
  theme: "basic",
  badgeText: "",
  displayOrder: 0,
  privateLessons: 0,
  groupClasses: false,
  questionLimit: 20,
  aiScoreLimit: 0,
  mockTests: 1,
  features: [],
  isActive: false,
};

function localDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function defaultSubscriptionDates() {
  const start = new Date();
  const end = new Date(start);
  end.setDate(end.getDate() + 30);
  return { startDate: localDate(start), endDate: localDate(end) };
}

function SubscriptionPlans() {
  const [activeTab, setActiveTab] = useState("plans");
  const [students, setStudents] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [search, setSearch] = useState("");
  const [studentId, setStudentId] = useState("");
  const [planId, setPlanId] = useState("");
  const [dates, setDates] = useState(defaultSubscriptionDates);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [studentError, setStudentError] = useState("");
  const [studentMessage, setStudentMessage] = useState("");
  const [plans, setPlans] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ ...EMPTY_PLAN });
  const [featuresText, setFeaturesText] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // ======================================
  // LOAD PLANS
  // ======================================

  async function loadPlans() {
    try {
      setLoading(true);
      setError("");

      const result = await getSubscriptionPlans();
      setPlans(result);
    } catch (err) {
      setError(err.message || "Could not load plans.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPlans();
  }, []);

  // ======================================
  // LOAD STUDENT SUBSCRIPTIONS (ADMIN ONLY)
  // ======================================

  async function loadStudents() {
    setLoadingStudents(true);
    setStudentError("");
    try {
      const [studentsResult, subscriptionsResult] = await Promise.all([
        getRegisteredStudents(),
        getStudentSubscriptions(),
      ]);
      setStudents(studentsResult);
      setSubscriptions(subscriptionsResult);
    } catch (err) {
      setStudentError(err.message || "Could not load registered students.");
    } finally {
      setLoadingStudents(false);
    }
  }

  useEffect(() => {
    if (activeTab === "students") loadStudents();
  }, [activeTab]);

  function currentSubscription(student) {
    const now = Date.now();
    return subscriptions.find(
      (item) =>
        item.student_id === student.id &&
        item.status === "active" &&
        new Date(item.period_start).getTime() <= now &&
        new Date(item.period_end).getTime() > now,
    );
  }

  async function handleAssignSubscription(event) {
    event.preventDefault();
    setStudentError("");
    setStudentMessage("");
    if (!studentId || !planId) {
      setStudentError("Select a student and a subscription plan.");
      return;
    }
    setAssigning(true);
    try {
      await assignStudentSubscription({
        studentId,
        planId,
        startDate: dates.startDate,
        endDate: dates.endDate,
      });
      await loadStudents();
      setStudentMessage("Student subscription assigned successfully.");
    } catch (err) {
      setStudentError(err.message || "Unable to assign subscription.");
    } finally {
      setAssigning(false);
    }
  }

  // ======================================
  // FORM HELPERS
  // ======================================

  function updateField(field, value) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  function openNewPlan() {
    setEditingId(null);
    setForm({
      ...EMPTY_PLAN,
      displayOrder: plans.length + 1,
      features: [],
    });
    setFeaturesText("");
    setError("");
    setMessage("");
    setShowForm(true);
  }

  function openEditPlan(plan) {
    setEditingId(plan.id);
    setForm({
      ...plan,
      features: [...plan.features],
    });
    setFeaturesText(plan.features.join("\n"));
    setError("");
    setMessage("");
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setForm({ ...EMPTY_PLAN });
    setFeaturesText("");
  }

  // ======================================
  // SAVE PLAN
  // ======================================

  async function handleSave(event) {
    event.preventDefault();

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const features = featuresText
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean);

      const payload = {
        ...form,
        features,
      };

      if (editingId) {
        await updateSubscriptionPlan(editingId, payload);
        setMessage("Subscription plan updated.");
      } else {
        await createSubscriptionPlan(payload);
        setMessage("New subscription plan created.");
      }

      closeForm();
      await loadPlans();
    } catch (err) {
      setError(err.message || "Unable to save plan.");
    } finally {
      setSaving(false);
    }
  }

  // ======================================
  // ACTIVATE / DEACTIVATE
  // ======================================

  async function handleToggle(plan) {
    const nextStatus = !plan.isActive;

    if (!nextStatus) {
      const confirmed = window.confirm(
        `Deactivate ${plan.name}? It will be hidden from the public pricing page.`,
      );

      if (!confirmed) return;
    }

    try {
      setBusyId(plan.id);
      setError("");
      setMessage("");

      await setSubscriptionPlanActive(plan.id, nextStatus);

      await loadPlans();

      setMessage(
        nextStatus ? `${plan.name} activated.` : `${plan.name} deactivated.`,
      );
    } catch (err) {
      setError(err.message || "Unable to update status.");
    } finally {
      setBusyId(null);
    }
  }

  // ======================================
  // FORMAT PRICE
  // ======================================

  function formatPrice(plan) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: plan.currency || "USD",
    }).format(plan.price);
  }

  // ======================================
  // PLAN CARD
  // ======================================

  function renderPlanCard(plan) {
    const validTheme = PLAN_THEMES.some((item) => item.value === plan.theme);

    const theme = validTheme ? plan.theme : "basic";

    return (
      <div
        key={plan.id}
        className={`sp-plan-card sp-theme-${theme} ${
          !plan.isActive ? "sp-inactive" : ""
        }`}
      >
        <div className="sp-plan-card-top">
          <span className="sp-plan-badge">
            {plan.badgeText || "SUBSCRIPTION"}
          </span>

          <span
            className={`sp-status ${plan.isActive ? "active" : "inactive"}`}
          >
            {plan.isActive ? "Active" : "Inactive"}
          </span>
        </div>

        <div className="sp-plan-icon">
          {theme === "premium" || theme === "gold" ? "♛" : "✦"}
        </div>

        <h2>{plan.name}</h2>

        <p className="sp-plan-description">{plan.description}</p>

        <div className="sp-price">
          <strong>{formatPrice(plan)}</strong>

          <span>/ {plan.billingPeriod}</span>
        </div>

        <div className="sp-plan-benefits">
          <div>
            <span>Daily Questions</span>
            <strong>{plan.questionLimit}</strong>
          </div>

          <div>
            <span>AI Scores / Period</span>
            <strong>{plan.aiScoreLimit}</strong>
          </div>

          <div>
            <span>Mock Tests</span>
            <strong>{plan.mockTests}</strong>
          </div>

          <div>
            <span>Private Lessons</span>
            <strong>{plan.privateLessons}</strong>
          </div>

          <div>
            <span>Weekly Group Classes</span>
            <strong>{plan.groupClasses ? "Included" : "Locked"}</strong>
          </div>
        </div>

        {plan.features.length > 0 && (
          <ul className="sp-feature-list">
            {plan.features.map((feature, index) => (
              <li key={`${index}-${feature}`}>
                <span>✓</span>
                {feature}
              </li>
            ))}
          </ul>
        )}

        <div className="sp-card-actions">
          <button
            type="button"
            className="sp-edit-button"
            onClick={() => openEditPlan(plan)}
          >
            Edit Plan
          </button>

          <button
            type="button"
            className="sp-toggle-button"
            disabled={busyId === plan.id}
            onClick={() => handleToggle(plan)}
          >
            {busyId === plan.id
              ? "Updating..."
              : plan.isActive
                ? "Deactivate"
                : "Activate"}
          </button>
        </div>
      </div>
    );
  }

  // ======================================
  // RENDER PAGE
  // ======================================

  return (
    <div className="sp-page">
      <div className="sp-page-header">
        <div>
          <span className="sp-eyebrow">PTE ACADEMY</span>

          <h1>
            {activeTab === "plans"
              ? "Subscription Plans"
              : "Student Subscriptions"}
          </h1>

          <p>
            {activeTab === "plans"
              ? "Manage packages, pricing, benefits and card designs."
              : "Assign Free, Pro or Premium subscriptions without payments."}
          </p>
        </div>

        {activeTab === "plans" && (
          <button
            type="button"
            className="sp-primary-button"
            onClick={openNewPlan}
          >
            + Add New Plan
          </button>
        )}
      </div>

      {message && (
        <div className="sp-message" role="status">
          {message}
        </div>
      )}

      {error && (
        <div className="sp-error" role="alert">
          {error}
        </div>
      )}

      <div
        className="sp-tabs"
        role="tablist"
        aria-label="Subscription management"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "plans"}
          className={activeTab === "plans" ? "sp-tab active" : "sp-tab"}
          onClick={() => setActiveTab("plans")}
        >
          Manage Plans
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "students"}
          className={activeTab === "students" ? "sp-tab active" : "sp-tab"}
          onClick={() => {
            closeForm();
            setActiveTab("students");
          }}
        >
          Student Subscriptions
        </button>
      </div>

      {activeTab === "plans" ? (
        <>
          <div className="sp-summary">
            <div>
              <strong>{plans.length}</strong>
              <span>Total Plans</span>
            </div>

            <div>
              <strong>{plans.filter((plan) => plan.isActive).length}</strong>
              <span>Active Plans</span>
            </div>

            <div>
              <strong>{plans.filter((plan) => !plan.isActive).length}</strong>
              <span>Inactive Plans</span>
            </div>
          </div>

          {loading ? (
            <p className="sp-loading">Loading subscription plans...</p>
          ) : plans.length === 0 ? (
            <div className="sp-empty">No subscription plans found.</div>
          ) : (
            <div className="sp-plans-grid">{plans.map(renderPlanCard)}</div>
          )}
        </>
      ) : (
        <div className="sp-student-section">
          {studentError && (
            <div className="sp-error" role="alert">
              {studentError}
            </div>
          )}
          {studentMessage && (
            <div className="sp-message" role="status">
              {studentMessage}
            </div>
          )}

          <div className="sp-student-panel">
            <div className="sp-student-head">
              <h2>Assign a Subscription</h2>
              <button
                type="button"
                onClick={loadStudents}
                disabled={loadingStudents || assigning}
              >
                {loadingStudents ? "Loading..." : "Refresh Students"}
              </button>
            </div>
            <form
              className="sp-student-form"
              onSubmit={handleAssignSubscription}
            >
              <label className="sp-student-wide">
                Search by Email
                <input
                  type="search"
                  value={search}
                  placeholder="Search registered students..."
                  onChange={(e) => setSearch(e.target.value)}
                />
              </label>
              <label className="sp-student-wide">
                Select Student
                <select
                  required
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                >
                  <option value="">Choose a registered student</option>
                  {students
                    .filter((student) =>
                      student.email
                        .toLowerCase()
                        .includes(search.toLowerCase().trim()),
                    )
                    .map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.email}
                      </option>
                    ))}
                </select>
              </label>
              <label className="sp-student-wide">
                Subscription Plan
                <select
                  required
                  value={planId}
                  onChange={(e) => setPlanId(e.target.value)}
                >
                  <option value="">Choose a plan</option>
                  {plans
                    .filter((plan) => plan.isActive)
                    .map((plan) => (
                      <option key={plan.id} value={plan.id}>
                        {plan.name} · {plan.currency} {plan.price} ·{" "}
                        {plan.privateLessons} private lessons
                      </option>
                    ))}
                </select>
              </label>
              <label>
                Start Date
                <input
                  type="date"
                  required
                  value={dates.startDate}
                  onChange={(e) =>
                    setDates((prev) => ({ ...prev, startDate: e.target.value }))
                  }
                />
              </label>
              <label>
                End Date (Exclusive)
                <input
                  type="date"
                  required
                  value={dates.endDate}
                  onChange={(e) =>
                    setDates((prev) => ({ ...prev, endDate: e.target.value }))
                  }
                />
              </label>
              <button
                className="sp-primary-button sp-student-wide"
                type="submit"
                disabled={assigning || loadingStudents || !studentId || !planId}
              >
                {assigning ? "Assigning..." : "Assign Subscription"}
              </button>
            </form>
            <p className="sp-student-help">
              No payment is charged. The chosen end date is exclusive. Assigning
              a new plan cancels the student's previous active subscription
              record. A future-starting assignment will not become accessible
              until its start date.
            </p>
          </div>
          <div className="sp-student-panel">
            <h2>Registered Students</h2>
            {loadingStudents ? (
              <p>Loading...</p>
            ) : (
              <div className="sp-student-table-wrap">
                <table className="sp-student-table">
                  <thead>
                    <tr>
                      <th>Student Email</th>
                      <th>Current Plan</th>
                      <th>Valid Until</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students
                      .filter((student) =>
                        student.email
                          .toLowerCase()
                          .includes(search.toLowerCase().trim()),
                      )
                      .map((student) => {
                        const active = currentSubscription(student);
                        const plan = active?.subscription_plans;
                        return (
                          <tr key={student.id}>
                            <td>{student.email}</td>
                            <td>
                              {plan?.name || "Free / No active assignment"}
                            </td>
                            <td>
                              {active
                                ? new Date(
                                    active.period_end,
                                  ).toLocaleDateString("en-AU")
                                : "—"}
                            </td>
                            <td>
                              <button
                                type="button"
                                onClick={() => {
                                  setStudentId(student.id);
                                  setPlanId(active?.plan_id || "");
                                }}
                              >
                                Select
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
                {students.length === 0 && <p>No registered students found.</p>}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ====================================
          ADD / EDIT FORM
      ==================================== */}

      {showForm && (
        <div className="sp-modal-backdrop">
          <div
            className="sp-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="sp-form-title"
          >
            <div className="sp-modal-header">
              <h2 id="sp-form-title">
                {editingId ? "Edit Plan" : "Create Plan"}
              </h2>

              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                aria-label="Close plan editor"
                className="sp-close-button"
              >
                ×
              </button>
            </div>

            <form className="sp-form" onSubmit={handleSave}>
              <div className="sp-form-grid">
                <label>
                  Plan Name
                  <input
                    value={form.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    required
                    placeholder="e.g. VIP Coaching"
                  />
                </label>

                <label>
                  Plan Code
                  <input
                    value={form.code}
                    disabled={Boolean(editingId)}
                    onChange={(e) =>
                      updateField("code", e.target.value.toLowerCase())
                    }
                    required
                    placeholder="vip_coaching"
                  />
                </label>

                <label className="sp-full-width">
                  Description
                  <textarea
                    rows={2}
                    value={form.description}
                    onChange={(e) => updateField("description", e.target.value)}
                  />
                </label>

                <label>
                  Price
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => updateField("price", e.target.value)}
                    required
                  />
                </label>

                <label>
                  Currency
                  <select
                    value={form.currency}
                    onChange={(e) => updateField("currency", e.target.value)}
                  >
                    <option value="USD">USD</option>
                    <option value="AUD">AUD</option>
                    <option value="SAR">SAR</option>
                  </select>
                </label>

                <label>
                  Billing Period
                  <select
                    value={form.billingPeriod}
                    onChange={(e) =>
                      updateField("billingPeriod", e.target.value)
                    }
                  >
                    {BILLING_PERIODS.map((period) => (
                      <option key={period.value} value={period.value}>
                        {period.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  CSS Theme
                  <select
                    value={form.theme}
                    onChange={(e) => updateField("theme", e.target.value)}
                  >
                    {PLAN_THEMES.map((theme) => (
                      <option key={theme.value} value={theme.value}>
                        {theme.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Badge Text
                  <input
                    value={form.badgeText}
                    onChange={(e) => updateField("badgeText", e.target.value)}
                    placeholder="MOST POPULAR"
                  />
                </label>

                <label>
                  Display Order
                  <input
                    type="number"
                    min="0"
                    value={form.displayOrder}
                    onChange={(e) =>
                      updateField("displayOrder", e.target.value)
                    }
                  />
                </label>

                <label>
                  Daily Question Limit
                  <input
                    type="number"
                    min="0"
                    value={form.questionLimit}
                    onChange={(e) =>
                      updateField("questionLimit", e.target.value)
                    }
                  />
                </label>

                <label>
                  AI Scoring Allowance
                  <input
                    type="number"
                    min="0"
                    value={form.aiScoreLimit}
                    onChange={(e) =>
                      updateField("aiScoreLimit", e.target.value)
                    }
                  />
                </label>

                <label>
                  Mock Tests Included
                  <input
                    type="number"
                    min="0"
                    value={form.mockTests}
                    onChange={(e) => updateField("mockTests", e.target.value)}
                  />
                </label>

                <label>
                  Private Lessons per Period
                  <input
                    type="number"
                    min="0"
                    value={form.privateLessons}
                    onChange={(e) =>
                      updateField("privateLessons", e.target.value)
                    }
                  />
                </label>

                <label className="sp-check-label">
                  <input
                    type="checkbox"
                    checked={form.groupClasses}
                    onChange={(e) =>
                      updateField("groupClasses", e.target.checked)
                    }
                  />
                  Include Weekly Group Classes
                </label>

                <label className="sp-check-label">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => updateField("isActive", e.target.checked)}
                  />
                  Active / Visible on Pricing Page
                </label>

                <label className="sp-full-width">
                  Features (one per line)
                  <textarea
                    rows={6}
                    value={featuresText}
                    onChange={(e) => setFeaturesText(e.target.value)}
                    placeholder={
                      "20 Questions per Day\nVocabulary Practice\nProgress Tracking"
                    }
                  />
                </label>
              </div>

              <div className="sp-form-actions">
                <button
                  type="button"
                  className="sp-cancel-button"
                  onClick={closeForm}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="sp-primary-button"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Update Plan"
                      : "Create Plan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default SubscriptionPlans;
