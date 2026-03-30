const {Country, State, City, Point} = require('../models/connect');
const {catchAsync} = require('../utilities/catchAsync');
const {ApiError} = require('../utilities/ApiError');
const {createID} = require('../services/idCreate');

const handleAppendCountry = catchAsync(async function (req, res){
    const body = req.body;

    if(!body.Name){
        return res.status(400).render('country', {
            errorMessage: "Missing Country Name"
        });
    }

    const CountryID = createID(body.Name);

        await Country.create({
            name: body.Name,
            countryId: CountryID,
        });
        
        return res.redirect('/admin/country');
});

const handleAppendState = catchAsync(async function (req, res){
    const body = req.body;

    if(!body.Name || !body.CountryID){
        return res.status(400).render('country', {
            errorMessage: "Missing Fields"
        });
    }

    console.log(body.CountryID);

    const StateID = createID(body.Name);

        await State.create({
            countryId: body.CountryID,
            name: body.Name,
            stateId: StateID,
        });

        return res.redirect('/admin/state');

});

const handleAppendCity = catchAsync(async function (req, res){
    const body = req.body;

    if(!body.Name || !body.CountryID || !body.StateID){
        return res.status(400).render('country', {
            errorMessage: "Missing Fields"
        });
    }

        await City.create({
            countryId: body.CountryID,
            stateId: body.StateID,
            name: body.Name,
        });

        return res.redirect('/admin/city');
});

const handleAppendPoint = catchAsync(async function (req, res){
    const body = req.body;

        await Point.create({
            cityName: body.City,
            point: body.Point,
            type: body.Type,
        });

        return res.redirect('/admin/point');
});


module.exports = {
    handleAppendCountry,
    handleAppendState,
    handleAppendCity,
    handleAppendPoint,
}