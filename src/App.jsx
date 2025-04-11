import { useState, useEffect } from "react";

export default function App() {
  const [activeQuestions, setActiveQuestions] = useState(
    () => JSON.parse(localStorage.getItem("activeQuestions")) || []
  );
  const [answers, setAnswers] = useState(
    () => JSON.parse(localStorage.getItem("answers")) || {}
  );
  const [contacts, setContacts] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("contacts"));
      return Array.isArray(stored) ? stored : [];
    } catch {
      return [];
    }
  });

  const [selectedContact, setSelectedContact] = useState("");
  const [viewContact, setViewContact] = useState("");
  const [newContact, setNewContact] = useState("");
  const [newQuestion, setNewQuestion] = useState("");
  const [tab, setTab] = useState("kontakte"); // Startseite
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
  const [editAnswer, setEditAnswer] = useState(null); // für Antwort-Bearbeitung
  const [highlighted, setHighlighted] = useState(null); // für Verlauf-Fokus
  const [addingNote, setAddingNote] = useState(""); // für neues Notizfeld

  const translations = {
    de: {
      fragen: "Fragen",
      antworten: "Antworten",
      kontakte: "Kontakte",
      verlauf: "Verlauf",
      favoriten: "Favoriten",
      frageStellen: "Frage zuordnen",
      neueFrage: "Frage hinzufügen",
      anWen: "An wen?",
      bitteWaehlen: "Bitte wähle zuerst einen Kontakt aus.",
      loeschen: "Löschen",
      hinzufuegen: "Hinzufügen",
      speichern: "Speichern",
      antwortenVon: "Antworten von",
      gestellt: "Fragen gestellt:",
      verlaufLöschen: "Verlauf löschen",
      verlaufFrage: "Willst du wirklich den gesamten Verlauf löschen?",
      notizHinzufuegen: "Notiz hinzufügen",
      schongestellt: "Diese Frage wurde diesem Kontakt bereits gestellt.",
    },
    en: {
      fragen: "Questions",
      antworten: "Answers",
      kontakte: "Contacts",
      verlauf: "History",
      favoriten: "Favorites",
      frageStellen: "Assign question",
      neueFrage: "Add question",
      anWen: "To whom?",
      bitteWaehlen: "Please select a contact first.",
      loeschen: "Delete",
      hinzufuegen: "Add",
      speichern: "Save",
      antwortenVon: "Answers from",
      gestellt: "Questions sent:",
      verlaufLöschen: "Clear history",
      verlaufFrage: "Do you really want to delete the entire history?",
      notizHinzufuegen: "Add note",
      schongestellt: "This question was already assigned to this contact.",
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

      {tab === "kontakte" && (
        <>
          <h2>{t.kontakte}</h2>
          {contacts.map((c, i) => (
            <div
              key={i}
              style={{
                marginBottom: "16px",
                borderBottom: "1px solid #444",
                paddingBottom: "8px",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <strong
                  style={{ fontSize: "16px", cursor: "pointer", flexGrow: 1 }}
                  onClick={() => {
                    setTab("antworten");
                    setViewContact(c);
                    setTimeout(() => setHighlighted(null), 1000);
                  }}
                >
                  {c}
                </strong>
                <button
                  onClick={() => {
                    setFavorites((prev) =>
                      prev.includes(c)
                        ? prev.filter((name) => name !== c)
                        : [...prev, c]
                    );
                  }}
                >
                  {favorites.includes(c) ? "⭐" : "☆"}
                </button>
                <button onClick={() => setAddingNote(c)}>
                  {t.notizHinzufuegen}
                </button>
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
                >
                  🗑️
                </button>
              </div>

              {addingNote === c && (
                <div style={{ marginTop: "5px" }}>
                  <input
                    placeholder="Neue Notiz..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && e.target.value.trim()) {
                        const updated = [
                          ...(notes[c] || []),
                          e.target.value.trim(),
                        ];
                        setNotes((prev) => ({ ...prev, [c]: updated }));
                        e.target.value = "";
                        setAddingNote("");
                      }
                    }}
                    style={{ width: "100%", padding: "6px" }}
                    autoFocus
                  />
                </div>
              )}

              {(notes[c] || []).map((note, nidx) => (
                <div
                  key={nidx}
                  style={{ fontSize: "14px", marginLeft: "10px" }}
                >
                  - {note}
                </div>
              ))}
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
                  if (answers[selected]?.[q.text]) {
                    alert(t.schongestellt);
                    return;
                  }
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
                  <div
                    key={i}
                    id={`antwort-${i}`}
                    style={{
                      marginBottom: "10px",
                      background: highlighted === q ? "#fffae6" : "transparent",
                    }}
                  >
                    <strong>{q}</strong>
                    {editAnswer === q ? (
                      <>
                        <textarea
                          rows={2}
                          style={{ width: "100%", marginTop: 4 }}
                          defaultValue={a}
                          onBlur={(e) => {
                            const newText = e.target.value;
                            setAnswers((prev) => ({
                              ...prev,
                              [viewContact]: {
                                ...prev[viewContact],
                                [q]: newText,
                              },
                            }));
                            setEditAnswer(null);
                          }}
                        />
                        <button onClick={() => setEditAnswer(null)}>
                          {t.speichern}
                        </button>
                      </>
                    ) : (
                      <>
                        <div>{a || "-"}</div>
                        <button onClick={() => setEditAnswer(q)}>✏️</button>
                      </>
                    )}
                  </div>
                ))}
            </>
          )}
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
              <div
                key={i}
                style={{
                  fontSize: "14px",
                  marginBottom: "6px",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setTab("antworten");
                  setViewContact(entry.to);
                  setTimeout(() => setHighlighted(entry.question), 100);
                  setTimeout(() => setHighlighted(null), 1000);
                }}
              >
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
