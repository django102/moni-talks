const dotenv = require('dotenv');
dotenv.config();

const env = process.env;

const ConfigService = {
    settings: {
        NODE_ENV: env.NODE_ENV,
        PORT: env.PORT,
        DB_HOST: env.DB_HOST,
        DB_DATABASE: env.DB_DATABASE,
        DB_PORT: env.DB_PORT,
        DB_USER: env.DB_USER,
        DB_PASSWORD: env.DB_PASSWORD,
        APP_NAME: env.APP_NAME,
        WEBHOOK_HASHER: env.WEBHOOK_HASHER,
        JWT_HASHER: env.JWT_HASHER,
    },

    constants: {

    }
}

module.exports = ConfigService;