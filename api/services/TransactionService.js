const moment = require('moment');
const UtilityService = require('./UtilityService');
const { Transaction, Ledger } = require('../models');
const { TransactionStatus } = require('../enums');
const LoggerService = require('./LoggerService');
const { sequelize } = require('../data');


const TransactionService = {
    generateTransactionReference: () => {
        const now = moment().format('YYYYMMddHHmmss')
        const randomNumber = UtilityService.generateRandomNumber();

        return `moni-${now}-${randomNumber}`;
    },

    createTransaction: async (transaction) => {
        const reference = TransactionService.generateTransactionReference();
        transaction.reference = reference;

        try {
            const createdTransaction = await Transaction.create(transaction);
            return createdTransaction;
        } catch (err) {
            LoggerService.error(err);
            throw new Error('Error occurred while creating transaction');
        }
    },

    updateTransactionStatus: async (reference, status) => {
        if (!Object.values(TransactionStatus).includes(status)) {
            throw new Error('Updating transaction with an invalid status')
        }

        const databaseOperationTransaction = await sequelize.transaction();

        try {
            const existingTransaction = await TransactionService.getTransaction(reference);
            const { account, amount, narration } = existingTransaction;

            const updatedTransaction = await Transaction.update({ status }, { where: { reference } }, { transaction: databaseOperationTransaction });

            if (status === TransactionStatus.SUCCESS) {
                const ledgerEntries = [];
                // *****************************
                // post transaction to Ledger
                // *****************************


                // Ledger: Debit Customer's account
                ledgerEntries.push({
                    reference,
                    account: account,
                    debit: amount,
                    narration: narration
                });

                // Ledger: Credit some GL account for tracking these types of transactions
                ledgerEntries.push({
                    reference,
                    account: 'GL-CARD-PURCHASE-001',
                    credit: amount,
                    narration: narration
                });

                await Ledger.bulkCreate(ledgerEntries, { transaction: databaseOperationTransaction });
            }

            if (status === TransactionStatus.REVERSED) {
                const ledgerEntries = [];
                // *****************************
                // post reversal transaction to Ledger
                // *****************************

                // update initial transactions to reversed in Ledger
                await Ledger.update({ reversed: true }, { where: { reference } }, { transaction: databaseOperationTransaction });

                // Ledger: Credit Customer's account
                ledgerEntries.push({
                    reference,
                    account: account,
                    credit: amount,
                    reversed: true,
                    narration: `reversal - ${narration}`
                });

                // Ledger: Debit some GL account for tracking these types of transactions
                ledgerEntries.push({
                    reference,
                    account: 'GL-CARD-PURCHASE-001',
                    debit: amount,
                    reversed: true,
                    narration: `reversal - ${narration}`
                });

                await Ledger.bulkCreate(ledgerEntries, { transaction: databaseOperationTransaction });
            }

            await databaseOperationTransaction.commit();
            return updatedTransaction;
        } catch (err) {
            LoggerService.error(err);
            await databaseOperationTransaction.rollback();
            throw new Error('Error occurred while updating transaction status');
        }
    },

    getTransaction: async (reference) => {
        if (!reference) {
            throw new Error('Invalid transaction reference');
        }

        const transaction = await Transaction.findOne({ where: { reference } });
        if (!transaction) {
            throw new Error('Transaction not found');
        }

        return transaction;
    },
};

module.exports = TransactionService;