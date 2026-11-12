import React from "react";
import "./AiEvaluationResultSST.css";

// A small icon set built into this component; no icon library required.
function ResultIcon({ name, size = 19, className = "" }) {
  const icons = {
    sparkles: (
      <>
        <path d="m12 3 1.6 5.4L19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6L12 3Z" />
        <path d="m19 17 .7 2.3L22 20l-2.3.7L19 23l-.7-2.3L16 20l2.3-.7L19 17Z" />
        <path d="m4 2 .6 1.4L6 4l-1.4.6L4 6l-.6-1.4L2 4l1.4-.6L4 2Z" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    list: (
      <>
        <rect x="4" y="3" width="16" height="18" rx="2" />
        <path d="M8 8h8M8 12h8M8 16h5" />
      </>
    ),
    layers: (
      <>
        <path d="m12 2 9 5-9 5-9-5 9-5Z" />
        <path d="m3 12 9 5 9-5M3 17l9 5 9-5" />
      </>
    ),
    type: (
      <>
        <path d="M4 19 9 5h2l5 14M6 14h8M17 19V9h4" />
      </>
    ),
    book: (
      <>
        <path d="M12 7c-2.5-2-5.7-2.5-9-2v14c3.3-.5 6.5 0 9 2 2.5-2 5.7-2.5 9-2V5c-3.3-.5-6.5 0-9 2Z" />
        <path d="M12 7v14" />
      </>
    ),
    spell: (
      <>
        <rect x="3" y="4" width="18" height="16" rx="3" />
        <path d="m7 12 3 3 6-6" />
      </>
    ),
    bars: (
      <>
        <path d="M5 20v-7M10 20V9M15 20V4M20 20v-12" />
      </>
    ),
    message: (
      <>
        <path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5 9 9 0 0 1-4-.9L3 21l1.9-5.5a9 9 0 0 1-.9-4A8.5 8.5 0 0 1 12.5 3 8.5 8.5 0 0 1 21 11.5Z" />
        <path d="M8 12h.01M12.5 12h.01M17 12h.01" />
      </>
    ),
    target: (
      <>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="12" cy="12" r="1" />
        <path d="m13 11 8-8" />
      </>
    ),
    bulb: (
      <>
        <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.7.5 1 1.1 1 2.3h6c0-1.2.3-1.8 1-2.3A7 7 0 0 0 12 2Z" />
      </>
    ),
    info: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 11v5M12 8h.01" />
      </>
    ),
    words: (
      <>
        <rect x="5" y="3" width="14" height="18" rx="2" />
        <path d="M9 8h6M9 12h6M9 16h4" />
      </>
    ),
    alert: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v6M12 17h.01" />
      </>
    ),
  };

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {icons[name] || icons.info}
    </svg>
  );
}

const criteriaConfig = [
  { key: "content", label: "Content", max: 4, icon: "list" },
  { key: "form", label: "Form", max: 2, icon: "layers" },
  { key: "grammar", label: "Grammar", max: 2, icon: "type" },
  { key: "vocabulary", label: "Vocabulary", max: 2, icon: "book" },
  { key: "spelling", label: "Spelling", max: 2, icon: "spell" },
];

function asNumber(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function asItems(value) {
  return Array.isArray(value)
    ? value.filter((item) => typeof item === "string" && item.trim().length > 0)
    : [];
}

function PointsList({ items, emptyText, icon = "check" }) {
  if (items.length === 0) {
    return <p className="pte-ai-result__empty">{emptyText}</p>;
  }

  return (
    <ul className="pte-ai-result__points">
      {items.map((text, index) => (
        <li key={`${index}-${text.slice(0, 16)}`}>
          <span className="pte-ai-result__point-icon">
            <ResultIcon name={icon} size={13} />
          </span>
          <span>{text}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * Renders the real response from /api/score-listening.
 * Usage: {aiResult && <AiEvaluationResultSST result={aiResult} />}
 */

// Detailed language feedback returned by the SST scoring API.
const languageCategories = [
  { key: "grammar", title: "Grammar", icon: "type" },
  { key: "vocabulary", title: "Vocabulary", icon: "book" },
  { key: "spelling", title: "Spelling", icon: "spell" },
];

function SSTLanguageAnalysis({ analysis, criteria }) {
  // Older API results might not contain languageAnalysis.
  if (!analysis || typeof analysis !== "object") return null;

  return (
    <section className="pte-sst-language" aria-label="Language Analysis">
      <div className="pte-sst-language__heading">
        <ResultIcon name="sparkles" size={19} />
        <h3>Language Analysis (Areas to Improve)</h3>
      </div>
      <div className="pte-sst-language__grid">
        {languageCategories.map(({ key, title, icon }) => {
          const section = analysis[key] || {};
          const errors = Array.isArray(section.errors)
            ? section.errors.filter(
                (entry) =>
                  entry &&
                  typeof entry.original === "string" &&
                  typeof entry.correction === "string" &&
                  entry.original.trim() &&
                  entry.correction.trim(),
              )
            : [];
          const suggestions = asItems(section.suggestions);
          return (
            <article
              className={`pte-sst-language__card pte-sst-language__card--${key}`}
              key={key}
            >
              <div className="pte-sst-language__card-header">
                <div className="pte-sst-language__title">
                  <ResultIcon name={icon} size={19} />
                  <h4>{title}</h4>
                </div>
                <span className="pte-sst-language__score">
                  {asNumber(criteria?.[key]) ?? "–"}/2
                </span>
              </div>
              <div className="pte-sst-language__corrections">
                <h5>Errors &amp; Corrections</h5>
                {errors.length ? (
                  <div className="pte-sst-language__table">
                    <div className="pte-sst-language__table-head">
                      <span>Incorrect</span>
                      <span>Correction</span>
                    </div>
                    {errors.map((entry, index) => (
                      <div className="pte-sst-language__table-row" key={index}>
                        <span className="pte-sst-language__incorrect">
                          {entry.original}
                        </span>
                        <span className="pte-sst-language__correct">
                          <ResultIcon name="check" size={14} />
                          {entry.correction}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="pte-sst-language__empty">
                    No specific errors identified.
                  </p>
                )}
              </div>
              <div className="pte-sst-language__suggestions">
                <h5>
                  <ResultIcon name="bulb" size={17} />
                  Suggestions
                </h5>
                {suggestions.length ? (
                  <ul>
                    {suggestions.map((suggestion, index) => (
                      <li key={index}>{suggestion}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No specific suggestions available.</p>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default function AiEvaluationResultSST({ result }) {
  if (!result) return null;

  const score = asNumber(result.score);
  const maxScore = asNumber(result.maxScore) || 12;
  const words = asNumber(result.wordCount);
  const criteria = result.criteria || {};
  const coveredPoints = asItems(result.coveredPoints);
  const missingPoints = asItems(result.missingPoints);
  const suggestions = asItems(result.suggestions);
  const mistakes = asItems(result.mistakes);
  const feedback =
    typeof result.feedback === "string" ? result.feedback.trim() : "";
  const withinTarget = words !== null && words >= 50 && words <= 70;
  const ratio = score !== null ? score / maxScore : 0;
  const level =
    ratio >= 0.9
      ? "Excellent"
      : ratio >= 0.7
        ? "Good progress"
        : "Keep practicing";

  return (
    <section className="pte-ai-result" aria-label="AI Evaluation Result">
      <header className="pte-ai-result__header">
        <div className="pte-ai-result__heading">
          <span className="pte-ai-result__heading-icon">
            <ResultIcon name="sparkles" size={19} />
          </span>
          <h3>AI Evaluation Result</h3>
          <span className="pte-ai-result__status">
            <ResultIcon name="check" size={13} /> Evaluation completed
          </span>
        </div>
        <span className="pte-ai-result__disclaimer">
          {result.scoreNote || "Unofficial PTE practice score"}
          <ResultIcon name="info" size={14} />
        </span>
      </header>

      <div className="pte-ai-result__top-grid">
        <div className="pte-ai-result__summary-column">
          <div className="pte-ai-result__score-card">
            <div className="pte-ai-result__score-copy">
              <span className="pte-ai-result__eyebrow">Overall Score</span>
              <div className="pte-ai-result__score-number">
                {score ?? "–"}
                <span>/{maxScore}</span>
              </div>
              {score !== null && (
                <span className="pte-ai-result__level">
                  <ResultIcon name="check" size={14} /> {level}
                </span>
              )}
            </div>
            <span className="pte-ai-result__trophy" aria-hidden="true">
              🏆
            </span>
          </div>

          <div className="pte-ai-result__word-card">
            <span className="pte-ai-result__mini-icon">
              <ResultIcon name="words" size={17} />
            </span>
            <div className="pte-ai-result__word-copy">
              <span className="pte-ai-result__eyebrow">Word Count</span>
              <strong>{words ?? "–"} words</strong>
            </div>
            {words !== null && (
              <span
                className={`pte-ai-result__word-status ${withinTarget ? "is-valid" : "is-warning"}`}
              >
                <ResultIcon name={withinTarget ? "check" : "alert"} size={14} />
                {withinTarget
                  ? "Within target (50–70)"
                  : "Outside target (50–70)"}
              </span>
            )}
          </div>
        </div>

        <div className="pte-ai-result__breakdown">
          <h4>
            <ResultIcon name="bars" size={20} /> Score Breakdown
          </h4>
          <div className="pte-ai-result__criteria">
            {criteriaConfig.map(({ key, label, max, icon }) => {
              const value = asNumber(criteria[key]);
              const percent =
                value === null
                  ? 0
                  : Math.min(100, Math.max(0, (value / max) * 100));
              return (
                <div className="pte-ai-result__criterion" key={key}>
                  <span className="pte-ai-result__criterion-icon">
                    <ResultIcon name={icon} size={17} />
                  </span>
                  <span className="pte-ai-result__criterion-name">{label}</span>
                  <strong className="pte-ai-result__criterion-value">
                    {value ?? "–"} / {max}
                  </strong>
                  <div
                    className="pte-ai-result__track"
                    role="progressbar"
                    aria-label={`${label} score`}
                    aria-valuenow={value ?? 0}
                    aria-valuemin={0}
                    aria-valuemax={max}
                  >
                    <div
                      className="pte-ai-result__fill"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="pte-ai-result__details-grid">
        <div className="pte-ai-result__detail pte-ai-result__detail--feedback">
          <h4>
            <ResultIcon name="message" size={20} /> AI Feedback
          </h4>
          <p>
            {feedback || "No written feedback was returned for this attempt."}
          </p>
          {mistakes.length > 0 && (
            <div className="pte-ai-result__mistakes">
              <strong>Things to correct</strong>
              <PointsList items={mistakes} emptyText="" icon="alert" />
            </div>
          )}
        </div>

        <div className="pte-ai-result__detail pte-ai-result__detail--covered">
          <h4>
            <ResultIcon name="check" size={20} /> Key Points Covered
          </h4>
          <PointsList
            items={coveredPoints}
            emptyText="No covered points were listed."
          />
        </div>

        <div className="pte-ai-result__detail-stack">
          <div className="pte-ai-result__detail pte-ai-result__detail--missing">
            <h4>
              <ResultIcon name="target" size={20} /> Missing Points
            </h4>
            <PointsList
              items={missingPoints}
              emptyText="No important missing points were identified."
              icon="alert"
            />
          </div>
          <div className="pte-ai-result__detail pte-ai-result__detail--suggestions">
            <h4>
              <ResultIcon name="bulb" size={20} /> Suggestions
            </h4>
            <PointsList
              items={suggestions}
              emptyText="No suggestions were returned for this attempt."
            />
          </div>
        </div>
      </div>
      <SSTLanguageAnalysis
        analysis={result.languageAnalysis}
        criteria={criteria}
      />
    </section>
  );
}
