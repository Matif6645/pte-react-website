
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import ReadingPractice from "./components/ReadingPractice";

import "./App.css";

function App() {
  return (
    <div className="desktop_grid">

      <Header />

      <main className="practice_section_grid">

        <Sidebar />

        <ReadingPractice />

      </main>

    </div>
  );
}

export default App;