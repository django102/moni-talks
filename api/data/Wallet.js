const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const wallet = sequelize.define('wallet', {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true
        },
        userId: {
            type: DataTypes.BIGINT,
        },
        accountNumber: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        virtualAccountNumber: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        virtualAccountBankCode: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
    },
        {
            tableName: 'wallets'
        }
    );

    return wallet;
}