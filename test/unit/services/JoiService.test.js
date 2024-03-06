const assert = require('assert');
const JoiService = require('../../../api/services/JoiService');

describe('JoiService', () => {
    describe('validateCreateUserRequest', () => {
        it('should return valid for a valid user object', () => {
            const validUser = {
                email: 'test@example.com',
                password: 'Password123',
                firstName: 'John',
                lastName: 'Doe',
                phoneNumber: '+1234567890'
            };
            const result = JoiService.validateCreateUserRequest(validUser);
            assert.strictEqual(result.error, undefined);
        });

        it('should return error for an invalid user object', () => {
            const invalidUser = {
                email: 'invalidemail',
                password: 'short',
                firstName: '',
                lastName: '',
                phoneNumber: ''
            };
            const result = JoiService.validateCreateUserRequest(invalidUser);
            assert.ok(result.error);
        });
    });

    describe('validateCreateLoginRequest', () => {
        it('should return valid for a valid login object', () => {
            const validLogin = {
                email: 'test@example.com',
                password: 'Password123'
            };
            const result = JoiService.validateCreateLoginRequest(validLogin);
            assert.strictEqual(result.error, undefined);
        });

        it('should return error for an invalid login object', () => {
            const invalidLogin = {
                email: '',
                password: ''
            };
            const result = JoiService.validateCreateLoginRequest(invalidLogin);
            assert.ok(result.error);
        });
    });

    describe('validatePaymentRequest', () => {
        it('should return valid for a valid payment object', () => {
            const validPayment = {
                card: {
                    number: '1234567890123456',
                    expMonth: 12,
                    expYear: 2023,
                    cvv: 123
                },
                amount: 100
            };
            const result = JoiService.validatePaymentRequest(validPayment);
            assert.strictEqual(result.error, undefined);
        });

        it('should return error for an invalid payment object', () => {
            const invalidPayment = {
                card: {
                    number: '1234', // Too short
                    expMonth: 0, // Invalid month
                    expYear: '2023', // Should be a number
                    cvv: 9999 // Too long
                },
                amount: 0 // Invalid amount
            };
            const result = JoiService.validatePaymentRequest(invalidPayment);
            assert.ok(result.error);
        });
    });
});
