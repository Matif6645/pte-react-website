
import "./StudentHome.css";

function StudentHome({ onNavigate, onStartPractice }) {
  return (
    <>
      <div className="student-welcome">
        <h1>Welcome to PTE Academy</h1>
        <p>Your PTE preparation starts here.</p>
      </div>

      <div className="student-cards">
        <div className="student-card">
          <h2>Practice Tests</h2>
          <p>
            Practise Speaking, Writing, Reading and Listening.
          </p>

          <button onClick={onStartPractice}>
            Start Practice
          </button>
        </div>

        <div className="student-card">
          <h2>Mock Exams</h2>
          <p>Prepare for your exam with PTE mock tests.</p>

          <button onClick={() => onNavigate("mock")}>
            View Mock Exams
          </button>
        </div>

        <div className="student-card">
          <h2>Online Classes</h2>
          <p>
            Weekly group classes and one-to-one lessons.
          </p>

          <button onClick={() => onNavigate("classes")}>
            View Classes
          </button>
        </div>
      </div>
    </>
  );
}

export default StudentHome;
