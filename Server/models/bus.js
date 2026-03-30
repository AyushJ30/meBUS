const {sequelize} = require('../connectDB');
const {DataTypes} = require('sequelize');

const Bus = sequelize.define('bus', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    origin: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: 'cities',
            key: 'name'
        },
    }, 
    destination: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: 'cities',
            key: 'name'
        },
    }, 
    start: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    duration: {
        type: DataTypes.TIME,
        allowNull: false,
    }, 
    fare: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }, 
    totalSeats:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    avlSeats: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }, 
    finalPrice: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }, 
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    }
}, {timestamps: true});

module.exports = Bus;