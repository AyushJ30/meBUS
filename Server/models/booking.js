const {sequelize} = require('../connectDB');
const {DataTypes} = require('sequelize');

const Booking = sequelize.define('booking', {

    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        }
    },
    busId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'buses',
            key: 'id',
        }
    },
    passengerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'passengers',
            key: 'id',
        }
    },
    cancellation: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    insurance: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    totalAmount:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    pnr: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    travelDate:{
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    }

}, {timestamps: true});


module.exports = Booking;