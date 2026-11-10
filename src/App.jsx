import { useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import ReadingHome from "./components/ReadingHome";
import FillInTheBlanksDropdown from "./components/FillInTheBlanksDropdown";
import ReorderParagraphs from "./components/ReorderParagraphs";
import MultipleChoiceMultipleAnswer from "./components/MultipleChoiceMultipleAnswer";
import FillInTheBlankDragDrop from "./components/FillInTheBlankDragDrop";
import MultipleChoiceSingleAnswer from "./components/MultipleChoiceSingleAnswer";
import SummarizeSpokenText from "./components/listening/SummarizeSpokenText";
import ListeningMcqMultiple from "./components/listening/ListeningMcqMultiple";
import ListeningFillBlanks from "./components/listening/ListeningFillBlanks";
import HighlightCorrectSummary from "./components/listening/HighlightCorrectSummary";
import ListeningMcqSingle from "./components/listening/ListeningMcqSingle";
import SelectMissingWord from "./components/listening/SelectMissingWord";
import HighlightIncorrectWords from "./components/listening/HighlightIncorrectWords";
import WriteFromDictation from "./components/listening/WritefromDictation";
import WriteEssay from "./components/writing/Essay";
import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";
import { isAdminLoggedIn, logout } from "./admin/auth";
import "./App.css";

const LISTENING_VIEWS = {
  "Summarize Spoken Text": "listening-sst",
  "Multiple Choice (Multiple)": "listening-mcq-multiple",
  "Fill in the Blanks": "listening-fib",
  "Highlight Correct Summary": "listening-hcs",
  "Multiple Choice (Single)": "listening-mcq-single",
  "Select Missing Word": "listening-smw",
  "Highlight Incorrect Words": "listening-hiw",
  "Write from Dictation": "listening-wfd",
};

const WRITING_VIEWS = {
  "Write Essay": "write-essay",
};

function App() {
  const [activeView, setActiveView] = useState("reading-home");
  const [activeItem, setActiveItem] = useState("");
  const [initialCategory, setInitialCategory] = useState(
    "SCIENCE & TECHNOLOGY",
  );

  function openReadingHome() {
    setActiveView("reading-home");
    setActiveItem("");
  }

  function openAdminLogin() {
    if (isAdminLoggedIn()) {
      setActiveView("admin-dashboard");
      return;
    }
    setActiveView("admin-login");
  }

  function handleAdminLoginSuccess() {
    setActiveView("admin-dashboard");
  }

  function handleAdminLogout() {
    logout();
    setActiveView("admin-login");
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
      return;
    }

    if (practiceId === "fill-blanks-drag") {
      setActiveView("fill-blanks-drag");
      setActiveItem("Fill in the Blanks (Drag and Drop)");
      return;
    }

    if (practiceId === "mcq-single") {
      setActiveView("mcq-single");
      setActiveItem("Multiple Choice (Single Answer)");
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

    if (item === "Fill in the Blanks (Drag and Drop)") {
      setActiveView("fill-blanks-drag");
      return;
    }

    if (item === "Multiple Choice (Single Answer)") {
      setActiveView("mcq-single");
      return;
    }

    if (LISTENING_VIEWS[item]) {
      setActiveView(LISTENING_VIEWS[item]);
      return;
    }

    if (WRITING_VIEWS[item]) {
      setActiveView(WRITING_VIEWS[item]);
      return;
    }

    setActiveView("reading-home");
  }

  function renderMain() {
    if (activeView === "fill-blanks-dropdown") {
      return (
        <FillInTheBlanksDropdown
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
        <MultipleChoiceMultipleAnswer
          onBack={openReadingHome}
          initialCategory={initialCategory}
        />
      );
    }

    if (activeView === "fill-blanks-drag") {
      return (
        <FillInTheBlankDragDrop
          onBack={openReadingHome}
          initialCategory={initialCategory}
        />
      );
    }

    if (activeView === "mcq-single") {
      return (
        <MultipleChoiceSingleAnswer
          onBack={openReadingHome}
          initialCategory={initialCategory}
        />
      );
    }

    if (activeView === "listening-sst") {
      return <SummarizeSpokenText onBack={openReadingHome} />;
    }
    if (activeView === "listening-mcq-multiple") {
      return <ListeningMcqMultiple onBack={openReadingHome} />;
    }
    if (activeView === "listening-fib") {
      return <ListeningFillBlanks onBack={openReadingHome} />;
    }
    if (activeView === "listening-hcs") {
      return <HighlightCorrectSummary onBack={openReadingHome} />;
    }
    if (activeView === "listening-mcq-single") {
      return <ListeningMcqSingle onBack={openReadingHome} />;
    }
    if (activeView === "listening-smw") {
      return <SelectMissingWord onBack={openReadingHome} />;
    }
    if (activeView === "listening-hiw") {
      return <HighlightIncorrectWords onBack={openReadingHome} />;
    }
    if (activeView === "listening-wfd") {
      return <WriteFromDictation onBack={openReadingHome} />;
    }
    if (activeView === "write-essay") {
      return (
        <WriteEssay
          onBack={openReadingHome}
          initialCategory={initialCategory}
        />
      );
    }

    return <ReadingHome onStartPractice={startPractice} />;
  }

  if (activeView === "admin-login") {
    return (
      <AdminLogin
        onLoginSuccess={handleAdminLoginSuccess}
        onBackToSite={openReadingHome}
      />
    );
  }

  if (activeView === "admin-dashboard") {
    if (!isAdminLoggedIn()) {
      return (
        <AdminLogin
          onLoginSuccess={handleAdminLoginSuccess}
          onBackToSite={openReadingHome}
        />
      );
    }

    return (
      <AdminDashboard
        onLogout={handleAdminLogout}
        onBackToSite={openReadingHome}
      />
    );
  }

  return (
    <div className="desktop_grid">
      <Header onLoginClick={openAdminLogin} />

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
