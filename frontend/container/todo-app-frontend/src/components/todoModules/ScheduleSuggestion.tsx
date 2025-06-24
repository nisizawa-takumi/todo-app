import { useState, useEffect } from "react";
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
  const [requested, setRequested] = useState(false);
  const [step, setStep] = useState<number>(0); // 0:未開始, 1:要約, 2:優先順位, 3:スケジュール, ...
  const [stepLoading, setStepLoading] = useState<string>("");
  const [stepResult, setStepResult] = useState<MultiStepResult>({});
  const [stepInternalResult, setStepInternalResult] = useState<string>("");
  const [scheduleDate, setScheduleDate] = useState<string>("");
  const [dayHours, setDayHours] = useState<number>(8); // 1日に使える時間（デフォルト8時間）
  // const [estimatedTodos, setEstimatedTodos] = useState<TodoWithEstimate[] | null>(null); // 所要時間推定済みタスク
  // 各stepのプロンプト内容を保存
  const [stepPrompts, setStepPrompts] = useState<{ [key: string]: string }>({});

  // 未完了タスクのみ抽出
  const incompleteTodos = todos.filter((t) => !t.completed);
  // estimatedTodosは廃止。incompleteTodosのみ使用
  const displayTodos: TodoWithEstimate[] = incompleteTodos;

  const handleClick = () => {
    const prompt =
      `あなたは優秀なスケジューラーです。${
        scheduleDate ? scheduleDate + "の" : ""
      }1日のスケジュール案を日本語で作成してください。\n\n` +
      `【要件】\n` +
      `- 優先度（high/medium/low）、期限（due_date）、所要時間、前後関係を考慮し、未完了タスクを優先的に組み込んでください。\n` +
      `- 期限が近いものや優先度が高いものは早めに実施してください。\n` +
      `- 1日に使える最大時間は${dayHours}時間（${dayHours * 60}分）です。絶対に超えないでください。\n` +
      `- できるだけ具体的な「開始時刻」「終了時刻」「所要時間（分）」を明記し、各タスクの理由や注意点も一言添えてください。\n` +
      `- 出力はタイムテーブル形式（例: 09:00-10:00）で、番号付きリストで記載してください。\n` +
      `- 出力例のフォーマットに従ってください。\n` +
      `\n【ToDoリスト】\n` +
      displayTodos
        .map(
          (t) =>
            `- タイトル: ${t.title}\n  詳細: ${t.description}\n  優先度: ${t.priority}\n  期限: ${
              t.due_date
            }\n  所要時間: ${
              "estimated_minutes" in t && t.estimated_minutes !== undefined ? t.estimated_minutes + "分" : "未推定"
            }`
        )
        .join("\n") +
      `\n\n【出力例】\n` +
      `1. 09:00-10:00（60分） タスク名（優先度: high, 期限: 2025-06-25）\n   - やるべき理由・注意点\n` +
      `2. 10:00-11:30（90分） タスク名（優先度: medium, 期限: 2025-06-26）\n   - やるべき理由・注意点\n` +
      `3. 13:00-14:00（60分） タスク名（優先度: low, 期限: 2025-06-27）\n   - やるべき理由・注意点\n`;
    setStepPrompts((prev) => ({ ...prev, simple: prompt }));
    askLLM(prompt);
    setRequested(true);
  };

  // 多段階スケジュール提案フロー
  const multiStepScheduleFlow = async () => {
    // 1. 所要時間推定
    setStep(0);
    setStepLoading("タスクの所要時間をAIが推定中...");
    setStepResult({});
    setStepInternalResult("");
    const estimatePrompt =
      `以下のToDoリストの各タスクについて、現実的な所要時間（分単位）を日本語で推定し、タイトルごとに「なぜその時間になると考えたか」も簡単に説明してください。\n` +
      `出力例:\n---\n【タスク名】牛乳を買う\n所要時間: 20分\n理由: スーパーが近く、買い物自体は短時間で済むため。\n\n【タスク名】レポート提出\n所要時間: 120分\n理由: 既に下書きがあるが、仕上げと見直しに時間がかかるため。\n---\n` +
      incompleteTodos.map((t) => `【タスク名】${t.title}\n詳細: ${t.description}`).join("\n");
    setStepPrompts((prev) => ({ ...prev, estimate: estimatePrompt }));
    await askLLM(estimatePrompt);
    setStepResult((prev) => ({ ...prev, estimate: result ?? undefined }));
    setStepInternalResult("");
    setStepLoading("");

    // 2. 抽象化（全体像の要約）
    setStep(1);
    setStepLoading("抽象化（全体像の要約）中...");
    let abstractPrompt = "あなたは優秀なスケジューラーです。\n";
    if (scheduleDate) {
      abstractPrompt +=
        `【重要】この要約・計画は必ず「${scheduleDate}」のためのものです。他の日付（24日、25日、26日など）は一切参照・記載しないでください。\n` +
        `あなたは今、「${scheduleDate}」の1日スケジュールのみを考えます。\n`;
    }
    abstractPrompt +=
      `【重要】この計画は「${dayHours}時間」分のスケジュールのみを立ててください。絶対に${dayHours}時間を超えないでください。\n` +
      `\n【ToDoリスト${scheduleDate ? `（${scheduleDate}計画用）` : ""}】\n` +
      incompleteTodos
        .map(
          (t) =>
            `- タイトル: ${t.title}\n  詳細: ${t.description}\n  優先度: ${t.priority}\n  期限: ${t.due_date}`
        )
        .join("\n") +
      `\n\n【所要時間推定結果】\n${result}\n` +
      `\n【出力指示】\n` +
      (scheduleDate
        ? `- 「${scheduleDate}」の計画であることを必ず明記してください。\n- 他の日付や過去のタスクは一切要約・計画に含めないでください。\n`
        : "") +
      `- 「${dayHours}時間」分の計画のみを立ててください。絶対に${dayHours}時間を超えないでください。\n- 全体像・目的・重要な観点を簡潔にまとめてください。\n` +
      (scheduleDate ? `\n【出力例】\n## ${scheduleDate}計画：要約\n...` : "");
    setStepPrompts((prev) => ({ ...prev, abstract: abstractPrompt }));
    await askLLM(abstractPrompt);
    setStepResult((prev) => ({ ...prev, abstract: result ?? undefined }));
    setStepInternalResult("");
    setStepLoading("");

    // 3. タスク選定
    setStep(2);
    setStepLoading("タスク選定（スケジュールに組み込むタスクの決定）中...");
    let selectPrompt = "あなたは優秀なスケジューラーです。\n";
    if (scheduleDate) {
      selectPrompt += `【重要】この選定は必ず「${scheduleDate}」のためのものです。他の日付は一切参照・記載しないでください。\n`;
    }
    selectPrompt +=
      `【重要】この選定は「${dayHours}時間」分のスケジュールのみを立てるためのものです。絶対に${dayHours}時間を超えないでください。\n` +
      `\n以下のToDoリスト（所要時間推定済み）から、${scheduleDate ? `「${scheduleDate}」` : ""}${dayHours}時間以内で現実的にスケジュールに組み込めるタスクのみを選定してください。\n` +
      `【所要時間推定結果】\n${stepResult.estimate}\n` +
      `【出力指示】\n` +
      `- 選定したタスクは「id, タイトル, estimated_minutes, 優先度, 期限, 選定理由」の形式で1行ずつ出力してください。\n- 除外したタスクも「id, タイトル, estimated_minutes, 優先度, 期限, 除外理由」の形式で1行ずつ出力してください。\n- 選定/除外の理由は必ず簡潔に記載してください。\n- 説明やコメントは不要です。\n` +
      incompleteTodos
        .map((t) => `${t.id}, ${t.title}, 未推定, ${t.priority}, ${t.due_date}`)
        .join("\n");
    setStepPrompts((prev) => ({ ...prev, select: selectPrompt }));
    await askLLM(selectPrompt);
    setStepResult((prev) => ({ ...prev, select: result ?? undefined }));
    setStepInternalResult("");
    setStepLoading("");

    // 4. 具体化
    setStep(3);
    setStepLoading("具体化（詳細なスケジュール案）作成中...");
    let concretePrompt = "あなたは優秀なスケジューラーです。\n";
    if (scheduleDate) {
      concretePrompt += `【重要】このスケジュール案は必ず「${scheduleDate}」のためのものです。他の日付は一切参照・記載しないでください。\n`;
    }
    concretePrompt +=
      `【重要】このスケジュール案は「${dayHours}時間」分のみを立ててください。絶対に${dayHours}時間を超えないでください。\n` +
      `\n以下のToDoリスト（原文）と抽象的要約、タスク選定結果、所要時間推定結果をもとに、${scheduleDate ? `「${scheduleDate}」` : ""}${dayHours}時間分の1日のスケジュール案を日本語で作成してください。\n` +
      `【所要時間推定結果】\n${stepResult.estimate}\n` +
      `【抽象的要約】\n${stepResult.abstract}\n` +
      `【タスク選定結果】\n${stepResult.select}\n` +
      `【出力指示】\n` +
      (scheduleDate
        ? `- 「${scheduleDate}」のスケジュールであることを必ず明記してください。\n- 抽象的要約・タスク選定結果の内容を必ず反映し、矛盾しないようにスケジュール案を作成してください。\n- 他の日付や過去のタスクは一切含めないでください。\n`
        : "") +
      `- 「${dayHours}時間」分の計画のみを立ててください。絶対に${dayHours}時間を超えないでください。\n- 各タスクの「開始時刻」「終了時刻」「所要時間（分）」「タスク名」「優先度」「期限」「理由・注意点」を明記したタイムテーブル形式で記載してください。\n- 時間帯（午前・午後・夜）ではなく、必ず時刻（例: 09:00-10:00）で記載してください。\n- 各タスクの「やるべき理由」「注意点」も必ず記載してください。\n- できるだけ詳細・具体的・厳密・逐次的に記述してください。\n- 最後に全体のポイントや注意事項を簡潔にまとめてください。\n` +
      `\n【ToDoリスト原文】\n` +
      incompleteTodos
        .map(
          (t) =>
            `- タイトル: ${t.title}\n  詳細: ${t.description}\n  優先度: ${t.priority}\n  期限: ${t.due_date}`
        )
        .join("\n");
    setStepPrompts((prev) => ({ ...prev, concrete: concretePrompt }));
    await askLLM(concretePrompt);
    setStepResult((prev) => ({ ...prev, concrete: result ?? undefined }));
    setStepInternalResult("");
    setStepLoading("");

    // 5. 推敲・レビュー以降は従来通り必要に応じて追加可能
  };

  // useEffectで段階的に進める
  useEffect(() => {
    // 所要時間推定結果を受け取る（自然言語応答をそのままstepResult.estimateに格納し、パースは行わない）
    if (stepInternalResult === "estimate" && result) {
      setStepResult((prev) => ({ ...prev, estimate: result }));
      setStepInternalResult("");
      setStepLoading("");
      // 推定後にフローを再開
      setTimeout(() => multiStepScheduleFlow(), 100);
      return;
    }
    // 1. 抽象化 → 2. タスク選定
    if (step === 1 && stepInternalResult === "abstract" && result) {
      setStepResult((prev) => ({ ...prev, abstract: result ?? undefined }));
      setStep(2);
      setStepLoading("タスク選定（スケジュールに組み込むタスクの決定）中...");
      // estimatedTodosは廃止。incompleteTodosのみ使用
      const todosForStep: TodoWithEstimate[] = incompleteTodos.map((t) => ({ ...t }));
      let selectPrompt = "あなたは優秀なスケジューラーです。\n";
      if (scheduleDate) {
        selectPrompt += `【重要】この選定は必ず「${scheduleDate}」のためのものです。他の日付は一切参照・記載しないでください。\n`;
      }
      selectPrompt +=
        `【重要】この選定は「${dayHours}時間」分のスケジュールのみを立てるためのものです。絶対に${dayHours}時間を超えないでください。\n` +
        `\n以下のToDoリスト（所要時間推定済み）から、${scheduleDate ? `「${scheduleDate}」` : ""}${dayHours}時間以内で現実的にスケジュールに組み込めるタスクのみを選定してください。\n` +
        `【所要時間推定結果】\n${stepResult.estimate}\n` +
        `【出力指示】\n` +
        `- 選定したタスクは「id, タイトル, estimated_minutes, 優先度, 期限, 選定理由」の形式で1行ずつ出力してください。\n- 除外したタスクも「id, タイトル, estimated_minutes, 優先度, 期限, 除外理由」の形式で1行ずつ出力してください。\n- 選定/除外の理由は必ず簡潔に記載してください。\n- 説明やコメントは不要です。\n` +
        todosForStep
          .map((t) => `${t.id}, ${t.title}, 未推定, ${t.priority}, ${t.due_date}`)
          .join("\n");
      setStepPrompts((prev) => ({ ...prev, select: selectPrompt }));
      askLLM(selectPrompt);
      setStepInternalResult("select");
      return;
    }
    // 2. タスク選定 → 3. 具体化
    if (step === 2 && stepInternalResult === "select" && result) {
      setStepResult((prev) => ({ ...prev, select: result ?? undefined }));
      setStep(3);
      setStepLoading("具体化（詳細なスケジュール案）作成中...");
      // estimatedTodosは廃止。incompleteTodosのみ使用
      const todosForStep: TodoWithEstimate[] = incompleteTodos.map((t) => ({ ...t }));
      let concretePrompt = "あなたは優秀なスケジューラーです。\n";
      if (scheduleDate) {
        concretePrompt += `【重要】このスケジュール案は必ず「${scheduleDate}」のためのものです。他の日付は一切参照・記載しないでください。\n`;
      }
      concretePrompt +=
        `【重要】このスケジュール案は「${dayHours}時間」分のみを立ててください。絶対に${dayHours}時間を超えないでください。\n` +
        `\n以下のToDoリスト（原文）と抽象的要約、タスク選定結果、所要時間推定結果をもとに、${
          scheduleDate ? `「${scheduleDate}」` : ""
        }${dayHours}時間分の1日のスケジュール案を日本語で作成してください。\n` +
        `【所要時間推定結果】\n${stepResult.estimate}\n` +
        `【抽象的要約】\n${stepResult.abstract}\n` +
        `【タスク選定結果】\n${stepResult.select}\n` +
        `【出力指示】\n` +
        (scheduleDate
          ? `- 「${scheduleDate}」のスケジュールであることを必ず明記してください。\n- 抽象的要約・タスク選定結果の内容を必ず反映し、矛盾しないようにスケジュール案を作成してください。\n- 他の日付や過去のタスクは一切含めないでください。\n`
          : "") +
        `- 「${dayHours}時間」分の計画のみを立ててください。絶対に${dayHours}時間を超えないでください。\n- 各タスクの「開始時刻」「終了時刻」「所要時間（分）」「タスク名」「優先度」「期限」「理由・注意点」を明記したタイムテーブル形式で記載してください。\n- 時間帯（午前・午後・夜）ではなく、必ず時刻（例: 09:00-10:00）で記載してください。\n- 各タスクの「やるべき理由」「注意点」も必ず記載してください。\n- できるだけ詳細・具体的・厳密・逐次的に記述してください。\n- 最後に全体のポイントや注意事項を簡潔にまとめてください。\n` +
        `\n【ToDoリスト原文】\n` +
        todosForStep
          .map(
            (t: TodoWithEstimate) =>
              `- タイトル: ${t.title}\n  詳細: ${t.description}\n  優先度: ${t.priority}\n  期限: ${
                t.due_date
              }\n  所要時間: ${typeof t.estimated_minutes === "number" ? t.estimated_minutes + "分" : "未推定"}`
          )
          .join("\n");
      setStepPrompts((prev) => ({ ...prev, concrete: concretePrompt }));
      askLLM(concretePrompt);
      setStepInternalResult("concrete");
      return;
    }
    // 2. 具体化 → 3. 推敲
    else if (step === 2 && stepInternalResult === "concrete" && result) {
      setStepResult((prev) => ({ ...prev, concrete: result }));
      setStep(3);
      setStepLoading("推敲（レビュー・改善案）中...");
      let reviewPrompt = "";
      if (scheduleDate) {
        reviewPrompt += `【重要】このレビューは「${scheduleDate}」のスケジュール案のみを対象とします。他の日付は一切参照・記載しないでください。\n`;
      }
      reviewPrompt +=
        `以下のスケジュール案をレビューし、改善点や抜け漏れ・矛盾・より良い案があれば指摘してください。\n` +
        `【スケジュール案】\n${result}\n`;
      setStepPrompts((prev) => ({ ...prev, review: reviewPrompt }));
      askLLM(reviewPrompt);
      setStepInternalResult("review");
    }
    // 3. 推敲 → 4. 再抽象化
    else if (step === 3 && stepInternalResult === "review" && result) {
      setStepResult((prev) => ({ ...prev, review: result }));
      setStep(4);
      setStepLoading("再抽象化（全体の再整理）中...");
      let reabstractPrompt = "";
      if (scheduleDate) {
        reabstractPrompt += `【重要】この再抽象化は「${scheduleDate}」のスケジュール案のみを対象とします。他の日付は一切参照・記載しないでください。\n`;
      }
      reabstractPrompt +=
        `以下のレビュー内容をもとに、全体像や目的・優先事項を再度抽象的にまとめ直してください。\n` +
        `【レビュー内容】\n${result}\n`;
      setStepPrompts((prev) => ({ ...prev, reabstract: reabstractPrompt }));
      askLLM(reabstractPrompt);
      setStepInternalResult("reabstract");
    }
    // 4. 再抽象化 → 5. 最終具体化
    else if (step === 4 && stepInternalResult === "reabstract" && result) {
      setStepResult((prev) => ({ ...prev, reabstract: result }));
      setStep(5);
      setStepLoading("最終スケジュール案を作成中...");
      let finalPrompt = "あなたは優秀なスケジューラーです。\n";
      if (scheduleDate) {
        finalPrompt += `【重要】この最終スケジュール案は必ず「${scheduleDate}」のためのものです。他の日付は一切参照・記載しないでください。\n`;
      }
      finalPrompt +=
        `以下のToDoリスト（原文）、再抽象化要約、レビュー内容をもとに、${
          scheduleDate ? `「${scheduleDate}」` : ""
        }最終的な1日のスケジュール案を日本語で作成してください。\n` +
        `【出力指示】\n` +
        (scheduleDate
          ? `- 「${scheduleDate}」のスケジュールであることを必ず明記してください。\n- 再抽象化要約・レビュー内容を必ず反映し、矛盾しないようにスケジュール案を作成してください。\n- 他の日付や過去のタスクは一切含めないでください。\n`
          : "") +
        `- 時間帯ごと（午前・午後・夜）に分け、各時間帯ごとに「タスク名」「優先度」「期限」「理由・注意点」を明記した番号付きリストで記載してください。\n- 各タスクの「やるべき理由」「注意点」「推奨開始時刻」も必ず記載してください。\n- できるだけ詳細・具体的・厳密・逐次的に記述してください。\n- 最後に全体のポイントや注意事項を簡潔にまとめてください。\n` +
        `\n【ToDoリスト原文】\n` +
        incompleteTodos
          .map(
            (t) => `- タイトル: ${t.title}\n  詳細: ${t.description}\n  優先度: ${t.priority}\n  期限: ${t.due_date}`
          )
          .join("\n") +
        `\n【再抽象化要約】\n${result}\n` +
        `\n【レビュー内容】\n${stepResult.review || ""}\n`;
      setStepPrompts((prev) => ({ ...prev, final: finalPrompt }));
      askLLM(finalPrompt);
      setStepInternalResult("final");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result, step, stepInternalResult, scheduleDate, dayHours]);

  return (
    <div style={{ margin: "1em 0", padding: "1em", border: "1px solid #ccc", borderRadius: 8 }}>
      <div>
        <b>１日のスケジュールをAIが提案</b>
      </div>
      {/* ...既存ボタン... */}
      <button onClick={handleClick} disabled={loading} style={{ marginBottom: "1em" }}>
        AIによるスケジュール提案を表示
      </button>
      {/* 多段階フロー用ボタン */}
      <button
        onClick={multiStepScheduleFlow}
        disabled={loading || !!stepLoading}
        style={{ marginLeft: 8, marginBottom: "1em" }}
      >
        多段階AIスケジュール提案フロー
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
      {stepPrompts.estimate && (
        <div style={{ margin: "1em 0" }}>
          <strong>所要時間推定プロンプト:</strong>
          <pre style={{ whiteSpace: "pre-wrap", background: "#f6f6f6", padding: "0.5em", borderRadius: 4 }}>
            {stepPrompts.estimate}
          </pre>
          {stepResult.estimate && (
            <>
              <strong>AI応答:</strong>
              <pre style={{ whiteSpace: "pre-wrap", background: "#f9f9f9", padding: "0.5em", borderRadius: 4 }}>
                {stepResult.estimate}
              </pre>
            </>
          )}
        </div>
      )}
      {stepPrompts.abstract && (
        <div style={{ margin: "1em 0" }}>
          <strong>抽象化プロンプト:</strong>
          <pre style={{ whiteSpace: "pre-wrap", background: "#f6f6f6", padding: "0.5em", borderRadius: 4 }}>
            {stepPrompts.abstract}
          </pre>
          {stepResult.abstract && (
            <>
              <strong>AI応答:</strong>
              <pre style={{ whiteSpace: "pre-wrap", background: "#f9f9f9", padding: "0.5em", borderRadius: 4 }}>
                {stepResult.abstract}
              </pre>
            </>
          )}
        </div>
      )}
      {stepPrompts.select && (
        <div style={{ margin: "1em 0" }}>
          <strong>タスク選定プロンプト:</strong>
          <pre style={{ whiteSpace: "pre-wrap", background: "#f6f6f6", padding: "0.5em", borderRadius: 4 }}>
            {stepPrompts.select}
          </pre>
          {stepResult.select && (
            <>
              <strong>AI応答:</strong>
              <pre style={{ whiteSpace: "pre-wrap", background: "#f9f9f9", padding: "0.5em", borderRadius: 4 }}>
                {stepResult.select}
              </pre>
            </>
          )}
        </div>
      )}
      {stepPrompts.concrete && (
        <div style={{ margin: "1em 0" }}>
          <strong>具体化プロンプト:</strong>
          <pre style={{ whiteSpace: "pre-wrap", background: "#f6f6f6", padding: "0.5em", borderRadius: 4 }}>
            {stepPrompts.concrete}
          </pre>
          {stepResult.concrete && (
            <>
              <strong>AI応答:</strong>
              <pre style={{ whiteSpace: "pre-wrap", background: "#f9f9f9", padding: "0.5em", borderRadius: 4 }}>
                {stepResult.concrete}
              </pre>
            </>
          )}
        </div>
      )}
      {stepPrompts.review && (
        <div style={{ margin: "1em 0" }}>
          <strong>レビュー・推敲プロンプト:</strong>
          <pre style={{ whiteSpace: "pre-wrap", background: "#f6f6f6", padding: "0.5em", borderRadius: 4 }}>
            {stepPrompts.review}
          </pre>
          {stepResult.review && (
            <>
              <strong>AI応答:</strong>
              <pre style={{ whiteSpace: "pre-wrap", background: "#f9f9f9", padding: "0.5em", borderRadius: 4 }}>
                {stepResult.review}
              </pre>
            </>
          )}
        </div>
      )}
      {stepPrompts.reabstract && (
        <div style={{ margin: "1em 0" }}>
          <strong>再抽象化プロンプト:</strong>
          <pre style={{ whiteSpace: "pre-wrap", background: "#f6f6f6", padding: "0.5em", borderRadius: 4 }}>
            {stepPrompts.reabstract}
          </pre>
          {stepResult.reabstract && (
            <>
              <strong>AI応答:</strong>
              <pre style={{ whiteSpace: "pre-wrap", background: "#f9f9f9", padding: "0.5em", borderRadius: 4 }}>
                {stepResult.reabstract}
              </pre>
            </>
          )}
        </div>
      )}
      {stepPrompts.final && (
        <div style={{ margin: "1em 0" }}>
          <strong>最終スケジュール案プロンプト:</strong>
          <pre style={{ whiteSpace: "pre-wrap", background: "#f6f6f6", padding: "0.5em", borderRadius: 4 }}>
            {stepPrompts.final}
          </pre>
          {stepResult.final && (
            <>
              <strong>AI応答:</strong>
              <pre style={{ whiteSpace: "pre-wrap", background: "#f9f9f9", padding: "0.5em", borderRadius: 4 }}>
                {stepResult.final}
              </pre>
            </>
          )}
        </div>
      )}
      {/* ...既存の旧3段階フローやシンプルなAI応答UI... */}
      {loading && <div>AIがスケジュールを考えています...</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
      {requested && !loading && result && (
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
