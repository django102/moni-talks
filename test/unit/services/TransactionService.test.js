const assert = require('assert');
const moment = require('moment');
const sinon = require('sinon');
const { UtilityService, TransactionService, LoggerService } = require('../../../api/services');
const { Transaction, Ledger } = require('../../../api/models');
const { TransactionStatus } = require('../../../api/enums');
const { sequelize } = require('../../../api/data');


describe('TransactionService', () => {
    describe('generateTransactionReference', () => {
        it('should generate a valid transaction reference with correct length', () => {
            const generatedReference = TransactionService.generateTransactionReference();
            assert.strictEqual(generatedReference.length, 30);
        });

        it('should generate a unique reference on consecutive calls', () => {
            const reference1 = TransactionService.generateTransactionReference();
            const reference2 = TransactionService.generateTransactionReference();

            assert.notStrictEqual(reference1, reference2);
        });
    });

    describe('createTransaction', () => {
        it('should create a transaction successfully', async () => {
            // Mocking Transaction.create to return a mock transaction
            const mockTransaction = { id: 1, reference: 'mock_reference', amount: 100 };
            const transactionCreateStub = sinon.stub(Transaction, 'create').resolves(mockTransaction);

            // Mocking generateTransactionReference to return a fixed reference
            const fixedReference = 'fixed_reference';
            const generateTransactionReferenceStub = sinon.stub(TransactionService, 'generateTransactionReference').returns(fixedReference);

            // Test data
            const transactionData = {
                amount: 100,
                // Add other required fields for transaction creation
            };

            const createdTransaction = await TransactionService.createTransaction(transactionData);

            // Asserting the Transaction.create function call
            sinon.assert.calledOnceWithExactly(transactionCreateStub, { ...transactionData, reference: fixedReference });

            // Asserting the result
            assert.deepStrictEqual(createdTransaction, mockTransaction);

            // Restoring the stubs
            transactionCreateStub.restore();
            generateTransactionReferenceStub.restore();
        });

        it('should throw an error if transaction creation fails', async () => {
            const errorStub = sinon.stub(LoggerService, 'error');

            // Mocking Transaction.create to throw an error
            const error = new Error('Database error');
            const transactionCreateStub = sinon.stub(Transaction, 'create').rejects(error);

            // Mocking generateTransactionReference to return a fixed reference
            const fixedReference = 'fixed_reference';
            const generateTransactionReferenceStub = sinon.stub(TransactionService, 'generateTransactionReference').returns(fixedReference);

            // Test data
            const transactionData = {
                amount: 100,
                // Add other required fields for transaction creation
            };

            await assert.rejects(async () => {
                await TransactionService.createTransaction(transactionData);
            }, {
                message: 'Error occurred while creating transaction'
            });

            // Asserting the Transaction.create function call
            sinon.assert.calledOnceWithExactly(transactionCreateStub, { ...transactionData, reference: fixedReference });

            // Restoring the stubs
            transactionCreateStub.restore();
            generateTransactionReferenceStub.restore();
            errorStub.restore();
        });
    });

    describe('updateTransactionStatus', () => {
        let databaseTransactionStub;

        beforeEach(() => {
            databaseTransactionStub = sinon.stub(sequelize, 'transaction');
        });

        afterEach(() => {
            databaseTransactionStub.reset();
            databaseTransactionStub.restore();
        });


        it('should update transaction status to SUCCESS and create ledger entries successfully', async () => {
            const databaseOperationTransactionMock = {
                commit: sinon.stub().resolves(),
                rollback: sinon.stub().resolves()
            };
            databaseTransactionStub.resolves(databaseOperationTransactionMock);

            // Mocking TransactionService.getTransaction to return a mock transaction
            const mockTransaction = { id: 1, reference: 'mock_reference', account: 'mock_account', amount: 100, narration: 'mock_narration' };
            const getTransactionStub = sinon.stub(TransactionService, 'getTransaction').resolves(mockTransaction);

            // Mocking Transaction.update to return a mock updated transaction
            const mockUpdatedTransaction = { ...mockTransaction, status: TransactionStatus.SUCCESS };
            const updateTransactionStub = sinon.stub(Transaction, 'update').resolves(mockUpdatedTransaction);

            // Mocking Ledger.bulkCreate to return a successful promise
            const bulkCreateStub = sinon.stub(Ledger, 'bulkCreate').resolves();

            // Test data
            const reference = 'mock_reference';
            const status = TransactionStatus.SUCCESS;

            const updatedTransaction = await TransactionService.updateTransactionStatus(reference, status);

            // Asserting the TransactionService.getTransaction function call
            sinon.assert.calledOnceWithExactly(getTransactionStub, reference);

            // Asserting the Transaction.update function call
            sinon.assert.calledOnceWithExactly(updateTransactionStub, { status }, { where: { reference } }, { transaction: databaseOperationTransactionMock });

            // Asserting the Ledger.bulkCreate function call
            sinon.assert.calledOnceWithExactly(bulkCreateStub, [
                { reference: mockTransaction.reference, account: mockTransaction.account, debit: mockTransaction.amount, narration: mockTransaction.narration },
                { reference: mockTransaction.reference, account: 'GL-CARD-PURCHASE-001', credit: mockTransaction.amount, narration: mockTransaction.narration }
            ],
                { transaction: databaseOperationTransactionMock });

            // Asserting the result
            assert.deepStrictEqual(updatedTransaction, mockUpdatedTransaction);

            // Restoring the stubs
            getTransactionStub.restore();
            updateTransactionStub.restore();
            bulkCreateStub.restore();
        });

        it('should update transaction status to REVERSED and create reversal ledger entries successfully', async () => {
            const errorStub = sinon.stub(LoggerService, 'error');

            const databaseOperationTransactionMock = {
                commit: sinon.stub().resolves(),
                rollback: sinon.stub().resolves()
            };
            databaseTransactionStub.resolves(databaseOperationTransactionMock);

            // Mocking TransactionService.getTransaction to return a mock transaction
            const mockTransaction = { id: 1, reference: 'mock_reference', account: 'mock_account', amount: 100, narration: 'mock_narration' };
            const getTransactionStub = sinon.stub(TransactionService, 'getTransaction').resolves(mockTransaction);

            // Mocking Transaction.update to return a mock updated transaction
            const mockUpdatedTransaction = { ...mockTransaction, status: TransactionStatus.REVERSED };
            const updateTransactionStub = sinon.stub(Transaction, 'update').resolves(mockUpdatedTransaction);

            // Mocking Ledger.update to return a successful promise
            const ledgerUpdateStub = sinon.stub(Ledger, 'update').resolves();

            // Mocking Ledger.bulkCreate to return a successful promise
            const bulkCreateStub = sinon.stub(Ledger, 'bulkCreate').resolves();

            // Test data
            const reference = 'mock_reference';
            const status = TransactionStatus.REVERSED;

            const updatedTransaction = await TransactionService.updateTransactionStatus(reference, status);

            // Asserting the TransactionService.getTransaction function call
            sinon.assert.calledOnceWithExactly(getTransactionStub, reference);

            // Asserting the Transaction.update function call
            sinon.assert.calledOnceWithExactly(updateTransactionStub, { status }, { where: { reference } }, { transaction: databaseOperationTransactionMock });

            // Asserting the Ledger.update function call
            sinon.assert.calledOnceWithExactly(ledgerUpdateStub, { reversed: true }, { where: { reference } }, { transaction: databaseOperationTransactionMock });

            // Asserting the Ledger.bulkCreate function call
            sinon.assert.calledOnceWithExactly(bulkCreateStub, [
                { reference: mockTransaction.reference, account: mockTransaction.account, credit: mockTransaction.amount, reversed: true, narration: `reversal - ${mockTransaction.narration}` },
                { reference: mockTransaction.reference, account: 'GL-CARD-PURCHASE-001', debit: mockTransaction.amount, reversed: true, narration: `reversal - ${mockTransaction.narration}` }
            ], { transaction: databaseOperationTransactionMock });

            // Asserting the result
            assert.deepStrictEqual(updatedTransaction, mockUpdatedTransaction);

            // Restoring the stubs
            getTransactionStub.restore();
            updateTransactionStub.restore();
            ledgerUpdateStub.restore();
            bulkCreateStub.restore();
            errorStub.restore();
        });

        it('should throw an error if updating transaction status fails', async () => {
            const errorStub = sinon.stub(LoggerService, 'error');

            const databaseOperationTransactionMock = {
                commit: sinon.stub().resolves(),
                rollback: sinon.stub().resolves()
            };
            databaseTransactionStub.resolves(databaseOperationTransactionMock);

            // Mocking TransactionService.getTransaction to return a mock transaction
            const mockTransaction = { id: 1, reference: 'mock_reference' };
            const getTransactionStub = sinon.stub(TransactionService, 'getTransaction').resolves(mockTransaction);

            // Mocking Transaction.update to throw an error
            const error = new Error('Database error');
            const updateTransactionStub = sinon.stub(Transaction, 'update').rejects(error);

            // Test data
            const reference = 'mock_reference';
            const status = TransactionStatus.SUCCESS;

            await assert.rejects(async () => {
                await TransactionService.updateTransactionStatus(reference, status);
            }, {
                message: 'Error occurred while updating transaction status'
            });

            // Asserting the TransactionService.getTransaction function call
            sinon.assert.calledOnceWithExactly(getTransactionStub, reference);

            // Asserting the Transaction.update function call
            sinon.assert.calledOnceWithExactly(updateTransactionStub, { status }, { where: { reference } }, { transaction: databaseOperationTransactionMock });

            // Restoring the stubs
            getTransactionStub.restore();
            updateTransactionStub.restore();
            errorStub.restore();
        });
    });

    describe('getTransaction', () => {
        it('should get transaction details successfully', async () => {
            // Mocking Transaction.findOne to return a mock transaction
            const mockTransaction = { id: 1, reference: 'mock_reference', amount: 100, narration: 'mock_narration' };
            const findOneStub = sinon.stub(Transaction, 'findOne').resolves(mockTransaction);

            // Test data
            const reference = 'mock_reference';

            const transaction = await TransactionService.getTransaction(reference);

            // Asserting the Transaction.findOne function call
            sinon.assert.calledOnceWithExactly(findOneStub, { where: { reference } });

            // Asserting the result
            assert.deepStrictEqual(transaction, mockTransaction);

            // Restoring the stub
            findOneStub.restore();
        });

        it('should throw an error if transaction reference is invalid', async () => {
            // Test data
            const reference = null; // or any invalid transaction reference

            await assert.rejects(async () => {
                await TransactionService.getTransaction(reference);
            }, {
                message: 'Invalid transaction reference'
            });
        });

        it('should throw an error if transaction is not found', async () => {
            // Mocking Transaction.findOne to return null
            const findOneStub = sinon.stub(Transaction, 'findOne').resolves(null);

            // Test data
            const reference = 'non_existent_transaction_reference';

            await assert.rejects(async () => {
                await TransactionService.getTransaction(reference);
            }, {
                message: 'Transaction not found'
            });

            // Asserting the Transaction.findOne function call
            sinon.assert.calledOnceWithExactly(findOneStub, { where: { reference } });

            // Restoring the stub
            findOneStub.restore();
        });
    });
});