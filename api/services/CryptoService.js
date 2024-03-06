const crypto = require('crypto');
const LoggerService = require('./LoggerService');
const algorithm = 'aes-256-cbc'; //Using AES encryption
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

const CryptoService = {
    encrypt: (input) => {
        if (!input) {
            return {};
        }

        const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
        let encrypted = cipher.update(input);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
    },

    decrypt: (input) => {
        if (!input || !input.iv || !input.encryptedData) {
            return '';
        }

        try {
            let iv = Buffer.from(input.iv, 'hex');
            let encryptedText = Buffer.from(input.encryptedData, 'hex');
            let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
            let decrypted = decipher.update(encryptedText);
            decrypted = Buffer.concat([decrypted, decipher.final()]);
            return decrypted.toString();
        } catch (err) {
            LoggerService.error(err);
            return '';
        }
    }
};

module.exports = CryptoService;