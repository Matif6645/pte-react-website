import { useState } from "react";
import "./PracticeShared.css";
import "./ReadingHome.css";
import readingImage from "../assets/reading-practice.svg";
import reorderIcon from "../assets/reorder-icon.png";
import dropdownIcon from "../assets/fillindropdown.png";
import dragDropIcon from "../assets/fillindragdrop.png";
import multipleAnswerIcon from "../assets/multiplechoosemultipleanswer.png";
import singleAnswerIcon from "../assets/multiplechoisesingleanswer.png";

// All five cards use one shared structure. Change content here, not in JSX.
const practiceTypes = [
  {
    id: "fill-blanks-dropdown",
    title: "Fill in the Blanks (Dropdown)",
    description:
      "Complete the passage by selecting the correct word from a drop-down list.",
    image: dropdownIcon,
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
    description: "Arrange the sentences in the most logical order.",
    image: reorderIcon,
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
    description: "Select all the correct answers from the options.",
    image: multipleAnswerIcon,
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
    description: "Drag the correct words into the blanks in the passage.",
    image: dragDropIcon,
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
    description: "Choose the one correct answer from the options.",
    image: singleAnswerIcon,
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

const readingFeatures = [
  {
    title: "Practise All PTE Reading Question Types",
    description: "Explore practice categories and build confidence.",
    icon: "fa-solid fa-book-open",
  },
  {
    title: "Improve Speed & Accuracy",
    description: "Practise with timed questions to improve your skills.",
    icon: "fa-solid fa-gauge-high",
  },
  {
    title: "Smart Learning Tips",
    description: "Grammar, vocabulary and illustrated guides.",
    icon: "fa-regular fa-lightbulb",
  },
  {
    title: "Video Tutorials",
    description: "Learn effective strategies through video lessons.",
    icon: "fa-solid fa-circle-play",
  },
];

const difficultyLevels = ["Easy", "Medium", "Hard"];

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
    setOpenDropdownId((previous) => (previous === cardId ? null : cardId));
  }

  function selectCategory(cardId, value) {
    setSelectedCategories((previous) => ({ ...previous, [cardId]: value }));
    setOpenDropdownId(null);
  }

  return (
    <div className="reading_home">
      <div className="reading_home_hero">
        <div className="reading_home_hero_text">
          <p className="reading_home_eyebrow">READING PRACTICE</p>
          <h2 className="reading_home_title">Choose Your Reading Practice</h2>
          <p className="reading_home_subtitle">
            Select a question type to start practising.
          </p>

          <div className="reading_home_features">
            {readingFeatures.map((feature) => (
              <div className="reading_home_feature" key={feature.title}>
                <div className="reading_home_feature_icon">
                  <i className={feature.icon} aria-hidden="true" />
                </div>
                <div className="reading_home_feature_content">
                  <h4>{feature.title}</h4>
                  <p>{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="reading_home_hero_image">
          <img src={readingImage} alt="PTE Academy Reading Practice" />
        </div>
      </div>

      <div className="practice_cards_grid">
        {practiceTypes.map((item) => {
          const isOpen = openDropdownId === item.id;
          const selectedCategory =
            selectedCategories[item.id] || item.categoryOptions[0]?.value || "";

          return (
            <article key={item.id} className="practice_card">
              <div className="practice_card_header">
                <div className={`practice_card_icon ${item.iconClass}`}>
                  <img
                    src={item.image}
                    alt=""
                    className="practice_card_icon_image"
                  />
                </div>

                <div className="practice_card_heading">
                  <h3 className="practice_card_title">{item.title}</h3>
                  <p className="practice_card_subtitle">{item.description}</p>
                  <div
                    className="practice_card_difficulties"
                    aria-label="Difficulty levels"
                  >
                    {difficultyLevels.map((level) => (
                      <span
                        key={level}
                        className={`practice_difficulty_tag ${level.toLowerCase()}`}
                      >
                        {level}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <hr className="practice_card_divider" />

              <div className="practice_card_stats">
                <div className="stat_item">
                  <i
                    className="fa-solid fa-layer-group stat_icon"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="stat_label">Total Questions</p>
                    <p className="stat_value">{item.totalQuestions ?? "—"}</p>
                  </div>
                </div>

                <div className="stat_item stat_right">
                  <i
                    className="fa-regular fa-folder stat_icon"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="stat_label">Categories</p>
                    <p className="stat_value">{item.categoriesCount ?? "—"}</p>
                  </div>
                </div>
              </div>

              <div className="practice_card_actions">
                <div className="card_dropdown_wrap">
                  <button
                    type="button"
                    className={`card_dropdown_trigger ${isOpen ? "open_trigger" : ""}`}
                    onClick={() => toggleDropdown(item.id)}
                    disabled={!item.ready && item.categoryOptions.length === 0}
                    aria-expanded={isOpen}
                    aria-controls={`category-panel-${item.id}`}
                    aria-label={`Choose a category for ${item.title}`}
                  >
                    <span>Choose a Category</span>
                    <i
                      className={`fa-solid ${isOpen ? "fa-chevron-up" : "fa-chevron-down"}`}
                      aria-hidden="true"
                    />
                  </button>

                  <div
                    id={`category-panel-${item.id}`}
                    className={`card_dropdown_panel ${isOpen ? "show" : ""}`}
                  >
                    <div className="question_categories_list">
                      {item.categoryOptions.length === 0 ? (
                        <p className="category_empty">Coming soon</p>
                      ) : (
                        item.categoryOptions.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            className={`category_row ${
                              selectedCategory === option.value
                                ? "active_category"
                                : ""
                            }`}
                            onClick={() =>
                              selectCategory(item.id, option.value)
                            }
                            tabIndex={isOpen ? 0 : -1}
                          >
                            <span>{option.label}</span>
                            <span className="category_count">
                              {option.count}
                            </span>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="start_practice_btn"
                  disabled={!item.ready}
                  onClick={() => {
                    if (item.ready) onStartPractice(item.id, selectedCategory);
                  }}
                >
                  Start Practice <span aria-hidden="true">→</span>
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

export default ReadingHome;
