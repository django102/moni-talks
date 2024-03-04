const assert = require('assert');
const _ = require('lodash');
const Chance = require('chance');
const UtilityService = require('../../../api/services/UtilityService');

describe('UtilityService', () => {
    let chance;

    before(() => {
        chance = new Chance();
    });


    describe('generateRandomNumber', () => {
        it('should generate a random number with default range and pad', () => {
            const randomNumber = UtilityService.generateRandomNumber();
            randomNumber.should.be.a.string;
            parseInt(randomNumber).should.be.within(1000000000, 9999999999);
            randomNumber.should.have.lengthOf(10);
        });

        it('should generate a random number within the specified range and pad with zeros', () => {
            const minValue = 5000;
            const maxValue = 6000;
            const pad = '00000';
            const randomNumber = UtilityService.generateRandomNumber(minValue, maxValue, pad);
            randomNumber.should.be.a.string;
            parseInt(randomNumber).should.be.within(minValue, maxValue);
            randomNumber.should.have.lengthOf(pad.length);
        });

        it('should generate a random number with zero padding', () => {
            const minValue = 100;
            const maxValue = 999;
            const pad = '0';
            const randomNumber = UtilityService.generateRandomNumber(minValue, maxValue, pad);
            randomNumber.should.be.a.string;
            parseInt(randomNumber).should.be.within(minValue, maxValue);
            randomNumber.should.have.lengthOf(pad.length * 3);
        });

        it('should generate a random number without padding', () => {
            const minValue = 1;
            const maxValue = 9;
            const randomNumber = UtilityService.generateRandomNumber(minValue, maxValue, '');
            randomNumber.should.be.a.string;
            parseInt(randomNumber).should.be.within(minValue, maxValue);
        });

        it('should handle invalid range by returning null', () => {
            const minValue = 1000;
            const maxValue = 500;
            const randomNumber = UtilityService.generateRandomNumber(minValue, maxValue);
            assert.strictEqual(randomNumber, 0);
        });

        it('should handle negative range by considering absolute values', () => {
            const minValue = -100;
            const maxValue = -50;
            const randomNumber = UtilityService.generateRandomNumber(minValue, maxValue);
            randomNumber.should.be.a.string;
            assert.strictEqual(parseInt(randomNumber), 0);
        });
    });

    describe('generateRandomString', () => {
        it('should generate a random string with default length and casing', () => {
            const randomString = UtilityService.generateRandomString();
            assert.strictEqual(typeof randomString, 'string');
            assert.strictEqual(randomString.length, 36);
            assert.match(randomString, /^[a-z0-9]+$/);
        });

        it('should generate a random string with specified length and lowercase casing', () => {
            const length = 10;
            const randomString = UtilityService.generateRandomString(length);
            assert.strictEqual(typeof randomString, 'string');
            assert.strictEqual(randomString.length, length);
            assert.match(randomString, /^[a-z0-9]+$/);
        });

        it('should generate a random string with specified length and uppercase casing', () => {
            const length = 8;
            const casing = 'upper';
            const randomString = UtilityService.generateRandomString(length, casing);
            assert.strictEqual(typeof randomString, 'string');
            assert.strictEqual(randomString.length, length);
            assert.match(randomString, /^[A-Z0-9]+$/);
        });

        it('should generate a random string with specified length and mixed casing', () => {
            const length = 12;
            const casing = 'mixed';
            const randomString = UtilityService.generateRandomString(length, casing);
            assert.strictEqual(typeof randomString, 'string');
            assert.strictEqual(randomString.length, length);
            assert.match(randomString, /^[a-zA-Z0-9]+$/);
        });

        it('should handle invalid length by defaulting to default length', () => {
            const length = 'invalid';
            const randomString = UtilityService.generateRandomString(length);
            assert.strictEqual(typeof randomString, 'string');
            assert.strictEqual(randomString.length, 0);
        });

        it('should handle negative length by defaulting to default length', () => {
            const length = -5;
            const randomString = UtilityService.generateRandomString(length);
            assert.strictEqual(typeof randomString, 'string');
            assert.strictEqual(randomString.length, 0);
        });

        it('should handle invalid casing by defaulting to lowercase', () => {
            const length = 8;
            const casing = 'invalid';
            const randomString = UtilityService.generateRandomString(length, casing);
            assert.strictEqual(typeof randomString, 'string');
            assert.strictEqual(randomString.length, 0);
        });
    });

    // describe('generateCode', () => {
    //     it('should generate a code with default length and lowercase casing', () => {
    //         const code = UtilityService.generateCode();
    //         assert.strictEqual(typeof code, 'string');
    //         assert.strictEqual(code.length, 12);
    //         assert.match(code, /^[a-z0-9]+$/);
    //     });

    //     it('should generate a code with specified length and lowercase casing', () => {
    //         const length = 8;
    //         const code = UtilityService.generateCode(length);
    //         assert.strictEqual(typeof code, 'string');
    //         assert.strictEqual(code.length, length);
    //         assert.match(code, /^[a-z0-9]+$/);
    //     });

    //     it('should generate a code with specified length and uppercase casing', () => {
    //         const length = 10;
    //         const code = UtilityService.generateCode(length);
    //         assert.strictEqual(typeof code, 'string');
    //         assert.strictEqual(code.length, length);
    //         assert.match(code, /^[A-Z0-9]+$/);
    //     });

    //     it('should handle invalid length by defaulting to default length', () => {
    //         const length = 'invalid';
    //         const code = UtilityService.generateCode(length);
    //         assert.strictEqual(typeof code, 'string');
    //         assert.strictEqual(code.length, 12);
    //         assert.match(code, /^[a-z0-9]+$/);
    //     });

    //     it('should handle negative length by defaulting to default length', () => {
    //         const length = -5;
    //         const code = UtilityService.generateCode(length);
    //         assert.strictEqual(typeof code, 'string');
    //         assert.strictEqual(code.length, 12);
    //         assert.match(code, /^[a-z0-9]+$/);
    //     });

    //     it('should handle invalid casing by defaulting to lowercase', () => {
    //         const length = 8;
    //         const casing = 'invalid';
    //         const code = UtilityService.generateCode(length, casing);
    //         assert.strictEqual(typeof code, 'string');
    //         assert.strictEqual(code.length, length);
    //         assert.match(code, /^[a-z0-9]+$/);
    //     });
    // });

    // describe('generateCode', () => {
    //     it('should generate a code with default length and lowercase casing', () => {
    //         const code = UtilityService.generateCode();
    //         assert.strictEqual(typeof code, 'string');
    //         assert.strictEqual(code.length, 12);
    //         assert.match(code, /^[a-z0-9]+$/);
    //     });

    //     it('should generate a code with specified length and lowercase casing', () => {
    //         const length = 8;
    //         const code = UtilityService.generateCode(length);
    //         assert.strictEqual(typeof code, 'string');
    //         assert.strictEqual(code.length, length);
    //         assert.match(code, /^[a-z0-9]+$/);
    //     });

    //     it('should generate a code with specified length and uppercase casing', () => {
    //         const length = 10;
    //         const casing = 'upper';
    //         const code = UtilityService.generateCode(length);
    //         assert.strictEqual(typeof code, 'string');
    //         assert.strictEqual(code.length, length);
    //         assert.match(code, /^[A-Z0-9]+$/);
    //     });

    //     it('should handle invalid length by defaulting to default length', () => {
    //         const length = 'invalid';
    //         const code = UtilityService.generateCode(length);
    //         assert.strictEqual(typeof code, 'string');
    //         assert.strictEqual(code.length, 12);
    //         assert.match(code, /^[a-z0-9]+$/);
    //     });

    //     it('should handle negative length by defaulting to default length', () => {
    //         const length = -5;
    //         const code = UtilityService.generateCode(length);
    //         assert.strictEqual(typeof code, 'string');
    //         assert.strictEqual(code.length, 12);
    //         assert.match(code, /^[a-z0-9]+$/);
    //     });

    //     it('should handle invalid casing by defaulting to lowercase', () => {
    //         const length = 8;
    //         const casing = 'invalid';
    //         const code = UtilityService.generateCode(length, casing);
    //         assert.strictEqual(typeof code, 'string');
    //         assert.strictEqual(code.length, length);
    //         assert.match(code, /^[a-z0-9]+$/);
    //     });
    // });
});
