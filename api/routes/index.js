const express = require("express");
const router = express.Router();

const rateLimit = require('../middlewares/RateLimiter');

const { UserController, PaymentController } = require("../controllers");
const { validateAuthorization } = require('../services/AuthService');


router
    .post('/api/user', UserController.createUser)

    .post('/api/user/authenticate', UserController.userLogin)

    .get('/api/user/:id', validateAuthorization, UserController.getUser)
    .post('/api/user/:id/wallet', validateAuthorization, UserController.createWallet)
    .get('/api/user/:id/wallet', validateAuthorization, UserController.getWallet)
    .post('/api/user/:id/card', validateAuthorization, UserController.createCard)
    .get('/api/user/:id/card', validateAuthorization, UserController.getCards)

    .post('/api/payment', rateLimit, PaymentController.makePayment)

    ;

module.exports = router;