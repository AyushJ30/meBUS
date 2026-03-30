const {getUser} = require('../services/auth');
const {ApiError} = require('../utilities/ApiError');
const {catchAsync} = require('../utilities/catchAsync');

const checkAuthentication = catchAsync(function (req, res, next){

    const isAdminRoute = req.originalUrl.startsWith('/admin');

    const token = isAdminRoute ? req.cookies['admin-token'] : req.cookies.token;

    if(!token){
        if (isAdminRoute) {
            return res.redirect('/');
        }

        throw new ApiError(401, "No login token found");
    }

    const user = getUser(token);

    if(!user){
        if (isAdminRoute) {
            return res.redirect('/');
        }

        throw new ApiError(401, "Empty Token")
    }

    req.user = user;
    next();
});

function restrictTo(roles){
    return function (req, res, next){
        if(!req.user){
            throw new ApiError(401, "No user found");
        }

        if(!roles.includes(req.user.role)){
            throw new ApiError(401, "Un-Authorized Access");
        }

        next();
    }
}

module.exports = {
    checkAuthentication,
    restrictTo
}