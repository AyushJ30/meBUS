const {ApiError} = require('../utilities/ApiError');

function errorHandler(err, req, res, next){
    let error = err;

    if(!(error instanceof ApiError)){
        const statusCode = error.statusCode ? error.statusCode : 500;
        const message = error.message || "Internal Server Error";
        error = new ApiError(statusCode, message, error?.errors || []);
    }

    const response = {
        success: error.success,
        statusCode: error.statusCode,
        message: error.message,
        errors: error.errors,
    }

    return res.status(error.statusCode).json(response);
}

module.exports = {
    errorHandler
}