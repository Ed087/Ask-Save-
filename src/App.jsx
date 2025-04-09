import { useState, useEffect } from "react";

export default function App() {
  const defaultLibrary = [
    { category: "Tiefgründig", text: "Was bedeutet Glück für dich?" },
    { category: "Locker", text: "Was ist dein Lieblingsfilm?" },
    { category: "18+ Direkt", text: "Was ist dein größter sexueller Wunsch?" },
    { category: "18+ Schlüpfrig", text: "Hattest du schon mal Sex an einem ungewöhnlichen Ort?" }
  ];

  const [questionLibrary] = useState(defaultLibrary);
  const [questions, setQuestions] = useState(() => JSON.parse(localStorage.getItem("questions")) || []);
  const [answers, setAnswers] = useState(() => JSON.parse(localStorage.getItem("answers")) || {});
  const [matches, setMatches] = useState(() => JSON.parse(localStorage.getItem("matches")) || ["Lisa"]);
  const [selectedMatch, setSelectedMatch] = useState("");
  const [newMatch, setNewMatch] = useState("");
  const [newQuestion, setNewQuestion] = useState("");
  const [darkMode, setDarkMode] = useState(() => JSON.parse(localStorage.getItem("darkMode")) || false);
  const [tab, setTab] = useState("fragen");
  const [activeAnswerMatch, setActiveAnswerMatch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem("favorites")) || []);
  const [notes, setNotes] = useState(() => JSON.parse(localStorage.getItem("notes")) || {});
  const [log, setLog] = useState(() => JSON.parse(localStorage.getItem("log")) || []);

  useEffect(() => {
    localStorage.setItem("questions", JSON.stringify(questions));
    localStorage.setItem("matches", JSON.stringify(matches));
    localStorage.setItem("answers", JSON.stringify(answers));
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    localStorage.setItem("favorites", JSON.stringify(favorites));
    localStorage.setItem("notes", JSON.stringify(notes));
    localStorage.setItem("log", JSON.stringify(log));
  }, [questions, matches, answers, darkMode, favorites, notes, log]);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert("Frage kopiert!");
  };

  const handleAsk = (questionIndex, matchName) => {
    const timestamp = new Date().toLocaleString();
    setQuestions((prev) => {
      const updated = [...prev];
      if (!updated[questionIndex].askedTo?.includes(matchName)) {
        updated[questionIndex].askedTo = [...(updated[questionIndex].askedTo || []), matchName];
      }
      return updated;
    });
    setLog([...log, { to: matchName, question: questions[questionIndex].text, time: timestamp }]);
    setActiveAnswerMatch(matchName);
    setTab("antworten");
  };

  const handleAnswerChange = (match, question, value) => {
    setAnswers((prev) => ({
      ...prev,
      [match]: {
        ...prev[match],
        [question]: value,
      },
    }));
  };

  const handleFavoriteToggle = (question) => {
    setFavorites((prev) =>
      prev.includes(question) ? prev.filter((q) => q !== question) : [...prev, question]
    );
  };

  const handleNoteChange = (match, value) => {
    setNotes((prev) => ({
      ...prev,
      [match]: value,
    }));
  };

  const exportData = () => {
    const exportObject = { matches, questions, answers, notes, favorites, log };
    const blob = new Blob([JSON.stringify(exportObject, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ask_save_backup.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{
      backgroundColor: darkMode ? '#121212' : '#fff',
      color: darkMode ? '#eee' : '#000',
      padding: 20,
      fontFamily: 'Arial',
      minHeight: '100vh'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h1>Ask Save</h1>
        <div>
          <button onClick={exportData}>⬇️ Backup</button>
          <button onClick={() => setDarkMode(!darkMode)}>{darkMode ? '🌞' : '🌙'}</button>
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <button onClick={() => setTab("fragen")}>Fragen</button>
        <button onClick={() => setTab("antworten")}>Antworten</button>
        <button onClick={() => setTab("matches")}>Matches</button>
        <button onClick={() => setTab("verlauf")}>Verlauf</button>
      </div>

      {/* Die weiteren UI-Elemente (Fragen, Antworten, Matches, Verlauf) würdest du wie bisher strukturieren.
          Der Code kann beliebig erweitert werden basierend auf dem bisherigen Muster.
          Für die Übersicht wird der Teil hier abgekürzt. */}
    </div>
  );
}
