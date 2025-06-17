import type { TodoType } from "../../../lib/todo/apiClient";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import TodoTitle from "@/components/todoModules/TodoItem/title";

// Todoコンポーネントのprops型定義
export type TodoPropsType = {
  data: TodoType; // 表示するタスクデータ
  updateOneLocal: (newTodo: TodoType) => void;
  deleteOne: (id: string) => void;
};

export default function TodoItem({ data: todoItem, updateOneLocal, deleteOne }: TodoPropsType) {
  return (
    <div className="list-item">
      <TodoTitle todoItem={todoItem} updateOneLocal={updateOneLocal} variant="standard" />
      {/* 説明表示 */}
      <label htmlFor={`description-${todoItem.id}`} aria-label={todoItem.title}>
        説明
        <input
          type="text"
          value={todoItem.description}
          name="description"
          id={`description-${todoItem.id}`}
          onChange={(e) => updateOneLocal({ ...todoItem, description: e.target.value })}
        />
      </label>
      {/* 完了表示 */}
      <FormControlLabel
        label="完了"
        labelPlacement="start"
        control={
          <Checkbox
            checked={todoItem.completed}
            onChange={(e) => updateOneLocal({ ...todoItem, completed: e.target.checked })}
            name="completed"
            color="primary"
          />
        }
      />
      <button onClick={() => deleteOne(todoItem.id)}>削除</button>
    </div>
  );
}
