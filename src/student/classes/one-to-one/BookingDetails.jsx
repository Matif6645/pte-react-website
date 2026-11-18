function BookingDetails({
  selectedSlot,
  repeatWeekly,
  onRepeatChange,
  remainingLessons,
  onConfirm,
  bookingMessage,
  bookingLoading = false,
}) {
  const teacherTimezone = "Asia/Riyadh";

  const selectedDate = selectedSlot?.dateTime
    ? new Date(selectedSlot.dateTime)
    : null;

  const formattedDate = selectedDate
    ? selectedDate.toLocaleDateString("en-AU", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: teacherTimezone,
      })
    : "";

  const formattedTime = selectedDate
    ? selectedDate.toLocaleTimeString("en-AU", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: teacherTimezone,
      })
    : "";

  const canConfirm =
    Boolean(selectedSlot) &&
    remainingLessons > 0 &&
    !bookingLoading &&
    !repeatWeekly;

  return (
    <section className="booking-details">
      <div className="booking-details-heading">
        <h2>Lesson Details</h2>
        <span>60 minutes</span>
      </div>

      {/* SELECTED LESSON */}

      {selectedSlot ? (
        <div className="booking-selected-lesson">
          <span>SELECTED LESSON</span>

          <h3>{formattedDate}</h3>

          <p>{formattedTime}</p>

          <small>Riyadh time (UTC+3)</small>
        </div>
      ) : (
        <div className="booking-empty">
          <p>
            Please choose an available date and time from the teacher timetable.
          </p>
        </div>
      )}

      {/* REPEAT WEEKLY */}

      <div className="booking-repeat-option">
        <label>
          <input
            type="checkbox"
            checked={repeatWeekly}
            onChange={(e) => onRepeatChange(e.target.checked)}
            disabled={bookingLoading}
          />

          <span>
            <strong>Repeat Weekly</strong>

            <small>Same day and time every week</small>
          </span>
        </label>
      </div>

      {repeatWeekly && (
        <div className="booking-repeat-info">
          <p>
            Recurring bookings are not available yet. Untick Repeat Weekly to
            book one lesson.
          </p>
        </div>
      )}

      {/* LESSON CREDITS */}

      <div className="booking-balance">
        <span>Remaining lesson credits</span>
        <strong>{remainingLessons}</strong>
      </div>

      {remainingLessons <= 0 && (
        <p className="booking-warning">
          You have no private lessons remaining in your current subscription.
        </p>
      )}

      {/* CONFIRM BOOKING */}

      <button
        type="button"
        className="booking-confirm-button"
        disabled={!canConfirm}
        onClick={onConfirm}
      >
        {bookingLoading ? "Confirming Booking..." : "Confirm Booking"}
      </button>

      {/* BOOKING RESULT */}

      {bookingMessage && (
        <div className="booking-success" role="status">
          {bookingMessage}
        </div>
      )}

      <p className="booking-demo-note">
        Your booking request will be submitted for teacher confirmation. One
        lesson credit is allocated to each pending booking.
      </p>
    </section>
  );
}

export default BookingDetails;
