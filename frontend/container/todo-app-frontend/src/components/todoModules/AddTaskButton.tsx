import React from "react";
import { v4 as uuidv4 } from "uuid";
import type { TodoType } from "../../lib/todo/apiClient";

const allowedPriorities = ["high", "medium", "low"] as const;
type Priority = (typeof allowedPriorities)[number];
function isPriority(value: string): value is Priority {
  return allowedPriorities.includes(value as Priority);
}

type AddTaskButtonProps = {
  addOne: (newTodo: TodoType) => Promise<void>;
  setError?: React.Dispatch<React.SetStateAction<string | null>>;
};

const AddTaskButton: React.FC<AddTaskButtonProps> = ({ addOne, setError = () => {} }) => {
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [priority, setPriority] = React.useState<Priority>("medium");
  const [dueDate, setDueDate] = React.useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await addOne({
        id: uuidv4(),
        title: title.trim(),
        description: description.trim(),
        completed: false,
        priority,
        due_date: dueDate,
      });
      setTitle("");
      setDescription("");
      setPriority("medium");
      setDueDate("");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err));
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      新しいタスクを追加:
      <input type="text" name="title" placeholder="タイトル" value={title} onChange={(e) => setTitle(e.target.value)} />
      <input
        type="text"
        name="description"
        placeholder="説明"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <select
        name="priority"
        value={priority}
        onChange={(e) => setPriority(isPriority(e.target.value) ? e.target.value : "medium")}
      >
        <option value="high">高</option>
        <option value="medium">中</option>
        <option value="low">低</option>
      </select>
      <input
        type="date"
        name="due_date"
        placeholder="期限日"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />
      <button type="submit">追加</button>
    </form>
  );
};

export default AddTaskButton;
