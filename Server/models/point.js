const {sequelize} = require('../connectDB');
const {DataTypes} = require('sequelize');

const Point = sequelize.define('point', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    }, 
    cityName: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: 'cities',
            key: 'name'
        },
    },
    point: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
    }, 
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    }
}, {timestamps: true});

module.exports = Point;