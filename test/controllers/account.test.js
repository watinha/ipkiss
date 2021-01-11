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

describe('balance', () => {

    it('should return the balance of multiple accounts', async () => {
        let params1 = {"type":"deposit", "destination":"300", "amount": 20},
            params2 = {"type":"deposit", "destination":"100", "amount": 12},
            response1, response2;

        await request(app).post('/event')
                          .send(params1)
                          .expect(201);
        await request(app).post('/event')
                          .send(params2)
                          .expect(201);

        response1 = await request(app).get('/balance?account_id=300')
                                      .expect(200);
        expect(response1.text).toBe('20');

        response2 = await request(app).get('/balance?account_id=100')
                                      .expect(200);
        expect(response2.text).toBe('12');
    });

    it('should return 404 and 0 for non-existant account', async () => {
        let response1 = await request(app).get('/balance?account_id=999')
                                          .expect(404);
        expect(response1.text).toBe('0');
    });

    it('should return the balance 0 for existant account', async () => {
        let params1 = {"type":"deposit", "destination":"300", "amount": 0},
            response1;

        await request(app).post('/event')
                          .send(params1)
                          .expect(201);

        response1 = await request(app).get('/balance?account_id=300')
                                      .expect(200);
        expect(response1.text).toBe('0');
    });

});

describe('withdraw', () => {

    beforeEach(async () => {
        await request(app).post('/event')
                          .send({"type":"deposit", "destination":"300", "amount": 300})
                          .expect(201);
        await request(app).post('/event')
                          .send({"type":"deposit", "destination":"100", "amount": 20})
                          .expect(201);
        await request(app).post('/event')
                          .send({"type":"deposit", "destination":"999", "amount": 0})
                          .expect(201);
    });

    it('should subtract from balance of existing account', async () => {
        let response = await request(app).post('/event')
                                         .send({"type":"withdraw", "origin":"100", "amount": 5})
                                         .expect(201);

        expect(response.body).toEqual({"origin": {"id":"100", "balance": 15}});
    });

    it('should subtract from balance from different account', async () => {
        let response = await request(app).post('/event')
                                         .send({"type":"withdraw", "origin":"300", "amount": 115})
                                         .expect(201);

        expect(response.body).toEqual({"origin": {"id":"300", "balance": 185}});
    });

    it('should return 404 if queries a non-existant account', async () => {
        let response = await request(app).post('/event')
                                         .send({"type":"withdraw", "origin":"200", "amount": 2})
                                         .expect(404);

        expect(response.text).toEqual('0');
    });

    it('should return 201 for existing account with 0 balance', async () => {
        let response = await request(app).post('/event')
                                         .send({"type":"withdraw", "origin":"999", "amount": 10})
                                         .expect(201);

        expect(response.body).toEqual({"origin": {"id":"999", "balance": -10}});
    });

});

describe('transfer', () => {

    beforeEach(async () => {
        await request(app).post('/event')
                          .send({"type":"deposit", "destination":"300", "amount": 0})
                          .expect(201);
        await request(app).post('/event')
                          .send({"type":"deposit", "destination":"100", "amount": 15})
                          .expect(201);
    });

    it('should transfer from existing accounts', async () => {
        let params = {"type":"transfer", "origin":"100", "amount":15, "destination":"300"},
            expected = {
                "origin": {"id":"100", "balance":0},
                "destination": {"id":"300", "balance":15}
            },
            response = await request(app).post('/event')
                                         .send(params)
                                         .expect(201);

        expect(response.body).toEqual(expected);
    });

    it('should transfer differently from existing accounts', async () => {
        let params = {"type":"transfer", "origin":"300", "amount": 100, "destination":"100"},
            expected = {
                "origin": {"id":"300", "balance": -100},
                "destination": {"id":"100", "balance": 115}
            },
            response = await request(app).post('/event')
                                         .send(params)
                                         .expect(201);

        expect(response.body).toEqual(expected);
    });

    it('should not transfer if origin does not exist', async () => {
        let params = {"type":"transfer", "origin":"200", "amount": 100, "destination":"300"},
            expected = '0',
            response = await request(app).post('/event')
                                         .send(params)
                                         .expect(404);

        expect(response.text).toEqual(expected);
    });

});

it('should not result in API timeout', async () => {
    let params = {"type":"NONEXISTANTTYPE"},
        expected = '0',
        response = await request(app).post('/event')
                                     .send(params)
                                     .expect(404);

    expect(response.text).toEqual(expected);
});
