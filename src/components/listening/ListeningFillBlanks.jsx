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
    id: 501,
    title: "FAMILY",
    difficulty: "Medium",
    time: "00:45",
    category: "HISTORY",
    audioUrl: DEMO,
    questionText:
      "Listen to the recording and type the missing words in the blanks.",
    segments: [
      { type: "text", value: "A boy was " },
      { type: "blank", answer: "describing" },
      {
        type: "text",
        value:
          " his family, and he mentioned that his father is an electrical engineer at Philips. The ",
      },
      { type: "blank", answer: "interviewer" },
      { type: "text", value: " asked about his father's " },
      { type: "blank", answer: "experience" },
      {
        type: "text",
        value: " working in electronics, and the boy described how ",
      },
      { type: "blank", answer: "fascinating" },
      {
        type: "text",
        value: " it was for him when he first saw his father dealing with complex ",
      },
      { type: "blank", answer: "circuits" },
      { type: "text", value: " at work." },
    ],
  },
  {
    id: 502,
    title: "SOLAR POWER",
    difficulty: "Easy",
    time: "00:35",
    category: "SCIENCE & TECHNOLOGY",
    audioUrl: DEMO,
    questionText:
      "Listen to the recording and type the missing words in the blanks.",
    segments: [
      { type: "text", value: "Solar panels convert " },
      { type: "blank", answer: "sunlight" },
      { type: "text", value: " into electricity that can power homes and " },
      { type: "blank", answer: "businesses" },
      { type: "text", value: ". Better " },
      { type: "blank", answer: "batteries" },
      { type: "text", value: " help store energy for use at night." },
    ],
  },
  {
    id: 503,
    title: "CELL ENERGY",
    difficulty: "Medium",
    time: "00:38",
    category: "BIOLOGY",
    audioUrl: DEMO,
    questionText:
      "Listen to the recording and type the missing words in the blanks.",
    segments: [
      { type: "text", value: "Mitochondria produce most of the " },
      { type: "blank", answer: "energy" },
      { type: "text", value: " a cell needs for growth and " },
      { type: "blank", answer: "repair" },
      { type: "text", value: ". This process depends on " },
      { type: "blank", answer: "oxygen" },
      { type: "text", value: " and nutrients from food." },
    ],
  },
  {
    id: 504,
    title: "VACCINES",
    difficulty: "Easy",
    time: "00:36",
    category: "MEDICAL SCIENCE",
    audioUrl: DEMO,
    questionText:
      "Listen to the recording and type the missing words in the blanks.",
    segments: [
      { type: "text", value: "Vaccines help the body recognise harmful " },
      { type: "blank", answer: "germs" },
      { type: "text", value: " before a real infection begins. As a result, the " },
      { type: "blank", answer: "immune" },
      { type: "text", value: " system can respond faster and reduce serious " },
      { type: "blank", answer: "illness" },
      { type: "text", value: "." },
    ],
  },
  {
    id: 505,
    title: "OCEAN CURRENTS",
    difficulty: "Hard",
    time: "00:42",
    category: "ENVIRONMENT",
    audioUrl: DEMO,
    questionText:
      "Listen to the recording and type the missing words in the blanks.",
    segments: [
      { type: "text", value: "Ocean currents move warm and cold " },
      { type: "blank", answer: "water" },
      { type: "text", value: " around the planet and help shape regional " },
      { type: "blank", answer: "climates" },
      { type: "text", value: ". Scientists study these flows to understand long-term " },
      { type: "blank", answer: "changes" },
      { type: "text", value: " in weather patterns." },
    ],
  },
  {
    id: 506,
    title: "MAP SKILLS",
    difficulty: "Easy",
    time: "00:34",
    category: "GEOGRAPHY",
    audioUrl: DEMO,
    questionText:
      "Listen to the recording and type the missing words in the blanks.",
    segments: [
      { type: "text", value: "A good map shows scale, " },
      { type: "blank", answer: "direction" },
      { type: "text", value: ", and key landmarks so travellers can plan a safe " },
      { type: "blank", answer: "route" },
      { type: "text", value: ". Without these details, it is easy to lose " },
      { type: "blank", answer: "direction" },
      { type: "text", value: " in unfamiliar places." },
    ],
  },
];

const fmt = (s) => {
  const n = Number.isFinite(s) ? Math.max(0, Math.floor(s)) : 0;
  return `${String(Math.floor(n / 60)).padStart(2, "0")}:${String(n % 60).padStart(2, "0")}`;
};

function blankAnswers(segments = []) {
  return segments.filter((s) => s.type === "blank").map((s) => s.answer || "");
}

function normalize(word) {
  return String(word || "")
    .trim()
    .toLowerCase()
    .replace(/^[^a-z0-9']+|[^a-z0-9']+$/gi, "");
}

function ListeningFillBlanks({ onBack, initialCategory }) {
  const audioRef = useRef(null);
  const [cat, setCat] = useState(
    CATS.includes(initialCategory) ? initialCategory : CATS[0],
  );
  const [idx, setIdx] = useState(0);
  const [search, setSearch] = useState("");
  const [answersMap, setAnswersMap] = useState({});
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
  const blanks = q ? blankAnswers(q.segments) : [];
  const values = q ? answersMap[q.id] || blanks.map(() => "") : [];
  const filledCount = values.filter((v) => String(v).trim()).length;

  const score = useMemo(() => {
    if (!q || !done) return null;
    let correct = 0;
    blanks.forEach((ans, i) => {
      if (normalize(values[i]) === normalize(ans)) correct += 1;
    });
    return { correct, total: blanks.length };
  }, [q, done, blanks, values]);

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

  function updateBlank(blankIndex, value) {
    if (!q || done) return;
    setAnswersMap((prev) => {
      const current = prev[q.id] || blanks.map(() => "");
      const next = [...current];
      next[blankIndex] = value;
      return { ...prev, [q.id]: next };
    });
  }

  function blankClass(blankIndex) {
    if (!done) return "lfb_blank";
    const ok = normalize(values[blankIndex]) === normalize(blanks[blankIndex]);
    return ok ? "lfb_blank correct" : "lfb_blank wrong";
  }

  return (
    <PracticeShared
      headingLabel="LISTENING PRACTICE"
      backLabel="Back"
      title="Fill in the Blanks"
      description="Listen to the recording and type the missing words in the blanks."
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
              { icon: "fa-solid fa-pen-to-square", text: `${blanks.length} BLANKS` },
              { icon: "fa-solid fa-tag", text: q.category },
            ]
          : []
      }
      onBack={onBack}
      onReset={() => {
        if (!q) return;
        setAnswersMap((p) => ({ ...p, [q.id]: blanks.map(() => "") }));
        setChecked((p) => ({ ...p, [q.id]: false }));
      }}
      onCheck={() => {
        if (q && filledCount > 0) setChecked((p) => ({ ...p, [q.id]: true }));
      }}
      checkDisabled={done || filledCount === 0}
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

          <div className="lfb_passage">
            {(() => {
              let blankIndex = 0;
              return q.segments.map((seg, i) => {
                if (seg.type === "text") {
                  return (
                    <span key={`t-${i}`} className="lfb_text">
                      {seg.value}
                    </span>
                  );
                }

                const currentBlank = blankIndex;
                blankIndex += 1;
                return (
                  <span key={`b-${i}`} className="lfb_blank_wrap">
                    <input
                      type="text"
                      className={blankClass(currentBlank)}
                      value={values[currentBlank] || ""}
                      disabled={done}
                      onChange={(e) =>
                        updateBlank(currentBlank, e.target.value)
                      }
                      aria-label={`Blank ${currentBlank + 1}`}
                    />
                    {done &&
                    normalize(values[currentBlank]) !==
                      normalize(blanks[currentBlank]) ? (
                      <span className="lfb_answer_hint">
                        (Answer: {blanks[currentBlank]})
                      </span>
                    ) : null}
                  </span>
                );
              });
            })()}
          </div>

          {done && score && (
            <p className="score_text">
              Score: {score.correct}/{score.total} blanks correct
            </p>
          )}
        </>
      )}
    </PracticeShared>
  );
}

export default ListeningFillBlanks;
