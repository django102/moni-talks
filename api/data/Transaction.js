const { DataTypes } = require('sequelize');
const { TransactionStatus, TransactionType } = require('../enums');

module.exports = (sequelize) => {
    const transaction = sequelize.define('transaction', {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true
        },
        reference: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        account: {
            type: DataTypes.STRING,
            allowNull: false
        },
        amount: {
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        type: {
            type: DataTypes.ENUM(Object.values(TransactionType)),
            allowNull: false,
            defaultValue: TransactionType.GENERAL
        },
        narration: {
            type: DataTypes.STRING,
        },
        acquirerReference: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM(Object.values(TransactionStatus)),
            allowNull: false,
            defaultValue: TransactionStatus.PENDING
        }
    },
        {
            tableName: 'transactions'
        }
    );

    return transaction;
}