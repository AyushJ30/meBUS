
function catchAsync(fn){
    return function (req, res, next){
        Promise.resolve(fn(req, res, next)).catch(function(err){ 
            next(err)
        });
    };
};

module.exports = {
    catchAsync,
}