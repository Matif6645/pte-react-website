import { useEffect, useState } from "react";
import { supabase } from "../../admin/supabaseClient";

const TIMEZONE = "Asia/Riyadh";

const STATUS_LABELS = {
  pending: "Pending",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
};

function MyBookings({ onBack }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadBookings() {
    setLoading(true);
    setError("");

    try {
      const { data: authData, error: authError } =
        await supabase.auth.getUser();

      if (authError) throw authError;

      const user = authData.user;
      if (!user) throw new Error("Please log in again.");

      const { data, error: bookingError } = await supabase
        .from("lesson_bookings")
        .select(
          `
          id,
          lesson_at,
          status,
          repeat_weekly,
          meeting_link,
          admin_note,
          created_at
        `,
        )
        .eq("student_id", user.id)
        .order("lesson_at", { ascending: false });

      if (bookingError) throw bookingError;

      setBookings(data || []);
    } catch (err) {
      setError(err.message || "Could not load bookings.");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBookings();
  }, []);

  function formatDate(value) {
    return new Date(value).toLocaleDateString("en-AU", {
      timeZone: TIMEZONE,
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  function formatTime(value) {
    return new Date(value).toLocaleTimeString("en-AU", {
      timeZone: TIMEZONE,
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }

  function safeMeetingLink(link) {
    if (!link) return null;

    try {
      const url = new URL(link);
      return url.protocol === "https:" ? url.href : null;
    } catch {
      return null;
    }
  }

  return (
    <div className="my-bookings-page" style={{ padding: "8px 0" }}>
      <button type="button" className="online-class-back" onClick={onBack}>
        ← Back to Online Classes
      </button>

      <div style={{ margin: "22px 0" }}>
        <h1>My Private Lessons</h1>
        <p style={{ color: "#647089" }}>
          View your scheduled lessons and meeting details. All times are in
          Riyadh time (UTC+3).
        </p>
      </div>

      <button
        type="button"
        onClick={loadBookings}
        disabled={loading}
        style={{
          background: "#7653e3",
          color: "white",
          border: 0,
          borderRadius: 9,
          padding: "11px 18px",
          cursor: "pointer",
          marginBottom: 20,
        }}
      >
        {loading ? "Loading..." : "Refresh Bookings"}
      </button>

      {error && (
        <p role="alert" style={{ color: "#dc2626" }}>
          {error}
        </p>
      )}

      {!loading && !error && bookings.length === 0 && (
        <div className="booking-empty">
          You haven't booked any private lessons yet.
        </div>
      )}

      <div style={{ display: "grid", gap: 16 }}>
        {bookings.map((booking) => {
          const meetingLink = safeMeetingLink(booking.meeting_link);

          const canJoin =
            booking.status === "confirmed" && Boolean(meetingLink);

          return (
            <article
              key={booking.id}
              style={{
                background: "white",
                border: "1px solid #e6ddff",
                borderRadius: 16,
                padding: 22,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  flexWrap: "wrap",
                }}
              >
                <h2 style={{ margin: 0, fontSize: 18 }}>
                  One-to-One PTE Lesson
                </h2>

                <span
                  style={{
                    padding: "7px 12px",
                    borderRadius: 20,
                    background:
                      booking.status === "confirmed"
                        ? "#dcfce7"
                        : booking.status === "pending"
                          ? "#fef3c7"
                          : "#f1ebff",
                    color:
                      booking.status === "confirmed" ? "#166534" : "#7653e3",
                    fontSize: 12,
                    fontWeight: 800,
                  }}
                >
                  {STATUS_LABELS[booking.status] || booking.status}
                </span>
              </div>

              <p>
                <strong>Date:</strong> {formatDate(booking.lesson_at)}
              </p>
              <p>
                <strong>Time:</strong> {formatTime(booking.lesson_at)}
              </p>
              <p>
                <strong>Duration:</strong> 60 minutes
              </p>

              {booking.admin_note && (
                <p>
                  <strong>Teacher Note:</strong> {booking.admin_note}
                </p>
              )}

              {canJoin ? (
                <a
                  href={meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-block",
                    padding: "12px 20px",
                    borderRadius: 10,
                    background: "#7653e3",
                    color: "#fff",
                    textDecoration: "none",
                    fontWeight: 700,
                  }}
                >
                  Join Online Lesson
                </a>
              ) : booking.status === "pending" ? (
                <p style={{ color: "#92400e" }}>
                  Waiting for teacher confirmation.
                </p>
              ) : booking.status === "confirmed" ? (
                <p style={{ color: "#647089" }}>
                  Meeting link not assigned yet.
                </p>
              ) : null}
            </article>
          );
        })}
      </div>
    </div>
  );
}

export default MyBookings;
