const { Sequelize, Op } = require('sequelize');
const {Country, State, City, Point, Bus} = require('../models/connect');
const {catchAsync} = require('../utilities/catchAsync');
const { ApiError } = require('../utilities/ApiError');
const {ApiResponse} = require('../utilities/ApiResponse');

const handleChangeCountryStatus= catchAsync(async function (req,res){
    const ID = req.params.id;

        await Country.update({
            status: Sequelize.literal('NOT status'),
        }, {
            where: {
                id: ID,
            }
        });

        
        return res.status(200).json({ success: true });
    
});

const handleChangeStateStatus = catchAsync(async function (req,res){
    const ID = req.params.id;

        await State.update({
            status: Sequelize.literal('NOT status'),
        }, {
            where: {
                id: ID,
            }
        });
        return res.status(200).json({ success: true });
});

const handleChangeCityStatus = catchAsync(async function (req,res){
    const ID = req.params.id;

        await City.update({
            status: Sequelize.literal('NOT status'),
        }, {
            where: {
                id: ID,
            }
        });

        return res.status(200).json({ success: true });
});

const handleChangePointStatus = catchAsync(async function (req,res){
    const ID = req.params.id;

        await Point.update({
            status: Sequelize.literal('NOT status'),
        }, {
            where: {
                id: ID,
            }
        });

        return res.status(200).json({ success: true });
});

const fetchActiveOriginCities = catchAsync(async function (req, res){
    
    const cities = await City.findAll({
        where: {
            status: true
        }
    });

    if(!cities || cities.length === 0){
        throw new ApiError(404, "No active Origin Cities found");
    }

    return res.status(200).json(
        new ApiResponse(200, cities, "Origin Cities fetched successfully")
    );
});

const fetchActiveDestinationCities = catchAsync(async function (req, res){
    const originID = req.params.id;

    if (!originID || isNaN(originID)) {
        const cities = await City.findAll({
            where: {
                status: true,
            }
        });

        if(!cities || cities.length === 0){
            throw new ApiError(404, "No Active Destination Cities Found");
        }

        return res.status(200).json(
            new ApiResponse(200, cities, "Destination Cities fetched successfully")
        );
    }

    const cities = await City.findAll({
        where:{
            status: true,
            id: {
                [Op.ne]: originID,
            }
        }
    });

    if(!cities || cities.length === 0){
        throw new ApiError(404, "No Active Destination Cities Found");
    }

    return res.status(200).json(
        new ApiResponse(200, cities, "Destination Cities fetched successfully")
    );
});

const handleChangeBusStatus = catchAsync(async function(req, res){
    const ID = req.params.id;

        await Bus.update({
            status: Sequelize.literal('NOT status'),
        }, {
            where: {
                id: ID,
            }
        });

        return res.status(200).json({ success: true });
});

module.exports = {
    handleChangeCountryStatus,
    handleChangeStateStatus,
    handleChangeCityStatus,
    handleChangePointStatus,
    fetchActiveOriginCities,
    fetchActiveDestinationCities,
    handleChangeBusStatus
}