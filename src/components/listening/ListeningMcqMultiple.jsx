import { useEffect, useMemo, useRef, useState } from "react";
import PracticeShared from "../PracticeShared.jsx";
import "../MultipleChoiceMultipleAnswer.css";
import "./ListeningMcqMultiple.css";

const defaultQuestions = [
  {
    id: 1,
    title: "SELF-RESCUE",
    difficulty: "Easy",
    time: "01:03",
    category: "SCIENCE & TECHNOLOGY",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    questionText: "According to the speaker, which of the options below are right?",
    options: [
      {
        id: "A",
        text: "The lower paper price brings higher sales volumes to paper mills.",
      },
      {
        id: "B",
        text: "Many paper mill bosses are still hesitant about turning the machines off.",
      },
      {
        id: "C",
        text: "Paper mills are now reducing the newsprint production.",
      },
      {
        id: "D",
        text: "Many paper mills have started to use machines to make packaging.",
      },
      {
        id: "E",
        text: "Governments will take over the paper mills that have gone bankrupt.",
      },
    ],
    correctAnswers: ["C", "D"],
  },
  {
    id: 2,
    title: "CITY TRANSPORT",
    difficulty: "Medium",
    time: "00:45",
    category: "SCIENCE & TECHNOLOGY",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    questionText: "Which statements are supported by the recording?",
    options: [
      { id: "A", text: "Buses became more popular after the city added new routes." },
      { id: "B", text: "Trams were removed from every city in the country." },
      { id: "C", text: "Cycling lanes helped reduce short car trips." },
      { id: "D", text: "Ticket prices increased every month." },
      { id: "E", text: "Public transport use rose among young workers." },
    ],
    correctAnswers: ["A", "C", "E"],
  },
  {
    id: 3,
    title: "SLEEP AND MEMORY",
    difficulty: "Easy",
    time: "00:40",
    category: "SCIENCE & TECHNOLOGY",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    questionText: "According to the speaker, which ideas are correct?",
    options: [
      { id: "A", text: "Sleep helps the brain store new information." },
      { id: "B", text: "Adults never need more than three hours of sleep." },
      { id: "C", text: "Late-night study is always better than morning study." },
      { id: "D", text: "Short naps can improve focus for some people." },
      { id: "E", text: "Memory is not affected by rest at all." },
    ],
    correctAnswers: ["A", "D"],
  },
];

const categories = ["SCIENCE & TECHNOLOGY", "HISTORY", "BIOLOGY", "MEDICAL SCIENCE"];

function ListeningMcqMultiple({ onBack, initialCategory }) {
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

  const questions = defaultQuestions;

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
    const safe = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0;
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
    <PracticeShared
      headingLabel="LISTENING PRACTICE"
      backLabel="Back"
      title="Multiple Choice"
      type="Multiple"
      description="Listen to the recording and select all options that correctly answer the question."
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
              { icon: "fa-solid fa-square-check", text: "MULTIPLE ANSWERS" },
              { icon: "fa-solid fa-tag", text: question.category },
            ]
          : []
      }
      onBack={onBack}
      onReset={handleReset}
      onCheck={handleCheck}
      checkDisabled={isChecked || selected.length === 0}
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
              onLoadedMetadata={(e) => setDuration(e.currentTarget.duration || 0)}
              onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime || 0)}
              onEnded={() => setIsPlaying(false)}
            />

            <button
              type="button"
              className="listening_play_btn"
              onClick={togglePlay}
            >
              <i className={`fa-solid ${isPlaying ? "fa-pause" : "fa-play"}`}></i>
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
                onClick={() => toggleOption(opt.id)}
                disabled={isChecked}
              >
                <span className="mcq_checkbox">
                  {selected.includes(opt.id) ? (
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
                ? `Perfect! Answer: ${question.correctAnswers.join(", ")}`
                : `Answer: ${question.correctAnswers.join(", ")} · ${score.rightSelected} correct, ${score.wrongSelected} wrong, ${score.missed} missed`}
            </p>
          )}
        </>
      )}
    </PracticeShared>
  );
}

export default ListeningMcqMultiple;
