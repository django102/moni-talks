const { ResponseService } = require('../services');
const UserService = require('../services/UserService');

module.exports = {
    createUser: async (req, res) => {
        return ResponseService.json(200, res, 'Hello World!!!');
    }
}