
import { useState } from "react";

// Sample teacher availability by weekday.
// Sunday = 0, Monday = 1, ... Saturday = 6.
const availability = {
  0: [],
  1: ["09:00", "10:00", "17:00", "18:00"],
  2: ["10:00", "11:00", "18:00"],
  3: ["09:00", "14:00", "17:00"],
  4: ["10:00", "15:00", "18:00"],
  5: ["14:00", "15:00", "19:00"],
  6: ["10:00", "11:00", "16:00"],
};

const ALL_TIMES = [
  "09:00",
  "10:00",
  "11:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
];

function getMonday(date) {
  const monday = new Date(date);

  monday.setHours(0, 0, 0, 0);
  monday.setDate(
    monday.getDate() -
      ((monday.getDay() + 6) % 7)
  );

  return monday;
}

function TeacherTimetable({
  selectedSlot,
  onSelectSlot,
  disabled = false,
}) {
  const [weekStart, setWeekStart] = useState(() =>
    getMonday(new Date())
  );

  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(weekStart);
    date.setDate(date.getDate() + index);
    return date;
  });

  function changeWeek(direction) {
    const nextWeek = new Date(weekStart);

    nextWeek.setDate(
      nextWeek.getDate() + direction * 7
    );

    if (nextWeek < getMonday(new Date())) return;

    setWeekStart(nextWeek);
    onSelectSlot(null);
  }

  function getSlot(date, time) {
    const [hours, minutes] = time
      .split(":")
      .map(Number);

    const slotDate = new Date(date);
    slotDate.setHours(hours, minutes, 0, 0);

    return {
      dateTime: slotDate.toISOString(),
      label: `${slotDate.toLocaleDateString(
        "en-AU",
        { dateStyle: "full" }
      )} at ${time}`,
    };
  }

  return (
    <section className="teacher-timetable">
      <div className="teacher-timetable-header">
        <div>
          <h2>Teacher Availability</h2>

          <p>
            {days[0].toLocaleDateString("en-AU", {
              day: "numeric",
              month: "short",
            })}
            {" – "}
            {days[6].toLocaleDateString("en-AU", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>

        <div className="teacher-week-navigation">
          <button
            type="button"
            onClick={() => changeWeek(-1)}
            disabled={
              weekStart <= getMonday(new Date())
            }
            aria-label="Previous week"
          >
            ←
          </button>

          <button
            type="button"
            onClick={() => changeWeek(1)}
            aria-label="Next week"
          >
            →
          </button>
        </div>
      </div>

      <p className="teacher-timetable-note">
        Select an available time below.
        Times are shown in your device timezone
        for this demo.
      </p>

      <div className="teacher-timetable-scroll">
        <div className="teacher-timetable-grid">
          <div className="teacher-grid-corner">
            Time
          </div>

          {days.map((date) => (
            <div
              className="teacher-day-heading"
              key={date.toDateString()}
            >
              <strong>
                {date.toLocaleDateString("en-AU", {
                  weekday: "short",
                })}
              </strong>

              <span>{date.getDate()}</span>
            </div>
          ))}

          {ALL_TIMES.map((time) => (
            <div
              className="teacher-time-row"
              key={time}
            >
              <div className="teacher-time-label">
                {time}
              </div>

              {days.map((date) => {
                const isAvailable = (
                  availability[date.getDay()] || []
                ).includes(time);

                const slot = getSlot(date, time);

                const isPast =
                  new Date(slot.dateTime) <= new Date();

                const isSelected =
                  selectedSlot?.dateTime ===
                  slot.dateTime;

                return (
                  <div
                    className="teacher-time-cell"
                    key={`${date.toDateString()}-${time}`}
                  >
                    {isAvailable ? (
                      <button
                        type="button"
                        className={
                          isSelected
                            ? "teacher-time-slot selected"
                            : "teacher-time-slot"
                        }
                        disabled={disabled || isPast}
                        aria-pressed={isSelected}
                        onClick={() => onSelectSlot(slot)}
                      >
                        {time}
                      </button>
                    ) : (
                      <span className="teacher-unavailable">
                        —
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TeacherTimetable;
