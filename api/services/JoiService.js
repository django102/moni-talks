const Joi = require('joi');

const JoiService = {
    validateUser: (user) => {
        const schema = Joi.object({
            email: Joi.string().email(),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{8,}$')),
            firstName: Joi.string().required(),
            lastName: Joi.string().required(),
            phoneNumber: Joi.string().required(),
        });

        const validateUserResponse = schema.validate(user);
        return validateUserResponse;
    }
};

module.exports = JoiService;