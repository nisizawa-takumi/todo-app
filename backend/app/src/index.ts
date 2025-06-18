import { PrismaClient } from '@prisma/client';
import express from 'express';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 4000;
const prisma = new PrismaClient();

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000' // フロントエンドのURL
}));

app.get('/allTodos', async (req, res) => {
    try {
        const allTodos = await prisma.todo.findMany();
        res.json(allTodos);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post("/createTodo", async (req, res) => {
    try {
        const { title, description, completed, priority, due_date } = req.body;
        const createTodo = await prisma.todo.create({
            data: {
                title,
                description,
                completed,
                priority,
                due_date: new Date(due_date),
            },
        });
        res.json(createTodo);
    } catch (e) {
        res.status(400).json(e);
    }
});

app.post("/bulkUpdateTodos", async (req, res) => {
    const todos = req.body.todos;
    if (!Array.isArray(todos)) {
        return res.status(400).json({ error: "todos配列が必要です" });
    }
    // 必須フィールドチェック
    for (const todo of todos) {
        if (
            typeof todo.id !== "string" ||
            typeof todo.title !== "string" ||
            typeof todo.description !== "string" ||
            typeof todo.completed !== "boolean" ||
            typeof todo.priority !== "string" ||
            typeof todo.due_date !== "string" // ISO8601文字列
        ) {
            return res.status(400).json({ error: "各todoにid, title, description, completed, priority, due_date(ISO8601)が必要です" });
        }
    }
    // due_dateをDate型に変換
    const todosForDb = todos.map(todo => ({
        ...todo,
        due_date: new Date(todo.due_date)
    }));
    try {
        await prisma.$transaction([
            prisma.todo.deleteMany({}),
            prisma.todo.createMany({ data: todosForDb })
        ]);
        res.json({ message: "一括更新完了" });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "一括更新に失敗しました" });
    }
});

app.put("/editTodo/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const { title, description, completed, priority, due_date } = req.body;
        const editTodo = await prisma.todo.update({
            where: { id },
            data: {
                title,
                description,
                completed,
                priority,
                due_date: new Date(due_date),
            },
        });
        res.json(editTodo);
    } catch (e) {
        res.status(400).json(e);
    }
});

app.delete("/deleteTodo/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const deleteTodo = await prisma.todo.delete({
            where: { id },
        });
        res.json(deleteTodo);
    } catch (e) {
        res.status(400).json(e);
    }
});


if (require.main === module) {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

export default app;
