import type { TodoType } from "../../../lib/todo/apiClient";
import TodoTitle from "./title";
import TodoDescription from "./description";
import TodoCompleted from "./completed";
import TodoDueDate from "./dueDate";
import TodoPriority from "./priority";
import TodoDelete from "./deleteButton";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import { css } from "@emotion/react";
import styled from "@emotion/styled";

// Todoコンポーネントのprops型定義
export type TodoPropsType = {
  data: TodoType; // 表示するタスクデータ
  updateOne: (newTodo: TodoType) => Promise<void>;
  deleteOne: (id: string) => Promise<void>;
  styleVariant?: TodoItemVariant;
};

export type TodoItemVariant = "outlined" | "filled" | "shadow" | "cool" | "material" | "hybrid";

const cardVariants = {
  outlined: css`
    background: #fff;
    border: 1.5px solid #1976d2;
    box-shadow: 0 2px 8px rgba(25, 118, 210, 0.1);
    border-radius: 12px;
  `,
  filled: css`
    background: #e3f2fd;
    border: none;
    box-shadow: 0 2px 8px rgba(25, 118, 210, 0.1);
    border-radius: 12px;
  `,
  shadow: css`
    background: #fff;
    border: none;
    box-shadow: 0 6px 24px rgba(25, 118, 210, 0.18), 0 1.5px 4px rgba(0, 0, 0, 0.08);
    border-radius: 16px;
  `,
  cool: css`
    background: linear-gradient(90deg, #e0f7fa 0%, #e3ffe6 100%);
    border: none;
    box-shadow: 0 8px 32px rgba(0, 188, 212, 0.18), 0 2px 8px rgba(0, 0, 0, 0.1);
    border-radius: 18px;
  `,
  material: css`
    background: #fff;
    border: none;
    box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.2), 0px 1px 1px rgba(0, 0, 0, 0.14), 0px 2px 1px rgba(0, 0, 0, 0.12);
    border-radius: 12px;
  `,
  hybrid: css`
    background: linear-gradient(135deg, #f8fafc 60%, #e3eaf1 100%);
    border: 1.5px solid;
    border-image: linear-gradient(90deg, #bfc9d1 0%, #e0e3ea 50%, #bfc9d1 100%) 1;
    border-radius: 16px;
    box-shadow: 0 2px 12px 0 rgba(80, 120, 180, 0.1), 0 1.5px 4px 0 rgba(0, 0, 0, 0.06),
      inset 0 1.5px 12px 0 rgba(180, 220, 255, 0.1);
    position: relative;
    overflow: hidden;
    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
      background: linear-gradient(120deg, rgba(255, 255, 255, 0) 60%, rgba(180, 220, 255, 0.18) 100%);
      mix-blend-mode: lighten;
      transition: opacity 0.3s;
      opacity: 0.7;
    }
    &::after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
      background: linear-gradient(100deg, rgba(255, 255, 255, 0) 70%, rgba(200, 220, 255, 0.22) 100%);
      opacity: 0.3;
      transition: opacity 0.3s;
    }
    &:hover::before {
      opacity: 1;
      background: linear-gradient(120deg, rgba(255, 255, 255, 0) 60%, rgba(180, 220, 255, 0.32) 100%);
    }
    &:hover::after {
      opacity: 0.6;
      background: linear-gradient(100deg, rgba(255, 255, 255, 0) 60%, rgba(180, 220, 255, 0.38) 100%);
    }
  `,
};

const StyledCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== "styleVariant",
})<{ styleVariant: TodoItemVariant }>`
  ${({ styleVariant }) => cardVariants[styleVariant]}
  margin-bottom: 16px;
`;

export default function TodoItem({ data: todoItem, updateOne, deleteOne, styleVariant = "outlined" }: TodoPropsType) {
  return (
    <StyledCard styleVariant={styleVariant}>
      <CardContent>
        <Stack spacing={1.5}>
          <TodoTitle todoItem={todoItem} updateOne={updateOne} variant="outlined" />
          <TodoDescription todoItem={todoItem} updateOne={updateOne} variant="standard" size="medium" />
          <Stack direction="row" spacing={1} alignItems="center">
            <TodoDueDate todoItem={todoItem} updateOne={updateOne} variant="standard" size="small" />
            <TodoPriority todoItem={todoItem} updateOne={updateOne} variant="standard" size="small" />
            <TodoCompleted todoItem={todoItem} updateOne={updateOne} variant="standard" size="small" />
            <TodoDelete todoItem={todoItem} deleteOne={deleteOne} variant="outlined" size="small" />
          </Stack>
        </Stack>
      </CardContent>
    </StyledCard>
  );
}
