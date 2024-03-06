'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const cors = require('cors');
const path = require('path');
const db = require('./api/data');

const { LoggerService, ConfigService } = require('./api/services');
const routes = require('./api/routes');

require('dotenv').config();

process.on('unhandledRejection', (err) => {
    LoggerService.error(err);
});

process.chdir(__dirname);

const app = express();
const port = ConfigService.settings.PORT || 80;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json({ limit: '500mb' }));
app.use(methodOverride());

app.use('/', cors({ origin: '*' }), routes);

db.sequelize
    .authenticate()
    .then(() => {
        LoggerService.trace('Connected to the database.');
        // db.sequelize.sync();
    })
    .then(() => {
        LoggerService.info(`Application is running...`);
    })
    .catch((err) => LoggerService.error(`Unable to connect to the database: ${err}`));

const server = app.listen(port, () => {
    LoggerService.info(`Server is listening on port ${port}`);
});

module.exports = server;