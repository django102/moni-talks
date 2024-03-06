const Joi = require('joi');

const JoiService = {
    validateCreateUserRequest: (user) => {
        const schema = Joi.object({
            email: Joi.string().email(),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{8,}$')),
            firstName: Joi.string().required(),
            lastName: Joi.string().required(),
            phoneNumber: Joi.string().required(),
        });

        const validationResponse = schema.validate(user);
        return validationResponse;
    },

    validateCreateLoginRequest: (data) => {
        const schema = Joi.object({
            email: Joi.string().required(),
            password: Joi.string().required(),
        });

        const validationResponse = schema.validate(data);
        return validationResponse;
    },

    validatePaymentRequest: (data) => {
        const schema = Joi.object({
            card: Joi.object({
                number: Joi.string().min(16).required(),
                expMonth: Joi.number().min(1).max(12),
                expYear: Joi.number().required(),
                cvv: Joi.number().min(100).max(999)
            }),
            amount: Joi.number().min(1).required()
        });

        const validationResponse = schema.validate(data);
        return validationResponse;
    },
};

module.exports = JoiService;