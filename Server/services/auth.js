require('dotenv').config();
const jwt = require('jsonwebtoken');
const secret = process.env.SECRET;

function setUser(user){
    const token = jwt.sign({
        id: user.id,
        name: user.name,
        role: user.role
    }, secret);

    return token;
}


function getUser(token){
    if(!token){
        return null;
    }
    try{
        return jwt.verify(token, secret);
    } catch(err){
        console.log('Error while getting user from token: ', err);
        return null;
    }
}

module.exports = {
    setUser,
    getUser
} 