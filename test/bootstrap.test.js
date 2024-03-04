
const { load: loadFixtures } = require('./util');
loadFixtures('./unit/fixtures');

const express = require("express");
const routes = require('../api/routes');


module.exports = {
    bootstrapApp: async () => {
        // Load Environment Variables
        process.env.NODE_ENV = 'test';
        process.env.PORT = 80;
        process.env.DB_HOST = 'localhost';
        process.env.DB_DATABASE = 'moni';
        process.env.DB_PORT = 3306;
        process.env.DB_USER = 'test';
        process.env.DB_PASSWORD = 'test';
        process.env.APP_NAME = 'Moni';
        process.env.WEBHOOK_HASHER = 'xxYYzz';
        process.env.JWT_HASHER = 'xxYYzz';

        const app = express();
        app.use(express.urlencoded({ extended: false }));
        app.use('/', routes);

        return {
            app,
            env:process.env
        }
    }
}