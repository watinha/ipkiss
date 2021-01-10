let request = require('supertest'),
    app = require('../../app');

beforeEach(async () => {
    await request(app).post('/reset')
                      .expect(200);
});

describe('deposit', () => {

    it('should create account with initial balance', async () => {
        let params = {"type":"deposit", "destination":"100", "amount":10},
            response = await request(app).post('/event')
                                         .send(params)
                                         .expect(201);
        expect(response.body).toEqual(
            {"destination": {"id":"100", "balance":10}});
    });

    it('should deposit in an existing account', async () => {
        let params = {"type":"deposit", "destination":"100", "amount": 10},
            response1 = await request(app).post('/event')
                                         .send(params)
                                         .expect(201),
            response2 = await request(app).post('/event')
                                         .send(params)
                                         .expect(201);
        expect(response2.body).toEqual(
            {"destination": {"id":"100", "balance": 20}});
    });

    it('should deposit in different account', async () => {
        let params1 = {"type":"deposit", "destination":"300", "amount": 20},
            params2 = {"type":"deposit", "destination":"300", "amount": 30},
            response1 = await request(app).post('/event')
                                         .send(params1)
                                         .expect(201),
            response2 = await request(app).post('/event')
                                         .send(params2)
                                         .expect(201);
        expect(response1.body).toEqual(
            {"destination": {"id":"300", "balance": 20}});
        expect(response2.body).toEqual(
            {"destination": {"id":"300", "balance": 50}});
    });

});
