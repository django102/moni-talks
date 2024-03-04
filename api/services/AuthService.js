const jwt = require('jsonwebtoken');
const { User } = require('../models');

const ConfigService = require('./ConfigService');
const LoggerService = require('./LoggerService');
const ResponseService = require('./ResponseService');

const { settings } = ConfigService;


const AuthService = {
    createToken: (data, expiresIn = '1h') => {
        if (!data) return null;
        return jwt.sign(data, settings.JWT_HASHER, { expiresIn });
    },

    decodeTokem: (token) => {
        if (!token) return null;
        return jwt.verify(token, settings.JWT_HASHER);
    }
};

module.exports = AuthService;