import { useEffect, useMemo, useRef, useState } from "react";
import { getMergedQuestions } from "../../admin/practiceQuestions";
import { scoreListening } from "../../admin/aiScore.js";
import { addSubmission, updateSubmission } from "../../admin/submissonStore.js";
import PracticeShared from "../PracticeShared.jsx";
import AiEvaluationResultSST from "./AiEvaluationResultSST";
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
    title: "RENEWABLE ENERGY",
    difficulty: "Medium",
    time: "01:00",
    category: "SCIENCE & TECHNOLOGY",
    audioUrl: DEMO,
    questionText:
      "You will hear a short lecture. Write a summary for a fellow student who was not present. You should write 50–70 words.",
    transcript:
      "Renewable energy is becoming increasingly important as countries look for ways to reduce pollution and address climate change. Unlike fossil fuels, renewable energy comes from natural sources such as sunlight, wind, and moving water. These sources can be replenished and generally produce fewer greenhouse gas emissions during electricity generation.Solar panels convert sunlight into electricity, while wind turbines use moving air to generate power. Hydroelectric systems produce electricity using flowing water. Although these technologies offer significant environmental benefits, they also present challenges. Solar and wind energy depend on weather conditions, which means electricity production can vary throughout the day.To address this problem, governments and energy companies are investing in battery storage and improved electricity networks. These developments help store excess energy and distribute electricity more efficiently. In the long term, renewable energy could reduce dependence on fossil fuels, create employment opportunities, and support a more sustainable economy.",
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
  const [aiResult, setAiResult] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

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

  async function handleSubmit() {
    if (!q || !typed.trim() || submitted || aiLoading) return;

    setAiLoading(true);
    setAiError("");
    setAiResult(null);

    const item = addSubmission({
      type: "listening-sst",
      questionId: q.id,
      questionTitle: q.title,
      difficulty: q.difficulty,
      category: q.category,
      prompt: q.questionText,
      answerText: typed.trim(),
      wordCount: count,
    });

    try {
      const data = await scoreListening({
        type: "listening-sst",
        question: q.questionText,
        correctAnswer: q.transcript || "",
        studentAnswer: typed.trim(),
      });

      setAiResult(data);
      updateSubmission(item.id, {
        status: "ai-scored",
        score: data.score,
        feedback: data.feedback,
        mistakes: data.mistakes,
      });
    } catch (err) {
      setAiError(err.message || "AI scoring failed");
    } finally {
      setAiLoading(false);
      setSubmittedMap((p) => ({ ...p, [q.id]: true }));
    }
  }

  return (
    <PracticeShared
      headingLabel="LISTENING PRACTICE"
      backLabel="Back"
      title="Summarize Spoken Text"
      description="Listen to the recording and write a short summary (about 50–70 words). After submit, AI will score your answer."
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
        if (!q) return;
        setTypedMap((p) => ({ ...p, [q.id]: "" }));
        setSubmittedMap((p) => {
          const next = { ...p };
          delete next[q.id];
          return next;
        });
        setAiResult(null);
        setAiError("");
        setAiLoading(false);
      }}
      resetDisabled={!q || aiLoading}
      onCheck={handleSubmit}
      checkDisabled={submitted || !typed.trim() || aiLoading}
      checkLabel={aiLoading ? "Scoring..." : submitted ? "Submitted" : "Submit"}
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
            disabled={submitted || aiLoading}
            onChange={(e) =>
              setTypedMap((p) => ({ ...p, [q.id]: e.target.value }))
            }
          />
          <p className="sst_word_count">Word Count: {count}</p>

          {/* Show loading while AI is scoring */}
          {aiLoading && (
            <p className="sst_submit_ok">AI is evaluating your answer...</p>
          )}

          {/* Show error if AI scoring fails */}
          {aiError && <p className="sst_error">AI error: {aiError}</p>}

          {/* Show new SST AI Evaluation Result */}
          {aiResult && <AiEvaluationResultSST result={aiResult} />}
        </>
      )}
    </PracticeShared>
  );
}

export default SummarizeSpokenText;
