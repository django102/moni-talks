const { Wallet } = require('../models');
const UtilityService = require('./UtilityService');

const WalletService = {
    create: async (userId) => {
        const existingActiveWallet = await this.fetch(userId);
        if (existingActiveWallet) {
            throw new Error('An active wallet already exists');
        }

        const accoutNumber = await this.generateWalletAccountNumber();

        // ***************************************************************************
        // ASSUMPTION: Moni is not a traditional bank/MFB that can receive funds
        // Call 3rd Party Service to generate Virtual Account for the Wallet
        // This virtual account is what thw user will use to send money to this wallet
        const virtualAccountNumber = UtilityService.generateRandomNumber();
        const virtualAccountBankCode = "044";
        // ***************************************************************************

        const wallet = {
            userId,
            accoutNumber,
            virtualAccountNumber,
            virtualAccountBankCode
        };

        const createdWallet = await Wallet.create(wallet);
        return createdWallet;
    },

    fetch: async (userId) => {
        const wallet = await Wallet.findOne({ where: { userId, isActive: true } });
        if (!wallet) {
            return null;
        }

        return wallet.toJSON();
    },

    generateWalletAccountNumber: async () => {
        const generatedAccountNumber = UtilityService.generateRandomNumber();
        const walletExists = await this.checkIfWalletAccountNumberExists(generatedAccountNumber);
        if (walletExists) {
            await this.generateWalletAccountNumber();
        }

        return generatedAccountNumber;
    },

    checkIfWalletAccountNumberExists: async (accountNumber) => {
        const wallet = await Wallet.findOne({ where: { accountNumber } })
        return wallet;
    }
};

module.exports = WalletService;