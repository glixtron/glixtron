import { useState, useCallback } from "react";
import "@/App.css";
import Landing from "./pages/Landing";
import ChatPage from "./pages/ChatPage";
import JobSearch from "./pages/JobSearch";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import RoadmapGenerator from "./pages/RoadmapGenerator";
import GlixPassport from "./pages/GlixPassport";

function App() {
  const [page, setPage] = useState("landing");
  const [chatPrompt, setChatPrompt] = useState(null);

  const handleNavigate = useCallback((target, prompt = null) => {
    if (target === "chat" && prompt) {
      setChatPrompt(prompt);
    } else {
      setChatPrompt(null);
    }
    setPage(target);
  }, []);

  return (
    <div className="dark">
      {page === "landing" && <Landing onNavigate={handleNavigate} />}
      {page === "chat" && (
        <ChatPage onNavigate={handleNavigate} initialPrompt={chatPrompt} />
      )}
      {page === "jobs" && <JobSearch onNavigate={handleNavigate} />}
      {page === "resume" && <ResumeAnalyzer onNavigate={handleNavigate} />}
      {page === "roadmap" && <RoadmapGenerator onNavigate={handleNavigate} />}
      {page === "passport" && <GlixPassport onNavigate={handleNavigate} />}
    </div>
  );
}

export default App;
