import { useEffect, useState } from "react";

import { supabase } from "../../../admin/supabaseClient";
import { getMySubscription } from "../../../admin/plans/subscriptionStore";

import TeacherTimetable from "./TeacherTimetable";
import LessonCredits from "./LessonCredits";
import BookingDetails from "./BookingDetails";

import "./OneToOneBooking.css";

function OneToOneBooking({ planName = "Free" }) {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [repeatWeekly, setRepeatWeekly] = useState(false);
  const [bookingMessage, setBookingMessage] = useState("");

  const [currentPlanName, setCurrentPlanName] = useState(planName);

  const [totalLessons, setTotalLessons] = useState(0);
  const [bookedLessons, setBookedLessons] = useState(0);

  const [loadingCredits, setLoadingCredits] = useState(true);
  const [creditsError, setCreditsError] = useState("");
  const [savingBooking, setSavingBooking] = useState(false);

  const [refreshKey, setRefreshKey] = useState(0);

  // ======================================
  // LOAD LESSON CREDITS
  // ======================================

  useEffect(() => {
    let cancelled = false;

    async function loadCredits() {
      setLoadingCredits(true);
      setCreditsError("");

      try {
        const subscription = await getMySubscription();

        if (!subscription?.subscription_plans) {
          throw new Error("No active tutor subscription found.");
        }

        const { data: userData, error: userError } =
          await supabase.auth.getUser();

        if (userError) throw userError;

        if (!userData.user) {
          throw new Error("Please sign in again.");
        }

        const { count, error } = await supabase
          .from("lesson_bookings")
          .select("id", { count: "exact", head: true })
          .eq("student_id", userData.user.id)
          .in("status", ["pending", "confirmed", "completed"])
          .gte("lesson_at", subscription.period_start)
          .lt("lesson_at", subscription.period_end);

        if (error) throw error;

        if (cancelled) return;

        const plan = subscription.subscription_plans;

        setCurrentPlanName(plan.name || planName);

        setTotalLessons(
          Math.max(0, Number(plan.private_lessons_per_period) || 0),
        );

        setBookedLessons(count ?? 0);
      } catch (error) {
        if (cancelled) return;

        setTotalLessons(0);
        setBookedLessons(0);

        setCreditsError(error.message || "Could not load lesson credits.");
      } finally {
        if (!cancelled) {
          setLoadingCredits(false);
        }
      }
    }

    loadCredits();

    return () => {
      cancelled = true;
    };
  }, [planName, refreshKey]);

  const remainingLessons = Math.max(0, totalLessons - bookedLessons);

  const canBook =
    !loadingCredits && !creditsError && !savingBooking && remainingLessons > 0;

  // ======================================
  // CONFIRM REAL BOOKING
  // ======================================

  async function handleConfirmBooking() {
    if (!canBook || !selectedSlot) return;

    if (repeatWeekly) {
      setBookingMessage(
        "Repeat Weekly is not available yet. " +
          "Untick it to book this single lesson.",
      );
      return;
    }

    if (!selectedSlot.teacherDate || !selectedSlot.startTime) {
      setBookingMessage("Please select a new lesson time.");
      return;
    }

    setSavingBooking(true);
    setBookingMessage("");

    try {
      const { data, error } = await supabase.rpc("pte_book_private_lesson", {
        p_lesson_date: selectedSlot.teacherDate,
        p_start_time: selectedSlot.startTime,
        p_repeat_weekly: false,
      });

      if (error) throw error;

      setSelectedSlot(null);
      setRepeatWeekly(false);

      setBookingMessage(
        "Booking submitted successfully! " +
          "Your lesson is pending confirmation.",
      );

      console.log("Created booking ID:", data);
    } catch (error) {
      setBookingMessage(error.message || "Booking failed. Please try again.");
    } finally {
      setSavingBooking(false);

      // Recheck credits and reserved time slots
      // whether the booking succeeded or failed.
      setRefreshKey((previous) => previous + 1);
    }
  }

  // ======================================
  // RENDER
  // ======================================

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

      {loadingCredits && <p role="status">Checking lesson credits...</p>}

      {creditsError && (
        <p role="alert" style={{ color: "#dc2626" }}>
          {creditsError}
        </p>
      )}

      <LessonCredits
        packageName={currentPlanName}
        total={totalLessons}
        booked={bookedLessons}
      />

      <div className="one-to-one-booking-grid">
        <TeacherTimetable
          selectedSlot={selectedSlot}
          onSelectSlot={(slot) => {
            setSelectedSlot(slot);
            setBookingMessage("");
          }}
          disabled={!canBook}
          refreshKey={refreshKey}
        />

        <BookingDetails
          selectedSlot={selectedSlot}
          repeatWeekly={repeatWeekly}
          onRepeatChange={(checked) => {
            setRepeatWeekly(checked);
            setBookingMessage("");
          }}
          remainingLessons={canBook ? remainingLessons : 0}
          onConfirm={handleConfirmBooking}
          bookingMessage={bookingMessage}
          bookingLoading={savingBooking}
        />
      </div>
    </div>
  );
}

export default OneToOneBooking;
