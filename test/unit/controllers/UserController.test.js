const request = require('supertest');
const should = require('should');

const { bootstrapApp } = require('../../bootstrap.test');

describe('UserController', () => {
    let settings;

    before(async () => {
        settings = await bootstrapApp();
        process.env = settings.env;
    });
    after(async () => { });




    it('should call the endpoint successfully', async () => {
        const response = await request(settings.app)
            .post('/api/user')
            .send();

        should(response.body.status).eql(true);
    });
});