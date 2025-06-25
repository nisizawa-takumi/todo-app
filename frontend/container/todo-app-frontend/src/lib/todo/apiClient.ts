import * as jsonserver from "./jsonserver";
import * as backend from "./backend";
import { v4 as uuidv4 } from "uuid";
// 切り替え用フラグ
const USE_JSONSERVER = false;

// Todo型: 1つのToDoアイテムを表現する型定義
export type TodoType = {
  id: string; // ToDoの一意なID
  title: string; // タイトル
  description: string; // 詳細説明
  completed: boolean; // 完了フラグ
  priority: "high" | "medium" | "low"; // 優先度（"high", "medium", "low" の3択）
  due_date: string; // 期限日（ISO8601形式の文字列）
};

/**
 * ToDoリスト全件取得
 * GET /api/todos
 * @returns Todo型の配列
 */
export async function fetchTodoList(): Promise<TodoType[]> {
  return USE_JSONSERVER ? jsonserver.fetchTodoList() : backend.fetchTodoList();
}

/**
 * ToDo新規作成
 * POST /api/todos
 * @param todo idを除いたTodoデータ
 * @returns 作成されたTodo
 */
export async function createTodo(todo: Omit<TodoType, "id"> & { userId?: string }): Promise<TodoType> {
  return USE_JSONSERVER ? jsonserver.createTodo(todo) : backend.createTodo({ ...todo, userId: uuidv4() }); //TODO: ユーザID機能実装
}

/**
 * ToDo更新（完了/編集）
 * PUT /api/todos/:id
 * @param id 更新対象のTodoのID
 * @param todo 更新内容（部分的なデータでOK）
 * @returns 更新後のTodo
 */
export async function updateTodo(id: string, todo: Partial<TodoType>): Promise<TodoType> {
  return USE_JSONSERVER ? jsonserver.updateTodo(id, todo) : backend.updateTodo(id, todo);
}

/**
 * ToDo削除
 * DELETE /api/todos/:id
 * @param id 削除対象のTodoのID
 */
export async function deleteTodo(id: string): Promise<void> {
  return USE_JSONSERVER ? jsonserver.deleteTodo(id) : backend.deleteTodo(id);
}

/**
 * ToDo一括更新
 * POST /api/bulkUpdateTodos
 * @param todos 更新後のTodo配列
 * @returns サーバーレスポンス（例: { message: string }）
 */
export async function bulkUpdateTodos(todos: TodoType[]) {
  return USE_JSONSERVER ? jsonserver.bulkUpdateTodos(todos) : backend.bulkUpdateTodos(todos);
}
