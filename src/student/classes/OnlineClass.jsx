import { useState } from "react";

import OneToOneBooking from "./one-to-one/OneToOneBooking";
import WeeklyClasses from "./WeeklyClasses";

import "./OnlineClass.css";

function OnlineClass() {
  const [activePage, setActivePage] = useState("home");

  // Open One-to-One Booking
  if (activePage === "one-to-one") {
    return (
      <div className="online-class-home">
        <button
          className="online-class-back"
          onClick={() => setActivePage("home")}
        >
          ← Back to Online Classes
        </button>

        <OneToOneBooking />
      </div>
    );
  }

  // Open Weekly Classes
  if (activePage === "weekly") {
    return (
      <div className="online-class-home">
        <button
          className="online-class-back"
          onClick={() => setActivePage("home")}
        >
          ← Back to Online Classes
        </button>

        <WeeklyClasses />
      </div>
    );
  }

  return (
    <div className="online-class-home">
      <div className="online-class-heading">
        <h1>Online Classes</h1>
        <p>
          Improve your PTE skills with live teacher-led classes and individual
          lessons.
        </p>
      </div>

      <div className="online-class-cards">
        {/* Weekly Group Classes */}
        <div className="online-class-card">
          <div className="online-class-icon">📅</div>

          <h2>Weekly Group Classes</h2>

          <p>
            Join scheduled PTE classes covering Speaking, Writing, Reading and
            Listening.
          </p>

          <button
            className="online-class-button"
            onClick={() => setActivePage("weekly")}
          >
            View Weekly Classes
          </button>
        </div>

        {/* One-to-One Booking */}
        <div className="online-class-card">
          <div className="online-class-icon">👩‍🏫</div>

          <h2>One-to-One Booking</h2>

          <p>
            Book a private PTE lesson with your teacher using an available time
            slot.
          </p>

          <button
            className="online-class-button"
            onClick={() => setActivePage("one-to-one")}
          >
            Book Private Lesson →
          </button>
        </div>
      </div>
    </div>
  );
}

export default OnlineClass;
