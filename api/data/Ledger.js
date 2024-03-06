const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const ledger = sequelize.define('ledger', {
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
        credit: {
            type: DataTypes.DECIMAL,
            allowNull: false,
            defaultValue: 0.00
        },
        debit: {
            type: DataTypes.DECIMAL,
            allowNull: false,
            defaultValue: 0.00
        },
        narration: {
            type: DataTypes.STRING,
        },
        reversed: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue:false
        },
    },
        {
            tableName: 'ledger'
        }
    );

    return ledger;
}