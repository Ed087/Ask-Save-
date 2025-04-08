import { useState } from "react";

export default function App() {
  const [questions, setQuestions] = useState([
    { text: "Was war dein schönstes Kindheitserlebnis?", askedTo: [] },
    { text: "Wenn du eine Superkraft haben könntest, welche wäre es?", askedTo: [] },
  ]);
  const [matches, setMatches] = useState(["Lisa", "Anna"]);
  const [selectedMatch, setSelectedMatch] = useState("");
  const [newQuestion, setNewQuestion] = useState("");

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert("Frage kopiert!");
  };

  const handleAsk = (questionIndex, matchName) => {
    setQuestions((prev) => {
      const updated = [...prev];
      if (!updated[questionIndex].askedTo.includes(matchName)) {
        updated[questionIndex].askedTo.push(matchName);
      }
      return updated;
    });
  };

  const handleAddQuestion = () => {
    if (newQuestion.trim() !== "") {
      setQuestions([...questions, { text: newQuestion, askedTo: [] }]);
      setNewQuestion("");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto", fontFamily: "Arial" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>Ask Save!</h1>

      <h2 style={{ fontSize: "18px", marginBottom: "10px" }}>Fragen</h2>

      {questions.map((q, idx) => (
        <div key={idx} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px", borderRadius: "6px" }}>
          <p>{q.text}</p>
          <div style={{ display: "flex", gap: "10px", marginTop: "10px", flexWrap: "wrap" }}>
            <button onClick={() => handleCopy(q.text)}>Kopieren</button>

            <select
              value={selectedMatch}
              onChange={(e) => setSelectedMatch(e.target.value)}
            >
              <option value="">An wen?</option>
              {matches.map((m, i) => (
                <option key={i} value={m}>{m}</option>
              ))}
            </select>

            <button
              onClick={() => handleAsk(idx, selectedMatch)}
              disabled={!selectedMatch}
            >
              Markieren
            </button>
          </div>
          <p style={{ fontSize: "12px", color: "#666", marginTop: "8px" }}>
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

      <h2 style={{ fontSize: "18px", marginBottom: "10px" }}>Matches</h2>
      <ul>
        {matches.map((m, i) => (
          <li key={i}>{m}</li>
        ))}
      </ul>
    </div>
  );
}
