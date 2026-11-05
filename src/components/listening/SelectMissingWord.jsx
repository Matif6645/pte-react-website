import { useEffect, useMemo, useRef, useState } from "react";
import PracticeShared from "../PracticeShared.jsx";
import "../MultipleChoiceMultipleAnswer.css";
import "../MultipleChoiceSingleAnswer.css";
import "./ListeningMcqMultiple.css";

const DEMO = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
const CATS = [
  "SCIENCE & TECHNOLOGY",
  "HISTORY",
  "BIOLOGY",
  "MEDICAL SCIENCE",
  "ENVIRONMENT",
  "GEOGRAPHY",
  "ECONOMICS",
  "ENGLISH",
  "MATHEMATICS",
  "TECHNOLOGY",
];
const questions = [
  {
    id: 201,
    title: "PHOTOSYNTHESIS",
    difficulty: "Easy",
    time: "00:35",
    category: "SCIENCE & TECHNOLOGY",
    audioUrl: DEMO,
    questionText:
      "You will hear a recording. At the end, the last word has been replaced by a beep. Select the correct option to complete the recording.",
    prompt: "…plants convert sunlight into chemical ______.",
    options: [
      { id: "A", text: "energy" },
      { id: "B", text: "pollution" },
      { id: "C", text: "machinery" },
      { id: "D", text: "gravity" },
    ],
    correctAnswer: "A",
  },

  {
    id: 202,
    title: "CLIMATE CHANGE",
    difficulty: "Easy",
    time: "00:38",
    category: "ENVIRONMENT",
    audioUrl: DEMO,
    questionText:
      "You will hear a recording. At the end, the last word has been replaced by a beep. Select the correct option to complete the recording.",
    prompt: "…increasing greenhouse gases contribute to global ______.",
    options: [
      { id: "A", text: "cooling" },
      { id: "B", text: "warming" },
      { id: "C", text: "migration" },
      { id: "D", text: "rotation" },
    ],
    correctAnswer: "B",
  },
  {
    id: 203,
    title: "ANCIENT CIVILISATIONS",
    difficulty: "Medium",
    time: "00:42",
    category: "HISTORY",
    audioUrl: DEMO,
    questionText:
      "You will hear a recording. At the end, the last word has been replaced by a beep. Select the correct option to complete the recording.",
    prompt:
      "…the ancient Egyptians developed their civilisation along the River ______.",
    options: [
      { id: "A", text: "Amazon" },
      { id: "B", text: "Thames" },
      { id: "C", text: "Danube" },
      { id: "D", text: "Nile" },
    ],
    correctAnswer: "D",
  },
  {
    id: 204,
    title: "HUMAN DIGESTION",
    difficulty: "Easy",
    time: "00:35",
    category: "BIOLOGY",
    audioUrl: DEMO,
    questionText:
      "You will hear a recording. At the end, the last word has been replaced by a beep. Select the correct option to complete the recording.",
    prompt:
      "…most nutrients from digested food are absorbed in the small ______.",
    options: [
      { id: "A", text: "intestine" },
      { id: "B", text: "kidney" },
      { id: "C", text: "stomach" },
      { id: "D", text: "liver" },
    ],
    correctAnswer: "A",
  },
  {
    id: 205,
    title: "ANTIBIOTIC RESISTANCE",
    difficulty: "Hard",
    time: "00:48",
    category: "MEDICAL SCIENCE",
    audioUrl: DEMO,
    questionText:
      "You will hear a recording. At the end, the last word has been replaced by a beep. Select the correct option to complete the recording.",
    prompt:
      "…the inappropriate use of antibiotics can encourage bacteria to develop ______.",
    options: [
      { id: "A", text: "nutrition" },
      { id: "B", text: "vaccination" },
      { id: "C", text: "resistance" },
      { id: "D", text: "digestion" },
    ],
    correctAnswer: "C",
  },
  {
    id: 206,
    title: "EARTHQUAKES",
    difficulty: "Medium",
    time: "00:40",
    category: "GEOGRAPHY",
    audioUrl: DEMO,
    questionText:
      "You will hear a recording. At the end, the last word has been replaced by a beep. Select the correct option to complete the recording.",
    prompt:
      "…sudden movement along faults in the Earth's crust generates seismic ______.",
    options: [
      { id: "A", text: "clouds" },
      { id: "B", text: "waves" },
      { id: "C", text: "winds" },
      { id: "D", text: "currents" },
    ],
    correctAnswer: "B",
  },
  {
    id: 207,
    title: "GRAVITY",
    difficulty: "Easy",
    time: "00:32",
    category: "SCIENCE & TECHNOLOGY",
    audioUrl: DEMO,
    questionText:
      "You will hear a recording. At the end, the last word has been replaced by a beep. Select the correct option to complete the recording.",
    prompt:
      "…the force that attracts objects towards the centre of the Earth is called ______.",
    options: [
      { id: "A", text: "electricity" },
      { id: "B", text: "friction" },
      { id: "C", text: "radiation" },
      { id: "D", text: "gravity" },
    ],
    correctAnswer: "D",
  },
  {
    id: 208,
    title: "ECONOMIC INFLATION",
    difficulty: "Medium",
    time: "00:44",
    category: "ECONOMICS",
    audioUrl: DEMO,
    questionText:
      "You will hear a recording. At the end, the last word has been replaced by a beep. Select the correct option to complete the recording.",
    prompt:
      "…a sustained increase in the general price level is known as ______.",
    options: [
      { id: "A", text: "inflation" },
      { id: "B", text: "investment" },
      { id: "C", text: "production" },
      { id: "D", text: "employment" },
    ],
    correctAnswer: "A",
  },
  {
    id: 209,
    title: "LANGUAGE LEARNING",
    difficulty: "Medium",
    time: "00:39",
    category: "ENGLISH",
    audioUrl: DEMO,
    questionText:
      "You will hear a recording. At the end, the last word has been replaced by a beep. Select the correct option to complete the recording.",
    prompt:
      "…regular reading and conversation help learners develop their ______.",
    options: [
      { id: "A", text: "temperature" },
      { id: "B", text: "transportation" },
      { id: "C", text: "vocabulary" },
      { id: "D", text: "population" },
    ],
    correctAnswer: "C",
  },
  {
    id: 210,
    title: "PROBABILITY",
    difficulty: "Hard",
    time: "00:46",
    category: "MATHEMATICS",
    audioUrl: DEMO,
    questionText:
      "You will hear a recording. At the end, the last word has been replaced by a beep. Select the correct option to complete the recording.",
    prompt: "…the probability of an impossible event is always ______.",
    options: [
      { id: "A", text: "one" },
      { id: "B", text: "zero" },
      { id: "C", text: "half" },
      { id: "D", text: "infinity" },
    ],
    correctAnswer: "B",
  },
  {
    id: 211,
    title: "CYBERSECURITY",
    difficulty: "Medium",
    time: "00:43",
    category: "TECHNOLOGY",
    audioUrl: DEMO,
    questionText:
      "You will hear a recording. At the end, the last word has been replaced by a beep. Select the correct option to complete the recording.",
    prompt:
      "…protecting computer systems from unauthorised access is an important part of ______.",
    options: [
      { id: "A", text: "agriculture" },
      { id: "B", text: "manufacturing" },
      { id: "C", text: "transportation" },
      { id: "D", text: "cybersecurity" },
    ],
    correctAnswer: "D",
  },
  {
    id: 212,
    title: "BIODIVERSITY",
    difficulty: "Hard",
    time: "00:49",
    category: "ENVIRONMENT",
    audioUrl: DEMO,
    questionText:
      "You will hear a recording. At the end, the last word has been replaced by a beep. Select the correct option to complete the recording.",
    prompt:
      "…the variety of living organisms in an ecosystem contributes to its ecological ______.",
    options: [
      { id: "A", text: "stability" },
      { id: "B", text: "pollution" },
      { id: "C", text: "temperature" },
      { id: "D", text: "transportation" },
    ],
    correctAnswer: "A",
  },
  {
    id: 213,
    title: "URBANISATION",
    difficulty: "Medium",
    time: "00:41",
    category: "GEOGRAPHY",
    audioUrl: DEMO,
    questionText:
      "You will hear a recording. At the end, the last word has been replaced by a beep. Select the correct option to complete the recording.",
    prompt:
      "…the increasing concentration of people in towns and cities is called ______.",
    options: [
      { id: "A", text: "deforestation" },
      { id: "B", text: "evaporation" },
      { id: "C", text: "urbanisation" },
      { id: "D", text: "industrialisation" },
    ],
    correctAnswer: "C",
  },
];

const fmt = (s) => {
  const n = Number.isFinite(s) ? Math.max(0, Math.floor(s)) : 0;
  return `${String(Math.floor(n / 60)).padStart(2, "0")}:${String(n % 60).padStart(2, "0")}`;
};

function SelectMissingWord({ onBack, initialCategory }) {
  const audioRef = useRef(null);
  const [cat, setCat] = useState(
    CATS.includes(initialCategory) ? initialCategory : CATS[0],
  );

  const [idx, setIdx] = useState(0);
  const [search, setSearch] = useState("");
  const [picked, setPicked] = useState({});
  const [checked, setChecked] = useState({});
  const [playing, setPlaying] = useState(false);
  const [t, setT] = useState(0);
  const [dur, setDur] = useState(0);
  const counts = useMemo(() => {
    const c = {};
    CATS.forEach((x) => {
      c[x] = questions.filter((q) => q.category === x).length;
    });
    return c;
  }, []);

  const list = useMemo(() => {
    const term = search.trim().toLowerCase();
    return questions.filter(
      (q) =>
        q.category === cat &&
        (!term ||
          q.title.toLowerCase().includes(term) ||
          String(q.id).includes(term)),
    );
  }, [cat, search]);

  const total = list.length;
  const safe = total ? Math.min(idx, total - 1) : 0;
  const q = list[safe];
  const done = q ? !!checked[q.id] : false;
  const sel = q ? picked[q.id] || "" : "";

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.pause();
    a.currentTime = 0;
    setPlaying(false);
    setT(0);
    setDur(0);
  }, [q?.id]);

  async function togglePlay() {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      try {
        await a.play();
        setPlaying(true);
      } catch {
        setPlaying(false);
      }
      return;
    }
    a.pause();
    setPlaying(false);
  }

  function optClass(id) {
    if (!done) return sel === id ? "mcq_option selected_option" : "mcq_option";
    if (id === q.correctAnswer) return "mcq_option option_correct";
    if (sel === id) return "mcq_option option_wrong";
    return "mcq_option";
  }

  return (
    <PracticeShared
      headingLabel="LISTENING PRACTICE"
      backLabel="Back"
      title="Select Missing Word"
      description="Listen to the recording. The final word is replaced by a beep — choose the option that completes it."
      icon="fa-solid fa-headphones"
      categories={CATS}
      selectedCategory={cat}
      categoryCounts={counts}
      onCategoryChange={(c) => {
        setCat(c);
        setIdx(0);
        setSearch("");
      }}
      search={search}
      onSearchChange={(v) => {
        setSearch(v);
        setIdx(0);
      }}
      question={q}
      questionNumber={safe + 1}
      totalQuestions={total}
      details={
        q
          ? [
              { icon: "fa-regular fa-clock", text: q.time },
              { icon: "fa-solid fa-circle-dot", text: "SINGLE ANSWER" },
              { icon: "fa-solid fa-tag", text: q.category },
            ]
          : []
      }
      onBack={onBack}
      onReset={() => {
        if (!q) return;
        setPicked((p) => ({ ...p, [q.id]: "" }));
        setChecked((p) => ({ ...p, [q.id]: false }));
      }}
      onCheck={() => {
        if (q && sel) setChecked((p) => ({ ...p, [q.id]: true }));
      }}
      checkDisabled={done || !sel}
      checkLabel={done ? "Checked" : "Check Answer"}
      onPrevious={() => safe > 0 && setIdx(safe - 1)}
      onNext={() => safe < total - 1 && setIdx(safe + 1)}
      previousDisabled={!safe}
      nextDisabled={safe >= total - 1}
    >
      {q && (
        <>
          <div className="listening_audio_player">
            <audio
              ref={audioRef}
              src={q.audioUrl}
              preload="metadata"
              onLoadedMetadata={(e) => setDur(e.currentTarget.duration || 0)}
              onTimeUpdate={(e) => setT(e.currentTarget.currentTime || 0)}
              onEnded={() => setPlaying(false)}
            />
            <button
              type="button"
              className="listening_play_btn"
              onClick={togglePlay}
            >
              <i className={`fa-solid ${playing ? "fa-pause" : "fa-play"}`} />
            </button>
            <div className="listening_audio_track">
              <input
                type="range"
                min="0"
                max={dur || 0}
                step="0.1"
                value={t}
                onChange={(e) => {
                  const n = Number(e.target.value);
                  if (audioRef.current) audioRef.current.currentTime = n;
                  setT(n);
                }}
              />
              <div className="listening_audio_time">
                <span>{fmt(t)}</span>
                <span>{fmt(dur)}</span>
              </div>
            </div>
          </div>

          <p className="mcq_question_text">{q.questionText}</p>
          {q.prompt && <p className="mcq_question_text">{q.prompt}</p>}

          <div className="mcq_options_list">
            {q.options.map((opt) => (
              <button
                key={opt.id}
                type="button"
                className={optClass(opt.id)}
                disabled={done}
                onClick={() =>
                  !done && setPicked((p) => ({ ...p, [q.id]: opt.id }))
                }
              >
                <span className="mcq_radio">
                  {sel === opt.id ? <span className="mcq_radio_dot" /> : null}
                </span>
                <span className="mcq_option_label">{opt.id}.</span>
                <span className="mcq_option_text">{opt.text}</span>
              </button>
            ))}
          </div>

          {done && (
            <p className="score_text">
              {sel === q.correctAnswer
                ? `Correct! Answer: ${q.correctAnswer}`
                : `Wrong. Correct answer: ${q.correctAnswer}`}
            </p>
          )}
        </>
      )}
    </PracticeShared>
  );
}

export default SelectMissingWord;
