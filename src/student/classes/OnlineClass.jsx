import { useState } from "react";

import OneToOneBooking from "./one-to-one/OneToOneBooking";
import WeeklyClasses from "./WeeklyClasses";
import MyBookings from "./MyBookings";

import "./OnlineClass.css";

function OnlineClass({
  loadingAccess = true,
  planName = "Free",
  canAccessGroupClasses = false,
  canBookPrivateLessons = false,
  privateLessons = 0,
  onViewPlans,
}) {
  const [activePage, setActivePage] = useState("home");

  // =====================================
  // MY BOOKINGS
  // =====================================

  if (activePage === "my-bookings") {
    return (
      <div className="online-class-home">
        <MyBookings onBack={() => setActivePage("home")} />
      </div>
    );
  }

  // =====================================
  // WEEKLY GROUP CLASSES
  // =====================================

  if (activePage === "weekly" && canAccessGroupClasses && !loadingAccess) {
    return (
      <div className="online-class-home">
        <button
          type="button"
          className="online-class-back"
          onClick={() => setActivePage("home")}
        >
          ← Back to Online Classes
        </button>

        <WeeklyClasses hasAccess={true} />
      </div>
    );
  }

  // =====================================
  // ONE-TO-ONE PRIVATE LESSONS
  // =====================================

  if (activePage === "one-to-one" && canBookPrivateLessons && !loadingAccess) {
    return (
      <div className="online-class-home">
        <button
          type="button"
          className="online-class-back"
          onClick={() => setActivePage("home")}
        >
          ← Back to Online Classes
        </button>

        <OneToOneBooking planName={planName} privateLessons={privateLessons} />
      </div>
    );
  }

  // =====================================
  // ONLINE CLASSES HOME PAGE
  // =====================================

  return (
    <div className="online-class-home">
      {/* PAGE HEADER */}

      <div className="online-class-heading">
        <h1>Online Classes</h1>

        <p>
          Improve your PTE skills with live teacher-led classes and individual
          lessons.
        </p>
      </div>

      {/* CLASS CARDS */}

      <div className="online-class-cards">
        {/* WEEKLY GROUP CLASSES */}

        <div className="online-class-card">
          <div className="online-class-icon">📅</div>

          <h2>Weekly Group Classes</h2>

          <p>
            Join scheduled Speaking, Writing, Reading and Listening classes with
            your teacher.
          </p>

          {!loadingAccess && !canAccessGroupClasses && (
            <p className="online-class-locked">🔒 Subscription Required</p>
          )}

          <button
            type="button"
            className="online-class-button"
            disabled={loadingAccess}
            onClick={() => {
              if (canAccessGroupClasses) {
                setActivePage("weekly");
              } else {
                onViewPlans?.();
              }
            }}
          >
            {loadingAccess
              ? "Checking Subscription..."
              : canAccessGroupClasses
                ? "View Weekly Classes"
                : "🔒 Unlock Group Classes"}
          </button>
        </div>

        {/* ONE-TO-ONE LESSONS */}

        <div className="online-class-card">
          <div className="online-class-icon">👩‍🏫</div>

          <h2>One-to-One Lessons</h2>

          <p>
            Book private PTE coaching sessions with your teacher using available
            appointment times.
          </p>

          {!loadingAccess && !canBookPrivateLessons && (
            <p className="online-class-locked">🔒 Subscription Required</p>
          )}

          <button
            type="button"
            className="online-class-button"
            disabled={loadingAccess}
            onClick={() => {
              if (canBookPrivateLessons) {
                setActivePage("one-to-one");
              } else {
                onViewPlans?.();
              }
            }}
          >
            {loadingAccess
              ? "Checking Subscription..."
              : canBookPrivateLessons
                ? "Book Private Lesson →"
                : "🔒 Unlock Private Lessons"}
          </button>
        </div>
      </div>

      {/* =====================================
          MY PRIVATE LESSON BOOKINGS
      ===================================== */}

      <div className="online-my-bookings">
        <div className="online-my-bookings-info">
          <h2>My Private Lesson Bookings</h2>

          <p>
            View your upcoming and previous lessons, booking status, teacher
            notes and meeting links.
          </p>
        </div>

        <button
          type="button"
          className="online-class-button"
          onClick={() => setActivePage("my-bookings")}
        >
          📅 View My Bookings
        </button>
      </div>
    </div>
  );
}

export default OnlineClass;
