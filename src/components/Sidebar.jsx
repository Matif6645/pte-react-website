import { useState } from "react";
import "./Sidebar.css";

const sections = [
  {
    id: "reading",
    label: "READING",
    icon: "fa-solid fa-book-open",
    items: [
      "Fill in the Blanks (Dropdown)",
      "Reorder Paragraphs",
      "Multiple Choice (Multiple Answers)",
      "Fill in the Blanks (Drag and Drop)",
      "Multiple Choice (Single Answer)",
    ],
  },
  {
    id: "speaking",
    label: "SPEAKING",
    icon: "fa-solid fa-microphone",
    items: [
      "Read Aloud",
      "Repeat Sentence",
      "Describe Image",
      "Retell Lecture",
      "Answer Short Question",
    ],
  },
  {
    id: "writing",
    label: "WRITING",
    icon: "fa-solid fa-pen",
    items: [
      "Summarize Written Text",
      "Write Essay",
    ],
  },
  {
    id: "listening",
    label: "LISTENING",
    icon: "fa-solid fa-headphones",
    items: [
      "Summarize Spoken Text",
      "Fill in the Blanks",
      "Highlight Correct Summary",
      "Write from Dictation",
    ],
  },
];

function Sidebar() {
  const [open, setOpen] = useState("reading");
  const [activeItem, setActiveItem] = useState("Fill in the Blanks (Dropdown)");

  function toggleSection(id) {
    setOpen(open === id ? "" : id);
  }

  return (
    <aside className="practice_sidebar">

      <p className="practice_space">Practice space</p>

      <nav className="practice_nav">
        {sections.map((section) => (
          <div key={section.id} className="sidebar_group">
            {section.id === "speaking" && (
              <p className="other_practice">Other practice</p>
            )}

            <button
              type="button"
              className={
                open === section.id
                  ? `section_btn ${section.id}_btn open_section`
                  : `section_btn ${section.id}_btn`
              }
              onClick={() => toggleSection(section.id)}
            >
              <span className="section_left">
                <span className={`${section.id}_icon`}>
  <i className={section.icon}></i>
</span>
                <span>{section.label}</span>
              </span>
              <span className="section_arrow">
                {open === section.id ? "⌃" : "›"}
              </span>
            </button>

            {open === section.id && (
              <div className="dropdown_list">
                {section.items.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={
                      activeItem === item
                        ? "dropdown_item active_item"
                        : "dropdown_item"
                    }
                    onClick={() => setActiveItem(item)}
                  >
                    <span>{item}</span>
                    <span className="item_arrow">⌄</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

    </aside>
  );
}

export default Sidebar;
