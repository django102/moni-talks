const Sequelize = require('sequelize');
const {ConfigService, LoggerService} = require('../services');

const { settings } = ConfigService;
const sequelize = new Sequelize({
    dialect: 'mysql',
    host: settings.DB_HOST,
    port: settings.DB_PORT,
    username: settings.DB_USER,
    password: settings.DB_PASSWORD,
    database: settings.DB_DATABASE,
    logging: (message) => {
        if (message.includes('Error')) {
            LoggerService.error(message);
        }
        else {
            LoggerService.trace(message);
        }
    }
});

const models = {
    user: require('./User')(sequelize),
    wallet: require('./Wallet')(sequelize),
    card: require('./Card')(sequelize),
    ledger: require('./Ledger')(sequelize),
    transaction: require('./Transaction')(sequelize)
};

module.exports = {
    ...models,
    sequelize
}