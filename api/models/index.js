const dbModels = require('../data').sequelize.models;

const User = dbModels.user;
const Wallet = dbModels.wallet;
const Card = dbModels.card;


module.exports = {
    User,
    Wallet,
    Card
};