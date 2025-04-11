import { useState, useEffect } from "react";

export default function App() {
  const [activeQuestions, setActiveQuestions] = useState(
    () => JSON.parse(localStorage.getItem("activeQuestions")) || []
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
      kontakte: "Kontakte",
      verlauf: "Verlauf",
      favoriten: "Favoriten",
      backup: "Backup",
      frageStellen: "Frage zuordnen",
      neueFrage: "Neue eigene Frage",
      anWen: "An wen?",
      bitteWaehlen: "Bitte wähle zuerst ein Match aus.",
      loeschen: "Löschen",
      hinzufuegen: "Hinzufügen",
      speichern: "Speichern",
      antwortenVon: "Antworten von",
      gestellt: "Fragen gestellt:",
      verlaufLöschen: "Verlauf löschen",
      verlaufFrage: "Willst du wirklich den gesamten Verlauf löschen?",
    },
    en: {
      fragen: "Questions",
      antworten: "Answers",
      kontakte: "Contacts",
      verlauf: "History",
      favoriten: "Favorites",
      backup: "Backup",
      frageStellen: "Assign question",
      neueFrage: "New custom question",
      anWen: "To whom?",
      bitteWaehlen: "Please select a match first.",
      loeschen: "Delete",
      hinzufuegen: "Add",
      speichern: "Save",
      antwortenVon: "Answers from",
      gestellt: "Questions sent:",
      verlaufLöschen: "Clear history",
      verlaufFrage: "Do you really want to delete the entire history?",
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
    localStorage.setItem("activeQuestions", JSON.stringify(activeQuestions));
    localStorage.setItem("matches", JSON.stringify(matches));
    localStorage.setItem("answers", JSON.stringify(answers));
    localStorage.setItem("favorites", JSON.stringify(favorites));
    localStorage.setItem("notes", JSON.stringify(notes));
    localStorage.setItem("log", JSON.stringify(log));
    localStorage.setItem("theme", theme);
    localStorage.setItem("language", language);
  }, [
    activeQuestions,
    matches,
    answers,
    favorites,
    notes,
    log,
    theme,
    language,
  ]);
  const handleAddQuestion = () => {
    if (newQuestion.trim()) {
      setActiveQuestions((prev) => [...prev, { text: newQuestion.trim() }]);
      setNewQuestion("");
    }
  };

  const handleDeleteQuestion = (index) => {
    const updated = [...activeQuestions];
    updated.splice(index, 1);
    setActiveQuestions(updated);
  };

  const handleAssignQuestion = (index, match) => {
    const questionText = activeQuestions[index].text;
    const confirmSend = window.confirm(
      `Frage an "${match}" speichern?\n\n"${questionText}"`
    );

    if (confirmSend) {
      const timestamp = new Date().toLocaleString();
      setLog((prev) => [
        ...prev,
        {
          to: match,
          question: questionText,
          category: "Eigene Fragen",
          time: timestamp,
        },
      ]);

      setAnswers((prev) => ({
        ...prev,
        [match]: {
          ...prev[match],
          [questionText]: prev[match]?.[questionText] || "",
        },
      }));
    }
  };

  const handleDeleteAnswer = (match, question) => {
    const updated = { ...answers };
    if (updated[match]) {
      delete updated[match][question];
      setAnswers(updated);
    }
  };

  const handleClearLog = () => {
    const confirmClear = window.confirm(t.verlaufFrage);
    if (confirmClear) {
      setLog([]);
    }
  };

  const exportData = () => {
    const data = { matches, activeQuestions, answers, favorites, notes, log };
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
          {activeQuestions.map((q, i) => (
            <div
              key={i}
              style={{ borderBottom: "1px solid #ccc", padding: "8px 0" }}
            >
              <p>{q.text}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                <select
                  value=""
                  onChange={(e) => handleAssignQuestion(i, e.target.value)}
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
              <p style={{ fontSize: "14px", margin: "4px 0" }}>
                {t.gestellt} {Object.keys(answers[viewMatch] || {}).length}
              </p>
              {Object.entries(answers[viewMatch] || {}).map(
                ([question, answer], i) => (
                  <div key={i} style={{ marginBottom: "10px" }}>
                    <strong>{question}</strong>
                    <textarea
                      rows={2}
                      style={{ width: "100%", marginTop: 4 }}
                      value={answer}
                      onChange={(e) =>
                        setAnswers((prev) => ({
                          ...prev,
                          [viewMatch]: {
                            ...prev[viewMatch],
                            [question]: e.target.value,
                          },
                        }))
                      }
                    />
                    <button
                      onClick={() => handleDeleteAnswer(viewMatch, question)}
                    >
                      {t.loeschen}
                    </button>
                  </div>
                )
              )}
            </>
          )}
        </>
      )}
      {tab === "matches" && (
  <>
    <h2>{t.matches}</h2>
    {matches.map((m, i) => (
  <div
    key={i}
    style={{
      marginBottom: "24px",
      borderBottom: "1px solid #444",
      paddingBottom: "12px"
    }}
  >
    <strong
      style={{
        fontSize: "16px",
        display: "block",
        marginBottom: "6px",
        cursor: "pointer",
        color: "#66b0ff"
      }}
      onClick={() => {
        setTab("antworten");
        setViewMatch(m);
      }}
    >
      {m}
    </strong>

    <textarea
      placeholder={language === "de" ? "Notizen..." : "Notes..."}
      value={notes[m] || ""}
      onChange={(e) =>
        setNotes((prev) => ({ ...prev, [m]: e.target.value }))
      }
      style={{
        display: "block",
        width: "100%",
        marginTop: "5px",
        minHeight: "60px",
        padding: "8px",
        fontSize: "15px",
        borderRadius: "6px",
        border: "1px solid #aaa"
      }}
    />

    <button
      onClick={() => {
        const confirmed = window.confirm(`„${m}“ wirklich entfernen?`);
        if (confirmed) {
          setMatches(matches.filter((name) => name !== m));
          const updatedNotes = { ...notes };
          const updatedAnswers = { ...answers };
          delete updatedNotes[m];
          delete updatedAnswers[m];
          setNotes(updatedNotes);
          setAnswers(updatedAnswers);
        }
      }}
      style={{
        marginTop: "8px",
        backgroundColor: "#ff4d4d",
        color: "#fff",
        padding: "4px 8px",
        border: "none",
        borderRadius: "4px",
        fontSize: "13px"
      }}
    >
      {t.loeschen}
    </button>
  </div>
))}

    <input
      placeholder={language === "de" ? "Neuen Chatpartner hinzufügen" : "Add new chatpartner"}
      value={newMatch}
      onChange={(e) => setNewMatch(e.target.value)}
      style={{ width: "100%", padding: "8px", marginTop: "8px" }}
    />
    <button
      onClick={() => {
        if (newMatch && !matches.includes(newMatch)) {
          setMatches([...matches, newMatch]);
          setNewMatch("");
        }
      }}
      style={{
        marginTop: "6px",
        padding: "8px 12px",
        borderRadius: "5px",
        backgroundColor: "#4caf50",
        color: "white",
        fontWeight: "bold",
        border: "none",
        width: "100%"
      }}
    >
      {t.hinzufuegen}
    </button>
  </>
)}

      {tab === "verlauf" && (
        <>
          <h2>{t.verlauf}</h2>
          <button onClick={handleClearLog}>{t.verlaufLöschen}</button>
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
