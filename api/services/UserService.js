const { User } = require('../models');
const LoggerService = require('./LoggerService');
const WalletService = require('./WalletService');
const AuthService = require('./AuthService');

const UserService = {
    create: async (user) => {
        const existingUser = await UserService.fetchByEmail(user.email);
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

    authenticate: async (email, password) => {
        const existingUser = await UserService.fetchByEmail(email);
        if (!existingUser) {
            LoggerService.trace('User not found');
            throw new Error('Invalid email or password');
        }

        const hashedPassword = User.generateHash(password);
        const userPassword = existingUser.password;

        if (hashedPassword !== userPassword) {
            LoggerService.trace('Incorrect password');
            throw new Error('Invalid email or password');
        }

        delete existingUser.password;

        const userToken = AuthService.issueToken(existingUser);
        if (!userToken) {
            throw new Error('Could not authenticate account')
        }

        return { ...existingUser, token: userToken };
    },

    update: async (user) => {
        const existingUser = await UserService.fetchByEmail(user.email);
        if (!existingUser) {
            throw new Error('User not found');
        }

        if (user.password) {
            delete user.password;
        }

        try {
            const updatedUser = await User.update(user, { where: { email: user.email } });
            delete updatedUser.password;
            return updatedUser;
        } catch (err) {
            LoggerService.error(err);
            throw new Error(err);
        }
    },

    fetch: async (userId, withPassword = false) => {
        const user = await User.findOne({ where: { id: userId } });
        if (!user) {
            return null;
        }

        const thisUser = { ...user };

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

        const thisUser = { ...user };

        if (!withPassword) {
            delete thisUser.password;
        }

        return thisUser;
    },

    createWallet: async (userId) => {
        const user = await UserService.fetch(userId);
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