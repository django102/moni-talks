const { PaymentService, ResponseService, JoiService } = require('../services');

module.exports = {
    makePayment: async (req, res) => {
        const { error } = JoiService.validatePaymentRequest(req.body);
        if (error) {
            return ResponseService.json(400, res, error.message);
        }

        try {
            await PaymentService.processCardPayment(req.body);
            return ResponseService.json(200, res, 'Payment Successful');
        } catch (err) {
            return ResponseService.json(500, res, err.message);
        }
    },
}