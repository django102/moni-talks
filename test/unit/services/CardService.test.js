const assert = require('assert');
const sinon = require('sinon');
const { Card } = require('../../../api/models');
const CryptoService = require('../../../api/services/CryptoService');
const LoggerService = require('../../../api/services/LoggerService');
const { default: CreditCardGenerator } = require("@mihnea.dev/credit-card-generator");
const CardService = require('../../../api/services/CardService');

describe('CardService', () => {
    describe('create', () => {
        it('should create a card for the user', async () => {
            const userId = 123;
            const cardData = {
                number: '1234567890123456',
                expiry: { month: 12, year: 25 },
                cvv2: '123'
            };
            const maskedNumber = '123456******3456';
            const encryptedData = { iv: 'abcdef1234567890', encryptedData: 'encryptedData' };

            sinon.stub(CardService, 'generateCardInformation').returns(cardData);
            sinon.stub(CardService, 'maskCardInformation').returns(maskedNumber);
            sinon.stub(CryptoService, 'encrypt').returns(encryptedData);
            sinon.stub(Card, 'create').resolves({});

            const createdCard = await CardService.create(userId);

            assert.deepStrictEqual(createdCard, {
                maskedPan: maskedNumber,
                first6: '123456',
                last4: '3456',
                expMonth: 12,
                expYear: 25,
                cvv: '123'
            });

            sinon.restore();
        });

        it('should throw error if no user ID provided', async () => {
            await assert.rejects(async () => {
                await CardService.create(null);
            }, { message: 'No user found' });
        });

        it('should throw error if masking card fails', async () => {
            sinon.stub(LoggerService, 'error');
            sinon.stub(CardService, 'generateCardInformation').returns({});
            sinon.stub(CardService, 'maskCardInformation').returns(null);

            await assert.rejects(async () => {
                await CardService.create(123);
            }, { message: 'Error occurred while creating card' });

            sinon.restore();
        });

        it('should throw error if card creation fails', async () => {
            const cardData = {
                number: '1234567890123456',
                expiry: { month: 12, year: 25 },
                cvv2: '123'
            };
            sinon.stub(CardService, 'generateCardInformation').returns(cardData);
            sinon.stub(CardService, 'maskCardInformation').returns('******7890');
            sinon.stub(CryptoService, 'encrypt').returns({ iv: 'abcdef1234567890', encryptedData: 'encryptedData' });
            sinon.stub(Card, 'create').resolves(null);

            await assert.rejects(async () => {
                await CardService.create(123);
            }, { message: 'Could not create card at the moment' });

            sinon.restore();
        });
    });

    describe('getCards', () => {
        it('should fetch cards for the user', async () => {
            const userId = 123;
            const mockCards = [{ id: 1, userId: 123, maskedPan: '****1234' }, { id: 2, userId: 123, maskedPan: '****5678' }];
            sinon.stub(Card, 'findAll').resolves(mockCards);

            const fetchedCards = await CardService.getCards(userId);

            assert.deepStrictEqual(fetchedCards, mockCards);

            sinon.restore();
        });

        it('should throw error if invalid user ID provided', async () => {
            await assert.rejects(async () => {
                await CardService.getCards(null);
            }, { message: 'Invalid User' });
        });
    });

    describe('getCardInformation', () => {
        it('should fetch card information without full information', async () => {
            const cardId = 1;
            const mockCard = { id: 1, maskedPan: '****1234', expMonth: 12, expYear: 25, cvv: '123', isActive: true };
            sinon.stub(Card, 'findOne').resolves(mockCard);

            const cardInfo = await CardService.getCardInformation(cardId);

            assert.deepStrictEqual(cardInfo, {
                maskedPan: '****1234',
                expMonth: 12,
                expYear: 25,
                cvv: '123',
                isActive: true,
                id: 1
            });

            sinon.restore();
        });

        it('should fetch card information with full information', async () => {
            const cardId = 1;
            const mockCard = { id: 1, maskedPan: '****1234', expMonth: 12, expYear: 25, cvv: '123', isActive: true, key: 'abcdef1234567890', fingerprint: 'encryptedData' };
            const decryptedNumber = '1234567890123456';
            sinon.stub(Card, 'findOne').resolves(mockCard);
            sinon.stub(CryptoService, 'decrypt').returns(decryptedNumber);

            const cardInfo = await CardService.getCardInformation(cardId, true);

            assert.deepStrictEqual(cardInfo, {
                maskedPan: '****1234',
                expMonth: 12,
                expYear: 25,
                cvv: '123',
                isActive: true,
                id: 1,
                number: '1234567890123456',
                key: 'abcdef1234567890',
                fingerprint: 'encryptedData'
            });

            sinon.restore();
        });

        it('should throw error if card identifier not found', async () => {
            await assert.rejects(async () => {
                await CardService.getCardInformation(null);
            }, { message: 'Card identifier not found' });
        });

        it('should throw error if card does not exist', async () => {
            const cardId = 999;
            sinon.stub(Card, 'findOne').resolves(null);

            await assert.rejects(async () => {
                await CardService.getCardInformation(cardId);
            }, { message: 'Card does not exist' });

            sinon.restore();
        });
    });

    describe('verifyCardInformation', () => {
        it('should verify card information successfully', async () => {
            const pan = '1234567890123456';
            const expiryMonth = 12;
            const expiryYear = 25;
            const cvv2 = '123';
            const encryptedData = { iv: 'abcdef1234567890', encryptedData: 'encryptedData' };
            const mockCard = { id: 1, expMonth: 12, expYear: 25, cvv: '123' };

            sinon.stub(CryptoService, 'encrypt').returns(encryptedData);
            sinon.stub(Card, 'findOne').resolves(mockCard);

            await CardService.verifyCardInformation({pan, expiryMonth, expiryYear, cvv2});

            sinon.restore();
        });

        it('should throw error if card details are invalid', async () => {
            const pan = '1234567890123456';
            const expiryMonth = 12;
            const expiryYear = 25;
            const cvv2 = '123';
            const encryptedData = { iv: 'abcdef1234567890', encryptedData: 'encryptedData' };
            const mockCard = { id: 1, expMonth: 12, expYear: 25, cvv: '456' };

            sinon.stub(CryptoService, 'encrypt').returns(encryptedData);
            sinon.stub(Card, 'findOne').resolves(mockCard);

            await assert.rejects(async () => {
                await CardService.verifyCardInformation({pan, expiryMonth, expiryYear, cvv2});
            }, { message: 'Invalid Card Details' });

            sinon.restore();
        });

        it('should throw error if card information not found', async () => {
            const pan = '1234567890123456';
            const expiryMonth = 12;
            const expiryYear = 25;
            const cvv2 = '123';
            const encryptedData = { iv: 'abcdef1234567890', encryptedData: 'encryptedData' };

            sinon.stub(CryptoService, 'encrypt').returns(encryptedData);
            sinon.stub(Card, 'findOne').resolves(null);

            await assert.rejects(async () => {
                await CardService.verifyCardInformation({pan, expiryMonth, expiryYear, cvv2});
            }, { message: 'Invalid Card Details' });

            sinon.restore();
        });
    });

    describe('generateCardInformation', () => {
        it('should generate card information', () => {
            const carderStub = sinon.stub(CreditCardGenerator.prototype, 'generate_one').returns({
                number: '1234567890123456',
                expiry: { month: 12, year: 25 },
                cvv2: '123'
            });

            const generatedCard = CardService.generateCardInformation();

            assert.deepStrictEqual(generatedCard, {
                number: '1234567890123456',
                expiry: { month: 12, year: 25 },
                cvv2: '123'
            });

            carderStub.restore();
        });
    });

    describe('maskCardInformation', () => {
        it('should mask card number', () => {
            const cardNumber = '1234567890123456';
            const maskedNumber = CardService.maskCardInformation(cardNumber);

            assert.strictEqual(maskedNumber, '123456******3456');
        });

        it('should return empty string for empty card number', () => {
            const maskedNumber = CardService.maskCardInformation('');

            assert.strictEqual(maskedNumber, '');
        });

        it('should return empty string for null card number', () => {
            const maskedNumber = CardService.maskCardInformation(null);

            assert.strictEqual(maskedNumber, '');
        });

        it('should return empty string for undefined card number', () => {
            const maskedNumber = CardService.maskCardInformation();

            assert.strictEqual(maskedNumber, '');
        });
    });
});
