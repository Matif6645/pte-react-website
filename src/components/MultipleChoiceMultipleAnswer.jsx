import { useMemo, useState } from "react";
import "./MultipleChoiceMultipleAnswer.css";
import "./PracticeShared.css";

const questions = [
  {
    id: 1,
    title: "NEOLITHIC TOMBS",
    difficulty: "Medium",
    time: "00:25",
    category: "HISTORY",
    passage: [
      "Analysis of ancient DNA from one of Britain's best-preserved Neolithic tombs has revealed that it was used by an extended family. The research suggests that the people buried there belonged to five continuous generations of a single family.",
      "The tomb, known as Hazleton North, was built around 3700 BC near the village of Hazleton in Gloucestershire. Scientists examined the remains of 35 people and found that most of them were related through the male line.",
      "The findings also show that women often married into the community, while men tended to remain in the same family group. This helps historians understand social structures in early farming societies.",
    ],
    questionText:
      "What has been revealed by analysis of ancient DNA from one of Britain's best-preserved Neolithic tombs?",
    options: [
      { id: "A", text: "That it was used by an extended family" },
      { id: "B", text: "That Neolithic people never moved between villages" },
      { id: "C", text: "That farming began in Britain after 1000 BC" },
      {
        id: "D",
        text: "That DNA cannot be recovered from bones older than 1000 years",
      },
      { id: "E", text: "That all tombs in Britain belonged to royal families" },
    ],
    correctAnswers: ["A"],
  },
  {
    id: 2,
    title: "RENEWABLE ENERGY",
    difficulty: "Easy",
    time: "00:20",
    category: "SCIENCE & TECHNOLOGY",
    passage: [
      "Renewable energy comes from natural sources that can be replaced over time, such as sunlight, wind and water. Unlike fossil fuels, these sources produce fewer greenhouse gas emissions during use.",
      "Solar panels convert sunlight into electricity, while wind turbines use moving air to generate power. Many countries are investing in these technologies to reduce pollution and improve energy security.",
      "However, renewable energy can be affected by weather conditions. For this reason, energy storage systems are becoming more important.",
    ],
    questionText:
      "According to the passage, which statements are true about renewable energy?",
    options: [
      { id: "A", text: "It can come from sunlight, wind and water" },
      {
        id: "B",
        text: "It always works equally well in every weather condition",
      },
      {
        id: "C",
        text: "It generally produces fewer greenhouse gas emissions than fossil fuels",
      },
      { id: "D", text: "Solar panels convert sunlight into electricity" },
      { id: "E", text: "Fossil fuels are a type of renewable energy" },
    ],
    correctAnswers: ["A", "C", "D"],
  },
  {
    id: 3,
    title: "HUMAN MEMORY",
    difficulty: "Medium",
    time: "00:22",
    category: "BIOLOGY",
    passage: [
      "Human memory allows people to store and recall information from past experiences. Short-term memory holds information for a brief period, while long-term memory can keep knowledge for years.",
      "Repetition and meaningful connections help transfer information into long-term memory. Sleep also plays an important role in strengthening memories.",
      "Scientists continue to study how the brain organises and retrieves past experiences.",
    ],
    questionText: "Which of the following ideas are supported by the passage?",
    options: [
      { id: "A", text: "Short-term memory stores information briefly" },
      { id: "B", text: "Sleep can help strengthen memories" },
      { id: "C", text: "Long-term memory only lasts for a few minutes" },
      {
        id: "D",
        text: "Repetition can help move information into long-term memory",
      },
      { id: "E", text: "The brain never retrieves past experiences" },
    ],
    correctAnswers: ["A", "B", "D"],
  },
  {
    id: 4,
    title: "ANTIBIOTIC USE",
    difficulty: "Hard",
    time: "00:24",
    category: "MEDICAL SCIENCE",
    passage: [
      "Antibiotics are medicines used to treat bacterial infections. When used correctly, they can save lives and reduce the spread of disease.",
      "However, unnecessary use of antibiotics can help bacteria become resistant. Resistant infections are harder and more expensive to treat.",
      "Health organisations encourage doctors and patients to use antibiotics only when needed and to complete prescribed courses.",
    ],
    questionText: "Based on the passage, which statements are correct?",
    options: [
      { id: "A", text: "Antibiotics treat bacterial infections" },
      { id: "B", text: "Overuse can lead to antibiotic resistance" },
      { id: "C", text: "Resistant infections may be harder to treat" },
      { id: "D", text: "Antibiotics should be taken even when not needed" },
      {
        id: "E",
        text: "Completing a prescribed course is often recommended",
      },
    ],
    correctAnswers: ["A", "B", "C", "E"],
  },
];

const categories = [
  "SCIENCE & TECHNOLOGY",
  "HISTORY",
  "BIOLOGY",
  "MEDICAL SCIENCE",
];

function MultipleChoice({ onBack, initialCategory }) {
  const [selectedCategory, setSelectedCategory] = useState(
    initialCategory && categories.includes(initialCategory)
      ? initialCategory
      : categories[0],
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [search, setSearch] = useState("");
  const [selectedMap, setSelectedMap] = useState({});
  const [checkedMap, setCheckedMap] = useState({});

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
  const selected = question ? selectedMap[question.id] || [] : [];

  const score = useMemo(() => {
    if (!question || !isChecked) return null;
    const correct = question.correctAnswers;
    const rightSelected = selected.filter((id) => correct.includes(id)).length;
    const wrongSelected = selected.filter((id) => !correct.includes(id)).length;
    const missed = correct.filter((id) => !selected.includes(id)).length;
    const isPerfect =
      wrongSelected === 0 && missed === 0 && selected.length === correct.length;
    return {
      rightSelected,
      wrongSelected,
      missed,
      isPerfect,
      total: correct.length,
    };
  }, [question, isChecked, selected]);

  function changeCategory(category) {
    setSelectedCategory(category);
    setCurrentIndex(0);
    setSearch("");
  }

  function goToQuestion(index) {
    if (index < 0 || index >= total) return;
    setCurrentIndex(index);
  }

  function toggleOption(optionId) {
    if (!question || isChecked) return;
    setSelectedMap((prev) => {
      const current = prev[question.id] || [];
      const exists = current.includes(optionId);
      const next = exists
        ? current.filter((id) => id !== optionId)
        : [...current, optionId];
      return { ...prev, [question.id]: next };
    });
  }

  function handleCheck() {
    if (!question || selected.length === 0) return;
    setCheckedMap((prev) => ({ ...prev, [question.id]: true }));
  }

  function handleReset() {
    if (!question) return;
    setSelectedMap((prev) => ({ ...prev, [question.id]: [] }));
    setCheckedMap((prev) => ({ ...prev, [question.id]: false }));
  }

  function optionClass(optionId) {
    const isSelected = selected.includes(optionId);
    if (!isChecked) {
      return isSelected ? "mcq_option selected_option" : "mcq_option";
    }

    const isCorrect = question.correctAnswers.includes(optionId);
    if (isCorrect && isSelected) return "mcq_option option_correct";
    if (!isCorrect && isSelected) return "mcq_option option_wrong";
    if (isCorrect && !isSelected) return "mcq_option option_missed";
    return "mcq_option";
  }

  return (
    // html__________________________________-----------------------------------
    <div className="mcq_practice_container">
      <div className="mcq_practice_top">
        {onBack && (
          <button type="button" className="back_to_home_btn" onClick={onBack}>
            <i className="fa-solid fa-arrow-left"></i>
            Back to Reading Practice
          </button>
        )}

        <div className="reading_heading_row">
          <i className="fa-solid fa-list-check"></i>
          <h2>READING PRACTICE</h2>
        </div>

        <h3 className="fill_blanks_heading">
          Multiple Choice <span>(Multiple Answers)</span>
        </h3>

        <p className="practice_instruction">
          Read the passage and select all options that correctly answer the
          question.
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
                <i className="fa-solid fa-square-check"></i>
                <span>MULTIPLE ANSWERS</span>
              </div>
              <div className="question_detail">
                <i className="fa-solid fa-tag"></i>
                <span>{question.category}</span>
              </div>
            </div>

            <hr className="question_divider" />

            <div className="mcq_passage">
              {question.passage.map((para, index) => (
                <p key={index}>{para}</p>
              ))}
            </div>

            <p className="mcq_question_text">{question.questionText}</p>

            <div className="mcq_options_list">
              {question.options.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  className={optionClass(opt.id)}
                  onClick={() => toggleOption(opt.id)}
                  disabled={isChecked}
                >
                  <span className="mcq_checkbox">
                    {isChecked ? (
                      question.correctAnswers.includes(opt.id) ? (
                        <i className="fa-solid fa-check"></i>
                      ) : selected.includes(opt.id) ? (
                        <i className="fa-solid fa-xmark"></i>
                      ) : null
                    ) : selected.includes(opt.id) ? (
                      <i className="fa-solid fa-check"></i>
                    ) : null}
                  </span>
                  <span className="mcq_option_label">{opt.id}.</span>
                  <span className="mcq_option_text">{opt.text}</span>
                </button>
              ))}
            </div>

            {isChecked && score && (
              <p className="score_text">
                {score.isPerfect
                  ? `Perfect! ${score.rightSelected}/${score.total} correct`
                  : `Result: ${score.rightSelected} correct, ${score.wrongSelected} wrong, ${score.missed} missed`}
              </p>
            )}

            <div className="mcq_footer_actions">
              <button type="button" className="reset_btn" onClick={handleReset}>
                <i className="fa-solid fa-rotate-left"></i>
                Reset
              </button>

              <button
                type="button"
                className="check_btn"
                onClick={handleCheck}
                disabled={isChecked || selected.length === 0}
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

export default MultipleChoice;
