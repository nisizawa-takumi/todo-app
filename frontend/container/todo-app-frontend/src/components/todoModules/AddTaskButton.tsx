/** @jsxImportSource @emotion/react */
import React from "react";
import { v4 as uuidv4 } from "uuid";
import type { TodoType } from "../../lib/todo/apiClient";
import { css } from "@emotion/react";

const allowedPriorities = ["high", "medium", "low"] as const;
type Priority = (typeof allowedPriorities)[number];
function isPriority(value: string): value is Priority {
  return allowedPriorities.includes(value as Priority);
}

type AddTaskButtonProps = {
  addOne: (newTodo: TodoType) => Promise<void>;
  setError?: React.Dispatch<React.SetStateAction<string | null>>;
  variant?: "outlined" | "filled" | "standard" | "cool";
  color?: "primary" | "secondary" | "error" | "info" | "success" | "warning";
  size?: "small" | "medium";
  className?: string;
  style?: React.CSSProperties;
};

const variantStyles = {
  outlined: css`
    background: #fff;
    border-radius: 6px;
    box-shadow: 0 2px 8px rgba(25, 118, 210, 0.1), 0 1.5px 4px rgba(0, 0, 0, 0.06);
  `,
  filled: css`
    background: #f5f5f5;
    border-radius: 6px;
    box-shadow: 0 2px 8px rgba(25, 118, 210, 0.1), 0 1.5px 4px rgba(0, 0, 0, 0.06);
  `,
  standard: css`
    border-bottom: 2px solid #1976d2;
    box-shadow: 0 1px 4px rgba(25, 118, 210, 0.08);
  `,
  cool: css`
    background: linear-gradient(90deg, #e0f7fa 0%, rgba(255, 239, 243, 0.7) 100%);
    border-radius: 14px;
    box-shadow: 0 4px 16px rgba(0, 188, 212, 0.18), 0 2px 8px rgba(0, 0, 0, 0.1);
  `,
};

const buttonColors: Record<string, string> = {
  primary: "#1976d2",
  secondary: "#9c27b0",
  error: "#d32f2f",
  info: "#0288d1",
  success: "#388e3c",
  warning: "#fbc02d",
};

const AddTaskButton: React.FC<AddTaskButtonProps> = ({
  addOne,
  setError = () => {},
  variant = "outlined",
  color = "primary",
  size = "medium",
  className,
  style,
}) => {
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [priority, setPriority] = React.useState<Priority>("medium");
  const [dueDate, setDueDate] = React.useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // --- バリデーション ---
    if (!title.trim()) {
      setError("タイトルは必須です");
      return;
    }
    if (!description.trim()) {
      setError("説明は必須です");
      return;
    }
    if (!dueDate) {
      setError("期限日は必須です");
      return;
    }
    if (!isPriority(priority)) {
      setError("優先度が不正です");
      return;
    }
    // --- ここまでバリデーション ---
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
    <form onSubmit={handleSubmit} className={className} style={style}>
      <div
        css={[
          variantStyles[variant],
          css`
            padding: 16px;
          `,
        ]}
      >
        新しいタスクを追加:
        <input
          type="text"
          name="title"
          placeholder="タイトル"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          css={css`
            margin: 4px;
            padding: 4px;
            width: 100%;
          `}
        />
        <input
          type="text"
          name="description"
          placeholder="説明"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          css={css`
            margin: 4px;
            padding: 4px;
            width: 100%;
          `}
        />
        <select
          name="priority"
          value={priority}
          onChange={(e) => setPriority(isPriority(e.target.value) ? e.target.value : "medium")}
          css={css`
            margin: 4px;
            padding: 4px;
          `}
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
          css={css`
            margin: 4px;
            padding: 4px;
          `}
        />
        <button
          type="submit"
          css={css`
            margin: 4px;
            padding: ${size === "small" ? 4 : 8}px;
            background: ${buttonColors[color] || buttonColors.primary};
            color: #fff;
            border: none;
            border-radius: 4px;
            font-size: ${size === "small" ? 12 : 16}px;
            cursor: pointer;
          `}
        >
          追加
        </button>
      </div>
    </form>
  );
};

export default AddTaskButton;
