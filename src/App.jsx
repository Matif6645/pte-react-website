import { useEffect, useState } from "react";
import Header from "./components/Header";
import StudentSignup from "./student/StudentSignup";
import Sidebar from "./components/Sidebar";
import ReadAloud from "./components/Speaking/ReadAloud";
import ReadingHome from "./components/Reading/ReadingHome";
import FillInTheBlanksDropdown from "./components/Reading/FillInTheBlanksDropdown";
import ReorderParagraphs from "./components/Reading/ReorderParagraphs";
import MultipleChoiceMultipleAnswer from "./components/Reading/MultipleChoiceMultipleAnswer";
import FillInTheBlankDragDrop from "./components/Reading/FillInTheBlankDragDrop";
import MultipleChoiceSingleAnswer from "./components/Reading/MultipleChoiceSingleAnswer";
import SummarizeSpokenText from "./components/listening/SummarizeSpokenText";
import ListeningMcqMultiple from "./components/listening/ListeningMcqMultiple";
import ListeningFillBlanks from "./components/listening/ListeningFillBlanks";
import HighlightCorrectSummary from "./components/listening/HighlightCorrectSummary";
import ListeningMcqSingle from "./components/listening/ListeningMcqSingle";
import SelectMissingWord from "./components/listening/SelectMissingWord";
import HighlightIncorrectWords from "./components/listening/HighlightIncorrectWords";
import WriteFromDictation from "./components/listening/WritefromDictation";
import WriteEssay from "./components/writing/Essay";
import SummarizeWrittenText from "./components/writing/SummarizeWrittenText";
import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";
import StudentDashboard from "./student/StudentDashboard";
import { supabase } from "./admin/supabaseClient";
import ResetPassword from "./student/ResetPassword";

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
  "Summarize Written Text": "summarize-written-text",
  "Write Essay": "write-essay",
};
const SPEAKING_VIEWS = {
  "Read Aloud": "speaking-read-aloud",
};

function App() {
  const [authUser, setAuthUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeView, setActiveView] = useState("reading-home");
  const [activeItem, setActiveItem] = useState("");
  const [initialCategory, setInitialCategory] = useState(
    "SCIENCE & TECHNOLOGY",
  );

  function openReadingHome() {
    setActiveView("reading-home");
    setActiveItem("");
  }

  useEffect(() => {
    let active = true;

    async function loadUser(user) {
      if (!active) return;

      if (!user) {
        setAuthUser(null);
        setUserRole(null);
        setAuthLoading(false);
        return;
      }

      setAuthLoading(true);

      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!active) return;

      setAuthUser(user);
      setUserRole(error ? null : (data?.role ?? "student"));
      setAuthLoading(false);
    }

    supabase.auth.getUser().then(({ data, error }) => {
      loadUser(error ? null : data.user);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setActiveView("reset-password");
      }

      if (event === "SIGNED_OUT") {
        loadUser(null);
        setActiveView((current) =>
          current === "reset-password" ? current : "reading-home",
        );
      }
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  function openStudentSignup() {
    setActiveView("student-signup");
  }

  function openAdminLogin() {
    if (authUser && userRole === "admin") {
      setActiveView("admin-dashboard");
    } else if (authUser && userRole === "student") {
      setActiveView("student-dashboard");
    } else {
      setActiveView("admin-login");
    }
  }

  async function handleAdminLoginSuccess(role) {
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) {
      setActiveView("admin-login");
      return;
    }

    setAuthUser(data.user);
    setUserRole(role);

    if (role === "admin") {
      setActiveView("admin-dashboard");
    } else {
      setActiveView("student-dashboard");
    }
  }

  async function handleAdminLogout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Logout failed:", error.message);
      return;
    }

    setAuthUser(null);
    setUserRole(null);
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
    if (SPEAKING_VIEWS[item]) {
      setActiveView(SPEAKING_VIEWS[item]);
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
    if (activeView === "summarize-written-text") {
      return (
        <SummarizeWrittenText
          onBack={openReadingHome}
          initialCategory={initialCategory}
        />
      );
    }
    if (activeView === "write-essay") {
      return (
        <WriteEssay
          onBack={openReadingHome}
          initialCategory={initialCategory}
        />
      );
    }
    if (activeView === "speaking-read-aloud") {
      return <ReadAloud onBack={openReadingHome} />;
    }

    return <ReadingHome onStartPractice={startPractice} />;
  }
  if (authLoading) {
    return <p style={{ padding: "30px" }}>Loading...</p>;
  }
  if (activeView === "reset-password") {
    return <ResetPassword onSuccess={() => setActiveView("admin-login")} />;
  }

  if (activeView === "student-signup") {
    return (
      <StudentSignup
        onBackToSite={openReadingHome}
        onSignupSuccess={openReadingHome}
      />
    );
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
    if (!authUser || userRole !== "admin") {
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

  if (activeView === "student-dashboard") {
    if (!authUser || userRole !== "student") {
      return (
        <AdminLogin
          onLoginSuccess={handleAdminLoginSuccess}
          onBackToSite={openReadingHome}
        />
      );
    }

    return (
      <StudentDashboard
        onLogout={handleAdminLogout}
        onStartPractice={openReadingHome}
      />
    );
  }

  return (
    <div className="desktop_grid">
      <Header onLoginClick={openAdminLogin} onSignupClick={openStudentSignup} />

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
