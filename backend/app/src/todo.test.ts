import request from 'supertest';
import app from './index';

describe('Todo API', () => {
    it('GET /allTodos should return 200 and array', async () => {
        const res = await request(app).get('/allTodos');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('POST /createTodo should create a todo', async () => {
        const res = await request(app)
            .post('/createTodo')
            .send({
                title: 'テストタスク',
                description: 'テスト説明',
                completed: false,
                priority: 'medium',
                due_date: '2025-07-01T00:00:00.000Z'
            });
        expect(res.statusCode).toBe(200);
        expect(res.body.title).toBe('テストタスク');
        expect(res.body.description).toBe('テスト説明');
    });
});
