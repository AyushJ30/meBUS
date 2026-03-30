const {Op} = require('sequelize');
const {City} = require('../models/connect');
const {ApiResponse} = require('../utilities/ApiResponse');
const {ApiError} = require('../utilities/ApiError');
const {catchAsync} = require('../utilities/catchAsync');


const handleFetchOriginCities = catchAsync(async function (req, res){
        const originCities = await City.findAll({
            where: {
                status: true,
            }
        });
        
        if(!originCities){
            throw new ApiError(404, "No Cities Found");
        }

        return res.status(200).json(
            new ApiResponse(200, originCities, "Origin Cities fetched successfully")
        );

});

const handleFetchDestinationCities = catchAsync(async function (req, res){
    const {ID} = req.body;

        const destCities = await City.findAll({
            where: {
                status: true,
                id: {
                    [Op.not]: ID
                }
            }
        });

        if(!destCities){
            throw new ApiError(404, "No Cities Found");
        }
        
        return res.status(200).json(
            new ApiResponse(200, destCities, "Destination Cities fetched successfully")
        );
});


module.exports = {
    handleFetchOriginCities,
    handleFetchDestinationCities,
}