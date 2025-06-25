import { TodoType } from "./apiClient";

const API_BASE = "http://localhost:4000";

// 全件取得
export async function fetchTodoList(): Promise<TodoType[]> {
  const res = await fetch(`${API_BASE}/allTodos`, { cache: "no-store", credentials: "include" });
  const json = await res.json();
  if (!res.ok || json.success === false) throw new Error(json.error || "Failed to fetch todos");
  if (!Array.isArray(json.data)) throw new Error("APIレスポンスにdata配列がありません");
  return json.data;
}

// 新規作成
export async function createTodo(todo: Omit<TodoType, "id"> & { userId: string }): Promise<TodoType> {
  console.log(todo);
  const res = await fetch(`${API_BASE}/createTodo`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(todo),
  });
  const json = await res.json();
  if (!res.ok || json.success === false) throw new Error(json.error || "Failed to create todo");
  if (!json.data) throw new Error("APIレスポンスにdataがありません");
  return json.data;
}

// 更新
export async function updateTodo(id: string, todo: Partial<TodoType>): Promise<TodoType> {
  const res = await fetch(`${API_BASE}/editTodo/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(todo),
  });
  const json = await res.json();
  if (!res.ok || json.success === false) throw new Error(json.error || "Failed to update todo");
  if (!json.data) throw new Error("APIレスポンスにdataがありません");
  return json.data;
}

// 削除
export async function deleteTodo(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/deleteTodo/${id}`, { method: "DELETE", credentials: "include" });
  const json = await res.json();
  if (!res.ok || json.success === false) throw new Error(json.error || "Failed to delete todo");
}

// 一括更新
export async function bulkUpdateTodos(todos: TodoType[]) {
  const res = await fetch(`${API_BASE}/bulkUpdateTodos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ todos }),
  });
  const json = await res.json();
  if (!res.ok || json.success === false) throw new Error(json.error || "Failed to bulk update todos");
  if (!json.data || !json.data.message) throw new Error("APIレスポンスにmessageがありません");
  console.log("in backBulk", json);
  return json.data;
}
