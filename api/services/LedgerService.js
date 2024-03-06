const { sequelize } = require('../data');
const { Ledger, Transaction } = require('../models');
const LoggerService = require('./LoggerService');
const { TransactionStatus } = require('../enums');

const LedgerService = {
    getBalance: async (accountNumber) => {
        try {
            const bookBalance = await LedgerService.getBookBalance(accountNumber);
            const pendingCharges = await LedgerService.getPendingCharges(accountNumber);

            const availableBalance = bookBalance - pendingCharges;
            return availableBalance;
        } catch (err) {
            throw err;
        }
    },

    getBookBalance: async (accountNumber) => {
        if (!accountNumber) {
            throw new Error('No account number provided');
        }

        try {
            const balances = await Ledger.findOne({
                raw: true,
                where: { account: accountNumber, reversed: false },
                attributes: [
                    [sequelize.fn('SUM', sequelize.col('debit')), 'totalDebit'],
                    [sequelize.fn('SUM', sequelize.col('credit')), 'totalCredit'],
                ],
            });

            const { totalCredit, totalDebit } = balances;
            const accountBalance = totalCredit - totalDebit;

            return accountBalance;
        } catch (err) {
            LoggerService.error(err);
            throw new Error('Cannot get account balance at this time');
        }
    },

    getPendingCharges: async (accountNumber) => {
        if (!accountNumber) {
            throw new Error('No account number provided');
        }

        try {
            const charges = await Transaction.findOne({
                raw: true,
                where: { account: accountNumber, status: TransactionStatus.PENDING },
                attributes: [
                    [sequelize.fn('SUM', sequelize.col('amount')), 'totalAmount'],
                ],
            });

            const charge = charges.totalAmount;
            return charge;
        } catch (error) {
            LoggerService.error(err);
            throw new Error('Cannot get pending charges at this time');
        }
    },
};

module.exports = LedgerService;