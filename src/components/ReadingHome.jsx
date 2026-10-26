import { useState } from "react";
import "./PracticeShared.css";
import "./ReadingHome.css";
import readingImage from "../assets/reading-practice.svg";

const practiceTypes = [
  {
    id: "fill-blanks-dropdown",
    title: "Fill in the Blanks (Dropdown)",
    icon: "fa-solid fa-filter",
    iconClass: "icon_purple",
    totalQuestions: 14,
    categoriesCount: 4,
    ready: true,
    categoryOptions: [
      {
        value: "SCIENCE & TECHNOLOGY",
        label: "Science & Technology",
        count: 5,
      },
      { value: "HISTORY", label: "History", count: 3 },
      { value: "BIOLOGY", label: "Biology", count: 3 },
      { value: "MEDICAL SCIENCE", label: "Medical Science", count: 3 },
    ],
  },
  {
    id: "reorder-paragraphs",
    title: "Reorder Paragraphs",
    icon: "fa-solid fa-arrows-up-down",
    iconClass: "icon_blue",
    totalQuestions: 6,
    categoriesCount: 4,
    ready: true,
    categoryOptions: [
      {
        value: "SCIENCE & TECHNOLOGY",
        label: "Science & Technology",
        count: 2,
      },
      { value: "HISTORY", label: "History", count: 2 },
      { value: "BIOLOGY", label: "Biology", count: 1 },
      { value: "MEDICAL SCIENCE", label: "Medical Science", count: 1 },
    ],
  },
  {
    id: "mcq-multiple",
    title: "Multiple Choice (Multiple Answers)",
    icon: "fa-solid fa-list-check",
    iconClass: "icon_green",
    totalQuestions: 4,
    categoriesCount: 4,
    ready: true,
    categoryOptions: [
      {
        value: "SCIENCE & TECHNOLOGY",
        label: "Science & Technology",
        count: 1,
      },
      { value: "HISTORY", label: "History", count: 1 },
      { value: "BIOLOGY", label: "Biology", count: 1 },
      { value: "MEDICAL SCIENCE", label: "Medical Science", count: 1 },
    ],
  },
  {
    id: "fill-blanks-drag",
    title: "Fill in the Blanks (Drag and Drop)",
    icon: "fa-solid fa-hand-pointer",
    iconClass: "icon_orange",
    totalQuestions: 4,
    categoriesCount: 4,
    ready: true,
    categoryOptions: [
      {
        value: "SCIENCE & TECHNOLOGY",
        label: "Science & Technology",
        count: 1,
      },
      { value: "HISTORY", label: "History", count: 1 },
      { value: "BIOLOGY", label: "Biology", count: 1 },
      { value: "MEDICAL SCIENCE", label: "Medical Science", count: 1 },
    ],
  },
  {
    id: "mcq-single",
    title: "Multiple Choice (Single Answer)",
    icon: "fa-solid fa-list-ul",
    iconClass: "icon_pink",
    totalQuestions: 4,
    categoriesCount: 4,
    ready: true,
    categoryOptions: [
      {
        value: "SCIENCE & TECHNOLOGY",
        label: "Science & Technology",
        count: 1,
      },
      { value: "HISTORY", label: "History", count: 1 },
      { value: "BIOLOGY", label: "Biology", count: 1 },
      { value: "MEDICAL SCIENCE", label: "Medical Science", count: 1 },
    ],
  },
];

function ReadingHome({ onStartPractice }) {
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState({
    "fill-blanks-dropdown": "SCIENCE & TECHNOLOGY",
    "reorder-paragraphs": "SCIENCE & TECHNOLOGY",
    "mcq-multiple": "HISTORY",
    "fill-blanks-drag": "SCIENCE & TECHNOLOGY",
    "mcq-single": "BIOLOGY",
  });

  function toggleDropdown(cardId) {
    setOpenDropdownId((prev) => (prev === cardId ? null : cardId));
  }

  function selectCategory(cardId, value) {
    setSelectedCategories((prev) => ({
      ...prev,
      [cardId]: value,
    }));
    setOpenDropdownId(null);
  }

  function getSelectedLabel(item) {
    const selectedValue = selectedCategories[item.id];
    const found = item.categoryOptions.find(
      (opt) => opt.value === selectedValue,
    );
    if (found) {
      return `${found.label} · Question set (${found.count})`;
    }
    return "Question Categories";
  }

  return (
    <div className="reading_home">
      <div className="reading_home_hero">
        {/* LEFT SIDE - HEADING */}
        <div className="reading_home_hero_text">
          <p className="reading_home_eyebrow">READING PRACTICE</p>

          <h2 className="reading_home_title">Choose Your Reading Practice</h2>

          <p className="reading_home_subtitle">
            Select a question type to start practising.
          </p>
        </div>

        {/* RIGHT SIDE - CANVA IMAGE */}
        <div className="reading_home_hero_image">
          <img src={readingImage} alt="PTE Academy Reading Practice" />
        </div>
      </div>

      <div className="practice_cards_grid">
        {practiceTypes.map((item) => {
          const isOpen = openDropdownId === item.id;
          const selected =
            selectedCategories[item.id] || item.categoryOptions[0]?.value || "";

          return (
            <article key={item.id} className="practice_card">
              <div className={`practice_card_icon ${item.iconClass}`}>
                <i className={item.icon}></i>
              </div>

              <h3 className="practice_card_title">{item.title}</h3>

              <div className="practice_card_stats">
                <div>
                  <p className="stat_label">Total Questions</p>
                  <p className="stat_value">{item.totalQuestions ?? "—"}</p>
                </div>
                <div className="stat_right">
                  <p className="stat_label">Categories</p>
                  <p className="stat_value">{item.categoriesCount ?? "—"}</p>
                </div>
              </div>

              <hr className="practice_card_divider" />

              <div className="card_dropdown_wrap">
                <button
                  type="button"
                  className={
                    isOpen
                      ? "card_dropdown_trigger open_trigger"
                      : "card_dropdown_trigger"
                  }
                  onClick={() => toggleDropdown(item.id)}
                  disabled={!item.ready && item.categoryOptions.length === 0}
                >
                  <span>Choose a Category</span>

                  <i
                    className={`fa-solid ${
                      isOpen ? "fa-chevron-up" : "fa-chevron-down"
                    }`}
                  ></i>
                </button>

                <div className={`card_dropdown_panel ${isOpen ? "show" : ""}`}>
                  <div className="question_categories_list">
                    {item.categoryOptions.length === 0 ? (
                      <p className="category_empty">Coming soon</p>
                    ) : (
                      item.categoryOptions.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          className={
                            selected === opt.value
                              ? "category_row active_category"
                              : "category_row"
                          }
                          onClick={() => selectCategory(item.id, opt.value)}
                          tabIndex={isOpen ? 0 : -1}
                        >
                          <span>{opt.label}</span>
                          <span className="category_count">{opt.count}</span>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="start_practice_btn"
                onClick={() => {
                  if (item.ready) {
                    onStartPractice(item.id, selected);
                  }
                }}
                disabled={!item.ready}
              >
                Start Practice
                <span aria-hidden="true">→</span>
              </button>
            </article>
          );
        })}
      </div>
    </div>
  );
}

export default ReadingHome;
