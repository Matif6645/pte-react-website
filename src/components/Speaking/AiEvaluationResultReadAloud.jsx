import "./AiEvaluationResultReadAloud.css";

// ==========================================
// HELPERS
// ==========================================

function asList(value) {
  return Array.isArray(value) ? value : [];
}

function displayText(value) {
  if (typeof value === "string") {
    return value;
  }

  return "";
}

// ==========================================
// RESULT SECTION
// ==========================================

function ResultSection({
  title,
  icon,
  items,
  className = "",
  emptyMessage = "Nothing to report.",
}) {
  const safeItems = asList(items);

  return (
    <section className={`ra_result_section ${className}`}>
      <h3>
        <i className={icon} />
        {title}
      </h3>

      {safeItems.length > 0 ? (
        <ul>
          {safeItems.map((item, index) => (
            <li key={index}>{displayText(item)}</li>
          ))}
        </ul>
      ) : (
        <p className="ra_empty_message">{emptyMessage}</p>
      )}
    </section>
  );
}

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function AiEvaluationResultReadAloud({ result }) {
  if (!result || typeof result !== "object") {
    return null;
  }

  const score = Number.isFinite(result.score)
    ? result.score
    : Number.isFinite(result.contentScore)
      ? result.contentScore
      : 0;

  const maxScore = Number.isFinite(result.maxScore) ? result.maxScore : 4;

  const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;

  const correctWords = asList(result.correctWords);
  const missingWords = asList(result.missingWords);
  const incorrectWords = asList(result.incorrectWords);
  const addedWords = asList(result.addedWords);
  const strengths = asList(result.strengths);
  const suggestions = asList(result.suggestions);

  const pronunciationAvailable = Number.isFinite(result.pronunciationScore);

  const fluencyAvailable = Number.isFinite(result.fluencyScore);

  return (
    <div className="ra_ai_result">
      {/* =====================================
          HEADER
      ===================================== */}

      <div className="ra_result_header">
        <div>
          <p className="ra_result_eyebrow">AI SPEAKING EVALUATION</p>

          <h2>Read Aloud Result</h2>

          <p className="ra_result_subtitle">
            Unofficial PTE Academy practice evaluation
          </p>
        </div>

        <div className="ra_score_circle">
          <strong>
            {score}/{maxScore}
          </strong>
          <span>Content</span>
        </div>
      </div>

      {/* =====================================
          SCORE BREAKDOWN
      ===================================== */}

      <div className="ra_score_grid">
        <div className="ra_score_card">
          <span>Content Accuracy</span>

          <strong>{percentage}%</strong>

          <div className="ra_progress_track">
            <div
              className="ra_progress_fill"
              style={{
                width: `${Math.min(100, Math.max(0, percentage))}%`,
              }}
            />
          </div>

          <small>
            {score} out of {maxScore} practice marks
          </small>
        </div>

        <div className="ra_score_card">
          <span>Pronunciation</span>

          <strong>
            {pronunciationAvailable ? result.pronunciationScore : "N/A"}
          </strong>

          <small>
            {pronunciationAvailable
              ? "Audio assessment"
              : "Not assessed from transcript"}
          </small>
        </div>

        <div className="ra_score_card">
          <span>Oral Fluency</span>

          <strong>{fluencyAvailable ? result.fluencyScore : "N/A"}</strong>

          <small>
            {fluencyAvailable
              ? "Audio assessment"
              : "Not assessed from transcript"}
          </small>
        </div>
      </div>

      {/* =====================================
          GENERAL FEEDBACK
      ===================================== */}

      <div className="ra_feedback_box">
        <h3>
          <i className="fa-solid fa-comment-dots" />
          Overall Feedback
        </h3>

        <p>{result.feedback || "No feedback is available yet."}</p>
      </div>

      {/* =====================================
          WORD ACCURACY
      ===================================== */}

      <div className="ra_word_grid">
        <ResultSection
          title="Correct Words"
          icon="fa-solid fa-circle-check"
          className="ra_correct"
          items={correctWords}
          emptyMessage="No correct words were identified."
        />

        <ResultSection
          title="Missing Words"
          icon="fa-solid fa-circle-minus"
          className="ra_missing"
          items={missingWords}
          emptyMessage="No missing words identified."
        />

        <ResultSection
          title="Added Words"
          icon="fa-solid fa-circle-plus"
          className="ra_added"
          items={addedWords}
          emptyMessage="No additional words identified."
        />
      </div>

      {/* =====================================
          INCORRECT WORDS
      ===================================== */}

      <section className="ra_result_section ra_incorrect">
        <h3>
          <i className="fa-solid fa-triangle-exclamation" />
          Incorrect Words
        </h3>

        {incorrectWords.length > 0 ? (
          <div className="ra_incorrect_list">
            {incorrectWords.map((item, index) => (
              <div className="ra_incorrect_item" key={index}>
                <div>
                  <span>Expected</span>
                  <strong>{displayText(item?.expected)}</strong>
                </div>

                <i className="fa-solid fa-arrow-right" />

                <div>
                  <span>Transcribed</span>
                  <strong>{displayText(item?.spoken)}</strong>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="ra_empty_message">No word substitutions identified.</p>
        )}
      </section>

      {/* =====================================
          STRENGTHS AND IMPROVEMENTS
      ===================================== */}

      <div className="ra_word_grid ra_two_columns">
        <ResultSection
          title="Strengths"
          icon="fa-solid fa-star"
          className="ra_strengths"
          items={strengths}
          emptyMessage="No strengths were provided."
        />

        <ResultSection
          title="Suggestions for Improvement"
          icon="fa-solid fa-lightbulb"
          className="ra_suggestions"
          items={suggestions}
          emptyMessage="No improvement suggestions."
        />
      </div>

      {/* =====================================
          SCORING NOTE
      ===================================== */}

      <p className="ra_score_note">
        <i className="fa-solid fa-circle-info" />
        {result.scoreNote ||
          "Unofficial Read Aloud content practice score."}{" "}
        Transcript errors may reflect speech recognition mistakes. Pronunciation
        and fluency require separate audio-based assessment.
      </p>
    </div>
  );
}
