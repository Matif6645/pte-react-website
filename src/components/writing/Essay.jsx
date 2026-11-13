
import { useEffect, useMemo, useState } from "react";
import { getMergedQuestions } from "../../admin/practiceQuestions";
import { scoreListening } from "../../admin/aiScore.js";
import {
  addSubmission,
  updateSubmission
} from "../../admin/submissonStore.js";

import PracticeShared from "../PracticeShared.jsx";
import AiEvaluationResultEssay from "./AiEvaluationResultEssay.jsx";


// =====================================
// ESSAY CATEGORIES
// =====================================

const CATS = [
  "SCIENCE & TECHNOLOGY",
  "HISTORY",
  "BIOLOGY",
  "MEDICAL SCIENCE",
  "ENVIRONMENT",
  "GEOGRAPHY",
  "EDUCATION",
];


// =====================================
// DEFAULT ESSAY QUESTIONS
// =====================================

const defaultQuestions = [
  {
    id: 471,
    title: "GOING TO UNIVERSITY",
    difficulty: "Medium",
    time: "20:00",
    category: "EDUCATION",
    prompt:
      "In a perfect world, every young person should go to university. Do you agree with this statement? Why?",
    questionText:
      "You will have 20 minutes to plan, write and revise an essay about the topic below. Your response will be judged on how well you develop a position, organize your ideas, present supporting details, and control the elements of standard written English. You should write 200–300 words.",
  },
  {
    id: 472,
    title: "ARTIFICIAL INTELLIGENCE",
    difficulty: "Medium",
    time: "20:00",
    category: "SCIENCE & TECHNOLOGY",
    prompt:
      "Artificial intelligence is replacing many traditional jobs. Do you think the benefits of artificial intelligence outweigh its disadvantages?",
    questionText:
      "You will have 20 minutes to plan, write and revise an essay about the topic below. Write 200–300 words.",
  },
  {
    id: 473,
    title: "SOCIAL MEDIA",
    difficulty: "Easy",
    time: "20:00",
    category: "SCIENCE & TECHNOLOGY",
    prompt:
      "Social media has changed the way people communicate. Do you think it has had a positive or negative impact on society?",
    questionText:
      "You will have 20 minutes to plan, write and revise an essay about the topic below. Write 200–300 words.",
  },
  {
    id: 474,
    title: "TECHNOLOGY IN EDUCATION",
    difficulty: "Hard",
    time: "20:00",
    category: "SCIENCE & TECHNOLOGY",
    prompt:
      "Some people believe that technology will eventually replace teachers in classrooms. To what extent do you agree or disagree?",
    questionText:
      "You will have 20 minutes to plan, write and revise an essay about the topic below. Write 200–300 words.",
  },
  {
    id: 475,
    title: "LEARNING FROM HISTORY",
    difficulty: "Easy",
    time: "20:00",
    category: "HISTORY",
    prompt:
      "Some people believe that studying history is essential for understanding the modern world. Do you agree or disagree?",
    questionText:
      "You will have 20 minutes to plan, write and revise an essay about the topic below. Write 200–300 words.",
  },
  {
    id: 476,
    title: "HISTORICAL BUILDINGS",
    difficulty: "Medium",
    time: "20:00",
    category: "HISTORY",
    prompt:
      "Governments should spend more money preserving historical buildings rather than constructing modern facilities. Discuss both views and give your opinion.",
    questionText:
      "You will have 20 minutes to plan, write and revise an essay about the topic below. Write 200–300 words.",
  },
  {
    id: 477,
    title: "CULTURAL HERITAGE",
    difficulty: "Hard",
    time: "20:00",
    category: "HISTORY",
    prompt:
      "Globalisation is causing traditional cultures and customs to disappear. What are the main causes of this problem, and what measures can be taken to preserve cultural heritage?",
    questionText:
      "You will have 20 minutes to plan, write and revise an essay about the topic below. Write 200–300 words.",
  },
  {
    id: 478,
    title: "GENETIC ENGINEERING",
    difficulty: "Hard",
    time: "20:00",
    category: "BIOLOGY",
    prompt:
      "Genetic engineering offers opportunities to improve human health but also raises ethical concerns. Discuss the advantages and disadvantages of genetic engineering.",
    questionText:
      "You will have 20 minutes to plan, write and revise an essay about the topic below. Write 200–300 words.",
  },
  {
    id: 479,
    title: "ANIMAL TESTING",
    difficulty: "Medium",
    time: "20:00",
    category: "BIOLOGY",
    prompt:
      "Some people believe that animal testing is necessary for scientific research, while others consider it unethical. Discuss both views and give your opinion.",
    questionText:
      "You will have 20 minutes to plan, write and revise an essay about the topic below. Write 200–300 words.",
  },
  {
    id: 480,
    title: "BIODIVERSITY CONSERVATION",
    difficulty: "Easy",
    time: "20:00",
    category: "BIOLOGY",
    prompt:
      "Many animal and plant species are becoming endangered because of human activities. What are the main causes, and how can biodiversity be protected?",
    questionText:
      "You will have 20 minutes to plan, write and revise an essay about the topic below. Write 200–300 words.",
  },
  {
    id: 481,
    title: "PUBLIC HEALTHCARE",
    difficulty: "Medium",
    time: "20:00",
    category: "MEDICAL SCIENCE",
    prompt:
      "Some people believe that healthcare should be provided free of charge to all citizens. To what extent do you agree or disagree?",
    questionText:
      "You will have 20 minutes to plan, write and revise an essay about the topic below. Write 200–300 words.",
  },
  {
    id: 482,
    title: "MENTAL HEALTH AWARENESS",
    difficulty: "Easy",
    time: "20:00",
    category: "MEDICAL SCIENCE",
    prompt:
      "Mental health is becoming an increasingly important issue in modern society. What are the main causes of mental health problems, and what can governments do to address them?",
    questionText:
      "You will have 20 minutes to plan, write and revise an essay about the topic below. Write 200–300 words.",
  },
  {
    id: 483,
    title: "MEDICAL TECHNOLOGY",
    difficulty: "Hard",
    time: "20:00",
    category: "MEDICAL SCIENCE",
    prompt:
      "Advances in medical technology have increased life expectancy. Do the advantages of people living longer outweigh the challenges faced by society?",
    questionText:
      "You will have 20 minutes to plan, write and revise an essay about the topic below. Write 200–300 words.",
  },
  {
    id: 484,
    title: "CLIMATE CHANGE",
    difficulty: "Medium",
    time: "20:00",
    category: "ENVIRONMENT",
    prompt:
      "Climate change is one of the greatest challenges facing the world today. Who should take greater responsibility for addressing it: governments, businesses, or individuals?",
    questionText:
      "You will have 20 minutes to plan, write and revise an essay about the topic below. Write 200–300 words.",
  },
  {
    id: 485,
    title: "PLASTIC POLLUTION",
    difficulty: "Easy",
    time: "20:00",
    category: "ENVIRONMENT",
    prompt:
      "Plastic pollution is causing serious environmental problems worldwide. What are the main causes, and what solutions would you recommend?",
    questionText:
      "You will have 20 minutes to plan, write and revise an essay about the topic below. Write 200–300 words.",
  },
  {
    id: 486,
    title: "RENEWABLE ENERGY",
    difficulty: "Hard",
    time: "20:00",
    category: "ENVIRONMENT",
    prompt:
      "Some people believe that governments should completely replace fossil fuels with renewable energy sources. Discuss the benefits and challenges of this transition.",
    questionText:
      "You will have 20 minutes to plan, write and revise an essay about the topic below. Write 200–300 words.",
  },
  {
    id: 487,
    title: "URBANISATION",
    difficulty: "Medium",
    time: "20:00",
    category: "GEOGRAPHY",
    prompt:
      "More people are moving from rural areas to large cities in search of better opportunities. What are the advantages and disadvantages of urbanisation?",
    questionText:
      "You will have 20 minutes to plan, write and revise an essay about the topic below. Write 200–300 words.",
  },
  {
    id: 488,
    title: "INTERNATIONAL TOURISM",
    difficulty: "Easy",
    time: "20:00",
    category: "GEOGRAPHY",
    prompt:
      "International tourism has become an important source of income for many countries. Do its economic benefits outweigh its environmental and cultural disadvantages?",
    questionText:
      "You will have 20 minutes to plan, write and revise an essay about the topic below. Write 200–300 words.",
  },
  {
    id: 489,
    title: "POPULATION GROWTH",
    difficulty: "Hard",
    time: "20:00",
    category: "GEOGRAPHY",
    prompt:
      "Rapid population growth places increasing pressure on housing, transportation, and natural resources. What problems does this create, and how should governments respond?",
    questionText:
      "You will have 20 minutes to plan, write and revise an essay about the topic below. Write 200–300 words.",
  },
  {
    id: 490,
    title: "ONLINE LEARNING",
    difficulty: "Easy",
    time: "20:00",
    category: "EDUCATION",
    prompt:
      "Online learning is becoming increasingly popular among students. Do you think online education is as effective as traditional classroom learning?",
    questionText:
      "You will have 20 minutes to plan, write and revise an essay about the topic below. Write 200–300 words.",
  },
  {
    id: 491,
    title: "EXAMINATIONS AND ASSESSMENT",
    difficulty: "Medium",
    time: "20:00",
    category: "EDUCATION",
    prompt:
      "Some people believe that examinations are the best way to assess students' academic abilities, while others prefer continuous assessment. Discuss both views and give your opinion.",
    questionText:
      "You will have 20 minutes to plan, write and revise an essay about the topic below. Write 200–300 words.",
  },
  {
    id: 492,
    title: "PRACTICAL SKILLS VS THEORY",
    difficulty: "Hard",
    time: "20:00",
    category: "EDUCATION",
    prompt:
      "Universities should focus more on developing practical employment skills than teaching theoretical knowledge. To what extent do you agree or disagree?",
    questionText:
      "You will have 20 minutes to plan, write and revise an essay about the topic below. Write 200–300 words.",
  },
];


// =====================================
// HELPER FUNCTIONS
// =====================================

// Count words
function wordCount(text) {
  return String(text || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

// Convert time string to seconds
function parseSeconds(timeStr) {
  const parts = String(timeStr || "20:00")
    .split(":")
    .map((n) => Number(n));

  if (
    parts.length === 2 &&
    parts.every((n) => Number.isFinite(n))
  ) {
    return parts[0] * 60 + parts[1];
  }

  return 20 * 60;
}

// Format timer
function fmt(s) {
  const n = Math.max(0, Math.floor(s));

  return `${String(Math.floor(n / 60)).padStart(2, "0")}:${String(
    n % 60
  ).padStart(2, "0")}`;
}


// =====================================
// WRITE ESSAY COMPONENT
// =====================================

function WriteEssay({ onBack, initialCategory }) {

  const [questions, setQuestions] = useState(defaultQuestions);

  const [cat, setCat] = useState(
    CATS.includes(initialCategory)
      ? initialCategory
      : CATS[0]
  );

  const [idx, setIdx] = useState(0);
  const [search, setSearch] = useState("");

  const [typedMap, setTypedMap] = useState({});
  const [submittedMap, setSubmittedMap] = useState({});
  const [resultMap, setResultMap] = useState({});
  const [errorMap, setErrorMap] = useState({});

  const [remain, setRemain] = useState(20 * 60);
  const [aiLoading, setAiLoading] = useState(false);
  const [loadingQuestionId, setLoadingQuestionId] = useState(null);


  // =====================================
  // LOAD QUESTIONS
  // =====================================

  useEffect(() => {
    let cancelled = false;

    getMergedQuestions("write-essay", defaultQuestions)
      .then((merged) => {
        if (!cancelled) {
          setQuestions(merged);
        }
      })
      .catch((error) => {
        console.error("Failed to load essay questions:", error);
      });

    return () => {
      cancelled = true;
    };
  }, []);


  // =====================================
  // CATEGORY COUNTS
  // =====================================

  const counts = useMemo(() => {
    const c = {};

    CATS.forEach((x) => {
      c[x] = questions.filter(
        (q) => q.category === x
      ).length;
    });

    return c;
  }, [questions]);


  // =====================================
  // FILTER QUESTIONS
  // =====================================

  const list = useMemo(() => {
    const term = search.trim().toLowerCase();

    return questions.filter(
      (q) =>
        q.category === cat &&
        (
          !term ||
          q.title.toLowerCase().includes(term) ||
          String(q.id).includes(term)
        )
    );
  }, [questions, cat, search]);


  // =====================================
  // CURRENT QUESTION
  // =====================================

  const total = list.length;
  const safe = total ? Math.min(idx, total - 1) : 0;
  const q = list[safe];

  const submitted = q
    ? Boolean(submittedMap[q.id])
    : false;

  const typed = q
    ? typedMap[q.id] || ""
    : "";

  const count = wordCount(typed);

  const aiResult = q
    ? resultMap[q.id] || null
    : null;

  const aiError = q
    ? errorMap[q.id] || ""
    : "";

  const isCurrentLoading =
    aiLoading && loadingQuestionId === q?.id;


  // =====================================
  // TIMER
  // =====================================

  useEffect(() => {
    if (!q) return;

    setRemain(parseSeconds(q.time));
  }, [q?.id]);

  useEffect(() => {
    if (!q || submitted || aiLoading) return;

    const timer = setInterval(() => {
      setRemain((prev) =>
        prev > 0 ? prev - 1 : 0
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [q?.id, submitted, aiLoading]);


  // =====================================
  // SUBMIT ESSAY FOR AI SCORING
  // =====================================

  async function handleSubmit() {
    if (
      !q ||
      !typed.trim() ||
      submitted ||
      aiLoading
    ) {
      return;
    }

    const questionId = q.id;
    const answer = typed.trim();

    setAiLoading(true);
    setLoadingQuestionId(questionId);

    setErrorMap((prev) => ({
      ...prev,
      [questionId]: "",
    }));

    setResultMap((prev) => ({
      ...prev,
      [questionId]: null,
    }));

    // Save initial student submission
    const item = addSubmission({
      type: "write-essay",
      questionId,
      questionTitle: q.title,
      difficulty: q.difficulty,
      category: q.category,
      prompt: q.prompt,
      answerText: answer,
      wordCount: wordCount(answer),
    });

    try {

      // Send essay to OpenAI via Express backend
      const data = await scoreListening({
        type: "write-essay",
        question: q.prompt,
        correctAnswer: "",
        studentAnswer: answer,
      });

      // Save AI result for this question
      setResultMap((prev) => ({
        ...prev,
        [questionId]: data,
      }));

      // Update admin submission record
      updateSubmission(item.id, {
        status: "ai-scored",
        score: data.score,
        maxScore: data.maxScore,
        feedback: data.feedback,
        criteria: data.criteria,
        strengths: data.strengths,
        weaknesses: data.weaknesses,
        suggestions: data.suggestions,
        languageAnalysis: data.languageAnalysis,
      });

      // Mark question as completed only on success
      setSubmittedMap((prev) => ({
        ...prev,
        [questionId]: true,
      }));

    } catch (err) {

      console.error("Essay scoring failed:", err);

      setErrorMap((prev) => ({
        ...prev,
        [questionId]:
          err.message || "AI scoring failed",
      }));

      if (item?.id != null) {
        updateSubmission(item.id, {
          status: "ai-error",
          feedback: err.message || "AI scoring failed",
        });
      }

    } finally {
      setAiLoading(false);
      setLoadingQuestionId(null);
    }
  }


  // =====================================
  // RE-DO ESSAY
  // =====================================

  function handleRedo() {
    if (!q || aiLoading) return;

    const questionId = q.id;

    setSubmittedMap((prev) => {
      const next = { ...prev };
      delete next[questionId];
      return next;
    });

    setTypedMap((prev) => ({
      ...prev,
      [questionId]: "",
    }));

    setResultMap((prev) => ({
      ...prev,
      [questionId]: null,
    }));

    setErrorMap((prev) => ({
      ...prev,
      [questionId]: "",
    }));

    setRemain(parseSeconds(q.time));
  }


  // =====================================
  // DISPLAY PRACTICE PAGE
  // =====================================

  return (
    <PracticeShared
      headingLabel="WRITING PRACTICE"
      backLabel="Back"
      title="Write Essay"
      description="Write a 200–300 word essay. After submission, AI will evaluate your answer."
      icon="fa-solid fa-pen"

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
              {
                icon: "fa-regular fa-clock",
                text: `Remain: ${fmt(remain)}`,
              },
              {
                icon: "fa-solid fa-align-left",
                text: "200–300 WORDS",
              },
              {
                icon: "fa-solid fa-tag",
                text: q.category,
              },
            ]
          : []
      }

      onBack={onBack}
      onReset={handleRedo}
      resetDisabled={!q || aiLoading}

      onCheck={handleSubmit}
      checkDisabled={
        submitted ||
        !typed.trim() ||
        aiLoading
      }
      checkLabel={
        isCurrentLoading
          ? "Scoring..."
          : submitted
          ? "Submitted"
          : "Submit"
      }

      onPrevious={() => {
        if (safe > 0) {
          setIdx(safe - 1);
        }
      }}

      onNext={() => {
        if (safe < total - 1) {
          setIdx(safe + 1);
        }
      }}

      previousDisabled={!safe}
      nextDisabled={safe >= total - 1}
    >

      {q && (
        <>

          {/* QUESTION INSTRUCTIONS */}
          <p className="mcq_question_text essay_instruction">
            {q.questionText}
          </p>


          {/* ESSAY TOPIC */}
          <div className="essay_prompt_box">
            <p className="essay_prompt_label">
              Essay topic
            </p>

            <p className="essay_prompt_text">
              {q.prompt}
            </p>
          </div>


          {/* STUDENT ESSAY TEXTAREA */}
          <label
            className="sst_label"
            htmlFor={`essay-input-${q.id}`}
          >
            Write your essay
          </label>

          <textarea
            id={`essay-input-${q.id}`}
            className="sst_textarea essay_textarea"
            rows={12}
            placeholder="Type your essay here..."
            value={typed}
            disabled={submitted || aiLoading}

            onChange={(e) =>
              setTypedMap((prev) => ({
                ...prev,
                [q.id]: e.target.value,
              }))
            }
          />


          {/* WORD COUNT */}
          <p
            className={`sst_word_count ${
              count > 0 &&
              (count < 200 || count > 300)
                ? "essay_wc_warn"
                : ""
            }`}
          >
            Word Count: {count}
          </p>


          {/* AI LOADING MESSAGE */}
          {isCurrentLoading && (
            <div className="essay_ai_loading">
              <p className="sst_submit_ok">
                AI is evaluating your essay...
              </p>
            </div>
          )}


          {/* AI ERROR MESSAGE */}
          {aiError && (
            <div className="essay_error_message">
              <p>
                AI error: {aiError}
              </p>

              <p>
                You can click Submit again to retry.
              </p>
            </div>
          )}


          {/* DETAILED AI ESSAY RESULT */}
          {submitted && aiResult && (
            <div className="essay_result_container">

              <AiEvaluationResultEssay
                result={aiResult}
              />

              {/* RE-DO BUTTON */}
              <button
                type="button"
                className="essay_redo_btn"
                onClick={handleRedo}
              >
                Re-do
              </button>

            </div>
          )}

        </>
      )}

    </PracticeShared>
  );
}

export default WriteEssay;
