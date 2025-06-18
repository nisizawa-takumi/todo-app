import type { TodoType } from "../../../lib/todo/apiClient";
import TodoTitle from "./title";
import TodoDescription from "./description";
import CompletedCheckbox from "./completed";
import TodoDueDate from "./dueDate";
// Todoコンポーネントのprops型定義
export type TodoPropsType = {
  data: TodoType; // 表示するタスクデータ
  updateOneLocal: (newTodo: TodoType) => void;
  deleteOne: (id: string) => void;
};

export default function TodoItem({ data: todoItem, updateOneLocal, deleteOne }: TodoPropsType) {
  return (
    <div className="list-item">
      <TodoTitle todoItem={todoItem} updateOneLocal={updateOneLocal} variant="cool" />
      <TodoDescription todoItem={todoItem} updateOneLocal={updateOneLocal} variant="cool" size="medium" />
      <CompletedCheckbox todoItem={todoItem} updateOneLocal={updateOneLocal} variant="cool" size="small" />
      <TodoDueDate todoItem={todoItem} updateOneLocal={updateOneLocal} variant="cool" size="small" />
      <button onClick={() => deleteOne(todoItem.id)}>削除</button>
    </div>
  );
}
