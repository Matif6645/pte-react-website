import "./MockExamHome.css";

function MockExamHome() {
  return (
    <div className="mock-exam-home">
      <div className="mock-exam-heading">
        <h1>PTE Mock Exams</h1>
        <p>Prepare for your PTE exam with realistic practice tests.</p>
      </div>

      <div className="mock-exam-cards">
        <div className="mock-exam-card">
          <h2>Full Mock Exam</h2>
          <p>
            Practise Speaking, Writing, Reading and Listening in one complete
            mock exam.
          </p>
          <span className="mock-coming-soon">Coming Soon</span>
        </div>

        <div className="mock-exam-card">
          <h2>Sectional Mock Exam</h2>
          <p>Practise individual sections of the PTE exam.</p>
          <span className="mock-coming-soon">Coming Soon</span>
        </div>
      </div>
    </div>
  );
}

export default MockExamHome;
