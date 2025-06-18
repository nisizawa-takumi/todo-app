/** @jsxImportSource @emotion/react */
import React from "react";
import type { TodoType } from "@/lib/todo/apiClient";
import TextField from "@mui/material/TextField";
import { css } from "@emotion/react";

type DueDateProps = {
  todoItem: TodoType;
  updateOneLocal: (item: TodoType) => void;
  variant?: "outlined" | "filled" | "standard" | "cool";
  size?: "small" | "medium";
  color?: "primary" | "secondary" | "error" | "info" | "success" | "warning";
  label?: string;
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
`;

const coolStyle = css`
  background: linear-gradient(90deg, #ede7f6 0%, #e3f2fd 100%);
  border-radius: 18px;
  padding: 10px 20px;
  box-shadow: 0 4px 16px rgba(103, 58, 183, 0.1);
  border: 2px dashed #9575cd;
  position: relative;
  .MuiInputLabel-root {
    color: #5e35b1 !important;
    font-weight: bold;
    font-style: italic;
    letter-spacing: 1px;
    text-shadow: 0 1px 4px #ede7f6, 0 0px 2px #5e35b1;
    transition: color 0.2s;
    &:before {
      content: "⏰ ";
      font-style: normal;
      font-size: 1em;
      margin-right: 2px;
      color: #7e57c2;
    }
  }
  .MuiInputBase-root {
    color: #3949ab !important;
    background: transparent;
    transition: color 0.2s;
  }
  .MuiOutlinedInput-notchedOutline,
  .MuiFilledInput-underline:before,
  .MuiFilledInput-underline:after {
    border-color: #9575cd !important;
    border-style: dashed !important;
  }
  &:hover,
  &:focus-within {
    background: linear-gradient(90deg, #f3e5f5 0%, #e1bee7 100%);
    border-color: #7e57c2;
    .MuiInputLabel-root {
      color: #7e57c2 !important;
      text-shadow: 0 1px 4px #f3e5f5, 0 0px 2px #7e57c2;
    }
    .MuiInputBase-root {
      color: #7e57c2 !important;
    }
    .MuiOutlinedInput-notchedOutline,
    .MuiFilledInput-underline:before,
    .MuiFilledInput-underline:after {
      border-color: #7e57c2 !important;
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

const formatDate = (isoString?: string | null) => {
  if (!isoString) return "";
  // 先頭10文字を返すことでYYYY-MM-DD形式に
  return isoString.slice(0, 10);
};

const TodoDueDate: React.FC<DueDateProps> = ({
  todoItem,
  updateOneLocal,
  variant = "outlined",
  size = "medium",
  color = "primary",
  label = "期限",
}) => (
  <div css={[getInputStyle(variant), sizeStyle[size]]}>
    <TextField
      label={label}
      type="date"
      variant={variant === "cool" ? "outlined" : variant}
      size={size}
      color={color}
      value={formatDate(todoItem.due_date)}
      name="dueDate"
      id={`dueDate-${todoItem.id}`}
      onChange={(e) => updateOneLocal({ ...todoItem, due_date: e.target.value })}
      fullWidth
      slotProps={{
        input: { "aria-label": todoItem.title },
        inputLabel: { shrink: true },
      }}
      margin="dense"
    />
  </div>
);

export default TodoDueDate;
