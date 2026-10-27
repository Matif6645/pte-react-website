import { useEffect, useMemo, useState } from "react";
import { getMergedQuestions } from "../admin/practiceQuestions";
import PracticeShared from "./PracticeShared.jsx";
import "./ReorderParagraphs.css";

const defaultQuestions = [
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

  const questions = useMemo(
    () => getMergedQuestions("reorder-paragraphs", defaultQuestions),
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
    <PracticeShared
      title="Reorder Paragraphs"
      description="Select the jumbled paragraphs on the left to place them in your answer. Use the arrows to change their order. You can also drag and drop."
      icon="fa-solid fa-arrows-up-down"
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
                text: `${question.paragraphs} PARAGRAPHS`,
              },
              { icon: "fa-solid fa-tag", text: question.category },
            ]
          : []
      }
      onBack={onBack}
      onReset={handleReset}
      onCheck={handleCheck}
      checkDisabled={isChecked || answers.some((s) => s === null)}
      checkLabel={isChecked ? "Checked" : "Check Answer"}
      onPrevious={() => goToQuestion(safeIndex - 1)}
      onNext={() => goToQuestion(safeIndex + 1)}
      previousDisabled={safeIndex === 0 || total === 0}
      nextDisabled={safeIndex === total - 1 || total === 0}
    >
      {question && (
        <>
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
                      onDragStart={() => onDragStartPara(para, "jumbled", null)}
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
        </>
      )}
    </PracticeShared>
  );
}

export default ReorderParagraphs;
