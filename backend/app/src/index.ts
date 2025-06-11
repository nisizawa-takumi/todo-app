import { PrismaClient } from '@prisma/client';
import express from 'express';

const app = express();
const port = process.env.PORT || 4000;

const prisma = new PrismaClient();

app.use(express.json());

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
        const { title, isCompleted } = req.body;
        const createTodo = await prisma.todo.create({
            data: {
                title,
                isCompleted,
            },
        });
        res.json(createTodo);
    } catch (e) {
        res.status(400).json(e);
    }
});

app.put("/editTodo/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { title, isCompleted } = req.body;
        const editTodo = await prisma.todo.update({
            where: { id },
            data: {
                title,
                isCompleted,
            },
        });
        res.json(editTodo);
    } catch (e) {
        res.status(400).json(e);
    }
});

app.delete("/deleteTodo/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);
        const deleteTodo = await prisma.todo.delete({
            where: { id },
        });
        res.json(deleteTodo);
    } catch (e) {
        res.status(400).json(e);
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
