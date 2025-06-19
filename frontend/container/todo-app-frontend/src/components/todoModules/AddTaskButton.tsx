import React from "react";
import { v4 as uuidv4 } from "uuid";
import type { TodoType } from "../../lib/todo/apiClient";

type AddTaskButtonProps = {
  addOne: (newTodo: TodoType) => Promise<void>;
  setError?: React.Dispatch<React.SetStateAction<string | null>>;
};
const allowedPriorities = ["high", "medium", "low"] as const;
type Priority = (typeof allowedPriorities)[number];
/**型ガード関数というものらしい*/
function isPriority(value: string): value is Priority {
  return allowedPriorities.includes(value as Priority);
}

const AddTaskButton: React.FC<AddTaskButtonProps> = ({ addOne, setError = () => {} }) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const titleElement = form.elements.namedItem("title") as HTMLInputElement;
        const titleValue = titleElement.value.trim() || "";
        const descriptionElement = form.elements.namedItem("description") as HTMLInputElement;
        const descriptionValue = descriptionElement.value.trim() || "";
        const priorityElement = form.elements.namedItem("priority") as HTMLInputElement;
        const rawPriorityValue = priorityElement.value.trim();
        const priorityValue = isPriority(rawPriorityValue) ? (rawPriorityValue as "high" | "medium" | "low") : "medium";
        const dueDateElement = form.elements.namedItem("due_date") as HTMLInputElement;
        const dueDateValue = dueDateElement.value || "";

        if (titleValue) {
          addOne({
            id: uuidv4(),
            title: titleValue,
            description: descriptionValue,
            completed: false,
            priority: priorityValue,
            due_date: dueDateValue,
          })
            .then(() => form.reset())
            .catch((err) => setError(err.message));
        } else {
          alert("タイトルを入力してください。"); //※ formにrequiredがついてるので普通どうやっても出ない
        }
      }}
    >
      新しいタスクを追加:
      <input type="text" name="title" placeholder="タイトル" required />
      <input type="text" name="description" placeholder="説明" />
      <select name="priority" defaultValue="medium">
        <option value="high">高</option>
        <option value="medium">中</option>
        <option value="low">低</option>
      </select>
      <input type="date" name="due_date" placeholder="期限日" />
      <button type="submit">追加</button>
    </form>
  );
};

export default AddTaskButton;
