import { useEffect, useMemo, useState } from "react";

import { supabase } from "../../../admin/supabaseClient";
import "./TeacherTimetable.css";

// This must match the timezone in the SQL function.
const TEACHER_TIMEZONE = "Asia/Riyadh";
const LESSON_MINUTES = 60;

// YYYY-MM-DD from UTC date fields.
function dateKey(date) {
  return [
    date.getUTCFullYear(),
    String(date.getUTCMonth() + 1).padStart(2, "0"),
    String(date.getUTCDate()).padStart(2, "0"),
  ].join("-");
}

// Current calendar date in Riyadh.
function getTeacherToday() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TEACHER_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const values = Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  );

  return new Date(`${values.year}-${values.month}-${values.day}T00:00:00Z`);
}

function getMonday(date) {
  const monday = new Date(date);

  monday.setUTCHours(0, 0, 0, 0);

  monday.setUTCDate(monday.getUTCDate() - ((monday.getUTCDay() + 6) % 7));

  return monday;
}

function minutesFromTime(value) {
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
}

function timeFromMinutes(value) {
  return (
    String(Math.floor(value / 60)).padStart(2, "0") +
    ":" +
    String(value % 60).padStart(2, "0")
  );
}

function formatDate(date, options) {
  return date.toLocaleDateString("en-AU", {
    timeZone: "UTC",
    ...options,
  });
}

function TeacherTimetable({
  selectedSlot,
  onSelectSlot,
  disabled = false,
  refreshKey = 0,
}) {
  const [weekStart, setWeekStart] = useState(() =>
    getMonday(getTeacherToday()),
  );

  const [availability, setAvailability] = useState([]);
  const [reservedSlots, setReservedSlots] = useState(new Set());

  const [loading, setLoading] = useState(true);
  const [loadingReserved, setLoadingReserved] = useState(true);
  const [error, setError] = useState("");

  const days = useMemo(() => {
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(weekStart);
      date.setUTCDate(date.getUTCDate() + index);
      return date;
    });
  }, [weekStart]);

  // ======================================
  // LOAD WEEKLY TEACHER AVAILABILITY
  // ======================================

  useEffect(() => {
    let cancelled = false;

    async function loadAvailability() {
      try {
        setLoading(true);

        const { data, error: fetchError } = await supabase
          .from("teacher_availability")
          .select("weekday, start_time, end_time")
          .eq("is_active", true)
          .order("start_time");

        if (fetchError) throw fetchError;

        if (!cancelled) {
          setAvailability(data || []);
          setError("");
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Could not load availability.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadAvailability();

    return () => {
      cancelled = true;
    };
  }, []);

  // ======================================
  // LOAD ALREADY-BOOKED LESSON TIMES
  // ======================================

  useEffect(() => {
    let cancelled = false;

    async function loadReserved() {
      setLoadingReserved(true);
      setReservedSlots(new Set());

      try {
        const fromDate = dateKey(days[0]);
        const toDate = dateKey(days[6]);

        const { data, error: fetchError } = await supabase.rpc(
          "pte_get_reserved_slots",
          {
            p_from_date: fromDate,
            p_to_date: toDate,
          },
        );

        if (fetchError) throw fetchError;

        if (!cancelled) {
          setReservedSlots(
            new Set(
              (data || []).map((row) => new Date(row.lesson_at).toISOString()),
            ),
          );
          setError("");
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Could not check reserved slots.");
        }
      } finally {
        if (!cancelled) setLoadingReserved(false);
      }
    }

    loadReserved();

    return () => {
      cancelled = true;
    };
  }, [days, refreshKey]);

  // ======================================
  // GENERATE 60-MINUTE TIME SLOTS
  // ======================================

  const slotsByWeekday = useMemo(() => {
    const result = {
      0: new Set(),
      1: new Set(),
      2: new Set(),
      3: new Set(),
      4: new Set(),
      5: new Set(),
      6: new Set(),
    };

    availability.forEach((period) => {
      const weekday = Number(period.weekday);

      if (!result[weekday]) return;

      const start = minutesFromTime(period.start_time);
      const end = minutesFromTime(period.end_time);

      for (
        let minute = start;
        minute + LESSON_MINUTES <= end;
        minute += LESSON_MINUTES
      ) {
        result[weekday].add(timeFromMinutes(minute));
      }
    });

    return result;
  }, [availability]);

  const allTimes = useMemo(() => {
    const times = new Set();

    Object.values(slotsByWeekday).forEach((slots) => {
      slots.forEach((time) => times.add(time));
    });

    return [...times].sort((a, b) => minutesFromTime(a) - minutesFromTime(b));
  }, [slotsByWeekday]);

  // ======================================
  // SELECTED SLOT DATA
  // ======================================

  function makeSlot(date, time) {
    const teacherDate = dateKey(date);

    // Asia/Riyadh has a fixed UTC+03:00 offset.
    // Change this conversion if the teacher
    // timezone changes.
    const dateTime = new Date(`${teacherDate}T${time}:00+03:00`).toISOString();

    return {
      teacherDate,
      startTime: time,
      dateTime,
      label:
        `${formatDate(date, { dateStyle: "full" })}` +
        ` at ${time} (Riyadh time)`,
    };
  }

  // ======================================
  // WEEK NAVIGATION
  // ======================================

  function changeWeek(direction) {
    const nextWeek = new Date(weekStart);

    nextWeek.setUTCDate(nextWeek.getUTCDate() + direction * 7);

    if (nextWeek < getMonday(getTeacherToday())) {
      return;
    }

    setWeekStart(nextWeek);
    onSelectSlot?.(null);
  }

  const cannotSelect = disabled || loading || loadingReserved || Boolean(error);

  // ======================================
  // RENDER
  // ======================================

  return (
    <section className="teacher-timetable">
      <div className="teacher-timetable-header">
        <div>
          <h2>Teacher Availability</h2>

          <p>
            {formatDate(days[0], {
              day: "numeric",
              month: "short",
            })}
            {" – "}
            {formatDate(days[6], {
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
            disabled={weekStart <= getMonday(getTeacherToday())}
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
        All appointment times shown in Riyadh time (UTC+3). Reserved times are
        unavailable.
      </p>

      {(loading || loadingReserved) && (
        <p role="status">Checking available lessons...</p>
      )}

      {error && (
        <p role="alert" style={{ color: "#dc2626" }}>
          {error}
        </p>
      )}

      {!loading && !error && allTimes.length === 0 && (
        <p>No teacher availability has been published.</p>
      )}

      {!loading && allTimes.length > 0 && (
        <div className="teacher-timetable-scroll">
          <div className="teacher-timetable-grid">
            <div className="teacher-grid-corner">Time</div>

            {days.map((date) => (
              <div className="teacher-day-heading" key={dateKey(date)}>
                <strong>
                  {formatDate(date, {
                    weekday: "short",
                  })}
                </strong>

                <span>{date.getUTCDate()}</span>
              </div>
            ))}

            {allTimes.map((time) => (
              <div className="teacher-time-row" key={time}>
                <div className="teacher-time-label">{time}</div>

                {days.map((date) => {
                  const weekday = date.getUTCDay();

                  const available = slotsByWeekday[weekday].has(time);

                  const slot = makeSlot(date, time);

                  const isPast = new Date(slot.dateTime) <= new Date();

                  const isReserved = reservedSlots.has(slot.dateTime);

                  const isSelected = selectedSlot?.dateTime === slot.dateTime;

                  return (
                    <div
                      className="teacher-time-cell"
                      key={`${dateKey(date)}-${time}`}
                    >
                      {available ? (
                        <button
                          type="button"
                          className={
                            isSelected
                              ? "teacher-time-slot selected"
                              : "teacher-time-slot"
                          }
                          disabled={cannotSelect || isPast || isReserved}
                          title={isReserved ? "Already booked" : undefined}
                          aria-pressed={isSelected}
                          onClick={() => onSelectSlot?.(slot)}
                        >
                          {isReserved ? "Booked" : time}
                        </button>
                      ) : (
                        <span className="teacher-unavailable">—</span>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export default TeacherTimetable;
