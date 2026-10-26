import { useMemo, useState } from "react";
import PracticeShared from "./PracticeShared.jsx";
import "./MultipleChoiceSingleAnswer.css";

const questions = [
  {
    id: 1,
    title: "ADOLESCENT BRAIN",
    difficulty: "Medium",
    time: "00:31",
    category: "BIOLOGY",
    passage: [
      "It is a fairly well-known fact that teens are not as good as adults at looking ahead and assessing risks. As a result, they tend to make bad decisions that get them into trouble. Scientists have long believed that this is because the brains of teens are still developing. The teen brain is not yet fully wired, so signals sometimes get mixed up.",
      "This helps explain why teens can be so clever, accomplished and responsible and reckless at the same time. Their brains are sharp, but the systems that control planning and self-control are still catching up.",
    ],
    questionText:
      "According to the text, what is the reason teens can be so clever, accomplished and responsible and reckless at the same time in terms of brain activities?",
    options: [
      {
        id: "A",
        text: "Their brains are the same as adults' but with fewer miles on it.",
      },
      {
        id: "B",
        text: "Their brains are so small that they cannot deal with so much information.",
      },
      {
        id: "C",
        text: "Their brains are sharp, but planning and self-control systems are still developing.",
      },
      {
        id: "D",
        text: "Controlling their actions, CPG receives a simple signal from the brain to switch between different modes.",
      },
    ],
    correctAnswer: "C",
  },
  {
    id: 2,
    title: "SOLAR POWER",
    difficulty: "Easy",
    time: "00:20",
    category: "SCIENCE & TECHNOLOGY",
    passage: [
      "Solar power converts sunlight into electricity using panels made of special materials. When sunlight hits these panels, it creates an electric current that can power homes and businesses.",
      "Many countries support solar energy because it reduces pollution and dependence on fossil fuels. However, solar systems work best in places with strong, regular sunlight.",
    ],
    questionText: "What is the main advantage of solar power mentioned in the passage?",
    options: [
      { id: "A", text: "It works equally well in every climate without sunlight." },
      { id: "B", text: "It can reduce pollution and reliance on fossil fuels." },
      { id: "C", text: "It is only useful for powering cars." },
      { id: "D", text: "It produces more pollution than coal." },
    ],
    correctAnswer: "B",
  },
  {
    id: 3,
    title: "THE PRINTING PRESS",
    difficulty: "Medium",
    time: "00:25",
    category: "HISTORY",
    passage: [
      "The invention of the printing press in the fifteenth century changed how information spread. Books became cheaper and more widely available, so more people could learn to read.",
      "This development supported education, science and the sharing of new ideas across Europe.",
    ],
    questionText: "According to the passage, what was one important effect of the printing press?",
    options: [
      { id: "A", text: "Books became more expensive and rare." },
      { id: "B", text: "Fewer people learned to read." },
      { id: "C", text: "Information could spread more widely through cheaper books." },
      { id: "D", text: "Science stopped developing in Europe." },
    ],
    correctAnswer: "C",
  },
  {
    id: 4,
    title: "VACCINATION",
    difficulty: "Hard",
    time: "00:28",
    category: "MEDICAL SCIENCE",
    passage: [
      "Vaccines help the immune system recognise harmful germs before a real infection occurs. When a vaccinated person later meets that germ, the body can respond more quickly.",
      "Public health programmes use vaccines to protect communities and reduce the spread of serious diseases.",
    ],
    questionText: "What do vaccines help the body do, according to the passage?",
    options: [
      { id: "A", text: "Ignore all germs permanently." },
      {
        id: "B",
        text: "Recognise harmful germs and respond more quickly later.",
      },
      { id: "C", text: "Replace the need for clean water and hygiene." },
      { id: "D", text: "Stop the immune system from working." },
    ],
    correctAnswer: "B",
  },
];

const categories = [
  "SCIENCE & TECHNOLOGY",
  "HISTORY",
  "BIOLOGY",
  "MEDICAL SCIENCE",
];

function MultipleChoiceSingleAnswer({ onBack, initialCategory }) {
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
  const selected = question ? selectedMap[question.id] || "" : "";

  const isCorrect = question && selected === question.correctAnswer;

  function changeCategory(category) {
    setSelectedCategory(category);
    setCurrentIndex(0);
    setSearch("");
  }

  function goToQuestion(index) {
    if (index < 0 || index >= total) return;
    setCurrentIndex(index);
  }

  function selectOption(optionId) {
    if (!question || isChecked) return;
    setSelectedMap((prev) => ({ ...prev, [question.id]: optionId }));
  }

  function handleCheck() {
    if (!question || !selected) return;
    setCheckedMap((prev) => ({ ...prev, [question.id]: true }));
  }

  function handleReset() {
    if (!question) return;
    setSelectedMap((prev) => ({ ...prev, [question.id]: "" }));
    setCheckedMap((prev) => ({ ...prev, [question.id]: false }));
  }

  function optionClass(optionId) {
    const isSelected = selected === optionId;
    if (!isChecked) {
      return isSelected ? "mcq_option selected_option" : "mcq_option";
    }

    if (optionId === question.correctAnswer) return "mcq_option option_correct";
    if (isSelected && optionId !== question.correctAnswer) {
      return "mcq_option option_wrong";
    }
    return "mcq_option";
  }

  return (
    <PracticeShared
      title="Multiple Choice"
      type="Single Answer"
      description="Read the passage and choose the one option that best answers the question."
      icon="fa-solid fa-list-ul"
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
              { icon: "fa-solid fa-circle-dot", text: "SINGLE ANSWER" },
              { icon: "fa-solid fa-tag", text: question.category },
            ]
          : []
      }
      onBack={onBack}
      onReset={handleReset}
      onCheck={handleCheck}
      checkDisabled={isChecked || !selected}
      checkLabel={isChecked ? "Checked" : "Check Answer"}
      onPrevious={() => goToQuestion(safeIndex - 1)}
      onNext={() => goToQuestion(safeIndex + 1)}
      previousDisabled={safeIndex === 0 || total === 0}
      nextDisabled={safeIndex === total - 1 || total === 0}
    >
      {question && (
        <>
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
                onClick={() => selectOption(opt.id)}
                disabled={isChecked}
              >
                <span className="mcq_radio">
                  {selected === opt.id ? (
                    <span className="mcq_radio_dot"></span>
                  ) : null}
                </span>
                <span className="mcq_option_label">{opt.id}.</span>
                <span className="mcq_option_text">{opt.text}</span>
              </button>
            ))}
          </div>

          {isChecked && (
            <p className="score_text">
              {isCorrect
                ? "Correct!"
                : `Wrong. Correct answer: ${question.correctAnswer}`}
            </p>
          )}
        </>
      )}
    </PracticeShared>
  );
}

export default MultipleChoiceSingleAnswer;
