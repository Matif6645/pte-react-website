import { useEffect, useMemo, useRef, useState } from "react";
import PracticeShared from "../PracticeShared.jsx";
import "../MultipleChoiceMultipleAnswer.css";
import "../MultipleChoiceSingleAnswer.css";
import "./ListeningMcqMultiple.css";

const DEMO_AUDIO =
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

const CATS = [
  "SCIENCE & TECHNOLOGY",
  "HISTORY",
  "BIOLOGY",
  "MEDICAL SCIENCE",
  "ENVIRONMENT",
  "GEOGRAPHY",
  "TECHNOLOGY",
  "MATHEMATICS",
  "ENGLISH",
  "ECONOMICS",
];

const questions = [
  {
    id: 117,
    title: "SODIUM",
    difficulty: "Easy",
    time: "00:56",
    category: "SCIENCE & TECHNOLOGY",
    audioUrl: DEMO_AUDIO,
    questionText: "Click on the paragraph that best relates to the recording.",
    options: [
      {
        id: "A",
        text: "Sodium is harmful to the human body and should be eliminated entirely, as the kidney cannot regulate it effectively.",
      },
      {
        id: "B",
        text: "Sodium levels never change in the body, so no regulation is needed.",
      },
      {
        id: "C",
        text: "Sodium is stored only in the bones, and its balance is controlled by the lungs rather than the kidneys.",
      },
      {
        id: "D",
        text: "Sodium is an essential mineral, and the kidney uses filtration, reabsorption, and hormones to maintain body sodium balance.",
      },
    ],
    correctAnswer: "D",
  },
  {
    id: 118,
    title: "INDUSTRIAL REVOLUTION",
    difficulty: "Medium",
    time: "01:05",
    category: "HISTORY",
    audioUrl: DEMO_AUDIO,
    questionText: "Click on the paragraph that best relates to the recording.",
    options: [
      {
        id: "A",
        text: "The Industrial Revolution reduced the use of machines and encouraged people to return to farming.",
      },
      {
        id: "B",
        text: "The Industrial Revolution began in Britain and transformed manufacturing through mechanisation, factories, and new transportation systems.",
      },
      {
        id: "C",
        text: "The Industrial Revolution happened only in the twentieth century and mainly affected communication.",
      },
      {
        id: "D",
        text: "Industrial development caused all factories to close and increased dependence on traditional farming.",
      },
    ],
    correctAnswer: "B",
  },
  {
    id: 119,
    title: "HUMAN DIGESTIVE SYSTEM",
    difficulty: "Easy",
    time: "00:58",
    category: "BIOLOGY",
    audioUrl: DEMO_AUDIO,
    questionText: "Click on the paragraph that best relates to the recording.",
    options: [
      {
        id: "A",
        text: "Digestion occurs exclusively in the stomach, where all nutrients enter the bloodstream.",
      },
      {
        id: "B",
        text: "The digestive system produces oxygen and distributes it throughout the human body.",
      },
      {
        id: "C",
        text: "The liver is the only organ responsible for breaking down food.",
      },
      {
        id: "D",
        text: "The digestive system breaks food into nutrients, which are mainly absorbed through the small intestine to provide energy and support bodily functions.",
      },
    ],
    correctAnswer: "D",
  },
  {
    id: 120,
    title: "ANTIBIOTIC RESISTANCE",
    difficulty: "Hard",
    time: "01:12",
    category: "MEDICAL SCIENCE",
    audioUrl: DEMO_AUDIO,
    questionText: "Click on the paragraph that best relates to the recording.",
    options: [
      {
        id: "A",
        text: "Antibiotic resistance occurs when bacteria develop mechanisms to survive antibiotic treatment, making infections more difficult to manage.",
      },
      {
        id: "B",
        text: "Antibiotic resistance means that the human body becomes permanently immune to all infections.",
      },
      {
        id: "C",
        text: "Antibiotics are equally effective against viral and bacterial infections.",
      },
      {
        id: "D",
        text: "Taking antibiotics more frequently always prevents bacteria from developing resistance.",
      },
    ],
    correctAnswer: "A",
  },
  {
    id: 121,
    title: "CLIMATE CHANGE",
    difficulty: "Medium",
    time: "01:08",
    category: "ENVIRONMENT",
    audioUrl: DEMO_AUDIO,
    questionText: "Click on the paragraph that best relates to the recording.",
    options: [
      {
        id: "A",
        text: "Climate change refers only to temporary weather changes occurring within a single day.",
      },
      {
        id: "B",
        text: "Human activities have no significant impact on global temperature changes.",
      },
      {
        id: "C",
        text: "Increasing greenhouse gas concentrations, largely caused by human activities, contribute to global warming and changes in weather patterns.",
      },
      {
        id: "D",
        text: "Climate change affects only polar regions and has no influence on agriculture or ecosystems.",
      },
    ],
    correctAnswer: "C",
  },
  {
    id: 122,
    title: "VOLCANIC ACTIVITY",
    difficulty: "Medium",
    time: "01:02",
    category: "GEOGRAPHY",
    audioUrl: DEMO_AUDIO,
    questionText: "Click on the paragraph that best relates to the recording.",
    options: [
      {
        id: "A",
        text: "Volcanoes develop only in regions where temperatures remain extremely cold.",
      },
      {
        id: "B",
        text: "Volcanic eruptions occur when magma rises through the Earth's crust, often near tectonic plate boundaries, releasing lava, gases, and ash.",
      },
      {
        id: "C",
        text: "Volcanic eruptions are caused primarily by changes in ocean temperatures.",
      },
      {
        id: "D",
        text: "Volcanoes cannot form beneath the ocean because water prevents geological activity.",
      },
    ],
    correctAnswer: "B",
  },
  {
    id: 123,
    title: "ARTIFICIAL INTELLIGENCE",
    difficulty: "Medium",
    time: "01:15",
    category: "TECHNOLOGY",
    audioUrl: DEMO_AUDIO,
    questionText: "Click on the paragraph that best relates to the recording.",
    options: [
      {
        id: "A",
        text: "Artificial intelligence systems operate without data, algorithms, or computational resources.",
      },
      {
        id: "B",
        text: "Artificial intelligence is limited to physical robots and cannot analyse digital information.",
      },
      {
        id: "C",
        text: "Artificial intelligence eliminates the need for human supervision in every situation.",
      },
      {
        id: "D",
        text: "Artificial intelligence enables computer systems to perform tasks such as recognising patterns, processing language, and making predictions from data.",
      },
    ],
    correctAnswer: "D",
  },
  {
    id: 124,
    title: "PROBABILITY THEORY",
    difficulty: "Hard",
    time: "01:09",
    category: "MATHEMATICS",
    audioUrl: DEMO_AUDIO,
    questionText: "Click on the paragraph that best relates to the recording.",
    options: [
      {
        id: "A",
        text: "Probability measures the likelihood of events occurring and is widely used in statistics, scientific research, and decision-making.",
      },
      {
        id: "B",
        text: "Probability guarantees that every predicted event will happen exactly as expected.",
      },
      {
        id: "C",
        text: "Probability is useful only in gambling and has no applications in science.",
      },
      {
        id: "D",
        text: "Probability calculations always require every possible event to have the same likelihood.",
      },
    ],
    correctAnswer: "A",
  },
  {
    id: 125,
    title: "LANGUAGE ACQUISITION",
    difficulty: "Medium",
    time: "01:04",
    category: "ENGLISH",
    audioUrl: DEMO_AUDIO,
    questionText: "Click on the paragraph that best relates to the recording.",
    options: [
      {
        id: "A",
        text: "Children can only learn language through formal classroom instruction.",
      },
      {
        id: "B",
        text: "Language acquisition ends during early childhood, making additional language learning impossible.",
      },
      {
        id: "C",
        text: "Language acquisition involves developing communication skills through exposure, interaction, and learning, with both cognitive and social factors playing important roles.",
      },
      {
        id: "D",
        text: "Language acquisition depends entirely on memorising grammar rules without communication practice.",
      },
    ],
    correctAnswer: "C",
  },
  {
    id: 126,
    title: "INFLATION AND PRICES",
    difficulty: "Medium",
    time: "01:10",
    category: "ECONOMICS",
    audioUrl: DEMO_AUDIO,
    questionText: "Click on the paragraph that best relates to the recording.",
    options: [
      {
        id: "A",
        text: "Inflation means that all goods and services become cheaper over time.",
      },
      {
        id: "B",
        text: "Inflation is a sustained increase in the general price level, reducing purchasing power and influencing household spending and economic policy.",
      },
      {
        id: "C",
        text: "Inflation affects only international trade and has no impact on everyday consumers.",
      },
      {
        id: "D",
        text: "Inflation occurs exclusively when governments reduce the amount of money circulating in an economy.",
      },
    ],
    correctAnswer: "B",
  },
  {
    id: 127,
    title: "RENEWABLE ENERGY",
    difficulty: "Easy",
    time: "01:00",
    category: "SCIENCE & TECHNOLOGY",
    audioUrl: DEMO_AUDIO,
    questionText: "Click on the paragraph that best relates to the recording.",
    options: [
      {
        id: "A",
        text: "Renewable energy is generated exclusively from coal and natural gas.",
      },
      {
        id: "B",
        text: "Renewable energy sources cannot produce electricity for residential or industrial use.",
      },
      {
        id: "C",
        text: "Renewable energy always produces greater greenhouse gas emissions than fossil fuels.",
      },
      {
        id: "D",
        text: "Renewable energy comes from naturally replenished sources such as sunlight, wind, and flowing water, helping reduce dependence on fossil fuels.",
      },
    ],
    correctAnswer: "D",
  },
  {
    id: 128,
    title: "BIODIVERSITY",
    difficulty: "Hard",
    time: "01:11",
    category: "ENVIRONMENT",
    audioUrl: DEMO_AUDIO,
    questionText: "Click on the paragraph that best relates to the recording.",
    options: [
      {
        id: "A",
        text: "Biodiversity describes the variety of living organisms, their genetic differences, and ecosystems, supporting ecological stability and resilience.",
      },
      {
        id: "B",
        text: "Biodiversity refers only to the number of animals living in tropical forests.",
      },
      {
        id: "C",
        text: "Biodiversity decreases naturally whenever environmental protection improves.",
      },
      {
        id: "D",
        text: "Biodiversity has no relationship with food production, ecosystem services, or environmental health.",
      },
    ],
    correctAnswer: "A",
  },
  {
    id: 129,
    title: "ANCIENT EGYPTIAN CIVILISATION",
    difficulty: "Easy",
    time: "01:06",
    category: "HISTORY",
    audioUrl: DEMO_AUDIO,
    questionText: "Click on the paragraph that best relates to the recording.",
    options: [
      {
        id: "A",
        text: "Ancient Egyptian civilisation developed without access to reliable water sources or agricultural land.",
      },
      {
        id: "B",
        text: "Ancient Egyptians relied primarily on industrial machinery and modern transportation.",
      },
      {
        id: "C",
        text: "Ancient Egyptian civilisation flourished along the Nile River, where seasonal flooding supported agriculture, settlements, and economic development.",
      },
      {
        id: "D",
        text: "The Nile River played no significant role in the development of ancient Egyptian society.",
      },
    ],
    correctAnswer: "C",
  },
];

const fmt = (s) => {
  const n = Number.isFinite(s) ? Math.max(0, Math.floor(s)) : 0;
  return `${String(Math.floor(n / 60)).padStart(2, "0")}:${String(n % 60).padStart(2, "0")}`;
};

function HighlightCorrectSummary({ onBack, initialCategory }) {
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
      title="Highlight Correct Summary"
      description="Listen to the recording and click the paragraph that best summarizes it."
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

export default HighlightCorrectSummary;
