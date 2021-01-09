let request = require('supertest'),
    app = require('../app');

describe('project setup', () => {
    it('should respond 200 on /hello', async () => {
        let response = await request(app).get('/hello')
                                         .expect(200);
        expect(response.text).toBe('Hello');
    });
    it('should respond 404 on /notfound', async () => {
        let response = await request(app).get('/notfound')
                                         .expect(404);
        expect(response.body).toStrictEqual({
            message: 'Not found'
        });
    });
});
