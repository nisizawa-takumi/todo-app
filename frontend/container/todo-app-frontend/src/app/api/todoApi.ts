// Todo型: 1つのToDoアイテムを表現する型定義
export type Todo = {
  id: number; // ToDoの一意なID
  title: string; // タイトル
  description: string; // 詳細説明
  completed: boolean; // 完了フラグ
  priority: string; // 優先度（例: "high", "medium", "low"）
  tags: string[]; // タグの配列
  due_date: string; // 期限日（ISO8601形式の文字列）
};

// APIのベースURL。
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "/api/todos";

/**
 * ToDoリスト全件取得
 * GET /api/todos
 * @returns Todo型の配列
 */
export async function fetchTodos(): Promise<Todo[]> {
  // fetchでAPIにリクエスト。cache: "no-store"でキャッシュを無効化
  const res = await fetch(API_BASE, { cache: "no-store" });
  // レスポンスが正常でなければエラーを投げる
  if (!res.ok) throw new Error("Failed to fetch todos");
  // レスポンスボディをJSONとして返す
  return res.json();
}

/**
 * ToDo新規作成
 * POST /api/todos
 * @param todo idを除いたTodoデータ
 * @returns 作成されたTodo
 */
export async function createTodo(todo: Omit<Todo, "id">): Promise<Todo> {
  // fetchでPOSTリクエスト。Content-TypeはJSON
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(todo), // ボディにtodoデータをJSONで送信
  });
  // レスポンスが正常でなければエラー
  if (!res.ok) throw new Error("Failed to create todo");
  // 作成されたTodoを返す
  return res.json();
}

/**
 * ToDo更新（完了/編集）
 * PUT /api/todos/:id
 * @param id 更新対象のTodoのID
 * @param todo 更新内容（部分的なデータでOK）
 * @returns 更新後のTodo
 */
export async function updateTodo(id: number, todo: Partial<Todo>): Promise<Todo> {
  // fetchでPUTリクエスト。Content-TypeはJSON
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(todo), // 更新内容をJSONで送信
  });
  // レスポンスが正常でなければエラー
  if (!res.ok) throw new Error("Failed to update todo");
  // 更新後のTodoを返す
  return res.json();
}

/**
 * ToDo削除
 * DELETE /api/todos/:id
 * @param id 削除対象のTodoのID
 */
export async function deleteTodo(id: number): Promise<void> {
  // fetchでDELETEリクエスト
  const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
  // レスポンスが正常でなければエラー
  if (!res.ok) throw new Error("Failed to delete todo");
  // 削除は返り値なし
}
