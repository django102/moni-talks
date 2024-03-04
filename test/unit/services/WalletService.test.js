const assert = require('assert');
const sinon = require('sinon');
const { Wallet } = require('../../../api/models');
const UtilityService = require('../../../api/services/UtilityService');
const WalletService = require('../../../api/services/WalletService');

describe('WalletService', () => {
    describe('create', () => {
        it('should create a wallet for a user when no active wallet exists', async () => {
            sinon.stub(WalletService, 'fetch').resolves(null);
            sinon.stub(WalletService, 'generateWalletAccountNumber').resolves('1234567890');
            sinon.stub(Wallet, 'create').resolves({ userId: 1, accoutNumber: '1234567890' });

            const createdWallet = await WalletService.create(1);

            assert.strictEqual(createdWallet.userId, 1);
            assert.strictEqual(createdWallet.accoutNumber, '1234567890');

            sinon.restore();
        });

        it('should throw an error if an active wallet already exists for the user', async () => {
            sinon.stub(WalletService, 'fetch').resolves({ userId: 1, accoutNumber: '0987654321' });

            await assert.rejects(async () => {
                await WalletService.create(1);
            }, { message: 'An active wallet already exists' });

            sinon.restore();
        });
    });

    describe('fetch', () => {
        it('should fetch the active wallet for the user', async () => {
            sinon.stub(Wallet, 'findOne').resolves({ userId: 1, accoutNumber: '1234567890', isActive: true });

            const fetchedWallet = await WalletService.fetch(1);

            assert.strictEqual(fetchedWallet.userId, 1);
            assert.strictEqual(fetchedWallet.accoutNumber, '1234567890');
            assert.strictEqual(fetchedWallet.isActive, true);

            sinon.restore();
        });

        it('should return null if no active wallet exists for the user', async () => {
            sinon.stub(Wallet, 'findOne').resolves(null);

            const fetchedWallet = await WalletService.fetch(1);

            assert.strictEqual(fetchedWallet, null);

            sinon.restore();
        });
    });

    describe('generateWalletAccountNumber', () => {
        it('should generate a unique account number', async () => {
            sinon.stub(UtilityService, 'generateRandomNumber').resolves('1234567890');
            sinon.stub(WalletService, 'checkIfWalletAccountNumberExists').resolves(false);

            const accountNumber = await WalletService.generateWalletAccountNumber();

            assert.strictEqual(accountNumber, '1234567890');

            sinon.restore();
        });

        it('should regenerate account number if it already exists', async () => {
            sinon.stub(UtilityService, 'generateRandomNumber').resolves('0987654321');
            sinon.stub(WalletService, 'checkIfWalletAccountNumberExists').onFirstCall().resolves(true).onSecondCall().resolves(false);

            const accountNumber = await WalletService.generateWalletAccountNumber();

            assert.strictEqual(accountNumber, '0987654321');

            sinon.restore();
        });
    });

    describe('checkIfWalletAccountNumberExists', () => {
        it('should return true if wallet with given account number exists', async () => {
            sinon.stub(Wallet, 'findOne').resolves({});

            const exists = await WalletService.checkIfWalletAccountNumberExists('1234567890');

            assert.strictEqual(exists, true);

            sinon.restore();
        });

        it('should return false if wallet with given account number does not exist', async () => {
            sinon.stub(Wallet, 'findOne').resolves(null);

            const exists = await WalletService.checkIfWalletAccountNumberExists('0987654321');

            assert.strictEqual(exists, false);

            sinon.restore();
        });
    });
});