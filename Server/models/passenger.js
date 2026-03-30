const {sequelize} = require('../connectDB');
const {DataTypes} = require('sequelize');

const Passenger = sequelize.define('passenger', {
     id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    }, 
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    gender: {
        type: DataTypes.STRING,
        allowNull: false,
    }, 
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
    },
    phone: {
        type: DataTypes.BIGINT,
        allowNull: false,
        unique: false,
    }, 
    busId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'buses',
            key: 'id',
        }
    },
    board: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: 'points',
            key: 'point'
        }
    },
    drop: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: 'points',
            key: 'point'
        }
    },
    seatNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    }
}, {timestamps: true});

module.exports = Passenger;