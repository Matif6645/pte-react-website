import { useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import ReadingHome from "./components/ReadingHome";
import ReadingPractice from "./components/ReadingPractice";
import ReorderParagraphs from "./components/ReorderParagraph"
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
    if (practiceId === "fill-blanks-dropdown") {
      if (category) setInitialCategory(category);
      setActiveView("fill-blanks-dropdown");
      setActiveItem("Fill in the Blanks (Dropdown)");
    }
  }

  function handleSidebarItem(item) {
    setActiveItem(item);

    if (item === "Fill in the Blanks (Dropdown)") {
      setActiveView("fill-blanks-dropdown");
      return;
    }

    // Other reading items still go to home for now
    setActiveView("reading-home");
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

        <ReorderParagraphs/>

        {activeView === "fill-blanks-dropdown" ? (
          <ReadingPractice
            onBack={openReadingHome}
            initialCategory={initialCategory}
          />
        ) : (
          <ReadingHome onStartPractice={startPractice} />
        )}
      </main>
    </div>
  );
}

export default App;
