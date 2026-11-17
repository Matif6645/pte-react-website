function LessonCredits({ packageName, total = 0, booked = 0 }) {
  const remaining = Math.max(0, total - booked);

  const progress = total > 0 ? (booked / total) * 100 : 0;

  return (
    <section className="lesson-credits">
      <div className="lesson-credits-top">
        <div>
          <span className="lesson-credits-label">YOUR SUBSCRIPTION</span>

          <h2>{packageName}</h2>
        </div>

        <span className="lesson-credits-badge">Demo Plan</span>
      </div>

      <div className="lesson-credits-stats">
        <div>
          <strong>{total}</strong>
          <span>Total Lessons</span>
        </div>

        <div>
          <strong>{booked}</strong>
          <span>Booked</span>
        </div>

        <div>
          <strong>{remaining}</strong>
          <span>Remaining</span>
        </div>
      </div>

      <div className="lesson-credits-progress">
        <div
          style={{
            width: `${Math.min(100, progress)}%`,
          }}
        />
      </div>

      <p>Your private lesson allowance for the current subscription period.</p>
    </section>
  );
}

export default LessonCredits;
