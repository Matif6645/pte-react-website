import { useMemo, useState } from "react";
import { getMergedQuestions } from "../admin/practiceQuestions";
import PracticeShared from "./PracticeShared.jsx";
import "./FillInTheBlankDragDrop.css";

const defaultQuestions = [
  {
    id: 1,
    title: "FOREST",
    difficulty: "Medium",
    time: "02:42",
    blanks: 3,
    category: "SCIENCE & TECHNOLOGY",
    segments: [
      { type: "text", value: "The place had both mountains and a " },
      { type: "blank" },
      {
        type: "text",
        value: ". Every year, over 3.5 million ",
      },
      { type: "blank" },
      {
        type: "text",
        value: " come to enjoy the scenery. There are also several miles of ",
      },
      { type: "blank" },
      { type: "text", value: " that wind through the area." },
    ],
    wordBank: [
      "visitors",
      "forest",
      "desert",
      "kilometers",
      "travelers",
      "trails",
    ],
    correctAnswers: ["forest", "visitors", "trails"],
  },
  {
    id: 2,
    title: "ANCIENT TRADE",
    difficulty: "Easy",
    time: "02:00",
    blanks: 3,
    category: "HISTORY",
    segments: [
      { type: "text", value: "Early traders often travelled along major " },
      { type: "blank" },
      {
        type: "text",
        value:
          " to exchange goods between cities. Salt and spices were valuable ",
      },
      { type: "blank" },
      {
        type: "text",
        value: " in many markets. These networks helped ideas and culture ",
      },
      { type: "blank" },
      { type: "text", value: " across different regions." },
    ],
    wordBank: ["spread", "roads", "weapons", "items", "rivers", "silence"],
    correctAnswers: ["roads", "items", "spread"],
  },
  {
    id: 3,
    title: "PLANT GROWTH",
    difficulty: "Medium",
    time: "02:10",
    blanks: 3,
    category: "BIOLOGY",
    segments: [
      { type: "text", value: "Plants need sunlight, water and " },
      { type: "blank" },
      {
        type: "text",
        value:
          " from the soil to grow. Roots absorb water and minerals from the ",
      },
      { type: "blank" },
      {
        type: "text",
        value: ". Leaves use sunlight to produce food through ",
      },
      { type: "blank" },
      { type: "text", value: "." },
    ],
    wordBank: [
      "photosynthesis",
      "nutrients",
      "gravity",
      "ground",
      "noise",
      "metal",
    ],
    correctAnswers: ["nutrients", "ground", "photosynthesis"],
  },
  {
    id: 4,
    title: "HOSPITAL CARE",
    difficulty: "Hard",
    time: "02:20",
    blanks: 3,
    category: "MEDICAL SCIENCE",
    segments: [
      {
        type: "text",
        value:
          "Nurses monitor patients and give medicine according to the doctor's ",
      },
      { type: "blank" },
      {
        type: "text",
        value: ". Clean equipment helps reduce the risk of ",
      },
      { type: "blank" },
      {
        type: "text",
        value: ". Early treatment can improve a patient's chance of ",
      },
      { type: "blank" },
      { type: "text", value: "." },
    ],
    wordBank: [
      "infection",
      "recovery",
      "instructions",
      "traffic",
      "furniture",
      "weather",
    ],
    correctAnswers: ["instructions", "infection", "recovery"],
  },
];

const categories = [
  "SCIENCE & TECHNOLOGY",
  "HISTORY",
  "BIOLOGY",
  "MEDICAL SCIENCE",
];

function FillInTheBlankDragDrop({ onBack, initialCategory }) {
  const [selectedCategory, setSelectedCategory] = useState(
    initialCategory && categories.includes(initialCategory)
      ? initialCategory
      : categories[0],
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [search, setSearch] = useState("");
  const [answers, setAnswers] = useState({});
  const [checkedMap, setCheckedMap] = useState({});
  const [selectedWord, setSelectedWord] = useState(null);
  const [dragWord, setDragWord] = useState(null);

  const questions = useMemo(
    () => getMergedQuestions("fill-blanks-drag", defaultQuestions),
    [],
  );

  const categoryCounts = useMemo(() => {
    const counts = {};
    categories.forEach((cat) => {
      counts[cat] = questions.filter((q) => q.category === cat).length;
    });
    return counts;
  }, [questions]);

  const filteredQuestions = useMemo(() => {
    const byCategory = questions.filter((q) => q.category === selectedCategory);
    const term = search.trim().toLowerCase();
    if (!term) return byCategory;

    return byCategory.filter(
      (q) =>
        q.title.toLowerCase().includes(term) ||
        String(q.id).includes(term) ||
        q.difficulty.toLowerCase().includes(term),
    );
  }, [questions, selectedCategory, search]);

  const total = filteredQuestions.length;
  const safeIndex = total === 0 ? 0 : Math.min(currentIndex, total - 1);
  const question = filteredQuestions[safeIndex];
  const questionAnswers = question ? answers[question.id] || {} : {};
  const isChecked = question ? Boolean(checkedMap[question.id]) : false;
  const correctList = question ? question.correctAnswers : [];

  const usedWords = useMemo(() => {
    return Object.values(questionAnswers).filter(Boolean);
  }, [questionAnswers]);

  const availableWords = useMemo(() => {
    if (!question) return [];
    const remaining = [...question.wordBank];
    usedWords.forEach((word) => {
      const idx = remaining.indexOf(word);
      if (idx !== -1) remaining.splice(idx, 1);
    });
    return remaining;
  }, [question, usedWords]);

  const score = useMemo(() => {
    if (!question || !isChecked) return null;
    let right = 0;
    correctList.forEach((ans, i) => {
      if (questionAnswers[i] === ans) right += 1;
    });
    return { right, total: correctList.length };
  }, [question, isChecked, questionAnswers, correctList]);

  function changeCategory(category) {
    setSelectedCategory(category);
    setCurrentIndex(0);
    setSearch("");
    setSelectedWord(null);
    setDragWord(null);
  }

  function goToQuestion(index) {
    if (index < 0 || index >= total) return;
    setCurrentIndex(index);
    setSelectedWord(null);
    setDragWord(null);
  }

  function placeWord(blankIndex, word) {
    if (!question || isChecked || !word) return;

    setAnswers((prev) => {
      const current = { ...(prev[question.id] || {}) };
      current[blankIndex] = word;
      return { ...prev, [question.id]: current };
    });
    setSelectedWord(null);
    setDragWord(null);
  }

  function clearBlank(blankIndex) {
    if (!question || isChecked) return;
    setAnswers((prev) => {
      const current = { ...(prev[question.id] || {}) };
      delete current[blankIndex];
      return { ...prev, [question.id]: current };
    });
  }

  function handleBlankClick(blankIndex) {
    if (!question || isChecked) return;
    const filled = questionAnswers[blankIndex];

    if (filled) {
      clearBlank(blankIndex);
      return;
    }

    if (selectedWord) {
      placeWord(blankIndex, selectedWord);
    }
  }

  function handleWordClick(word) {
    if (isChecked) return;
    setSelectedWord((prev) => (prev === word ? null : word));
  }

  function handleCheck() {
    if (!question) return;
    const filledCount = Object.keys(questionAnswers).length;
    if (filledCount === 0) return;
    setCheckedMap((prev) => ({ ...prev, [question.id]: true }));
    setSelectedWord(null);
  }

  function handleReset() {
    if (!question) return;
    setAnswers((prev) => ({ ...prev, [question.id]: {} }));
    setCheckedMap((prev) => ({ ...prev, [question.id]: false }));
    setSelectedWord(null);
    setDragWord(null);
  }

  function blankClass(blankIndex) {
    const value = questionAnswers[blankIndex];
    let cls = "drag_blank";
    if (value) cls += " drag_blank_filled";
    if (!isChecked) return cls;

    if (value === correctList[blankIndex]) return `${cls} blank_correct`;
    return `${cls} blank_wrong`;
  }

  let blankCounter = -1;

  return (
    <PracticeShared
      title="Fill in the Blanks"
      type="Drag and Drop"
      description="Drag a word into each blank, or click a word then click a blank. Click a filled blank to remove the word."
      icon="fa-solid fa-hand-pointer"
      categories={categories}
      selectedCategory={selectedCategory}
      categoryCounts={categoryCounts}
      onCategoryChange={changeCategory}
      search={search}
      onSearchChange={(value) => {
        setSearch(value);
        setCurrentIndex(0);
      }}
      question={question}
      questionNumber={safeIndex + 1}
      totalQuestions={total}
      details={
        question
          ? [
              { icon: "fa-regular fa-clock", text: question.time },
              {
                icon: "fa-solid fa-layer-group",
                text: `${question.blanks} BLANKS`,
              },
              { icon: "fa-solid fa-tag", text: question.category },
            ]
          : []
      }
      onBack={onBack}
      onReset={handleReset}
      onCheck={handleCheck}
      checkDisabled={isChecked || usedWords.length === 0}
      checkLabel={isChecked ? "Checked" : "Check Answer"}
      onPrevious={() => goToQuestion(safeIndex - 1)}
      onNext={() => goToQuestion(safeIndex + 1)}
      previousDisabled={safeIndex === 0 || total === 0}
      nextDisabled={safeIndex === total - 1 || total === 0}
    >
      {question && (
        <>
          <div className="drag_passage">
            <p>
              {question.segments.map((segment, index) => {
                if (segment.type === "text") {
                  return <span key={index}>{segment.value}</span>;
                }

                blankCounter += 1;
                const blankIndex = blankCounter;
                const value = questionAnswers[blankIndex] || "";

                return (
                  <span
                    key={`${question.id}-blank-${blankIndex}`}
                    className="drag_blank_wrap"
                  >
                    <button
                      type="button"
                      className={blankClass(blankIndex)}
                      onClick={() => handleBlankClick(blankIndex)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        const word =
                          dragWord || e.dataTransfer.getData("text/plain");
                        if (word) placeWord(blankIndex, word);
                      }}
                      disabled={isChecked}
                    >
                      {value || ""}
                    </button>

                    {isChecked && value !== correctList[blankIndex] && (
                      <span className="correct_answer_hint">
                        (Answer: {correctList[blankIndex]})
                      </span>
                    )}
                  </span>
                );
              })}
            </p>
          </div>

          <div className="drag_word_bank">
            <p className="drag_bank_label">Word Bank</p>
            <div className="drag_words_row">
              {availableWords.length === 0 ? (
                <p className="drag_bank_empty">All words placed</p>
              ) : (
                availableWords.map((word) => (
                  <button
                    key={`${question.id}-${word}`}
                    type="button"
                    className={
                      selectedWord === word
                        ? "drag_word_chip selected_chip"
                        : "drag_word_chip"
                    }
                    draggable={!isChecked}
                    onDragStart={(e) => {
                      setDragWord(word);
                      e.dataTransfer.setData("text/plain", word);
                      e.dataTransfer.effectAllowed = "move";
                    }}
                    onDragEnd={() => setDragWord(null)}
                    onClick={() => handleWordClick(word)}
                    disabled={isChecked}
                  >
                    {word}
                  </button>
                ))
              )}
            </div>
          </div>

          {isChecked && score && (
            <p className="score_text">
              Score: {score.right} / {score.total} correct
            </p>
          )}
        </>
      )}
    </PracticeShared>
  );
}

export default FillInTheBlankDragDrop;
