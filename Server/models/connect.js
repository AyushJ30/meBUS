const {sequelize} = require('../connectDB');
const Country = require('./country');
const State = require('./state');;
const City = require('./city');
const User = require('./user');
const Bus = require('./bus');
const Point = require('./point');
const Passenger = require('./passenger');
const Booking = require('./booking');
const Seat = require('./seat');
const Day = require('./day');

Country.hasMany(State, {foreignKey: 'countryId', onDelete: 'CASCADE'});
State.belongsTo(Country, {foreignKey: 'countryId'});

State.hasMany(City, {foreignKey: 'stateId', onDelete: 'CASCADE'});
City.belongsTo(State, {foreignKey: 'stateId'});

City.hasMany(Point, {foreignKey: 'cityName', onDelete: 'CASCADE'});
Point.belongsTo(City, {foreignKey: 'cityName'});

User.hasMany(Booking, {foreignKey: 'userId', onDelete: 'CASCADE'});
Booking.belongsTo(User, {foreignKey: 'userId'});

Bus.hasMany(Passenger, {foreignKey: 'busId', onDelete: 'CASCADE'});
Passenger.belongsTo(Bus, {foreignKey: 'busId'});

Bus.hasMany(Seat, {foreignKey: 'busId', onDelete: 'CASCADE'});
Seat.belongsTo(Bus, {foreignKey: 'busId'});

Passenger.hasOne(Seat, {foreignKey: 'passengerId'});
Seat.belongsTo(Passenger, {foreignKey: 'passengerId'});

Booking.belongsTo(Bus, {foreignKey: 'busId'});
Bus.hasMany(Booking, {foreignKey: 'busId'});

Booking.belongsTo(Passenger, { foreignKey: 'passengerId', as: 'passenger' });
Passenger.hasOne(Booking, { foreignKey: 'passengerId', as: 'booking' });

Bus.hasOne(Day, {foreignKey: 'busId', as: 'schedule', onDelete: 'CASCADE' });
Day.belongsTo(Bus, {foreignKey: 'busId', as: 'bus'});

module.exports = {
    Country, 
    State,
    City,
    Point,
    Bus,
    Passenger,
    User,
    Booking,
    Seat,
    Day
}