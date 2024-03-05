const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const card = sequelize.define('card', {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true
        },
        userId: {
            type: DataTypes.BIGINT,
        },
        fingerprint: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        key: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        brand:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        first6: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        last4: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        expMonth:{
            type: DataTypes.NUMBER,
            allowNull: false,
        },
        expYear:{
            type: DataTypes.NUMBER,
            allowNull: false,
        },
        cvv:{
            type: DataTypes.NUMBER,
            allowNull: false,
        },
        maskedPan: {
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
            tableName: 'cards'
        }
    );

    return card;
}