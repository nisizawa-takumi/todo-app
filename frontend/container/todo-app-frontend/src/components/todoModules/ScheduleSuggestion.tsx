import { useState } from "react";
import { useLLM } from "../../hooks/scheduleSuggestion";
import { TodoType } from "@/lib/todo/apiClient";

// 所要時間推定付きタスク型
export interface TodoWithEstimate extends TodoType {
  estimated_minutes?: number;
}

interface ScheduleSuggestionProps {
  todos: TodoType[];
}

// 各stepのAI応答を格納する型
export interface MultiStepResult {
  estimate?: string;
  abstract?: string;
  select?: string;
  concrete?: string;
  review?: string;
  reabstract?: string;
  final?: string;
  [key: string]: string | undefined;
}

export default function ScheduleSuggestion({ todos }: ScheduleSuggestionProps) {
  const { askLLM, result, loading, error } = useLLM();
  const [stepLoading, setStepLoading] = useState<string>("");
  const [stepResult, setStepResult] = useState<MultiStepResult>({});
  const [scheduleDate, setScheduleDate] = useState<string>("");
  const [dayHours, setDayHours] = useState<number>(8); // 1日に使える時間（デフォルト8時間）
  // 各stepのプロンプト内容を保存
  const [stepPrompts, setStepPrompts] = useState<{ [key: string]: string }>({});

  // 未完了タスクのみ抽出
  const incompleteTodos = todos.filter((t) => !t.completed);

  // シングルプロンプトでAIスケジュール提案
  const singleScheduleFlow = async () => {
    setStepLoading("AIがスケジュールを考えています...");
    setStepResult({});
    const prompt =
      `あなたは現実的なスケジューラーです。${scheduleDate ? `「${scheduleDate}」の` : ""}1日スケジュール案を日本語で作成してください。\n` +
      `【条件】\n- 未完了タスクのみ対象\n- 優先度・期限・所要時間を考慮\n- 1日に使える最大時間は${dayHours}時間（${dayHours * 60}分）\n- 絶対に超えない\n- 各タスクの「開始時刻-終了時刻（所要時間）タスク名（優先度, 期限）」と簡単な理由を1行で\n- タイムテーブル形式で番号付きリスト\n` +
      `\n【ToDoリスト】\n` +
      incompleteTodos.map((t) => `- ${t.title} (${t.priority}, ${t.due_date})`).join("\n");
    setStepPrompts((prev) => ({ ...prev, schedule: prompt }));
    const scheduleResult = await askLLM(prompt);
    setStepResult((prev) => ({ ...prev, schedule: scheduleResult ?? undefined }));
    setStepLoading("");
  };

  return (
    <div style={{ margin: "1em 0", padding: "1em", border: "1px solid #ccc", borderRadius: 8 }}>
      <div>
        <b>１日のスケジュールをAIが提案</b>
      </div>
      {/* 多段階フロー用ボタン → シングルプロンプトボタンに変更 */}
      <button
        onClick={singleScheduleFlow}
        disabled={loading || !!stepLoading}
        style={{ marginLeft: 8, marginBottom: "1em" }}
      >
        AIスケジュール提案を表示
      </button>
      {/* 日付入力欄 */}
      <label style={{ display: "block", marginBottom: 4 }}>
        スケジュールを立てたい日付：
        <input
          type="date"
          value={scheduleDate}
          onChange={(e) => setScheduleDate(e.target.value)}
          style={{ marginLeft: 8, marginBottom: 8, marginRight: 8 }}
        />
      </label>
      {/* 1日あたりの時間入力欄 */}
      <label style={{ display: "block", marginBottom: 4 }}>
        1日に使える時間（時間単位）：
        <input
          type="number"
          min={1}
          max={24}
          value={dayHours}
          onChange={(e) => setDayHours(Number(e.target.value))}
          style={{ marginLeft: 8, marginBottom: 8, marginRight: 8, width: 60 }}
        />
        時間
      </label>
      {/* ローディング・進捗表示 */}
      {stepLoading && <div style={{ color: "#007bff" }}>{stepLoading}</div>}
      {/* 各工程のプロンプトと結果を段階的に表示（多段階フロー対応） */}
      {stepPrompts.schedule && (
        <div style={{ margin: "1em 0" }}>
          <strong>スケジュール提案プロンプト:</strong>
          <pre style={{ whiteSpace: "pre-wrap", background: "#f6f6f6", padding: "0.5em", borderRadius: 4 }}>
            {stepPrompts.schedule}
          </pre>
          {stepResult.schedule && (
            <>
              <strong>AI応答:</strong>
              <pre style={{ whiteSpace: "pre-wrap", background: "#f9f9f9", padding: "0.5em", borderRadius: 4 }}>
                {stepResult.schedule}
              </pre>
            </>
          )}
        </div>
      )}
      {/* ...既存の旧3段階フローやシンプルなAI応答UI... */}
      {loading && <div>AIがスケジュールを考えています...</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
      {result && (
        <div>
          <strong>AIスケジュール提案:</strong>
          <pre style={{ whiteSpace: "pre-wrap", background: "#f9f9f9", padding: "0.5em", borderRadius: 4 }}>
            {result}
          </pre>
          {stepPrompts.simple && (
            <>
              <strong>送信プロンプト:</strong>
              <pre style={{ whiteSpace: "pre-wrap", background: "#f6f6f6", padding: "0.5em", borderRadius: 4 }}>
                {stepPrompts.simple}
              </pre>
            </>
          )}
        </div>
      )}
    </div>
  );
}
