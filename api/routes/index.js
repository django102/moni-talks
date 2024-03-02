const express = require("express");
const { UserController } = require("../controllers");
const router = express.Router();

router
    .post('/api/user', UserController.createUser)

module.exports = router;