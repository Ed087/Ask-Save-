import { useState, useEffect } from "react";

export default function App() {
  const defaultQuestions = [
    { category: "Tiefgründig", text: "Was bedeutet Glück für dich?", askedTo: [] },
    { category: "Locker", text: "Was ist dein Lieblingsessen?", askedTo: [] },
    { category: "18+ Harmlos", text: "Magst du es, geküsst zu werden, wenn du es nicht erwartest?", askedTo: [] },
    { category: "18+ Direkt", text: "Was war dein wildestes Sexerlebnis?", askedTo: [] },
    { category: "18+ Schlüpfrig", text: "Würdest du eher Sex im Freien oder an einem öffentlichen Ort haben?", askedTo: [] }
  ];

  const [questions, setQuestions] = useState(() => {
    const saved = localStorage.getItem("questions");
    return saved ? JSON.parse(saved) : defaultQuestions;
  });

  const [matches, setMatches] = useState(() => {
    const saved = localStorage.getItem("matches");
    return saved ? JSON.parse(saved) : ["Lisa", "Anna"];
  });

  const [selectedMatch, setSelectedMatch] = useState("");
  const [newQuestion, setNewQuestion] = useState("");
  const [newMatch, setNewMatch] = useState("");
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });

  const questionLibrary = [
    { category: "Tiefgründig", text: "Was ist dein größter Traum?" },
    { category: "Locker", text: "Hund oder Katze?" },
    { category: "18+ Harmlos", text: "Hast du schon mal jemanden im Kino geküsst?" },
    { category: "18+ Direkt", text: "Was turnt dich sofort an?" },
    { category: "18+ Schlüpfrig", text: "Wie stehst du zu Rollenspielen im Bett?" }
  ];

  // Save on change
  useEffect(() => {
    localStorage.setItem("questions", JSON.stringify(questions));
  }, [questions]);

  useEffect(() => {
    localStorage.setItem("matches", JSON.stringify(matches));
  }, [matches]);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert("Frage kopiert!");
  };

  const handleAsk = (questionIndex, matchName) => {
    setQuestions(prev => {
      const updated = [...prev];
      if (!updated[questionIndex].askedTo.includes(matchName)) {
        updated[questionIndex].askedTo.push(matchName);
      }
      return updated;
    });
  };

  const handleAddQuestion = () => {
    if (newQuestion.trim()) {
      setQuestions([...questions, { category: "Benutzer", text: newQuestion, askedTo: [] }]);
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
    setMatches(matches.filter(m => m !== name));
  };

  return (
    <div style={{
      padding: "20px",
      maxWidth: "700px",
      margin: "0 auto",
      fontFamily: "Arial",
      backgroundColor: darkMode ? "#121212" : "#fff",
      color: darkMode ? "#eee" : "#000",
      minHeight: "100vh"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>Ask Save!</h1>
        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "🌞 Hell" : "🌙 Dunkel"}
        </button>
      </div>

      <h2 style={{ marginTop: "20px" }}>Fragen</h2>
      {questions.map((q, idx) => (
        <div key={idx} style={{
          border: "1px solid #ccc",
          padding: "10px",
          marginBottom: "10px",
          borderRadius: "6px"
        }}>
          <p><strong>[{q.category}]</strong> {q.text}</p>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button onClick={() => handleCopy(q.text)}>Kopieren</button>
            <select value={selectedMatch} onChange={(e) => setSelectedMatch(e.target.value)}>
              <option value="">An wen?</option>
              {matches.map((m, i) => (
                <option key={i} value={m}>{m}</option>
              ))}
            </select>
            <button
              onClick={() => handleAsk(idx, selectedMatch)}
              disabled={!selectedMatch}
            >Markieren</button>
          </div>
          <p style={{ fontSize: "12px", color: darkMode ? "#aaa" : "#666", marginTop: "6px" }}>
            Schon gestellt an: {q.askedTo.join(", ") || "Niemanden"}
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

      <hr style={{ margin: "30px 0" }} />

      <h2>Fragen-Bibliothek</h2>
      {questionLibrary.map((q, i) => (
        <div key={i} style={{ border: "1px dashed #888", padding: "8px", margin: "8px 0" }}>
          <p><strong>[{q.category}]</strong> {q.text}</p>
          <button onClick={() => setNewQuestion(q.text)}>→ In Eingabe übernehmen</button>
        </div>
      ))}

      <hr style={{ margin: "30px 0" }} />

      <h2>Matches</h2>
      <ul>
        {matches.map((m, i) => (
          <li key={i} style={{ marginBottom: "6px" }}>
            {m} <button onClick={() => handleRemoveMatch(m)} style={{ marginLeft: "10px", color: "red" }}>Entfernen</button>
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
    </div>
  );
}