const rateLimter = require('express-rate-limit');

const rateLimit = rateLimter({
    windowMs: 60 * 1000,
    max: 5,
    message: {
        status: 429,
        message: 'Too many requests'
    },
    headers: true
});

module.exports = rateLimit;