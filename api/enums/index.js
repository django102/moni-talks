module.exports = {
    TransactionStatus: Object.freeze({
        SUCCESS: 'SUCCESS',
        PENDING: 'PENDING',
        FAILED: 'FAILED',
        REVERSED: 'REVERSED'
    }),

    TransactionType: Object.freeze({
        ACCOUNT_FUNDING: 'ACCOUNT_FUNDING',
        BILL_PAYMENT: 'BILL_PAYMENT',
        TRANSFER: 'TRANSFER',
        CARD_PAYMENT: 'CARD_PAYMENT',
        GENERAL: 'GENERAL'
    }),

    StringCase: Object.freeze({
        LOWER: 'lower',
        UPPER: 'upper',
        MIXED: 'mixed'
    })
}