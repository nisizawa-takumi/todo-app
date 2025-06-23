import { PrismaClient } from '@prisma/client';
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';

// Prismaクライアントの初期化
const prisma = new PrismaClient();

// Expressアプリの初期化
const app = express();
const port = process.env.PORT || 4000;

// JSONボディパース
app.use(express.json());
// Cookieパーサー追加
app.use(cookieParser());
// CORS設定（フロントエンドからのリクエストを許可）
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

// ===================== 認証・認可関連 =====================
// JWT認証用にRequest型を拡張
interface AuthRequest extends Request {
    user?: any; // JWTデコード後のユーザー情報
}

// JWTのシークレットキー
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// JWT認証ミドルウェア
function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
    // Authorizationヘッダー or Cookieからトークン取得
    let token: string | undefined;
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }
    if (!token) return res.status(401).json({ error: 'トークンがありません' });
    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
        if (err) return res.status(403).json({ error: 'トークンが無効です' });
        req.user = user;
        next();
    });
}

// ===================== Todo CRUD API =====================

// 認証必須: 自分のTodoのみ取得
app.get('/allTodos', authenticateToken, async (req: AuthRequest, res) => {
    try {
        // 認証ユーザーのTodoのみ返す
        const allTodos = await prisma.todo.findMany({ where: { userId: req.user.userId } });
        res.json(allTodos);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// 認証必須: 自分のTodoのみ作成
app.post("/createTodo", authenticateToken, async (req: AuthRequest, res) => {
    try {
        // 必須項目チェック
        const { title, description, completed, priority, due_date } = req.body;
        if (!title || !description || typeof completed !== 'boolean' || !priority || !due_date) {
            return res.status(400).json({ error: "必須項目が不足しています" });
        }
        // 認証ユーザーのTodoとして登録
        const createTodo = await prisma.todo.create({
            data: {
                title,
                description,
                completed,
                priority,
                due_date: new Date(due_date),
                user: { connect: { id: req.user.userId } }
            },
        });
        res.json(createTodo);
    } catch (e) {
        res.status(400).json(e);
    }
});

// 認証必須: 自分のTodoのみ編集可
app.put("/editTodo/:id", authenticateToken, async (req: AuthRequest, res) => {
    try {
        const id = req.params.id;
        const { title, description, completed, priority, due_date } = req.body;
        // 対象Todoが自分のものかチェック
        const todo = await prisma.todo.findUnique({ where: { id } });
        if (!todo || todo.userId !== req.user.userId) {
            return res.status(403).json({ error: "権限がありません" });
        }
        // 更新処理
        const editTodo = await prisma.todo.update({
            where: { id },
            data: { title, description, completed, priority, due_date: new Date(due_date) },
        });
        res.json(editTodo);
    } catch (e) {
        res.status(400).json(e);
    }
});

// 認証必須: 自分のTodoのみ削除可
app.delete("/deleteTodo/:id", authenticateToken, async (req: AuthRequest, res) => {
    try {
        const id = req.params.id;
        // 対象Todoが自分のものかチェック
        const todo = await prisma.todo.findUnique({ where: { id } });
        if (!todo || todo.userId !== req.user.userId) {
            return res.status(403).json({ error: "権限がありません" });
        }
        // 削除処理
        const deleteTodo = await prisma.todo.delete({ where: { id } });
        res.json(deleteTodo);
    } catch (e) {
        res.status(400).json(e);
    }
});

// ===================== 一括更新API =====================
// 認証必須: 自分のTodoのみ一括更新可
app.post("/bulkUpdateTodos", authenticateToken, async (req: AuthRequest, res) => {
    const todos = req.body.todos;
    if (!Array.isArray(todos)) {
        return res.status(400).json({ error: "todos配列が必要です" });
    }
    // 各Todoが自分のものかチェック（userIdが一致するものだけ許可）
    for (const todo of todos) {
        if (todo.userId && todo.userId !== req.user.userId) {
            return res.status(403).json({ error: "自分のTodoのみ一括更新できます" });
        }
    }
    // 必須フィールドチェック
    for (const todo of todos) {
        if (
            typeof todo.id !== "string" ||
            typeof todo.title !== "string" ||
            typeof todo.description !== "string" ||
            typeof todo.completed !== "boolean" ||
            typeof todo.priority !== "string" ||
            typeof todo.due_date !== "string"
        ) {
            return res.status(400).json({ error: "各todoにid, title, description, completed, priority, due_date(ISO8601)が必要です" });
        }
    }
    // userIdをすべて認証ユーザーのIDに上書き
    const todosForDb = todos.map(todo => ({
        ...todo,
        userId: req.user.userId,
        due_date: new Date(todo.due_date)
    }));
    try {
        // 自分のTodoのみ全削除→一括登録
        await prisma.$transaction([
            prisma.todo.deleteMany({ where: { userId: req.user.userId } }),
            prisma.todo.createMany({ data: todosForDb })
        ]);
        res.json({ message: "一括更新完了" });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "一括更新に失敗しました" });
    }
});

// ===================== ユーザー認証API =====================

// ユーザー登録
app.post('/register', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'emailとpasswordは必須です' });
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword
            }
        });
        res.json({ message: '登録完了', user: { id: user.id, email: user.email } });
    } catch (e) {
        res.status(400).json({ error: '登録失敗', detail: e });
    }
});

// ログイン
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

        // JWTトークン発行（roleを除外）
        const token = jwt.sign(
            { userId: user.id },
            JWT_SECRET,
            { expiresIn: '1d' }
        );
        // JWTをHttpOnly Cookieで返す
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000 // 1日
        });
        res.json({ message: 'ログイン成功', token });
    } catch (e) {
        res.status(400).json({ error: 'ログイン失敗', detail: e });
    }
});

// 自分のユーザー情報取得（認証必須）
app.get('/me', authenticateToken, async (req: AuthRequest, res: Response) => {
    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
    if (!user) return res.status(404).json({ error: 'ユーザーが見つかりません' });
    res.json({ id: user.id, email: user.email });
});

// サーバー起動
if (require.main === module) {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

export default app;
