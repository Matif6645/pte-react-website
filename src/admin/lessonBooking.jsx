import { useEffect, useMemo, useState } from "react";
import {
  getAllBookings,
  updateBookingStatus,
  BOOKING_STATUSES,
} from "./lessonStore";

function LessonBooking() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [meetingLink, setMeetingLink] = useState("");
  const [adminNote, setAdminNote] = useState("");
  const [savingStatus, setSavingStatus] = useState(false);
  const [statusError, setStatusError] = useState("");

  // =====================================
  // LOAD BOOKINGS FROM SUPABASE
  // =====================================

  async function loadBookings() {
    try {
      setLoading(true);
      setError("");

      const result = await getAllBookings();
      setBookings(result);

      setSelectedBooking((previous) => {
        if (!previous) return null;

        return result.find((b) => b.id === previous.id) || null;
      });
    } catch (err) {
      setError(err.message || "Unable to load student bookings.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBookings();
  }, []);

  function openBookingDetails(booking) {
    setSelectedBooking(booking);
    setMeetingLink(booking.meetingLink || "");
    setAdminNote(booking.adminNote || "");
    setStatusError("");
  }

  async function handleBookingAction(nextStatus) {
    if (!selectedBooking || savingStatus) return;

    const allowedTransitions = {
      pending: ["confirmed", "cancelled"],
      confirmed: ["completed", "cancelled"],
    };

    if (!allowedTransitions[selectedBooking.status]?.includes(nextStatus)) {
      setStatusError("That status change is not allowed.");
      return;
    }

    const url = meetingLink.trim();
    if (url) {
      try {
        const parsed = new URL(url);
        if (parsed.protocol !== "https:") throw new Error();
      } catch {
        setStatusError("Use a valid HTTPS meeting link.");
        return;
      }
    }

    if (
      nextStatus === "cancelled" &&
      !window.confirm("Cancel this student's lesson booking?")
    ) {
      return;
    }

    setSavingStatus(true);
    setStatusError("");
    try {
      await updateBookingStatus(selectedBooking.id, nextStatus, url, adminNote);
      const result = await getAllBookings();
      setBookings(result);
      const updated = result.find((item) => item.id === selectedBooking.id);
      setSelectedBooking(updated || null);
      if (updated) {
        setMeetingLink(updated.meetingLink || "");
        setAdminNote(updated.adminNote || "");
      }
    } catch (err) {
      setStatusError(err.message || "Could not update booking status.");
    } finally {
      setSavingStatus(false);
    }
  }

  // =====================================
  // FILTER BOOKINGS
  // =====================================

  const filteredBookings = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    return bookings.filter((booking) => {
      const matchesSearch =
        (booking.studentName || "").toLowerCase().includes(keyword) ||
        (booking.studentEmail || "").toLowerCase().includes(keyword);

      const matchesStatus =
        statusFilter === "all" || booking.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [bookings, search, statusFilter]);

  // =====================================
  // BOOKING STATISTICS
  // =====================================

  const totalBookings = bookings.length;

  const pendingBookings = bookings.filter((b) => b.status === "pending").length;

  const confirmedBookings = bookings.filter(
    (b) => b.status === "confirmed",
  ).length;

  const completedBookings = bookings.filter(
    (b) => b.status === "completed",
  ).length;

  // =====================================
  // FORMAT DATE AND TIME
  // =====================================

  function formatDate(date) {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-AU", {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "Asia/Riyadh",
    });
  }

  function formatTime(date) {
    if (!date) return "—";

    return new Date(date).toLocaleTimeString("en-AU", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Riyadh",
    });
  }

  // =====================================
  // STYLES
  // =====================================

  const cardStyle = {
    background: "#fff",
    border: "1px solid #e9e3ff",
    borderRadius: 16,
    padding: 20,
  };

  const buttonStyle = {
    border: "none",
    borderRadius: 9,
    background: "#7653E3",
    color: "#fff",
    padding: "11px 18px",
    fontWeight: 700,
    cursor: "pointer",
  };

  // =====================================
  // COMPONENT
  // =====================================

  return (
    <div
      style={{
        padding: 20,
        color: "#192744",
        fontFamily: "Urbanist, sans-serif",
      }}
    >
      {/* PAGE HEADER */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
          marginBottom: 24,
        }}
      >
        <div>
          <h1 style={{ margin: "0 0 8px" }}>Private Lesson Bookings</h1>

          <p style={{ color: "#647089", margin: 0 }}>
            View student reservations and lesson schedules.
          </p>
        </div>

        <button
          type="button"
          style={buttonStyle}
          onClick={loadBookings}
          disabled={loading}
        >
          {loading ? "Loading..." : "Refresh Bookings"}
        </button>
      </div>

      {/* STATISTICS */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: 14,
          marginBottom: 24,
        }}
      >
        {[
          { label: "Total", value: totalBookings },
          { label: "Pending", value: pendingBookings },
          { label: "Confirmed", value: confirmedBookings },
          { label: "Completed", value: completedBookings },
        ].map((item) => (
          <div key={item.label} style={cardStyle}>
            <h2
              style={{
                fontSize: 30,
                color: "#7653E3",
                margin: "0 0 8px",
              }}
            >
              {item.value}
            </h2>

            <span
              style={{
                color: "#647089",
                fontSize: 13,
              }}
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* SEARCH AND FILTER */}

      <div style={{ ...cardStyle, marginBottom: 20 }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search student name or email..."
            aria-label="Search student bookings"
            style={{
              flex: 1,
              minWidth: 200,
              padding: 12,
              border: "1px solid #ddd3f5",
              borderRadius: 9,
            }}
          />

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setSelectedBooking(null);
            }}
            style={{
              padding: 12,
              border: "1px solid #ddd3f5",
              borderRadius: 9,
            }}
          >
            <option value="all">All Statuses</option>

            {Object.entries(BOOKING_STATUSES).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ERROR MESSAGE */}

      {error && (
        <div
          role="alert"
          style={{
            padding: 15,
            background: "#fee2e2",
            color: "#b91c1c",
            borderRadius: 10,
            marginBottom: 20,
          }}
        >
          {error}
        </div>
      )}

      {/* BOOKINGS TABLE */}

      <div style={cardStyle}>
        <h2 style={{ marginTop: 0, fontSize: 19 }}>Student Bookings</h2>

        {loading ? (
          <p>Loading bookings...</p>
        ) : filteredBookings.length === 0 ? (
          <p style={{ color: "#647089" }}>No bookings found.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                textAlign: "left",
              }}
            >
              <thead>
                <tr
                  style={{
                    background: "#f1ebff",
                    color: "#530783",
                  }}
                >
                  {[
                    "Student",
                    "Lesson Date",
                    "Time",
                    "Repeat",
                    "Status",
                    "Action",
                  ].map((heading) => (
                    <th
                      key={heading}
                      style={{
                        padding: 14,
                        fontSize: 13,
                      }}
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filteredBookings.map((booking) => (
                  <tr
                    key={booking.id}
                    style={{
                      borderBottom: "1px solid #eee9f8",
                    }}
                  >
                    <td style={{ padding: 14 }}>
                      <strong>{booking.studentName || "Student"}</strong>

                      <div
                        style={{
                          color: "#647089",
                          fontSize: 12,
                          marginTop: 4,
                        }}
                      >
                        {booking.studentEmail}
                      </div>
                    </td>

                    <td style={{ padding: 14 }}>
                      {formatDate(booking.lessonAt)}
                    </td>

                    <td style={{ padding: 14 }}>
                      {formatTime(booking.lessonAt)}
                    </td>

                    <td style={{ padding: 14 }}>
                      {booking.repeatWeekly ? "Yes" : "No"}
                    </td>

                    <td style={{ padding: 14 }}>
                      <span
                        style={{
                          background:
                            booking.status === "confirmed"
                              ? "#dcfce7"
                              : booking.status === "pending"
                                ? "#fef3c7"
                                : "#f1ebff",
                          color:
                            booking.status === "confirmed"
                              ? "#166534"
                              : booking.status === "pending"
                                ? "#92400e"
                                : "#7653E3",
                          padding: "7px 11px",
                          borderRadius: 20,
                          fontSize: 12,
                          fontWeight: 700,
                        }}
                      >
                        {BOOKING_STATUSES[booking.status] || booking.status}
                      </span>
                    </td>

                    <td style={{ padding: 14 }}>
                      <button
                        type="button"
                        onClick={() => openBookingDetails(booking)}
                        style={{
                          background: "#f1ebff",
                          color: "#7653E3",
                          border: "none",
                          padding: "9px 13px",
                          borderRadius: 8,
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* BOOKING DETAILS */}

      {selectedBooking && (
        <div
          style={{
            ...cardStyle,
            marginTop: 22,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h2 style={{ marginTop: 0 }}>Booking Details</h2>

            <button
              type="button"
              onClick={() => setSelectedBooking(null)}
              aria-label="Close booking details"
              style={{
                border: "none",
                background: "transparent",
                fontSize: 23,
                cursor: "pointer",
              }}
            >
              ×
            </button>
          </div>

          <p>
            <strong>Student:</strong> {selectedBooking.studentName || "Student"}
          </p>

          <p>
            <strong>Email:</strong> {selectedBooking.studentEmail || "—"}
          </p>

          <p>
            <strong>Date:</strong> {formatDate(selectedBooking.lessonAt)}
          </p>

          <p>
            <strong>Time:</strong> {formatTime(selectedBooking.lessonAt)}
          </p>

          <p>
            <strong>Repeat Weekly:</strong>{" "}
            {selectedBooking.repeatWeekly ? "Yes" : "No"}
          </p>

          <p>
            <strong>Status:</strong> {BOOKING_STATUSES[selectedBooking.status]}
          </p>

          <div
            className="admin-booking-fields"
            style={{ display: "grid", gap: 14, marginTop: 18 }}
          >
            <label style={{ display: "grid", gap: 6, fontWeight: 700 }}>
              Meeting Link (optional)
              <input
                type="url"
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
                placeholder="https://meet.google.com/..."
                disabled={
                  savingStatus ||
                  !["pending", "confirmed"].includes(selectedBooking.status)
                }
                style={{
                  padding: 12,
                  border: "1px solid #ddd3f5",
                  borderRadius: 9,
                }}
              />
            </label>
            <label style={{ display: "grid", gap: 6, fontWeight: 700 }}>
              Admin Note
              <textarea
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                rows={3}
                disabled={
                  savingStatus ||
                  !["pending", "confirmed"].includes(selectedBooking.status)
                }
                style={{
                  padding: 12,
                  border: "1px solid #ddd3f5",
                  borderRadius: 9,
                  resize: "vertical",
                }}
              />
            </label>
          </div>

          {statusError && (
            <p role="alert" style={{ color: "#b91c1c", marginTop: 12 }}>
              {statusError}
            </p>
          )}

          <div
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
              marginTop: 18,
            }}
          >
            {selectedBooking.status === "pending" && (
              <button
                type="button"
                style={buttonStyle}
                onClick={() => handleBookingAction("confirmed")}
                disabled={savingStatus}
              >
                {savingStatus ? "Saving..." : "Confirm Booking"}
              </button>
            )}
            {selectedBooking.status === "confirmed" && (
              <button
                type="button"
                style={buttonStyle}
                onClick={() => handleBookingAction("completed")}
                disabled={savingStatus}
              >
                {savingStatus ? "Saving..." : "Mark Completed"}
              </button>
            )}
            {["pending", "confirmed"].includes(selectedBooking.status) && (
              <button
                type="button"
                onClick={() => handleBookingAction("cancelled")}
                disabled={savingStatus}
                style={{
                  padding: "11px 18px",
                  color: "#b91c1c",
                  background: "white",
                  border: "1px solid #fecaca",
                  borderRadius: 9,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Cancel Booking
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default LessonBooking;
