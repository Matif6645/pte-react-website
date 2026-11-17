
function BookingDetails({
  selectedSlot,
  repeatWeekly,
  onRepeatChange,
  remainingLessons,
  onConfirm,
  bookingMessage,
}) {
  return (
    <section className="booking-details">
      <div className="booking-details-heading">
        <h2>Lesson Details</h2>
        <span>60 minutes</span>
      </div>

      {selectedSlot ? (
        <div className="booking-selected-lesson">
          <span>SELECTED LESSON</span>

          <h3>
            {new Date(
              selectedSlot.dateTime
            ).toLocaleDateString("en-AU", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </h3>

          <p>
            {new Date(
              selectedSlot.dateTime
            ).toLocaleTimeString("en-AU", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </p>
        </div>
      ) : (
        <div className="booking-empty">
          <p>
            Please choose an available date and time
            from the teacher timetable.
          </p>
        </div>
      )}

      <div className="booking-repeat-option">
        <label>
          <input
            type="checkbox"
            checked={repeatWeekly}
            onChange={(e) =>
              onRepeatChange(e.target.checked)
            }
          />

          <span>
            <strong>Repeat Weekly</strong>
            <small>
              Same day and time every week
            </small>
          </span>
        </label>
      </div>

      {repeatWeekly && (
        <div className="booking-repeat-info">
          <p>
            Recurring lessons will be scheduled
            according to your remaining subscription
            credits and the teacher's availability.
          </p>

          <p>
            Future dates must be checked before
            a recurring booking can be confirmed.
          </p>
        </div>
      )}

      <div className="booking-balance">
        <span>Remaining lesson credits</span>
        <strong>{remainingLessons}</strong>
      </div>

      {remainingLessons <= 0 && (
        <p className="booking-warning">
          You have no private lessons remaining
          in your current subscription.
        </p>
      )}

      <button
        type="button"
        className="booking-confirm-button"
        disabled={
          !selectedSlot || remainingLessons <= 0
        }
        onClick={onConfirm}
      >
        Confirm Demo Booking
      </button>

      {bookingMessage && (
        <div
          className="booking-success"
          role="status"
        >
          {bookingMessage}
        </div>
      )}

      <p className="booking-demo-note">
        Demo only. No actual lesson is booked
        or deducted from your subscription.
      </p>
    </section>
  );
}

export default BookingDetails;
