import { useState, useEffect } from "react";

export default function App() {
  const [activeQuestions, setActiveQuestions] = useState(
    () => JSON.parse(localStorage.getItem("activeQuestions")) || []
  );
  const [answers, setAnswers] = useState(
    () => JSON.parse(localStorage.getItem("answers")) || {}
  );
  const [contacts, setContacts] = useState(
    () => JSON.parse(localStorage.getItem("contacts")) || []
  );
  const [selectedContact, setSelectedContact] = useState("");
  const [viewContact, setViewContact] = useState("");
  const [newContact, setNewContact] = useState("");
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
  const [searchTerm, setSearchTerm] = useState("");

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
      bitteWaehlen: "Bitte wähle zuerst einen Kontakt aus.",
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
      bitteWaehlen: "Please select a contact first.",
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
    localStorage.setItem("contacts", JSON.stringify(contacts));
    localStorage.setItem("answers", JSON.stringify(answers));
    localStorage.setItem("favorites", JSON.stringify(favorites));
    localStorage.setItem("notes", JSON.stringify(notes));
    localStorage.setItem("log", JSON.stringify(log));
    localStorage.setItem("theme", theme);
    localStorage.setItem("language", language);
  }, [
    activeQuestions,
    contacts,
    answers,
    favorites,
    notes,
    log,
    theme,
    language,
  ]);
  return (
    <div style={{ ...themeStyles[theme], padding: 20, minHeight: "100vh" }}>
      <h1 style={{ marginTop: 0 }}>MindQuest</h1>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          padding: "10px 0",
          marginBottom: "20px",
          position: "sticky",
          top: 0,
          background: themeStyles[theme].backgroundColor,
          zIndex: 10,
        }}
      >
        <select value={theme} onChange={(e) => setTheme(e.target.value)}>
          {Object.keys(themeStyles).map((style) => (
            <option key={style} value={style}>
              {style}
            </option>
          ))}
        </select>
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="de">🇩🇪 Deutsch</option>
          <option value="en">🇺🇸 English</option>
        </select>
        <button
          onClick={() => {
            const backup = {
              questions: activeQuestions,
              answers,
              contacts,
              notes,
              favorites,
              log,
            };
            const blob = new Blob([JSON.stringify(backup, null, 2)], {
              type: "application/json",
            });
            const a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = "mindquest-backup.json";
            a.click();
          }}
        >
          {t.backup}
        </button>
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
        <button onClick={() => setTab("kontakte")}>{t.kontakte}</button>
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
          <button
            onClick={() => {
              if (newQuestion.trim()) {
                setActiveQuestions([...activeQuestions, { text: newQuestion }]);
                setNewQuestion("");
              }
            }}
          >
            {t.hinzufuegen}
          </button>
          <hr />
          {activeQuestions.map((q, i) => (
            <div
              key={i}
              style={{ padding: "8px 0", borderBottom: "1px solid #444" }}
            >
              <p>{q.text}</p>
              <select
                onChange={(e) => {
                  const selected = e.target.value;
                  if (!selected) return;
                  if (window.confirm(`„${selected}“ ${t.frageStellen}?`)) {
                    setAnswers((prev) => ({
                      ...prev,
                      [selected]: {
                        ...prev[selected],
                        [q.text]: "",
                      },
                    }));
                    setLog([
                      ...log,
                      {
                        to: selected,
                        question: q.text,
                        time: new Date().toLocaleString(),
                      },
                    ]);
                  }
                }}
              >
                <option value="">{t.anWen}</option>
                {contacts.map((c, i) => (
                  <option key={i} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <button
                onClick={() => {
                  if (window.confirm("Frage wirklich entfernen?")) {
                    const updated = [...activeQuestions];
                    updated.splice(i, 1);
                    setActiveQuestions(updated);
                  }
                }}
              >
                {t.loeschen}
              </button>
            </div>
          ))}
        </>
      )}

      {tab === "antworten" && (
        <>
          <h2>{t.antworten}</h2>
          <label>{t.antwortenVon}</label>
          <select
            value={viewContact}
            onChange={(e) => setViewContact(e.target.value)}
          >
            <option value="">—</option>
            {contacts.map((c, i) => (
              <option key={i} value={c}>
                {c} ({Object.keys(answers[c] || {}).length})
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder={
              language === "de"
                ? "Antworten durchsuchen..."
                : "Search answers..."
            }
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "6px",
              marginTop: "10px",
              marginBottom: "10px",
              fontSize: "14px",
            }}
          />

          {viewContact && (
            <>
              <p style={{ fontSize: "14px", margin: "4px 0" }}>
                {t.gestellt} {Object.keys(answers[viewContact] || {}).length}
              </p>
              {Object.entries(answers[viewContact] || {})
                .filter(([q]) =>
                  q.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map(([q, a], i) => (
                  <div key={i} style={{ marginBottom: "10px" }}>
                    <strong>{q}</strong>
                    <textarea
                      rows={2}
                      style={{ width: "100%", marginTop: 4 }}
                      value={a}
                      onChange={(e) =>
                        setAnswers((prev) => ({
                          ...prev,
                          [viewContact]: {
                            ...prev[viewContact],
                            [q]: e.target.value,
                          },
                        }))
                      }
                    />
                    <button
                      onClick={() => {
                        if (window.confirm("Antwort löschen?")) {
                          const updated = { ...answers[viewContact] };
                          delete updated[q];
                          setAnswers((prev) => ({
                            ...prev,
                            [viewContact]: updated,
                          }));
                        }
                      }}
                    >
                      {t.loeschen}
                    </button>
                  </div>
                ))}
            </>
          )}
        </>
      )}
      {tab === "kontakte" && (
        <>
          <h2>{t.kontakte}</h2>
          {contacts.map((c, i) => (
            <div
              key={i}
              style={{
                marginBottom: "24px",
                borderBottom: "1px solid #444",
                paddingBottom: "12px",
              }}
            >
              <strong
                style={{ fontSize: "16px", cursor: "pointer" }}
                onClick={() => {
                  setTab("antworten");
                  setViewContact(c);
                }}
              >
                {c}
              </strong>
              <textarea
                placeholder={language === "de" ? "Notizen..." : "Notes..."}
                value={notes[c] || ""}
                onChange={(e) =>
                  setNotes((prev) => ({ ...prev, [c]: e.target.value }))
                }
                style={{
                  display: "block",
                  width: "100%",
                  marginTop: "5px",
                  minHeight: "60px",
                  padding: "8px",
                  fontSize: "15px",
                  borderRadius: "6px",
                  border: "1px solid #aaa",
                }}
              />
              <button
                onClick={() => {
                  const confirmed = window.confirm(
                    `„${c}“ wirklich entfernen?`
                  );
                  if (confirmed) {
                    setContacts(contacts.filter((name) => name !== c));
                    const updatedNotes = { ...notes };
                    const updatedAnswers = { ...answers };
                    delete updatedNotes[c];
                    delete updatedAnswers[c];
                    setNotes(updatedNotes);
                    setAnswers(updatedAnswers);
                  }
                }}
                style={{
                  marginTop: "6px",
                  padding: "6px 10px",
                  backgroundColor: "#ff4d4d",
                  color: "#fff",
                  fontWeight: "bold",
                  border: "none",
                  borderRadius: "4px",
                }}
              >
                {t.loeschen}
              </button>
            </div>
          ))}
          <input
            placeholder={
              language === "de"
                ? "Neuen Chatpartner hinzufügen"
                : "Add new chatpartner"
            }
            value={newContact}
            onChange={(e) => setNewContact(e.target.value)}
            style={{ width: "100%", padding: "8px", marginTop: "8px" }}
          />
          <button
            onClick={() => {
              if (newContact && !contacts.includes(newContact)) {
                setContacts([...contacts, newContact]);
                setNewContact("");
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
              width: "100%",
            }}
          >
            {t.hinzufuegen}
          </button>
        </>
      )}

      {tab === "verlauf" && (
        <>
          <h2>{t.verlauf}</h2>
          <button
            onClick={() => {
              if (window.confirm(t.verlaufFrage)) setLog([]);
            }}
          >
            {t.verlaufLöschen}
          </button>
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
