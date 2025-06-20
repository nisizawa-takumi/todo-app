import { TodoType } from "./apiClient";

const API_BASE = "http://localhost:4000";

// 全件取得
export async function fetchTodoList(): Promise<TodoType[]> {
  const res = await fetch(`${API_BASE}/allTodos`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch todos");
  return res.json();
}

// 新規作成
export async function createTodo(todo: Omit<TodoType, "id"> & { userId: string }): Promise<TodoType> {
  const res = await fetch(`${API_BASE}/createTodo`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(todo),
  });
  if (!res.ok) throw new Error("Failed to create todo");
  return res.json();
}

// 更新
export async function updateTodo(id: string, todo: Partial<TodoType>): Promise<TodoType> {
  const res = await fetch(`${API_BASE}/editTodo/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(todo),
  });
  if (!res.ok) throw new Error("Failed to update todo");
  return res.json();
}

// 削除
export async function deleteTodo(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/deleteTodo/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete todo");
}
