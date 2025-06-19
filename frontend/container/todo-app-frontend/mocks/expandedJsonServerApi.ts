import { fetchTodoList, createTodo, deleteTodo, TodoType } from "@/lib/todo/apiClient";

/**
 * クライアント側のtodoListのstateをDBと同期する
 * - DB側に存在しないものは新規作成
 * - DB側に存在してクライアントと内容が違うものは更新
 * - クライアント側に存在しないDBのtodoは削除
 */
export async function MOCK_syncTodoListWithDB(clientTodos: TodoType[]): Promise<TodoType[]> {
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
  const newServerTodos = await fetchTodoList();
  return newServerTodos;
}
