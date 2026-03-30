const {sequelize} = require('../connectDB');
const {DataTypes} = require('sequelize');

const User = sequelize.define('user', {
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
        unique: true, 
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    }, 
    phone: {
        type: DataTypes.BIGINT,
        allowNull: false,
        unique: true,
    }, 
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'User',
    }, 
    fileName: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {timestamps: true});

module.exports = User;