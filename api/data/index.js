const Sequelize = require('sequelize');
const ConfigService = require('../services/ConfigService');
const LoggerService = require('../services/LoggerService');

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

};

module.exports = {
    ...models,
    sequelize
}