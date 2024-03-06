const jwt = require('jsonwebtoken');
const moment = require('moment');
const ConfigService = require('./ConfigService');
const ResponseService = require('./ResponseService');
const LoggerService = require('./LoggerService');

const { settings } = ConfigService;

const AuthService = {
    issueToken: (data, expiresIn = '1h') => {
        if (!data) return null;
        return jwt.sign(data, settings.JWT_HASHER, { expiresIn });
    },

    verifyToken: (token) => {
        if (!token) return null;
        return jwt.verify(token, settings.JWT_HASHER);
    },

    validateAuthorization: (req, res, next) => {
        try {
            const { authorization } = req.headers;
            if (!authorization) {
                return ResponseService.json(401, res, 'No Authorization');
            }

            if (!authorization.startsWith('Bearer')) {
                return ResponseService.json(401, res, 'Authorization format is "Bearer xxxxxx');
            }

            const auth = authorization.split(' ')[1];
            if (!auth) {
                return ResponseService.json(401, res, 'Invalid Authorization');
            }

            const decodedJwt = AuthService.verifyToken(auth);

            // check expiry
            const expiry = moment.unix(decodedJwt.exp);
            const now = moment(new Date());

            if(now.isAfter(expiry)){
                return ResponseService.json(403, res, 'Token expired. Please log in.');
            }

            delete decodedJwt.iat;
            delete decodedJwt.exp;
        
            req.headers['user'] = decodedJwt;
            next();
        } catch (err) {
            LoggerService.error(`Authentication error:' ${err}`);
            return ResponseService.json(403, res, 'Authentication Error. Please contact support.');
        }
    },
};

module.exports = AuthService;