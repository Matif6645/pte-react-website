import { useMemo, useState } from "react";
import "./ReorderParagraph.css";
import "./ReadingPractice.css";

const questions = [
  {
    id: 1,
    title: "CLIMATE AND WEATHER",
    difficulty: "Easy",
    time: "00:14",
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
    title: "ARTIFICIAL INTELLIGENCE",
    difficulty: "Easy",
    time: "00:15",
    paragraphs: 4,
    category: "SCIENCE & TECHNOLOGY",
    correctOrder: ["B", "A", "D", "C"],
    paragraphsList: [
      {
        id: "A",
        text: "These systems can learn from large amounts of data and identify patterns that humans might overlook.",
      },
      {
        id: "B",
        text: "Artificial intelligence is a branch of computer science that focuses on creating machines capable of performing tasks that normally require human intelligence.",
      },
      {
        id: "C",
        text: "As a result, artificial intelligence is increasingly used to improve efficiency and support decision-making in many industries.",
      },
      {
        id: "D",
        text: "For example, AI applications can help doctors analyse medical images and detect possible diseases.",
      },
    ],
  },
  {
    id: 3,
    title: "SOLAR ENERGY",
    difficulty: "Medium",
    time: "00:18",
    paragraphs: 4,
    category: "SCIENCE & TECHNOLOGY",
    correctOrder: ["B", "C", "A", "D"],
    paragraphsList: [
      {
        id: "A",
        text: "This electricity can then be used to power homes, businesses and other electrical devices.",
      },
      {
        id: "B",
        text: "Solar panels are devices that convert sunlight into electricity using photovoltaic cells.",
      },
      {
        id: "C",
        text: "When sunlight reaches these cells, it causes electrons to move and generates an electric current.",
      },
      {
        id: "D",
        text: "Because sunlight is renewable, solar energy can help reduce dependence on fossil fuels.",
      },
    ],
  },
  {
    id: 4,
    title: "SPACE EXPLORATION",
    difficulty: "Medium",
    time: "00:20",
    paragraphs: 4,
    category: "SCIENCE & TECHNOLOGY",
    correctOrder: ["B", "A", "C", "D"],
    paragraphsList: [
      {
        id: "A",
        text: "To investigate distant planets and other celestial bodies, scientists develop spacecraft equipped with advanced instruments.",
      },
      {
        id: "B",
        text: "Space exploration has expanded human understanding of the universe and the objects within it.",
      },
      {
        id: "C",
        text: "Once launched, these spacecraft collect images and scientific measurements that are transmitted back to Earth.",
      },
      {
        id: "D",
        text: "The information gathered during these missions helps researchers understand planetary environments and the history of the solar system.",
      },
    ],
  },
  {
    id: 5,
    title: "HUMAN DNA",
    difficulty: "Medium",
    time: "00:17",
    paragraphs: 4,
    category: "SCIENCE & TECHNOLOGY",
    correctOrder: ["B", "C", "A", "D"],
    paragraphsList: [
      {
        id: "A",
        text: "Before a cell divides, its DNA is copied so that each new cell can receive genetic information.",
      },
      {
        id: "B",
        text: "DNA is a molecule that stores the genetic instructions required for the growth and functioning of living organisms.",
      },
      {
        id: "C",
        text: "Its structure consists of two strands arranged in a double helix, with chemical bases carrying genetic information.",
      },
      {
        id: "D",
        text: "This copying process is essential for growth, tissue repair and the reproduction of cells.",
      },
    ],
  },
  {
    id: 6,
    title: "OCEAN PLASTIC POLLUTION",
    difficulty: "Hard",
    time: "00:22",
    paragraphs: 4,
    category: "SCIENCE & TECHNOLOGY",
    correctOrder: ["B", "C", "A", "D"],
    paragraphsList: [
      {
        id: "A",
        text: "As a result, small plastic particles can enter marine food chains when they are consumed by fish and other organisms.",
      },
      {
        id: "B",
        text: "Plastic pollution has become a major environmental problem affecting oceans around the world.",
      },
      {
        id: "C",
        text: "Over time, larger plastic objects can break into smaller fragments known as microplastics.",
      },
      {
        id: "D",
        text: "Reducing plastic waste and improving recycling systems are therefore important steps towards protecting marine ecosystems.",
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

function ReorderParagraph({ onBack }) {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [search, setSearch] = useState("");

  const categoryCounts = useMemo(() => {
    const counts = {};
    categories.forEach((cat) => {
      counts[cat] = questions.filter((q) => q.category === cat).length;
    });
    return counts;
  }, []);

  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => q.category === selectedCategory);
  }, [selectedCategory]);

  const total = filteredQuestions.length;
  const question = filteredQuestions[currentIndex] || filteredQuestions[0];

  function changeCategory(value) {
    setSelectedCategory(value);
    setCurrentIndex(0);
  }

  if (!question) {
    return (
      <div className="reorder_practice_container">
        <p>No questions in this category.</p>
      </div>
    );
  }

  return (
    <div className="reorder_practice_container">
      <div className="reorder_practice_top">
        {onBack && (
          <button
            type="button"
            className="back_to_home_btn"
            onClick={onBack}
          >
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
          Drag the sentences up or down to put them in the correct order.
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
                    {cat} · Question set ({categoryCounts[cat] || 0})
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
        <p className="question_number">
          Question {currentIndex + 1} of {total}
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

        <div className="reorder_list">
          {question.paragraphsList.map((para, index) => (
            <div className="reorder_item" key={para.id}>
              <p className="paragraph_text">
                <span className="paragraph_number">{index + 1})</span>{" "}
                {para.text}
              </p>
              <span className="drag_hint">
                <i className="fa-solid fa-grip-vertical"></i>
              </span>
            </div>
          ))}
        </div>

        <div className="question_actions">
          <button type="button" className="check_btn">
            Check
          </button>
        </div>

        <div className="question_nav">
          <button
            type="button"
            className="prev_btn"
            onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
            disabled={currentIndex === 0}
          >
            <i className="fa-solid fa-arrow-left"></i>
            Previous
          </button>

          <button
            type="button"
            className="next_btn"
            onClick={() =>
              setCurrentIndex((i) => Math.min(total - 1, i + 1))
            }
            disabled={currentIndex === total - 1}
          >
            Next Question
            <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReorderParagraph;
