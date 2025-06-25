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

// サーバーAPI互換の返り値型
type BulkUpdateTodosResponse = { success: true; data: { message: string } };

/**
 * クライアント側のtodoListのstateをDBと同期する
 * - DB側に存在しないものは新規作成
 * - DB側に存在してクライアントと内容が違うものは更新
 * - クライアント側に存在しないDBのtodoは削除
 * サーバーAPI互換のため返り値形式を統一
 */
export async function bulkUpdateTodos(clientTodos: TodoType[]): Promise<BulkUpdateTodosResponse> {
  // 1. サーバー側の最新状態を取得
  const serverTodos = await fetchTodoList();

  // 2. サーバー内のtodoをすべて削除
  for (const serverTodo of serverTodos) {
    await deleteTodo(serverTodo.id);
  }

  // 3. クライアントのtodoをすべて新規作成
  for (const clientTodo of clientTodos) {
    const todoForCreate = { ...clientTodo } as Partial<TodoType>;
    delete todoForCreate.id;
    await createTodo(todoForCreate as Omit<TodoType, "id">);
  }
  // サーバーAPI互換の返り値形式
  return { success: true, data: { message: "一括更新完了" } };
}
