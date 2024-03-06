const assert = require('assert');
const sinon = require('sinon');
const {
    PaymentService,
    TransactionService,
    LedgerService,
    CardService,
    WalletService,
    UtilityService
} = require('../../../api/services');

describe('PaymentService', () => {
    describe('processCardPayment', () => {
        afterEach(() => {
            sinon.restore();
        });


        it('should process card payment successfully and update transaction status to SUCCESS', async () => {
            const card = {
                number: 'valid_card_number',
                expMonth: '01',
                expYear: '2025',
                cvv: '123',
                userId: 'user_id'
            };
            const amount = 100; // Assuming amount is valid
            const narration = 'Test payment';
            const accountNumber = 'account_number';
            const transactionReference = 'transaction_reference';

            sinon.stub(CardService, 'verifyCardInformation').resolves(card);
            sinon.stub(WalletService, 'fetch').resolves({ accountNumber });
            sinon.stub(LedgerService, 'getBalance').resolves(150000);
            sinon.stub(TransactionService, 'createTransaction').resolves({ reference: transactionReference });
            sinon.stub(UtilityService, 'generateRandomString').resolves('random_acquirer_reference');
            sinon.stub(TransactionService, 'updateTransactionStatus').resolves({ reference: transactionReference });

            const result = await PaymentService.processCardPayment(card, amount, narration);

            assert.strictEqual(result, true);
        });

        it('should throw error if card verification fails', async () => {
            sinon.stub(CardService, 'verifyCardInformation').rejects(new Error('Card verification failed'));

            const card = {
                number: 'invalid_card_number',
                expMonth: '01',
                expYear: '2025',
                cvv: '123'
            };
            const amount = 100; // Assuming amount is valid
            const narration = 'Test payment';

            await assert.rejects(async () => {
                await PaymentService.processCardPayment(card, amount, narration);
            }, {
                message: 'Card verification failed'
            });
        });

        it('should throw error if wallet information is not found', async () => {
            sinon.stub(WalletService, 'fetch').resolves(null);

            const card = {
                number: 'valid_card_number',
                expMonth: '01',
                expYear: '2025',
                cvv: '123',
                userId: 'user_id'
            };
            const amount = 100; // Assuming amount is valid
            const narration = 'Test payment';

            sinon.stub(CardService, 'verifyCardInformation').resolves(card);

            await assert.rejects(async () => {
                await PaymentService.processCardPayment(card, amount, narration);
            }, {
                message: 'Could not get account information'
            });
        });

        it('should throw error if user balance is insufficient', async () => {
            const accountNumber = 'account_number';
            sinon.stub(WalletService, 'fetch').resolves({ accountNumber });
            sinon.stub(LedgerService, 'getBalance').resolves(10);

            const card = {
                number: 'valid_card_number',
                expMonth: '01',
                expYear: '2025',
                cvv: '123',
                userId: 'user_id'
            };
            const amount = 100; // Assuming amount is valid
            const narration = 'Test payment';

            sinon.stub(CardService, 'verifyCardInformation').resolves(card);

            await assert.rejects(async () => {
                await PaymentService.processCardPayment(card, amount, narration);
            }, {
                message: 'Insufficient Funds'
            });
        });

        it('should update transaction status to FAILED if charge result is unsuccessful', async () => {
            // Mocking chargeResult to simulate an unsuccessful charge
            const chargeResult = {
                status: false,
                data: {
                    code: '01'
                }
            };

            const card = {
                number: 'valid_card_number',
                expMonth: '01',
                expYear: '2025',
                cvv: '123',
                userId: 'user_id'
            };
            const amount = 100; // Assuming amount is valid
            const narration = 'Test payment';

            const accountNumber = 'account_number';
            const transactionReference = 'transaction_reference';
            sinon.stub(WalletService, 'fetch').resolves({ accountNumber });
            sinon.stub(LedgerService, 'getBalance').resolves(1000);
            sinon.stub(CardService, 'verifyCardInformation').resolves(card);
            sinon.stub(TransactionService, 'createTransaction').resolves({ reference: transactionReference });
            sinon.stub(PaymentService, 'simulateAcquirerResponse').resolves(chargeResult);
            sinon.stub(TransactionService, 'updateTransactionStatus').rejects(new Error('Transaction failed!!!'));

            await assert.rejects(async () => {
                await PaymentService.processCardPayment(card, amount, narration);
            }, {
                message: 'Transaction failed!!!'
            });
        });
    });
});
