import { useEffect, useMemo, useState } from "react";
import "./ReorderParagraphs.css";
import "./PracticeShared.css";

const questions = [
  {
    id: 1,
    title: "CLIMATE AND WEATHER",
    difficulty: "Easy",
    time: "00:20",
    paragraphs: 4,
    category: "SCIENCE & TECHNOLOGY",
    correctOrder: ["A", "B", "C", "D"],
    paragraphsList: [
      {
        id: "A",
        text: "Weather describes the short-term conditions of the atmosphere in a particular place.",
      },
      {
        id: "B",
        text: "These conditions include temperature, rainfall, wind and humidity on a given day.",
      },
      {
        id: "C",
        text: "Climate, by contrast, refers to the average weather patterns over many years.",
      },
      {
        id: "D",
        text: "Understanding both concepts helps scientists predict environmental changes more accurately.",
      },
    ],
  },
  {
    id: 2,
    title: "INTERNET COMMUNICATION",
    difficulty: "Medium",
    time: "00:22",
    paragraphs: 4,
    category: "SCIENCE & TECHNOLOGY",
    correctOrder: ["A", "B", "C", "D"],
    paragraphsList: [
      {
        id: "A",
        text: "The internet has transformed the way people exchange information around the world.",
      },
      {
        id: "B",
        text: "Messages, images and videos can now be shared within seconds across long distances.",
      },
      {
        id: "C",
        text: "This speed has improved collaboration in education, business and scientific research.",
      },
      {
        id: "D",
        text: "However, users must also consider privacy and the reliability of online sources.",
      },
    ],
  },
  {
    id: 3,
    title: "ANCIENT TRADE ROUTES",
    difficulty: "Medium",
    time: "00:21",
    paragraphs: 4,
    category: "HISTORY",
    correctOrder: ["A", "B", "C", "D"],
    paragraphsList: [
      {
        id: "A",
        text: "Ancient trade routes connected distant regions through networks of roads and sea paths.",
      },
      {
        id: "B",
        text: "Merchants transported silk, spices, metals and other valuable goods along these routes.",
      },
      {
        id: "C",
        text: "As goods moved, ideas, languages and technologies also spread between cultures.",
      },
      {
        id: "D",
        text: "These exchanges helped shape the development of early civilisations across continents.",
      },
    ],
  },
  {
    id: 4,
    title: "THE PRINTING PRESS",
    difficulty: "Hard",
    time: "00:24",
    paragraphs: 4,
    category: "HISTORY",
    correctOrder: ["A", "B", "C", "D"],
    paragraphsList: [
      {
        id: "A",
        text: "Before the printing press, books were copied by hand and were expensive to produce.",
      },
      {
        id: "B",
        text: "The invention of movable type made it possible to print many copies quickly.",
      },
      {
        id: "C",
        text: "As a result, literacy increased and knowledge became more widely available.",
      },
      {
        id: "D",
        text: "This technological change had a lasting impact on education and public debate.",
      },
    ],
  },
  {
    id: 5,
    title: "PLANT GROWTH",
    difficulty: "Easy",
    time: "00:18",
    paragraphs: 4,
    category: "BIOLOGY",
    correctOrder: ["A", "B", "C", "D"],
    paragraphsList: [
      {
        id: "A",
        text: "Plants need sunlight, water and nutrients from the soil to grow successfully.",
      },
      {
        id: "B",
        text: "Through photosynthesis, they convert light energy into chemical energy.",
      },
      {
        id: "C",
        text: "This energy supports growth in roots, stems, leaves and flowers.",
      },
      {
        id: "D",
        text: "Without these basic resources, most plants cannot survive for long.",
      },
    ],
  },
  {
    id: 6,
    title: "THE HUMAN HEART",
    difficulty: "Medium",
    time: "00:20",
    paragraphs: 4,
    category: "MEDICAL SCIENCE",
    correctOrder: ["A", "B", "C", "D"],
    paragraphsList: [
      {
        id: "A",
        text: "The human heart is a muscular organ that pumps blood throughout the body.",
      },
      {
        id: "B",
        text: "Blood carries oxygen and nutrients to tissues and removes waste products.",
      },
      {
        id: "C",
        text: "A healthy heartbeat keeps this circulation continuous and efficient.",
      },
      {
        id: "D",
        text: "Regular exercise and a balanced diet help maintain long-term heart health.",
      },
    ],
  },
];

const categories = [
  "SCIENCE & TECHNOLOGY",
  "HISTORY",
  "BIOLOGY",
  "MEDICAL SCIENCE",
];

function shuffleParagraphs(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  const ids = copy.map((p) => p.id).join("");
  if (ids === "ABCD") {
    return [copy[1], copy[0], copy[3], copy[2]];
  }
  return copy;
}

function emptySlots(count) {
  return Array.from({ length: count }, () => null);
}

function ReorderParagraphs({ onBack, initialCategory }) {
  const [selectedCategory, setSelectedCategory] = useState(
    initialCategory && categories.includes(initialCategory)
      ? initialCategory
      : categories[0],
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [search, setSearch] = useState("");
  const [jumbledMap, setJumbledMap] = useState({});
  const [answersMap, setAnswersMap] = useState({});
  const [checkedMap, setCheckedMap] = useState({});
  const [dragParaId, setDragParaId] = useState(null);
  const [dragFrom, setDragFrom] = useState(null);

  const categoryCounts = useMemo(() => {
    const counts = {};
    categories.forEach((cat) => {
      counts[cat] = questions.filter((q) => q.category === cat).length;
    });
    return counts;
  }, []);

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
  }, [selectedCategory, search]);

  const total = filteredQuestions.length;
  const safeIndex = total === 0 ? 0 : Math.min(currentIndex, total - 1);
  const question = filteredQuestions[safeIndex];
  const isChecked = question ? Boolean(checkedMap[question.id]) : false;

  useEffect(() => {
    if (!question) return;
    setJumbledMap((prev) => {
      if (prev[question.id]) return prev;
      return {
        ...prev,
        [question.id]: shuffleParagraphs(question.paragraphsList),
      };
    });
    setAnswersMap((prev) => {
      if (prev[question.id]) return prev;
      return {
        ...prev,
        [question.id]: emptySlots(question.paragraphs),
      };
    });
  }, [question]);

  const jumbled = question ? jumbledMap[question.id] || [] : [];
  const answers = question
    ? answersMap[question.id] || emptySlots(question.paragraphs)
    : [];

  const usedIds = useMemo(
    () => new Set(answers.filter(Boolean).map((p) => p.id)),
    [answers],
  );

  const score = useMemo(() => {
    if (!question || !isChecked) return null;
    let right = 0;
    answers.forEach((para, index) => {
      if (para && para.id === question.correctOrder[index]) right += 1;
    });
    return { right, total: question.correctOrder.length };
  }, [question, isChecked, answers]);

  function changeCategory(category) {
    setSelectedCategory(category);
    setCurrentIndex(0);
    setSearch("");
  }

  function goToQuestion(index) {
    if (index < 0 || index >= total) return;
    setCurrentIndex(index);
  }

  function updateAnswers(next) {
    if (!question) return;
    setAnswersMap((prev) => ({ ...prev, [question.id]: next }));
  }

  function addToAnswer(para) {
    if (!question || isChecked || usedIds.has(para.id)) return;
    const next = [...answers];
    const emptyIndex = next.findIndex((slot) => slot === null);
    if (emptyIndex === -1) return;
    next[emptyIndex] = para;
    updateAnswers(next);
  }

  function removeFromAnswer(slotIndex) {
    if (!question || isChecked) return;
    const next = [...answers];
    next[slotIndex] = null;
    updateAnswers(next);
  }

  function moveAnswer(slotIndex, direction) {
    if (!question || isChecked) return;
    const target = slotIndex + direction;
    if (target < 0 || target >= answers.length) return;
    const next = [...answers];
    [next[slotIndex], next[target]] = [next[target], next[slotIndex]];
    updateAnswers(next);
  }

  function handleReset() {
    if (!question) return;
    updateAnswers(emptySlots(question.paragraphs));
    setCheckedMap((prev) => ({ ...prev, [question.id]: false }));
    setJumbledMap((prev) => ({
      ...prev,
      [question.id]: shuffleParagraphs(question.paragraphsList),
    }));
  }

  function handleCheck() {
    if (!question) return;
    if (answers.some((slot) => slot === null)) return;
    setCheckedMap((prev) => ({ ...prev, [question.id]: true }));
  }

  function onDragStartPara(para, from, index) {
    if (isChecked) return;
    setDragParaId(para.id);
    setDragFrom({ side: from, index });
  }

  function onDragOverSlot(e) {
    e.preventDefault();
  }

  function onDropToSlot(slotIndex) {
    if (!question || isChecked || dragParaId == null) return;

    const para =
      question.paragraphsList.find((p) => p.id === dragParaId) || null;
    if (!para) return;

    const next = [...answers];

    if (dragFrom?.side === "answer") {
      const fromIndex = dragFrom.index;
      if (fromIndex === slotIndex) {
        setDragParaId(null);
        setDragFrom(null);
        return;
      }
      const temp = next[slotIndex];
      next[slotIndex] = next[fromIndex];
      next[fromIndex] = temp;
    } else if (!next[slotIndex] && !usedIds.has(para.id)) {
      next[slotIndex] = para;
    } else {
      setDragParaId(null);
      setDragFrom(null);
      return;
    }

    updateAnswers(next);
    setDragParaId(null);
    setDragFrom(null);
  }

  function onDragEnd() {
    setDragParaId(null);
    setDragFrom(null);
  }

  return (
    <div className="reorder_practice_container">
      <div className="reorder_practice_top">
        {onBack && (
          <button type="button" className="back_to_home_btn" onClick={onBack}>
            <i className="fa-solid fa-arrow-left"></i>
            Back to Reading Practice
          </button>
        )}

        <div className="reading_heading_row">
          <i className="fa-solid fa-arrows-up-down"></i>
          <h2>READING PRACTICE</h2>
        </div>

        <h3 className="fill_blanks_heading">Reorder Paragraphs</h3>

        <p className="practice_instruction">
          Select the jumbled paragraphs on the left to place them in your
          answer. Use the arrows to change their order. You can also drag and
          drop.
        </p>

        <div className="category_search_container">
          <div className="category_question_container">
            <p className="category_title">Category &amp; Question Set</p>
            <div className="dropdown">
              <select
                className="question_set_select"
                value={selectedCategory}
                onChange={(e) => changeCategory(e.target.value)}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat} · Question set ({categoryCounts[cat]})
                  </option>
                ))}
              </select>
              <i className="fa-solid fa-chevron-down dropdown_arrow"></i>
            </div>
          </div>

          <div className="reading-right">
            <p className="search_title">Search Questions</p>
            <div className="fill_blanks_search">
              <i className="fa-solid fa-magnifying-glass"></i>
              <input
                type="search"
                placeholder="Search questions by title, keyword or question number..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentIndex(0);
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bottom_section_reading">
        {!question ? (
          <p className="practice_instruction">
            No questions found in this category.
          </p>
        ) : (
          <>
            <p className="question_number">
              Question {safeIndex + 1} of {total}
            </p>

            <div className="question_title">
              <h3>{question.title}</h3>
              <span
                className={`difficulty difficulty_${question.difficulty.toLowerCase()}`}
              >
                {question.difficulty}
              </span>
            </div>

            <div className="question_details">
              <div className="question_detail">
                <i className="fa-regular fa-clock"></i>
                <span>{question.time}</span>
              </div>
              <div className="question_detail">
                <i className="fa-solid fa-layer-group"></i>
                <span>{question.paragraphs} PARAGRAPHS</span>
              </div>
              <div className="question_detail">
                <i className="fa-solid fa-tag"></i>
                <span>{question.category}</span>
              </div>
            </div>

            <hr className="question_divider" />

            <div className="reorder_board">
              <section className="reorder_column">
                <div className="reorder_column_header">
                  <i className="fa-solid fa-shuffle"></i>
                  <h4>Jumbled Paragraphs</h4>
                </div>

                <div className="jumbled_list">
                  {jumbled.map((para) => {
                    const used = usedIds.has(para.id);
                    return (
                      <div
                        key={para.id}
                        className={
                          used ? "jumble_card jumble_used" : "jumble_card"
                        }
                        draggable={!isChecked && !used}
                        onDragStart={() =>
                          onDragStartPara(para, "jumbled", null)
                        }
                        onDragEnd={onDragEnd}
                      >
                        <div className="jumble_card_top">
                          {!isChecked && (
                            <button
                              type="button"
                              className={
                                used ? "icon_btn used_btn" : "icon_btn add_btn"
                              }
                              onClick={() => addToAnswer(para)}
                              disabled={used}
                            >
                              <i
                                className={`fa-solid ${
                                  used ? "fa-check" : "fa-plus"
                                }`}
                              ></i>
                            </button>
                          )}
                        </div>
                        <p className="jumble_text">{para.text}</p>
                      </div>
                    );
                  })}
                </div>
              </section>

              <section className="reorder_column">
                <div className="reorder_column_header">
                  <i className="fa-solid fa-list-ol"></i>
                  <h4>Your Answer</h4>
                </div>

                <div className="answer_slots">
                  {answers.map((para, slotIndex) => {
                    let statusClass = "";
                    if (isChecked && para) {
                      statusClass =
                        para.id === question.correctOrder[slotIndex]
                          ? "slot_correct"
                          : "slot_wrong";
                    }

                    return (
                      <div
                        key={`slot-${slotIndex}`}
                        className={
                          para
                            ? `answer_slot filled_slot ${statusClass}`
                            : "answer_slot empty_slot"
                        }
                        onDragOver={onDragOverSlot}
                        onDrop={() => onDropToSlot(slotIndex)}
                      >
                        <span className="slot_number">{slotIndex + 1}</span>

                        {para ? (
                          <div
                            className="answer_card"
                            draggable={!isChecked}
                            onDragStart={() =>
                              onDragStartPara(para, "answer", slotIndex)
                            }
                            onDragEnd={onDragEnd}
                          >
                            <div className="answer_card_top">
                              {!isChecked && (
                                <button
                                  type="button"
                                  className="icon_btn remove_btn"
                                  onClick={() => removeFromAnswer(slotIndex)}
                                >
                                  <i className="fa-solid fa-xmark"></i>
                                </button>
                              )}
                            </div>
                            <p className="jumble_text">{para.text}</p>
                            {!isChecked && (
                              <div className="answer_move_btns">
                                <button
                                  type="button"
                                  className="move_arrow_btn"
                                  onClick={() => moveAnswer(slotIndex, -1)}
                                  disabled={slotIndex === 0}
                                >
                                  <i className="fa-solid fa-chevron-up"></i>
                                </button>
                                <button
                                  type="button"
                                  className="move_arrow_btn"
                                  onClick={() => moveAnswer(slotIndex, 1)}
                                  disabled={slotIndex === answers.length - 1}
                                >
                                  <i className="fa-solid fa-chevron-down"></i>
                                </button>
                              </div>
                            )}
                          </div>
                        ) : (
                          <p className="slot_placeholder">Select a paragraph</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>

            {isChecked && score && (
              <p className="score_text">
                Score: {score.right} / {score.total} correct
              </p>
            )}

            <div className="reorder_footer_actions">
              <button type="button" className="reset_btn" onClick={handleReset}>
                <i className="fa-solid fa-rotate-left"></i>
                Reset
              </button>

              <button
                type="button"
                className="check_btn"
                onClick={handleCheck}
                disabled={isChecked || answers.some((s) => s === null)}
              >
                <i className="fa-solid fa-check"></i>
                {isChecked ? "Checked" : "Check Answer"}
              </button>
            </div>

            <div className="question_nav">
              <button
                type="button"
                className="prev_btn"
                onClick={() => goToQuestion(safeIndex - 1)}
                disabled={safeIndex === 0}
              >
                <i className="fa-solid fa-arrow-left"></i>
                Previous
              </button>

              <button
                type="button"
                className="next_btn"
                onClick={() => goToQuestion(safeIndex + 1)}
                disabled={safeIndex === total - 1}
              >
                Next Question
                <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ReorderParagraphs;
