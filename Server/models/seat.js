const {DataTypes} = require('sequelize');
const {sequelize} = require('../connectDB');

const Seat = sequelize.define('seat', {

    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    seatNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    isBooked: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    busId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'buses', 
            key: 'id'
        }
    },
    passengerId: {
        type: DataTypes.INTEGER,
        allowNull: true, 
        references: {
            model: 'passengers',
            key: 'id'
        }
    }

}, {timestamps: true});

module.exports = Seat;