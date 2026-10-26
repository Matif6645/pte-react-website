import { useEffect, useState } from "react";
import "./PracticeShared.css";

function PracticeShared({
  // PAGE HEADING
  title,
  type,
  description,
  icon = "fa-solid fa-book-open",
  headerImage = null,

  // CATEGORY AND SEARCH
  categories = [],
  selectedCategory = "",
  onCategoryChange,
  categoryCounts = {},
  search = "",
  onSearchChange,

  // QUESTION INFORMATION
  question,
  questionNumber = 1,
  totalQuestions = 0,
  details = [],

  // BUTTON FUNCTIONS
  onBack,
  onReset,
  onCheck,
  onPrevious,
  onNext,

  // BUTTON STATES
  resetDisabled = false,
  checkDisabled = false,
  previousDisabled = false,
  nextDisabled = false,
  checkLabel = "Check Answer",

  // QUESTION-SPECIFIC CONTENT
  children,
  actions,
  navigation,
}) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    setSeconds(0);

    if (!question) return;

    const id = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(id);
  }, [question?.id]);

  function formatTime(totalSeconds) {
    const mins = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
    const secs = String(totalSeconds % 60).padStart(2, "0");
    return `${mins}:${secs}`;
  }

  return (
    <div className="reading_practice_container">
      {/* ============================
          GLOBAL TOP SECTION
      ============================ */}

      <div className="reading_practice_top">
        {/* CATEGORY IMAGE - TOP RIGHT */}
        {headerImage && (
          <div className="practice_header_image">
            <img
              src={headerImage}
              alt={`${selectedCategory} Reading Practice`}
            />
          </div>
        )}
        {/* BACK BUTTON */}

        {onBack && (
          <button type="button" className="practice_back_btn" onClick={onBack}>
            <i className="fa-solid fa-arrow-left"></i>
            Back to Reading Practice
          </button>
        )}

        {/* READING PRACTICE LABEL */}

        <div className="reading_heading_row">
          <i className={icon}></i>
          <h2>READING PRACTICE</h2>
        </div>

        {/* MAIN PAGE HEADING */}

        <h3 className="practice_heading">
          {title}
          {type && <span> ({type})</span>}
        </h3>

        {/* INSTRUCTIONS */}

        <p className="practice_instruction">{description}</p>

        {/* ============================
            CATEGORY AND SEARCH
        ============================ */}

        <div className="category_search_container">
          {/* CATEGORY SELECTOR */}

          <div className="category_question_container">
            <label className="category_title" htmlFor="practice-category">
              Category &amp; Question Set
            </label>

            <div className="dropdown">
              <select
                id="practice-category"
                className="question_set_select"
                value={selectedCategory}
                onChange={(e) => onCategoryChange?.(e.target.value)}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category} · Question set ({categoryCounts[category] ?? 0})
                  </option>
                ))}
              </select>

              <i className="fa-solid fa-chevron-down dropdown_arrow"></i>
            </div>
          </div>

          {/* SEARCH QUESTIONS */}

          <div className="reading-right">
            <label className="search_title" htmlFor="practice-search">
              Search Questions
            </label>

            <div className="fill_blanks_search">
              <i className="fa-solid fa-magnifying-glass"></i>

              <input
                id="practice-search"
                type="search"
                placeholder="Search questions by title, keyword or question number..."
                value={search}
                onChange={(e) => onSearchChange?.(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ============================
          GLOBAL WHITE QUESTION CARD
      ============================ */}

      <div className="bottom_section_reading">
        {!question ? (
          <p className="practice_instruction">
            No questions found in this category.
          </p>
        ) : (
          <>
            {/* QUESTION NUMBER */}

            <p className="question_number">
              Question {questionNumber} of {totalQuestions}
            </p>

            {/* QUESTION TITLE AND DIFFICULTY */}

            <div className="question_title">
              <h3>{question.title}</h3>

              <span
                className={`difficulty difficulty_${question.difficulty.toLowerCase()}`}
              >
                {question.difficulty}
              </span>
            </div>

            {/* QUESTION DETAILS:
                TIME, TYPE/COUNT, CATEGORY */}

            <div className="question_details">
              {details.map((detail, index) => {
                const isTimer = detail.icon?.includes("fa-clock");

                return (
                  <div
                    className="question_detail"
                    key={`${detail.text}-${index}`}
                  >
                    <i className={detail.icon}></i>
                    <span className={isTimer ? "question_timer" : undefined}>
                      {isTimer ? formatTime(seconds) : detail.text}
                    </span>
                  </div>
                );
              })}
            </div>

            <hr className="question_divider" />

            {/* ============================
                DYNAMIC QUESTION CONTENT
            ============================ */}

            {children}

            {/* ============================
                RESET AND CHECK ANSWER
                SIDE BY SIDE
            ============================ */}

            {actions !== undefined
              ? actions
              : (onReset || onCheck) && (
                  <div className="practice_action_row">
                    {onReset && (
                      <button
                        type="button"
                        className="practice_reset_btn"
                        onClick={onReset}
                        disabled={resetDisabled}
                      >
                        <i className="fa-solid fa-rotate-left"></i>
                        Reset
                      </button>
                    )}

                    {onCheck && (
                      <button
                        type="button"
                        className="check_btn"
                        onClick={onCheck}
                        disabled={checkDisabled}
                      >
                        <i className="fa-solid fa-check"></i>
                        {checkLabel}
                      </button>
                    )}
                  </div>
                )}

            {/* ============================
                PREVIOUS / NEXT QUESTION
            ============================ */}

            {navigation !== undefined
              ? navigation
              : (onPrevious || onNext) && (
                  <div className="question_nav">
                    {onPrevious && (
                      <button
                        type="button"
                        className="prev_btn"
                        onClick={onPrevious}
                        disabled={previousDisabled}
                      >
                        <i className="fa-solid fa-arrow-left"></i>
                        Previous
                      </button>
                    )}

                    {onNext && (
                      <button
                        type="button"
                        className="next_btn"
                        onClick={onNext}
                        disabled={nextDisabled}
                      >
                        Next Question
                        <i className="fa-solid fa-arrow-right"></i>
                      </button>
                    )}
                  </div>
                )}
          </>
        )}
      </div>
    </div>
  );
}

export default PracticeShared;
