import { useState } from "react";
import { useLLM } from "../../hooks/scheduleSuggestion";

interface ScheduleSuggestionProps {
  todos: string[];
}

export default function ScheduleSuggestion({ todos }: ScheduleSuggestionProps) {
  const { askLLM, result, loading, error } = useLLM();
  const [requested, setRequested] = useState(false);

  const handleClick = () => {
    const prompt =
      "次のToDoリストから1日のスケジュール案を日本語で提案してください。\n" +
      todos.map((t) => `- ${t}`).join("\n");
    askLLM(prompt);
    setRequested(true);
  };

  return (
    <div style={{ margin: "1em 0", padding: "1em", border: "1px solid #ccc", borderRadius: 8 }}>
      <button onClick={handleClick} disabled={loading} style={{ marginBottom: "1em" }}>
        AIによるスケジュール提案を表示
      </button>
      {loading && <div>AIがスケジュールを考えています...</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
      {requested && !loading && result && (
        <div>
          <strong>AIスケジュール提案:</strong>
          <pre style={{ whiteSpace: "pre-wrap", background: "#f9f9f9", padding: "0.5em", borderRadius: 4 }}>
            {result}
          </pre>
        </div>
      )}
    </div>
  );
}
