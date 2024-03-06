const dbModels = require('../data').sequelize.models;

const User = dbModels.user;
const Wallet = dbModels.wallet;
const Card = dbModels.card;
const Ledger = dbModels.ledger;
const Transaction = dbModels.transaction;


module.exports = {
    User,
    Wallet,
    Card,
    Ledger,
    Transaction,
};