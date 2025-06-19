/** @jsxImportSource @emotion/react */
import React from "react";
import { Checkbox, FormControlLabel } from "@mui/material";
import { css } from "@emotion/react";
import type { TodoType } from "@/lib/todo/apiClient";
type CompletedCheckboxProps = {
  todoItem: TodoType;
  updateOneLocal: (item: TodoType) => void;
  variant?: "outlined" | "filled" | "standard" | "cute" | "cool";
  size?: "small" | "medium";
  label?: string;
};

const outlinedStyle = css`
  background: #fff;
  border-radius: 6px;
  padding: 4px 8px;
`;

const filledStyle = css`
  background: #f5f5f5;
  border-radius: 6px;
  padding: 4px 8px;
`;

const standardStyle = css`
  background: transparent;
  border-bottom: 2px solid #1976d2;
  padding: 2px 0 2px 8px;
`;

const cuteStyle = css`
  background: linear-gradient(90deg, #ffe0f7 0%, #ffe5ec 100%);
  border-radius: 16px;
  padding: 10px 18px;
  box-shadow: 0 2px 12px rgba(255, 182, 193, 0.18);
  border: 2px dashed #ffb6d5;
  position: relative;
  .MuiFormControlLabel-label {
    color: #e75480;
    font-weight: bold;
    letter-spacing: 1px;
    font-family: "Comic Sans MS", "Rounded Mplus 1c", cursive, sans-serif;
    text-shadow: 0 1px 2px #fff0f6;
  }
  .MuiCheckbox-root {
    color: #e75480;
  }
  &:before {
    content: "❤";
    position: absolute;
    left: 8px;
    top: 8px;
    font-size: 1.1em;
    color: #ffb6d5;
    opacity: 0.7;
    pointer-events: none;
  }
`;

const coolStyle = css`
  background: linear-gradient(90deg, rgb(85, 123, 247) 0%, #6dd5ed 100%);
  border-radius: 12px;
  padding: 6px 14px;
  box-shadow: 0 2px 8px rgba(33, 147, 176, 0.15);
  border: 2px solid rgb(34, 17, 107);
  .MuiFormControlLabel-label {
    color: #fff;
    font-weight: bold;
    letter-spacing: 1px;
    text-shadow: 0 1px 4px #1976d2, 0 0px 2px #2193b0;
    transition: color 0.2s;
  }
  .MuiCheckbox-root {
    color: #fff !important;
    transition: color 0.2s;
  }
  .Mui-checked {
    color: rgb(255, 115, 0) !important;
    filter: drop-shadow(0 0 2px rgb(13, 50, 87));
  }
  &:hover,
  &:focus-within {
    background: linear-gradient(90deg, #fffde4 0%, #fff9c4 100%);
    border-color: #ffd600;
    .MuiFormControlLabel-label {
      color: #ffd600;
      text-shadow: 0 1px 4px #fffde4, 0 0px 2px #ffd600;
    }
    .MuiCheckbox-root {
      color: #ffd600 !important;
    }
  }
`;

const getInputStyle = (variant: "outlined" | "filled" | "standard" | "cute" | "cool") => {
  switch (variant) {
    case "filled":
      return filledStyle;
    case "standard":
      return standardStyle;
    case "cute":
      return cuteStyle;
    case "cool":
      return coolStyle;
    default:
      return outlinedStyle;
  }
};

const sizeStyle = {
  small: css`
    .MuiFormControlLabel-label {
      font-size: 0.9rem;
      padding-left: 2px;
    }
    .MuiCheckbox-root {
      padding: 4px;
    }
  `,
  medium: css`
    .MuiFormControlLabel-label {
      font-size: 1rem;
      padding-left: 4px;
    }
    .MuiCheckbox-root {
      padding: 8px;
    }
  `,
};

const TodoCompleted: React.FC<CompletedCheckboxProps> = ({
  todoItem,
  updateOneLocal,
  variant = "outlined",
  size = "medium",
  label = "完了",
}) => (
  <div css={[getInputStyle(variant), sizeStyle[size]]}>
    <FormControlLabel
      label={label}
      labelPlacement="start"
      control={
        <Checkbox
          checked={todoItem.completed}
          onChange={(e) => updateOneLocal({ ...todoItem, completed: e.target.checked })}
          name="completed"
          color="primary"
          size={size}
          slotProps={{ input: { "aria-label": label } }}
        />
      }
    />
  </div>
);

export default TodoCompleted;
