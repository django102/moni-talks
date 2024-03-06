const jwt = require('jsonwebtoken');
const ConfigService = require('./ConfigService');

const { settings } = ConfigService;

const AuthService = {
    issueToken: (data, expiresIn = '1h') => {
        if (!data) return null;
        return jwt.sign(data, settings.JWT_HASHER, { expiresIn });
    },

    verifyToken: (token) => {
        if (!token) return null;
        return jwt.verify(token, settings.JWT_HASHER);
    }
};

module.exports = AuthService;