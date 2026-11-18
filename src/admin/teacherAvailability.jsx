import { useEffect, useState } from "react";

import {
  getAvailability,
  addAvailabilitySlot,
  removeAvailabilitySlot,
} from "./lessonStore";

const DAYS = [
  { id: 1, name: "Monday" },
  { id: 2, name: "Tuesday" },
  { id: 3, name: "Wednesday" },
  { id: 4, name: "Thursday" },
  { id: 5, name: "Friday" },
  { id: 6, name: "Saturday" },
  { id: 0, name: "Sunday" },
];

function TeacherAvailability() {
  const [availability, setAvailability] = useState({});
  const [weekday, setWeekday] = useState(1);

  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("12:00");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // =====================================
  // LOAD AVAILABILITY FROM SUPABASE
  // =====================================

  async function loadAvailability() {
    try {
      setLoading(true);
      setError("");

      const result = await getAvailability();
      setAvailability(result);
    } catch (err) {
      setError(err.message || "Unable to load availability.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAvailability();
  }, []);

  // =====================================
  // SAVE NEW AVAILABILITY
  // =====================================

  async function handleAdd(e) {
    e.preventDefault();

    setMessage("");
    setError("");

    if (startTime >= endTime) {
      setError("End time must be later than start time.");
      return;
    }

    try {
      setSaving(true);

      await addAvailabilitySlot(Number(weekday), startTime, endTime);

      await loadAvailability();

      setMessage("Availability saved successfully.");
    } catch (err) {
      setError(err.message || "Unable to save availability.");
    } finally {
      setSaving(false);
    }
  }

  // =====================================
  // REMOVE AVAILABILITY
  // =====================================

  async function handleRemove(day, start) {
    try {
      setSaving(true);
      setError("");
      setMessage("");

      await removeAvailabilitySlot(day, start);

      await loadAvailability();

      setMessage("Availability removed successfully.");
    } catch (err) {
      setError(err.message || "Unable to remove availability.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      style={{
        padding: "24px",
        fontFamily: "Urbanist, sans-serif",
        color: "#192744",
      }}
    >
      {/* HEADER */}

      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: "0 0 8px" }}>Teacher Availability</h1>

        <p style={{ color: "#647089", margin: 0 }}>
          Manage your weekly teaching schedule for private PTE lessons.
        </p>
      </div>

      {/* ADD AVAILABILITY FORM */}

      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e9e3ff",
          borderRadius: 16,
          padding: 24,
          marginBottom: 24,
        }}
      >
        <h2 style={{ fontSize: 20, marginTop: 0 }}>Add Weekly Availability</h2>

        <form
          onSubmit={handleAdd}
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 16,
            alignItems: "flex-end",
          }}
        >
          {/* WEEKDAY */}

          <label>
            <strong>Day</strong>

            <select
              value={weekday}
              onChange={(e) => setWeekday(Number(e.target.value))}
              style={{
                display: "block",
                marginTop: 8,
                padding: 12,
                border: "1px solid #ded4ff",
                borderRadius: 9,
                minWidth: 160,
              }}
            >
              {DAYS.map((day) => (
                <option key={day.id} value={day.id}>
                  {day.name}
                </option>
              ))}
            </select>
          </label>

          {/* START TIME */}

          <label>
            <strong>Start Time</strong>

            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
              style={{
                display: "block",
                marginTop: 8,
                padding: 11,
                border: "1px solid #ded4ff",
                borderRadius: 9,
              }}
            />
          </label>

          {/* END TIME */}

          <label>
            <strong>End Time</strong>

            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
              style={{
                display: "block",
                marginTop: 8,
                padding: 11,
                border: "1px solid #ded4ff",
                borderRadius: 9,
              }}
            />
          </label>

          {/* SAVE BUTTON */}

          <button
            type="submit"
            disabled={saving}
            style={{
              background: "#7653E3",
              color: "#ffffff",
              border: "none",
              borderRadius: 9,
              padding: "13px 22px",
              fontWeight: 700,
              cursor: saving ? "wait" : "pointer",
            }}
          >
            {saving ? "Saving..." : "+ Add Availability"}
          </button>
        </form>
      </div>

      {/* MESSAGES */}

      {message && (
        <p role="status" style={{ color: "#15803d" }}>
          {message}
        </p>
      )}

      {error && (
        <p role="alert" style={{ color: "#dc2626" }}>
          {error}
        </p>
      )}

      {/* WEEKLY TIMETABLE */}

      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e9e3ff",
          borderRadius: 16,
          padding: 24,
        }}
      >
        <h2 style={{ marginTop: 0, fontSize: 20 }}>Your Weekly Availability</h2>

        {loading ? (
          <p>Loading availability...</p>
        ) : (
          DAYS.map((day) => {
            const slots = availability[day.id] || [];

            return (
              <div
                key={day.id}
                style={{
                  padding: "16px 0",
                  borderBottom: "1px solid #eee9f8",
                }}
              >
                <h3
                  style={{
                    fontSize: 16,
                    margin: "0 0 12px",
                  }}
                >
                  {day.name}
                </h3>

                {slots.length === 0 ? (
                  <p
                    style={{
                      margin: 0,
                      color: "#94a3b8",
                      fontSize: 14,
                    }}
                  >
                    Not available
                  </p>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      gap: 10,
                      flexWrap: "wrap",
                    }}
                  >
                    {slots.map((slot) => (
                      <div
                        key={slot.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          padding: "10px 14px",
                          background: "#f1ebff",
                          borderRadius: 10,
                          color: "#530783",
                          fontWeight: 700,
                        }}
                      >
                        <span>
                          {slot.startTime.slice(0, 5)}
                          {" - "}
                          {slot.endTime.slice(0, 5)}
                        </span>

                        <button
                          type="button"
                          disabled={saving}
                          onClick={() => handleRemove(day.id, slot.startTime)}
                          style={{
                            background: "transparent",
                            color: "#dc2626",
                            border: "none",
                            fontWeight: 800,
                            cursor: "pointer",
                          }}
                          aria-label={`Remove ${day.name} ${slot.startTime}`}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default TeacherAvailability;
