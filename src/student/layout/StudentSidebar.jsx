import "./StudentSidebar.css";

function StudentSidebar({
  activePage,
  onNavigate,
  onLogout,
  studentName,
  packageName,
}) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard" },
    { id: "practice", label: "Practice Tests" },
    { id: "mock", label: "Mock Exams" },
    { id: "classes", label: "Online Classes" },
  ];

  return (
    <aside className="student-sidebar">
      <h2 className="student-logo">
        PTE <span>Academy</span>
      </h2>

      <div className="student-account">
        <div className="student-avatar">
          {studentName.charAt(0).toUpperCase()}
        </div>

        <div>
          <strong>{studentName}</strong>
          <p>{packageName}</p>
        </div>
      </div>

      <nav className="student-navigation">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={
              activePage === item.id ? "active" : ""
            }
            onClick={() => onNavigate(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <button
        className="student-logout"
        onClick={onLogout}
      >
        Logout
      </button>
    </aside>
  );
}

export default StudentSidebar;