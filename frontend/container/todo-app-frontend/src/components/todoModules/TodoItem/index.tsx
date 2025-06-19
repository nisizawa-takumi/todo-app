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

// Todoコンポーネントのprops型定義
export type TodoPropsType = {
  data: TodoType; // 表示するタスクデータ
  updateOne: (newTodo: TodoType) => Promise<void>;
  deleteOne: (id: string) => Promise<void>;
};

export default function TodoItem({ data: todoItem, updateOne, deleteOne }: TodoPropsType) {
  return (
    <Card sx={{ mb: 2, borderRadius: 3, boxShadow: 2 }}>
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
    </Card>
  );
}
