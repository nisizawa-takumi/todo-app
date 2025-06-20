import { createTodo, updateTodo as updateTodoApi, deleteTodo, TodoType } from "@/lib/todo/apiClient";
import { v4 as uuidv4 } from "uuid";
import { MOCK_syncTodoListWithDB } from "../../mocks/expandedJsonServerApi";
import { TODO_UPDATE_INTERVAL_MS } from "@/constants/timing";
/** syncMode: "local"（ローカルのみ） or "api"（都度DB同期）
 * 補足:addTodoやupdateOneなどの関数はPromiseを返すので、呼び出し側（コンポーネント）で.catch()やtry-catchでエラーを捕捉できます。
エラーを捕捉したら、コンポーネント内のerror用state（例：const [error, setError] = useState<string | null>(null)）を更新します。
再描画時にif (error) { ...エラー画面... }のように分岐してエラー表示すればOKです。
*/
export function useTodoCrud(
  clientTodoList: TodoType[],
  setClientTodoList: React.Dispatch<React.SetStateAction<TodoType[]>>,
  syncMode: "local" | "api" = "local"
) {
  if (syncMode !== "local" && syncMode !== "api") {
    throw new Error(`useTodoCrud: 不明なsyncMode "${syncMode}" が渡されました`);
  }

  // 追加
  const addOne = async (newTodo: Omit<TodoType, "id">) => {
    if (syncMode === "local") {
      const fakeId = uuidv4();
      setClientTodoList((prev) => [...prev, { ...newTodo, id: fakeId }]);
    } else {
      const created = await createTodo(newTodo);
      setClientTodoList((prev) => [...prev, created]);
    }
  };

  // 更新
  const updateOne = async (newTodo: TodoType) => {
    if (syncMode === "local") {
      setClientTodoList((todoList) => todoList.map((todo) => (todo.id === newTodo.id ? { ...newTodo } : todo)));
    } else {
      const updated = await updateTodoApi(newTodo.id, newTodo);
      setClientTodoList((todoList) => todoList.map((todo) => (todo.id === updated.id ? updated : todo)));
    }
  };

  // 削除
  const deleteOne = async (id: string) => {
    if (syncMode === "local") {
      setClientTodoList((tasks) => tasks.filter((task) => task.id !== id));
    } else {
      await deleteTodo(id);
      setClientTodoList((tasks) => tasks.filter((task) => task.id !== id));
    }
  };

  const syncTodos = async (todosToSync: TodoType[]) => {
    await new Promise((resolve) => setTimeout(resolve, TODO_UPDATE_INTERVAL_MS));
    setClientTodoList(await MOCK_syncTodoListWithDB(todosToSync));
  };

  return {
    clientTodoList,
    /** ※ DB側Todoリストにクライアント側Todoリスト(state)を強制的に上書き*/
    syncTodos,
    addOne,
    updateOne,
    deleteOne,
  };
}
