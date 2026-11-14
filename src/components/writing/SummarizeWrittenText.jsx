import { useEffect, useMemo, useState } from "react";

import { getMergedQuestions } from "../../admin/practiceQuestions";
import { addSubmission } from "../../admin/submissonStore.js";

import PracticeShared from "../PracticeShared.jsx";
import "./SummarizeWrittenText.css";

// =====================================
// CATEGORIES
// =====================================

const CATS = [
  "SCIENCE & TECHNOLOGY",
  "HISTORY",
  "BIOLOGY",
  "MEDICAL SCIENCE",
  "ENVIRONMENT",
  "GEOGRAPHY",
  "EDUCATION",
];

// =====================================
// DEFAULT SWT QUESTIONS
// =====================================

const defaultQuestions = [
  {
    id: 701,
    title: "CLIMATE CHANGE",
    difficulty: "Easy",
    time: "10:00",
    category: "ENVIRONMENT",
    questionText:
      "Climate change is affecting ecosystems around the world. Rising temperatures are causing glaciers to melt, altering weather patterns and threatening biodiversity. Governments and industries are exploring renewable energy and sustainable practices to reduce greenhouse gas emissions. Scientists emphasize that international cooperation is essential to protecting natural environments and limiting further global warming.",
  },
  {
    id: 702,
    title: "ARTIFICIAL INTELLIGENCE",
    difficulty: "Medium",
    time: "10:00",
    category: "SCIENCE & TECHNOLOGY",
    questionText:
      "Artificial intelligence has transformed numerous industries by automating repetitive tasks and supporting complex decision-making. In healthcare, AI systems can assist doctors in identifying diseases, while educational platforms use intelligent software to personalize learning. However, concerns about employment, privacy, and algorithmic bias highlight the importance of responsible development and effective regulation.",
  },
  {
    id: 703,
    title: "ONLINE EDUCATION",
    difficulty: "Easy",
    time: "10:00",
    category: "EDUCATION",
    questionText:
      "Online education provides students with flexible access to learning materials, allowing them to study regardless of geographical location. Digital platforms offer recorded lectures, interactive exercises, and personalized feedback. However, students may experience difficulties with motivation, time management, and limited face-to-face interaction. Educational institutions are increasingly adopting blended learning approaches to combine the convenience of online study with traditional classroom instruction.",
  },
];

// =====================================
// HELPER FUNCTIONS
// =====================================

function countWords(text) {
  return String(text || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

function parseSeconds(time) {
  const parts = String(time || "10:00")
    .split(":")
    .map(Number);

  if (parts.length === 2 && parts.every(Number.isFinite)) {
    return parts[0] * 60 + parts[1];
  }

  return 600;
}

function formatTime(seconds) {
  const safe = Math.max(0, Math.floor(seconds));

  const minutes = String(Math.floor(safe / 60)).padStart(2, "0");

  const secs = String(safe % 60).padStart(2, "0");

  return `${minutes}:${secs}`;
}

// =====================================
// MAIN COMPONENT
// =====================================

export default function SummarizeWrittenText({ onBack, initialCategory }) {
  // QUESTIONS
  const [questions, setQuestions] = useState(defaultQuestions);

  // CATEGORY
  const [cat, setCat] = useState(
    CATS.includes(initialCategory) ? initialCategory : CATS[0],
  );

  // NAVIGATION
  const [idx, setIdx] = useState(0);
  const [search, setSearch] = useState("");

  // STUDENT ANSWERS
  const [typedMap, setTypedMap] = useState({});
  const [submittedMap, setSubmittedMap] = useState({});
  const [errorMap, setErrorMap] = useState({});

  // TIMER
  const [remain, setRemain] = useState(600);

  // =====================================
  // LOAD QUESTIONS FROM ADMIN PANEL
  // =====================================

  useEffect(() => {
    let cancelled = false;

    getMergedQuestions("summarize-written-text", defaultQuestions)
      .then((merged) => {
        if (!cancelled) {
          setQuestions(merged);
        }
      })
      .catch((error) => {
        console.error("Failed to load SWT questions:", error);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // =====================================
  // CATEGORY COUNTS
  // =====================================

  const counts = useMemo(() => {
    const result = {};

    CATS.forEach((category) => {
      result[category] = questions.filter(
        (q) => q.category === category,
      ).length;
    });

    return result;
  }, [questions]);

  // =====================================
  // FILTER QUESTIONS
  // =====================================

  const list = useMemo(() => {
    const term = search.trim().toLowerCase();

    return questions.filter(
      (q) =>
        q.category === cat &&
        (!term ||
          String(q.title || "")
            .toLowerCase()
            .includes(term) ||
          String(q.id).includes(term)),
    );
  }, [questions, cat, search]);

  // =====================================
  // CURRENT QUESTION
  // =====================================

  const total = list.length;

  const safe = total ? Math.min(idx, total - 1) : 0;

  const q = list[safe];

  const typed = q ? typedMap[q.id] || "" : "";

  const submitted = q ? Boolean(submittedMap[q.id]) : false;

  const error = q ? errorMap[q.id] || "" : "";

  const wordCount = countWords(typed);

  // Prefer the passage field when available.
  // Admin-created SWT questions can also
  // use questionText for the passage.
  const passage = q ? q.passage || q.prompt || q.questionText || "" : "";

  // =====================================
  // TIMER
  // =====================================

  useEffect(() => {
    if (!q) return;

    setRemain(parseSeconds(q.time));
  }, [q?.id, q?.time]);

  useEffect(() => {
    if (!q || submitted || remain <= 0) return;

    const timer = setInterval(() => {
      setRemain((previous) => Math.max(0, previous - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [q?.id, submitted, remain]);

  // =====================================
  // SUBMIT SWT ANSWER
  // =====================================

  function handleSubmit() {
    if (!q || submitted) return;

    if (!typed.trim()) {
      setErrorMap((prev) => ({
        ...prev,
        [q.id]: "Please write your summary.",
      }));
      return;
    }

    if (wordCount < 5 || wordCount > 75) {
      setErrorMap((prev) => ({
        ...prev,
        [q.id]: "Your summary must contain 5–75 words.",
      }));
      return;
    }

    if (!passage.trim()) {
      setErrorMap((prev) => ({
        ...prev,
        [q.id]: "The reading passage is missing.",
      }));
      return;
    }

    try {
      // Save the student response locally.
      addSubmission({
        type: "summarize-written-text",
        questionId: q.id,
        questionTitle: q.title,
        difficulty: q.difficulty,
        category: q.category,
        prompt: passage,
        answerText: typed.trim(),
        wordCount,
        status: "submitted",
      });

      setSubmittedMap((prev) => ({
        ...prev,
        [q.id]: true,
      }));

      setErrorMap((prev) => ({
        ...prev,
        [q.id]: "",
      }));
    } catch (err) {
      console.error("SWT submission failed:", err);

      setErrorMap((prev) => ({
        ...prev,
        [q.id]: err.message || "Could not save your answer.",
      }));
    }
  }

  // =====================================
  // RESET / RE-DO
  // =====================================

  function handleReset() {
    if (!q) return;

    setTypedMap((prev) => ({
      ...prev,
      [q.id]: "",
    }));

    setSubmittedMap((prev) => ({
      ...prev,
      [q.id]: false,
    }));

    setErrorMap((prev) => ({
      ...prev,
      [q.id]: "",
    }));

    setRemain(parseSeconds(q.time));
  }

  // =====================================
  // PRACTICE PAGE
  // =====================================

  return (
    <PracticeShared
      headingLabel="WRITING PRACTICE"
      backLabel="Back"
      title="Summarize Written Text"
      description="Read the passage and summarize it in one sentence."
      icon="fa-solid fa-pen"
      categories={CATS}
      selectedCategory={cat}
      categoryCounts={counts}
      onCategoryChange={(category) => {
        setCat(category);
        setIdx(0);
        setSearch("");
      }}
      search={search}
      onSearchChange={(value) => {
        setSearch(value);
        setIdx(0);
      }}
      question={q}
      questionNumber={safe + 1}
      totalQuestions={total}
      details={
        q
          ? [
              {
                icon: "fa-regular fa-clock",
                text: `Remain: ${formatTime(remain)}`,
              },
              {
                icon: "fa-solid fa-align-left",
                text: "5–75 WORDS",
              },
              {
                icon: "fa-solid fa-tag",
                text: q.category,
              },
            ]
          : []
      }
      onBack={onBack}
      onReset={handleReset}
      resetDisabled={!q}
      onCheck={handleSubmit}
      checkDisabled={!q || submitted || !typed.trim()}
      checkLabel={submitted ? "Submitted" : "Submit"}
      onPrevious={() => {
        if (safe > 0) {
          setIdx(safe - 1);
        }
      }}
      onNext={() => {
        if (safe < total - 1) {
          setIdx(safe + 1);
        }
      }}
      previousDisabled={!safe}
      nextDisabled={safe >= total - 1}
    >
      {q && (
        <>
          {/* QUESTION INSTRUCTIONS */}
          <p className="swt_instruction">
            Read the text and summarize it in one sentence. Write 5–75 words.
          </p>

          {/* READING PASSAGE */}
          <div className="swt_passage_box">
            <div className="swt_passage_header">
              <span className="swt_passage_icon">
                <i className="fa-solid fa-book-open" />
              </span>

              <h3 className="swt_passage_label">Reading Passage</h3>
            </div>

            <p className="swt_passage_text">{passage}</p>
          </div>

          {/* ANSWER SECTION */}
          <div className="swt_answer_section">
            <label className="swt_answer_label" htmlFor={`swt-input-${q.id}`}>
              Write your one-sentence summary
            </label>

            <p className="swt_answer_hint">
              Your answer should contain 5–75 words.
            </p>

            <textarea
              id={`swt-input-${q.id}`}
              className="swt_textarea"
              rows={5}
              value={typed}
              disabled={submitted}
              placeholder="Write your summary here..."
              onChange={(event) => {
                setTypedMap((prev) => ({
                  ...prev,
                  [q.id]: event.target.value,
                }));

                setErrorMap((prev) => ({
                  ...prev,
                  [q.id]: "",
                }));
              }}
            />

            {/* WORD COUNTER */}
            <div className="swt_word_counter">
              <span className="swt_word_count">
                Word Count: <strong>{wordCount}</strong>
              </span>

              {wordCount > 0 && (
                <span
                  className={`swt_word_status ${
                    wordCount < 5 || wordCount > 75 ? "warning" : ""
                  }`}
                >
                  {wordCount >= 5 && wordCount <= 75
                    ? "Within target (5–75)"
                    : "Outside target (5–75)"}
                </span>
              )}
            </div>
          </div>

          {/* ERROR */}
          {error && (
            <p className="swt_error" role="alert">
              {error}
            </p>
          )}

          {/* SUCCESS */}
          {submitted && (
            <p className="swt_success">
              Your summary has been submitted successfully. AI scoring will be
              added later.
            </p>
          )}
        </>
      )}
    </PracticeShared>
  );
}
