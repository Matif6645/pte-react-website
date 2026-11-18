import { supabase } from "./supabaseClient";

// =========================================
// WEEKDAYS
// 0 = Sunday, 1 = Monday, ... 6 = Saturday
// =========================================

export const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// =========================================
// BOOKING STATUSES
// =========================================

export const BOOKING_STATUSES = {
  pending: "Pending",
  confirmed: "Confirmed",
  cancelled: "Cancelled",
  completed: "Completed",
};

// =========================================
// CONVERT SUPABASE BOOKING DATA
// =========================================

function toBooking(row) {
  return {
    id: row.id,
    studentId: row.student_id,
    studentName: row.student_name || "",
    studentEmail: row.student_email || "",
    lessonAt: row.lesson_at,
    repeatWeekly: Boolean(row.repeat_weekly),
    status: row.status || "pending",
    meetingLink: row.meeting_link || "",
    adminNote: row.admin_note || "",
    createdAt: row.created_at,
  };
}

// =========================================
// GET TEACHER AVAILABILITY
// =========================================

export async function getAvailability() {
  const { data, error } = await supabase
    .from("teacher_availability")
    .select("id, weekday, start_time, end_time")
    .eq("is_active", true)
    .order("weekday", { ascending: true })
    .order("start_time", { ascending: true });

  if (error) throw error;

  const byDay = {
    0: [],
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
  };

  (data || []).forEach((row) => {
    byDay[row.weekday].push({
      id: row.id,
      startTime: row.start_time,
      endTime: row.end_time,
    });
  });

  return byDay;
}

// =========================================
// ADD TEACHER AVAILABILITY
// =========================================

export async function addAvailabilitySlot(weekday, startTime, endTime) {
  if (startTime >= endTime) {
    throw new Error("End time must be later than start time.");
  }

  const { data, error } = await supabase
    .from("teacher_availability")
    .upsert(
      {
        weekday: Number(weekday),
        start_time: startTime,
        end_time: endTime,
        is_active: true,
      },
      {
        onConflict: "weekday,start_time",
      },
    )
    .select()
    .single();

  if (error) throw error;

  return data;
}

// =========================================
// REMOVE TEACHER AVAILABILITY
// =========================================

export async function removeAvailabilitySlot(weekday, startTime) {
  const { error } = await supabase
    .from("teacher_availability")
    .delete()
    .eq("weekday", weekday)
    .eq("start_time", startTime);

  if (error) throw error;

  return true;
}

// =========================================
// GET STUDENT BOOKINGS
// =========================================

export async function getAllBookings() {
  const { data, error } = await supabase
    .from("lesson_bookings")
    .select("*")
    .order("lesson_at", {
      ascending: true,
    });

  if (error) throw error;

  return (data || []).map(toBooking);
}

export async function updateBookingStatus(
  bookingId,
  status,
  meetingLink = "",
  adminNote = "",
) {
  const allowed = ["confirmed", "cancelled", "completed"];

  if (!allowed.includes(status)) {
    throw new Error("Invalid booking status.");
  }

  const { data, error } = await supabase
    .from("lesson_bookings")
    .update({
      status,
      meeting_link: meetingLink.trim() || null,
      admin_note: adminNote.trim() || null,
    })
    .eq("id", bookingId)
    .select()
    .single();

  if (error) throw error;

  return data;
}
