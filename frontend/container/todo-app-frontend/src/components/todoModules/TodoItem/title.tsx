/** @jsxImportSource @emotion/react */
import React from "react";
import type { TodoType } from "@/lib/todo/apiClient";
import TextField from "@mui/material/TextField";
import { css } from "@emotion/react";

type Props = {
  todoItem: TodoType;
  updateOneLocal: (item: TodoType) => void;
  variant?: "outlined" | "filled" | "standard";
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
  border-bottom: 2px solidrgb(52, 52, 52);
  padding-bottom: 2px;
`;

const getInputStyle = (variant: "outlined" | "filled" | "standard") => {
  switch (variant) {
    case "filled":
      return filledStyle;
    case "standard":
      return standardStyle;
    default:
      return outlinedStyle;
  }
};

const TodoTitle: React.FC<Props> = ({ todoItem, updateOneLocal, variant = "standard" }) => (
  <div css={getInputStyle(variant)}>
    <TextField
      label="タイトル"
      variant={variant}
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
