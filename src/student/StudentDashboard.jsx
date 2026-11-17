

import { useState } from "react";

import StudentSidebar from "./layout/StudentSidebar";
import StudentHome from "./home/StudentHome";
import MockExamHome from "./mock/MockExamHome";
import OnlineClass from "./classes/OnlineClass";

import "./StudentDashboard.css";

function StudentDashboard({ onLogout, onStartPractice }) {
  const [activePage, setActivePage] = useState("dashboard");

  function renderPage() {
    switch (activePage) {
      case "practice":
        return (
          <section className="student-section">
            <h1>Practice Tests</h1>
            <p>Practise your PTE exam questions.</p>
            <button onClick={onStartPractice}>
              Start Practice
            </button>
          </section>
        );

      case "mock":
        return <MockExamHome />;

      case "classes":
        return <OnlineClass />;

      default:
        return (
          <StudentHome
            onNavigate={setActivePage}
            onStartPractice={onStartPractice}
          />
        );
    }
  }

  return (
    <div className="student-layout">
      <StudentSidebar
        activePage={activePage}
        onNavigate={setActivePage}
        onLogout={onLogout}
        studentName="Student"
        packageName="Practice Only"
      />

      <main className="student-main">
        {renderPage()}
      </main>
    </div>
  );
}

export default StudentDashboard;
