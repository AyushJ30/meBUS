const express = require('express');

const {restrictTo} = require('../middleware/auth');
const { handleAdminRegister, handleAdminRegisterPage, handleCountryAddPage, handleStateAddPage, handleBookingPage,
        handleCityAddPage, handlePointAddPage, handleBusAddPage, handleTablePage, handleAdminLogout, handleFetchBusEditPage} = require('../controllers/admin');

const {handleChangeCountryStatus, handleChangeStateStatus, handleChangeCityStatus, handleChangePointStatus, handleChangeBusStatus} = require('../controllers/activeLocation');
const {handleAppendCountry, handleAppendState, handleAppendCity, handleAppendPoint} = require('../controllers/location');
const {handleAddBus, handleEditBusDetails} = require('../controllers/bus');
const {handleChangeBookingStatus} = require('../controllers/booking');

const router = express.Router();

router.route('/register')
    .get(handleAdminRegisterPage)
    .post(restrictTo(['Admin']), handleAdminRegister);

router.route('/country')
    .get(restrictTo(['Admin']), handleCountryAddPage);

router.route('/state')
    .get(restrictTo(['Admin']), handleStateAddPage);

router.route('/city')
    .get(restrictTo(['Admin']), handleCityAddPage);

router.route('/point')
    .get(restrictTo(['Admin']), handlePointAddPage);

router.route('/bus')
    .get(restrictTo(['Admin']), handleBusAddPage);

router.route('/country')
    .post(restrictTo(['Admin']), handleAppendCountry);

router.route('/state')
    .post(restrictTo(['Admin']), handleAppendState);

router.route('/city')
    .post(restrictTo(['Admin']), handleAppendCity);

router.route('/point')
    .post(restrictTo(['Admin']), handleAppendPoint);

router.route('/bus-register')
    .post(restrictTo(['Admin']), handleAddBus);

router.route('/')
    .get(restrictTo(['Admin', 'User']), handleTablePage);

router.route('/country/:id')
    .patch(restrictTo(['Admin']), handleChangeCountryStatus);

router.route('/state/:id')
    .patch(restrictTo(['Admin']), handleChangeStateStatus);

router.route('/city/:id')
    .patch(restrictTo(['Admin']), handleChangeCityStatus);

router.route('/point/:id')
    .patch(restrictTo(['Admin']), handleChangePointStatus);

router.route('/bus/:id')
    .get(restrictTo(['Admin']), handleFetchBusEditPage)
    .patch(restrictTo(['Admin']), handleChangeBusStatus);

router.route('/booking/:id')
    .patch(restrictTo(['Admin']), handleChangeBookingStatus);

router.route('/logout')
    .get(restrictTo(['Admin']), handleAdminLogout);

router.route('/booking')
    .get(restrictTo(['Admin']), handleBookingPage);

router.route('/bus-edit/:id')
    .post(restrictTo(['Admin']), handleEditBusDetails)

module.exports = router;