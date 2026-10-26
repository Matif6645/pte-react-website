import { useMemo, useState } from "react";
import PracticeShared from "./PracticeShared.jsx";
import "./PracticeShared.css";
import "./FillInTheBlanksDropdown.css";
import scienceImage from "../assets/science-dropdown.png";

const questions = [
  {
    id: 1,
    title: "RESULTANT FORCE",
    difficulty: "Easy",
    time: "00:14",
    blanks: 4,
    category: "SCIENCE & TECHNOLOGY",
    segments: [
      { type: "text", value: "The overall result of two or " },
      {
        type: "blank",
        options: ["less", "more", "equal"],
      },
      {
        type: "text",
        value:
          " forces acting on an object is called the resultant force. The resultant of two forces is a single force, which has the same effect as the two forces combined. If two forces pull an object in ",
      },
      {
        type: "blank",
        options: ["both", "opposite", "same"],
      },
      {
        type: "text",
        value: " directions, the size of the resultant can be found by ",
      },
      {
        type: "blank",
        options: ["keeping", "subtracting", "adding"],
      },
      {
        type: "text",
        value: " one force from the other. If the forces are ",
      },
      {
        type: "blank",
        options: ["likely", "equal", "different"],
      },
      { type: "text", value: ", they balance each other." },
    ],
  },
  {
    id: 2,
    title: "ARTIFICIAL INTELLIGENCE",
    difficulty: "Medium",
    time: "00:14",
    blanks: 4,
    category: "SCIENCE & TECHNOLOGY",
    segments: [
      {
        type: "text",
        value:
          "Artificial intelligence is transforming the way people live and work. Modern AI systems can ",
      },
      {
        type: "blank",
        options: ["analyse", "ignore", "destroy"],
      },
      {
        type: "text",
        value:
          " large amounts of data and identify patterns that humans might overlook. Machine learning algorithms improve their performance by learning from ",
      },
      {
        type: "blank",
        options: ["experience", "electricity", "temperature"],
      },
      {
        type: "text",
        value:
          ". These technologies are widely used in healthcare, education and ",
      },
      {
        type: "blank",
        options: ["agriculture", "gravity", "evaporation"],
      },
      {
        type: "text",
        value:
          ". However, responsible AI development requires careful consideration of privacy and ",
      },
      {
        type: "blank",
        options: ["ethics", "velocity", "density"],
      },
      {
        type: "text",
        value: ".",
      },
    ],
  },
  {
    id: 3,
    title: "RENEWABLE ENERGY",
    difficulty: "Hard",
    time: "00:14",
    blanks: 4,
    category: "SCIENCE & TECHNOLOGY",
    segments: [
      {
        type: "text",
        value:
          "Renewable energy comes from natural sources that are continuously ",
      },
      {
        type: "blank",
        options: ["replenished", "exhausted", "polluted"],
      },
      {
        type: "text",
        value: ". Solar panels convert sunlight into ",
      },
      {
        type: "blank",
        options: ["electricity", "oxygen", "friction"],
      },
      {
        type: "text",
        value:
          ", while wind turbines use moving air to generate power. Unlike fossil fuels, renewable sources generally produce fewer greenhouse gas ",
      },
      {
        type: "blank",
        options: ["emissions", "minerals", "currents"],
      },
      {
        type: "text",
        value:
          " during operation. Energy storage systems help maintain a reliable electricity ",
      },
      {
        type: "blank",
        options: ["supply", "shortage", "temperature"],
      },
      {
        type: "text",
        value: " when sunlight or wind is unavailable.",
      },
    ],
  },
  {
    id: 4,
    title: "THE HUMAN BRAIN",
    difficulty: "Medium",
    time: "00:14",
    blanks: 4,
    category: "SCIENCE & TECHNOLOGY",
    segments: [
      {
        type: "text",
        value: "The human brain contains billions of specialised cells called ",
      },
      {
        type: "blank",
        options: ["neurons", "enzymes", "platelets"],
      },
      {
        type: "text",
        value: ". These cells communicate through electrical and chemical ",
      },
      {
        type: "blank",
        options: ["signals", "shadows", "solids"],
      },
      {
        type: "text",
        value:
          ". Different regions of the brain are responsible for functions such as memory, movement and ",
      },
      {
        type: "blank",
        options: ["language", "digestion", "filtration"],
      },
      {
        type: "text",
        value:
          ". The brain can reorganise its connections through a process known as neural ",
      },
      {
        type: "blank",
        options: ["plasticity", "gravity", "resistance"],
      },
      {
        type: "text",
        value: ".",
      },
    ],
  },
  {
    id: 5,
    title: "SPACE EXPLORATION",
    difficulty: "Medium",
    time: "00:14",
    blanks: 4,
    category: "SCIENCE & TECHNOLOGY",
    segments: [
      {
        type: "text",
        value:
          "Space exploration has significantly expanded our understanding of the ",
      },
      {
        type: "blank",
        options: ["universe", "ocean", "atmosphere"],
      },
      {
        type: "text",
        value:
          ". Scientists use telescopes and spacecraft to observe distant planets and ",
      },
      {
        type: "blank",
        options: ["galaxies", "volcanoes", "forests"],
      },
      {
        type: "text",
        value:
          ". Satellites orbiting Earth provide valuable information about weather patterns and ",
      },
      {
        type: "blank",
        options: ["climate", "chemical", "magnetic"],
      },
      {
        type: "text",
        value:
          " change. Future missions may investigate whether other planets could support ",
      },
      {
        type: "blank",
        options: ["life", "gravity", "radiation"],
      },
      {
        type: "text",
        value: ".",
      },
    ],
  },
  {
    id: 6,
    title: "ANCIENT CIVILIZATIONS",
    difficulty: "Easy",
    time: "00:14",
    blanks: 4,
    category: "HISTORY",
    segments: [
      {
        type: "text",
        value: "Ancient civilizations often developed near major ",
      },
      { type: "blank", options: ["rivers", "deserts", "mountains"] },
      {
        type: "text",
        value:
          " because water was essential for agriculture. The Egyptians constructed massive ",
      },
      { type: "blank", options: ["pyramids", "factories", "railways"] },
      { type: "text", value: " as royal tombs. The invention of " },
      { type: "blank", options: ["writing", "electricity", "aviation"] },
      {
        type: "text",
        value:
          " allowed societies to preserve information. Today, archaeologists study ancient ",
      },
      { type: "blank", options: ["artifacts", "satellites", "computers"] },
      {
        type: "text",
        value: " to understand the lives of early humans.",
      },
    ],
  },
  {
    id: 7,
    title: "THE INDUSTRIAL REVOLUTION",
    difficulty: "Medium",
    time: "00:14",
    blanks: 4,
    category: "HISTORY",
    segments: [
      { type: "text", value: "The Industrial Revolution began in " },
      { type: "blank", options: ["Britain", "Brazil", "Japan"] },
      {
        type: "text",
        value:
          " during the eighteenth century. The development of steam-powered ",
      },
      { type: "blank", options: ["machines", "satellites", "computers"] },
      {
        type: "text",
        value:
          " transformed manufacturing and transportation. Many workers moved from rural areas to growing ",
      },
      { type: "blank", options: ["cities", "forests", "deserts"] },
      {
        type: "text",
        value:
          ". Although industrialisation increased production, it also contributed to environmental ",
      },
      { type: "blank", options: ["pollution", "conservation", "restoration"] },
      { type: "text", value: " and difficult working conditions." },
    ],
  },
  {
    id: 8,
    title: "WORLD WAR II",
    difficulty: "Hard",
    time: "00:14",
    blanks: 4,
    category: "HISTORY",
    segments: [
      {
        type: "text",
        value: "World War II began in 1939 following Germany's invasion of ",
      },
      { type: "blank", options: ["Poland", "Canada", "India"] },
      {
        type: "text",
        value: ". The conflict involved the Allied and Axis ",
      },
      { type: "blank", options: ["powers", "industries", "colonies"] },
      {
        type: "text",
        value:
          " and affected populations across several continents. The war ended in 1945, leading to the establishment of the United ",
      },
      { type: "blank", options: ["Nations", "Kingdom", "States"] },
      {
        type: "text",
        value: ". Its primary mission was to promote international peace and ",
      },
      { type: "blank", options: ["security", "competition", "expansion"] },
      {
        type: "text",
        value: " through cooperation among member countries.",
      },
    ],
  },
  {
    id: 9,
    title: "HUMAN CELL BIOLOGY",
    difficulty: "Easy",
    time: "00:14",
    blanks: 4,
    category: "BIOLOGY",
    segments: [
      {
        type: "text",
        value: "The human body is composed of trillions of ",
      },
      { type: "blank", options: ["cells", "organs", "bones"] },
      { type: "text", value: ". Most human cells contain a " },
      { type: "blank", options: ["nucleus", "muscle", "hormone"] },
      {
        type: "text",
        value:
          " that stores genetic information. Mitochondria release usable energy through cellular ",
      },
      { type: "blank", options: ["respiration", "digestion", "circulation"] },
      { type: "text", value: ". The cell " },
      { type: "blank", options: ["membrane", "skeleton", "tendon"] },
      {
        type: "text",
        value: " controls the movement of substances into and out of the cell.",
      },
    ],
  },
  {
    id: 10,
    title: "PHOTOSYNTHESIS",
    difficulty: "Medium",
    time: "00:14",
    blanks: 4,
    category: "BIOLOGY",
    segments: [
      {
        type: "text",
        value:
          "Photosynthesis is the process by which plants convert sunlight into chemical ",
      },
      { type: "blank", options: ["energy", "pressure", "motion"] },
      {
        type: "text",
        value: ". The process occurs mainly in structures called ",
      },
      { type: "blank", options: ["chloroplasts", "mitochondria", "ribosomes"] },
      {
        type: "text",
        value:
          ". Plants absorb carbon dioxide from the atmosphere and release ",
      },
      { type: "blank", options: ["oxygen", "nitrogen", "hydrogen"] },
      {
        type: "text",
        value:
          " as a by-product. Photosynthesis is essential because it supports the majority of Earth's food ",
      },
      { type: "blank", options: ["chains", "currents", "minerals"] },
      { type: "text", value: "." },
    ],
  },
  {
    id: 11,
    title: "HUMAN GENETICS",
    difficulty: "Hard",
    time: "00:14",
    blanks: 4,
    category: "BIOLOGY",
    segments: [
      {
        type: "text",
        value:
          "Genetics examines how biological characteristics are passed from parents to their ",
      },
      { type: "blank", options: ["offspring", "ancestors", "neighbours"] },
      {
        type: "text",
        value: ". DNA contains instructions organised into units called ",
      },
      { type: "blank", options: ["genes", "enzymes", "hormones"] },
      {
        type: "text",
        value: ". Changes in DNA sequences are known as ",
      },
      { type: "blank", options: ["mutations", "reactions", "adaptations"] },
      {
        type: "text",
        value:
          ". Some inherited conditions are associated with variations in particular ",
      },
      { type: "blank", options: ["chromosomes", "tissues", "muscles"] },
      { type: "text", value: " or genes." },
    ],
  },
  {
    id: 12,
    title: "THE HUMAN IMMUNE SYSTEM",
    difficulty: "Easy",
    time: "00:14",
    blanks: 4,
    category: "MEDICAL SCIENCE",
    segments: [
      {
        type: "text",
        value: "The immune system protects the body against harmful ",
      },
      { type: "blank", options: ["pathogens", "nutrients", "vitamins"] },
      {
        type: "text",
        value: ". White blood cells help identify and destroy infectious ",
      },
      { type: "blank", options: ["agents", "minerals", "hormones"] },
      {
        type: "text",
        value: ". Vaccines prepare the immune system to recognise specific ",
      },
      { type: "blank", options: ["antigens", "enzymes", "proteins"] },
      {
        type: "text",
        value: ". A healthy immune response helps the body recover from ",
      },
      { type: "blank", options: ["infections", "fractures", "dehydration"] },
      {
        type: "text",
        value: " and reduce the risk of serious illness.",
      },
    ],
  },
  {
    id: 13,
    title: "MEDICAL IMAGING",
    difficulty: "Medium",
    time: "00:14",
    blanks: 4,
    category: "MEDICAL SCIENCE",
    segments: [
      {
        type: "text",
        value:
          "Medical imaging allows healthcare professionals to examine internal body ",
      },
      { type: "blank", options: ["structures", "emotions", "behaviours"] },
      {
        type: "text",
        value:
          " without conventional surgery. X-ray imaging is particularly useful for examining ",
      },
      { type: "blank", options: ["bones", "hormones", "enzymes"] },
      {
        type: "text",
        value:
          ". Magnetic resonance imaging uses magnetic fields and radio waves to produce detailed ",
      },
      { type: "blank", options: ["images", "sounds", "temperatures"] },
      {
        type: "text",
        value: ". These technologies help doctors improve diagnostic ",
      },
      { type: "blank", options: ["accuracy", "advertising", "transportation"] },
      {
        type: "text",
        value: " and monitor treatment outcomes.",
      },
    ],
  },
  {
    id: 14,
    title: "ANTIBIOTIC RESISTANCE",
    difficulty: "Hard",
    time: "00:14",
    blanks: 4,
    category: "MEDICAL SCIENCE",
    segments: [
      {
        type: "text",
        value:
          "Antibiotic resistance occurs when bacteria develop the ability to survive medicines designed to ",
      },
      { type: "blank", options: ["eliminate", "nourish", "transport"] },
      {
        type: "text",
        value:
          " them. The unnecessary use of antibiotics can accelerate the emergence of resistant ",
      },
      { type: "blank", options: ["strains", "vitamins", "hormones"] },
      {
        type: "text",
        value: ". Resistant infections may require more complex and expensive ",
      },
      { type: "blank", options: ["treatments", "diagnoses", "vaccinations"] },
      {
        type: "text",
        value:
          ". Public health organisations encourage appropriate prescribing and infection ",
      },
      { type: "blank", options: ["prevention", "transmission", "expansion"] },
      {
        type: "text",
        value: " to limit the spread of antibiotic resistance.",
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

// Correct answers for each question id (blank index order)
const correctAnswers = {
  1: ["more", "opposite", "subtracting", "equal"],
  2: ["analyse", "experience", "agriculture", "ethics"],
  3: ["replenished", "electricity", "emissions", "supply"],
  4: ["neurons", "signals", "language", "plasticity"],
  5: ["universe", "galaxies", "climate", "life"],
  6: ["rivers", "pyramids", "writing", "artifacts"],
  7: ["Britain", "machines", "cities", "pollution"],
  8: ["Poland", "powers", "Nations", "security"],
  9: ["cells", "nucleus", "respiration", "membrane"],
  10: ["energy", "chloroplasts", "oxygen", "chains"],
  11: ["offspring", "genes", "mutations", "chromosomes"],
  12: ["pathogens", "agents", "antigens", "infections"],
  13: ["structures", "bones", "images", "accuracy"],
  14: ["eliminate", "strains", "treatments", "prevention"],
};

function BlankSelect({
  options,
  value,
  onChange,
  checked,
  isCorrect,
  correctAnswer,
}) {
  let statusClass = "";
  if (checked) {
    statusClass = isCorrect ? "blank_correct" : "blank_wrong";
  }

  return (
    <span className="blank_wrap">
      <select
        className={`blank_dropdown ${statusClass}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={checked}
      >
        <option value="">Select</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>

      {checked && !isCorrect && (
        <span className="correct_answer_hint">(Answer: {correctAnswer})</span>
      )}
    </span>
  );
}

function ReadingPractice({ onBack, initialCategory }) {
  const [selectedCategory, setSelectedCategory] = useState(
    categories.includes(initialCategory) ? initialCategory : categories[0],
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [search, setSearch] = useState("");
  const [answers, setAnswers] = useState({});
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
  const questionAnswers = question ? answers[question.id] || {} : {};
  const isChecked = question ? Boolean(checkedMap[question.id]) : false;
  const correctList = question ? correctAnswers[question.id] || [] : [];

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
  }

  function goToQuestion(index) {
    if (index < 0 || index >= total) return;
    setCurrentIndex(index);
  }

  function updateBlank(blankIndex, value) {
    if (!question || isChecked) return;
    setAnswers((prev) => ({
      ...prev,
      [question.id]: {
        ...(prev[question.id] || {}),
        [blankIndex]: value,
      },
    }));
  }

  function handleCheck() {
    if (!question) return;
    setCheckedMap((prev) => ({ ...prev, [question.id]: true }));
  }
  // RESET FUNCTION
  function handleReset() {
    if (!question) return;

    setAnswers((prev) => ({
      ...prev,
      [question.id]: {},
    }));

    setCheckedMap((prev) => ({
      ...prev,
      [question.id]: false,
    }));
  }

  let blankCounter = -1;

  return (
    <PracticeShared
      title="Fill in the blanks"
      type="Dropdown"
      description="Find the word that makes each sentence fit."
      icon="fa-solid fa-book-open"
      headerImage={
        selectedCategory === "SCIENCE & TECHNOLOGY" ? scienceImage : null
      }
      // CATEGORY AND SEARCH
      categories={categories}
      selectedCategory={selectedCategory}
      categoryCounts={categoryCounts}
      onCategoryChange={changeCategory}
      search={search}
      onSearchChange={(value) => {
        setSearch(value);
        setCurrentIndex(0);
      }}
      // QUESTION INFORMATION
      question={question}
      questionNumber={safeIndex + 1}
      totalQuestions={total}
      // TIME / BLANKS / CATEGORY
      details={
        question
          ? [
              {
                icon: "fa-regular fa-clock",
                text: question.time,
              },
              {
                icon: "fa-solid fa-layer-group",
                text: `${question.blanks} BLANKS`,
              },
              {
                icon: "fa-solid fa-tag",
                text: question.category,
              },
            ]
          : []
      }
      // BACK BUTTON
      onBack={onBack}
      // RESET AND CHECK ANSWER
      onReset={handleReset}
      onCheck={handleCheck}
      checkDisabled={isChecked}
      checkLabel={isChecked ? "Checked" : "Check Answer"}
      // PREVIOUS AND NEXT
      onPrevious={() => goToQuestion(safeIndex - 1)}
      onNext={() => goToQuestion(safeIndex + 1)}
      previousDisabled={safeIndex === 0 || total === 0}
      nextDisabled={safeIndex === total - 1 || total === 0}
    >
      {/* QUESTION CONTENT */}

      {question && (
        <>
          <div className="question_content">
            <p>
              {question.segments.map((segment, index) => {
                if (segment.type === "text") {
                  return <span key={index}>{segment.value}</span>;
                }

                blankCounter += 1;

                const blankIndex = blankCounter;

                const userValue = questionAnswers[blankIndex] || "";

                const correctAnswer = correctList[blankIndex] || "";

                const isCorrect = userValue === correctAnswer;

                return (
                  <BlankSelect
                    key={`${question.id}-blank-${blankIndex}`}
                    options={segment.options}
                    value={userValue}
                    onChange={(value) => updateBlank(blankIndex, value)}
                    checked={isChecked}
                    isCorrect={isCorrect}
                    correctAnswer={correctAnswer}
                  />
                );
              })}
            </p>
          </div>

          {/* SCORE */}

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

export default ReadingPractice;
