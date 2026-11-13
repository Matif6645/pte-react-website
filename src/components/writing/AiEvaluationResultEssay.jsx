
import "./AiEvaluationResultEssay.css";

const scoreItems = [
  { key: "content", label: "Content", max: 6 },
  { key: "form", label: "Form", max: 2 },
  {
    key: "developmentStructureCoherence",
    label: "Development, Structure & Coherence",
    max: 6
  },
  { key: "grammar", label: "Grammar", max: 2 },
  {
    key: "generalLinguisticRange",
    label: "General Linguistic Range",
    max: 6
  },
  { key: "vocabularyRange", label: "Vocabulary Range", max: 2 },
  { key: "spelling", label: "Spelling", max: 2 }
];

function ResultList({ items, emptyText }) {
  if (!Array.isArray(items) || items.length === 0) {
    return <p className="essay_empty">{emptyText}</p>;
  }

  return (
    <ul className="essay_result_list">
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}

function LanguageCard({ title, data }) {
  const errors = Array.isArray(data?.errors) ? data.errors : [];
  const suggestions = Array.isArray(data?.suggestions)
    ? data.suggestions
    : [];

  return (
    <div className="essay_language_card">
      <h4>{title}</h4>

      {errors.length === 0 ? (
        <p className="essay_empty">No errors identified.</p>
      ) : (
        <div className="essay_error_list">
          {errors.map((error, index) => (
            <div className="essay_error_item" key={index}>
              <div>
                <span className="essay_error_label">Original</span>
                <p className="essay_original">
                  {error.original}
                </p>
              </div>

              <div>
                <span className="essay_error_label">Correction</span>
                <p className="essay_corrected">
                  {error.correction}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="essay_language_suggestions">
          <h5>How to improve</h5>
          <ResultList items={suggestions} />
        </div>
      )}
    </div>
  );
}

export default function AiEvaluationResultEssay({
  result,
  aiResult
}) {
  // Supports either prop name
  const data = result || aiResult;

  if (!data) return null;

  const score = Number(data.score) || 0;
  const maxScore = Number(data.maxScore) || 26;
  const criteria = data.criteria || {};
  const wordCount = Number(data.wordCount) || 0;

  const zeroScore = Boolean(data.zeroScore);

  const strengths = Array.isArray(data.strengths)
    ? data.strengths
    : [];

  const weaknesses = Array.isArray(data.weaknesses)
    ? data.weaknesses
    : [];

  const suggestions = Array.isArray(data.suggestions)
    ? data.suggestions
    : [];

  const languageAnalysis = data.languageAnalysis || {};

  const withinTarget = wordCount >= 200 && wordCount <= 300;

  const scorePercent = maxScore > 0
    ? (score / maxScore) * 100
    : 0;

  const scoreLabel =
    scorePercent >= 80
      ? "Excellent"
      : scorePercent >= 60
      ? "Good effort"
      : "Keep practicing";

  return (
    <section className="essay_ai_result">

      {/* HEADER */}
      <div className="essay_result_header">
        <div className="essay_header_left">
          <span className="essay_ai_icon">✦</span>
          <h2>AI Essay Evaluation Result</h2>
          <span className="essay_completed">
            ✓ Evaluation completed
          </span>
        </div>

        <span className="essay_unofficial">
          Unofficial PTE practice score
        </span>
      </div>

      {/* SCORE SECTION */}
      <div className="essay_score_layout">

        <div className="essay_score_left">

          <div className="essay_overall_card">
            <p className="essay_card_label">Overall Score</p>

            <div className="essay_score_number">
              <strong>{score}</strong>
              <span>/{maxScore}</span>
            </div>

            <span className="essay_score_badge">
              {scoreLabel}
            </span>

            <div className="essay_trophy">🏆</div>
          </div>

          <div className="essay_word_card">
            <p className="essay_card_label">Word Count</p>

            <h3>{wordCount} words</h3>

            <p className={
              withinTarget
                ? "essay_word_ok"
                : "essay_word_warning"
            }>
              {withinTarget
                ? "✓ Within target (200–300)"
                : "Outside target (200–300)"}
            </p>
          </div>

        </div>

        {/* SCORE BREAKDOWN */}
        <div className="essay_breakdown_card">
          <h3>▥ Score Breakdown</h3>

          {scoreItems.map((item) => {
            const value = Number(criteria[item.key]) || 0;

            const percentage = Math.min(
              100,
              Math.max(0, (value / item.max) * 100)
            );

            return (
              <div className="essay_score_row" key={item.key}>
                <span className="essay_criterion_name">
                  {item.label}
                </span>

                <span className="essay_criterion_mark">
                  {value} / {item.max}
                </span>

                <div className="essay_progress_track">
                  <div
                    className="essay_progress_fill"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}

          {zeroScore && (
            <p className="essay_zero_note">
              Zero-score rule applied because Content
              or Form received zero marks.
            </p>
          )}
        </div>

      </div>

      {/* FEEDBACK SECTION */}
      <div className="essay_feedback_grid">

        <div className="essay_info_card essay_feedback_card">
          <h3>◉ AI Feedback</h3>

          <p>
            {data.feedback || "No feedback returned."}
          </p>
        </div>

        <div className="essay_info_card essay_strength_card">
          <h3>✓ Strengths</h3>

          <ResultList
            items={strengths}
            emptyText="No strengths were identified."
          />
        </div>

        <div className="essay_feedback_right">

          <div className="essay_info_card essay_weakness_card">
            <h3>◎ Areas to Improve</h3>

            <ResultList
              items={weaknesses}
              emptyText="No specific weaknesses identified."
            />
          </div>

          <div className="essay_info_card essay_suggestion_card">
            <h3>♧ Suggestions</h3>

            <ResultList
              items={suggestions}
              emptyText="No suggestions were returned."
            />
          </div>

        </div>
      </div>

      {/* LANGUAGE ANALYSIS */}
      <div className="essay_language_section">
        <h3>Detailed Language Analysis</h3>

        <div className="essay_language_grid">
          <LanguageCard
            title="Grammar"
            data={languageAnalysis.grammar}
          />

          <LanguageCard
            title="Vocabulary"
            data={languageAnalysis.vocabulary}
          />

          <LanguageCard
            title="Spelling"
            data={languageAnalysis.spelling}
          />
        </div>
      </div>

    </section>
  );
}
