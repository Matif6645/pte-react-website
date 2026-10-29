import { useRef } from "react";
import "./DropdownBlanksEditor.css";

const MARKER_SPLIT = /(\[\d+\])/;
const MARKER_GLOBAL = /\[(\d+)\]/g;

export function getBlankNumbers(passage) {
  const numbers = [];
  for (const match of passage.matchAll(MARKER_GLOBAL)) {
    const n = Number(match[1]);
    if (!numbers.includes(n)) numbers.push(n);
  }
  return numbers;
}

function getBlank(blanks, n) {
  return blanks[n] || { options: ["", "", ""], correct: 0 };
}

export function buildDropdownSegments(passage, blanks) {
  const segments = [];
  const correctAnswers = [];

  passage.split(MARKER_SPLIT).forEach((part) => {
    const match = part.match(/^\[(\d+)\]$/);
    if (match) {
      const blank = getBlank(blanks, match[1]);
      const options = blank.options.map((o) => o.trim()).filter(Boolean);
      segments.push({ type: "blank", options });
      correctAnswers.push(
        (blank.options[blank.correct] || "").trim() || options[0] || "",
      );
    } else if (part) {
      segments.push({ type: "text", value: part });
    }
  });

  return { segments, correctAnswers };
}

export function validateDropdownBlanks(passage, blanks) {
  const numbers = getBlankNumbers(passage);
  if (numbers.length === 0) {
    return "Please insert at least one dropdown in the passage.";
  }
  for (const n of numbers) {
    const blank = getBlank(blanks, n);
    const filled = blank.options.filter((o) => o.trim());
    if (filled.length < 2) {
      return `Dropdown ${n} needs at least 2 options.`;
    }
    if (!(blank.options[blank.correct] || "").trim()) {
      return `Please select the correct answer for dropdown ${n}.`;
    }
  }
  return "";
}

function DropdownBlanksEditor({
  passage,
  blanks,
  onPassageChange,
  onBlanksChange,
}) {
  const textareaRef = useRef(null);
  const numbers = getBlankNumbers(passage);
  const { segments } = buildDropdownSegments(passage, blanks);

  function insertDropdown() {
    const el = textareaRef.current;
    const next = numbers.length ? Math.max(...numbers) + 1 : 1;
    const marker = `[${next}]`;
    const start = el ? el.selectionStart : passage.length;
    const end = el ? el.selectionEnd : passage.length;
    const selectedWord = passage.slice(start, end).trim();

    onPassageChange(passage.slice(0, start) + marker + passage.slice(end));
    onBlanksChange({
      ...blanks,
      [next]: {
        options: selectedWord ? [selectedWord, "", ""] : ["", "", ""],
        correct: 0,
      },
    });

    requestAnimationFrame(() => {
      if (!el) return;
      const pos = start + marker.length;
      el.focus();
      el.setSelectionRange(pos, pos);
    });
  }

  function updateBlank(n, changes) {
    onBlanksChange({ ...blanks, [n]: { ...getBlank(blanks, n), ...changes } });
  }

  function updateOption(n, index, value) {
    const options = [...getBlank(blanks, n).options];
    options[index] = value;
    updateBlank(n, { options });
  }

  function addOption(n) {
    updateBlank(n, { options: [...getBlank(blanks, n).options, ""] });
  }

  function removeOption(n, index) {
    const blank = getBlank(blanks, n);
    if (blank.options.length <= 2) return;
    const options = blank.options.filter((_, i) => i !== index);
    let correct = blank.correct;
    if (index === correct) correct = 0;
    else if (index < correct) correct -= 1;
    updateBlank(n, { options, correct });
  }

  function removeDropdown(n) {
    onPassageChange(passage.split(`[${n}]`).join(""));
    const rest = { ...blanks };
    delete rest[n];
    onBlanksChange(rest);
  }

  return (
    <div className="dd_editor">
      <label>
        <span>Passage (press Enter for a new paragraph)</span>
        <textarea
          ref={textareaRef}
          rows={7}
          value={passage}
          onChange={(e) => onPassageChange(e.target.value)}
          placeholder={
            "Artificial intelligence is rapidly [1] many industries.\n\nDoctors use it to [2] diseases early."
          }
        />
      </label>

      <div className="dd_toolbar">
        <button type="button" className="dd_insert_btn" onClick={insertDropdown}>
          + Insert Dropdown at cursor
        </button>
        <p className="dd_hint">
          Place the cursor where the dropdown should appear, then click the
          button. If you select a word first, it becomes the correct answer for
          that dropdown.
        </p>
      </div>

      {numbers.length === 0 ? (
        <p className="dd_empty">No dropdowns added yet.</p>
      ) : (
        <div className="dd_blank_list">
          {numbers.map((n) => {
            const blank = getBlank(blanks, n);
            return (
              <div key={n} className="dd_blank_card">
                <div className="dd_blank_head">
                  <h4>Dropdown {n}</h4>
                  <button
                    type="button"
                    className="dd_remove_blank"
                    onClick={() => removeDropdown(n)}
                  >
                    Remove
                  </button>
                </div>

                {blank.options.map((option, index) => (
                  <div
                    key={index}
                    className={
                      blank.correct === index
                        ? "dd_option_row dd_option_correct"
                        : "dd_option_row"
                    }
                  >
                    <input
                      type="radio"
                      name={`dd-correct-${n}`}
                      checked={blank.correct === index}
                      onChange={() => updateBlank(n, { correct: index })}
                      title="Mark as correct answer"
                    />
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => updateOption(n, index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                    />
                    {blank.correct === index && (
                      <span className="dd_correct_tag">✓ Correct</span>
                    )}
                    <button
                      type="button"
                      className="dd_remove_option"
                      onClick={() => removeOption(n, index)}
                      disabled={blank.options.length <= 2}
                    >
                      ×
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  className="dd_add_option"
                  onClick={() => addOption(n)}
                >
                  + Add option
                </button>
                <p className="dd_hint">
                  Click the circle next to an option to mark it as the correct
                  answer.
                </p>
              </div>
            );
          })}
        </div>
      )}

      {passage.trim() && (
        <div className="dd_preview">
          <h4>Preview</h4>
          <p>
            {segments.map((segment, index) =>
              segment.type === "text" ? (
                <span key={index}>{segment.value}</span>
              ) : (
                <select key={index} className="dd_preview_select" defaultValue="">
                  <option value="">Select</option>
                  {segment.options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ),
            )}
          </p>
        </div>
      )}
    </div>
  );
}

export default DropdownBlanksEditor;
