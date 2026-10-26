import { useMemo, useState } from "react";
import {
  CATEGORIES,
  QUESTION_TYPES,
  addQuestion,
  deleteQuestion,
  getQuestions,
} from "./questionStore";
import "./AdminDashboard.css";

const emptyForm = {
  title: "",
  difficulty: "Easy",
  category: CATEGORIES[0],
  time: "00:20",
  passage: "",
  questionText: "",
  optionA: "",
  optionB: "",
  optionC: "",
  optionD: "",
  correctAnswer: "A",
  correctAnswers: "A,C",
  wordBank: "",
  paragraphs: "",
};

function AdminDashboard({ onLogout, onBackToSite }) {
  const [section, setSection] = useState("home");
  const [questions, setQuestions] = useState(() => getQuestions());
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const stats = useMemo(() => {
    const all = questions;
    return {
      total: all.length,
      types: QUESTION_TYPES.map((type) => ({
        ...type,
        count: all.filter((q) => q.type === type.id).length,
      })),
    };
  }, [questions]);

  const activeType = QUESTION_TYPES.find((t) => t.id === section);
  const typeQuestions =
    section === "home"
      ? []
      : questions.filter((q) => q.type === section);

  function refresh() {
    setQuestions(getQuestions());
  }

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function openAddForm() {
    setForm(emptyForm);
    setShowForm(true);
  }

  function handleDelete(id) {
    const ok = window.confirm("Delete this question?");
    if (!ok) return;
    deleteQuestion(id);
    refresh();
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!form.title.trim()) {
      alert("Title required");
      return;
    }

    const base = {
      type: section,
      title: form.title.trim().toUpperCase(),
      difficulty: form.difficulty,
      category: form.category,
      time: form.time,
      passage: form.passage.trim(),
      questionText: form.questionText.trim(),
      optionA: form.optionA.trim(),
      optionB: form.optionB.trim(),
      optionC: form.optionC.trim(),
      optionD: form.optionD.trim(),
      correctAnswer: form.correctAnswer,
      correctAnswers: form.correctAnswers,
      wordBank: form.wordBank.trim(),
      paragraphs: form.paragraphs.trim(),
    };

    addQuestion(base);
    setShowForm(false);
    setForm(emptyForm);
    refresh();
  }

  return (
    <div className="admin_panel">
      <aside className="admin_sidebar">
        <h2 className="admin_sidebar_title">Admin Panel</h2>

        <button
          type="button"
          className={section === "home" ? "admin_nav_btn active" : "admin_nav_btn"}
          onClick={() => {
            setSection("home");
            setShowForm(false);
          }}
        >
          Dashboard
        </button>

        {QUESTION_TYPES.map((type) => (
          <button
            key={type.id}
            type="button"
            className={
              section === type.id ? "admin_nav_btn active" : "admin_nav_btn"
            }
            onClick={() => {
              setSection(type.id);
              setShowForm(false);
            }}
          >
            {type.label}
          </button>
        ))}

        <button type="button" className="admin_side_link" onClick={onBackToSite}>
          ← Website
        </button>
        <button type="button" className="admin_side_logout" onClick={onLogout}>
          Logout
        </button>
      </aside>

      <main className="admin_main">
        {section === "home" ? (
          <section className="admin_welcome_card">
            <h1>Welcome to Admin Dashboard</h1>
            <p>Total Questions: {stats.total}</p>
          </section>
        ) : (
         
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;