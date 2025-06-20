import { TodoType } from "./apiClient";

// APIのベースURL
const API_BASE = "http://localhost:3001/todos";

// ToDoリスト全件取得
export async function fetchTodoList(): Promise<TodoType[]> {
  const res = await fetch(API_BASE, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch todos");
  return res.json();
}

// ToDo新規作成
export async function createTodo(todo: Omit<TodoType, "id">): Promise<TodoType> {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(todo),
  });
  if (!res.ok) throw new Error("Failed to create todo");
  return res.json();
}

// ToDo更新
export async function updateTodo(id: string, todo: Partial<TodoType>): Promise<TodoType> {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(todo),
  });
  if (!res.ok) throw new Error("Failed to update todo");
  return res.json();
}

// ToDo削除
export async function deleteTodo(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete todo");
}
