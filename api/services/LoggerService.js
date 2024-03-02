const pino = require("pino");

const logger = pino({
    level: process.env.LOG_LEVEL || 'trace',
    transport: { target: 'pino-pretty' },
    options: { colorize: true, crlf: true, translateTime: 'yyyy-MM-dd HH:MM:ss', levelFirst: true }
});

const LoggerService = {
    info: (content) => {
        logger.info(content);
    },

    debug: (content) => {
        logger.debug(content);
    },

    trace: (content) => {
        logger.trace(content);
    },

    warn: (content) => {
        logger.warn(content);
    },

    error: (content) => {
        logger.error(content);
    },

    fatal: (content) => {
        logger.fatal(content);
    },
};

module.exports = LoggerService;