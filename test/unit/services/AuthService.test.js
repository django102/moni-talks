const assert = require('assert');
const jwt = require('jsonwebtoken');
const sinon = require('sinon');
const AuthService = require('../../../api/services/AuthService');
const ConfigService = require('../../../api/services/ConfigService');


describe('AuthService', () => {
    describe('issueToken', () => {
        it('should issue a token with valid data', () => {
            const mockData = { userId: 123 };
            const mockToken = 'mock_token';

            // Mocking jwt.sign to return a fixed token
            const signStub = sinon.stub(jwt, 'sign').returns(mockToken);

            const token = AuthService.issueToken(mockData);

            // Asserting jwt.sign function call
            sinon.assert.calledOnceWithExactly(signStub, mockData, ConfigService.settings.JWT_HASHER, { expiresIn: '1h' });

            // Asserting the result
            assert.strictEqual(token, mockToken);

            // Restoring the stub
            signStub.restore();
        });

        it('should return null if data is invalid', () => {
            const token = AuthService.issueToken(null);
            assert.strictEqual(token, null);
        });
    });

    describe('verifyToken', () => {
        it('should verify a valid token', () => {
            const mockToken = 'mock_token';
            const mockDecodedData = { userId: 123 };

            // Mocking jwt.verify to return decoded data
            const verifyStub = sinon.stub(jwt, 'verify').returns(mockDecodedData);

            const decodedData = AuthService.verifyToken(mockToken);

            // Asserting jwt.verify function call
            sinon.assert.calledOnceWithExactly(verifyStub, mockToken, ConfigService.settings.JWT_HASHER);

            // Asserting the result
            assert.deepStrictEqual(decodedData, mockDecodedData);

            // Restoring the stub
            verifyStub.restore();
        });

        it('should return null if token is invalid', () => {
            const decodedData = AuthService.verifyToken(null);
            assert.strictEqual(decodedData, null);
        });
    });
});
