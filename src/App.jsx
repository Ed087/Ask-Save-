import { useState, useEffect } from "react";

const [selectedCategory, setSelectedCategory] = useState("");

export default function App() {
  const defaultLibrary = [
    { category: "Tiefgründig", text: "Was bedeutet Glück für dich?" },
    {
      category: "Tiefgründig",
      text: "Wofür bist du in deinem Leben am meisten dankbar?",
    },
    {
      category: "Tiefgründig",
      text: "Was war der schwierigste Moment deines Lebens?",
    },
    { category: "Locker", text: "Was ist dein Lieblingsfilm?" },
    { category: "Locker", text: "Berge oder Strand?" },
    {
      category: "Fun",
      text: "Wenn du ein Tier sein könntest, welches wärst du?",
    },
    {
      category: "Fun",
      text: "Würdest du lieber fliegen oder Gedanken lesen können?",
    },
    {
      category: "18+ Harmlos",
      text: "Magst du es, beim Küssen festgehalten zu werden?",
    },
    { category: "18+ Direkt", text: "Was ist dein größter sexueller Wunsch?" },
    {
      category: "18+ Schlüpfrig",
      text: "Hattest du schon mal Sex an einem ungewöhnlichen Ort?",
    },
    // ... weitere 40+ Fragen möglich
  ];

  const [questionLibrary] = useState(defaultLibrary);
  const [questions, setQuestions] = useState(() => {
    const saved = localStorage.getItem("questions");
    return saved ? JSON.parse(saved) : [];
  });

  const [answers, setAnswers] = useState(() => {
    const saved = localStorage.getItem("answers");
    return saved ? JSON.parse(saved) : {};
  });

  const [matches, setMatches] = useState(() => {
    const saved = localStorage.getItem("matches");
    return saved ? JSON.parse(saved) : ["Lisa", "Anna"];
  });

  const [selectedMatch, setSelectedMatch] = useState("");
  const [newMatch, setNewMatch] = useState("");
  const [newQuestion, setNewQuestion] = useState("");
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });

  const [tab, setTab] = useState("fragen");
  const [activeAnswerMatch, setActiveAnswerMatch] = useState("");

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("questions", JSON.stringify(questions));
    localStorage.setItem("matches", JSON.stringify(matches));
    localStorage.setItem("answers", JSON.stringify(answers));
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [questions, matches, answers, darkMode]);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert("Frage kopiert!");
  };

  const handleAsk = (questionIndex, matchName) => {
    setQuestions((prev) => {
      const updated = [...prev];
      const question = updated[questionIndex];
      if (!question.askedTo) question.askedTo = [];
      if (!question.askedTo.includes(matchName)) {
        question.askedTo.push(matchName);
      }
      return updated;
    });
    setActiveAnswerMatch(matchName);
    setTab("antworten");
  };

  const handleAddQuestion = () => {
    if (newQuestion.trim()) {
      setQuestions([
        ...questions,
        { category: "Benutzer", text: newQuestion, askedTo: [] },
      ]);
      setNewQuestion("");
    }
  };

  const handleAddMatch = () => {
    if (newMatch.trim() && !matches.includes(newMatch)) {
      setMatches([...matches, newMatch]);
      setNewMatch("");
    }
  };

  const handleRemoveMatch = (name) => {
    setMatches(matches.filter((m) => m !== name));
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

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "800px",
        margin: "0 auto",
        fontFamily: "Arial",
        backgroundColor: darkMode ? "#121212" : "#fff",
        color: darkMode ? "#eee" : "#000",
        minHeight: "100vh",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>Ask Save!</h1>
        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "🌞 Hell" : "🌙 Dunkel"}
        </button>
      </div>

      <div style={{ display: "flex", gap: "10px", margin: "20px 0" }}>
        <button onClick={() => setTab("fragen")}>Fragen</button>
        <button onClick={() => setTab("antworten")}>Antworten</button>
        <button onClick={() => setTab("matches")}>Matches</button>
      </div>

      {tab === "fragen" && (
        <>
          <h2>Fragen</h2>
          {questions.map((q, idx) => (
            <div
              key={idx}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                marginBottom: "10px",
                borderRadius: "6px",
              }}
            >
              <p>
                <strong>[{q.category}]</strong> {q.text}
              </p>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <button onClick={() => handleCopy(q.text)}>Kopieren</button>
                <select
                  value={selectedMatch}
                  onChange={(e) => setSelectedMatch(e.target.value)}
                >
                  <option value="">An wen?</option>
                  {matches.map((m, i) => (
                    <option key={i} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => handleAsk(idx, selectedMatch)}
                  disabled={!selectedMatch}
                >
                  Markieren & Antworten
                </button>
              </div>
              <p
                style={{
                  fontSize: "12px",
                  color: darkMode ? "#aaa" : "#666",
                  marginTop: "6px",
                }}
              >
                Schon gestellt an: {q.askedTo?.join(", ") || "Niemanden"}
              </p>
            </div>
          ))}

          <div style={{ marginTop: "20px" }}>
            <input
              type="text"
              placeholder="Neue Frage eingeben"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              style={{ padding: "8px", width: "70%", marginRight: "10px" }}
            />
            <button onClick={handleAddQuestion}>Frage hinzufügen</button>
          </div>

          <h3 style={{ marginTop: "30px" }}>Fragen-Bibliothek (Dropdown)</h3>

          <div style={{ marginBottom: "10px" }}>
            <label>Kategorie wählen: </label>
            <select
              onChange={(e) => setSelectedCategory(e.target.value)}
              value={selectedCategory}
              style={{ padding: "6px", marginLeft: "10px" }}
            >
              <option value="">-- Kategorie --</option>
              {[...new Set(questionLibrary.map((q) => q.category))].map(
                (cat, idx) => (
                  <option key={idx} value={cat}>
                    {cat}
                  </option>
                )
              )}
            </select>
          </div>

          {selectedCategory && (
            <div style={{ marginBottom: "10px" }}>
              <label>Frage auswählen: </label>
              <select
                onChange={(e) => {
                  const selected = questionLibrary.find(
                    (q) => q.text === e.target.value
                  );
                  if (selected) setNewQuestion(selected.text);
                }}
                style={{ padding: "6px", marginLeft: "10px", width: "60%" }}
              >
                <option value="">-- Frage --</option>
                {questionLibrary
                  .filter((q) => q.category === selectedCategory)
                  .map((q, idx) => (
                    <option key={idx} value={q.text}>
                      {q.text}
                    </option>
                  ))}
              </select>
            </div>
          )}
        </>
      )}

      {tab === "antworten" && (
        <>
          <h2>Antworten</h2>
          <div>
            <label>Match auswählen: </label>
            <select
              value={activeAnswerMatch}
              onChange={(e) => setActiveAnswerMatch(e.target.value)}
            >
              <option value="">---</option>
              {matches.map((m, i) => (
                <option key={i} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {activeAnswerMatch &&
            questions
              .filter((q) => q.askedTo?.includes(activeAnswerMatch))
              .map((q, idx) => (
                <div key={idx} style={{ marginTop: "15px" }}>
                  <p>
                    <strong>{q.text}</strong>
                  </p>
                  <textarea
                    rows={3}
                    placeholder="Antwort eingeben..."
                    value={answers?.[activeAnswerMatch]?.[q.text] || ""}
                    onChange={(e) =>
                      handleAnswerChange(
                        activeAnswerMatch,
                        q.text,
                        e.target.value
                      )
                    }
                    style={{ width: "100%", padding: "8px" }}
                  />
                </div>
              ))}
        </>
      )}

      {tab === "matches" && (
        <>
          <h2>Matches</h2>
          <ul>
            {matches.map((m, i) => (
              <li key={i} style={{ marginBottom: "6px" }}>
                {m}{" "}
                <button
                  onClick={() => handleRemoveMatch(m)}
                  style={{ marginLeft: "10px", color: "red" }}
                >
                  Entfernen
                </button>
              </li>
            ))}
          </ul>
          <div style={{ marginTop: "10px" }}>
            <input
              type="text"
              placeholder="Neuer Name"
              value={newMatch}
              onChange={(e) => setNewMatch(e.target.value)}
              style={{ padding: "6px", marginRight: "10px" }}
            />
            <button onClick={handleAddMatch}>Match hinzufügen</button>
          </div>
        </>
      )}
    </div>
  );
}
