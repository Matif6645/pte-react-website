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
];

const questions = [
  {
    id: 401,
    title: "SOLAR PANELS",
    difficulty: "Easy",
    time: "00:25",
    category: "SCIENCE & TECHNOLOGY",
    audioUrl: DEMO,
    answer: "Solar panels convert sunlight into electricity for homes.",
  },
  {
    id: 402,
    title: "ROMAN TRADE",
    difficulty: "Medium",
    time: "00:28",
    category: "HISTORY",
    audioUrl: DEMO,
    answer: "Roman roads helped traders move goods across the empire.",
  },
  {
    id: 403,
    title: "CELL GROWTH",
    difficulty: "Easy",
    time: "00:24",
    category: "BIOLOGY",
    audioUrl: DEMO,
    answer: "Living cells need energy to grow and repair tissue.",
  },
  {
    id: 404,
    title: "VACCINE SAFETY",
    difficulty: "Medium",
    time: "00:30",
    category: "MEDICAL SCIENCE",
    audioUrl: DEMO,
    answer: "Vaccines help the body recognise and fight infection.",
  },
  {
    id: 405,
    title: "OCEAN HEAT",
    difficulty: "Hard",
    time: "00:32",
    category: "ENVIRONMENT",
    audioUrl: DEMO,
    answer: "Ocean currents redistribute heat around the planet.",
  },
  {
    id: 406,
    title: "MAP READING",
    difficulty: "Easy",
    time: "00:26",
    category: "GEOGRAPHY",
    audioUrl: DEMO,
    answer: "A clear map shows scale direction and key landmarks.",
  },
  {
    id: 407,
    title: "CLEAN ENERGY",
    difficulty: "Medium",
    time: "00:29",
    category: "SCIENCE & TECHNOLOGY",
    audioUrl: DEMO,
    answer: "Wind turbines generate electricity without burning fuel.",
  },
  {
    id: 408,
    title: "ANCIENT EGYPT",
    difficulty: "Easy",
    time: "00:27",
    category: "HISTORY",
    audioUrl: DEMO,
    answer: "The Nile supported farming and trade in ancient Egypt.",
  },
];

const fmt = (s) => {
  const n = Number.isFinite(s) ? Math.max(0, Math.floor(s)) : 0;
  return `${String(Math.floor(n / 60)).padStart(2, "0")}:${String(n % 60).padStart(2, "0")}`;
};

function tokenize(text) {
  return String(text || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.replace(/^[^a-zA-Z0-9']+|[^a-zA-Z0-9']+$/g, ""))
    .filter(Boolean);
}

function scoreDictation(answerText, typedText) {
  const answerWords = tokenize(answerText);
  const typedWords = tokenize(typedText);
  const remaining = [...answerWords.map((w) => w.toLowerCase())];

  const typedResult = typedWords.map((word) => {
    const lower = word.toLowerCase();
    const index = remaining.indexOf(lower);
    if (index === -1) {
      return { text: word, status: "wrong" };
    }
    remaining.splice(index, 1);
    return { text: word, status: "correct" };
  });

  const missed = remaining.map((word) => ({ text: word, status: "missed" }));
  const correctCount = typedResult.filter((w) => w.status === "correct").length;

  return {
    typedResult,
    missed,
    correctCount,
    totalAnswer: answerWords.length,
  };
}

function WriteFromDictation({ onBack, initialCategory }) {
  const audioRef = useRef(null);
  const [cat, setCat] = useState(
    CATS.includes(initialCategory) ? initialCategory : CATS[0],
  );
  const [idx, setIdx] = useState(0);
  const [search, setSearch] = useState("");
  const [typedMap, setTypedMap] = useState({});
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
  const typed = q ? typedMap[q.id] || "" : "";
  const wordCount = tokenize(typed).length;

  const result = useMemo(() => {
    if (!q || !done) return null;
    return scoreDictation(q.answer, typed);
  }, [q, done, typed]);

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

  return (
    <PracticeShared
      headingLabel="LISTENING PRACTICE"
      backLabel="Back"
      title="Write from Dictation"
      description="Listen to the sentence and type exactly what you hear. Matching words will be marked correct."
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
              { icon: "fa-solid fa-keyboard", text: "TYPE ANSWER" },
              { icon: "fa-solid fa-tag", text: q.category },
            ]
          : []
      }
      onBack={onBack}
      onReset={() => {
        if (!q) return;
        setTypedMap((p) => ({ ...p, [q.id]: "" }));
        setChecked((p) => ({ ...p, [q.id]: false }));
      }}
      onCheck={() => {
        if (q && typed.trim()) setChecked((p) => ({ ...p, [q.id]: true }));
      }}
      checkDisabled={done || !typed.trim()}
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

          <label className="wfd_label" htmlFor={`wfd-input-${q.id}`}>
            Type what you hear
          </label>
          <textarea
            id={`wfd-input-${q.id}`}
            className="wfd_textarea"
            rows={5}
            placeholder="Type the sentence here..."
            value={typed}
            disabled={done}
            onChange={(e) =>
              setTypedMap((p) => ({ ...p, [q.id]: e.target.value }))
            }
          />
          <p className="wfd_word_count">Word Count: {wordCount}</p>

          {done && result && (
            <div className="wfd_result_box">
              <p className="wfd_result_title">Your answer</p>
              <div className="wfd_words">
                {result.typedResult.length === 0 ? (
                  <span className="wfd_empty">No words typed.</span>
                ) : (
                  result.typedResult.map((word, i) => (
                    <span key={`t-${i}`} className={`wfd_word ${word.status}`}>
                      {word.text}
                    </span>
                  ))
                )}
              </div>

              {result.missed.length > 0 && (
                <>
                  <p className="wfd_result_title">Missed words</p>
                  <div className="wfd_words">
                    {result.missed.map((word, i) => (
                      <span key={`m-${i}`} className="wfd_word missed">
                        {word.text}
                      </span>
                    ))}
                  </div>
                </>
              )}

              <p className="score_text">
                Score: {result.correctCount}/{result.totalAnswer} words correct
              </p>

              <p className="wfd_correct_answer">
                Correct sentence: <strong>{q.answer}</strong>
              </p>
            </div>
          )}
        </>
      )}
    </PracticeShared>
  );
}

export default WriteFromDictation;
