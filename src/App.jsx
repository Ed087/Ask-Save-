import { useState, useEffect } from "react";

export default function App() {
  const defaultLibrary = [
    { category: "Tiefgründig", text: "Was bedeutet Glück für dich?" },
    { category: "Tiefgründig", text: "Was war dein schwerster Moment?" },
    { category: "Tiefgründig", text: "Glaubst du an Schicksal?" },
    { category: "Locker", text: "Was ist dein Lieblingsfilm?" },
    { category: "Locker", text: "Kaffee oder Tee?" },
    { category: "Locker", text: "Hund oder Katze?" },
    { category: "Fun", text: "Wenn du ein Tier wärst, welches wärst du?" },
    { category: "Fun", text: "Was war dein peinlichster Moment?" },
    { category: "18+ Harmlos", text: "Magst du Überraschungsküsse?" },
    { category: "18+ Direkt", text: "Was turnt dich sofort an?" },
    {
      category: "18+ Schlüpfrig",
      text: "Schon mal von öffentlichem Sex geträumt?",
    },
  ];

  const [questionLibrary, setQuestionLibrary] = useState(defaultLibrary);
  const [questions, setQuestions] = useState(
    () => JSON.parse(localStorage.getItem("questions")) || []
  );
  const [answers, setAnswers] = useState(
    () => JSON.parse(localStorage.getItem("answers")) || {}
  );
  const [matches, setMatches] = useState(
    () => JSON.parse(localStorage.getItem("matches")) || ["Lisa"]
  );
  const [selectedMatch, setSelectedMatch] = useState("");
  const [newMatch, setNewMatch] = useState("");
  const [newQuestion, setNewQuestion] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [darkMode, setDarkMode] = useState(
    () => JSON.parse(localStorage.getItem("darkMode")) || false
  );
  const [tab, setTab] = useState("fragen");
  const [activeAnswerMatch, setActiveAnswerMatch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [favorites, setFavorites] = useState(
    () => JSON.parse(localStorage.getItem("favorites")) || []
  );
  const [notes, setNotes] = useState(
    () => JSON.parse(localStorage.getItem("notes")) || {}
  );
  const [log, setLog] = useState(
    () => JSON.parse(localStorage.getItem("log")) || []
  );

  useEffect(() => {
    localStorage.setItem("questions", JSON.stringify(questions));
    localStorage.setItem("matches", JSON.stringify(matches));
    localStorage.setItem("answers", JSON.stringify(answers));
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    localStorage.setItem("favorites", JSON.stringify(favorites));
    localStorage.setItem("notes", JSON.stringify(notes));
    localStorage.setItem("log", JSON.stringify(log));
  }, [questions, matches, answers, darkMode, favorites, notes, log]);
  const handleAsk = (q, matchName) => {
    const timestamp = new Date().toLocaleString();
    const newQ = { ...q, askedTo: [...(q.askedTo || []), matchName] };
    setQuestions((prev) => [...prev, newQ]);
    setLog([
      ...log,
      {
        to: matchName,
        question: q.text,
        category: q.category,
        time: timestamp,
      },
    ]);
    setActiveAnswerMatch(matchName);
    setTab("antworten");
  };

  const handleAddCustomQuestion = () => {
    if (newQuestion && newCategory) {
      setQuestionLibrary([
        ...questionLibrary,
        { category: newCategory, text: newQuestion },
      ]);
      setNewQuestion("");
      setNewCategory("");
      alert("Frage hinzugefügt!");
    }
  };

  const exportData = () => {
    const data = { matches, questions, answers, favorites, notes, log };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "ask-save-backup.json";
    a.click();
  };

  return (
    <div
      style={{
        backgroundColor: darkMode ? "#121212" : "#fff",
        color: darkMode ? "#eee" : "#000",
        padding: 20,
      }}
    >
      <h1>Ask Save</h1>
      <div>
        <button onClick={() => setTab("fragen")}>Fragen</button>
        <button onClick={() => setTab("antworten")}>Antworten</button>
        <button onClick={() => setTab("matches")}>Matches</button>
        <button onClick={() => setTab("verlauf")}>Verlauf</button>
        <button onClick={() => setTab("favoriten")}>Favoriten</button>
        <button onClick={() => setTab("analyse")}>Analyse</button>
        <button onClick={exportData}>⬇ Backup</button>
        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "🌞" : "🌙"}
        </button>
      </div>
      {tab === "fragen" && (
        <>
          <h2>Fragen stellen</h2>
          <select
            onChange={(e) => setSelectedCategory(e.target.value)}
            value={selectedCategory}
          >
            <option value="">Kategorie wählen</option>
            {[...new Set(questionLibrary.map((q) => q.category))].map(
              (cat, i) => (
                <option key={i} value={cat}>
                  {cat}
                </option>
              )
            )}
          </select>
          <select
            onChange={(e) => setNewQuestion(e.target.value)}
            value={newQuestion}
          >
            <option value="">Frage wählen</option>
            {questionLibrary
              .filter((q) => q.category === selectedCategory)
              .map((q, i) => (
                <option key={i} value={q.text}>
                  {q.text}
                </option>
              ))}
          </select>
          <select
            onChange={(e) => setSelectedMatch(e.target.value)}
            value={selectedMatch}
          >
            <option value="">An wen?</option>
            {matches.map((m, i) => (
              <option key={i} value={m}>
                {m}
              </option>
            ))}
          </select>
          <button
            onClick={() => {
              const q = questionLibrary.find((q) => q.text === newQuestion);
              if (q && selectedMatch) handleAsk(q, selectedMatch);
            }}
          >
            Senden
          </button>

          <h3>Eigene Frage hinzufügen</h3>
          <input
            placeholder="Frage"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
          />
          <input
            placeholder="Kategorie"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <button onClick={handleAddCustomQuestion}>➕ Hinzufügen</button>
        </>
      )}

      {tab === "antworten" && activeAnswerMatch && (
        <>
          <h2>Antworten für {activeAnswerMatch}</h2>
          {questions
            .filter((q) => q.askedTo?.includes(activeAnswerMatch))
            .map((q, i) => (
              <div key={i}>
                <p>
                  <strong>{q.text}</strong>
                </p>
                <textarea
                  rows={2}
                  value={answers[activeAnswerMatch]?.[q.text] || ""}
                  onChange={(e) =>
                    setAnswers((prev) => ({
                      ...prev,
                      [activeAnswerMatch]: {
                        ...prev[activeAnswerMatch],
                        [q.text]: e.target.value,
                      },
                    }))
                  }
                />
              </div>
            ))}
        </>
      )}
      {tab === "matches" && (
        <>
          <h2>Matches</h2>
          {matches.map((m, i) => (
            <div key={i}>
              <strong>{m}</strong>
              <textarea
                placeholder="Notizen..."
                value={notes[m] || ""}
                onChange={(e) =>
                  setNotes((prev) => ({ ...prev, [m]: e.target.value }))
                }
              />
            </div>
          ))}
          <input
            placeholder="Neuer Match"
            value={newMatch}
            onChange={(e) => setNewMatch(e.target.value)}
          />
          <button
            onClick={() => {
              if (newMatch && !matches.includes(newMatch)) {
                setMatches([...matches, newMatch]);
                setNewMatch("");
              }
            }}
          >
            ➕
          </button>
        </>
      )}

      {tab === "verlauf" && (
        <>
          <h2>Verlauf</h2>
          {log
            .slice()
            .reverse()
            .map((entry, i) => (
              <div key={i}>
                <p>
                  <strong>{entry.to}</strong> → {entry.question} (
                  {entry.category})
                </p>
                <p>
                  <small>{entry.time}</small>
                </p>
                <hr />
              </div>
            ))}
        </>
      )}

      {tab === "favoriten" && (
        <>
          <h2>Favoriten</h2>
          {favorites.map((f, i) => (
            <p key={i}>⭐ {f}</p>
          ))}
        </>
      )}

      {tab === "analyse" && (
        <>
          <h2>Analyse</h2>
          {matches.map((m, i) => {
            const gestellt = questions.filter((q) =>
              q.askedTo?.includes(m)
            ).length;
            const beantwortet = Object.keys(answers[m] || {}).length;
            return (
              <div key={i}>
                <p>
                  <strong>{m}</strong>: {gestellt} Fragen gestellt,{" "}
                  {beantwortet} beantwortet
                </p>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}
