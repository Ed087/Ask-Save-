import { useState, useEffect } from "react";

export default function App() {
  const [questions, setQuestions] = useState(
    () => JSON.parse(localStorage.getItem("questions")) || []
  );
  const [answers, setAnswers] = useState(
    () => JSON.parse(localStorage.getItem("answers")) || {}
  );
  const [matches, setMatches] = useState(
    () => JSON.parse(localStorage.getItem("matches")) || []
  );
  const [selectedMatch, setSelectedMatch] = useState("");
  const [viewMatch, setViewMatch] = useState("");
  const [newMatch, setNewMatch] = useState("");
  const [newQuestion, setNewQuestion] = useState("");
  const [tab, setTab] = useState("fragen");
  const [favorites, setFavorites] = useState(
    () => JSON.parse(localStorage.getItem("favorites")) || []
  );
  const [notes, setNotes] = useState(
    () => JSON.parse(localStorage.getItem("notes")) || {}
  );
  const [log, setLog] = useState(
    () => JSON.parse(localStorage.getItem("log")) || []
  );
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "dark"
  );
  const [language, setLanguage] = useState(
    () => localStorage.getItem("language") || "de"
  );

  const translations = {
    de: {
      fragen: "Fragen",
      antworten: "Antworten",
      matches: "Matches",
      verlauf: "Verlauf",
      favoriten: "Favoriten",
      backup: "Backup",
      frageStellen: "Frage markieren",
      neueFrage: "Neue eigene Frage",
      anWen: "An wen?",
      bitteWaehlen: "Bitte wähle zuerst ein Match aus.",
      loeschen: "Löschen",
      hinzufuegen: "Hinzufügen",
      speichern: "Speichern",
      antwortenVon: "Antworten von",
    },
    en: {
      fragen: "Questions",
      antworten: "Answers",
      matches: "Matches",
      verlauf: "History",
      favoriten: "Favorites",
      backup: "Backup",
      frageStellen: "Mark Question",
      neueFrage: "New custom question",
      anWen: "To whom?",
      bitteWaehlen: "Please select a match first.",
      loeschen: "Delete",
      hinzufuegen: "Add",
      speichern: "Save",
      antwortenVon: "Answers from",
    },
  };

  const t = translations[language];

  const themeStyles = {
    dark: { backgroundColor: "#121212", color: "#eee", fontFamily: "Arial" },
    light: { backgroundColor: "#f9f9f9", color: "#222" },
    romantic: {
      backgroundColor: "#fff0f6",
      color: "#880e4f",
      fontFamily: "'Comic Sans MS', cursive",
    },
    ocean: { backgroundColor: "#e0f7fa", color: "#004d40" },
    forest: { backgroundColor: "#e8f5e9", color: "#2e7d32" },
    tech: { backgroundColor: "#e3f2fd", color: "#0d47a1" },
    pastel: { backgroundColor: "#fce4ec", color: "#4a148c" },
  };

  useEffect(() => {
    localStorage.setItem("questions", JSON.stringify(questions));
    localStorage.setItem("matches", JSON.stringify(matches));
    localStorage.setItem("answers", JSON.stringify(answers));
    localStorage.setItem("favorites", JSON.stringify(favorites));
    localStorage.setItem("notes", JSON.stringify(notes));
    localStorage.setItem("log", JSON.stringify(log));
    localStorage.setItem("theme", theme);
    localStorage.setItem("language", language);
  }, [questions, matches, answers, favorites, notes, log, theme, language]);
  const handleAddQuestion = () => {
    if (newQuestion.trim()) {
      setQuestions((prev) => [
        ...prev,
        { text: newQuestion.trim(), askedTo: [] },
      ]);
      setNewQuestion("");
    }
  };

  const handleDeleteQuestion = (index) => {
    const updated = [...questions];
    updated.splice(index, 1);
    setQuestions(updated);
  };

  const handleMarkAsked = (index, match) => {
    const updated = [...questions];
    if (!updated[index].askedTo.includes(match)) {
      updated[index].askedTo.push(match);
      setQuestions(updated);
      setLog([
        ...log,
        {
          to: match,
          question: updated[index].text,
          category: "Eigene Fragen",
          time: new Date().toLocaleString(),
        },
      ]);
    }
  };

  const exportData = () => {
    const data = { matches, questions, answers, favorites, notes, log };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "mindquest-backup.json";
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
        <h1>MindQuest</h1>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <select onChange={(e) => setTheme(e.target.value)} value={theme}>
            {Object.keys(themeStyles).map((t, i) => (
              <option key={i} value={t}>
                {t}
              </option>
            ))}
          </select>
          <select
            onChange={(e) => setLanguage(e.target.value)}
            value={language}
          >
            <option value="de">🇩🇪 Deutsch</option>
            <option value="en">🇺🇸 English</option>
          </select>
          <button onClick={exportData}>{t.backup}</button>
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
        <button onClick={() => setTab("fragen")}>{t.fragen}</button>
        <button onClick={() => setTab("antworten")}>{t.antworten}</button>
        <button onClick={() => setTab("matches")}>{t.matches}</button>
        <button onClick={() => setTab("verlauf")}>{t.verlauf}</button>
        <button onClick={() => setTab("favoriten")}>{t.favoriten}</button>
      </div>
      {tab === "fragen" && (
        <>
          <h2>{t.fragen}</h2>
          <input
            placeholder={t.neueFrage}
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            style={{ width: "100%", padding: "6px", marginBottom: "8px" }}
          />
          <button onClick={handleAddQuestion}>{t.hinzufuegen}</button>
          <hr />
          {questions.map((q, i) => (
            <div
              key={i}
              style={{ borderBottom: "1px solid #ccc", padding: "8px 0" }}
            >
              <p>{q.text}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                <select
                  onChange={(e) => handleMarkAsked(i, e.target.value)}
                  value=""
                >
                  <option value="">{t.anWen}</option>
                  {matches.map((m, idx) => (
                    <option key={idx} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
                <button onClick={() => handleDeleteQuestion(i)}>
                  {t.loeschen}
                </button>
              </div>
              <div style={{ fontSize: "12px", color: "gray" }}>
                Schon gestellt an: {q.askedTo.join(", ") || "-"}
              </div>
            </div>
          ))}
        </>
      )}

      {tab === "antworten" && (
        <>
          <h2>{t.antworten}</h2>
          <label>{t.antwortenVon}:</label>
          <select
            onChange={(e) => setViewMatch(e.target.value)}
            value={viewMatch}
          >
            <option value="">—</option>
            {matches.map((m, i) => (
              <option key={i} value={m}>
                {m}
              </option>
            ))}
          </select>
          {viewMatch && (
            <>
              {questions
                .filter((q) => q.askedTo.includes(viewMatch))
                .map((q, idx) => (
                  <div key={idx} style={{ marginBottom: "10px" }}>
                    <strong>{q.text}</strong>
                    <textarea
                      rows={2}
                      style={{ width: "100%", marginTop: 4 }}
                      value={answers[viewMatch]?.[q.text] || ""}
                      onChange={(e) =>
                        setAnswers((prev) => ({
                          ...prev,
                          [viewMatch]: {
                            ...prev[viewMatch],
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
          <h2>{t.matches}</h2>
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
            {t.hinzufuegen}
          </button>
        </>
      )}

      {tab === "verlauf" && (
        <>
          <h2>{t.verlauf}</h2>
          {log
            .slice()
            .reverse()
            .map((entry, i) => (
              <div key={i} style={{ fontSize: "14px", marginBottom: "6px" }}>
                <strong>{entry.to}</strong> → {entry.question}
                <br />
                <span style={{ color: "#999" }}>{entry.time}</span>
                <hr style={{ margin: "4px 0" }} />
              </div>
            ))}
        </>
      )}

      {tab === "favoriten" && (
        <>
          <h2>{t.favoriten}</h2>
          {favorites.map((f, i) => (
            <div key={i} style={{ marginBottom: "10px" }}>
              <span>{f}</span>
              <button
                onClick={() => setFavorites(favorites.filter((q) => q !== f))}
              >
                {t.loeschen}
              </button>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
