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
  "TECHNOLOGY",
  "ECONOMICS",
];

/** Build clickable words. Mark wrong transcript words with isWrong + correct (audio word). */
function W(parts) {
  return parts.map((part, index) => {
    if (typeof part === "string") {
      return { id: index, text: part, isWrong: false, correct: "" };
    }
    return {
      id: index,
      text: part.text,
      isWrong: true,
      correct: part.correct,
    };
  });
}

const questions = [
  {
    id: 301,
    title: "COMETS",
    difficulty: "Medium",
    time: "00:55",
    category: "SCIENCE & TECHNOLOGY",
    audioUrl: DEMO,
    questionText:
      "Listen to the recording and click on the words in the transcript that are different from what the speaker says.",
    words: W([
      "Although",
      { text: "comments", correct: "comets" },
      "have",
      "been",
      "viewed",
      "as",
      "harbingers",
      "of",
      "doom",
      "for",
      "thousands",
      "of",
      "years,",
      "they",
      "are",
      "also",
      "a",
      "source",
      "of",
      "wonder",
      "and",
      "awe,",
      "and",
      "people",
      { text: "like", correct: "go" },
      "to",
      "great",
      "lengths",
      "to",
      "see",
      "them.",
      "In",
      "1996,",
      "for",
      "instance,",
      "a",
      "Japanese",
      "newspaper",
      "organised",
      "a",
      "flight",
      "to",
      "view",
      "a",
      "comet",
      "from",
      "above",
      "the",
      "clouds,",
      "and",
      "in",
      "2007,",
      "hundreds",
      "of",
      "thousands",
      "of",
      "people",
      "travelled",
      "to",
      "remote",
      "parts",
      "of",
      "China",
      "and",
      "Mexico",
      "to",
      "watch",
      "comet",
      "McNaught,",
      "named",
      "after",
      "the",
      "Australian",
      "astronomer",
      "who",
      "discovered",
      "it.",
      "One",
      "reason",
      "why",
      "comets",
      "inspire",
      "such",
      "awe",
      "is",
      "that",
      "they",
      "are",
      "one",
      "of",
      "the",
      "few",
      "spectacular",
      "and",
      "unpredictable",
      "events",
      "that",
      "can",
      "be",
      "seen",
      "by",
      "the",
      "entire",
      { text: "university", correct: "universe" },
      "with",
      "the",
      "naked",
      "eye.",
      "Other",
      "than",
      "a",
      "solar",
      "eclipse,",
      "nothing",
      "compares.",
      "Moreover,",
      "the",
      "fact",
      "that",
      "no",
      "two",
      "comets",
      "ever",
      "look",
      "the",
      "same",
      "and",
      "that",
      "you",
      "never",
      "know",
      "when",
      "you",
      "will",
      "see",
      "one",
      "means",
      "that",
      "the",
      "excitement",
      "never",
      "fades.",
      "For",
      "astronomers,",
      "comets",
      "also",
      "have",
      "a",
      "scientific",
      "importance.",
      "This",
      "is",
      "because",
      "they",
      "are",
      "believed",
      "to",
      "be",
      "the",
      { text: "unchangeable", correct: "unchanged" },
      "leftovers",
      "of",
      "the",
      "primordial",
      "material",
      "from",
      "which",
      "the",
      "Solar",
      "System",
      "was",
      "made",
      "4.6",
      "billion",
      "years",
      "ago.",
      "So",
      "by",
      "studying",
      "their",
      "composition,",
      "planetary",
      "scientists",
      "can",
      "get",
      "valuable",
      "insights",
      "into",
      "conditions",
      "during",
      "this",
      "early",
      { text: "phase", correct: "stage" },
      "of",
      "the",
      "Solar",
      "System's",
      "evolution.",
      "And",
      "as",
      "leftovers",
      "of",
      "this",
      "process,",
      "comets",
      "also",
      "hold",
      "clues",
      "to",
      "the",
      "chemical",
      "soup",
      "from",
      "which",
      "life",
      "eventually",
      "emerged",
      "on",
      "Earth.",
      "Indeed,",
      "it",
      "is",
      "possible",
      "that",
      "comets",
      "brought",
      "to",
      "Earth",
      "both",
      "water",
      "and",
      "the",
      "complex",
      "carbon-based",
      "molecules",
      "needed",
      "for",
      "life",
      "to",
      "get",
      "started.",
      "No",
      "wonder",
      "NASA",
      "and",
      "the",
      "European",
      "Space",
      "Agency",
      "have",
      "been",
      "so",
      "keen",
      "to",
      "explore",
      "comets",
      "by",
      "sending",
      "spacecraft",
      "to",
      "fly",
      "by",
      "them,",
      "and",
      "even",
      "to",
      "land",
      "instruments",
      "on",
      "them.",
      "It",
      "is",
      "hoped",
      "that",
      "these",
      "missions",
      "will",
      "provide",
      "new",
      "insights",
      "into",
      "the",
      { text: "dynasty", correct: "dynamic" },
      "life",
      "of",
      "comets",
      "and",
      "their",
      "role",
      "in",
      "the",
      "development",
      "of",
      "life",
      "on",
      "Earth.",
    ]),
  },
  {
    id: 302,
    title: "ROMAN ROADS",
    difficulty: "Easy",
    time: "00:40",
    category: "HISTORY",
    audioUrl: DEMO,
    questionText:
      "Listen to the recording and click on the words in the transcript that are different from what the speaker says.",
    words: W([
      "The",
      "Romans",
      "built",
      "an",
      "extensive",
      "network",
      "of",
      "roads",
      "that",
      "helped",
      "their",
      "empire",
      { text: "shrink", correct: "expand" },
      "quickly.",
      "These",
      "routes",
      "allowed",
      "soldiers",
      "and",
      "traders",
      "to",
      "move",
      "goods",
      "and",
      "messages",
      "across",
      "long",
      { text: "rivers", correct: "distances" },
      "with",
      "greater",
      "speed.",
    ]),
  },
  {
    id: 303,
    title: "CELL ENERGY",
    difficulty: "Medium",
    time: "00:42",
    category: "BIOLOGY",
    audioUrl: DEMO,
    questionText:
      "Listen to the recording and click on the words in the transcript that are different from what the speaker says.",
    words: W([
      "Inside",
      "living",
      "cells,",
      "mitochondria",
      "produce",
      "most",
      "of",
      "the",
      { text: "water", correct: "energy" },
      "needed",
      "for",
      "growth",
      "and",
      "repair.",
      "This",
      "process",
      "relies",
      "on",
      "oxygen",
      "and",
      "nutrients",
      "from",
      "the",
      { text: "library", correct: "food" },
      "we",
      "eat.",
    ]),
  },
  {
    id: 304,
    title: "VACCINES",
    difficulty: "Easy",
    time: "00:38",
    category: "MEDICAL SCIENCE",
    audioUrl: DEMO,
    questionText:
      "Listen to the recording and click on the words in the transcript that are different from what the speaker says.",
    words: W([
      "Vaccines",
      "help",
      "the",
      "body",
      "recognise",
      "harmful",
      "germs",
      "before",
      "a",
      "real",
      { text: "holiday", correct: "infection" },
      "begins.",
      "As",
      "a",
      "result,",
      "the",
      "immune",
      "system",
      "can",
      "respond",
      "faster",
      "and",
      "reduce",
      "serious",
      { text: "weather", correct: "illness" },
      ".",
    ]),
  },
  {
    id: 305,
    title: "OCEAN CURRENTS",
    difficulty: "Hard",
    time: "00:48",
    category: "ENVIRONMENT",
    audioUrl: DEMO,
    questionText:
      "Listen to the recording and click on the words in the transcript that are different from what the speaker says.",
    words: W([
      "Ocean",
      "currents",
      "move",
      "warm",
      "and",
      "cold",
      "water",
      "around",
      "the",
      "planet",
      "and",
      "help",
      "shape",
      "regional",
      { text: "music", correct: "climates" },
      ".",
      "Scientists",
      "study",
      "these",
      "flows",
      "to",
      "better",
      "understand",
      "long-term",
      { text: "shopping", correct: "changes" },
      "in",
      "weather",
      "patterns.",
    ]),
  },
  {
    id: 306,
    title: "MAP SKILLS",
    difficulty: "Easy",
    time: "00:36",
    category: "GEOGRAPHY",
    audioUrl: DEMO,
    questionText:
      "Listen to the recording and click on the words in the transcript that are different from what the speaker says.",
    words: W([
      "A",
      "good",
      "map",
      "shows",
      "scale,",
      "direction,",
      "and",
      "key",
      "landmarks",
      "so",
      "travellers",
      "can",
      "plan",
      "a",
      "safe",
      { text: "recipe", correct: "route" },
      ".",
      "Without",
      "these",
      "details,",
      "it",
      "is",
      "easy",
      "to",
      "lose",
      { text: "breakfast", correct: "direction" },
      "in",
      "unfamiliar",
      "places.",
    ]),
  },
];

const fmt = (s) => {
  const n = Number.isFinite(s) ? Math.max(0, Math.floor(s)) : 0;
  return `${String(Math.floor(n / 60)).padStart(2, "0")}:${String(n % 60).padStart(2, "0")}`;
};

function HighlightIncorrectWords({ onBack, initialCategory }) {
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
  const selectedIds = q ? picked[q.id] || [] : [];

  const score = useMemo(() => {
    if (!q || !done) return null;
    const wrongIds = q.words.filter((w) => w.isWrong).map((w) => w.id);
    const rightSelected = selectedIds.filter((id) =>
      wrongIds.includes(id),
    ).length;
    const falseSelected = selectedIds.filter(
      (id) => !wrongIds.includes(id),
    ).length;
    const missed = wrongIds.filter((id) => !selectedIds.includes(id)).length;
    return { rightSelected, falseSelected, missed, totalWrong: wrongIds.length };
  }, [q, done, selectedIds]);

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

  function toggleWord(wordId) {
    if (!q || done) return;
    setPicked((prev) => {
      const current = prev[q.id] || [];
      const next = current.includes(wordId)
        ? current.filter((id) => id !== wordId)
        : [...current, wordId];
      return { ...prev, [q.id]: next };
    });
  }

  function wordClass(word) {
    const isSelected = selectedIds.includes(word.id);
    if (!done) {
      return isSelected ? "hiw_word selected" : "hiw_word";
    }
    if (word.isWrong && isSelected) return "hiw_word correct";
    if (word.isWrong && !isSelected) return "hiw_word missed";
    if (!word.isWrong && isSelected) return "hiw_word wrong";
    return "hiw_word";
  }

  return (
    <PracticeShared
      headingLabel="LISTENING PRACTICE"
      backLabel="Back"
      title="Highlight Incorrect Words"
      description="Listen to the recording and click the words in the transcript that are different from the audio."
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
              { icon: "fa-solid fa-hand-pointer", text: "CLICK WORDS" },
              { icon: "fa-solid fa-tag", text: q.category },
            ]
          : []
      }
      onBack={onBack}
      onReset={() => {
        if (!q) return;
        setPicked((p) => ({ ...p, [q.id]: [] }));
        setChecked((p) => ({ ...p, [q.id]: false }));
      }}
      onCheck={() => {
        if (q && selectedIds.length > 0) {
          setChecked((p) => ({ ...p, [q.id]: true }));
        }
      }}
      checkDisabled={done || selectedIds.length === 0}
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

          <div className="hiw_transcript" aria-label="Transcript">
            {q.words.map((word) => (
              <span key={word.id} className="hiw_word_wrap">
                <button
                  type="button"
                  className={wordClass(word)}
                  disabled={done}
                  onClick={() => toggleWord(word.id)}
                >
                  {word.text}
                  {done && !word.isWrong && selectedIds.includes(word.id) ? (
                    <i className="fa-solid fa-xmark hiw_x" />
                  ) : null}
                </button>
                {done && word.isWrong ? (
                  <span className="hiw_answer_hint">
                    (Answer: {word.correct})
                  </span>
                ) : null}
              </span>
            ))}
          </div>

          {done && score && (
            <p className="score_text">
              Found {score.rightSelected}/{score.totalWrong} incorrect words.
              {score.falseSelected > 0
                ? ` Wrong clicks: ${score.falseSelected}.`
                : ""}
              {score.missed > 0 ? ` Missed: ${score.missed}.` : ""}
            </p>
          )}
        </>
      )}
    </PracticeShared>
  );
}

export default HighlightIncorrectWords;
