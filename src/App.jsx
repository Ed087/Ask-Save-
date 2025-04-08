import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AskSaveApp() {
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
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Ask Save!</h1>
      <Tabs defaultValue="questions" className="w-full">
        <TabsList>
          <TabsTrigger value="questions">Fragen</TabsTrigger>
          <TabsTrigger value="matches">Matches</TabsTrigger>
        </TabsList>

        <div className="mt-4">
          {/* Fragen Tab */}
          <div hidden={false}>
            <div className="space-y-2">
              {questions.map((q, idx) => (
                <Card key={idx}>
                  <CardContent className="p-4 flex flex-col space-y-2">
                    <span>{q.text}</span>
                    <div className="flex gap-2">
                      <Button onClick={() => handleCopy(q.text)}>Kopieren</Button>
                      <select
                        className="border rounded px-2"
                        value={selectedMatch}
                        onChange={(e) => setSelectedMatch(e.target.value)}
                      >
                        <option value="">An wen?</option>
                        {matches.map((m, i) => (
                          <option key={i} value={m}>{m}</option>
                        ))}
                      </select>
                      <Button onClick={() => handleAsk(idx, selectedMatch)} disabled={!selectedMatch}>Markieren</Button>
                    </div>
                    <div className="text-xs text-gray-500">
                      Schon gestellt an: {q.askedTo.join(", ") || "Niemanden"}
                    </div>
                  </CardContent>
                </Card>
              ))}
              <div className="mt-4">
                <Input
                  placeholder="Neue Frage eingeben"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                />
                <Button className="mt-2" onClick={handleAddQuestion}>Frage hinzufügen</Button>
              </div>
            </div>
          </div>

          {/* Matches Tab */}
          <div hidden={true}>
            <div className="space-y-2">
              {matches.map((match, idx) => (
                <Card key={idx}>
                  <CardContent className="p-4">
                    <span>{match}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </Tabs>
    </div>
  );
}
