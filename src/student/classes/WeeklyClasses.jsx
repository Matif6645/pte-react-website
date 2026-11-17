
import "./WeeklyClasses.css";

// Temporary class schedule.
// Later this will come from the Admin Panel and Supabase.

const weeklyClasses = [
  {
    id: 1,
    title: "PTE Speaking",
    day: "Monday",
    time: "18:00",
    duration: 60,
    teacher: "PTE Teacher",
  },
  {
    id: 2,
    title: "PTE Writing",
    day: "Wednesday",
    time: "19:00",
    duration: 60,
    teacher: "PTE Teacher",
  },
  {
    id: 3,
    title: "PTE Reading",
    day: "Friday",
    time: "17:00",
    duration: 60,
    teacher: "PTE Teacher",
  },
  {
    id: 4,
    title: "PTE Listening",
    day: "Saturday",
    time: "11:00",
    duration: 60,
    teacher: "PTE Teacher",
  },
];

function WeeklyClasses({ hasAccess = false }) {
  return (
    <div className="weekly-classes-page">
      {/* Page Heading */}
      <div className="weekly-classes-header">
        <h1>Weekly Group Classes</h1>

        <p>
          Attend your scheduled PTE classes with your teacher.
          No booking is required.
        </p>
      </div>

      {/* Information Banner */}
      <div className="weekly-classes-notice">
        <span>📅</span>

        <div>
          <strong>Fixed Weekly Timetable</strong>

          <p>
            Classes repeat every week at the scheduled
            day and time.
          </p>
        </div>
      </div>

      {/* Timetable */}
      <div className="weekly-classes-list">
        {weeklyClasses.map((lesson) => (
          <div className="weekly-class-card" key={lesson.id}>
            <div className="weekly-class-day">
              {lesson.day.slice(0, 3).toUpperCase()}
            </div>

            <div className="weekly-class-info">
              <h2>{lesson.title}</h2>

              <p>
                {lesson.day} · {lesson.time}
              </p>

              <span>
                {lesson.duration} minutes · {lesson.teacher}
              </span>
            </div>

            <div className="weekly-class-action">
              {hasAccess ? (
                <span className="weekly-class-status">
                  Meeting Link Coming Soon
                </span>
              ) : (
                <span className="weekly-class-locked">
                  🔒 Subscription Required
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <p className="weekly-classes-footer">
        Sample timetable only. Class times and meeting links
        will be managed by PTE Academy.
      </p>
    </div>
  );
}

export default WeeklyClasses;
