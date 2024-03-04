const assert = require('assert');
const sinon = require('sinon');
const { User } = require('../../../api/models');
const LoggerService = require('../../../api/services/LoggerService');
const WalletService = require('../../../api/services/WalletService');
const UserService = require('../../../api/services/UserService');

describe('UserService', () => {
    describe('create', () => {
        afterEach(() => {
            sinon.restore();
        });

        it('should create a new user', async () => {
            const userData = { email: 'test@example.com', password: 'password123' };
            sinon.stub(UserService, 'fetchByEmail').resolves(null);
            sinon.stub(User, 'create').resolves({ ...userData, id: 1 });

            const createdUser = await UserService.create(userData);

            assert.strictEqual(createdUser.email, 'test@example.com');
            assert.strictEqual(createdUser.id, 1);
        });

        it('should return existing user if email already exists', async () => {
            const existingUser = { email: 'test@example.com', password: 'existingPassword' };
            sinon.stub(UserService, 'fetchByEmail').resolves(existingUser);

            const userData = { email: 'test@example.com', password: 'password123' };
            const createdUser = await UserService.create(userData);

            assert.deepStrictEqual(createdUser, existingUser);
        });

        it('should log error and throw if user creation fails', async () => {
            const userData = { email: 'test@example.com', password: 'password123' };
            sinon.stub(UserService, 'fetchByEmail').resolves(null);
            sinon.stub(User, 'create').rejects(new Error('Database error'));
            const errorStub = sinon.stub(LoggerService, 'error');

            await assert.rejects(async () => {
                await UserService.create(userData);
            }, { message: 'Error: Database error' });

            assert(errorStub.calledOnceWithMatch(sinon.match.instanceOf(Error)));
        });
    });

    describe('update', () => {
        it('should update user information', async () => {
            const userData = { email: 'test@example.com', name: 'Test User' };
            sinon.stub(UserService, 'fetchByEmail').resolves(userData);
            sinon.stub(User, 'update').resolves(userData);

            const updatedUser = await UserService.update({ email: 'test@example.com', name: 'Test User' });

            assert.strictEqual(updatedUser.email, 'test@example.com');
            assert.strictEqual(updatedUser.name, 'Test User');

            sinon.restore();
        });

        it('should update user information and remove password from the response', async () => {
            const userData = { email: 'test@example.com', name: 'Test User', password:'myPassword' };
            sinon.stub(UserService, 'fetchByEmail').resolves(userData);
            sinon.stub(User, 'update').resolves(userData);

            const updatedUser = await UserService.update({ email: 'test@example.com', name: 'Test User' });

            assert.strictEqual(updatedUser.email, 'test@example.com');
            assert.strictEqual(updatedUser.name, 'Test User');
            assert.strictEqual(updatedUser.password, undefined);

            sinon.restore();
        });

        it('should throw error if user not found during update', async () => {
            sinon.stub(UserService, 'fetchByEmail').resolves(null);

            await assert.rejects(async () => {
                await UserService.update({ email: 'test@example.com', name: 'Test User' });
            }, { message: 'User not found' });

            sinon.restore();
        });

        it('should throw error if user update fails', async () => {
            const userData = { email: 'test@example.com', password: 'password123' };
            sinon.stub(UserService, 'fetchByEmail').resolves(userData);
            sinon.stub(User, 'update').rejects(new Error('Database error'));
            sinon.stub(LoggerService, 'error');

            await assert.rejects(async () => {
                await UserService.update({ email: 'test@example.com', name: 'Test User' });
            }, { message: 'Error: Database error' });

            sinon.restore();
        });
    });

    describe('fetch', () => {
        it('should fetch user information', async () => {
            const userData = { id: 1, email: 'test@example.com', password: 'password123', name: 'Test User' };
            sinon.stub(User, 'findOne').resolves(userData);

            const fetchedUser = await UserService.fetch(1);

            assert.strictEqual(fetchedUser.id, 1);
            assert.strictEqual(fetchedUser.email, 'test@example.com');
            assert.strictEqual(fetchedUser.name, 'Test User');
            assert.strictEqual(fetchedUser.password, undefined);

            sinon.restore();
        });

        it('should return null if user not found', async () => {
            sinon.stub(User, 'findOne').resolves(null);

            const fetchedUser = await UserService.fetch(1);

            assert.strictEqual(fetchedUser, null);

            sinon.restore();
        });

        it('should fetch user information without password', async () => {
            const userData = { id: 1, email: 'test@example.com', password: 'password123', name: 'Test User' };
            sinon.stub(User, 'findOne').resolves(userData);

            const fetchedUser = await UserService.fetch(1);

            assert.strictEqual(fetchedUser.id, 1);
            assert.strictEqual(fetchedUser.email, 'test@example.com');
            assert.strictEqual(fetchedUser.name, 'Test User');
            assert.strictEqual(fetchedUser.password, undefined);

            sinon.restore();
        });
    });

    describe('fetchByEmail', () => {
        it('should fetch user information by email', async () => {
            const userData = { id: 1, email: 'test@example.com', password: 'password123', name: 'Test User' };
            sinon.stub(User, 'findOne').resolves(userData);

            const fetchedUser = await UserService.fetchByEmail('test@example.com');

            assert.strictEqual(fetchedUser.id, 1);
            assert.strictEqual(fetchedUser.email, 'test@example.com');
            assert.strictEqual(fetchedUser.name, 'Test User');
            assert.strictEqual(fetchedUser.password, undefined);

            sinon.restore();
        });

        it('should return null if user with given email not found', async () => {
            sinon.stub(User, 'findOne').resolves(null);

            const fetchedUser = await UserService.fetchByEmail('test@example.com');

            assert.strictEqual(fetchedUser, null);

            sinon.restore();
        });

        it('should fetch user information without password', async () => {
            const userData = { id: 1, email: 'test@example.com', password: 'password123', name: 'Test User' };
            sinon.stub(User, 'findOne').resolves(userData);

            const fetchedUser = await UserService.fetchByEmail('test@example.com');

            assert.strictEqual(fetchedUser.id, 1);
            assert.strictEqual(fetchedUser.email, 'test@example.com');
            assert.strictEqual(fetchedUser.name, 'Test User');
            assert.strictEqual(fetchedUser.password, undefined);

            sinon.restore();
        });
    });

    describe('createWallet', () => {
        it('should create a wallet for the user', async () => {
            const userData = { id: 1, email: 'test@example.com', name: 'Test User' };
            sinon.stub(UserService, 'fetch').resolves(userData);
            sinon.stub(WalletService, 'create').resolves({ id: 1, userId: 1, accoutNumber: '1234567890' });

            const wallet = await UserService.createWallet(1);

            assert.strictEqual(wallet.id, 1);
            assert.strictEqual(wallet.userId, 1);
            assert.strictEqual(wallet.accoutNumber, '1234567890');

            sinon.restore();
        });

        it('should throw error if user not found', async () => {
            sinon.stub(UserService, 'fetch').resolves(null);

            await assert.rejects(async () => {
                await UserService.createWallet(1);
            }, { message: 'User not found' });

            sinon.restore();
        });

        it('should throw error if wallet creation fails', async () => {
            const userData = { id: 1, email: 'test@example.com', name: 'Test User' };
            sinon.stub(UserService, 'fetch').resolves(userData);
            sinon.stub(WalletService, 'create').rejects(new Error('Could not create wallet at the moment'));
            sinon.stub(LoggerService, 'error');

            await assert.rejects(async () => {
                await UserService.createWallet(1);
            }, { message: 'Could not create wallet at the moment' });

            sinon.restore();
        });
    });
});
