import { useState, useEffect } from "react";

export default function App() {
  const defaultLibrary = [
    { category: "Smalltalk", text: "Wie war dein Tag heute?" },
    { category: "Smalltalk", text: "Was hast du zuletzt gegessen?" },
    {
      category: "Interessen & Persönliches",
      text: "Was begeistert dich wirklich?",
    },
    {
      category: "Interessen & Persönliches",
      text: "Was macht dich besonders?",
    },
    { category: "Zukunft", text: "Wo siehst du dich in 5 Jahren?" },
    { category: "Zukunft", text: "Was willst du noch erleben?" },
    { category: "Lustig", text: "Was ist dein peinlichstes Erlebnis?" },
    { category: "Lustig", text: "Wenn du ein Tier wärst..." },
    { category: "Intimes", text: "Was findest du anziehend?" },
    { category: "Intimes", text: "Wie zeigst du Zuneigung?" },
    { category: "Tiefgründig", text: "Was bedeutet Liebe für dich?" },
    { category: "Tiefgründig", text: "Glaubst du an Schicksal?" },
    {
      category: "Würdest du lieber..?",
      text: "Würdest du lieber für immer flüstern oder schreien?",
    },
    {
      category: "Würdest du lieber..?",
      text: "Würdest du lieber reich oder glücklich sein?",
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
  const [darkMode, setDarkMode] = useState(false);
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
  const [searchTerm, setSearchTerm] = useState("");
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "dark"
  );

  useEffect(() => {
    localStorage.setItem("questions", JSON.stringify(questions));
    localStorage.setItem("matches", JSON.stringify(matches));
    localStorage.setItem("answers", JSON.stringify(answers));
    localStorage.setItem("favorites", JSON.stringify(favorites));
    localStorage.setItem("notes", JSON.stringify(notes));
    localStorage.setItem("log", JSON.stringify(log));
    localStorage.setItem("theme", theme);
  }, [questions, matches, answers, favorites, notes, log, theme]);

  const themeStyles = {
    dark: {
      backgroundColor: "#121212",
      color: "#eee",
      fontFamily: "Arial",
    },
    light: {
      backgroundColor: "#fdfdfd",
      color: "#222",
      fontFamily: "Verdana",
    },
    romantic: {
      backgroundColor: "#fff0f6",
      color: "#880e4f",
      fontFamily: "'Comic Sans MS', cursive",
    },
  };
  const handleAsk = (q, matchName) => {
    const timestamp = new Date().toLocaleString();
    const newQ = { ...q, askedTo: [...(q.askedTo || []), matchName] };
    setQuestions((prev) => [...prev, newQ]);
    setLog([
      ...log,
      {
        to: matchName,
        question: q.text,
        category: q.category || "Unbekannt",
        time: timestamp,
      },
    ]);
    setActiveAnswerMatch(matchName);
    setTab("antworten");
  };

  const handleAddCustomQuestion = () => {
    if (newQuestion.trim()) {
      setQuestionLibrary((prev) => [
        ...prev,
        { category: "Eigene Fragen", text: newQuestion.trim() },
      ]);
      setNewQuestion("");
      alert("Frage gespeichert unter Eigene Fragen!");
    }
  };

  const toggleFavorite = (questionText) => {
    if (favorites.includes(questionText)) {
      setFavorites(favorites.filter((q) => q !== questionText));
    } else {
      setFavorites([...favorites, questionText]);
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
    <div style={{ ...themeStyles[theme], padding: 20, minHeight: "100vh" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        <h1>Ask Save</h1>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <select onChange={(e) => setTheme(e.target.value)} value={theme}>
            <option value="dark">🖤 Dark</option>
            <option value="light">☀️ Light</option>
            <option value="romantic">💖 Romantic</option>
          </select>
          <button onClick={exportData}>⬇ Backup</button>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          margin: "20px 0",
        }}
      >
        <button onClick={() => setTab("fragen")}>Fragen</button>
        <button onClick={() => setTab("antworten")}>Antworten</button>
        <button onClick={() => setTab("matches")}>Matches</button>
        <button onClick={() => setTab("verlauf")}>Verlauf</button>
        <button onClick={() => setTab("favoriten")}>Favoriten</button>
        <button onClick={() => setTab("analyse")}>Analyse</button>
      </div>
      {tab === "fragen" && (
        <>
          <h2>Fragen stellen</h2>
          <select
            onChange={(e) => setSelectedCategory(e.target.value)}
            value={selectedCategory}
          >
            <option value="">Kategorie wählen</option>
            {[
              ...new Set([
                ...questionLibrary.map((q) => q.category),
                "Eigene Fragen",
              ]),
            ].map((cat, i) => (
              <option key={i} value={cat}>
                {cat}
              </option>
            ))}
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

          <h3>Eigene Frage</h3>
          <input
            placeholder="Frage eingeben"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            style={{ width: "100%", padding: "6px", margin: "10px 0" }}
          />
          <button onClick={handleAddCustomQuestion}>➕ Hinzufügen</button>
        </>
      )}

      {tab === "antworten" && (
        <>
          <h2>Antworten</h2>
          <input
            placeholder="Frage durchsuchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: "100%", padding: "6px", marginBottom: "10px" }}
          />
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              marginBottom: 10,
            }}
          >
            {matches
              .filter(
                (m) =>
                  !searchTerm ||
                  Object.keys(answers[m] || {}).some((q) =>
                    q.toLowerCase().includes(searchTerm.toLowerCase())
                  )
              )
              .map((m, i) => (
                <button key={i} onClick={() => setActiveAnswerMatch(m)}>
                  {m}
                </button>
              ))}
          </div>

          {activeAnswerMatch && (
            <>
              <h3>Antworten für {activeAnswerMatch}</h3>
              {questions
                .filter((q) => q.askedTo?.includes(activeAnswerMatch))
                .map((q, idx) => (
                  <div key={idx}>
                    <p>
                      <strong>{q.text}</strong>
                      <button
                        onClick={() => toggleFavorite(q.text)}
                        style={{ marginLeft: 10 }}
                      >
                        {favorites.includes(q.text) ? "⭐" : "☆"}
                      </button>
                    </p>
                    <textarea
                      rows={2}
                      style={{ width: "100%" }}
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
        </>
      )}
      {tab === "matches" && (
        <>
          <h2>Matches</h2>
          {matches.map((m, i) => (
            <div key={i} style={{ marginBottom: "10px" }}>
              <strong>{m}</strong>
              <textarea
                placeholder="Notizen..."
                value={notes[m] || ""}
                onChange={(e) =>
                  setNotes((prev) => ({ ...prev, [m]: e.target.value }))
                }
                style={{ display: "block", width: "100%", marginTop: "5px" }}
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
              <div key={i} style={{ fontSize: "14px", marginBottom: "6px" }}>
                <strong>{entry.to}</strong> → {entry.question}{" "}
                <em>({entry.category})</em>
                <br />
                <span style={{ color: "#999" }}>{entry.time}</span>
                <hr style={{ margin: "4px 0" }} />
              </div>
            ))}
        </>
      )}

      {tab === "favoriten" && (
        <>
          <h2>⭐ Favoriten</h2>
          {favorites.map((f, i) => (
            <div key={i} style={{ marginBottom: "10px" }}>
              <span>{f}</span>
              <button
                onClick={() => toggleFavorite(f)}
                style={{ marginLeft: 10 }}
              >
                🗑 Entfernen
              </button>
            </div>
          ))}
        </>
      )}

      {tab === "analyse" && (
        <>
          <h2>📊 Analyse</h2>
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
