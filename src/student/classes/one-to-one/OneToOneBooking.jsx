import { useState } from "react";

import TeacherTimetable from "./TeacherTimetable";
import LessonCredits from "./LessonCredits";
import BookingDetails from "./BookingDetails";

import "./OneToOneBooking.css";

function OneToOneBooking() {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [repeatWeekly, setRepeatWeekly] = useState(false);
  const [bookingMessage, setBookingMessage] = useState("");

  // Temporary subscription data
  const subscription = {
    name: "Practice + Tutors",
    totalLessons: 4,
    bookedLessons: 1,
  };

  const remainingLessons = Math.max(
    0,
    subscription.totalLessons - subscription.bookedLessons,
  );

  function handleConfirmBooking() {
    if (!selectedSlot || remainingLessons <= 0) return;

    setBookingMessage(
      "Demo selection confirmed. No actual booking was created.",
    );
  }

  return (
    <div className="one-to-one-page">
      <div className="one-to-one-header">
        <span className="one-to-one-eyebrow">PTE ACADEMY</span>

        <h1>Book a Private Lesson</h1>

        <p>Choose an available time with your PTE teacher.</p>
      </div>

      <div className="one-to-one-teacher">
        <div className="one-to-one-avatar">T</div>

        <div>
          <h2>Your PTE Teacher</h2>
          <p>One-to-One Online Lesson · 60 minutes</p>
        </div>
      </div>

      <LessonCredits
        packageName={subscription.name}
        total={subscription.totalLessons}
        booked={subscription.bookedLessons}
      />

      <div className="one-to-one-booking-grid">
        <TeacherTimetable
          selectedSlot={selectedSlot}
          onSelectSlot={(slot) => {
            setSelectedSlot(slot);
            setBookingMessage("");
          }}
          disabled={remainingLessons <= 0}
        />

        <BookingDetails
          selectedSlot={selectedSlot}
          repeatWeekly={repeatWeekly}
          onRepeatChange={(checked) => {
            setRepeatWeekly(checked);
            setBookingMessage("");
          }}
          remainingLessons={remainingLessons}
          onConfirm={handleConfirmBooking}
          bookingMessage={bookingMessage}
        />
      </div>
    </div>
  );
}

export default OneToOneBooking;
