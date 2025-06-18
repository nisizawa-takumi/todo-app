/** @jsxImportSource @emotion/react */
import React from "react";
import type { TodoType } from "@/lib/todo/apiClient";
import TextField from "@mui/material/TextField";
import { css } from "@emotion/react";

type Props = {
  todoItem: TodoType;
  updateOneLocal: (item: TodoType) => void;
  variant?: "outlined" | "filled" | "standard" | "cool";
};

const outlinedStyle = css`
  margin-top: 8px;
  margin-bottom: 8px;
  width: 100%;
`;

const filledStyle = css`
  margin-top: 8px;
  margin-bottom: 8px;
  width: 100%;
  background: #f5f5f5;
  border-radius: 6px;
  padding: 8px 0;
`;

const standardStyle = css`
  margin-top: 8px;
  margin-bottom: 8px;
  width: 100%;
  border-bottom: 2px solid rgb(52, 52, 52);
  padding-bottom: 2px;
`;

const coolStyle = css`
  margin-top: 8px;
  margin-bottom: 8px;
  width: 100%;
  background: linear-gradient(90deg, #232946 0%, #1a1a2e 100%);
  border-radius: 12px;
  padding: 2px 0 2px 0;
  box-shadow: 0 2px 8px rgba(34, 25, 70, 0.18);
  .MuiInputLabel-root {
    color: #fff !important;
    font-weight: bold;
    letter-spacing: 1px;
    text-shadow: 0 1px 4px #232946, 0 0px 2px #1a1a2e;
    transition: color 0.2s;
  }
  .MuiInputBase-root {
    color: #fff !important;
    background: transparent;
    transition: color 0.2s;
  }
  .MuiOutlinedInput-notchedOutline,
  .MuiFilledInput-underline:before,
  .MuiFilledInput-underline:after {
    border-color: #232946 !important;
  }
  &:hover,
  &:focus-within {
    background: linear-gradient(90deg, #232946 0%, #393e46 100%);
    border-color: #ffd600;
    .MuiInputLabel-root {
      color: #ffd600 !important;
      text-shadow: 0 1px 4px #393e46, 0 0px 2px #ffd600;
    }
    .MuiInputBase-root {
      color: #ffd600 !important;
    }
    .MuiOutlinedInput-notchedOutline,
    .MuiFilledInput-underline:before,
    .MuiFilledInput-underline:after {
      border-color: #ffd600 !important;
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

const TodoTitle: React.FC<Props> = ({ todoItem, updateOneLocal, variant = "standard" }) => (
  <div css={getInputStyle(variant)}>
    <TextField
      label="タイトル"
      variant={variant === "cool" ? "outlined" : variant}
      value={todoItem.title}
      name="title"
      id={`title-${todoItem.id}`}
      fullWidth
      onChange={(e) => updateOneLocal({ ...todoItem, title: e.target.value })}
      slotProps={{ input: { "aria-label": todoItem.title } }}
    />
  </div>
);

export default TodoTitle;
