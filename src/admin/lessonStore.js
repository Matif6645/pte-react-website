import { supabase } from "./supabaseClient";

export const WEEKDAYS = ["Mon" , "Tue" , "Wed" , "Thu", "Fri" , "Sat" , "Sun"];
export const BOOKING_STATUSES = {
    pending: "Pending",
    confirmed: "Confirmed",
    cancelled: "Cancelled",
    completed: "Completed",
}

function toBooking (row) {
    return {
        id: row.id,
        studentId : row.student_id,
        studentName : row.student_name || "",
        studentEmail : row.student_email || "",
        lessonAt: row.lesson_at,
        repeatWeekly: Boolean(row.repeat_weekly),
        status: row.status || "pending",
        meetingLink:  row.meeting_link|| "",
        adminNote:  row.admin_note || "",
        createdAt: row.created_at,
    };
}


export async function getAvailability() {
    const { data, error} = await supabase
    .from("teacher_availability")
    .select("weekday , start_time")
    .eq("is_active" , true)
    .order("start_time")

    if(error) throw error;


    const byDay = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: []}
    (data || [] ).forEach((row) => {
        byDay[row.weekday]? push(row.start_time)
    })
    return byDay;
}  


export async function addAvailabilitySlot(weekday, startTime) {
    const {error} = await supabase
    .from("teacher_availability")
    .upsert(
        { weekday, start_time: startTime, is_active: true},
        {onConflict : "weekday, start_time"}
    )

      if(error) throw error;
}

export async function removeAvailabilitySlot(weekday, startTime) {
     const {error} = await supabase
    .from("teacher_availability")
    .delete()
    .eq("weekday" , weekday)
    .eq("start_time" , startTime)
     if(error) throw error;
}

export async function getAllBookings(){
    const {data, error} = await supabase
    .from("lesson_bookings")
    .select("*")
    .order("lesson_at" , {ascending : true});

    if(error) throw error;
    return (data || []).map(toBooking) 
}