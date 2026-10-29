import { useEffect, useMemo, useState } from "react";
import {
  CATEGORIES,
  QUESTION_TYPES,
  addQuestion,
  deleteQuestion,
  getQuestions,
  updateQuestion,
} from "./questionStore";
import DropdownBlanksEditor, {
  buildDropdownSegments,
  validateDropdownBlanks,
} from "./DropdownBlanksEditor.jsx";
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
  dropdownPassage: "",
  dropdownBlanks: {},
};

function segmentsToDropdownForm(segments = [], correctAnswers = []) {
  let dropdownPassage = "";
  const dropdownBlanks = {};
  let blankIndex = 0;

  segments.forEach((seg) => {
    if (seg.type === "text") {
      dropdownPassage += seg.value || "";
      return;
    }

    if (seg.type === "blank") {
      blankIndex += 1;
      const options = [...(seg.options || [])];
      while (options.length < 3) options.push("");
      const correctText = correctAnswers[blankIndex - 1] || "";
      let correct = options.findIndex((opt) => opt === correctText);
      if (correct < 0) correct = 0;
      dropdownBlanks[blankIndex] = { options, correct };
      dropdownPassage += `[${blankIndex}]`;
    }
  });

  return { dropdownPassage, dropdownBlanks };
}

function questionToForm(question) {
  const correctAnswersValue = Array.isArray(question.correctAnswers)
    ? question.correctAnswers.join(",")
    : question.correctAnswers || "";

  const dropdownFields =
    question.type === "fill-blanks-dropdown" && Array.isArray(question.segments)
      ? segmentsToDropdownForm(question.segments, question.correctAnswers || [])
      : { dropdownPassage: "", dropdownBlanks: {} };

  return {
    ...emptyForm,
    title: question.title || "",
    difficulty: question.difficulty || "Easy",
    category: question.category || CATEGORIES[0],
    time: question.time || "00:20",
    passage: question.passage || "",
    questionText: question.questionText || "",
    optionA: question.optionA || "",
    optionB: question.optionB || "",
    optionC: question.optionC || "",
    optionD: question.optionD || "",
    correctAnswer: question.correctAnswer || "A",
    correctAnswers: correctAnswersValue || emptyForm.correctAnswers,
    wordBank: question.wordBank || "",
    paragraphs: question.paragraphs || "",
    ...dropdownFields,
  };
}

function AdminDashboard({ onLogout, onBackToSite }) {
  const [section, setSection] = useState("home");
  const [questions, setQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
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
    section === "home" ? [] : questions.filter((q) => q.type === section);

  async function refresh() {
    setLoadingQuestions(true);
    try {
      const list = await getQuestions();
      setQuestions(list);
    } catch (error) {
      console.error(error);
      alert(error.message || "Could not load questions from Supabase.");
    } finally {
      setLoadingQuestions(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  }

  function openAddForm() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function openEditForm(question) {
    setEditingId(question.id);
    setForm(questionToForm(question));
    setShowForm(true);
  }

  async function handleDelete(id) {
    const ok = window.confirm("Delete this question?");
    if (!ok) return;

    try {
      await deleteQuestion(id);
      if (editingId === id) closeForm();
      await refresh();
    } catch (error) {
      alert(error.message || "Delete failed. Are you logged in?");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.title.trim()) {
      alert("Title required");
      return;
    }

    if (section === "fill-blanks-dropdown") {
      const error = validateDropdownBlanks(
        form.dropdownPassage,
        form.dropdownBlanks,
      );
      if (error) {
        alert(error);
        return;
      }
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

    if (section === "fill-blanks-dropdown") {
      const { segments, correctAnswers } = buildDropdownSegments(
        form.dropdownPassage,
        form.dropdownBlanks,
      );
      base.segments = segments;
      base.correctAnswers = correctAnswers;
    }

    setSaving(true);
    try {
      if (editingId) {
        await updateQuestion(editingId, base);
      } else {
        await addQuestion(base);
      }
      closeForm();
      await refresh();
    } catch (error) {
      alert(error.message || "Save failed. Are you logged in as admin?");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="admin_panel">
      <aside className="admin_sidebar">
        <h2 className="admin_sidebar_title">Admin Panel</h2>

        <button
          type="button"
          className={
            section === "home" ? "admin_nav_btn active" : "admin_nav_btn"
          }
          onClick={() => {
            setSection("home");
            closeForm();
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
              closeForm();
            }}
          >
            {type.label}
          </button>
        ))}

        <button
          type="button"
          className="admin_side_link"
          onClick={onBackToSite}
        >
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
          <section className="admin_welcome_card">
            <div className="admin_main_header">
              <div>
                <h1>{activeType?.label || "Manage Questions"}</h1>
                <p>Total Questions: {typeQuestions.length}</p>
              </div>

              <button
                type="button"
                className="admin_add_btn"
                onClick={openAddForm}
              >
                + Add Question
              </button>
            </div>

            {showForm && (
              <form className="admin_form_card" onSubmit={handleSubmit}>
                <h2>{editingId ? "Edit Question" : "Add Question"}</h2>

                <label>
                  <span>Title</span>
                  <input
                    value={form.title}
                    onChange={(e) => updateField("title", e.target.value)}
                    placeholder="Question title"
                    required
                  />
                </label>

                <label>
                  <span>Difficulty</span>
                  <select
                    value={form.difficulty}
                    onChange={(e) => updateField("difficulty", e.target.value)}
                  >
                    <option>Easy</option>
                    <option>Medium</option>
                    <option>Hard</option>
                  </select>
                </label>

                <label>
                  <span>Category</span>
                  <select
                    value={form.category}
                    onChange={(e) => updateField("category", e.target.value)}
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  <span>Time</span>
                  <input
                    value={form.time}
                    onChange={(e) => updateField("time", e.target.value)}
                    placeholder="00:20"
                  />
                </label>

                {(section === "mcq-single" || section === "mcq-multiple") && (
                  <>
                    <label>
                      <span>Passage (one line = one paragraph)</span>
                      <textarea
                        rows={3}
                        value={form.passage}
                        onChange={(e) => updateField("passage", e.target.value)}
                        placeholder="Write passage..."
                        required
                      />
                    </label>

                    <label>
                      <span>Question</span>
                      <input
                        value={form.questionText}
                        onChange={(e) =>
                          updateField("questionText", e.target.value)
                        }
                        placeholder="Question text"
                        required
                      />
                    </label>

                    <label>
                      <span>Option A</span>
                      <input
                        value={form.optionA}
                        onChange={(e) => updateField("optionA", e.target.value)}
                        required
                      />
                    </label>
                    <label>
                      <span>Option B</span>
                      <input
                        value={form.optionB}
                        onChange={(e) => updateField("optionB", e.target.value)}
                        required
                      />
                    </label>
                    <label>
                      <span>Option C</span>
                      <input
                        value={form.optionC}
                        onChange={(e) => updateField("optionC", e.target.value)}
                        required
                      />
                    </label>
                    <label>
                      <span>Option D</span>
                      <input
                        value={form.optionD}
                        onChange={(e) => updateField("optionD", e.target.value)}
                        required
                      />
                    </label>

                    {section === "mcq-single" ? (
                      <label>
                        <span>Correct Answer</span>
                        <select
                          value={form.correctAnswer}
                          onChange={(e) =>
                            updateField("correctAnswer", e.target.value)
                          }
                        >
                          <option value="A">A</option>
                          <option value="B">B</option>
                          <option value="C">C</option>
                          <option value="D">D</option>
                        </select>
                      </label>
                    ) : (
                      <label>
                        <span>Correct Answers (e.g. A,C)</span>
                        <input
                          value={form.correctAnswers}
                          onChange={(e) =>
                            updateField("correctAnswers", e.target.value)
                          }
                          placeholder="A,C"
                          required
                        />
                      </label>
                    )}
                  </>
                )}

                {section === "fill-blanks-dropdown" && (
                  <DropdownBlanksEditor
                    passage={form.dropdownPassage}
                    blanks={form.dropdownBlanks}
                    onPassageChange={(value) =>
                      updateField("dropdownPassage", value)
                    }
                    onBlanksChange={(value) =>
                      updateField("dropdownBlanks", value)
                    }
                  />
                )}

                {section === "fill-blanks-drag" && (
                  <>
                    <label>
                      <span>Passage intro</span>
                      <input
                        value={form.passage}
                        onChange={(e) => updateField("passage", e.target.value)}
                        placeholder="Complete the blanks:"
                      />
                    </label>
                    <label>
                      <span>Word Bank (comma separated)</span>
                      <input
                        value={form.wordBank}
                        onChange={(e) => updateField("wordBank", e.target.value)}
                        placeholder="forest, visitors, trails, desert"
                        required
                      />
                    </label>
                    <label>
                      <span>Correct Answers (comma, in blank order)</span>
                      <input
                        value={form.correctAnswers}
                        onChange={(e) =>
                          updateField("correctAnswers", e.target.value)
                        }
                        placeholder="forest, visitors, trails"
                        required
                      />
                    </label>
                  </>
                )}

                {section === "reorder-paragraphs" && (
                  <label>
                    <span>Paragraphs (one per line, correct order)</span>
                    <textarea
                      rows={4}
                      value={form.paragraphs}
                      onChange={(e) =>
                        updateField("paragraphs", e.target.value)
                      }
                      placeholder={"Para 1\nPara 2\nPara 3"}
                      required
                    />
                  </label>
                )}

                <div className="admin_form_actions">
                  <button
                    type="button"
                    className="admin_cancel_btn"
                    onClick={closeForm}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="admin_save_btn"
                    disabled={saving}
                  >
                    {saving
                      ? "Saving..."
                      : editingId
                        ? "Update"
                        : "Save"}
                  </button>
                </div>
              </form>
            )}

            {loadingQuestions ? (
              <p className="admin_empty">Loading questions...</p>
            ) : typeQuestions.length === 0 ? (
              <p className="admin_empty">No questions added yet.</p>
            ) : (
              <div className="admin_question_table">
                {typeQuestions.map((question) => (
                  <div key={question.id} className="admin_question_row">
                    <div>
                      <h3>{question.title}</h3>
                      <p>
                        {question.difficulty} · {question.category} ·{" "}
                        {question.time}
                      </p>
                    </div>
                    <div className="admin_row_actions">
                      <button
                        type="button"
                        className="admin_edit_btn"
                        onClick={() => openEditForm(question)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="admin_delete_btn"
                        onClick={() => handleDelete(question.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;
