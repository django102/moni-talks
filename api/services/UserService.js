const { User } = require('../models');
const LoggerService = require('./LoggerService');
const WalletService = require('./WalletService');

const UserService = {
    create: async (user) => {
        const existingUser = await this.fetchByEmail(user.email);
        if (existingUser) {
            return existingUser;
        }

        try {
            const hashedPassword = User.generateHash(user.password);
            user.password = hashedPassword;

            const createdUser = await User.create(user);
            delete createdUser.password;
            return createdUser;
        } catch (err) {
            LoggerService.error(err);
            throw new Error(err);
        }
    },

    update: async (user) => {
        const existingUser = await this.fetchByEmail(user.email);
        if (!existingUser) {
            throw new Error('User not found');
        }

        if (user.password) {
            delete user.password;
        }

        try {
            const updatedUser = await User.update(user, { where: { email } });
            delete updatedUser.password;
            return updatedUser;
        } catch (err) {
            LoggerService.error(err);
            throw new Error(err);
        }
    },

    fetch: async (userId) => {
        const user = await User.findOne({ where: { id: userId } });
        if (!user) {
            return null;
        }

        const thisUser = { ...user.toJSON() };

        if (!withPassword) {
            delete thisUser.password;
        }

        return thisUser;
    },

    fetchByEmail: async (email, withPassword = false) => {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return null;
        }

        const thisUser = { ...user.toJSON() };

        if (!withPassword) {
            delete thisUser.password;
        }

        return thisUser;
    },

    createWallet: async (userId) => {
        const user = await this.fetch(userId);
        if (!user) {
            throw new Error("User not found");
        }

        const wallet = await WalletService.create(userId);
        if (!wallet) {
            throw new Error('Could not create wallet at the moment');
        }

        return wallet;
    },
};

module.exports = UserService;