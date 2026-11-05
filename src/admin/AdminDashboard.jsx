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
  optionE: "",
  correctAnswer: "A",
  correctAnswers: "A,C",
  wordBank: "",
  paragraphs: "",
  audioUrl: "",
  dropdownPassage: "",
  dropdownBlanks: {},
};

const READING_MCQ_TYPES = ["mcq-single", "mcq-multiple"];
const LISTENING_MCQ_TYPES = [
  "listening-mcq-multiple",
  "listening-mcq-single",
  "listening-hcs",
  "listening-smw",
];
const LISTENING_SINGLE_TYPES = [
  "listening-mcq-single",
  "listening-hcs",
  "listening-smw",
];

// Student sidebar groups — IDs must match questionStore QUESTION_TYPES
const ADMIN_GROUPS = [
  {
    id: "reading",
    label: "READING",
    icon: "fa-solid fa-book-open",
    items: [
      ["fill-blanks-dropdown", "Fill in the Blanks (Dropdown)"],
      ["reorder-paragraphs", "Reorder Paragraphs"],
      ["mcq-multiple", "Multiple Choice (Multiple Answers)"],
      ["fill-blanks-drag", "Fill in the Blanks (Drag and Drop)"],
      ["mcq-single", "Multiple Choice (Single Answer)"],
    ],
  },
  {
    id: "speaking",
    label: "SPEAKING",
    icon: "fa-solid fa-microphone",
    items: [
      ["read-aloud", "Read Aloud"],
      ["repeat-sentence", "Repeat Sentence"],
      ["describe-image", "Describe Image"],
      ["retell-lecture", "Retell Lecture"],
      ["answer-short-question", "Answer Short Question"],
    ],
  },
  {
    id: "writing",
    label: "WRITING",
    icon: "fa-solid fa-pen",
    items: [
      ["summarize-written-text", "Summarize Written Text"],
      ["write-essay", "Write Essay"],
    ],
  },
  {
    id: "listening",
    label: "LISTENING",
    icon: "fa-solid fa-headphones",
    items: [
      ["listening-sst", "Summarize Spoken Text"],
      ["listening-mcq-multiple", "Multiple Choice (Multiple)"],
      ["listening-fib", "Fill in the Blanks"],
      ["listening-hcs", "Highlight Correct Summary"],
      ["listening-mcq-single", "Multiple Choice (Single)"],
      ["listening-smw", "Select Missing Word"],
      ["listening-hiw", "Highlight Incorrect Words"],
      ["listening-wfd", "Write from Dictation"],
    ],
  },
];

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
    optionE: question.optionE || "",
    correctAnswer: question.correctAnswer || "A",
    correctAnswers: correctAnswersValue || emptyForm.correctAnswers,
    wordBank: question.wordBank || "",
    paragraphs: question.paragraphs || "",
    audioUrl: question.audioUrl || "",
    ...dropdownFields,
  };
}

function AdminDashboard({ onLogout, onBackToSite }) {
  const [section, setSection] = useState("home");
  const [expandedGroup, setExpandedGroup] = useState("reading");
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

  function refresh() {
    setLoadingQuestions(true);
    try {
      setQuestions(getQuestions());
    } catch (error) {
      console.error(error);
      alert(error.message || "Could not load questions.");
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

  function handleDelete(id) {
    const ok = window.confirm("Delete this question?");
    if (!ok) return;

    try {
      deleteQuestion(id);
      if (editingId === id) closeForm();
      refresh();
    } catch (error) {
      alert(error.message || "Delete failed.");
    }
  }

  function handleSubmit(e) {
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
      optionE: form.optionE.trim(),
      correctAnswer: form.correctAnswer,
      correctAnswers: form.correctAnswers,
      wordBank: form.wordBank.trim(),
      paragraphs: form.paragraphs.trim(),
      audioUrl: form.audioUrl.trim(),
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
        updateQuestion(editingId, base);
      } else {
        addQuestion(base);
      }
      closeForm();
      refresh();
    } catch (error) {
      alert(error.message || "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="admin_panel">
      <aside className="admin_sidebar admin_sidebar_v2">
        <div className="admin_sidebar_brand">
          <span className="admin_brand_icon">
            <i className="fa-solid fa-graduation-cap" />
          </span>
          <div>
            <strong>PTE Academy</strong>
            <small>ADMIN PANEL</small>
          </div>
        </div>

        <button
          type="button"
          className={`admin_dashboard_link ${section === "home" ? "active" : ""}`}
          onClick={() => {
            setSection("home");
            closeForm();
          }}
        >
          <i className="fa-solid fa-table-cells-large" /> Dashboard
        </button>

        <div className="admin_nav_caption">PRACTICE SPACE</div>

        <nav className="admin_group_nav" aria-label="Question management">
          {ADMIN_GROUPS.map((group, groupIndex) => {
            const expanded = expandedGroup === group.id;
            const selected = group.items.some(([id]) => id === section);

            return (
              <div className="admin_nav_group" key={group.id}>
                {groupIndex === 1 && (
                  <div className="admin_nav_caption admin_nav_caption_other">
                    OTHER PRACTICE
                  </div>
                )}

                <button
                  type="button"
                  className={`admin_group_toggle ${expanded ? "expanded" : ""} ${selected ? "selected" : ""}`}
                  aria-expanded={expanded}
                  aria-controls={`admin-group-${group.id}`}
                  onClick={() =>
                    setExpandedGroup(expanded ? null : group.id)
                  }
                >
                  <span className="admin_group_icon">
                    <i className={group.icon} />
                  </span>
                  <span className="admin_group_label">{group.label}</span>
                  <i
                    className={`fa-solid fa-chevron-down admin_group_chevron ${expanded ? "rotated" : ""}`}
                  />
                </button>

                <div
                  id={`admin-group-${group.id}`}
                  className={`admin_group_content ${expanded ? "open" : ""}`}
                >
                  <div className="admin_group_content_inner">
                    {group.items.map(([id, label]) => {
                      const implemented = QUESTION_TYPES.some(
                        (type) => type.id === id,
                      );
                      return (
                        <button
                          type="button"
                          key={id}
                          disabled={!implemented}
                          title={
                            implemented
                              ? label
                              : `${label} — editor not yet available`
                          }
                          className={`admin_group_item ${section === id ? "active" : ""}`}
                          onClick={() => {
                            setSection(id);
                            closeForm();
                          }}
                        >
                          <span>{label}</span>
                          <i className="fa-solid fa-chevron-right" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </nav>

        <div className="admin_sidebar_footer">
          <button
            type="button"
            className="admin_side_link"
            onClick={onBackToSite}
          >
            <i className="fa-solid fa-arrow-left" /> Website
          </button>
          <button
            type="button"
            className="admin_side_logout"
            onClick={onLogout}
          >
            <i className="fa-solid fa-right-from-bracket" /> Logout
          </button>
        </div>
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

                {(READING_MCQ_TYPES.includes(section) ||
                  LISTENING_MCQ_TYPES.includes(section)) && (
                  <>
                    {LISTENING_MCQ_TYPES.includes(section) && (
                      <label>
                        <span>Audio URL</span>
                        <input
                          value={form.audioUrl}
                          onChange={(e) =>
                            updateField("audioUrl", e.target.value)
                          }
                          placeholder="https://example.com/audio.mp3"
                        />
                      </label>
                    )}

                    {READING_MCQ_TYPES.includes(section) && (
                      <label>
                        <span>Passage (one line = one paragraph)</span>
                        <textarea
                          rows={3}
                          value={form.passage}
                          onChange={(e) =>
                            updateField("passage", e.target.value)
                          }
                          placeholder="Write passage..."
                          required
                        />
                      </label>
                    )}

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

                    {section === "listening-mcq-multiple" && (
                      <label>
                        <span>Option E (optional)</span>
                        <input
                          value={form.optionE}
                          onChange={(e) =>
                            updateField("optionE", e.target.value)
                          }
                        />
                      </label>
                    )}

                    {section === "mcq-single" ||
                    LISTENING_SINGLE_TYPES.includes(section) ? (
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
                          <option value="E">E</option>
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

                {!READING_MCQ_TYPES.includes(section) &&
                  !LISTENING_MCQ_TYPES.includes(section) &&
                  section !== "fill-blanks-dropdown" &&
                  section !== "fill-blanks-drag" &&
                  section !== "reorder-paragraphs" && (
                    <>
                      <label>
                        <span>Audio URL (optional)</span>
                        <input
                          value={form.audioUrl}
                          onChange={(e) =>
                            updateField("audioUrl", e.target.value)
                          }
                          placeholder="https://example.com/audio.mp3"
                        />
                      </label>
                      <label>
                        <span>Prompt / Question text</span>
                        <textarea
                          rows={3}
                          value={form.questionText}
                          onChange={(e) =>
                            updateField("questionText", e.target.value)
                          }
                          placeholder="Write the task prompt..."
                        />
                      </label>
                    </>
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
                    {saving ? "Saving..." : editingId ? "Update" : "Save"}
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
