const TransactionService = require('./TransactionService');
const LedgerService = require('./LedgerService');
const CardService = require('./CardService');
const WalletService = require('./WalletService');
const UtilityService = require('./UtilityService');
const { TransactionStatus } = require('../enums');

const PaymentService = {
    processCardPayment: async (card, amount, narration) => {
        try {
            const { number, expMonth, expYear, cvv } = card;

            // validate card information
            const cardInformation = await CardService.verifyCardInformation({
                pan: number,
                expiryMonth: expMonth,
                expiryYear: expYear,
                cvv2: cvv
            });
            const { userId } = cardInformation;

            // Get wallet information
            const userWallet = await WalletService.fetch(userId);
            if (!userWallet) {
                throw new Error('Could not get account information');
            }

            const { accountNumber } = userWallet;

            // Get wallet balance
            const userBalance = await LedgerService.getBalance(accountNumber);
            if (userBalance < amount) {
                throw new Error('Insufficient Funds');
            }

            const transaction = {
                account: accountNumber,
                amount,
                narration
            };

            // Transaction created as 'pending'
            const createdTransaction = await TransactionService.createTransaction(transaction);

            // ************ ASSUMPTION ************ //
            // I am going to assume 2 things here.
            //
            // 1. This is a synchoronous transaction where we call card network or acquire to charge the card
            //    or we do some accounting that takes the money from our pool account (or charge a card attached to our pool account)
            //    NOT entirely sure how that process works under the hood
            //    but all in all, we get our response back immediately
            //
            // 2. We do (1.) above, and it's asynchronous, and we'll return a holding message and wait for a webhook
            //
            //
            //  For the purpose of this test, I'm going with the first scenario and I'll simulate a successful charge

            const chargeResult = await PaymentService.simulateAcquirerResponse(true)
            // ************ ASSUMPTION ************ //


            if (!chargeResult.status && !chargeResult.data.code === '00') {
                // update transaction to failed
                await TransactionService.updateTransactionStatus(createdTransaction.reference, TransactionStatus.FAILED);
                throw new Error('Transaction failed!!!')
            }

            await TransactionService.updateTransactionStatus(createdTransaction.reference, TransactionStatus.SUCCESS);
            return true;
        } catch (err) {
            throw err;
        }
    },

    simulateAcquirerResponse: async (success = true) => {
        const acquirerReference = await UtilityService.generateRandomString(15, 'mixed'); // this will act as the reference between Moni and our acquirer or card scheme.

        if (success) {
            return {
                status: true,
                message: 'Transaction was successfully charged',
                data: {
                    code: '00',
                    acquirerReference
                    // insert other parameters here
                }
            }
        }

        return {
            status: false,
            message: 'Transaction failed because the gods were asleep',
            data: {
                code: '01',
                acquirerReference
                // insert other parameters here
            }
        }
    }
};

module.exports = PaymentService;