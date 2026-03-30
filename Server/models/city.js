const {sequelize} = require('../connectDB');
const {DataTypes} = require('sequelize');

const City = sequelize.define('city', {
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
            key: 'countryId',
        }
    },
    stateId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: 'states',
            key: 'stateId',
        }
    }, 
    name: {
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


module.exports = City;