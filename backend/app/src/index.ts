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

// ===================== 共通レスポンス/エラーハンドラ =====================

// レスポンス統一用ヘルパー
function sendSuccess(res: Response, data: any) {
    res.json({ success: true, data });
}
function sendError(res: Response, error: any, status: number = 400) {
    res.status(status).json({ success: false, error });
}

// 共通エラーハンドラーミドルウェア
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    sendError(res, err.message || 'Internal Server Error', err.status || 500);
});

// ===================== Todo CRUD API =====================

// 認証必須: 自分のTodoのみ取得
app.get('/allTodos', authenticateToken, async (req: AuthRequest, res, next) => {
    try {
        const allTodos = await prisma.todo.findMany({ where: { userId: req.user.userId } });
        sendSuccess(res, allTodos);
    } catch (error) {
        next(error);
    }
});

// 認証必須: 自分のTodoのみ作成
app.post("/createTodo", authenticateToken, async (req: AuthRequest, res, next) => {
    try {
        const { title, description, completed, priority, due_date } = req.body;
        if (!title || !description || typeof completed !== 'boolean' || !priority || !due_date) {
            return sendError(res, "必須項目が不足しています", 400);
        }
        // userIdの確認用ログ
        console.log('createTodo req.user:', req.user);
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
        sendSuccess(res, createTodo);
    } catch (e) {
        next(e);
    }
});

// 認証必須: 自分のTodoのみ編集可
app.put("/editTodo/:id", authenticateToken, async (req: AuthRequest, res, next) => {
    try {
        const id = req.params.id;
        const { title, description, completed, priority, due_date } = req.body;
        const todo = await prisma.todo.findUnique({ where: { id } });
        if (!todo || todo.userId !== req.user.userId) {
            return sendError(res, "権限がありません", 403);
        }
        const editTodo = await prisma.todo.update({
            where: { id },
            data: { title, description, completed, priority, due_date: new Date(due_date) },
        });
        sendSuccess(res, editTodo);
    } catch (e) {
        next(e);
    }
});

// 認証必須: 自分のTodoのみ削除可
app.delete("/deleteTodo/:id", authenticateToken, async (req: AuthRequest, res, next) => {
    try {
        const id = req.params.id;
        const todo = await prisma.todo.findUnique({ where: { id } });
        if (!todo || todo.userId !== req.user.userId) {
            return sendError(res, "権限がありません", 403);
        }
        const deleteTodo = await prisma.todo.delete({ where: { id } });
        sendSuccess(res, deleteTodo);
    } catch (e) {
        next(e);
    }
});

// ===================== 一括更新API =====================
app.post("/bulkUpdateTodos", authenticateToken, async (req: AuthRequest, res, next) => {
    const todos = req.body.todos;
    if (!Array.isArray(todos)) {
        return sendError(res, "todos配列が必要です", 400);
    }
    for (const todo of todos) {
        if (todo.userId && todo.userId !== req.user.userId) {
            return sendError(res, "自分のTodoのみ一括更新できます", 403);
        }
    }
    for (const todo of todos) {
        if (
            typeof todo.id !== "string" ||
            typeof todo.title !== "string" ||
            typeof todo.description !== "string" ||
            typeof todo.completed !== "boolean" ||
            typeof todo.priority !== "string" ||
            typeof todo.due_date !== "string"
        ) {
            return sendError(res, "各todoにid, title, description, completed, priority, due_date(ISO8601)が必要です", 400);
        }
    }
    const todosForDb = todos.map(todo => ({
        ...todo,
        userId: req.user.userId,
        due_date: new Date(todo.due_date)
    }));
    try {
        await prisma.$transaction([
            prisma.todo.deleteMany({ where: { userId: req.user.userId } }),
            prisma.todo.createMany({ data: todosForDb })
        ]);
        sendSuccess(res, { message: "一括更新完了" });
    } catch (e) {
        next(e);
    }
});

// ===================== ユーザー認証API =====================

app.post('/register', async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return sendError(res, 'emailとpasswordは必須です', 400);
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword
            }
        });
        sendSuccess(res, { message: '登録完了', user: { id: user.id, email: user.email } });
    } catch (e) {
        next(e);
    }
});

app.post('/login', async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return sendError(res, 'emailとpasswordは必須です', 400);
    }
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return sendError(res, 'ユーザーが見つかりません', 401);

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return sendError(res, 'パスワードが違います', 401);

        const token = jwt.sign(
            { userId: user.id },
            JWT_SECRET,
            { expiresIn: '1d' }
        );
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000
        });
        // userIdの確認用ログ
        console.log('login user.id:', user.id);
        console.log('login JWT payload:', { userId: user.id });
        sendSuccess(res, { message: 'ログイン成功', token, userId: user.id });
    } catch (e) {
        next(e);
    }
});

app.get('/me', authenticateToken, async (req: AuthRequest, res, next) => {
    try {
        const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
        if (!user) return sendError(res, 'ユーザーが見つかりません', 404);
        sendSuccess(res, { id: user.id, email: user.email });
    } catch (e) {
        next(e);
    }
});

// サーバー起動
if (require.main === module) {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

export default app;
