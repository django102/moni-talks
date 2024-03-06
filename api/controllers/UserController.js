const { UserService, WalletService, JoiService, ResponseService, CardService } = require('../services');

module.exports = {
    createUser: async (req, res) => {
        const { error } = JoiService.validateCreateUserRequest(req.body);
        if (error) {
            return ResponseService.json(400, res, error.message);
        }

        try {
            const user = await UserService.create(req.body);
            return ResponseService.json(200, res, 'Registration successful', user);
        } catch (err) {
            return ResponseService.json(500, res, err.message);
        }
    },

    userLogin: async (req, res) => {
        const {error} = JoiService.validateCreateLoginRequest(req.body);
        if (error) {
            return ResponseService.json(400, res, error.message);
        }

        try {
            const user = await UserService.authenticate(req.body);
            return ResponseService.json(200, res, 'Login successful', user);
        } catch (err) {
            return ResponseService.json(500, res, err.message);
        }
    },

    getUser: async (req, res) => {
        const userId = req.params.id;
        if(!userId) {
            return ResponseService.json(400, res, 'Parameter "UserId" is missing');
        }
        
        try {
            const user = await UserService.fetch(userId);
            return ResponseService.json(200, res, 'User fetched successfully', user);
        } catch (err) {
            return ResponseService.json(500, res, err.message);
        }
    },

    createWallet: async (req, res) => {
        const userId = req.params.id;
        if(!userId) {
            return ResponseService.json(400, res, 'Parameter "UserId" is missing');
        }
        
        try {
            const wallet = await UserService.createWallet(userId);
            return ResponseService.json(200, res, 'Wallet created successfully', wallet);
        } catch (err) {
            return ResponseService.json(500, res, err.message);
        }
    },

    getWallet: async (req, res) => {
        const userId = req.params.id;
        if(!userId) {
            return ResponseService.json(400, res, 'Parameter "UserId" is missing');
        }
        
        try {
            const wallet = await WalletService.fetch(userId);
            return ResponseService.json(200, res, 'Wallet fetched successfully', wallet);
        } catch (err) {
            return ResponseService.json(500, res, err.message);
        }
    },

    createCard: async (req, res) => {
        const userId = req.params.id;
        if(!userId) {
            return ResponseService.json(400, res, 'Parameter "UserId" is missing');
        }
        
        try {
            const card = await CardService.create(userId);
            return ResponseService.json(200, res, 'Card created successfully', card);
        } catch (err) {
            return ResponseService.json(500, res, err.message);
        }
    },

    getCards: async (req, res) => {
        const userId = req.params.id;
        if(!userId) {
            return ResponseService.json(400, res, 'Parameter "UserId" is missing');
        }
        
        try {
            const cards = await CardService.getCards(userId);
            return ResponseService.json(200, res, 'Cards retrived successfully', cards);
        } catch (err) {
            return ResponseService.json(500, res, err.message);
        }
    }
}