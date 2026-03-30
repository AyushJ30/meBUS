const {sequelize} = require('../connectDB');
const {DataTypes} = require('sequelize');

const Country = sequelize.define('country', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    countryId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    }, 
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
}, {timestamps: true});

module.exports = Country; 