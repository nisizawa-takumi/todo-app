import React, { useEffect, useState } from "react";
import {
  Box, Typography, Button, List, ListItem, ListItemText, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Checkbox, IconButton
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: string;
  due_date: string;
}

const TodoListPage = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "medium",
    due_date: "",
  });
  const [formError, setFormError] = useState("");

  const fetchTodos = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/allTodos`, {
        credentials: "include"
      });
      if (res.ok) {
        const data = await res.json();
        setTodos(data.data || []);
      } else {
        const data = await res.json();
        setError(data.error || "取得に失敗しました");
      }
    } catch (e) {
      setError("通信エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleOpen = (todo?: Todo) => {
    if (todo) {
      setEditId(todo.id);
      setForm({
        title: todo.title,
        description: todo.description,
        priority: todo.priority,
        due_date: todo.due_date.slice(0, 10),
      });
    } else {
      setEditId(null);
      setForm({ title: "", description: "", priority: "medium", due_date: "" });
    }
    setFormError("");
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddOrEdit = async () => {
    setFormError("");
    if (!form.title || !form.description || !form.due_date) {
      setFormError("全ての項目を入力してください");
      return;
    }
    try {
      if (editId) {
        // 編集
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/editTodo/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            ...form,
            completed: undefined // completedは編集しない
          })
        });
        const data = await res.json();
        if (res.ok) {
          handleClose();
          fetchTodos();
        } else {
          setFormError(data.error || "編集に失敗しました");
        }
      } else {
        // 追加
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/createTodo`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            ...form,
            completed: false
          })
        });
        const data = await res.json();
        if (res.ok) {
          handleClose();
          fetchTodos();
        } else {
          setFormError(data.error || "追加に失敗しました");
        }
      }
    } catch (e) {
      setFormError("通信エラーが発生しました");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("本当に削除しますか？")) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/deleteTodo/${id}`, {
        method: "DELETE",
        credentials: "include"
      });
      if (res.ok) {
        fetchTodos();
      } else {
        const data = await res.json();
        setError(data.error || "削除に失敗しました");
      }
    } catch (e) {
      setError("通信エラーが発生しました");
    }
  };

  const handleToggleCompleted = async (todo: Todo) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/editTodo/${todo.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...todo,
          completed: !todo.completed
        })
      });
      if (res.ok) {
        fetchTodos();
      } else {
        const data = await res.json();
        setError(data.error || "更新に失敗しました");
      }
    } catch (e) {
      setError("通信エラーが発生しました");
    }
  };

  return (
    <Box maxWidth={600} mx="auto" mt={8} p={4} boxShadow={3} borderRadius={2}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Todoリスト
      </Typography>
      <Box my={4}>
        {loading ? (
          <Box textAlign="center"><CircularProgress /></Box>
        ) : error ? (
          <Typography color="error" align="center">{error}</Typography>
        ) : todos.length === 0 ? (
          <Typography color="text.secondary" align="center">Todoがありません</Typography>
        ) : (
          <List>
            {todos.map(todo => (
              <ListItem key={todo.id} divider secondaryAction={
                <>
                  <IconButton edge="end" aria-label="edit" onClick={() => handleOpen(todo)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(todo.id)}>
                    <DeleteIcon />
                  </IconButton>
                </>
              }>
                <Checkbox
                  checked={todo.completed}
                  onChange={() => handleToggleCompleted(todo)}
                  edge="start"
                />
                <ListItemText
                  primary={todo.title}
                  secondary={todo.description}
                  sx={todo.completed ? { textDecoration: 'line-through', color: 'gray' } : {}}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Box>
      <Box textAlign="center">
        <Button variant="contained" color="primary" onClick={() => handleOpen()}>
          Todoを追加
        </Button>
      </Box>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editId ? "Todoを編集" : "Todoを追加"}</DialogTitle>
        <DialogContent>
          <TextField
            label="タイトル"
            name="title"
            value={form.title}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="説明"
            name="description"
            value={form.description}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="優先度"
            name="priority"
            value={form.priority}
            onChange={handleChange}
            select
            fullWidth
            margin="normal"
          >
            <MenuItem value="low">低</MenuItem>
            <MenuItem value="medium">中</MenuItem>
            <MenuItem value="high">高</MenuItem>
          </TextField>
          <TextField
            label="期限"
            name="due_date"
            type="date"
            value={form.due_date}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            required
          />
          {formError && (
            <Typography color="error" sx={{ mt: 1 }}>{formError}</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>キャンセル</Button>
          <Button onClick={handleAddOrEdit} variant="contained" color="primary">{editId ? "更新" : "追加"}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TodoListPage;
