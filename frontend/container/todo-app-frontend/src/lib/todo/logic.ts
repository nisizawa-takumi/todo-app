import { fetchTodoList, createTodo, updateTodo, deleteTodo, TodoType } from "@/lib/todo/apiClient";

/**
 * クライアント側のtodoListのstateをDBと同期する
 * - DB側に存在しないものは新規作成
 * - DB側に存在してクライアントと内容が違うものは更新
 * - クライアント側に存在しないDBのtodoは削除
 */
export async function syncTodoListWithDB(clientTodos: TodoType[]): Promise<void> {
  // 1. サーバー側の最新状態を取得
  const serverTodos = await fetchTodoList();

  // 2. idでマップを作成
  const clientMap = new Map(clientTodos.map((todo) => [todo.id, todo]));
  const serverMap = new Map(serverTodos.map((todo) => [todo.id, todo]));

  // 3. 新規作成・更新
  for (const clientTodo of clientTodos) {
    const serverTodo = serverMap.get(clientTodo.id);
    if (!serverTodo) {
      // サーバーに存在しない → 新規作成
      // idはサーバーで自動発番の場合はidを除いて送る
      const { id, ...rest } = clientTodo;
      await createTodo(rest as Omit<TodoType, "id">);
    } else {
      // サーバーに存在し内容が違う → 更新
      // 差分チェック（簡易的にJSON文字列比較）
      if (JSON.stringify(serverTodo) !== JSON.stringify(clientTodo)) {
        await updateTodo(clientTodo.id, clientTodo);
      }
    }
  }

  // 4. クライアントに存在しないサーバーのtodoは削除
  for (const serverTodo of serverTodos) {
    if (!clientMap.has(serverTodo.id)) {
      await deleteTodo(serverTodo.id);
    }
  }
}
