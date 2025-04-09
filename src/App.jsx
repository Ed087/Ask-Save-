import { useState, useEffect } from "react";

export default function App() {
  const defaultLibrary = [
    { category: "Smalltalk", text: "Wie war dein Tag heute?", tags: ["locker"] },
    { category: "Interessen & Persönliches", text: "Was begeistert dich wirklich?", tags: ["tiefgründig"] },
    { category: "Zukunft", text: "Wo siehst du dich in 5 Jahren?", tags: ["nachdenklich"] },
    { category: "Lustig", text: "Was ist dein peinlichstes Erlebnis?", tags: ["witzig", "locker"] },
    { category: "Intimes", text: "Was findest du anziehend?", tags: ["intim", "frech"] },
    { category: "Tiefgründig", text: "Was bedeutet Liebe für dich?", tags: ["emotional", "tiefgründig"] },
    { category: "Würdest du lieber..?", text: "Würdest du lieber für immer flüstern oder schreien?", tags: ["witzig", "nachdenklich"] }
  ];

  const defaultSnippets = [
    "Muss ich mal überlegen…",
    "Hahaha gute Frage!",
    "Kommt auf die Situation an…",
    "Willst du die ehrliche oder die charmante Antwort?"
  ];

  const [questionLibrary, setQuestionLibrary] = useState(defaultLibrary);
  const [questions, setQuestions] = useState(() => JSON.parse(localStorage.getItem("questions")) || []);
  const [answers, setAnswers] = useState(() => JSON.parse(localStorage.getItem("answers")) || {});
  const [matches, setMatches] = useState(() => JSON.parse(localStorage.getItem("matches")) || ["Lisa"]);
  const [selectedMatch, setSelectedMatch] = useState("");
  const [newMatch, setNewMatch] = useState("");
  const [newQuestion, setNewQuestion] = useState("");
  const [tab, setTab] = useState("fragen");
  const [activeAnswerMatch, setActiveAnswerMatch] = useState("");
  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem("favorites")) || []);
  const [notes, setNotes] = useState(() => JSON.parse(localStorage.getItem("notes")) || {});
  const [log, setLog] = useState(() => JSON.parse(localStorage.getItem("log")) || []);
  const [searchTerm, setSearchTerm] = useState("");
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");
  const [snippets, setSnippets] = useState(defaultSnippets);
  const [styleMode, setStyleMode] = useState("alle");

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
      fontFamily: "Arial"
    },
    light: {
      backgroundColor: "#fdfdfd",
      color: "#222",
      fontFamily: "Verdana"
    },
    romantic: {
      backgroundColor: "#fff0f6",
      color: "#880e4f",
      fontFamily: "'Comic Sans MS', cursive"
    }
  };
const handleAsk = (q, matchName) => {
    const timestamp = new Date().toLocaleString();
    const newQ = { ...q, askedTo: [...(q.askedTo || []), matchName] };
    setQuestions(prev => [...prev, newQ]);
    setLog([...log, { to: matchName, question: q.text, category: q.category || "Unbekannt", time: timestamp }]);
    setActiveAnswerMatch(matchName);
    setTab("antworten");
  };

  const handleAddCustomQuestion = () => {
    if (newQuestion.trim()) {
      setQuestionLibrary(prev => [...prev, { category: "Eigene Fragen", text: newQuestion.trim(), tags: ["custom"] }]);
      setNewQuestion("");
      alert("Frage gespeichert unter Eigene Fragen!");
    }
  };

  const toggleFavorite = (questionText) => {
    if (favorites.includes(questionText)) {
      setFavorites(favorites.filter(q => q !== questionText));
    } else {
      setFavorites([...favorites, questionText]);
    }
  };

  const exportData = () => {
    const data = { matches, questions, answers, favorites, notes, log };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "ask-save-backup.json";
    a.click();
  };

  return (
    <div style={{ ...themeStyles[theme], padding: 20, minHeight: "100vh" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: "wrap" }}>
        <h1>Ask Save</h1>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <select onChange={(e) => setTheme(e.target.value)} value={theme}>
            <option value="dark">🖤 Dark</option>
            <option value="light">☀️ Light</option>
            <option value="romantic">💖 Romantic</option>
          </select>
          <select onChange={(e) => setStyleMode(e.target.value)} value={styleMode}>
            <option value="alle">Alle Fragen</option>
            <option value="locker">Charmant</option>
            <option value="frech">Frech</option>
            <option value="tiefgründig">Tiefsinnig</option>
            <option value="witzig">Witzig</option>
          </select>
          <button onClick={exportData}>⬇ Backup</button>
        </div>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", margin: "20px 0" }}>
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
          <input
            placeholder="Neue eigene Frage"
            value={newQuestion}
            onChange={e => setNewQuestion(e.target.value)}
            style={{ width: "100%", padding: "6px", marginBottom: "8px" }}
          />
          <button onClick={handleAddCustomQuestion}>➕ Speichern</button>

          <select onChange={(e) => setSelectedMatch(e.target.value)} value={selectedMatch}>
            <option value="">An wen?</option>
            {matches.map((m, i) => <option key={i} value={m}>{m}</option>)}
          </select>

          <div style={{ marginTop: 10 }}>
            {questionLibrary
              .filter(q => styleMode === "alle" || q.tags?.includes(styleMode))
              .map((q, i) => (
                <div key={i} style={{ border: "1px solid #ccc", borderRadius: "8px", padding: 10, marginBottom: 8 }}>
                  <p>
                    {q.text}
                    <button onClick={() => toggleFavorite(q.text)} style={{ marginLeft: 8 }}>
                      {favorites.includes(q.text) ? "⭐" : "☆"}
                    </button>
                  </p>
                  <button onClick={() => handleAsk(q, selectedMatch)} disabled={!selectedMatch}>Frage stellen</button>
                </div>
              ))}
          </div>

          <h3 style={{ marginTop: 30 }}>Zuletzt gestellt:</h3>
          {log.slice(-5).reverse().map((entry, i) => (
            <div key={i} style={{ fontSize: "14px", marginBottom: "6px" }}>
              <strong>{entry.to}</strong> → {entry.question}
              <br /><span style={{ color: "#aaa" }}>{entry.time}</span>
            </div>
          ))}
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
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: 10 }}>
            {matches.filter(m =>
              !searchTerm || Object.keys(answers[m] || {}).some(q =>
                q.toLowerCase().includes(searchTerm.toLowerCase()))
            ).map((m, i) => (
              <button key={i} onClick={() => setActiveAnswerMatch(m)}>{m}</button>
            ))}
          </div>

          {activeAnswerMatch && (
            <>
              <h3>Antworten für {activeAnswerMatch}</h3>
              {questions
                .filter(q => q.askedTo?.includes(activeAnswerMatch))
                .map((q, idx) => (
                  <div key={idx} style={{ marginBottom: 10 }}>
                    <p>
                      <strong>{q.text}</strong>
                      {!answers[activeAnswerMatch]?.[q.text] && <span style={{ color: "red", marginLeft: 10 }}>❗</span>}
                    </p>
                    <textarea
                      rows={2}
                      style={{ width: "100%" }}
                      value={answers[activeAnswerMatch]?.[q.text] || ""}
                      onChange={(e) =>
                        setAnswers(prev => ({
                          ...prev,
                          [activeAnswerMatch]: {
                            ...prev[activeAnswerMatch],
                            [q.text]: e.target.value
                          }
                        }))
                      }
                    />
                    <div>
                      <label>📂 Antwortbaustein:</label>
                      <select onChange={(e) => {
                        if (e.target.value) {
                          const val = e.target.value;
                          setAnswers(prev => ({
                            ...prev,
                            [activeAnswerMatch]: {
                              ...prev[activeAnswerMatch],
                              [q.text]: (prev[activeAnswerMatch]?.[q.text] || "") + " " + val
                            }
                          }));
                          e.target.value = "";
                        }
                      }}>
                        <option value="">Baustein wählen</option>
                        {snippets.map((s, i) => <option key={i} value={s}>{s}</option>)}
                      </select>
                    </div>
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
                  setNotes(prev => ({ ...prev, [m]: e.target.value }))
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
          <button onClick={() => {
            if (newMatch && !matches.includes(newMatch)) {
              setMatches([...matches, newMatch]);
              setNewMatch("");
            }
          }}>➕</button>
        </>
      )}

      {tab === "verlauf" && (
        <>
          <h2>Verlauf</h2>
          {log.slice().reverse().map((entry, i) => (
            <div key={i} style={{ fontSize: "14px", marginBottom: "6px" }}>
              <strong>{entry.to}</strong> → {entry.question} <em>({entry.category})</em><br />
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
              <button onClick={() => toggleFavorite(f)} style={{ marginLeft: 10 }}>🗑 Entfernen</button>
            </div>
          ))}
        </>
      )}

      {tab === "analyse" && (
        <>
          <h2>📊 Analyse</h2>
          {matches.map((m, i) => {
            const gestellt = questions.filter(q => q.askedTo?.includes(m)).length;
            const beantwortet = Object.keys(answers[m] || {}).length;
            const topCat = (() => {
              const cats = questions.filter(q => q.askedTo?.includes(m)).map(q => q.category);
              const count = {};
              cats.forEach(c => count[c] = (count[c] || 0) + 1);
              return Object.entries(count).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";
            })();
            return (
              <div key={i}>
                <p><strong>{m}</strong>: {gestellt} gestellt, {beantwortet} beantwortet, Top: {topCat}</p>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}