const dbModels = require('../data').sequelize.models;

const User = dbModels.user;
const Wallet = dbModels.wallet;


module.exports = {
    User,
    Wallet
};