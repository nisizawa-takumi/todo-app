import { useState } from "react";
import { useLLM } from "../../hooks/scheduleSuggestion";
import { TodoType } from "@/lib/todo/apiClient";

interface ScheduleSuggestionProps {
  todos: TodoType[];
}

export default function ScheduleSuggestion({ todos }: ScheduleSuggestionProps) {
  const { askLLM, result, loading, error } = useLLM();
  const [requested, setRequested] = useState(false);

  // 未完了タスクのみ抽出
  const incompleteTodos = todos.filter((t) => !t.completed);

  const handleClick = () => {
    const prompt =
      `あなたは優秀なスケジューラーです。以下のToDoリストをもとに、1日のスケジュール案を日本語で作成してください。\n\n` +
      `【要件】\n` +
      `- 優先度（high/medium/low）、期限（due_date）、所要時間、前後関係、午前/午後/夜のバランスを考慮し、未完了タスクを優先的に組み込んでください。\n` +
      `- 期限が近いものや優先度が高いものは早めに実施してください。\n` +
      `- できるだけ具体的な時間帯や順序を提案し、各タスクの理由や注意点も一言添えてください。\n` +
      `- 出力は「時間帯ごと（午前・午後・夜）」に分け、番号付きリストで記載してください。\n` +
      `- 出力例のフォーマットに従ってください。\n` +
      `\n【ToDoリスト】\n` +
      incompleteTodos
        .map(
          (t) =>
            `- タイトル: ${t.title}\n  詳細: ${t.description}\n  優先度: ${t.priority}\n  期限: ${t.due_date}`
        )
        .join("\n") +
      `\n\n【出力例】\n` +
      `■午前\n1. タスク名（優先度: high, 期限: 2025-06-25）\n   - 具体的な内容や注意点\n\n` +
      `■午後\n2. タスク名（優先度: medium, 期限: 2025-06-26）\n   - 具体的な内容や注意点\n\n` +
      `■夜\n3. タスク名（優先度: low, 期限: 2025-06-27）\n   - 具体的な内容や注意点\n`;
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
