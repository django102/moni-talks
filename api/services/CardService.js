const MaskData = require('maskdata');
const { default: CreditCardGenerator } = require("@mihnea.dev/credit-card-generator");

const { Card } = require('../models');
const CryptoService = require('./CryptoService');
const LoggerService = require('./LoggerService');

const maskCardOptions = {
    // Character to mask the data. The default value is '*'
    maskWith: "*",

    // Should be positive Integer
    // If the starting 'n' digits need to be visible/unmasked
    // Default value is 4
    unmaskedStartDigits: 6,

    // Should be positive Integer
    // If the ending 'n' digits need to be visible/unmasked
    // Default value is 1. 
    unmaskedEndDigits: 4
};


const CardService = {
    create: async (userId) => {
        if (!userId) {
            throw new Error('No user found');
        }

        const card = CardService.generateCardInformation();
        const { number, expiry, cvv2: cvv } = card;

        const maskedNumber = CardService.maskCardInformation(number);
        if (!maskedNumber) {
            LoggerService.error('Could not mask card number at this time');
            throw new Error('Error occurred while creating card');
        }

        const first6 = number.slice(0, 6);
        const last4 = number.slice(-4)
        const expMonth = expiry.month;
        const expYear = expiry.year;

        const encryptedCardInformation = CryptoService.encrypt(number);
        const fingerprint = encryptedCardInformation.encryptedData;
        const key = encryptedCardInformation.iv;

        const cardInformation = {
            userId,
            fingerprint,
            key,
            brand: 'VISA',
            first6,
            last4,
            expMonth,
            expYear,
            cvv,
            maskedPan: maskedNumber
        };

        const createdCard = await Card.create(cardInformation);
        if (!createdCard) {
            throw new Error('Could not create card at the moment');
        }

        return {
            maskedPan: maskedNumber,
            first6,
            last4,
            expMonth,
            expYear,
            cvv
        };
    },

    getCards: async (userId) => {
        if (!userId) {
            throw new Error('Invalid User');
        }

        const cards = await Card.findAll({ where: { userId } });

        cards.forEach(card => {
            delete card.fingerprint;
            delete card.key;
            delete card.userId;
            delete card.first6;
            delete card.last4;
            delete card.cvv;
        });

        return cards;
    },

    getCardInformation: async (id, showfullInformation = false) => {
        if (!id) {
            throw new Error('Card identifier not found');
        }

        const card = await Card.findOne({ where: { id, isDeleted: false } });
        if (!card) {
            throw new Error('Card does not exist');
        }

        const returnCard = { maskedPan, expMonth, expYear, cvv, isActive } = card;

        if (!showfullInformation) {
            return returnCard;
        }

        const cp = CryptoService.decrypt({ iv: card.key, encryptedData: card.fingerprint });
        returnCard.number = cp;

        return returnCard;
    },

    verifyCardInformation: async ({ pan, expiryMonth, expiryYear, cvv2 }) => {
        const encryptedCardInformation = CryptoService.encrypt(pan);
        const { iv, encryptedData } = encryptedCardInformation;

        const cardInformation = await Card.findOne({ where: { key: iv, fingerprint: encryptedData } });
        if (!cardInformation) {
            throw new Error('Invalid Card Details');
        }

        const { expMonth, expYear, cvv } = cardInformation;
        if (expMonth !== expiryMonth || expYear !== expiryYear || cvv !== cvv2) {
            throw new Error('Invalid Card Details');
        }

        return cardInformation;
    },

    generateCardInformation: () => {
        const carder = new CreditCardGenerator();
        const card = carder.generate_one();

        return card;
    },

    maskCardInformation: (cardNumber) => {
        if (!cardNumber)
            return '';

        const maskedNumber = MaskData.maskCard(cardNumber, maskCardOptions);
        return maskedNumber;
    }
}

module.exports = CardService;