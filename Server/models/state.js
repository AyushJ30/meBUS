const {sequelize} = require('../connectDB');
const {DataTypes} = require('sequelize');

const State = sequelize.define('state', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    }, 
    countryId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: 'countries',
            key: 'countryId'
        }   
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    stateId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    }, 
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    }
}, {timestamps: true});

module.exports = State;