import { useEffect, useMemo, useRef, useState } from "react";
import { getMergedQuestions } from "../../admin/practiceQuestions";
import PracticeShared from "../PracticeShared.jsx";
import "../MultipleChoiceMultipleAnswer.css";
import "../MultipleChoiceSingleAnswer.css";
import "./ListeningMcqMultiple.css";

const defaultQuestions = [
  {
    id: 1,
    title: "SELF-RESCUE",
    difficulty: "Easy",
    time: "01:03",
    category: "SCIENCE & TECHNOLOGY",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    questionText: "What is the main idea of the recording?",
    options: [
      { id: "A", text: "Ocean currents only move warm water." },
      { id: "B", text: "Ocean currents help move heat around the planet." },
      { id: "C", text: "Oceans never change temperature." },
      { id: "D", text: "Ships create most ocean currents." },
    ],
    correctAnswer: "B",
  },
  {
    id: 2,
    title: "ARTIFICIAL INTELLIGENCE",
    difficulty: "Easy",
    time: "00:55",
    category: "SCIENCE & TECHNOLOGY",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    questionText: "What is the main topic of the recording?",
    options: [
      { id: "A", text: "The history of computers." },
      { id: "B", text: "The cost of technology." },
      { id: "C", text: "The applications of artificial intelligence." },
      { id: "D", text: "The development of transportation." },
    ],
    correctAnswer: "C",
  },
  {
    id: 3,
    title: "RENEWABLE ENERGY",
    difficulty: "Medium",
    time: "01:05",
    category: "SCIENCE & TECHNOLOGY",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    questionText: "What challenge does the speaker identify?",
    options: [
      { id: "A", text: "Renewable energy cannot produce electricity." },
      { id: "B", text: "Energy production can depend on weather conditions." },
      { id: "C", text: "Solar power requires fossil fuels." },
      { id: "D", text: "Wind energy always produces the same output." },
    ],
    correctAnswer: "B",
  },
  {
    id: 4,
    title: "SPACE EXPLORATION",
    difficulty: "Hard",
    time: "01:12",
    category: "SCIENCE & TECHNOLOGY",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    questionText: "What is the speaker's main point?",
    options: [
      { id: "A", text: "Human space travel is always cheaper." },
      { id: "B", text: "Robots have eliminated all space exploration risks." },
      { id: "C", text: "Space missions no longer need communication systems." },
      {
        id: "D",
        text: "Robotic exploration offers benefits but also limitations.",
      },
    ],
    correctAnswer: "D",
  },
  {
    id: 5,
    title: "THE INDUSTRIAL REVOLUTION",
    difficulty: "Easy",
    time: "00:58",
    category: "HISTORY",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    questionText: "What major change does the speaker describe?",
    options: [
      { id: "A", text: "The growth of factories and industrial towns." },
      { id: "B", text: "The disappearance of international trade." },
      { id: "C", text: "The decline of all manufacturing." },
      { id: "D", text: "The replacement of cities with farms." },
    ],
    correctAnswer: "A",
  },
  {
    id: 6,
    title: "ANCIENT EGYPT",
    difficulty: "Medium",
    time: "01:02",
    category: "HISTORY",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    questionText: "Why was the River Nile important?",
    options: [
      { id: "A", text: "It prevented the development of farming." },
      { id: "B", text: "It eliminated the need for settlements." },
      { id: "C", text: "It provided fertile land for agriculture." },
      { id: "D", text: "It stopped people from travelling." },
    ],
    correctAnswer: "C",
  },
  {
    id: 7,
    title: "THE PRINTING PRESS",
    difficulty: "Hard",
    time: "01:10",
    category: "HISTORY",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    questionText: "What effect of printing technology is emphasised?",
    options: [
      { id: "A", text: "The complete disappearance of handwriting." },
      { id: "B", text: "The wider circulation of knowledge and ideas." },
      { id: "C", text: "The reduction of interest in education." },
      { id: "D", text: "The end of communication between scholars." },
    ],
    correctAnswer: "B",
  },
  {
    id: 8,
    title: "PHOTOSYNTHESIS",
    difficulty: "Easy",
    time: "00:52",
    category: "BIOLOGY",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    questionText: "What is the main purpose of photosynthesis for plants?",
    options: [
      { id: "A", text: "To absorb oxygen from animals." },
      { id: "B", text: "To eliminate water from their tissues." },
      { id: "C", text: "To prevent sunlight from reaching their leaves." },
      { id: "D", text: "To produce sugars that support their growth." },
    ],
    correctAnswer: "D",
  },
  {
    id: 9,
    title: "BIODIVERSITY",
    difficulty: "Medium",
    time: "01:08",
    category: "BIOLOGY",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    questionText: "Why is biodiversity important?",
    options: [
      { id: "A", text: "It supports ecosystem stability and resilience." },
      { id: "B", text: "It prevents all environmental changes." },
      { id: "C", text: "It guarantees that no species will become extinct." },
      { id: "D", text: "It removes the need for conservation." },
    ],
    correctAnswer: "A",
  },
  {
    id: 10,
    title: "GENETIC INHERITANCE",
    difficulty: "Hard",
    time: "01:15",
    category: "BIOLOGY",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    questionText: "What does the speaker suggest about inherited traits?",
    options: [
      {
        id: "A",
        text: "All traits are determined exclusively by the environment.",
      },
      { id: "B", text: "Genes are never passed from parents to offspring." },
      {
        id: "C",
        text: "Both genetic and environmental factors can influence traits.",
      },
      {
        id: "D",
        text: "Environmental conditions always change DNA sequences.",
      },
    ],
    correctAnswer: "C",
  },
  {
    id: 11,
    title: "THE IMMUNE SYSTEM",
    difficulty: "Easy",
    time: "00:57",
    category: "MEDICAL SCIENCE",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    questionText: "What is the primary function of the immune system?",
    options: [
      { id: "A", text: "To regulate the body's height." },
      { id: "B", text: "To protect the body from harmful microorganisms." },
      { id: "C", text: "To transport oxygen through blood vessels." },
      { id: "D", text: "To control the movement of bones." },
    ],
    correctAnswer: "B",
  },
  {
    id: 12,
    title: "VACCINATION",
    difficulty: "Medium",
    time: "01:06",
    category: "MEDICAL SCIENCE",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    questionText: "How do vaccines help protect people?",
    options: [
      { id: "A", text: "They replace the body's entire immune system." },
      { id: "B", text: "They guarantee protection against every disease." },
      {
        id: "C",
        text: "They prevent the body from producing immune responses.",
      },
      {
        id: "D",
        text: "They prepare the immune system to recognise pathogens.",
      },
    ],
    correctAnswer: "D",
  },
  {
    id: 13,
    title: "ANTIBIOTIC RESISTANCE",
    difficulty: "Hard",
    time: "01:13",
    category: "MEDICAL SCIENCE",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    questionText: "What concern does the speaker highlight?",
    options: [
      {
        id: "A",
        text: "Antibiotic misuse can contribute to resistant infections.",
      },
      { id: "B", text: "Antibiotics are effective against every viral illness." },
      { id: "C", text: "Bacteria cannot adapt to antibiotic treatment." },
      {
        id: "D",
        text: "Antibiotic resistance makes all treatments unnecessary.",
      },
    ],
    correctAnswer: "A",
  },
];

const categories = [
  "SCIENCE & TECHNOLOGY",
  "HISTORY",
  "BIOLOGY",
  "MEDICAL SCIENCE",
];

function ListeningMcqSingle({
  onBack,
  initialCategory,
  questions: questionsProp,
  title = "Multiple Choice",
  type = "Single",
  description = "Listen to the recording and choose the one option that best answers the question.",
}) {
  const audioRef = useRef(null);
  const [selectedCategory, setSelectedCategory] = useState(
    initialCategory && categories.includes(initialCategory)
      ? initialCategory
      : categories[0],
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [search, setSearch] = useState("");
  const [selectedMap, setSelectedMap] = useState({});
  const [checkedMap, setCheckedMap] = useState({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [questions, setQuestions] = useState(
    questionsProp?.length ? questionsProp : defaultQuestions,
  );

  useEffect(() => {
    if (questionsProp?.length) {
      setQuestions(questionsProp);
      return;
    }
    let cancelled = false;
    getMergedQuestions("listening-mcq-single", defaultQuestions).then(
      (merged) => {
        if (!cancelled) setQuestions(merged);
      },
    );
    return () => {
      cancelled = true;
    };
  }, [questionsProp]);

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
  const selected = question ? selectedMap[question.id] || "" : "";
  const isCorrect = question && selected === question.correctAnswer;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  }, [question?.id]);

  function formatAudioTime(seconds) {
    const safe = Number.isFinite(seconds)
      ? Math.max(0, Math.floor(seconds))
      : 0;
    const mins = String(Math.floor(safe / 60)).padStart(2, "0");
    const secs = String(safe % 60).padStart(2, "0");
    return `${mins}:${secs}`;
  }

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

  async function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
      return;
    }

    audio.pause();
    setIsPlaying(false);
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
      headingLabel="LISTENING PRACTICE"
      backLabel="Back"
      title={title}
      type={type}
      description={description}
      icon="fa-solid fa-headphones"
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
          <div className="listening_audio_player">
            <audio
              ref={audioRef}
              src={question.audioUrl}
              preload="metadata"
              onLoadedMetadata={(e) =>
                setDuration(e.currentTarget.duration || 0)
              }
              onTimeUpdate={(e) =>
                setCurrentTime(e.currentTarget.currentTime || 0)
              }
              onEnded={() => setIsPlaying(false)}
            />

            <button
              type="button"
              className="listening_play_btn"
              onClick={togglePlay}
            >
              <i
                className={`fa-solid ${isPlaying ? "fa-pause" : "fa-play"}`}
              ></i>
            </button>

            <div className="listening_audio_track">
              <input
                type="range"
                min="0"
                max={duration || 0}
                step="0.1"
                value={currentTime}
                onChange={(e) => {
                  const next = Number(e.target.value);
                  if (audioRef.current) audioRef.current.currentTime = next;
                  setCurrentTime(next);
                }}
              />
              <div className="listening_audio_time">
                <span>{formatAudioTime(currentTime)}</span>
                <span>{formatAudioTime(duration)}</span>
              </div>
            </div>
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
                ? `Correct! Answer: ${question.correctAnswer}`
                : `Wrong. Correct answer: ${question.correctAnswer}`}
            </p>
          )}
        </>
      )}
    </PracticeShared>
  );
}

export default ListeningMcqSingle;
