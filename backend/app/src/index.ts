import { PrismaClient } from '@prisma/client';
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

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
        const { title, description, completed, priority, due_date, userId } = req.body;
        if (!userId) {
            return res.status(400).json({ error: "userIdが必要です" });
        }
        const createTodo = await prisma.todo.create({
            data: {
                title,
                description,
                completed,
                priority,
                due_date: new Date(due_date),
                user: { connect: { id: userId } }
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

// 認証と認可
// JWT認証用にRequest型を拡張
interface AuthRequest extends Request {
    user?: any;
}

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'トークンがありません' });
    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
        if (err) return res.status(403).json({ error: 'トークンが無効です' });
        req.user = user;
        next();
    });
}

app.post('/register', async (req, res) => {
    const { email, password, role } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'emailとpasswordは必須です' });
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role: role || 'user'
            }
        });
        res.json({ message: '登録完了', user: { id: user.id, email: user.email, role: user.role } });
    } catch (e) {
        res.status(400).json({ error: '登録失敗', detail: e });
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'emailとpasswordは必須です' });
    }
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(401).json({ error: 'ユーザーが見つかりません' });

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return res.status(401).json({ error: 'パスワードが違います' });

        const token = jwt.sign(
            { userId: user.id, role: user.role },
            JWT_SECRET,
            { expiresIn: '1d' }
        );
        res.json({ token });
    } catch (e) {
        res.status(400).json({ error: 'ログイン失敗', detail: e });
    }
});

// 例: 認証が必要なAPI
app.get('/me', authenticateToken, async (req: AuthRequest, res: Response) => {
    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
    if (!user) return res.status(404).json({ error: 'ユーザーが見つかりません' });
    res.json({ id: user.id, email: user.email, role: user.role });
});

// 認可（ロール分岐）ミドルウェア
function authorizeRole(role: string) {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user || req.user.role !== role) {
            return res.status(403).json({ error: '権限がありません' });
        }
        next();
    };
}

// 例: adminロールのみアクセス可能なエンドポイント
app.get('/admin/secret', authenticateToken, authorizeRole('admin'), (req: AuthRequest, res: Response) => {
    res.json({ message: '管理者専用の情報です' });
});

if (require.main === module) {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

export default app;
