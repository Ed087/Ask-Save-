
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

  const handleAsk = (q, matchName) => {
    const timestamp = new Date().toLocaleString();
    setQuestions((prev) => {
      const updated = [...prev];
      const index = updated.findIndex((x) => x.text === q.text);
      if (!updated[index].askedTo?.includes(matchName)) {
        updated[index].askedTo = [...(updated[index].askedTo || []), matchName];
      }
      return updated;
    });
    setLog([...log, { to: matchName, question: q.text, category: q.category, time: timestamp }]);
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

      {tab === "fragen" && (
        <>
          <h2>Frage stellen</h2>
          <select onChange={(e) => setSelectedCategory(e.target.value)} value={selectedCategory}>
            <option value="">-- Kategorie wählen --</option>
            {[...new Set(questionLibrary.map(q => q.category))].map((cat, idx) => (
              <option key={idx} value={cat}>{cat}</option>
            ))}
          </select>
          {selectedCategory && (
            <select onChange={(e) => setNewQuestion(e.target.value)} value={newQuestion}>
              <option value="">-- Frage auswählen --</option>
              {questionLibrary
                .filter(q => q.category === selectedCategory)
                .map((q, idx) => (
                  <option key={idx} value={q.text}>{q.text}</option>
                ))}
            </select>
          )}
          {newQuestion && (
            <div style={{ marginTop: 10 }}>
              <select value={selectedMatch} onChange={(e) => setSelectedMatch(e.target.value)}>
                <option value="">An wen?</option>
                {matches.map((m, i) => (
                  <option key={i} value={m}>{m}</option>
                ))}
              </select>
              <button
                onClick={() =>
                  handleAsk(
                    questionLibrary.find(q => q.text === newQuestion),
                    selectedMatch
                  )
                }
                disabled={!selectedMatch}
              >
                Frage stellen
              </button>
            </div>
          )}
        </>
      )}

      {tab === "antworten" && activeAnswerMatch && (
        <>
          <h2>Antworten für {activeAnswerMatch}</h2>
          {questions.filter(q => q.askedTo?.includes(activeAnswerMatch)).map((q, idx) => (
            <div key={idx} style={{ marginBottom: 10 }}>
              <p><strong>{q.text}</strong></p>
              <textarea
                rows={2}
                value={answers[activeAnswerMatch]?.[q.text] || ""}
                onChange={(e) => handleAnswerChange(activeAnswerMatch, q.text, e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
          ))}
        </>
      )}

      {tab === "matches" && (
        <>
          <h2>Matches</h2>
          {matches.map((m, idx) => (
            <div key={idx} style={{ marginBottom: 10 }}>
              <strong>{m}</strong>
              <button onClick={() => setMatches(matches.filter(name => name !== m))} style={{ marginLeft: 10 }}>❌</button>
              <br />
              <textarea
                placeholder="Notizen..."
                rows={2}
                style={{ width: '100%' }}
                value={notes[m] || ""}
                onChange={(e) => handleNoteChange(m, e.target.value)}
              />
            </div>
          ))}
          <input
            placeholder="Neuer Match"
            value={newMatch}
            onChange={(e) => setNewMatch(e.target.value)}
          />
          <button onClick={() => {
            if (newMatch && !matches.includes(newMatch)) {
              setMatches([...matches, newMatch]);
              setNewMatch("");
            }
          }}>Hinzufügen</button>
        </>
      )}

      {tab === "verlauf" && (
        <>
          <h2>Verlauf</h2>
          {log.slice().reverse().map((entry, idx) => (
            <div key={idx} style={{ marginBottom: 10 }}>
              <p>🕒 {entry.time}</p>
              <p>👤 <strong>{entry.to}</strong></p>
              <p>📂 [{entry.category}]</p>
              <p>❓ {entry.question}</p>
              <hr />
            </div>
          ))}
        </>
      )}
    </div>
  );
}
