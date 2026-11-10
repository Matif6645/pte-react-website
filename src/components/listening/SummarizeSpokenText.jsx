import { useEffect, useMemo, useRef, useState } from "react";
import { getMergedQuestions } from "../../admin/practiceQuestions";
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

const defaultQuestions = [
  {
    id: 601,
    title: "MELATONIN",
    difficulty: "Medium",
    time: "01:00",
    category: "MEDICAL SCIENCE",
    audioUrl: DEMO,
    questionText:
      "You will hear a short lecture. Write a summary for a fellow student who was not present. You should write 50–70 words.",
  },
  {
    id: 602,
    title: "SOLAR ENERGY",
    difficulty: "Easy",
    time: "00:50",
    category: "SCIENCE & TECHNOLOGY",
    audioUrl: DEMO,
    questionText:
      "You will hear a short lecture. Write a summary for a fellow student who was not present. You should write 50–70 words.",
  },
  {
    id: 603,
    title: "ROMAN ROADS",
    difficulty: "Medium",
    time: "00:55",
    category: "HISTORY",
    audioUrl: DEMO,
    questionText:
      "You will hear a short lecture. Write a summary for a fellow student who was not present. You should write 50–70 words.",
  },
  {
    id: 604,
    title: "CELL ENERGY",
    difficulty: "Easy",
    time: "00:48",
    category: "BIOLOGY",
    audioUrl: DEMO,
    questionText:
      "You will hear a short lecture. Write a summary for a fellow student who was not present. You should write 50–70 words.",
  },
  {
    id: 605,
    title: "OCEAN CURRENTS",
    difficulty: "Hard",
    time: "01:05",
    category: "ENVIRONMENT",
    audioUrl: DEMO,
    questionText:
      "You will hear a short lecture. Write a summary for a fellow student who was not present. You should write 50–70 words.",
  },
  {
    id: 606,
    title: "MAP READING",
    difficulty: "Easy",
    time: "00:45",
    category: "GEOGRAPHY",
    audioUrl: DEMO,
    questionText:
      "You will hear a short lecture. Write a summary for a fellow student who was not present. You should write 50–70 words.",
  },
];

const fmt = (s) => {
  const n = Number.isFinite(s) ? Math.max(0, Math.floor(s)) : 0;
  return `${String(Math.floor(n / 60)).padStart(2, "0")}:${String(n % 60).padStart(2, "0")}`;
};

function wordCount(text) {
  return String(text || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

function SummarizeSpokenText({ onBack, initialCategory }) {
  const audioRef = useRef(null);
  const [questions, setQuestions] = useState(defaultQuestions);
  const [cat, setCat] = useState(
    CATS.includes(initialCategory) ? initialCategory : CATS[0],
  );
  const [idx, setIdx] = useState(0);
  const [search, setSearch] = useState("");
  const [typedMap, setTypedMap] = useState({});
  const [submittedMap, setSubmittedMap] = useState({});
  const [playing, setPlaying] = useState(false);
  const [t, setT] = useState(0);
  const [dur, setDur] = useState(0);

  useEffect(() => {
    let cancelled = false;
    getMergedQuestions("listening-sst", defaultQuestions).then((merged) => {
      if (!cancelled) setQuestions(merged);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const counts = useMemo(() => {
    const c = {};
    CATS.forEach((x) => {
      c[x] = questions.filter((q) => q.category === x).length;
    });
    return c;
  }, [questions]);

  const list = useMemo(() => {
    const term = search.trim().toLowerCase();
    return questions.filter(
      (q) =>
        q.category === cat &&
        (!term ||
          q.title.toLowerCase().includes(term) ||
          String(q.id).includes(term)),
    );
  }, [questions, cat, search]);

  const total = list.length;
  const safe = total ? Math.min(idx, total - 1) : 0;
  const q = list[safe];
  const submitted = q ? !!submittedMap[q.id] : false;
  const typed = q ? typedMap[q.id] || "" : "";
  const count = wordCount(typed);

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
      title="Summarize Spoken Text"
      description="Listen to the recording and write a short summary (about 50–70 words)."
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
              { icon: "fa-solid fa-align-left", text: "50–70 WORDS" },
              { icon: "fa-solid fa-tag", text: q.category },
            ]
          : []
      }
      onBack={onBack}
      onReset={() => {
        if (!q || submitted) return;
        setTypedMap((p) => ({ ...p, [q.id]: "" }));
      }}
      resetDisabled={submitted}
      onCheck={() => {
        if (!q || !typed.trim() || submitted) return;
        setSubmittedMap((p) => ({ ...p, [q.id]: true }));
      }}
      checkDisabled={submitted || !typed.trim()}
      checkLabel={submitted ? "Submitted" : "Submit"}
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

          <label className="sst_label" htmlFor={`sst-input-${q.id}`}>
            Write your summary
          </label>
          <textarea
            id={`sst-input-${q.id}`}
            className="sst_textarea"
            rows={7}
            placeholder="Type your summary here..."
            value={typed}
            disabled={submitted}
            onChange={(e) =>
              setTypedMap((p) => ({ ...p, [q.id]: e.target.value }))
            }
          />
          <p className="sst_word_count">Word Count: {count}</p>

          {submitted && (
            <div className="sst_result_box">
              <p className="sst_submit_ok">Submitted successfully.</p>
            </div>
          )}
        </>
      )}
    </PracticeShared>
  );
}

export default SummarizeSpokenText;
