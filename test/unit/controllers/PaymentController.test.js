const request = require('supertest');
const should = require('should');
const sinon = require('sinon');

const app = require('../../../app');
const { PaymentService, LoggerService } = require('../../../api/services');

describe('PaymentController', () => {
    before(async () => {
    });

    after(async (done) => {
        app.close(done());
    });

    beforeEach(() => {
        sinon.stub(LoggerService, 'info');
        sinon.stub(LoggerService, 'trace');
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('POST /api/payment', () => {
        it('should return 400 if payment request is invalid', async () => {
            const invalidRequest = { card: {}, amount: 0 };

            const response = await request(app)
                .post('/api/payment')
                .send(invalidRequest);

            should(response.statusCode).eql(400);
            should(response.body.status).eql(false);
        });

        it('should return 500 if payment processing fails', async () => {
            const validRequest = {
                "card": {
                    "number": "1234567890123456",
                    "expMonth": 12,
                    "expYear": 2023,
                    "cvv": 123
                },
                "amount": 100
            };
            sinon.stub(PaymentService, 'processCardPayment').rejects(new Error('Processing error'));

            const response = await request(app)
                .post('/api/payment')
                .send(validRequest);


            should(response.statusCode).eql(500);
            should(response.body.status).eql(false);
            should(response.body.message).eql('Processing error');

        });

        it('should return 200 if payment processing is successful', async () => {
            const validRequest = { card: { number: '1234567890123456', expMonth: 12, expYear: 2023, cvv: 123 }, amount: 100 };
            const mockUser = { id: 1, name: 'John Doe' };
            sinon.stub(PaymentService, 'processCardPayment').resolves(mockUser);


            const response = await request(app)
                .post('/api/payment')
                .send(validRequest);

            should(response.statusCode).eql(200);
            should(response.body.status).eql(true);
            should(response.body.message).eql('Payment Successful');
        });
    });
});