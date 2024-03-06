const assert = require('assert');
const LedgerService = require('../../../api/services/LedgerService');
const { Ledger, Transaction } = require('../../../api/models');
const sinon = require('sinon');

describe('LedgerService', () => {
    describe('getBalance', () => {
        afterEach(() => {
            sinon.restore();
        });

        it('should return correct available balance for valid account number', async () => {
            const accountNumber = 'valid_account_number';

            sinon.stub(LedgerService, 'getBookBalance').resolves(1500000.00);
            sinon.stub(LedgerService, 'getPendingCharges').resolves(35192.55);

            const availableBalance = await LedgerService.getBalance(accountNumber);
            assert.strictEqual(availableBalance, 1464807.45);
        });

        it('should return correct available balance even if book balance is 0 and pending charges are 0', async () => {
            const accountNumber = 'account_with_no_transactions';

            sinon.stub(LedgerService, 'getBookBalance').resolves(0.00);
            sinon.stub(LedgerService, 'getPendingCharges').resolves(0.00);

            const availableBalance = await LedgerService.getBalance(accountNumber);
            assert.strictEqual(availableBalance, 0.00);
        });

        it('should throw an error for invalid account number', async () => {
            const accountNumber = null; // or any invalid account number
            await assert.rejects(async () => {
                await LedgerService.getBalance(accountNumber);
            }, {
                message: 'No account number provided'
            });
        });
    });

    describe('getBookBalance', () => {
        afterEach(() => {
            sinon.restore();
        });

        it('should return correct book balance for valid account number', async () => {
            const accountNumber = 'valid_account_number';

            sinon.stub(Ledger, 'findOne').resolves({ totalCredit: 155231.67, totalDebit: 12300.00 });

            const bookBalance = await LedgerService.getBookBalance(accountNumber);
            assert.strictEqual(bookBalance, 142931.67);
        });

        it('should return 0 book balance for account with no transactions', async () => {
            const accountNumber = 'account_with_no_transactions';

            sinon.stub(Ledger, 'findOne').resolves({ totalCredit: 0.00, totalDebit: 0.00 });

            const bookBalance = await LedgerService.getBookBalance(accountNumber);
            assert.strictEqual(bookBalance, 0.00);
        });

        it('should throw an error for invalid account number', async () => {
            const accountNumber = null; // or any invalid account number
            await assert.rejects(async () => {
                await LedgerService.getBookBalance(accountNumber);
            }, {
                message: 'No account number provided'
            });
        });
    });

    describe('getPendingCharges', () => {
        afterEach(() => {
            sinon.restore();
        });

        it('should return correct pending charges for valid account number', async () => {
            const accountNumber = 'valid_account_number';

            sinon.stub(Transaction, 'findOne').resolves({ totalAmount: 22315.00 });

            const pendingCharges = await LedgerService.getPendingCharges(accountNumber);
            assert.strictEqual(pendingCharges, 22315.00);
        });

        it('should return 0 pending charges for account with no pending transactions', async () => {
            const accountNumber = 'account_with_no_pending_transactions';

            sinon.stub(Transaction, 'findOne').resolves({ totalAmount: 0.00 });

            const pendingCharges = await LedgerService.getPendingCharges(accountNumber);
            assert.strictEqual(pendingCharges, 0.00);
        });

        it('should throw an error for invalid account number', async () => {
            const accountNumber = null; // or any invalid account number
            await assert.rejects(async () => {
                await LedgerService.getPendingCharges(accountNumber);
            }, {
                message: 'No account number provided'
            });
        });
    });
});
