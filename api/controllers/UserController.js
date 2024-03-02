const { ResponseService } = require('../services');

module.exports = {
    createUser: async (req, res) => {
        return ResponseService.json(200, res, 'Hello World!!!');
    }
}