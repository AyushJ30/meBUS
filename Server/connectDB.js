require('dotenv').config();
const {Sequelize} = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS,{
    host: 'localhost',
    dialect: 'mysql',
    timezone: '+05:30'
});

async function connectToDB(){
    try{
        sequelize.authenticate();
        console.log('Successfully connected to MySQL');
    } catch(err){
        console.log('Error while connecting to MySQL: ', err);
    }
}

module.exports = {
    sequelize,
    connectToDB
} 