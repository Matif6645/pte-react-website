import { useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import ReadingHome from "./components/ReadingHome";
import ReadingPractice from "./components/FillInTheBlanksDropdown";
import ReorderParagraphs from "./components/ReorderParagraphs";
import MultipleChoice from "./components/MultipleChoiceMultipleAnswer";
import "./App.css";

function App() {
  const [activeView, setActiveView] = useState("reading-home");
  const [activeItem, setActiveItem] = useState("");
  const [initialCategory, setInitialCategory] = useState(
    "SCIENCE & TECHNOLOGY"
  );

  function openReadingHome() {
    setActiveView("reading-home");
    setActiveItem("");
  }

  function startPractice(practiceId, category) {
    if (category) setInitialCategory(category);

    if (practiceId === "fill-blanks-dropdown") {
      setActiveView("fill-blanks-dropdown");
      setActiveItem("Fill in the Blanks (Dropdown)");
      return;
    }

    if (practiceId === "reorder-paragraphs") {
      setActiveView("reorder-paragraphs");
      setActiveItem("Reorder Paragraphs");
      return;
    }

    if (practiceId === "mcq-multiple") {
      setActiveView("mcq-multiple");
      setActiveItem("Multiple Choice (Multiple Answers)");
    }
  }

  function handleSidebarItem(item) {
    setActiveItem(item);

    if (item === "Fill in the Blanks (Dropdown)") {
      setActiveView("fill-blanks-dropdown");
      return;
    }

    if (item === "Reorder Paragraphs") {
      setActiveView("reorder-paragraphs");
      return;
    }

    if (item === "Multiple Choice (Multiple Answers)") {
      setActiveView("mcq-multiple");
      return;
    }

    setActiveView("reading-home");
  }

  function renderMain() {
    if (activeView === "fill-blanks-dropdown") {
      return (
        <ReadingPractice
          onBack={openReadingHome}
          initialCategory={initialCategory}
        />
      );
    }

    if (activeView === "reorder-paragraphs") {
      return (
        <ReorderParagraphs
          onBack={openReadingHome}
          initialCategory={initialCategory}
        />
      );
    }

    if (activeView === "mcq-multiple") {
      return (
        <MultipleChoice
          onBack={openReadingHome}
          initialCategory={initialCategory}
        />
      );
    }

    return <ReadingHome onStartPractice={startPractice} />;
  }

  return (
    <div className="desktop_grid">
      <Header />

      <main className="practice_section_grid">
        <Sidebar
          activeItem={activeItem}
          onSelectItem={handleSidebarItem}
          onOpenReadingHome={openReadingHome}
        />

        {renderMain()}
      </main>
    </div>
  );
}

export default App;
