const assert = require('assert');
const sinon = require('sinon');
const crypto = require('crypto');
const CryptoService = require('../../../api/services/CryptoService');
const LoggerService = require('../../../api/services/LoggerService');

describe('CryptoService', () => {
    describe('encrypt', () => {
        it('should encrypt data', () => {
            const input = 'Hello, world!';
            const encryptedData = CryptoService.encrypt(input);

            assert.strictEqual(typeof encryptedData, 'object');
            assert.strictEqual(typeof encryptedData.iv, 'string');
            assert.strictEqual(typeof encryptedData.encryptedData, 'string');
        });

        it('should return empty string if input is empty', () => {
            const encryptedData = CryptoService.encrypt('');

            assert.strictEqual(typeof encryptedData, 'object');
            assert.strictEqual(encryptedData.iv, undefined);
            assert.strictEqual(encryptedData.encryptedData, undefined);
        });
    });

    describe('decrypt', () => {
        it('should decrypt encrypted data', () => {
            const input = 'Hello, world!';
            const encryptedData = CryptoService.encrypt(input);
            const decryptedData = CryptoService.decrypt(encryptedData);

            assert.strictEqual(decryptedData, input);
        });

        it('should return empty string if input is empty', () => {
            const decryptedData = CryptoService.decrypt('');

            assert.strictEqual(decryptedData, '');
        });

        it('should return empty string if input is invalid', () => {
            const errorStub = sinon.stub(LoggerService, 'error');

            const input = { iv: '1234567890', encryptedData: 'abcdef1234567890' };
            const decryptedData = CryptoService.decrypt(input);

            console.log("decryptedData", decryptedData);

            assert.strictEqual(decryptedData, '');

            sinon.restore();
        });
    });
});
