const request = require('supertest');
const should = require('should');
const sinon = require('sinon');

const app = require('../../../app');
const { UserService, LoggerService, AuthService, WalletService, CardService } = require('../../../api/services');

let token;

describe('UserController', () => {
    before(async () => {
        token = AuthService.issueToken({ userId: 'demoUser', isAuthenticated: true }, 10);
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


    describe('POST /api/user', () => {
        it('should return 400 if request body is invalid', async () => {
            const invalidRequestBody = { firstName: 'John', lastName: 'Doe' };

            const response = await request(app)
                .post('/api/user')
                .send(invalidRequestBody);

            should(response.statusCode).eql(400);
            should(response.body.status).eql(false);
        });

        it('should return 500 if an error occurs during user creation', async () => {
            const validRequestBody = { email: 'test@example.com', password: 'password', firstName: 'John', lastName: 'Doe', phoneNumber: '+1234567890' };
            sinon.stub(UserService, 'create').rejects(new Error('Database error'));

            const response = await request(app)
                .post('/api/user')
                .send(validRequestBody);

            should(response.statusCode).eql(500);
            should(response.body.status).eql(false);
            should(response.body.message).eql('Database error');
        });

        it('should return 200 with user details if user creation is successful', async () => {
            const validRequestBody = { email: 'test@example.com', password: 'password', firstName: 'John', lastName: 'Doe', phoneNumber: '+1234567890' };
            const mockUser = { id: 1, firstName: 'John', lastName: 'Doe', email: 'test@example.com' };
            const createUserStub = sinon.stub(UserService, 'create').resolves(mockUser);

            const response = await request(app)
                .post('/api/user')
                .send(validRequestBody);

            should(response.statusCode).eql(200);
            should(response.body.status).eql(true);
            should(response.body.data).deepEqual(mockUser);
        });
    });

    describe('POST /api/user/authenticate', () => {
        it('should return 400 if request body is invalid', async () => {
            const invalidRequestBody = { email: 'test@example.com' };

            const response = await request(app)
                .post('/api/user/authenticate')
                .send(invalidRequestBody);

            should(response.statusCode).eql(400);
            should(response.body.status).eql(false);
        });

        it('should return 500 if an error occurs during user authentication', async () => {
            const validRequestBody = { email: 'test@example.com', password: 'password' };
            sinon.stub(UserService, 'authenticate').rejects(new Error('Authentication error'));

            const response = await request(app)
                .post('/api/user/authenticate')
                .send(validRequestBody);

            should(response.statusCode).eql(500);
            should(response.body.status).eql(false);
            should(response.body.message).eql('Authentication error');
        });

        it('should return 200 with user details if user authentication is successful', async () => {
            const validRequestBody = { email: 'test@example.com', password: 'password' };
            const mockUser = { id: 1, firstName: 'John', lastName: 'Doe', email: 'test@example.com' };
            const authenticateStub = sinon.stub(UserService, 'authenticate').resolves(mockUser);

            const response = await request(app)
                .post('/api/user/authenticate')
                .send(validRequestBody);

            should(response.statusCode).eql(200);
            should(response.body.status).eql(true);
            should(response.body.data).deepEqual(mockUser);
        });
    });

    describe('GET /api/user/:id', () => {
        it('should return 500 if an error occurs while fetching user', async () => {
            const userId = 123;
            sinon.stub(UserService, 'fetch').rejects(new Error('User fetch error'));

            const response = await request(app)
                .get(`/api/user/${userId}`)
                .set({ Authorization: `Bearer ${token}` });

            should(response.statusCode).eql(500);
            should(response.body.status).eql(false);
            should(response.body.message).eql('User fetch error');
        });

        it('should return 200 with user details if user is fetched successfully', async () => {
            const userId = 123;
            const mockUser = { id: userId, firstName: 'John', lastName: 'Doe', email: 'test@example.com' };
            sinon.stub(UserService, 'fetch').resolves(mockUser);

            const response = await request(app)
                .get(`/api/user/${userId}`)
                .set({ Authorization: `Bearer ${token}` });

            should(response.statusCode).eql(200);
            should(response.body.status).eql(true);
            should(response.body.data).deepEqual(mockUser);
        });
    });

    describe('POST /api/user/:id/wallet', () => {
        it('should return 400 if userId parameter is missing', async () => {
            const userId = '';

            const response = await request(app)
                .post(`/api/user/${userId}/wallet`)
                .set({ Authorization: `Bearer ${token}` });

            should(response.statusCode).eql(404);
        });

        it('should return 500 if an error occurs while creating wallet', async () => {
            const userId = 123;
            sinon.stub(UserService, 'createWallet').rejects(new Error('Wallet creation error'));

            const response = await request(app)
                .post(`/api/user/${userId}/wallet`)
                .set({ Authorization: `Bearer ${token}` });

            should(response.statusCode).eql(500);
            should(response.body.status).eql(false);
            should(response.body.message).eql('Wallet creation error');
        });

        it('should return 200 with wallet details if wallet is created successfully', async () => {
            const userId = 123;
            const mockWallet = { id: 1, userId: userId, balance: 0 };
            sinon.stub(UserService, 'createWallet').resolves(mockWallet);

            const response = await request(app)
                .post(`/api/user/${userId}/wallet`)
                .set({ Authorization: `Bearer ${token}` });

            should(response.statusCode).eql(200);
            should(response.body.status).eql(true);
            should(response.body.data).deepEqual(mockWallet);
        });
    });

    describe('GET /api/user/:id/wallet', () => {
        it('should return 400 if userId parameter is missing', async () => {
            const userId = '';

            const response = await request(app)
                .get(`/api/user/${userId}/wallet`)
                .set({ Authorization: `Bearer ${token}` });

            should(response.statusCode).eql(404);
        });

        it('should return 500 if an error occurs while fetching wallet', async () => {
            const userId = 123;
            sinon.stub(WalletService, 'fetch').rejects(new Error('Wallet fetch error'));

            const response = await request(app)
                .get(`/api/user/${userId}/wallet`)
                .set({ Authorization: `Bearer ${token}` });

            should(response.statusCode).eql(500);
            should(response.body.status).eql(false);
            should(response.body.message).eql('Wallet fetch error');
        });

        it('should return 200 with wallet details if wallet is fetched successfully', async () => {
            const userId = 123;
            const mockWallet = { id: 1, userId: userId, balance: 100 };
            sinon.stub(WalletService, 'fetch').resolves(mockWallet);

            const response = await request(app)
                .get(`/api/user/${userId}/wallet`)
                .set({ Authorization: `Bearer ${token}` });

            should(response.statusCode).eql(200);
            should(response.body.status).eql(true);
            should(response.body.data).deepEqual(mockWallet);
        });
    });

    describe('POST /api/user/:id/card', () => {
        it('should return 400 if userId parameter is missing', async () => {
            const userId = '';

            const response = await request(app)
                .post(`/api/user/${userId}/card`)
                .set({ Authorization: `Bearer ${token}` });

            should(response.statusCode).eql(404);
        });

        it('should return 500 if an error occurs while creating card', async () => {
            const userId = 123;
            sinon.stub(CardService, 'create').rejects(new Error('Card creation error'));

            const response = await request(app)
                .post(`/api/user/${userId}/card`)
                .set({ Authorization: `Bearer ${token}` });

            should(response.statusCode).eql(500);
            should(response.body.status).eql(false);
            should(response.body.message).eql('Card creation error');
        });

        it('should return 200 with card details if card is created successfully', async () => {
            const userId = 123;
            const mockCard = { id: 1, userId: userId, cardNumber: '1234567890123456', expiryMonth: 12, expiryYear: 2024 };
            sinon.stub(CardService, 'create').resolves(mockCard);

            const response = await request(app)
                .post(`/api/user/${userId}/card`)
                .set({ Authorization: `Bearer ${token}` });

            should(response.statusCode).eql(200);
            should(response.body.status).eql(true);
            should(response.body.data).deepEqual(mockCard);
        });
    });

    describe('GET /api/user/:id/card', () => {
        it('should return 400 if userId parameter is missing', async () => {
            const userId = '';

            const response = await request(app)
                .get(`/api/user/${userId}/card`)
                .set({ Authorization: `Bearer ${token}` });

            should(response.statusCode).eql(404);
        });

        it('should return 500 if an error occurs while fetching cards', async () => {
            const userId = 123;
            sinon.stub(CardService, 'getCards').rejects(new Error('Card fetch error'));

            const response = await request(app)
                .get(`/api/user/${userId}/card`)
                .set({ Authorization: `Bearer ${token}` });

            should(response.statusCode).eql(500);
            should(response.body.status).eql(false);
            should(response.body.message).eql('Card fetch error');
        });

        it('should return 200 with card details if cards are fetched successfully', async () => {
            const userId = 123;
            const mockCards = [
                { id: 1, userId: userId, cardNumber: '1234567890123456', expiryMonth: 12, expiryYear: 2024 },
                { id: 2, userId: userId, cardNumber: '6543210987654321', expiryMonth: 11, expiryYear: 2023 }
            ];
            sinon.stub(CardService, 'getCards').resolves(mockCards);

            const response = await request(app)
                .get(`/api/user/${userId}/card`)
                .set({ Authorization: `Bearer ${token}` });

            should(response.statusCode).eql(200);
            should(response.body.status).eql(true);
            should(response.body.data).deepEqual(mockCards);
        });
    });
});