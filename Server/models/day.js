const {DataTypes} = require('sequelize');
const {sequelize} = require('../connectDB');

const Day = sequelize.define('day', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    }, 
    busId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'buses',
            key: 'id'
        },
        allowNull: false,
    },
    sun: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    mon: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    tue: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    wed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    thu: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    fri: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    sat: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    }
}, {timestamps: true});

module.exports = Day;