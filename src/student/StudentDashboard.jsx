import { useEffect, useState } from "react";

import StudentSidebar from "./layout/StudentSidebar";
import StudentHome from "./home/StudentHome";
import MockExamHome from "./mock/MockExamHome";
import OnlineClass from "./classes/OnlineClass";

import { supabase } from "../admin/supabaseClient";
import { getMySubscription } from "../admin/plans/subscriptionStore";

import "./StudentDashboard.css";

const FREE_ACCESS = {
  name: "Free",
  code: "free",
  groupClasses: false,
  privateLessons: 0,
};

function StudentDashboard({ onLogout, onStartPractice }) {
  const [activePage, setActivePage] = useState("dashboard");

  const [access, setAccess] = useState(FREE_ACCESS);
  const [loadingPlan, setLoadingPlan] = useState(true);
  const [planError, setPlanError] = useState("");

  // ========================================
  // LOAD REAL SUBSCRIPTION
  // ========================================

  useEffect(() => {
    let cancelled = false;

    async function loadSubscription() {
      setLoadingPlan(true);
      setPlanError("");

      try {
        const subscription = await getMySubscription();
        if (cancelled) return;

        const plan = subscription?.subscription_plans;

        if (!plan) {
          setAccess(FREE_ACCESS);
          return;
        }

        setAccess({
          name: plan.name || "Free",
          code: plan.code || "free",
          groupClasses: plan.group_classes_included === true,
          privateLessons: Number(plan.private_lessons_per_period ?? 0),
        });
      } catch (error) {
        if (!cancelled) {
          console.error("Subscription error:", error);
          setPlanError("Could not verify your subscription.");
          setAccess(FREE_ACCESS);
        }
      } finally {
        if (!cancelled) {
          setLoadingPlan(false);
        }
      }
    }

    loadSubscription();

    // Recheck when authentication changes
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      loadSubscription();
    });

    return () => {
      cancelled = true;
      listener.subscription.unsubscribe();
    };
  }, []);

  // ========================================
  // ACCESS PERMISSIONS
  // ========================================

  const canAccessGroupClasses =
    !loadingPlan && !planError && access.groupClasses;

  const canBookPrivateLessons =
    !loadingPlan && !planError && access.privateLessons > 0;

  // ========================================
  // RENDER PAGE
  // ========================================

  function renderPage() {
    switch (activePage) {
      case "practice":
        return (
          <section className="student-section">
            <h1>Practice Tests</h1>
            <p>Practise your PTE exam questions.</p>
            <button type="button" onClick={onStartPractice}>
              Start Practice
            </button>
          </section>
        );

      case "mock":
        return <MockExamHome />;

      case "classes":
        return (
          <OnlineClass
            loadingAccess={loadingPlan}
            canAccessGroupClasses={canAccessGroupClasses}
            canBookPrivateLessons={canBookPrivateLessons}
            privateLessons={access.privateLessons}
            onViewPlans={() => setActivePage("plans")}
          />
        );

      case "plans":
        return (
          <section className="student-section">
            <h1>Subscription Plans</h1>
            <p>Choose a plan that includes the classes you need.</p>
            <p>
              Online plan upgrades are not yet available. Contact PTE Academy to
              request an upgrade.
            </p>
            <button type="button" onClick={() => setActivePage("classes")}>
              Back to Online Classes
            </button>
          </section>
        );

      default:
        return (
          <StudentHome
            onNavigate={setActivePage}
            onStartPractice={onStartPractice}
          />
        );
    }
  }

  return (
    <div className="student-layout">
      <StudentSidebar
        activePage={activePage}
        onNavigate={setActivePage}
        onLogout={onLogout}
        studentName="Student"
        packageName={loadingPlan ? "Checking Plan..." : access.name}
      />

      <main className="student-main">
        {planError && (
          <p role="alert" style={{ color: "#b91c1c" }}>
            {planError} Class access is temporarily locked.
          </p>
        )}

        {renderPage()}
      </main>
    </div>
  );
}

export default StudentDashboard;
