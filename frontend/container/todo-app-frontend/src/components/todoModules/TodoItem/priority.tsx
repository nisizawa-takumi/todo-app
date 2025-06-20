/** @jsxImportSource @emotion/react */
import React from "react";
import type { TodoType } from "@/lib/todo/apiClient";
import { css } from "@emotion/react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

type Priority = "high" | "medium" | "low";

type PriorityProps = {
  todoItem: TodoType;
  updateOne: (item: TodoType) => Promise<void>;
  variant?: "outlined" | "filled" | "standard" | "cool";
  size?: "small" | "medium";
  color?: "primary" | "secondary" | "error" | "info" | "success" | "warning";
  label?: string;
  setError?: React.Dispatch<React.SetStateAction<string | null>>;
};

const outlinedStyle = css`
  background: #fff;
  border-radius: 6px;
`;

const filledStyle = css`
  background: #f5f5f5;
  border-radius: 6px;
`;

const standardStyle = css`
  background: transparent;
  border-bottom: 2px solid #1976d2;
  .MuiInputLabel-root {
    margin-bottom: -8px; /* デフォルトより余白を減らす */
  }
  .MuiInputBase-root {
    margin-top: -4px; /* 入力欄の上余白も微調整 */
  }
`;

const coolStyle = css`
  background: linear-gradient(90deg, #fffde4 0%, #ffe5ec 100%);
  border-radius: 14px;
  padding: 8px 16px;
  box-shadow: 0 2px 8px rgba(255, 182, 193, 0.08);
  border: 2px solid #ffd600;
  .MuiInputLabel-root {
    color: #e75480 !important;
    font-weight: bold;
    letter-spacing: 1px;
    text-shadow: 0 1px 2px #fff0f6;
    transition: color 0.2s;
  }
  .MuiInputBase-root {
    color: #e75480 !important;
    background: transparent;
    transition: color 0.2s;
  }
  .MuiOutlinedInput-notchedOutline,
  .MuiFilledInput-underline:before,
  .MuiFilledInput-underline:after {
    border-color: #ffd600 !important;
  }
  &:hover,
  &:focus-within {
    background: linear-gradient(90deg, #fff9c4 0%, #ffe0f7 100%);
    border-color: #e75480;
    .MuiInputLabel-root {
      color: #ffd600 !important;
      text-shadow: 0 1px 4px #fffde4, 0 0px 2px #ffd600;
    }
    .MuiInputBase-root {
      color: #ffd600 !important;
    }
    .MuiOutlinedInput-notchedOutline,
    .MuiFilledInput-underline:before,
    .MuiFilledInput-underline:after {
      border-color: #e75480 !important;
    }
  }
`;

const getInputStyle = (variant: "outlined" | "filled" | "standard" | "cool") => {
  switch (variant) {
    case "filled":
      return filledStyle;
    case "standard":
      return standardStyle;
    case "cool":
      return coolStyle;
    default:
      return outlinedStyle;
  }
};

const sizeStyle = {
  small: css`
    .MuiInputBase-root {
      min-height: 32px;
    }
    .MuiInputBase-input {
      font-size: 0.9rem;
      padding: 12px 8px 6px 8px;
    }
    .MuiInputLabel-root {
      font-size: 0.85rem;
      top: -6px;
    }
  `,
  medium: css`
    .MuiInputBase-root {
      min-height: 40px;
    }
    .MuiInputBase-input {
      font-size: 1rem;
      padding: 18px 12px 10px 12px;
    }
    .MuiInputLabel-root {
      font-size: 1rem;
      top: -4px;
    }
  `,
};

const PRIORITY_LABELS: Record<Priority, string> = {
  high: "高",
  medium: "中",
  low: "低",
};

const TodoPriority: React.FC<PriorityProps> = ({
  todoItem,
  updateOne,
  variant = "outlined",
  size = "medium",
  color = "primary",
  label = "優先度",
  setError = () => {},
}) => (
  <div css={[getInputStyle(variant), sizeStyle[size]]}>
    <TextField
      select
      label={label}
      variant={variant === "cool" ? "outlined" : variant}
      size={size}
      color={color}
      value={todoItem.priority}
      name="priority"
      id={`priority-${todoItem.id}`}
      onChange={(e) =>
        updateOne({ ...todoItem, priority: e.target.value as Priority }).catch((err) => setError(err.message))
      }
      fullWidth
      slotProps={{ input: { "aria-label": label } }}
      margin="dense"
    >
      {(["high", "medium", "low"] as Priority[]).map((p) => (
        <MenuItem key={p} value={p}>
          {PRIORITY_LABELS[p]}
        </MenuItem>
      ))}
    </TextField>
  </div>
);

export default TodoPriority;
