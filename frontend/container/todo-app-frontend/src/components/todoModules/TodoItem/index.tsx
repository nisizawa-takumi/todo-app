import type { TodoType } from "../../../lib/todo/apiClient";
import TodoTitle from "./title";
import TodoDescription from "./description";
import TodoCompleted from "./completed";
import TodoDueDate from "./dueDate";
import TodoPriority from "./priority";
import TodoDelete from "./deleteButton";
// Todoコンポーネントのprops型定義
export type TodoPropsType = {
  data: TodoType; // 表示するタスクデータ
  updateOneLocal: (newTodo: TodoType) => void;
  deleteOneLocal: (id: string) => void;
};

export default function TodoItem({ data: todoItem, updateOneLocal, deleteOneLocal }: TodoPropsType) {
  return (
    <div className="list-item">
      <TodoTitle todoItem={todoItem} updateOneLocal={updateOneLocal} variant="cool" />
      <TodoDescription todoItem={todoItem} updateOneLocal={updateOneLocal} variant="cool" size="medium" />
      <TodoCompleted todoItem={todoItem} updateOneLocal={updateOneLocal} variant="cool" size="small" />
      <TodoDueDate todoItem={todoItem} updateOneLocal={updateOneLocal} variant="cool" size="small" />
      <TodoPriority todoItem={todoItem} updateOneLocal={updateOneLocal} variant="cool" size="small" />
      <TodoDelete todoItem={todoItem} deleteOneLocal={deleteOneLocal} variant="cool" size="small" />
    </div>
  );
}
