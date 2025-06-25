import request from 'supertest';
import app from './index';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

let token: string;
let todoId: string;
let userId: string;
const prisma = new PrismaClient();

describe('認証・Todo API統合テスト', () => {
    const testUser = { email: 'test@example.com', password: 'testpass' };

    beforeAll(async () => {
        // テスト用データをクリーンアップ
        await prisma.todo.deleteMany({});
        await prisma.user.deleteMany({ where: { email: testUser.email } });
        // ユーザー登録
        await request(app).post('/register').send(testUser);
        // ログインしてトークン取得
        const res = await request(app).post('/login').send(testUser);
        token = res.body.data?.token;
        expect(token).toBeTruthy(); // tokenが取得できているかチェック
        // JWTからuserIdを取得
        const decoded: any = jwt.decode(token);
        userId = decoded?.userId;
        expect(userId).toBeTruthy(); // userIdが取得できているかチェック
    });

    it('トークン無しでTodo取得は401', async () => {
        const res = await request(app).get('/allTodos');
        expect(res.status).toBe(401);
    });

    it('Todo新規作成', async () => {
        const res = await request(app)
            .post('/createTodo')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'test',
                description: 'desc',
                completed: false,
                priority: 'medium',
                due_date: '2025-07-01',
                userId // 明示的にuserIdを送る（API側で上書きされるが型不一致回避のため）
            });
        expect(res.status).toBe(200);
        expect(res.body.data.title).toBe('test');
        todoId = res.body.data.id;
    });

    it('自分のTodo取得', async () => {
        const res = await request(app)
            .get('/allTodos')
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.data[0].title).toBe('test');
    });

    it('自分のTodo編集', async () => {
        const res = await request(app)
            .put(`/editTodo/${todoId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ title: 'updated', description: 'desc', completed: true, priority: 'high', due_date: '2025-07-02' });
        expect(res.status).toBe(200);
        expect(res.body.data.title).toBe('updated');
    });

    it('自分のTodo削除', async () => {
        const res = await request(app)
            .delete(`/deleteTodo/${todoId}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
    });

    // 他人のTodo操作や不正トークンのテストも追加可能
});
